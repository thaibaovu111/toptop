import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
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

    @Prop()
    email: string;

    @Prop({ type: [String] })
    mac: string[];

    @Prop()
    phone: string;

    @Prop({ type: Object })
    metadata: {
        url: string;
        name: string;
    };

    @Prop()
    socialId: string;

    @Prop()
    isGoogle: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
