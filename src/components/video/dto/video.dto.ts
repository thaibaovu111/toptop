import { IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoPaginateDto {
    @ApiProperty()
    @IsOptional()
    search: string;

    @ApiProperty({
        default: 20
    })
    @IsOptional()
    @IsNumberString()
    limit: number;

    @ApiProperty({
        default: 0
    })
    @IsOptional()
    @IsNumberString()
    offset: number;
}
