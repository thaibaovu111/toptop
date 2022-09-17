import { Module, HttpModule } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';

@Module({
    imports: [HttpModule],
    providers: [LiveService],
    controllers: [LiveController]
})
export class LiveModule {}
