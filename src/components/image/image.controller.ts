import { Controller, Res, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { join } from 'path';
import * as fs from 'fs';

@ApiTags('image')
@Controller('image')
export class ImageController {
    // @Get(':filename')
    // @ApiOperation({
    //     summary: 'Get image'
    // })
    // async getImage(
    //     @Param('filename') filename: string,
    //     @Res() res
    // ): Promise<any> {
    //     try {
    //         const buff = fs.readFileSync(`${process.env.PATH_SERVER_UPLOAD_FILE}/${filename}`)
    //         if (buff) {
    //             res.sendFile(`${process.env.PATH_SERVER_UPLOAD_FILE}/${filename}`);
    //         } else {
    //             throw new NotFoundException();
    //         }
    //     } catch (error) {
    //         throw new NotFoundException(error);
    //     }
    // }
}
