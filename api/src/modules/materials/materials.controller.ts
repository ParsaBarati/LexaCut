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
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@ApiTags('Materials Management')
@Controller('api/v1/materials')
export class MaterialsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  @ApiResponse({ status: 200, description: 'Returns all materials' })
  async findAll(@Query('active') active?: string) {
    const where = active === 'true' ? { isActive: true } : {};
    return this.prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiResponse({ status: 200, description: 'Returns the material' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async findOne(@Param('id') id: string) {
    return this.prisma.material.findUniqueOrThrow({
      where: { id },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createDto: CreateMaterialDto) {
    return this.prisma.material.create({
      data: createDto,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create materials' })
  @ApiResponse({ status: 201, description: 'Materials created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async bulkCreate(@Body() createDtos: CreateMaterialDto[]) {
    const result = await this.prisma.material.createMany({
      data: createDtos,
      skipDuplicates: true,
    });
    return { count: result.count, message: `Successfully created ${result.count} materials` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a material' })
  @ApiResponse({ status: 200, description: 'Material updated successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateMaterialDto) {
    return this.prisma.material.update({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a material (soft delete)' })
  @ApiResponse({ status: 204, description: 'Material deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async remove(@Param('id') id: string) {
    // Soft delete by setting isActive to false
    await this.prisma.material.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

