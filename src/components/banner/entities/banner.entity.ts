import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Banner extends Document {
    _id: string;

    @Prop({ required: false, name: 'createdAt' })
    createdAt: Date;

    @Prop({ required: false, name: 'updatedAt' })
    updatedAt: Date;

    @Prop({ required: false, name: 'status' })
    status: string;

    @Prop({ required: false, name: 'imageUrl', default: '' })
    imageUrl: string;

    @Prop({ required: false, name: 'template' })
    template: string;

    @Prop({ required: false, name: 'transparent' })
    transparent: boolean;

    @Prop({ type: Object })
    metadata: BannerMetadata;

    @Prop({ required: false, name: 'title' })
    title: string;

    @Prop({ required: false, name: 'campaignId' })
    campaignId: string;

    @Prop({ required: false, name: 'startDate' })
    startDate: Date;

    @Prop({ required: false, name: 'endDate' })
    endDate: Date;

    @Prop({ required: false, name: 'hidden' })
    hidden: boolean;

    @Prop({ required: false, name: 'createdBy' })
    createdBy: string;

    @Prop({ required: false, name: 'updatedBy' })
    updatedBy: string;
}

export interface BannerMetadata {
    description: string;
    title: string;
    image: {
        url: string;
        name: string;
    };
}

const BannerSchema = SchemaFactory.createForClass(Banner);

export { BannerSchema };
