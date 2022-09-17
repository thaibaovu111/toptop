import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { BaseCommentDto } from './comment.dto';

export class BaseReplyDto extends BaseCommentDto {
    @ApiProperty({
        description: 'commentId'
    })
    @IsNotEmpty()
    @IsString()
    commentId: string;
}

export class ReplyDto extends BaseReplyDto {
    @ApiProperty({
        description: 'commentAt'
    })
    @IsDateString()
    commentAt: Date;
}
