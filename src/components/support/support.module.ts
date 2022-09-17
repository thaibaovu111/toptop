import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportSchema, Support } from './model/support.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Support.name, schema: SupportSchema }
        ])
    ],
    controllers: [SupportController],
    providers: [SupportService]
})
export class SupportModule {}
