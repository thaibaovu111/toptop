import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from 'src/entities';
import { Paging } from 'src/interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class ReactionRepository extends BaseRepository<ReactionDocument> {
    constructor(
        @InjectModel(Reaction.name)
        reactionModel: Model<Reaction>
    ) {
        super(reactionModel);
    }

    async countReactionsAllVideo(userId: string) {
        try {
            const result = await this.model.aggregate([
                {
                    $addFields: {
                        isUserLiked: {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $eq: ['$$ROOT.userId', userId]
                                        },
                                        {
                                            $eq: ['$$ROOT.isLiked', true]
                                        }
                                    ]
                                },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$videoId',
                        total_like: {
                            $sum: { $cond: [{ $eq: ['$isLiked', true] }, 1, 0] }
                        },
                        reaction: {
                            $push: {
                                k: 'isLiked',
                                v: '$isUserLiked'
                            }
                        },
                        type: {
                            $push: {
                                k: 'isLive',
                                v: '$$ROOT.isLive'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        reaction: {
                            $arrayToObject: '$reaction'
                        },
                        type: {
                            $arrayToObject: '$type'
                        },
                        total_like: '$total_like'
                    }
                },
                {
                    $group: {
                        _id: null,
                        root: {
                            $push: {
                                k: '$_id',
                                v: {
                                    total_like: '$total_like',
                                    isLiked: '$reaction.isLiked',
                                    isLive: '$type.isLive'
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
                { $match: { isLiked: true, userId } },
                { $limit: Number(limit) },
                { $skip: Number(offset) }
            ]);

            return videos;
        } catch (e) {
            throw e;
        }
    }

    async getVideoMostLike(limit: number) {
        try {
            const result = await this.model.aggregate([
                {
                    $group: {
                        _id: '$videoId',
                        total_like: {
                            $sum: { $cond: [{ $eq: ['$isLiked', true] }, 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        total_like: '$total_like'
                    }
                },
                {
                    $sort: {
                        total_like: -1
                    }
                },
                {
                    $limit: limit
                },
                {
                    $group: {
                        _id: null,
                        root: {
                            $push: {
                                k: '$_id',
                                v: '$total_like'
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
}
