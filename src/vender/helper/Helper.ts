import path = require('path');
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
    dest: './public/image'
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    // limits: {
    //     fileSize: +process.env.MAX_FILE_SIZE,
    // },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(
                new HttpException(
                    `Unsupported file type ${
                        path.parse(file.originalname).ext
                    }`,
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE
                ),
                false
            );
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path detailss
        destination: './public/image',
        // File modification details
        filename: (req: any, file: Express.Multer.File, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            const filename: string = uuid();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })
};
