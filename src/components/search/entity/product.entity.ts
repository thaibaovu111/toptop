import { Metadata } from 'src/models';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
    @ObjectIdColumn()
    id: number;

    @Column({
        type: 'string'
    })
    name: string;

    @Column({
        type: 'string'
    })
    description: string;

    @Column({
        type: 'string'
    })
    url: string;

    @Column({
        type: 'string'
    })
    videoId: string;

    @Column({
        type: 'string'
    })
    previewImage: string;

    @Column({
        type: 'string'
    })
    tagId: string;

    @Column({
        type: 'string'
    })
    tag: string;

    @Column({
        type: 'datetime'
    })
    createdAt: Date;

    @Column({
        type: 'string'
    })
    createdBy: string;

    @Column({
        type: 'datetime'
    })
    updatedAt: Date;

    @Column({
        type: 'string'
    })
    updatedBy: string;

    @Column({
        type: 'number'
    })
    time: number;

    @Column({
        type: 'number'
    })
    type: number;

    @Column({
        type: 'raw'
    })
    metadata: Metadata;
}
