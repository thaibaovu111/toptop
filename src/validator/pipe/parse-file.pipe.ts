import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException
} from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class ParseFilePipe implements PipeTransform {
    transform(
        file: Express.Multer.File,
        metadata: ArgumentMetadata
    ): Express.Multer.File {
        if (file === undefined || file === null) {
            throw new BadRequestException('Validation failed (file expected)');
        }

        return file;
    }
}
