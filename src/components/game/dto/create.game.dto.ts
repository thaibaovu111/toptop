import { MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateGameDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly url: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly image: string;
}
