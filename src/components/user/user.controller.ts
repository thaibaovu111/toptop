import {
    Body,
    Controller,
    Post,
    Get,
    Request,
    UseGuards,
    Put,
    UploadedFile,
    UseInterceptors,
    Query,
    Delete,
    Param
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UpdateUserDto, AvataDto } from './dto';
import { JwtStrategy } from '../auth/strategy';
import { JwtGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../vender/helper/Helper';
import { PaginationQueryDto } from '../video/dto/pagination.query.dto';
import {
    ApiTags,
    ApiBody,
    ApiConsumes,
    ApiResponse,
    ApiOperation,
    ApiBearerAuth,
    ApiQuery
} from '@nestjs/swagger';
import { STATUSCODE } from 'src/constants';
import { ParseFilePipe } from 'src/validator/pipe/parse-file.pipe';
import { FileSizeValidationPipe } from 'src/validator/pipe/fileSize.pipe';
import { Express } from 'express';
@UseGuards(JwtStrategy)
@ApiBearerAuth('Authorization')
@ApiTags('user')
@Controller('/api/v1/user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({
        summary: 'Get user information'
    })
    @ApiResponse({
        status: STATUSCODE.USER_READ_SUCCESS_407,
        description: 'Get user information successfully'
    })
    @UseGuards(JwtGuard)
    @Get('info')
    async info(@Request() req) {
        return await this.userService.getUser(req.user);
    }

    @ApiOperation({
        summary: 'Update avatar of user'
    })
    @ApiResponse({
        status: STATUSCODE.USER_AVATAR_UPLOADED_4013,
        description: 'Update avatar successfully'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_NOTFOUND_4012,
        description: 'Phone not found'
    })
    @UseGuards(JwtGuard)
    @Post('update-avatar')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async updateAvata(
        @Request() req,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const avatarDto: AvataDto = {
            metadata: {
                name: file.filename,
                url: `${process.env.URL_DOMAIN_SERVER}/image/${file.filename}`
            }
        };
        return await this.userService.updateAvatar(req.user, avatarDto);
    }

    @ApiOperation({
        summary: 'Update user'
    })
    @ApiResponse({
        status: STATUSCODE.USER_UPDATE_SUCCESS_402,
        description: 'Update successfully'
    })
    @UseGuards(JwtGuard)
    @Post('update')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
                fullname: {
                    type: 'string'
                },
                birthdate: {
                    type: 'date'
                },
                email: {
                    type: 'string',
                    nullable: true
                },
                sex: {
                    type: 'string'
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async updateUser(
        @Request() req,
        @Body() dto: UserDto,
        @UploadedFile('file') file: Express.Multer.File
    ) {
        return await this.userService.updateUser(req.user, dto, file);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all users'
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        description: 'enter limit of record',
        required: true
    })
    @ApiQuery({
        name: 'offset',
        type: 'number',
        description: 'enter offset of record',
        required: true
    })
    public async getAllGame(@Query() paginationQuery: PaginationQueryDto) {
        return await this.userService.findAll(paginationQuery);
    }

    @ApiOperation({
        summary: 'Update phone number'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_UPDATE_SUCCESS_4011,
        description: 'Update phone number successfully'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_NOTFOUND_4012,
        description: 'Phone number not found'
    })
    @ApiResponse({
        status: 40015,
        description: 'Phone number has taken'
    })
    @UseGuards(JwtGuard)
    @Put('update-phone')
    public async updateGame(
        @Request() req,
        @Body() UpdateGameDto: UpdateUserDto
    ) {
        return await this.userService.updatePhoneNumber(
            req.user,
            UpdateGameDto
        );
    }

    @ApiOperation({
        summary: 'Clear all users'
    })
    @ApiResponse({
        status: STATUSCODE.DELETE_ALL_USERS_SUCCESS_205,
        description: 'Deleted users'
    })
    @UseGuards(JwtGuard)
    @Delete('deleteAllUsers')
    async deleteAllUsers() {
        return await this.userService.deleteAllUsers();
    }

    @ApiResponse({
        status: STATUSCODE.DELETE_USER_SUCCESS,
        description: 'Deleted user'
    })
    @ApiResponse({
        status: STATUSCODE.USER_NOT_FOUND_400,
        description: 'User not found'
    })
    @ApiOperation({
        summary: 'Delete user by userId'
    })
    @UseGuards(JwtGuard)
    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        return await this.userService.deleteUser(userId);
    }
}
