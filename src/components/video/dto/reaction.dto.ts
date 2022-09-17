import { IsString, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionDto {
    @ApiProperty({
        description: '_id of video (streamKey if is live stream)'
    })
    @IsString()
    videoId: string;

    @ApiProperty({
        description: 'URL of video'
    })
    @IsString()
    @IsUrl()
    url: string;

    @ApiProperty({
        description: 'type of video',
        default: false
    })
    @IsBoolean()
    isLive: boolean;
}
