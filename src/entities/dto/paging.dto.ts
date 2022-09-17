import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString
} from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ default: 20 })
    limit: number;

    @IsOptional()
    @IsNumberString()
    @ApiProperty({ default: 0 })
    offset: number;
}

export class ReplyPaginationDto extends PaginationDto {
    @ApiProperty({ default: '' })
    @IsString()
    @IsNotEmpty()
    commentId: string;
}
