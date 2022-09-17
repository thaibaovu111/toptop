import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TagDto, TagUpdateDto } from './dto';
import { Tag } from './model/tag.schema';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { MESSAGE, MESSAGE_ERROR, STATUSCODE } from 'src/constants';
import { BaseErrorResponse, BaseResponse } from 'src/common';
import { BaseTracking } from 'src/models';
import * as moment from 'moment';

@Injectable()
export class TagService {
    constructor(
        @InjectModel(Tag.name)
        private readonly tagModel: Model<Tag>
    ) {}

    public async findTagsPaginate(paginationQuery: PaginationQueryDto) {
        try {
            const { limit, offset } = paginationQuery;
            const tags = await this.tagModel.find().skip(offset).limit(limit);
            return new BaseResponse(
                STATUSCODE.TAG_LIST_SUCCESS_105,
                tags,
                'Get list tag successfully'
            );
        } catch (err) {
            throw new BadRequestException('Get list tag failed');
        }
    }

    async getTagById(tagId: string) {
        return await this.tagModel.findById(tagId);
    }

    async updateTag<T>(tagId: string, tagUpdate: T) {
        return this.tagModel.findByIdAndUpdate(
            { _id: tagId },
            { $set: tagUpdate },
            { new: true }
        );
    }

    async deleteTagById(tagId: string) {
        return await this.tagModel.findByIdAndDelete(tagId);
    }

    public async create(userId: string, tagDto: TagDto) {
        try {
            const withTracking: TagDto & BaseTracking = {
                ...tagDto,
                createdAt: moment().toDate(),
                createdBy: userId
            };
            const tag = await this.tagModel.create(withTracking);
            return new BaseResponse(
                STATUSCODE.TAG_CREATE_SUCCESS_101,
                tag,
                MESSAGE.CREATE_SUCCESS
            );
        } catch (err) {
            throw new BadRequestException(MESSAGE_ERROR.CREATE_FAILED);
        }
    }

    public async update(
        userId: string,
        tagId: string,
        tagUpdateDto: TagUpdateDto
    ) {
        try {
            const tag = await this.getTagById(tagId);
            if (!tag) {
                return new BaseErrorResponse(
                    STATUSCODE.TAG_NOT_FOUND_109,
                    MESSAGE_ERROR.NOT_FOUND
                );
            }

            const withTracking: TagUpdateDto & BaseTracking = {
                ...tagUpdateDto,
                updatedAt: moment().toDate(),
                updatedBy: userId
            };

            const newTag = await this.updateTag(tagId, withTracking);
            return new BaseResponse(
                STATUSCODE.TAG_UPDATE_SUCCESS_103,
                newTag,
                MESSAGE.UPDATE_SUCCESS
            );
        } catch (err) {
            throw new BadRequestException(MESSAGE_ERROR.UPDATE_FAILED);
        }
    }

    async deleteTag(tagId: string) {
        try {
            const tag = await this.getTagById(tagId);
            if (!tag) {
                return new BaseErrorResponse(
                    STATUSCODE.TAG_NOT_FOUND_109,
                    MESSAGE_ERROR.NOT_FOUND
                );
            }
            await this.deleteTagById(tagId);
            return new BaseResponse(
                STATUSCODE.TAG_DELETE_SUCCESS_107,
                null,
                MESSAGE.DELETE_SUCCESS
            );
        } catch (err) {
            throw new BadRequestException(MESSAGE_ERROR.DELETE_FAILED);
        }
    }

    async getTag(tagId: string) {
        try {
            const tag = await this.getTagById(tagId);
            if (!tag) {
                return new BaseErrorResponse(
                    STATUSCODE.TAG_NOT_FOUND_109,
                    MESSAGE_ERROR.NOT_FOUND
                );
            }
            return new BaseResponse(
                STATUSCODE.TAG_DELETE_SUCCESS_107,
                tag,
                MESSAGE.DELETE_SUCCESS
            );
        } catch (err) {
            throw new BadRequestException(MESSAGE_ERROR.NOT_FOUND);
        }
    }
}
