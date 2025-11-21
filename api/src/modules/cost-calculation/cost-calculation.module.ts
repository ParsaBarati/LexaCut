import { Module } from '@nestjs/common';
import { CostCalculationService } from './cost-calculation.service';
import { CostCalculationController } from './cost-calculation.controller';
import { MaterialsModule } from '../materials/materials.module';
import { PricingModule } from '../pricing/pricing.module';
import { PricingLookupService } from '../../common/utils/pricing-lookup.service';
import { DataProcessingService } from './data-processing.service';

@Module({
  imports: [MaterialsModule, PricingModule],
  controllers: [CostCalculationController],
  providers: [
    CostCalculationService,
    DataProcessingService,
    PricingLookupService,
  ],
  exports: [CostCalculationService],
})
export class CostCalculationModule {}

