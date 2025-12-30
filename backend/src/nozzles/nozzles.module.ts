import { Module } from '@nestjs/common';
import { NozzlesController } from './nozzles.controller';
import { NozzlesService } from './nozzles.service';

@Module({
  controllers: [NozzlesController],
  providers: [NozzlesService],
})
export class NozzlesModule {}
