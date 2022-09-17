import {
    Injectable,
    HttpException,
    HttpStatus,
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common';
import { ReactionDto } from './dto/reaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { ConfigSearch } from '../search/config/config.search';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { productIndex } from '../search/constant/product.elastic';
import { SearchProductDto } from '../search/dto';
import { VideoPaginateDto } from './dto';
import { BaseErrorResponse, BaseResponse } from 'src/common';
import { MESSAGE, STATUSCODE } from 'src/constants';
import { Video } from './model/video.schema';
import * as moment from 'moment';
// import { map } from 'rxjs/operators';
import { HotService } from '../hot/hot.service';
import { CommentService } from 'src/services';
import { BookmarkRepository, ReactionRepository } from 'src/repositories';
@Injectable()
export class VideoService extends ElasticsearchService {
    constructor(
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>,
        // private readonly httpService: HttpService,
        private readonly hotService: HotService,
        private readonly commentService: CommentService,
        private readonly reactionRepo: ReactionRepository,
        private readonly bookmarkRepo: BookmarkRepository
    ) {
        super(ConfigSearch.searchConfig(process.env.ELASTIC_SEARCH_URL));
    }

    // /**
    //  * URL of live streamming server
    //  *
    //  */
    // private url =
    //     process.env.URL_HOT_TREND || 'http://localhost:3000/api/v1/hot';

    // /**
    //  * Username and Password to login live streamming server
    //  *
    //  */
    // private data: any = {};

    // /**
    //  * Options for request
    //  *
    //  */
    // private options: any = {};

    async updateReaction<T>(reactionId: string, reaction: T) {
        return await this.reactionRepo.update(reactionId, reaction);
    }

    async createReaction<T>(reaction: T) {
        return await this.reactionRepo.create(reaction);
    }

    async getImageURL(videoId: string) {
        let imageURL = null;
        const isValidObjectId = Types.ObjectId.isValid(videoId);
        let videoFinder = null;
        if (isValidObjectId) {
            videoFinder = await this.videoModel.findById(videoId);
        }
        if (videoFinder) {
            imageURL = videoFinder.previewImage;
        } else {
            const document = await this.search({
                index: productIndex._index,
                query: {
                    terms: {
                        _id: [videoId]
                    }
                }
            });
            const videos = document.hits.hits;
            if (videos.length > 0) {
                imageURL = (videos[0]._source as any).previewImage;
            }
        }
        return imageURL;
    }

    async updateManyReactionByVideoId<T>(
        videoId: string,
        reaction: T
    ): Promise<any> {
        return await this.reactionRepo.updateMany({ videoId }, reaction);
    }

    async deleteBookmark(bookmarkId: string) {
        return await this.bookmarkRepo.deleteById(bookmarkId);
    }

    async createBookmark<T>(bookmark: T) {
        return await this.bookmarkRepo.create(bookmark);
    }

    async reactionVideo(userId: string, reactionDto: ReactionDto) {
        const reaction = {
            ...reactionDto,
            userId,
            reactionDate: moment().toISOString(),
            isLiked: true
        };
        try {
            const reactionFind = await this.reactionRepo.getOne({
                userId,
                videoId: reaction.videoId
            });
            if (reactionFind) {
                const previewImage = await this.getImageURL(reaction.videoId);
                const response = await this.updateReaction(reactionFind._id, {
                    isLiked: reactionFind.isLiked ? false : true,
                    previewImage
                });
                await this.updateManyReactionByVideoId(reaction.videoId, {
                    previewImage
                });
                return new BaseResponse(
                    reactionFind.isLiked
                        ? STATUSCODE.VIDEO_UNLIKE_SUCCESS_903
                        : STATUSCODE.VIDEO_LIKE_SUCCESS_901,
                    response,
                    reactionFind.isLiked ? 'Unliked video' : 'Liked this video'
                );
            } else {
                const previewImage = await this.getImageURL(reaction.videoId);
                const response = await this.createReaction({
                    ...reaction,
                    previewImage
                });
                return new BaseResponse(
                    STATUSCODE.VIDEO_LIKE_SUCCESS_901,
                    response,
                    'Liked this video'
                );
            }
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async bookmarkVideo(userId: string, bookmarkDto: ReactionDto) {
        const bookmark = {
            ...bookmarkDto,
            userId,
            bookmarkDate: moment().toISOString()
        };
        try {
            const bookmarkFind = await this.bookmarkRepo.getOne({
                userId,
                videoId: bookmark.videoId
            });
            if (bookmarkFind) {
                await this.deleteBookmark(bookmarkFind._id);
                return new BaseResponse(
                    STATUSCODE.VIDEO_UNBOOKMARK_911,
                    null,
                    'Unbookmark video'
                );
            } else {
                const previewImage = await this.getImageURL(bookmark.videoId);
                const response = await this.createBookmark({
                    ...bookmark,
                    previewImage
                });
                return new BaseResponse(
                    STATUSCODE.VIDEO_BOOKMARK_SUCCESS_910,
                    response,
                    'Bookmark this video'
                );
            }
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getVideoBookmarks(userId: string, pagination: PaginationQueryDto) {
        try {
            const videos = await this.bookmarkRepo.paginateAggregate(
                userId,
                pagination
            );

            const resultComment =
                await this.commentService.countCommentsAllVideos();

            const resultBookmark =
                await this.bookmarkRepo.countBookmarksAllVideo(userId);

            const resultReaction =
                await this.reactionRepo.countReactionsAllVideo(userId);

            const maps = videos.map((video) => ({
                ...video,
                total_like: this.getTotalLike(video.videoId, resultReaction),
                isLiked: this.getBoolean(video.videoId, resultReaction),
                isLive: this.getBooleanLive(video.videoId, resultReaction),
                total_bookmark: this.getTotalBookmark(
                    video.videoId,
                    resultBookmark
                ),
                isBookmarked: this.getBooleanBookmark(
                    video.videoId,
                    resultBookmark
                ),
                total_comment: this.getTotalComment(
                    video.videoId,
                    resultComment
                )
            }));

            return new BaseResponse(
                STATUSCODE.VIDEO_LIST_SUCCESS_905,
                maps,
                'Get list video successfully'
            );
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException(err);
            // return new BaseErrorResponse(
            //     STATUSCODE.VIDEO_LIST_FAIL_906,
            //     'Get list video failed',
            //     null
            // );
        }
    }

    async getListVideoLiked(
        userId: string,
        paginationQuery: PaginationQueryDto
    ) {
        try {
            const videos = await this.reactionRepo.paginateAggregate(
                userId,
                paginationQuery
            );
            // const videos = await this.reactionModel.aggregate([
            //     {
            //         $lookup: {
            //             from: 'videos',
            //             let: {
            //                 id: '$videoId'
            //             },
            //             pipeline: [
            //                 {
            //                     $addFields: {
            //                         _id: {
            //                             $toString: '$_id'
            //                         }
            //                     }
            //                 },
            //                 {
            //                     $match: {
            //                         $expr: {
            //                             $eq: [
            //                                 "$_id",
            //                                 "$$id"
            //                             ]
            //                         }
            //                     }
            //                 }
            //             ],
            //             as: 'meta'
            //         }
            //     },
            //     { $unwind: '$meta' },
            //     { $match: { isLiked: true, userId } },
            //     { $limit: Number(limit) },
            //     { $skip: Number(offset) },
            // ])

            const resultComment =
                await this.commentService.countCommentsAllVideos();

            const resultBookmark =
                await this.bookmarkRepo.countBookmarksAllVideo(userId);

            // aggregate([
            //     {
            //         $group: {
            //             _id: "$videoId", count: { $sum: 1 },
            //             user: {
            //                 $push: {
            //                     k: 'userId',
            //                     v: '$userId'
            //                 }
            //             }
            //         }
            //     },
            //     {
            //         $project: {
            //             count: '$count',
            //             user: {
            //                 $arrayToObject: '$user'
            //             }
            //         }
            //     },
            //     {
            //         $addFields: {
            //             isBookmarked: {
            //                 $cond: {
            //                     if: {
            //                         $eq: [
            //                             "$user.userId",
            //                             userId
            //                         ]
            //                     },
            //                     then: true,
            //                     else: false
            //                 }
            //             }
            //         }
            //     },
            //     {
            //         $group: {
            //             _id: null,
            //             root: {
            //                 $push: {
            //                     k: '$_id', v: {
            //                         total_bookmark: '$count',
            //                         isBookmarked: '$isBookmarked'
            //                     }
            //                 }
            //             }
            //         }
            //     },
            //     {
            //         $replaceRoot: { newRoot: { $arrayToObject: '$root' } }
            //     }
            // ])

            const resultReaction =
                await this.reactionRepo.countReactionsAllVideo(userId);

            // const aggregate = await this.reactionModel.aggregate([
            //     {
            //         $addFields: {
            //             isUserLiked: {
            //                 $cond: {
            //                     if: {
            //                         $and: [
            //                             {
            //                                 $eq: [
            //                                     "$$ROOT.userId",
            //                                     userId
            //                                 ]
            //                             },
            //                             {
            //                                 $eq: [
            //                                     "$$ROOT.isLiked",
            //                                     true
            //                                 ]
            //                             }
            //                         ],
            //                     },
            //                     then: true,
            //                     else: false
            //                 }
            //             }
            //         }
            //     },
            //     {
            //         $group: {
            //             _id: '$videoId',
            //             total_like: {
            //                 $sum: { $cond: [{ $eq: ['$isLiked', true] }, 1, 0] }
            //             },
            //             reaction: {
            //                 $push: {
            //                     k: 'isLiked',
            //                     v: '$isUserLiked'
            //                 }
            //             },
            //             type: {
            //                 $push: {
            //                     k: 'isLive',
            //                     v: '$$ROOT.isLive'
            //                 }
            //             }
            //         }
            //     },
            //     {
            //         $project: {
            //             _id: '$_id', reaction: {
            //                 $arrayToObject: '$reaction'
            //             }, type: {
            //                 $arrayToObject: '$type'
            //             }, total_like: '$total_like'
            //         },
            //     },
            //     {
            //         $group: {
            //             _id: null,
            //             root: {
            //                 $push: {
            //                     k: '$_id', v: {
            //                         total_like: '$total_like',
            //                         isLiked: '$reaction.isLiked',
            //                         isLive: '$type.isLive',
            //                     }
            //                 }
            //             }
            //         }
            //     },
            //     {
            //         $replaceRoot: { newRoot: { $arrayToObject: '$root' } }
            //     }
            // ]);

            const maps = videos.map((video) => ({
                ...video,
                total_like: this.getTotalLike(video.videoId, resultReaction),
                isLiked: this.getBoolean(video.videoId, resultReaction),
                isLive: this.getBooleanLive(video.videoId, resultReaction),
                total_bookmark: this.getTotalBookmark(
                    video.videoId,
                    resultBookmark
                ),
                isBookmarked: this.getBooleanBookmark(
                    video.videoId,
                    resultBookmark
                ),
                total_comment: this.getTotalComment(
                    video.videoId,
                    resultComment
                )
            }));

            return new BaseResponse(
                STATUSCODE.VIDEO_LIST_SUCCESS_905,
                maps,
                'Get list video successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
            // return new BaseErrorResponse(
            //     STATUSCODE.VIDEO_LIST_FAIL_906,
            //     'Get list video failed',
            //     err
            // );
        }
    }

    public async getRelativeVideo(
        userId: string,
        searchProductDto: SearchProductDto
    ): Promise<any> {
        try {
            const response = await this.search({
                index: productIndex._index,
                body: {
                    size: searchProductDto.limit,
                    from: searchProductDto.offset,
                    query: {
                        multi_match: {
                            query: searchProductDto.search,
                            fields: [
                                'name',
                                'description',
                                'preview',
                                'tag',
                                'url'
                            ]
                        }
                    }
                }
            });

            const videos: any[] = response.hits.hits;

            const resultComment =
                await this.commentService.countCommentsAllVideos();

            const resultBookmark =
                await this.bookmarkRepo.countBookmarksAllVideo(userId);

            const resultReaction =
                await this.reactionRepo.countReactionsAllVideo(userId);

            const maps = videos.map((video) => ({
                ...video,
                _source: {
                    ...video._source,
                    total_like: this.getTotalLike(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    isLiked: this.getBoolean(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    isLive: this.getBooleanLive(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    total_bookmark: this.getTotalBookmark(
                        video._source.videoId || video._id,
                        resultBookmark
                    ),
                    isBookmarked: this.getBooleanBookmark(
                        video._source.videoId || video._id,
                        resultBookmark
                    ),
                    total_comment: this.getTotalComment(
                        video._source.videoId || video._id,
                        resultComment
                    )
                }
            }));

            return new BaseResponse(
                STATUSCODE.VIDEO_LIST_SUCCESS_905,
                maps,
                'Get relate video successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    getTotalLike(key: string, object: any) {
        return object[key]?.total_like || 0;
    }

    getBoolean(key: string, object: any) {
        return object[key]?.isLiked || false;
    }

    getBooleanLive(key: string, object: any) {
        return object[key]?.isLive || false;
    }

    getTotalBookmark(key: string, object: any) {
        return object[key]?.total_bookmark || 0;
    }

    getBooleanBookmark(key: string, object: any) {
        return object[key]?.isBookmarked || false;
    }

    getTotalComment(key: string, object: any) {
        return object[key]?.total_comment || 0;
    }

    public async getRelativeVideoByTag(
        userId: string,
        searchProductDto: SearchProductDto
    ): Promise<any> {
        const videos = await this.getVideoByTag(searchProductDto);

        const resultBookmark = await this.bookmarkRepo.countBookmarksAllVideo(
            userId
        );

        const resultReaction = await this.reactionRepo.countReactionsAllVideo(
            userId
        );

        const resultComment =
            await this.commentService.countCommentsAllVideos();

        const maps = videos.map((video) => ({
            ...video,
            _source: {
                ...video._source,
                total_like: this.getTotalLike(
                    video._source.videoId || video._id,
                    resultReaction
                ),
                isLiked: this.getBoolean(
                    video._source.videoId || video._id,
                    resultReaction
                ),
                isLive: this.getBooleanLive(
                    video._source.videoId || video._id,
                    resultReaction
                ),
                total_bookmark: this.getTotalBookmark(
                    video._source.videoId || video._id,
                    resultBookmark
                ),
                isBookmarked: this.getBooleanBookmark(
                    video._source.videoId || video._id,
                    resultBookmark
                ),
                total_comment: this.getTotalComment(
                    video._source.videoId || video._id,
                    resultComment
                )
            }
        }));

        return {
            code: 90009,
            data: maps,
            message: 'Get relative video by tag successfully'
        };
    }

    private async getVideoByUrl(
        searchProductDto: SearchProductDto
    ): Promise<any> {
        return await this.search({
            index: productIndex._index,
            body: {
                size: 1,
                from: 0,
                query: {
                    multi_match: {
                        query: searchProductDto.search,
                        fields: ['url']
                    }
                }
            }
        })
            .then((res) => res.hits.hits)
            .catch((err) => {
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    private async getVideoByTag(
        searchProductDto: SearchProductDto
    ): Promise<any> {
        try {
            const response = await this.search({
                index: productIndex._index,
                body: {
                    size: searchProductDto.limit,
                    from: searchProductDto.offset,
                    query: {
                        multi_match: {
                            query: searchProductDto.search,
                            fields: ['tag']
                        }
                    }
                }
            });
            return response.hits.hits;
        } catch (err) {
            console.log(err);
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async getTag(
        searchProductDto: SearchProductDto,
        tag: string
    ): Promise<any> {
        return await this.search({
            index: productIndex._index,
            body: {
                size: searchProductDto.limit,
                from: searchProductDto.offset,
                query: {
                    multi_match: {
                        query: tag,
                        fields: ['name', 'description', 'preview', 'tag']
                    }
                }
            }
        })
            .then((res) => res.hits.hits)
            .catch((err) => {
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    async getVideos(userId: string, videoPaginate: VideoPaginateDto) {
        const hot = await this.hotService.getHotTrend();
        // const like = await this.getVideoByLike();

        // if (like) {
        //     // console.log(typeof hot);
        //     const videos = await this.getTrend(userId, videoPaginate, like);

        //     if (videos.data.videos.length >= 1) {
        //         return videos;
        //     }
        // }

        if (hot) {
            // console.log(typeof hot);
            const videos = await this.getTrend(userId, videoPaginate, hot);

            if (videos.data.videos.length >= 1) {
                return videos;
            }
        }

        return this.getAll(userId, videoPaginate);
    }

    private async getVideoByLike(): Promise<any> {
        const likes = await this.getVideoMostLike(1);
        try {
            let like = '';
            for (const l in likes) {
                like = l;
                break;
            }

            if (!like) return '';

            const response = await this.search({
                index: productIndex._index,
                query: {
                    match: {
                        videoId: like
                    }
                }
            });

            if (response.hits.hits.length >= 1) {
                for (let i = 0; i < response.hits.hits.length; i++) {
                    const tag = Object.entries(
                        response.hits.hits[i]._source
                    ).find(([key, value]) => {
                        if (key === 'tag') {
                            // console.log(value);
                            return value;
                        }
                    });

                    return tag[1];
                }
            }

            return '';
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }

    // private async getHotTrend(): Promise<any> {
    //     try {
    //         return await this.httpService
    //             .get(this.url)
    //             .pipe(map((resp) => resp.data));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    private async getAll(userId: string, videoPaginate: VideoPaginateDto) {
        try {
            const response = await this.search({
                index: productIndex._index,
                body: {
                    sort: [{ createdAt: { order: 'desc' } }],
                    size: videoPaginate.limit,
                    from: videoPaginate.offset,
                    query: {
                        match_all: {}
                    }
                }
            });

            const videos: any[] = response.hits.hits;

            const resultComment =
                await this.commentService.countCommentsAllVideos();

            const resultBookmark =
                await this.bookmarkRepo.countBookmarksAllVideo(userId);

            const resultReaction =
                await this.reactionRepo.countReactionsAllVideo(userId);

            const maps = videos.map((video) => ({
                ...video,
                _source: {
                    ...video._source,
                    total_like: this.getTotalLike(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    isLiked: this.getBoolean(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    isLive: this.getBooleanLive(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    total_bookmark: this.getTotalBookmark(
                        video._source.videoId || video._id,
                        resultBookmark
                    ),
                    isBookmarked: this.getBooleanBookmark(
                        video._source.videoId || video._id,
                        resultBookmark
                    ),
                    total_comment: this.getTotalComment(
                        video._source.videoId || video._id,
                        resultComment
                    )
                }
            }));

            return new BaseResponse(
                STATUSCODE.LISTED_SUCCESS_9010,
                {
                    videos: maps,
                    total: response.hits.total
                },
                MESSAGE.LIST_SUCCESS
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
            // console.log(err);
            // throw new BaseErrorResponse(
            //     STATUSCODE.LISTED_FAIL_9011,
            //     MESSAGE.LIST_FAILED,
            //     err
            // );
        }
    }

    private async getTrend(
        userId: string,
        videoPaginate: VideoPaginateDto,
        hot: string
    ) {
        if (hot != null || hot != undefined) {
            try {
                const response = await this.search({
                    index: productIndex._index,
                    body: {
                        sort: [{ createdAt: { order: 'desc' } }],
                        size: videoPaginate.limit,
                        from: videoPaginate.offset,
                        query: {
                            multi_match: {
                                query: hot,
                                fields: [
                                    'name',
                                    'description',
                                    'preview',
                                    'tag'
                                ]
                            }
                        }
                    }
                });

                const videos: any[] = response.hits.hits;

                const resultComment =
                    await this.commentService.countCommentsAllVideos();

                const resultBookmark =
                    await this.bookmarkRepo.countBookmarksAllVideo(userId);

                const resultReaction =
                    await this.reactionRepo.countReactionsAllVideo(userId);

                const maps = videos.map((video) => ({
                    ...video,
                    _source: {
                        ...video._source,
                        total_like: this.getTotalLike(
                            video._source.videoId || video._id,
                            resultReaction
                        ),
                        isLiked: this.getBoolean(
                            video._source.videoId || video._id,
                            resultReaction
                        ),
                        isLive: this.getBooleanLive(
                            video._source.videoId || video._id,
                            resultReaction
                        ),
                        total_bookmark: this.getTotalBookmark(
                            video._source.videoId || video._id,
                            resultBookmark
                        ),
                        isBookmarked: this.getBooleanBookmark(
                            video._source.videoId || video._id,
                            resultBookmark
                        ),
                        total_comment: this.getTotalComment(
                            video._source.videoId || video._id,
                            resultComment
                        )
                    }
                }));

                return new BaseResponse(
                    STATUSCODE.LISTED_SUCCESS_9010,
                    {
                        videos: maps,
                        total: response.hits.total
                    },
                    MESSAGE.LIST_SUCCESS
                );
            } catch (err) {
                throw new InternalServerErrorException(err);
                // console.log(err);
                // throw new BaseErrorResponse(
                //     STATUSCODE.LISTED_FAIL_9011,
                //     MESSAGE.LIST_FAILED,
                //     err
                // );
            }
        }
    }

    public async searchVideo(
        userId: string,
        searchProductDto: SearchProductDto
    ): Promise<any> {
        try {
            const response = await this.search({
                index: productIndex._index,
                body: {
                    size: searchProductDto.limit,
                    from: searchProductDto.offset,
                    query: {
                        multi_match: {
                            query: searchProductDto.search,
                            fields: [
                                'name',
                                'description',
                                'preview',
                                'tag',
                                'url'
                            ]
                        }
                    }
                }
            });

            const videos: any[] = response.hits.hits;

            const resultComment =
                await this.commentService.countCommentsAllVideos();

            const resultBookmark =
                await this.bookmarkRepo.countBookmarksAllVideo(userId);

            const resultReaction =
                await this.reactionRepo.countReactionsAllVideo(userId);

            const maps = videos.map((video) => ({
                ...video,
                _source: {
                    ...video._source,
                    total_like: this.getTotalLike(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    isLiked: this.getBoolean(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    isLive: this.getBooleanLive(
                        video._source.videoId || video._id,
                        resultReaction
                    ),
                    total_bookmark: this.getTotalBookmark(
                        video._source.videoId || video._id,
                        resultBookmark
                    ),
                    isBookmarked: this.getBooleanBookmark(
                        video._source.videoId || video._id,
                        resultBookmark
                    ),
                    total_comment: this.getTotalComment(
                        video._source.videoId || video._id,
                        resultComment
                    )
                }
            }));

            return new BaseResponse(
                STATUSCODE.VIDEO_LIST_SUCCESS_905,
                maps,
                'Get videos successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    public async getVideoMostLike(limit: number): Promise<any> {
        try {
            const aggregate = await this.reactionRepo.getVideoMostLike(limit);
            return aggregate;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}
