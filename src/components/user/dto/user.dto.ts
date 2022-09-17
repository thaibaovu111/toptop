import {
    IsString,
    IsDateString,
    Length,
    Matches,
    IsEmail,
    ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({
        description: 'Birthday of user'
    })
    @IsDateString()
    birthdate: Date;

    @ApiProperty({
        description: 'M: male, F: female'
    })
    @IsString()
    @Matches(/[M|F]/, {
        message: 'no gender specified'
    })
    sex: string;

    @ApiProperty({
        description: 'Fullname of user'
    })
    @IsString()
    @Length(0, 30, {
        message: 'Full name must be less than 30 characters'
    })
    @Matches(
        /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/i,
        {
            message: 'Invalid username'
        }
    )
    fullname: string;

    @ApiProperty({
        description: 'Email'
    })
    @IsString()
    @IsEmail()
    @ValidateIf((object, value) => value !== null && value !== undefined)
    email!: string;
}
