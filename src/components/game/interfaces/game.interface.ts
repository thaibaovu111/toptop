import { Document } from 'mongoose';

export interface IGame extends Document {
    readonly name: string;
    readonly url: string;
    readonly image: string;
}
