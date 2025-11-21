import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostCalculationModule } from './modules/cost-calculation/cost-calculation.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { PrismaModule } from './prisma/prisma.module';
import { EdgeBandingModule } from './modules/edge-banding/edge-banding.module';
import { CNCOperationsModule } from './modules/cnc-operations/cnc-operations.module';
import { FittingsModule } from './modules/fittings/fittings.module';
import { PricingConfigModule } from './modules/pricing-config/pricing-config.module';

@Module({
  imports: [
    PrismaModule,
    CostCalculationModule,
    MaterialsModule,
    PricingModule,
    EdgeBandingModule,
    CNCOperationsModule,
    FittingsModule,
    PricingConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
