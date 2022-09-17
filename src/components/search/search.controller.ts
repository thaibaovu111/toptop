import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Query,
    Param,
    Res,
    UploadedFile,
    UseInterceptors,
    HttpStatus,
    Req,
    UseGuards
} from '@nestjs/common';
import { SearchService } from './search.service';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiConsumes,
    ApiBearerAuth
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    CreateProductDto,
    UpdateProductDto,
    SearchProductDto,
    ProductMetadata,
    DeleteProductDto
} from './dto/index';
import { multerOptions } from '../../vender/helper/Helper';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { Express } from 'express';
import { Metadata } from 'src/models';
import * as moment from 'moment';
import { JwtGuard } from '../auth/guard';
@Controller('/api/v1/search')
@ApiTags('search')
@ApiBearerAuth('Authorization')
@UseGuards(JwtGuard)
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Post('insert-index')
    @ApiOperation({
        summary: 'Insert index'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description:
                        'image file upload, if available image url please empty field'
                },
                name: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                url: {
                    type: 'string'
                },
                preview: {
                    type: 'string',
                    description: 'preview url'
                },
                previewImage: {
                    type: 'string',
                    nullable: true,
                    description:
                        'if uploaded image file, please empty field, otherwise please fill image URL here if not upload image file'
                },
                tag: {
                    type: 'string'
                },
                tagId: {
                    type: 'string',
                    description:
                        '_id tag from tag list, if _id from tag list is empty, please create a new tag and assign _id here'
                },
                type: {
                    type: 'number'
                },
                time: {
                    type: 'number'
                }
            }
        }
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'insert index success'
    })
    public async insertIndex(
        @Req() req,
        @Body() createProductDto: CreateProductDto,
        @UploadedFile('file') file: Express.Multer.File
    ): Promise<any> {
        const product = {
            ...createProductDto,
            metadata: {} as Metadata,
            createdAt: moment().toDate(),
            createdBy: req.user.id
        };
        if (file) {
            const url = `${process.env.URL_DOMAIN_SERVER}/image/${file.filename}`;
            product.previewImage = url;

            product.metadata = {
                url,
                name: file.filename
            };
        } else {
            product.metadata = {
                url: product.previewImage,
                name: ''
            };
        }
        return await this.searchService.insertIndex(product);
    }

    @Put('update-index')
    @ApiOperation({
        summary: 'Update index'
    })
    @ApiResponse({
        status: 200,
        description: 'update index success'
    })
    public async updateIndex(
        @Req() req,
        @Body() updateDto: UpdateProductDto
    ): Promise<any> {
        const product = {
            ...updateDto,
            updatedBy: req.user.id,
            updatedAt: moment().toDate()
        };
        return this.searchService.updateIndex(product);
    }

    @Get('search-index')
    @ApiOperation({
        summary: 'search index'
    })
    @ApiResponse({
        status: 200,
        description: 'search index success'
    })
    public async searchIndex(
        @Query() searchProductDto: SearchProductDto
    ): Promise<any> {
        return this.searchService.searchIndex(searchProductDto);
    }

    @Delete('delete-index')
    @ApiOperation({
        summary: 'delete index'
    })
    @ApiResponse({
        status: 200,
        description: 'delete index success'
    })
    public async deleteIndex(): Promise<any> {
        return this.searchService.deleteIndex();
    }

    @Delete('delete-document')
    @ApiOperation({
        summary: 'delete document'
    })
    @ApiResponse({
        status: 200,
        description: 'delete document success'
    })
    public async deleteDocument(@Body() body): Promise<any> {
        return this.searchService.deleteDocument(body);
    }

    @Get('image/:imagename')
    @ApiOperation({
        summary: 'get image'
    })
    findProfileImage(
        @Param('imagename') imagename: string,
        @Res() res
    ): Observable<Record<string, any>> {
        return of(
            res.sendFile(join(process.cwd(), 'public/image/' + imagename))
        );
    }

    @Delete('delete-by-query')
    @ApiOperation({
        summary: 'delete document'
    })
    @ApiResponse({
        status: 200,
        description: 'delete document success'
    })
    public async delByQuery(
        @Body() deleteProductDto: DeleteProductDto
    ): Promise<any> {
        return this.searchService.delByQuery(deleteProductDto);
    }
}
