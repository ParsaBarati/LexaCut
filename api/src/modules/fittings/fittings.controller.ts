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
import { CreateFittingDto } from './dto/create-fitting.dto';
import { UpdateFittingDto } from './dto/update-fitting.dto';

@ApiTags('Fittings Management')
@Controller('api/v1/fittings')
export class FittingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all fittings' })
  @ApiResponse({ status: 200, description: 'Returns all fittings' })
  async findAll(@Query('active') active?: string) {
    const where = active === 'true' ? { isActive: true } : {};
    return this.prisma.fitting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fitting by ID' })
  @ApiResponse({ status: 200, description: 'Returns the fitting' })
  @ApiResponse({ status: 404, description: 'Fitting not found' })
  async findOne(@Param('id') id: string) {
    return this.prisma.fitting.findUniqueOrThrow({
      where: { id },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new fitting' })
  @ApiResponse({ status: 201, description: 'Fitting created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createDto: CreateFittingDto) {
    return this.prisma.fitting.create({
      data: createDto,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create fittings' })
  @ApiResponse({ status: 201, description: 'Fittings created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async bulkCreate(@Body() createDtos: CreateFittingDto[]) {
    const result = await this.prisma.fitting.createMany({
      data: createDtos,
      skipDuplicates: true,
    });
    return { count: result.count, message: `Successfully created ${result.count} fittings` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a fitting' })
  @ApiResponse({ status: 200, description: 'Fitting updated successfully' })
  @ApiResponse({ status: 404, description: 'Fitting not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateFittingDto) {
    return this.prisma.fitting.update({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a fitting (soft delete)' })
  @ApiResponse({ status: 204, description: 'Fitting deleted successfully' })
  @ApiResponse({ status: 404, description: 'Fitting not found' })
  async remove(@Param('id') id: string) {
    await this.prisma.fitting.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

