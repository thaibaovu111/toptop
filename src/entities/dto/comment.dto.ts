import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class BaseCommentDto {
    @ApiProperty({
        description: 'videoId'
    })
    @IsNotEmpty()
    @IsString()
    videoId: string;

    @ApiProperty({
        description: 'comment of user'
    })
    @IsString()
    content: string;
}

export class CommentDto extends BaseCommentDto {
    @ApiProperty({
        description: 'commentAt'
    })
    @IsDateString()
    commentAt: Date;
}
