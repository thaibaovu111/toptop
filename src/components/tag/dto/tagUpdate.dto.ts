import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsString,
    MaxLength,
    ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TagUpdateDto {
    @ApiProperty({
        description: 'Name of tag'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @ApiProperty({
        description: 'Tag related',
        required: false,
        default: []
    })
    @IsArray()
    @ValidateIf((object, value) => value !== null)
    tagRelate: [
        {
            tagId: string;
            tagName: string;
        }
    ];

    @ApiProperty({
        description: 'Tag category',
        required: false,
        default: ''
    })
    @IsString()
    @ValidateIf((object, value) => value !== null)
    tagCategory: string;
}
