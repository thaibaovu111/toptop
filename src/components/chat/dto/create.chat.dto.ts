import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateChatDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    readonly data: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    readonly key: string;

    @ApiProperty()
    @IsString()
    readonly field1: string;

    @ApiProperty()
    @IsString()
    readonly field2: string;
}
