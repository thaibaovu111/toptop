import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerMetadata } from './entities/banner.entity';
import { BaseErrorResponse, BaseResponse } from 'src/common';
import { MESSAGE, MESSAGE_ERROR, STATUSCODE } from 'src/constants';
import { Express } from 'express';
import { existsSync, unlinkSync } from 'fs';
import { BaseTracking } from 'src/models';
import * as moment from 'moment';

@Injectable()
export class BannerService {
    constructor(
        @InjectModel(Banner.name)
        private readonly model: Model<Banner>
    ) {}

    async getById(id: string) {
        return await this.model.findById(id);
    }

    async deleteById(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async updateById<T>(id: string, banner: T) {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: banner },
            { new: true }
        );
    }

    async create(
        userId: string,
        createBannerDto: CreateBannerDto,
        file: Express.Multer.File
    ) {
        const image = {
            name: file.filename,
            url: `${process.env.URL_DOMAIN_SERVER}/image/${file.filename}`
        };
        const metadata: BannerMetadata = {
            title: createBannerDto.title,
            description: '',
            image
        };
        createBannerDto.metadata = metadata;
        createBannerDto.imageUrl = image.url;
        try {
            const withTracking: CreateBannerDto & BaseTracking = {
                ...createBannerDto,
                createdAt: moment().toDate(),
                createdBy: userId,
                updatedBy: null,
                updatedAt: null
            };
            const banner = await this.model.create(withTracking);
            return new BaseResponse(
                STATUSCODE.BANNER_CREATE_SUCCESS_120,
                banner,
                MESSAGE.CREATE_SUCCESS
            );
        } catch (error) {
            unlinkSync(`./public/image/${image.name}`);
            throw new BadRequestException(MESSAGE_ERROR.CREATE_FAILED);
        }
    }

    async paginateBanner(offset: number, limit: number) {
        try {
            const banners = await this.model.find().skip(offset).limit(limit);
            return new BaseResponse(
                STATUSCODE.BANNER_LIST_SUCCESS_128,
                banners,
                'success'
            );
        } catch (error) {
            throw new BadRequestException('get banners error');
        }
    }

    async getBannerById(id: string) {
        try {
            const banner = await this.getById(id);
            if (!banner) {
                return new BaseErrorResponse(STATUSCODE.BANNER_NOT_FOUND_1210);
            }
            return new BaseResponse(
                STATUSCODE.BANNER_READ_SUCCESS_124,
                banner,
                'success'
            );
        } catch (error) {
            throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
        }
    }

    async update(
        updatedBy: string,
        id: string,
        updateBannerDto: UpdateBannerDto,
        file: Express.Multer.File
    ) {
        try {
            const banner = await this.getById(id);
            if (!banner) {
                return new BaseErrorResponse(
                    STATUSCODE.BANNER_NOT_FOUND_1210,
                    MESSAGE_ERROR.NOT_FOUND
                );
            }

            if (file) {
                const image = {
                    name: file.filename,
                    url: `${process.env.URL_DOMAIN_SERVER}/image/${file.filename}`
                };
                if (
                    banner.metadata &&
                    banner.metadata.image &&
                    banner.metadata.image.name
                ) {
                    const pathLocation = `./public/image/${banner.metadata.image.name}`;
                    const isExisted = existsSync(pathLocation);
                    if (isExisted) {
                        unlinkSync(
                            `./public/image/${banner.metadata.image.name}`
                        );
                    }

                    const metadata = {
                        ...banner.metadata,
                        title: updateBannerDto.title || banner.metadata.title,
                        image
                    };
                    updateBannerDto.metadata = metadata;
                    updateBannerDto.imageUrl = image.url;
                } else {
                    const metadata: BannerMetadata = {
                        title: updateBannerDto.title || banner.title,
                        description: '',
                        image
                    };

                    updateBannerDto.metadata = metadata;
                    updateBannerDto.imageUrl = image.url;
                }
            }

            const updateWithTracking: UpdateBannerDto & BaseTracking = {
                ...updateBannerDto,
                updatedAt: moment().toDate(),
                updatedBy
            };

            const newBanner = await this.updateById(id, updateWithTracking);
            return new BaseResponse(
                STATUSCODE.BANNER_UPDATE_SUCCESS_122,
                newBanner,
                'success'
            );
        } catch (error) {
            console.log(error);
            if (file) {
                unlinkSync(`./public/image/${file.filename}`);
            }
            throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
        }
    }

    async remove(id: string) {
        try {
            const banner = await this.getById(id);
            if (!banner) {
                return new BaseErrorResponse(STATUSCODE.BANNER_NOT_FOUND_1210);
            }
            if (
                banner.metadata &&
                banner.metadata.image &&
                banner.metadata.image.name
            ) {
                const pathLocation = `./public/image/${banner.metadata.image.name}`;
                const isExisted = existsSync(pathLocation);
                if (isExisted) {
                    unlinkSync(`./public/image/${banner.metadata.image.name}`);
                }
            }
            await this.deleteById(id);
            return new BaseResponse(
                STATUSCODE.BANNER_DELETE_SUCCESS_126,
                null,
                'success'
            );
        } catch (error) {
            throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
        }
    }
}
