import {
    IsNotEmptyObject,
    IsOptional,
    IsString,
    ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvataDto {
    @ApiProperty({
        description: 'avatar of user'
    })
    @IsNotEmptyObject()
    @ValidateIf((object, value) => value !== null)
    metadata: {
        url: string;
        name: string;
    };
}
