import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCNCOperationDto } from './dto/create-cnc-operation.dto';
import { UpdateCNCOperationDto } from './dto/update-cnc-operation.dto';

@Injectable()
export class CNCOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.cNCOperation.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.cNCOperation.findUniqueOrThrow({ where: { id } });
  }

  async create(createDto: CreateCNCOperationDto) {
    return this.prisma.cNCOperation.create({ data: createDto });
  }

  async update(id: string, updateDto: UpdateCNCOperationDto) {
    return this.prisma.cNCOperation.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.cNCOperation.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

