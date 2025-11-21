import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePricingConfigDto } from './dto/update-pricing-config.dto';

@Injectable()
export class PricingConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getActive() {
    return this.prisma.pricingConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(updateDto: UpdatePricingConfigDto) {
    let config = await this.prisma.pricingConfig.findFirst({
      where: { name: 'default' },
    });

    if (!config) {
      config = await this.prisma.pricingConfig.create({
        data: {
          name: 'default',
          isActive: true,
        },
      });
    }

    return this.prisma.pricingConfig.update({
      where: { id: config.id },
      data: updateDto,
    });
  }
}

