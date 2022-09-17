import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema, Chat } from './model/chat.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
    ],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule {}