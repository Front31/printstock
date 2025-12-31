import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilamentDto } from './dto/create-filament.dto';
import { UpdateFilamentDto } from './dto/update-filament.dto';
import { CreateUsageDto } from './dto/create-usage.dto';

function normalizePurchaseDate(value?: string | Date | null): Date | null {
  if (!value) return null;

  if (value instanceof Date) return value;

  // HTML date input: "YYYY-MM-DD" → Prisma erwartet DateTime
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  return new Date(value);
}

@Injectable()
export class FilamentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any) {
    const { material, opened, searchQuery, page, limit } = filters;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (material) where.material = material;
    if (opened !== undefined) where.opened = opened;
    if (searchQuery) {
      where.OR = [
        { brand: { contains: searchQuery, mode: 'insensitive' } },
        { material: { contains: searchQuery, mode: 'insensitive' } },
        { colorName: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.filamentSpool.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.filamentSpool.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const filament = await this.prisma.filamentSpool.findUnique({
      where: { id },
      include: { usages: { include: { printer: true, model: true } } },
    });
    if (!filament) throw new NotFoundException(`Filament ${id} not found`);
    return filament;
  }

  async create(dto: CreateFilamentDto) {
    return this.prisma.filamentSpool.create({
      data: {
        ...dto,
        purchaseDate: normalizePurchaseDate((dto as any).purchaseDate),
      },
    });
  }

  async update(id: string, dto: UpdateFilamentDto) {
    await this.findOne(id);
  
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...cleanDto
    } = dto as any;
  
    return this.prisma.filamentSpool.update({
      where: { id },
      data: {
        ...cleanDto,
        ...(cleanDto.purchaseDate !== undefined
          ? { purchaseDate: normalizePurchaseDate(cleanDto.purchaseDate) }
          : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.filamentSpool.delete({ where: { id } });
  }

  async addUsage(id: string, dto: CreateUsageDto) {
    const filament = await this.findOne(id);
    if (dto.gramsUsed > filament.remainingWeight) {
      throw new BadRequestException('Not enough filament remaining');
    }

    const [usage] = await this.prisma.$transaction([
      this.prisma.filamentUsage.create({
        data: { filamentSpoolId: id, ...dto },
      }),
      this.prisma.filamentSpool.update({
        where: { id },
        data: { remainingWeight: filament.remainingWeight - dto.gramsUsed },
      }),
    ]);

    return usage;
  }
}
