import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/entities';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../../../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectModel(User.name) private authModel: Model<User>,
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET,
            ignoreExpiration: false
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findByPhoneNumber(payload.sub);
        if (!user) {
            return new UnauthorizedException();
        }
        return user;
    }
}
