import { Module } from '@nestjs/common';
import { EdgeBandingController } from './edge-banding.controller';
import { EdgeBandingService } from './edge-banding.service';

@Module({
  controllers: [EdgeBandingController],
  providers: [EdgeBandingService],
  exports: [EdgeBandingService],
})
export class EdgeBandingModule {}

