import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileNameQueryDto {
    @IsNotEmpty()
    @ApiProperty()
    fileName: string;
}
