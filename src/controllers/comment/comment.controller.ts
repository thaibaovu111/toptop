import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { JwtGuard } from 'src/components/auth/guard';
import { STATUSCODE } from 'src/constants';
import {
    BaseCommentDto,
    BaseReplyDto,
    PaginationDto,
    ReplyPaginationDto
} from 'src/entities';
import { CommentService } from 'src/services';

@ApiBearerAuth('Authorization')
@ApiTags('comment')
@UseGuards(JwtGuard)
@Controller('/api/v1/comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @ApiOperation({
        summary: 'Comment video'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_CREATE_SUCCESS,
        description: 'Successfully'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_BAD_REQUEST,
        description: 'Failed'
    })
    @Post()
    async comment(@Req() req, @Body() comment: BaseCommentDto) {
        return await this.commentService.createComment(req.user.id, comment);
    }

    @ApiOperation({
        summary: 'Reply comment video'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_CREATE_SUCCESS,
        description: 'Successfully'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_BAD_REQUEST,
        description: 'Failed'
    })
    @Post(':commentId')
    async replyComment(
        @Req() req,
        @Param('commentId') commentId: string,
        @Body() comment: BaseCommentDto
    ) {
        return await this.commentService.replyComment(req.user.id, {
            ...comment,
            parent: commentId
        });
    }

    @ApiOperation({
        summary: 'Get root comments'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_SUCCESS,
        description: 'Successfully'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_BAD_REQUEST,
        description: 'Failed'
    })
    @Get('root/:videoId')
    async getRootVideoComments(
        @Param('videoId') videoId: string,
        @Query() pagination: PaginationDto
    ) {
        return await this.commentService.getRootVideoComments(
            videoId,
            pagination
        );
    }

    @ApiOperation({
        summary: 'Get reply comments by commentId'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_SUCCESS,
        description: 'Successfully'
    })
    @ApiResponse({
        status: STATUSCODE.COMMON_BAD_REQUEST,
        description: 'Failed'
    })
    @Get('child/:commentId')
    async getReplyComments(
        @Param('commentId') commentId: string,
        @Query() pagination: PaginationDto
    ) {
        return await this.commentService.getReplies({
            ...pagination,
            commentId
        });
    }

    @Get('count/:videoId')
    async countCommentsByVideoId(@Param('videoId') videoId: string) {
        return await this.commentService.countCommentsByVideoId(videoId);
    }
}
