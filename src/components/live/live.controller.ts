import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { LiveService } from './live.service';
import { Live } from './entity/Live.entity';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';

@ApiTags('live')
@ApiBearerAuth('Authorization')
@Controller('/api/v1/live')
@UseGuards(JwtGuard)
export class LiveController {
    constructor(private readonly liveService: LiveService) {}

    @ApiOperation({
        summary: 'Get list live'
    })
    @ApiResponse({
        status: 80002,
        description: 'Get list live failed'
    })
    @Get()
    public async getLiveList(): Promise<Live> {
        return this.liveService.getLiveList();
    }
}
