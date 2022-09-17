import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema, User } from 'src/entities';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '../../common';
import { UserService } from '../user/user.service';
@Module({
    imports: [
        JwtModule.register({ secret: process.env.SECRET }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [AuthService, JwtService, UserService],
    controllers: [AuthController]
})
export class AuthModule {}
