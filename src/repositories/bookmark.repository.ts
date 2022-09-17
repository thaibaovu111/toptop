import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from 'src/entities';
import { Paging } from 'src/interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class BookmarkRepository extends BaseRepository<BookmarkDocument> {
    constructor(
        @InjectModel(Bookmark.name)
        bookmarkModel: Model<Bookmark>
    ) {
        super(bookmarkModel);
    }

    async countBookmarksAllVideo(userId: string) {
        try {
            const result = await this.model.aggregate([
                {
                    $group: {
                        _id: '$videoId',
                        count: { $sum: 1 },
                        user: {
                            $push: {
                                k: 'userId',
                                v: '$userId'
                            }
                        }
                    }
                },
                {
                    $project: {
                        count: '$count',
                        user: {
                            $arrayToObject: '$user'
                        }
                    }
                },
                {
                    $addFields: {
                        isBookmarked: {
                            $cond: {
                                if: {
                                    $eq: ['$user.userId', userId]
                                },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        root: {
                            $push: {
                                k: '$_id',
                                v: {
                                    total_bookmark: '$count',
                                    isBookmarked: '$isBookmarked'
                                }
                            }
                        }
                    }
                },
                {
                    $replaceRoot: { newRoot: { $arrayToObject: '$root' } }
                }
            ]);
            return result?.[0] || {};
        } catch (e) {
            throw e;
        }
    }

    async paginateAggregate(userId: string, paging: Paging) {
        try {
            const { limit, offset } = paging;
            const videos = await this.model.aggregate([
                {
                    $lookup: {
                        from: 'videos',
                        let: {
                            id: '$videoId'
                        },
                        pipeline: [
                            {
                                $addFields: {
                                    _id: {
                                        $toString: '$_id'
                                    }
                                }
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$id']
                                    }
                                }
                            }
                        ],
                        as: 'meta'
                    }
                },
                { $unwind: '$meta' },
                { $match: { userId } },
                { $limit: Number(limit) },
                { $skip: Number(offset) }
            ]);

            return videos;
        } catch (e) {
            throw e;
        }
    }
}
