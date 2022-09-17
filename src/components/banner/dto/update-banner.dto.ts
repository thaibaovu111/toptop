import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from './create-banner.dto';
import { IsBoolean, IsString, ValidateIf } from 'class-validator';
import { BannerMetadata } from '../entities/banner.entity';
import { Transform } from 'class-transformer';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
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
    @ValidateIf((object, value) => value !== null)
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

    @ApiProperty({ default: false })
    @IsBoolean()
    @Transform((value) => Boolean(value))
    hidden?: boolean;
}
