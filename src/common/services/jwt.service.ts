import { Injectable } from '@nestjs/common';
import { JwtService as NestJSJwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../interfaces';

@Injectable()
export class JwtService {
    constructor(private readonly jwt: NestJSJwtService) {}

    signToken(phone: string, fullname: string): { access_token: string } {
        const payload: JwtPayload = {
            sub: phone,
            fullname
        };
        const secret = process.env.SECRET;

        const token = this.jwt.sign(payload, {
            expiresIn: '365d',
            secret: secret
        });

        return {
            access_token: token
        };
    }

    async signAsyncToken(
        phone: string,
        fullname: string
    ): Promise<{ access_token: string }> {
        const payload: JwtPayload = {
            sub: phone,
            fullname
        };
        const secret = process.env.SECRET;

        const token = await this.jwt.sign(payload, {
            expiresIn: '365d',
            secret: secret
        });

        return {
            access_token: token
        };
    }
}
