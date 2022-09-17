import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { VideoModule } from './components/video/video.module';
import { DatabaseModule } from './database/database.module';
import { TwilioModule } from 'nestjs-twilio';
import { RedisCacheModule } from './components/redis/redis.module';
import { LiveModule } from './components/live/live.module';
import { GameModule } from './components/game/game.module';
import { SupportModule } from './components/support/support.module';
import { ChatModule } from './components/chat/chat.module';
import { SearchModule } from './components/search/search.module';
import { TagModule } from './components/tag/tag.module';
import { ImageModule } from './components/image/image.module';
import { BannerModule } from './components/banner/banner.module';
import * as dotenv from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import { HotModule } from './components/hot/hot.module';
dotenv.config();
@Module({
    imports: [
        TwilioModule.forRoot({
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN
        }),
        DatabaseModule.forRoot(),
        ConfigModule,
        LoggerModule,
        RedisCacheModule,
        LiveModule,
        AuthModule,
        GameModule,
        ChatModule,
        UserModule,
        SearchModule,
        SupportModule,
        VideoModule,
        TagModule,
        ImageModule,
        BannerModule,
        MulterModule.register({
            dest: './public/image'
        }),
        HotModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
