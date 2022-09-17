import { Document } from 'mongoose';

export interface IHot extends Document {
    readonly trend: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
