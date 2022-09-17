import {
    IsNotEmpty,
    IsString,
    IsDateString,
    IsEmail,
    Length,
    Matches,
    ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    ip: string;

    @ApiProperty()
    @IsString()
    mac: string;

    @ApiProperty({
        description: 'Phone number of user'
    })
    @IsNotEmpty()
    @IsString()
    phone: string;

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
    @IsEmail()
    @ValidateIf((object, value) => value !== null)
    email!: string;
}
