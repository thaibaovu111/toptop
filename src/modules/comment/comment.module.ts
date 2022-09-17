import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from 'src/controllers';
import { Comment, CommentSchema, Reply, ReplySchema } from 'src/entities';
import { CommentRepository, ReplyRepository } from 'src/repositories';
import { CommentService } from 'src/services';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Comment.name,
                schema: CommentSchema
            },
            {
                name: Reply.name,
                schema: ReplySchema
            }
        ])
    ],
    controllers: [CommentController],
    providers: [CommentRepository, ReplyRepository, CommentService],
    exports: [CommentService, CommentRepository, ReplyRepository]
})
export class CommentModule {}
