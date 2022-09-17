import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchProductDto {
    @IsNotEmpty()
    @ApiProperty()
    search: string;

    @IsOptional()
    @IsPositive()
    @ApiProperty({ default: 10 })
    @Transform(({ value }) => Number(value))
    limit: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ default: 0 })
    @Transform(({ value }) => Number(value))
    offset: number;
}
