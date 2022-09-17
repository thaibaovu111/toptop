import {
    BadRequestException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { BaseResponse } from 'src/common';
import { STATUSCODE } from 'src/constants';
import { ReplyPaginationDto } from 'src/entities';
import { Paging } from 'src/interfaces';
import { CommentRepository, ReplyRepository } from 'src/repositories';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly replyRepository: ReplyRepository
    ) {}

    async createComment<T>(userId: string, comment: T) {
        try {
            const response = await this.commentRepository.create({
                ...comment,
                author: userId
            });
            const result = await response.populate('author', {
                _id: 1,
                fullname: 1,
                metadata: 1
            });
            return new BaseResponse(
                STATUSCODE.COMMON_CREATE_SUCCESS,
                result,
                'Successfully'
            );
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async replyComment<T>(userId: string, comment: T) {
        try {
            const response = await this.replyRepository.create({
                ...comment,
                author: userId
            });
            return new BaseResponse(
                STATUSCODE.COMMON_CREATE_SUCCESS,
                response,
                'Successfully'
            );
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async getRootVideoComments(videoId: string, paging: Paging) {
        try {
            const comments = await this.commentRepository.getComments(
                videoId,
                paging
            );
            const total = await this.commentRepository.countCommentsByVideoId(
                videoId
            );
            return new BaseResponse(
                STATUSCODE.COMMON_SUCCESS,
                {
                    total,
                    comments
                },
                'Successfully'
            );
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async getReplies(paging: ReplyPaginationDto) {
        try {
            const { commentId, ...rest } = paging;
            const comments = await this.replyRepository.getReplies(
                commentId,
                rest
            );
            return new BaseResponse(
                STATUSCODE.COMMON_SUCCESS,
                comments,
                'Successfully'
            );
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async deleteCommentAndReplies(commentId: string) {
        try {
            await this.replyRepository.deleteMultipleByField({ commentId });
            await this.commentRepository.deleteById(commentId);
            return new BaseResponse(
                STATUSCODE.COMMON_DELETE_SUCCESS,
                null,
                'Successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async deleteComments() {
        try {
            await this.commentRepository.deleteAlls();
            return new BaseResponse(
                STATUSCODE.COMMON_DELETE_SUCCESS,
                null,
                'Successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async deleteReplies() {
        try {
            await this.replyRepository.deleteAlls();
            return new BaseResponse(
                STATUSCODE.COMMON_DELETE_SUCCESS,
                null,
                'Successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async countCommentsByVideoId(videoId: string) {
        try {
            const result = await this.commentRepository.countCommentsByVideoId(
                videoId
            );
            return new BaseResponse(
                STATUSCODE.COMMON_SUCCESS,
                result,
                'Successfully'
            );
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async countCommentsAllVideos() {
        try {
            const result = await this.commentRepository.countComments();
            return result;
        } catch (err) {
            throw err;
        }
    }
}
