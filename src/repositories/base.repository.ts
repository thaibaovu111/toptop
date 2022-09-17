import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DynamicFilter, Paging } from 'src/interfaces';

@Injectable()
export class BaseRepository<T> {
    private baseModel: Model<T>;
    constructor(protected readonly model: Model<T>) {
        this.baseModel = model;
    }

    async getAll() {
        return await this.baseModel.find({});
    }

    async create<T>(entity: T) {
        return await this.baseModel.create(entity);
    }

    async update<T>(id: string, entity: T) {
        return await this.baseModel.findByIdAndUpdate(
            id,
            { $set: entity },
            { new: true }
        );
    }

    async updateMany<T>(filter: DynamicFilter, entity: T): Promise<any> {
        return await this.baseModel.updateMany(
            filter as any,
            { $set: entity },
            { multi: true }
        );
    }

    async paginateRecord(paging: Paging) {
        return await this.baseModel
            .find({})
            .skip(paging.offset)
            .limit(paging.limit);
    }

    async paginateRecordByField(filter: DynamicFilter, paging: Paging) {
        return await this.baseModel
            .find(filter as any)
            .skip(paging.offset)
            .limit(paging.limit);
    }

    async getById(id: string) {
        return await this.baseModel.findById(id);
    }

    async getOne(filter: DynamicFilter) {
        return await this.baseModel.findOne(filter as any);
    }

    async deleteById(id: string) {
        return await this.baseModel.findByIdAndDelete(id);
    }

    async deleteAlls(): Promise<any> {
        return await this.baseModel.deleteMany({});
    }

    async deleteMultipleByField(filter: DynamicFilter): Promise<any> {
        return await this.baseModel.deleteMany(filter as any);
    }

    async countByField(field: string) {
        const result = await this.baseModel.aggregate([
            {
                $group: {
                    _id: `$${field}`,
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    root: {
                        $push: {
                            k: '$_id',
                            v: '$count'
                        }
                    }
                }
            },
            {
                $replaceRoot: { newRoot: { $arrayToObject: '$root' } }
            }
        ]);
        return result.length > 0 ? result[0] : {};
    }
}
