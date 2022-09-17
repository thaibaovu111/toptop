import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/entities';

export type CommentDocument = Comment & Document;

@Schema({
    timestamps: {}
})
export class Comment extends Document {
    @Prop({ required: true, name: 'videoId', default: '' })
    videoId: string;

    @Prop({ required: true, name: 'author', type: Types.ObjectId, ref: 'User' })
    author: User;

    @Prop({ required: true, name: 'content' })
    content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
