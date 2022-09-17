import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Chat extends Document {
    @Prop()
    data: string;

    @Prop()
    key: string;

    @Prop()
    user_id: string;

    @Prop()
    field1: string;

    @Prop()
    field2: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
