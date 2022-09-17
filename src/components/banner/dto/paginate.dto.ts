import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginateQueryDto {
    @IsOptional()
    @IsPositive()
    @Transform((value) => Number(value))
    limit: number;

    @IsOptional()
    @Transform((value) => Number(value))
    @IsNumber()
    offset: number;
}
