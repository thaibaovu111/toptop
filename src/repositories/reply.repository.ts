import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { Reply, ReplyDocument } from 'src/entities';
import { Paging } from 'src/interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class ReplyRepository extends BaseRepository<ReplyDocument> {
    constructor(
        @InjectModel(Reply.name)
        replyModel: Model<Reply>
    ) {
        super(replyModel);
    }

    async deleteRepliesByParentCommentId(commentId: string): Promise<any> {
        return await this.model.deleteMany({ commentId });
    }

    async getReplies(commentId: string, paging: Paging) {
        try {
            return await this.model
                .find({ parent: commentId })
                .populate('author', { _id: 1, fullname: 1, metadata: 1 })
                .populate({
                    path: 'parent',
                    populate: {
                        path: 'author',
                        select: '_id fullname metadata'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(paging.offset)
                .limit(paging.limit);
        } catch (e) {
            throw e;
        }
    }
}
