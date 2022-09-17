import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateSupportDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty()
    @IsString()
    @MaxLength(2000)
    @IsNotEmpty()
    readonly body: string;
}
