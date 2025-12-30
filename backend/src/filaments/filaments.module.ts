import { Module } from '@nestjs/common';
import { FilamentsController } from './filaments.controller';
import { FilamentsService } from './filaments.service';

@Module({
  controllers: [FilamentsController],
  providers: [FilamentsService],
})
export class FilamentsModule {}
