import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { PricingLookupService } from '../../common/utils/pricing-lookup.service';

@Module({
  controllers: [MaterialsController],
  providers: [MaterialsService, PricingLookupService],
  exports: [MaterialsService],
})
export class MaterialsModule {}

