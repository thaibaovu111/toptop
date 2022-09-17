import { Module } from '@nestjs/common';
import { HotController } from './hot.controller';
import { HotService } from './hot.service';
import { Hot, HotSchema } from './model/hot.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Hot.name, schema: HotSchema }])
    ],
    controllers: [HotController],
    providers: [HotService]
})
export class HotModule {}
