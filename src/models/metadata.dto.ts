import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Metadata {
    @ApiProperty({
        description: 'uri'
    })
    @IsNotEmpty()
    @IsString()
    url: string;

    @ApiProperty({
        description: 'metadata name'
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}
