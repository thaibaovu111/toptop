import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookmarkDocument = Bookmark & Document;

@Schema()
export class Bookmark extends Document {
    @Prop()
    url: string;

    @Prop()
    userId: string;

    @Prop()
    bookmarkDate?: Date;

    @Prop()
    isLive: boolean;

    @Prop()
    videoId: string;

    @Prop()
    previewImage: string | null | undefined;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
