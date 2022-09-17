import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSupportDto, UpdateSupportDto } from './dto';
import { Support } from './model/support.schema';
import { PaginationQueryDto } from './dto/pagination.query.dto';

@Injectable()
export class SupportService {
    constructor(
        @InjectModel(Support.name)
        private readonly supportModel: Model<Support>
    ) {}

    public async findAllByUser(
        user_id: string,
        paginationQuery: PaginationQueryDto
    ): Promise<any> {
        const { limit, offset } = paginationQuery;

        const support = await this.supportModel
            .find({ user_id: user_id })
            .skip(offset)
            .limit(limit)
            .exec();
        return {
            code: 120003,
            data: support,
            message: `Get support by user successfully`
        };
    }

    public async findOne(supportId: string): Promise<any> {
        try {
            const Support = await this.supportModel.findOne({ _id: supportId });
            return {
                code: 120007,
                data: Support,
                message: 'OK'
            };
        } catch (error) {
            return {
                code: 120006,
                data: false,
                message: `Support #${supportId} not found`
            };
        }
    }

    public async create(
        user_id: string,
        CreateSupportDto: CreateSupportDto
    ): Promise<any> {
        const dataInsert = {
            title: CreateSupportDto.title,
            body: CreateSupportDto.body,
            user_id: user_id
        };
        const newCustomer = await this.supportModel.create(dataInsert);
        return newCustomer;
    }

    public async update(
        supportId: string,
        UpdateSupportDto: UpdateSupportDto
    ): Promise<any> {
        try {
            const existingCustomer = await this.supportModel.findByIdAndUpdate(
                { _id: supportId },
                UpdateSupportDto
            );
            return existingCustomer;
        } catch (error) {
            throw new NotFoundException(`Support #${supportId} not found`);
        }
    }

    public async remove(supportId: string): Promise<any> {
        const deletedCustomer = await this.supportModel.findByIdAndRemove(
            supportId
        );
        return deletedCustomer;
    }
}
