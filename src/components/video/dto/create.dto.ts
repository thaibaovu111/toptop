import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    ValidateIf,
    IsDateString
} from 'class-validator';

export class CreateVideoDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    preview: string;

    @IsString()
    @IsNotEmpty()
    previewImage: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    tag: string;

    @IsString()
    @IsOptional()
    @ValidateIf(
        (object, value) =>
            value !== null && value !== undefined && value.length > 0
    )
    updatedBy?: string;

    @IsString()
    @IsOptional()
    @ValidateIf(
        (object, value) =>
            value !== null && value !== undefined && value.length > 0
    )
    createdBy?: string;

    @IsDateString()
    @IsOptional()
    @ValidateIf((object, value) => value !== null && value !== undefined)
    createdAt?: Date;

    @IsDateString()
    @IsOptional()
    @ValidateIf((object, value) => value !== null && value !== undefined)
    updatedAt?: Date;
}
