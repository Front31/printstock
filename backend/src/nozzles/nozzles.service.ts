import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NozzlesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.nozzle.findMany({
      include: { printer: true },
    });
  }

  create(data: any) {
    return this.prisma.nozzle.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.nozzle.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.nozzle.delete({ where: { id } });
  }
}
