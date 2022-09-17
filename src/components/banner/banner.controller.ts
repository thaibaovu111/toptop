import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
    Query,
    Request
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/vender/helper/Helper';
import { MESSAGE, STATUSCODE } from 'src/constants';
import { PaginateQueryDto } from './dto/paginate.dto';
import { ParseFilePipe } from 'src/validator/pipe/parse-file.pipe';
import { Express } from 'express';
import { FileSizeValidationPipe } from 'src/validator/pipe/fileSize.pipe';

@ApiBearerAuth('Authorization')
@ApiTags('banner')
@UseGuards(JwtGuard)
@Controller('/api/v1/banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiResponse({
        status: STATUSCODE.BANNER_CREATE_SUCCESS_120,
        description: MESSAGE.CREATE_SUCCESS
    })
    @ApiResponse({
        status: STATUSCODE.BANNER_CREATE_FAIL_121,
        description: MESSAGE.CREATE_FAILED
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_BAD_REQUEST,
        description: 'validation error'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
                status: {
                    type: 'string'
                },
                template: {
                    type: 'string',
                    nullable: true
                },
                transparent: {
                    type: 'boolean'
                },
                title: {
                    type: 'string'
                },
                campaignId: {
                    type: 'string',
                    nullable: true
                },
                startDate: {
                    type: 'datetime',
                    format: 'datetime'
                },
                endDate: {
                    type: 'datetime',
                    format: 'datetime'
                },
                hidden: {
                    type: 'boolean',
                    default: false
                }
            }
        }
    })
    create(
        @Req() req,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @Body() createBannerDto: CreateBannerDto
    ) {
        return this.bannerService.create(req.user.id, createBannerDto, file);
    }

    @Get()
    @ApiResponse({
        status: STATUSCODE.BANNER_LIST_SUCCESS_128,
        description: MESSAGE.LIST_SUCCESS
    })
    @ApiResponse({
        status: STATUSCODE.BANNER_LIST_FAIL_129,
        description: MESSAGE.LIST_FAILED
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_BAD_REQUEST,
        description: 'validation error'
    })
    async paginateBanner(@Query() paginateQuery: PaginateQueryDto) {
        return await this.bannerService.paginateBanner(
            paginateQuery.offset,
            paginateQuery.limit
        );
    }

    @Get(':id')
    @ApiResponse({
        status: STATUSCODE.BANNER_READ_SUCCESS_124,
        description: MESSAGE.LIST_SUCCESS
    })
    @ApiResponse({
        status: STATUSCODE.BANNER_READ_FAIL_125,
        description: MESSAGE.LIST_FAILED
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_NOT_FOUND,
        description: 'not found'
    })
    async getById(@Param('id') id: string) {
        return await this.bannerService.getBannerById(id);
    }

    @Patch(':id')
    @ApiResponse({
        status: STATUSCODE.BANNER_UPDATE_SUCCESS_122,
        description: MESSAGE.UPDATE_SUCCESS
    })
    @ApiResponse({
        status: STATUSCODE.BANNER_UPDATE_FAIL_123,
        description: MESSAGE.UPDATE_FAILED
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_NOT_FOUND,
        description: 'not found'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    nullable: true
                },
                status: {
                    type: 'string'
                },
                template: {
                    type: 'string',
                    nullable: true
                },
                transparent: {
                    type: 'boolean'
                },
                title: {
                    type: 'string'
                },
                campaignId: {
                    type: 'string',
                    nullable: true
                },
                startDate: {
                    type: 'datetime',
                    format: 'datetime'
                },
                endDate: {
                    type: 'datetime',
                    format: 'datetime'
                },
                hidden: {
                    type: 'boolean',
                    default: false
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file', multerOptions))
    update(
        @Req() req,
        @Param('id') id: string,
        @Body() updateBannerDto: UpdateBannerDto
    ) {
        return this.bannerService.update(
            req.user.id,
            id,
            updateBannerDto,
            req.file
        );
    }

    @ApiResponse({
        status: STATUSCODE.BANNER_DELETE_SUCCESS_126,
        description: MESSAGE.DELETE_SUCCESS
    })
    @ApiResponse({
        status: STATUSCODE.BANNER_DELETE_FAIL_127,
        description: MESSAGE.DELETE_FAILED
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_NOT_FOUND,
        description: 'not found'
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bannerService.remove(id);
    }
}
