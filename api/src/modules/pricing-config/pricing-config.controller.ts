import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePricingConfigDto } from './dto/update-pricing-config.dto';

@ApiTags('Pricing Configuration')
@Controller('api/v1/pricing-config')
export class PricingConfigController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get active pricing configuration' })
  @ApiResponse({ status: 200, description: 'Returns the active pricing configuration' })
  async getActive() {
    return this.prisma.pricingConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Put()
  @ApiOperation({ summary: 'Update pricing configuration' })
  @ApiResponse({ status: 200, description: 'Pricing configuration updated successfully' })
  async update(@Body() updateDto: UpdatePricingConfigDto) {
    // Get the active config or create default
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

