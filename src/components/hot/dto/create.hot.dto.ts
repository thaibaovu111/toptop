import { MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';

export class CreateHotDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    readonly trend: string;

    readonly createdAt: Date = moment().toDate();
    readonly updatedAt: Date = moment().toDate();
}
