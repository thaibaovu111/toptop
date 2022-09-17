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
import { ChatService } from './chat.service';
import { CreateChatDto, UpdateChatDto } from './dto';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { JwtGuard } from '../auth/guard';

@ApiTags('chat')
@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@Controller('/api/v1/chat')
export class ChatController {
    constructor(private ChatService: ChatService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all chats by user'
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
        status: 110003,
        description: 'Get chat by user successfully'
    })
    public async getAllChatByUser(
        @Req() req,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return await this.ChatService.findAllByUser(
            req.user._id,
            paginationQuery
        );
    }

    @ApiOperation({
        summary: 'Get chat by id'
    })
    @ApiResponse({
        status: 110007,
        description: 'Get chat by id success'
    })
    @ApiResponse({
        status: 110006,
        description: 'Chat ID does not exist'
    })
    @Get('/:id')
    public async getChat(@Param('id') chatId: string) {
        return await this.ChatService.findOne(chatId);
    }

    @ApiOperation({
        summary: 'Add new chat'
    })
    @ApiResponse({
        status: 110001,
        description: 'Chat has been created successfully'
    })
    @ApiResponse({
        status: 110004,
        description: 'Error: Chat not created!'
    })
    @Post()
    public async addChat(
        @Res() res,
        @Req() req,
        @Body() CreateChatDto: CreateChatDto
    ) {
        try {
            const Chat = await this.ChatService.create(
                req.user._id,
                CreateChatDto
            );
            return res.status(HttpStatus.OK).json({
                code: 110001,
                message: 'Chat has been created successfully',
                Chat
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: 110004,
                data: false,
                message: 'Error: Chat not created!'
            });
        }
    }

    @ApiOperation({
        summary: 'Update chat by id'
    })
    @ApiResponse({
        status: 110002,
        description: 'Chat has been successfully updated'
    })
    @ApiResponse({
        status: 110005,
        description: 'Error: Chat not updated!'
    })
    @ApiResponse({
        status: 110006,
        description: 'Chat ID does not exist'
    })
    @Put('/:id')
    public async updateChat(
        @Res() res,
        @Param('id') chatId: string,
        @Body() UpdateChatDto: UpdateChatDto
    ) {
        try {
            const Chat = await this.ChatService.update(chatId, UpdateChatDto);
            if (!Chat) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    code: 110006,
                    data: false,
                    message: 'Chat does not exist!'
                });
            }
            return res.status(HttpStatus.OK).json({
                code: 110002,
                message: 'Chat has been successfully updated',
                Chat
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error: Chat not updated!',
                code: 110005
            });
        }
    }

    @ApiOperation({
        summary: 'Delete chat by id'
    })
    @ApiResponse({
        status: 110007,
        description: 'Chat has been deleted'
    })
    @ApiResponse({
        status: 110006,
        description: 'Chat ID does not exist'
    })
    @Delete('/:id')
    public async deleteChat(@Res() res, @Param('id') chatId: string) {
        if (!chatId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: 110006,
                data: false,
                message: 'Chat does not exist!'
            });
        }

        const Chat = await this.ChatService.remove(chatId);

        return res.status(HttpStatus.OK).json({
            code: 110007,
            message: 'Chat has been deleted',
            Chat
        });
    }
}
