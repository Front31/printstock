import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.model.findMany({
      include: { tags: true },
    });
  }

  create(data: any) {
    return this.prisma.model.create({ data });
  }
}
