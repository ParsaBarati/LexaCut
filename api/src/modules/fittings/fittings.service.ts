import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFittingDto } from './dto/create-fitting.dto';
import { UpdateFittingDto } from './dto/update-fitting.dto';

@Injectable()
export class FittingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.fitting.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.fitting.findUniqueOrThrow({ where: { id } });
  }

  async create(createDto: CreateFittingDto) {
    return this.prisma.fitting.create({ data: createDto });
  }

  async update(id: string, updateDto: UpdateFittingDto) {
    return this.prisma.fitting.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.fitting.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

