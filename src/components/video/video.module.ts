import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Reaction,
    ReactionSchema,
    Bookmark,
    BookmarkSchema
} from 'src/entities';
import { Video, VideoSchema } from './model/video.schema';
import { HotService } from '../hot/hot.service';
import { Hot, HotSchema } from '../hot/model/hot.schema';
import { CommentService } from 'src/services';
import { CommentModule } from 'src/modules';
import { BookmarkRepository, ReactionRepository } from 'src/repositories';
@Module({
    imports: [
        HttpModule,
        JwtModule.register({ secret: process.env.SECRET }),
        MongooseModule.forFeature([
            { name: Video.name, schema: VideoSchema },
            {
                name: Reaction.name,
                schema: ReactionSchema
            },
            {
                name: Bookmark.name,
                schema: BookmarkSchema
            },
            { name: Hot.name, schema: HotSchema }
        ]),
        CommentModule
    ],
    providers: [
        VideoService,
        HotService,
        CommentService,
        ReactionRepository,
        BookmarkRepository
    ],
    controllers: [VideoController]
})
export class VideoModule {}
