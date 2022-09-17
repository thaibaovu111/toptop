import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ default: 20 })
    limit: number;

    @IsOptional()
    @IsNumberString()
    @ApiProperty({ default: 0 })
    offset: number;
}
