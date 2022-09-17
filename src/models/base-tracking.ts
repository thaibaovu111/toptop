import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class BaseTracking {
    @ApiProperty({
        description: 'Updated by',
        required: false
    })
    @IsString()
    updatedBy?: string;

    @ApiProperty({
        description: 'CreatedBy by',
        required: false
    })
    @IsString()
    createdBy?: string;

    @ApiProperty({
        description: 'Created at',
        required: false
    })
    @IsDateString()
    createdAt?: Date;

    @ApiProperty({
        description: 'Updated at',
        required: false
    })
    @IsDateString()
    updatedAt?: Date;
}
