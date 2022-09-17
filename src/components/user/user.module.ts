import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from '../auth/strategy';
import { UserSchema, User } from 'src/entities';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '../../common';

@Module({
    imports: [
        JwtModule.register({ secret: process.env.SECRET }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [UserService, JwtStrategy, JwtService],
    controllers: [UserController]
})
export class UserModule {}
