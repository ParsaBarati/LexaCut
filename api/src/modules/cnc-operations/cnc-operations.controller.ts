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
import { CreateCNCOperationDto } from './dto/create-cnc-operation.dto';
import { UpdateCNCOperationDto } from './dto/update-cnc-operation.dto';

@ApiTags('CNC Operations Management')
@Controller('api/v1/cnc-operations')
export class CNCOperationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all CNC operations' })
  @ApiResponse({ status: 200, description: 'Returns all CNC operations' })
  async findAll(@Query('active') active?: string) {
    const where = active === 'true' ? { isActive: true } : {};
    return this.prisma.cNCOperation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CNC operation by ID' })
  @ApiResponse({ status: 200, description: 'Returns the CNC operation' })
  @ApiResponse({ status: 404, description: 'CNC operation not found' })
  async findOne(@Param('id') id: string) {
    return this.prisma.cNCOperation.findUniqueOrThrow({
      where: { id },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new CNC operation' })
  @ApiResponse({ status: 201, description: 'CNC operation created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createDto: CreateCNCOperationDto) {
    return this.prisma.cNCOperation.create({
      data: createDto,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create CNC operations' })
  @ApiResponse({ status: 201, description: 'CNC operations created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async bulkCreate(@Body() createDtos: CreateCNCOperationDto[]) {
    const result = await this.prisma.cNCOperation.createMany({
      data: createDtos,
      skipDuplicates: true,
    });
    return { count: result.count, message: `Successfully created ${result.count} CNC operations` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a CNC operation' })
  @ApiResponse({ status: 200, description: 'CNC operation updated successfully' })
  @ApiResponse({ status: 404, description: 'CNC operation not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCNCOperationDto) {
    return this.prisma.cNCOperation.update({
      where: { id },
      data: updateDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a CNC operation (soft delete)' })
  @ApiResponse({ status: 204, description: 'CNC operation deleted successfully' })
  @ApiResponse({ status: 404, description: 'CNC operation not found' })
  async remove(@Param('id') id: string) {
    await this.prisma.cNCOperation.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

