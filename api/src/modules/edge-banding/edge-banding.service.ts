import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEdgeBandingDto } from './dto/create-edge-banding.dto';
import { UpdateEdgeBandingDto } from './dto/update-edge-banding.dto';

@Injectable()
export class EdgeBandingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.edgeBanding.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.edgeBanding.findUniqueOrThrow({ where: { id } });
  }

  async create(createDto: CreateEdgeBandingDto) {
    return this.prisma.edgeBanding.create({ data: createDto });
  }

  async update(id: string, updateDto: UpdateEdgeBandingDto) {
    return this.prisma.edgeBanding.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.edgeBanding.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

