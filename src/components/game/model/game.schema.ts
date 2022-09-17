import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Game extends Document {
    @Prop()
    name: string;

    @Prop()
    url: string;

    @Prop()
    image: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
