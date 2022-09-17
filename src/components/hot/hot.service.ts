import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateHotDto } from './dto';
import { Hot } from './model/hot.schema';
import { IHot } from './interfaces/hot.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigSearch } from '../search/config/config.search';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BaseErrorResponse, BaseResponse } from 'src/common';
import { MESSAGE, STATUSCODE } from 'src/constants';
import { PaginationQueryDto } from '../video/dto/pagination.query.dto';
import { productIndex } from '../search/constant/product.elastic';
@Injectable()
export class HotService extends ElasticsearchService {
    constructor(
        @InjectModel(Hot.name)
        private readonly hotModel: Model<Hot>
    ) {
        super(ConfigSearch.searchConfig(process.env.ELASTIC_SEARCH_URL));
    }

    public async add(createHotDto: CreateHotDto): Promise<IHot> {
        try {
            const trend = await this.hotModel.create(createHotDto);
            return trend;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getHotTrend(): Promise<string> {
        try {
            const trend = await this.hotModel
                .find({})
                .select('trend')
                .limit(1)
                .skip(0)
                .sort({
                    createdAt: 'desc'
                })
                .exec();

            if (trend.length >= 1) {
                return trend[0].trend;
            }

            return '';
        } catch (error) {
            console.log(error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTrend(paginationQueryDto: PaginationQueryDto) {
        const hot = await this.getHotTrend();
        console.log(hot);
        try {
            const videos = await this.search({
                index: productIndex._index,
                body: {
                    size: paginationQueryDto.limit,
                    from: paginationQueryDto.offset,
                    query: {
                        multi_match: {
                            query: hot,
                            fields: ['name', 'description', 'preview', 'tag']
                        }
                    }
                }
            });

            return new BaseResponse(
                STATUSCODE.LISTED_SUCCESS_9010,
                {
                    videos: videos.hits.hits,
                    total: videos.hits.total
                },
                MESSAGE.LIST_SUCCESS
            );
        } catch (err) {
            console.log(err);
            throw new BaseErrorResponse(
                STATUSCODE.LISTED_FAIL_9011,
                MESSAGE.LIST_FAILED,
                err
            );
        }
    }

    public async remove(gameId: string): Promise<any> {
        const deletedCustomer = await this.hotModel.findByIdAndRemove(gameId);
        return deletedCustomer;
    }
}
