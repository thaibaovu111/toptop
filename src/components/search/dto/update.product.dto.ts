import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}
