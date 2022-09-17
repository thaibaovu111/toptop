import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatDto, UpdateChatDto } from './dto';
import { Chat } from './model/chat.schema';
import { PaginationQueryDto } from './dto/pagination.query.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<Chat>
    ) {}

    public async findAllByUser(
        user_id: string,
        paginationQuery: PaginationQueryDto
    ): Promise<any> {
        const { limit, offset } = paginationQuery;

        const chat = await this.chatModel
            .find({ user_id: user_id })
            .skip(offset)
            .limit(limit)
            .exec();
        return {
            code: 110003,
            data: chat,
            message: `Get chat by user successfully`
        };
    }

    public async findOne(chatId: string): Promise<any> {
        const Chat = await this.chatModel.findById({ _id: chatId }).exec();

        if (!Chat) {
            return {
                code: 110006,
                data: false,
                message: `Chat #${chatId} not found`
            };
        }

        return {
            code: 110007,
            data: Chat,
            message: 'OK'
        };
    }

    public async create(
        user_id: string,
        CreateChatDto: CreateChatDto
    ): Promise<any> {
        const dataInsert = {
            data: CreateChatDto.data,
            key: CreateChatDto.key,
            user_id: user_id,
            field1: CreateChatDto.field1,
            field2: CreateChatDto.field2
        };
        const newCustomer = await this.chatModel.create(dataInsert);
        return newCustomer;
    }

    public async update(
        chatId: string,
        UpdateChatDto: UpdateChatDto
    ): Promise<any> {
        const existingCustomer = await this.chatModel.findByIdAndUpdate(
            { _id: chatId },
            UpdateChatDto
        );

        if (!existingCustomer) {
            throw new NotFoundException(`Chat #${chatId} not found`);
        }

        return existingCustomer;
    }

    public async remove(chatId: string): Promise<any> {
        const deletedCustomer = await this.chatModel.findByIdAndRemove(chatId);
        return deletedCustomer;
    }
}
