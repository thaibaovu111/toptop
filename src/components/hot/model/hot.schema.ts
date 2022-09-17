import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Hot extends Document {
    @Prop()
    trend: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const HotSchema = SchemaFactory.createForClass(Hot);
