import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/entities';
import { Comment } from './comment.schema';

export type ReplyDocument = Reply & Document;

@Schema({
    timestamps: {}
})
export class Reply extends Document {
    @Prop({ required: true, name: 'videoId', default: '' })
    videoId: string;

    @Prop({ required: true, name: 'author', type: Types.ObjectId, ref: 'User' })
    author: User;

    @Prop({ required: true, name: 'content' })
    content: string;

    @Prop({
        required: true,
        name: 'parent',
        type: Types.ObjectId,
        ref: 'Comment'
    })
    parent: Comment;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
