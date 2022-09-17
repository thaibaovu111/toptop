import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
    @Prop()
    fullname: string;

    @Prop()
    sex: string;

    @Prop()
    birthdate: Date;

    @Prop()
    ip: string;

    @Prop({ type: [String] })
    mac: string[];

    @Prop()
    phone: string;

    @Prop({ type: 'array' })
    tag: [
        {
            name: string;
        }
    ];

    @Prop({ type: 'array' })
    like: [
        {
            url: string;
            isLive: number;
        }
    ];
}

export const UserSchema = SchemaFactory.createForClass(User);
