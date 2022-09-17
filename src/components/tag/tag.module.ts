import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagSchema, Tag } from './model/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        JwtModule.register({ secret: process.env.SECRET }),
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])
    ],
    providers: [TagService],
    controllers: [TagController]
})
export class TagModule {}
