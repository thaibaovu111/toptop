import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, VerifyDto, SocialDto, SignInDto } from './dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { STATUSCODE } from '../../constants';
@ApiTags('auth')
@Controller('/api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: 'Register user'
    })
    @ApiResponse({
        status: STATUSCODE.USER_CREATE_SUCCESS_401,
        description: `Create a user successfully`
    })
    @ApiResponse({
        status: STATUSCODE.REGISTER_SUCCESS_806,
        description: `Register success`
    })
    @ApiResponse({
        status: STATUSCODE.REGISTED_FAILED_802,
        description: `Register failed`
    })
    @Post('register')
    async signup(@Body() dto: AuthDto) {
        return await this.authService.signup(dto);
    }

    @ApiOperation({
        summary: 'Verify phone number'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_IS_NEW_801,
        description: 'Verify phone number successfully'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_USED_ANOTHER_DEVICE_803,
        description: 'the another device'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_USED_OLD_DEVICE_804,
        description: 'The old device'
    })
    @Post('verify-phone-number')
    async verifyPhoneNumber(@Body() verifyDto: VerifyDto) {
        return await this.authService.verifyPhoneNumber(verifyDto);
    }

    @ApiOperation({
        summary: 'Register social network'
    })
    @ApiResponse({
        status: STATUSCODE.REGISTER_SOCIAL_SUCCESS_805,
        description: 'Registered by social successfully'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_USED_ANOTHER_DEVICE_803,
        description: 'the another device'
    })
    @ApiResponse({
        status: STATUSCODE.PHONE_USED_OLD_DEVICE_804,
        description: 'The old device'
    })
    @ApiResponse({
        status: STATUSCODE.REGISTER_IN_NEW_DEVICE_807,
        description: 'The new device'
    })
    @Post('social-network')
    async socialNetwork(@Body() socialDto: SocialDto) {
        return await this.authService.socialNetwork(socialDto);
    }

    @ApiOperation({
        summary: 'Signin application'
    })
    @ApiResponse({
        status: STATUSCODE.NOTFOUND_PHONE_OR_MAC_810,
        description: 'Not found phone number or MAC address of device'
    })
    @ApiResponse({
        status: STATUSCODE.SIGNIN_SUCCESS_811,
        description: 'Signin successfully'
    })
    @Post('signIn')
    async signIn(@Body() signIn: SignInDto) {
        return await this.authService.signIn(signIn);
    }
}
