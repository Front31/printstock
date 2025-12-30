import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrintersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.printer.findMany({
      include: { currentNozzle: true },
    });
  }

  findOne(id: string) {
    return this.prisma.printer.findUnique({
      where: { id },
      include: { currentNozzle: true, nozzles: true },
    });
  }

  create(data: any) {
    return this.prisma.printer.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.printer.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.printer.delete({ where: { id } });
  }
}
