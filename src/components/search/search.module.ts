import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from '../video/model/video.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }])
    ],
    providers: [SearchService],
    controllers: [SearchController],
    exports: [SearchModule]
})
export class SearchModule {}
