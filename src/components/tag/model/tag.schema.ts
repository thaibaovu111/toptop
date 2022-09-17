import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Tag extends Document {
    @Prop()
    name: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;

    @Prop({ type: Array })
    tagRelate: [];

    @Prop()
    createdBy: string;

    @Prop()
    tagCategory: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
