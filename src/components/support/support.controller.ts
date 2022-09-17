import {
    Controller,
    Get,
    Res,
    HttpStatus,
    Post,
    Body,
    Put,
    NotFoundException,
    Delete,
    Param,
    Query,
    UseGuards,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery
} from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateSupportDto, UpdateSupportDto } from './dto';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { JwtGuard } from '../auth/guard';

@ApiTags('support')
@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@Controller('/api/v1/support')
export class SupportController {
    constructor(private SupportService: SupportService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all supports by user'
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        description: 'enter limit of record',
        required: true
    })
    @ApiQuery({
        name: 'offset',
        type: 'number',
        description: 'enter offset of record',
        required: true
    })
    @ApiResponse({
        status: 120003,
        description: 'Get support by user successfully'
    })
    public async getAllSupportByUser(
        @Req() req,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return await this.SupportService.findAllByUser(
            req.user._id,
            paginationQuery
        );
    }

    @ApiOperation({
        summary: 'Get support by id'
    })
    @ApiResponse({
        status: 120007,
        description: 'OK'
    })
    @ApiResponse({
        status: 120006,
        description: 'Support does not exist!'
    })
    @Get('/:id')
    public async getSupport(@Param('id') supportId: string) {
        return await this.SupportService.findOne(supportId);
    }

    @ApiOperation({
        summary: 'Add new support'
    })
    @ApiResponse({
        status: 120001,
        description: 'Support has been created successfully'
    })
    @ApiResponse({
        status: 120004,
        description: 'Error: Support not created!'
    })
    @Post()
    public async addSupport(
        @Res() res,
        @Req() req,
        @Body() CreateSupportDto: CreateSupportDto
    ) {
        try {
            const Support = await this.SupportService.create(
                req.user._id,
                CreateSupportDto
            );
            return res.status(HttpStatus.OK).json({
                code: 120001,
                message: 'Support has been created successfully',
                Support
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: 120004,
                data: false,
                message: 'Error: Support not created!'
            });
        }
    }

    @ApiOperation({
        summary: 'Update support by id'
    })
    @ApiResponse({
        status: 120002,
        description: 'Support has been successfully updated'
    })
    @ApiResponse({
        status: 120006,
        description: 'Support does not exist!'
    })
    @Put('/:id')
    public async updateSupport(
        @Res() res,
        @Param('id') supportId: string,
        @Body() UpdateSupportDto: UpdateSupportDto
    ) {
        try {
            const Support = await this.SupportService.update(
                supportId,
                UpdateSupportDto
            );
            if (!Support) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    code: 120006,
                    data: false,
                    message: 'Support does not exist!'
                });
            }
            return res.status(HttpStatus.OK).json({
                code: 120002,
                message: 'Support has been successfully updated',
                Support
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error: Support not updated!',
                code: 120005
            });
        }
    }

    @ApiOperation({
        summary: 'Delete support by id'
    })
    @ApiResponse({
        status: 120006,
        description: 'Support does not exist!'
    })
    @ApiResponse({
        status: 120007,
        description: 'Support has been deleted'
    })
    @Delete('/:id')
    public async deleteSupport(@Res() res, @Param('id') supportId: string) {
        if (!supportId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: 120006,
                data: false,
                message: 'Support does not exist!'
            });
        }

        const Support = await this.SupportService.remove(supportId);

        return res.status(HttpStatus.OK).json({
            code: 120007,
            message: 'Support has been deleted',
            Support
        });
    }
}
