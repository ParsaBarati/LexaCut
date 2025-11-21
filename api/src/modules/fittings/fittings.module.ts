import { Module } from '@nestjs/common';
import { FittingsController } from './fittings.controller';
import { FittingsService } from './fittings.service';

@Module({
  controllers: [FittingsController],
  providers: [FittingsService],
  exports: [FittingsService],
})
export class FittingsModule {}

