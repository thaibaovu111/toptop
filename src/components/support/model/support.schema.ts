import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Support extends Document {
    @Prop()
    title: string;

    @Prop()
    body: string;

    @Prop()
    user_id: string;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
