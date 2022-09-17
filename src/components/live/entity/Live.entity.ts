import { Column, Entity } from 'typeorm';

@Entity({ name: 'videos' })
export class Live {
    @Column({
        type: 'string'
    })
    message: string;

    @Column({
        type: 'number'
    })
    status: number;

    @Column({
        type: 'string'
    })
    token: string;

    @Column({
        type: 'string'
    })
    email: string;

    @Column()
    streamKey: any;

    @Column()
    data: any;

    @Column()
    code: number;
}
