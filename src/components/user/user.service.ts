import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto, UpdateUserDto, AvataDto } from './dto';
import { User } from 'src/entities';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../video/dto/pagination.query.dto';
import { JwtService } from '../../common';
import { MESSAGE, MESSAGE_ERROR, STATUSCODE } from '../../constants';
import { BaseErrorResponse, BaseResponse } from '../../common';
import { UserDto as UserCreateDto } from '../../models';
import { readFileSync, unlinkSync, existsSync } from 'fs';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class UserService {
    constructor(
        private readonly jwt: JwtService,
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private httpAdapterHost: HttpAdapterHost
    ) {}

    async findUserById(id: string) {
        return await this.userModel.findById(id);
    }

    async findByEmail(email: string) {
        return await this.userModel
            .findOne({ email, notInSchema: 1 })
            .setOptions({ strictQuery: false });
    }

    async findByPhoneNumber(phone: string) {
        return await this.userModel.findOne({ phone });
    }

    async create(user: UserCreateDto) {
        return await this.userModel.create({ ...user, mac: [user.mac] });
    }

    async createUserByGGFb<T>(user: T) {
        return await this.userModel.create(user);
    }

    async deleteUser(userId: string) {
        try {
            const user = await this.userModel.findById(userId);
            if (user) {
                if (user.metadata && user.metadata.name) {
                    const pathLocation = `./public/image/${user.metadata.name}`;
                    const isExisted = existsSync(pathLocation);
                    if (isExisted) {
                        unlinkSync(`./public/image/${user.metadata.name}`);
                    }
                }
                await this.userModel.findByIdAndDelete(userId);
                return new BaseResponse(
                    STATUSCODE.DELETE_USER_SUCCESS,
                    null,
                    MESSAGE.DELETE_SUCCESS
                );
            }
            return new BaseErrorResponse(
                STATUSCODE.USER_NOT_FOUND_400,
                MESSAGE_ERROR.USER_NOT_FOUND
            );
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async deleteAllUsers() {
        try {
            await this.userModel.deleteMany({});
            // for (const user of users) {
            //     this.userModel.findByIdAndDelete(user._id)
            // }
            return new BaseResponse(
                STATUSCODE.DELETE_ALL_USERS_SUCCESS_205,
                'Delete all users successfully'
            );
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async getUser(user: User) {
        try {
            const userInfo = await this.findUserById(user.id);
            if (!userInfo) {
                return new BaseErrorResponse(
                    STATUSCODE.USER_NOT_FOUND_400,
                    'User not found'
                );
            }
            return new BaseResponse(
                STATUSCODE.USER_READ_SUCCESS_407,
                userInfo,
                'Get user info successfully'
            );
        } catch (err) {
            return new BaseErrorResponse(
                STATUSCODE.USER_NOT_FOUND_400,
                'User not found'
            );
        }
    }

    async updateUser(
        userRequest: User,
        user: UserDto,
        file: Express.Multer.File
    ) {
        try {
            const userInfo = await this.findUserById(userRequest.id);
            if (file && userInfo) {
                const metadata = {
                    name: file.filename,
                    url: `${process.env.URL_DOMAIN_SERVER}/image/${file.filename}`
                };

                if (userInfo.metadata && userInfo.metadata.name) {
                    const pathLocation = `./public/image/${userInfo.metadata.name}`;
                    const isExisted = existsSync(pathLocation);
                    if (isExisted) {
                        unlinkSync(pathLocation);
                    }
                }

                user['metadata'] = metadata;
            }
            const userReceive = await this.userModel.findByIdAndUpdate(
                { _id: userRequest.id },
                user
            );
            if (!userReceive) {
                return new BaseErrorResponse(
                    STATUSCODE.USER_NOT_FOUND_400,
                    'User not found',
                    null
                );
            }
            return new BaseResponse(
                STATUSCODE.USER_UPDATE_SUCCESS_402,
                userReceive,
                'Update successfully'
            );
        } catch (err) {
            if (file) {
                const pathLocation = `./public/image/${file.filename}`;
                unlinkSync(pathLocation);
            }
            return new BaseErrorResponse(
                STATUSCODE.USER_NOT_FOUND_400,
                'User not found',
                null
            );
        }
    }

    async updateSomeField<T>(userRequest: User, user: T) {
        return await this.userModel.findByIdAndUpdate(
            { _id: userRequest.id },
            { $set: user },
            { new: true }
        );
    }

    async updateSomeFieldWithId<T>(_id: string, user: T) {
        return await this.userModel.findByIdAndUpdate(
            { _id },
            { $set: user },
            { new: true }
        );
    }

    public async findAll(paginationQuery: PaginationQueryDto): Promise<any> {
        const { limit, offset } = paginationQuery;

        const users = await this.userModel.find().skip(offset).limit(limit);
        return new BaseResponse(
            STATUSCODE.USER_LIST_SUCESS_409,
            users,
            `Get list user successfully`
        );
    }

    public async updatePhoneNumber(user: User, dto: UpdateUserDto) {
        try {
            const userByPhone = await this.findUserById(user.id);
            if (!userByPhone) {
                return new BaseErrorResponse(
                    STATUSCODE.PHONE_NOTFOUND_4012,
                    'User not found'
                );
            }
            const newUser = await this.updateSomeField(user, dto);
            const access_token = this.jwt.signToken(
                dto.phone,
                newUser.fullname
            );
            return new BaseResponse(
                STATUSCODE.PHONE_UPDATE_SUCCESS_4011,
                {
                    user: newUser,
                    access_token: access_token
                },
                'Update phone number successfully'
            );
        } catch (error) {
            return new BaseErrorResponse(
                STATUSCODE.PHONE_NOTFOUND_4012,
                'User not found'
            );
        }
    }

    async updateAvatar(user: User, dto: AvataDto) {
        try {
            const userById = await this.findUserById(user.id);
            if (!userById) {
                const pathLocation = `./public/image/${dto.metadata.name}`;
                const isExisted = existsSync(pathLocation);
                if (isExisted) {
                    unlinkSync(pathLocation);
                }
                return new BaseErrorResponse(
                    STATUSCODE.PHONE_NOTFOUND_4012,
                    'User not found'
                );
            }

            if (
                userById.metadata &&
                Object.keys(userById.metadata).length > 0 &&
                !userById.socialId
            ) {
                const pathLocation = `./public/image/${userById.metadata.name}`;
                const isExisted = existsSync(pathLocation);
                if (isExisted) {
                    unlinkSync(pathLocation);
                }
            }

            const newUser = await this.updateSomeField(user, dto);
            return new BaseResponse(
                STATUSCODE.USER_AVATAR_UPLOADED_4013,
                newUser,
                'Update avatar successfully'
            );
        } catch (error) {
            console.log(error);
            const pathLocation = `./public/image/${dto.metadata.name}`;
            const isExisted = existsSync(pathLocation);
            if (isExisted) {
                unlinkSync(pathLocation);
            }
            return new BaseErrorResponse(
                STATUSCODE.PHONE_NOTFOUND_4012,
                'User not found'
            );
        }
    }
}
