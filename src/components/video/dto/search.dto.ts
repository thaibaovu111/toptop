import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
    @IsNotEmpty()
    @ApiProperty()
    search: string;
}
