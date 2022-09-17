import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { generateRandomSixDigitsNumber } from './randon-number';
import { RedisCacheService } from './redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
    public constructor(
        @InjectTwilio() private readonly client: TwilioClient,
        private redisCacheService: RedisCacheService
    ) {}

    async sendSMS(phoneNumber: string) {
        const randomNumber = generateRandomSixDigitsNumber();
        // const message = `Hello from TopTop! Your verification code is: ${randomNumber}`;
        const message = `Xin chao! Tin nhan den tu TOPTOP day la ma xac nhan cua ban. Vui long! Khong chia se voi bat ky ai: ${randomNumber}`;
        await this.redisCacheService.setCode(phoneNumber, randomNumber);

        try {
            return await this.client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                // messagingServiceSid: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
        } catch (e) {
            return e;
        }
    }

    async verifyCode(recipientPhoneNumber: string, smsCode: string) {
        let value = await this.redisCacheService.get(recipientPhoneNumber);
        value = String(value);
        const smsCodeReceived = String(smsCode);

        if (value === smsCodeReceived) {
            await this.redisCacheService.del(recipientPhoneNumber);

            return true;
        }

        return false;
    }
}
