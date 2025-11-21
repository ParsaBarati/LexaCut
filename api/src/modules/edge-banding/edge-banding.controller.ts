import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEdgeBandingDto } from './dto/create-edge-banding.dto';
import { UpdateEdgeBandingDto } from './dto/update-edge-banding.dto';

@ApiTags('Edge Banding Management')
@Controller('api/v1/edge-banding')
export class EdgeBandingController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all edge banding types' })
  @ApiResponse({ status: 200, description: 'Returns all edge banding types' })
  async findAll(@Query('active') active?: string) {
    const where = active === 'true' ? { isActive: true } : {};
    return this.prisma.edgeBanding.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get edge banding by ID' })
  @ApiResponse({ status: 200, description: 'Returns the edge banding' })
  @ApiResponse({ status: 404, description: 'Edge banding not found' })
  async findOne(@Param('id') id: string) {
    return this.prisma.edgeBanding.findUniqueOrThrow({
      where: { id },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new edge banding type' })
  @ApiResponse({ status: 201, description: 'Edge banding created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createDto: CreateEdgeBandingDto) {
    return this.prisma.edgeBanding.create({
      data: createDto,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create edge banding types' })
  @ApiResponse({ status: 201, description: 'Edge banding types created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async bulkCreate(@Body() createDtos: CreateEdgeBandingDto[]) {
    const result = await this.prisma.edgeBanding.createMany({
      data: createDtos,
      skipDuplicates: true,
    });
    return { count: result.count, message: `Successfully created ${result.count} edge banding types` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an edge banding type' })
  @ApiResponse({ status: 200, description: 'Edge banding updated successfully' })
  @ApiResponse({ status: 404, description: 'Edge banding not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateEdgeBandingDto) {
    return this.prisma.edgeBanding.update({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an edge banding type (soft delete)' })
  @ApiResponse({ status: 204, description: 'Edge banding deleted successfully' })
  @ApiResponse({ status: 404, description: 'Edge banding not found' })
  async remove(@Param('id') id: string) {
    await this.prisma.edgeBanding.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

