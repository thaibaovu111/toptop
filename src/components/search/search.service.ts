import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchServiceInterface } from './interface/search.service.interface';
import { ConfigSearch } from './config/config.search';
import { productIndex } from './constant/product.elastic';
import { BaseResponse } from 'src/common';
import { MESSAGE, STATUSCODE } from 'src/constants';
import { Model } from 'mongoose';
import { Video } from '../video/model/video.schema';
import { CreateVideoDto } from '../video/dto';
import { DeleteProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
// import { ProductSearchObject } from './model/product.search.object';
@Injectable()
export class SearchService
    extends ElasticsearchService
    implements SearchServiceInterface<any>
{
    constructor(
        @InjectModel(Video.name)
        private videoModel: Model<Video>
    ) {
        super(ConfigSearch.searchConfig(process.env.ELASTIC_SEARCH_URL));
    }

    async findVideoById(id: string) {
        return await this.videoModel.findById(id);
    }

    async findByESIndex(esIndex: string) {
        return await this.videoModel.findOne({ esIndex });
    }

    async createVideo(video: CreateVideoDto) {
        return await this.videoModel.create(video);
    }

    public async insertIndex(bulkData: any): Promise<any> {
        try {
            const video = await this.createVideo(bulkData);
            const data = this.productDocument({
                ...bulkData,
                videoId: video._id
            });
            await this.bulk(data);

            return new BaseResponse(
                HttpStatus.CREATED,
                video,
                MESSAGE.CREATE_SUCCESS
            );
        } catch (err) {
            console.log(err);
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateIndex(updateData: any): Promise<any> {
        return await this.productDocument(updateData);
        // return this.insertIndex(data);
    }

    public async searchIndex(searchData: any): Promise<any> {
        // const data = ProductSearchObject.searchObject(searchData);
        try {
            const res = await this.search({
                index: productIndex._index,
                body: {
                    size: searchData.limit,
                    from: searchData.offset,
                    query: {
                        multi_match: {
                            query: searchData.search,
                            fields: [
                                'name',
                                'description',
                                'url',
                                'preview',
                                'tag'
                            ]
                        }
                    }
                }
            });
            return res;
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async deleteIndex(): Promise<any> {
        return this.indices
            .delete({ index: productIndex._index })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    public async deleteDocument(indexData: any): Promise<any> {
        return this.delete(indexData)
            .then((res) => res)
            .catch((err) => {
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    public async delByQuery(deleteProductDto: DeleteProductDto): Promise<any> {
        return this.deleteByQuery({
            index: productIndex._index,
            body: {
                query: {
                    match: { videoId: deleteProductDto.id }
                }
            }
        })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    private bulkIndex(productId: number): any {
        return {
            _index: productIndex._index,
            _type: productIndex._type,
            _id: productId
        };
    }

    private productDocument(product: any): any {
        const bulk = [];
        bulk.push({
            index: this.bulkIndex(product.id)
        });
        bulk.push(product);
        return {
            body: bulk,
            index: productIndex._index,
            type: productIndex._type
        };
    }

    private checkfield(data: any): boolean {
        if (!isNaN(data)) {
            return true;
        }

        return false;
    }
}
