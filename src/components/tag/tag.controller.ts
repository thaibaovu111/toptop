import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    Query,
    UseGuards,
    Param,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiQuery,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagDto, TagUpdateDto } from './dto';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { JwtGuard } from '../auth/guard';
import { STATUSCODE } from 'src/constants';

@ApiTags('tag')
@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@Controller('/api/v1/tag')
export class TagController {
    constructor(private tagService: TagService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all tags'
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
        status: STATUSCODE.TAG_LIST_SUCCESS_105,
        description: 'Get all tag success'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_LIST_FAIL_106,
        description: 'Get list tag failed'
    })
    public async getTags(@Query() paginationQuery: PaginationQueryDto) {
        return await this.tagService.findTagsPaginate(paginationQuery);
    }

    @ApiResponse({
        status: STATUSCODE.TAG_READ_SUCCESS_110,
        description: 'Get tag success'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_READ_FAIL_111,
        description: 'Get tag failed'
    })
    @Get(':tagId')
    public async getTag(@Param('tagId') tagId: string) {
        return await this.tagService.getTag(tagId);
    }

    @ApiOperation({
        summary: 'Add new tag'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_CREATE_SUCCESS_101,
        description: 'Tag has been created successfully'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_CREATE_FAIL_102,
        description: 'Tag create failed!'
    })
    @Post()
    public async createTag(@Req() req, @Body() tagDto: TagDto) {
        return await this.tagService.create(req.user.id, tagDto);
    }

    @ApiOperation({
        summary: 'Update tag by id'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_UPDATE_SUCCESS_103,
        description: 'Tag update successfully'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_UPDATE_FAIL_104,
        description: 'Tag update failed!'
    })
    @Put(':tagId')
    public async updateTag(
        @Req() req,
        @Param('tagId') tagId: string,
        @Body() tagUpdateDto: TagUpdateDto
    ) {
        return await this.tagService.update(req.user.id, tagId, tagUpdateDto);
    }

    @ApiOperation({
        summary: 'Delete tag by id'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_DELETE_SUCCESS_107,
        description: 'Tag has been deleted'
    })
    @ApiResponse({
        status: STATUSCODE.TAG_DELETE_FAIL_108,
        description: 'Delete tag failed'
    })
    @Delete(':tagId')
    public async deleteTag(@Param('tagId') tagId: string) {
        return await this.tagService.deleteTag(tagId);
    }
}
