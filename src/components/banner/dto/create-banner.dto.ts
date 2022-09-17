import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsString, ValidateIf } from 'class-validator';
import { BannerMetadata } from '../entities/banner.entity';

export class CreateBannerDto {
    @ApiProperty()
    @IsString()
    status?: string;

    @ApiProperty({
        required: false,
        default: ''
    })
    @IsString()
    @ValidateIf((object, value) => value !== null && value !== undefined)
    imageUrl?: string;

    @ApiProperty()
    @IsString()
    template?: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @Transform((value) => Boolean(value))
    transparent?: boolean;

    @ApiProperty({ required: false })
    metadata?: BannerMetadata;

    @ApiProperty()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsString()
    campaignId?: string;

    @ApiProperty()
    @IsString()
    startDate?: Date;

    @ApiProperty()
    @IsString()
    endDate?: Date;

    @ApiProperty()
    @IsBoolean()
    @Transform((value) => Boolean(value))
    hidden?: boolean;
}
