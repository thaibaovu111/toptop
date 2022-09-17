import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/entities';
import { Paging } from 'src/interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class CommentRepository extends BaseRepository<CommentDocument> {
    constructor(
        @InjectModel(Comment.name)
        commentModel: Model<CommentDocument>
    ) {
        super(commentModel);
    }

    async getComments(videoId: string, paging: Paging) {
        try {
            const comments = await this.model
                .find({ videoId })
                .populate('author', {
                    _id: 1,
                    fullname: 1,
                    metadata: 1
                })
                .skip(paging.offset)
                .limit(paging.limit)
                .sort({ createdAt: -1 })
                .lean();
            const eachCommentReplyCount = await this.countReplyEachComment(
                videoId
            );
            return comments.map((comment) => ({
                ...comment,
                total_reply: eachCommentReplyCount[comment._id] || 0
            }));
        } catch (err) {
            throw err;
        }
    }

    async countCommentsByVideoId(videoId: string) {
        try {
            const result = await this.model.aggregate([
                {
                    $match: {
                        videoId
                    }
                },
                {
                    $lookup: {
                        from: 'replies',
                        let: {
                            id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            {
                                                $toString: '$parent'
                                            },
                                            {
                                                $toString: '$$id'
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'reply'
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        videoId: '$videoId',
                        total_reply: {
                            $size: '$reply'
                        },
                        reply: '$reply'
                    }
                },
                {
                    $group: {
                        _id: '$videoId',
                        root_count: { $sum: 1 },
                        replies: { $addToSet: '$total_reply' }
                    }
                },
                {
                    $addFields: {
                        total_reply: { $sum: '$replies' }
                    }
                },
                {
                    $addFields: {
                        total_comment: {
                            $add: ['$root_count', '$total_reply']
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        root: {
                            $push: {
                                k: 'total_comment',
                                v: '$total_comment'
                            }
                        }
                    }
                },
                {
                    $replaceRoot: { newRoot: { $arrayToObject: '$root' } }
                }
            ]);
            return result?.[0] || { total_comment: 0 };
        } catch (err) {
            throw err;
        }
    }

    async countComments() {
        try {
            const result = await this.model.aggregate([
                {
                    $lookup: {
                        from: 'replies',
                        let: {
                            id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            {
                                                $toString: '$parent'
                                            },
                                            {
                                                $toString: '$$id'
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'reply'
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        videoId: '$videoId',
                        total_reply: {
                            $size: '$reply'
                        },
                        reply: '$reply'
                    }
                },
                {
                    $group: {
                        _id: '$videoId',
                        root_count: { $sum: 1 },
                        replies: { $addToSet: '$total_reply' }
                    }
                },
                {
                    $addFields: {
                        total_reply: { $sum: '$replies' }
                    }
                },
                {
                    $addFields: {
                        total_comment: {
                            $add: ['$root_count', '$total_reply']
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
                                    total_comment: '$total_comment'
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
        } catch (err) {
            throw err;
        }
    }

    async countReplyEachComment(videoId: string) {
        try {
            const result = await this.model.aggregate([
                {
                    $match: {
                        videoId
                    }
                },
                {
                    $lookup: {
                        from: 'replies',
                        let: {
                            id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    {
                                                        $toString: '$parent'
                                                    },
                                                    {
                                                        $toString: '$$id'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: '$parent',
                                    total_reply: {
                                        $sum: 1
                                    }
                                }
                            }
                        ],
                        as: 'reply'
                    }
                },
                { $unwind: '$reply' },
                {
                    $group: {
                        _id: null,
                        root: {
                            $push: {
                                k: {
                                    $toString: '$_id'
                                },
                                v: '$reply.total_reply'
                            }
                        }
                    }
                },
                {
                    $replaceRoot: { newRoot: { $arrayToObject: '$root' } }
                }
            ]);

            return result?.[0] || {};
        } catch (err) {
            throw err;
        }
    }
}
