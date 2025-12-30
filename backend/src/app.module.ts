import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FilamentsModule } from './filaments/filaments.module';
import { PrintersModule } from './printers/printers.module';
import { NozzlesModule } from './nozzles/nozzles.module';
import { ModelsModule } from './models/models.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FilamentsModule,
    PrintersModule,
    NozzlesModule,
    ModelsModule,
    DashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
