import {
    Controller,
    Get,
    Res,
    HttpStatus,
    Post,
    Body,
    Put,
    Delete,
    Param,
    Query,
    UseGuards
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery
} from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { JwtGuard } from '../auth/guard';

@ApiTags('game')
@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@Controller('/api/v1/game')
export class GameController {
    constructor(private GameService: GameService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all games'
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
    public async getAllGame(@Query() paginationQuery: PaginationQueryDto) {
        return await this.GameService.findAll(paginationQuery);
    }

    @ApiOperation({
        summary: 'Get game by id'
    })
    @ApiResponse({
        status: 50007,
        description: 'Game not found'
    })
    @ApiResponse({
        status: 50009,
        description: 'Get game success'
    })
    @Get('/:id')
    public async getGame(@Param('id') gameId: string) {
        return await this.GameService.findOne(gameId);
    }

    @ApiOperation({
        summary: 'Add new game'
    })
    @ApiResponse({
        status: 50001,
        description: 'Game has been created successfully'
    })
    @ApiResponse({
        status: 50004,
        description: 'Error: Game not created!'
    })
    @Post()
    public async addGame(@Res() res, @Body() CreateGameDto: CreateGameDto) {
        try {
            const Game = await this.GameService.create(CreateGameDto);
            return res.status(HttpStatus.OK).json({
                code: 50001,
                message: 'Game has been created successfully',
                Game
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: 50004,
                data: false,
                message: 'Error: Game not created!'
            });
        }
    }

    @ApiOperation({
        summary: 'Update game by id'
    })
    @ApiResponse({
        status: 50002,
        description: 'Game has been successfully updated'
    })
    @ApiResponse({
        status: 50005,
        description: 'Error: Game not updated!'
    })
    @ApiResponse({
        status: 50007,
        description: 'Game ID does not exist'
    })
    @Put('/:id')
    public async updateGame(
        @Res() res,
        @Param('id') gameId: string,
        @Body() UpdateGameDto: UpdateGameDto
    ) {
        try {
            const Game = await this.GameService.update(gameId, UpdateGameDto);
            if (!Game) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    code: 50007,
                    data: false,
                    message: 'Game does not exist!'
                });
            }
            return res.status(HttpStatus.OK).json({
                code: 50002,
                message: 'Game has been successfully updated',
                Game
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error: Game not updated!',
                code: 50005
            });
        }
    }

    @ApiOperation({
        summary: 'Delete game by id'
    })
    @ApiResponse({
        status: 50007,
        description: 'Game does not exist!'
    })
    @ApiResponse({
        status: 50008,
        description: 'Game has been deleted'
    })
    @Delete('/:id')
    public async deleteGame(@Res() res, @Param('id') gameId: string) {
        if (!gameId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: 50007,
                data: false,
                message: 'Game does not exist!'
            });
        }

        const Game = await this.GameService.remove(gameId);

        return res.status(HttpStatus.OK).json({
            code: 50008,
            message: 'Game has been deleted',
            Game
        });
    }
}
