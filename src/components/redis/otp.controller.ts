import { Controller, Post, HttpCode, Body, Query, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOtpDto } from './creat.otp.dto';
import { VerifyOtpDto } from './verify.opt.dto';
@ApiTags('OTP')
@Controller('/api/v1/otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @ApiOperation({
        summary: 'Send sms otp to phone number'
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully'
    })
    @Post('/send-code')
    async sendCode(@Body() CreateOtpDto: CreateOtpDto) {
        const data = await this.otpService.sendSMS(CreateOtpDto.phoneNumber);

        return {
            code: 200,
            data: data,
            message: 'Successfully'
        };
    }

    @ApiOperation({
        summary: 'Verify otp'
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully'
    })
    @HttpCode(200)
    @Post('/verify-code')
    async verifyCode(@Body() verifyOtpDto: VerifyOtpDto) {
        const data = await this.otpService.verifyCode(
            verifyOtpDto.phoneNumber,
            verifyOtpDto.smsCode
        );

        return {
            code: 200,
            data: data,
            message: 'Successfully'
        };
    }
}
