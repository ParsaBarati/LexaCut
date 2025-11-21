import { Module } from '@nestjs/common';
import { CNCOperationsController } from './cnc-operations.controller';
import { CNCOperationsService } from './cnc-operations.service';

@Module({
  controllers: [CNCOperationsController],
  providers: [CNCOperationsService],
  exports: [CNCOperationsService],
})
export class CNCOperationsModule {}

