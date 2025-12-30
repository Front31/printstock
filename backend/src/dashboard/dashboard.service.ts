import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [
      totalSpools,
      totalPrinters,
      totalNozzles,
      totalModels,
      lowStockSpools,
      unopenedSpools,
    ] = await Promise.all([
      this.prisma.filamentSpool.count(),
      this.prisma.printer.count(),
      this.prisma.nozzle.count(),
      this.prisma.model.count(),
      this.prisma.filamentSpool.count({
        where: { remainingWeight: { lt: 300 } },
      }),
      this.prisma.filamentSpool.count({
        where: { opened: false },
      }),
    ]);

    return {
      totalSpools,
      totalPrinters,
      totalNozzles,
      totalModels,
      lowStockSpools,
      unopenedSpools,
    };
  }

  async getMaterialsSummary(unopenedOnly: boolean = false) {
    const where = unopenedOnly ? { opened: false } : {};
    const spools = await this.prisma.filamentSpool.findMany({ where });

    const materialGroups = spools.reduce((acc, spool) => {
      if (!acc[spool.material]) {
        acc[spool.material] = {
          material: spool.material,
          count: 0,
          totalWeight: 0,
          totalValue: 0,
          colors: new Set(),
        };
      }

      acc[spool.material].count++;
      acc[spool.material].totalWeight += spool.remainingWeight;
      acc[spool.material].totalValue += 
        (spool.price * spool.remainingWeight) / spool.totalWeight;
      acc[spool.material].colors.add(spool.colorHex);

      return acc;
    }, {} as Record<string, any>);

    return Object.values(materialGroups).map((group: any) => ({
      ...group,
      totalWeight: group.totalWeight / 1000,
      colors: Array.from(group.colors),
    }));
  }
}
