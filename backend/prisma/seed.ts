import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create nozzles
  const nozzle1 = await prisma.nozzle.create({
    data: {
      size: 0.4,
      material: 'Brass',
      condition: 'Used',
      notes: 'Standard nozzle for most prints',
    },
  });

  const nozzle2 = await prisma.nozzle.create({
    data: {
      size: 0.6,
      material: 'Hardened Steel',
      condition: 'New',
      notes: 'For abrasive filaments',
    },
  });

  const nozzle3 = await prisma.nozzle.create({
    data: {
      size: 0.4,
      material: 'Hardened Steel',
      condition: 'Used',
      notes: 'Bambu Lab standard',
    },
  });

  const nozzle4 = await prisma.nozzle.create({
    data: {
      size: 0.2,
      material: 'Brass',
      condition: 'New',
      notes: 'For detailed prints',
    },
  });

  // Create printers
  const printer1 = await prisma.printer.create({
    data: {
      name: 'Prusa MK4',
      model: 'Original Prusa MK4',
      notes: 'Main workhorse printer',
      currentNozzleId: nozzle1.id,
    },
  });

  const printer2 = await prisma.printer.create({
    data: {
      name: 'Bambu X1C',
      model: 'Bambu Lab X1 Carbon',
      notes: 'Fast multi-color prints',
      currentNozzleId: nozzle3.id,
    },
  });

  await prisma.nozzle.update({
    where: { id: nozzle1.id },
    data: { printerId: printer1.id },
  });

  await prisma.nozzle.update({
    where: { id: nozzle2.id },
    data: { printerId: printer1.id },
  });

  await prisma.nozzle.update({
    where: { id: nozzle3.id },
    data: { printerId: printer2.id },
  });

  // Create tags
  const tagFunctional = await prisma.tag.create({ data: { name: 'Functional' } });
  const tagMiniature = await prisma.tag.create({ data: { name: 'Miniature' } });
  const tagDecoration = await prisma.tag.create({ data: { name: 'Decoration' } });

  // Create models
  const model1 = await prisma.model.create({
    data: {
      name: 'Benchy',
      link: 'https://www.thingiverse.com/thing:763622',
      notes: 'Calibration print',
      tags: { connect: [{ id: tagFunctional.id }] },
    },
  });

  const model2 = await prisma.model.create({
    data: {
      name: 'Dragon Miniature',
      link: 'https://www.myminifactory.com',
      notes: 'Fantasy miniature',
      tags: { connect: [{ id: tagMiniature.id }] },
    },
  });

  // Create filaments
  const filaments = [
    {
      brand: 'Prusament',
      material: 'PLA',
      colorName: 'Galaxy Black',
      colorHex: '#1a1a2e',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 750,
      price: 24.99,
      purchaseDate: new Date('2024-11-15'),
      store: 'Prusa Research',
      url: 'https://prusa3d.com',
      opened: true,
      openedDate: new Date('2024-11-20'),
      location: 'Shelf A1',
      notes: 'Premium quality',
    },
    {
      brand: 'eSUN',
      material: 'PETG',
      colorName: 'Transparent Blue',
      colorHex: '#4a90e2',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 1000,
      price: 19.99,
      purchaseDate: new Date('2024-12-01'),
      store: 'Amazon',
      opened: false,
      location: 'Storage Box 2',
      notes: 'Backup spool',
    },
    {
      brand: 'Polymaker',
      material: 'ABS',
      colorName: 'Fire Red',
      colorHex: '#e74c3c',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 450,
      price: 22.50,
      purchaseDate: new Date('2024-10-20'),
      store: 'Local Store',
      opened: true,
      openedDate: new Date('2024-10-22'),
      location: 'Shelf A2',
      notes: 'Good for enclosure',
    },
    {
      brand: 'Overture',
      material: 'TPU',
      colorName: 'Clear Natural',
      colorHex: '#f5f5dc',
      diameter: 1.75,
      totalWeight: 500,
      remainingWeight: 500,
      price: 26.99,
      purchaseDate: new Date('2024-12-15'),
      store: 'Amazon',
      opened: false,
      location: 'Shelf B1',
      notes: 'Flexible filament',
    },
    {
      brand: 'Prusament',
      material: 'PLA',
      colorName: 'Lipstick Red',
      colorHex: '#c0392b',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 200,
      price: 24.99,
      purchaseDate: new Date('2024-09-10'),
      store: 'Prusa Research',
      opened: true,
      openedDate: new Date('2024-09-12'),
      location: 'Shelf A1',
      notes: 'Running low!',
    },
    {
      brand: 'ColorFabb',
      material: 'PETG',
      colorName: 'Signal White',
      colorHex: '#ffffff',
      diameter: 1.75,
      totalWeight: 750,
      remainingWeight: 600,
      price: 28.99,
      purchaseDate: new Date('2024-11-01'),
      store: 'ColorFabb Store',
      opened: true,
      openedDate: new Date('2024-11-05'),
      location: 'Shelf A3',
      notes: 'Premium quality',
    },
    {
      brand: 'Sunlu',
      material: 'PLA',
      colorName: 'Silk Gold',
      colorHex: '#ffd700',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 850,
      price: 18.99,
      purchaseDate: new Date('2024-12-10'),
      store: 'Amazon',
      opened: true,
      openedDate: new Date('2024-12-12'),
      location: 'Shelf A1',
      notes: 'Beautiful finish',
    },
    {
      brand: 'Polymaker',
      material: 'ASA',
      colorName: 'Black',
      colorHex: '#000000',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 1000,
      price: 27.99,
      purchaseDate: new Date('2024-12-20'),
      store: 'Local Store',
      opened: false,
      location: 'Storage Box 1',
      notes: 'UV resistant',
    },
    {
      brand: 'eSUN',
      material: 'PLA+',
      colorName: 'Galaxy Purple',
      colorHex: '#9b59b6',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 380,
      price: 21.99,
      purchaseDate: new Date('2024-10-05'),
      store: 'Amazon',
      opened: true,
      openedDate: new Date('2024-10-08'),
      location: 'Shelf A2',
      notes: 'Stronger than PLA',
    },
    {
      brand: 'Bambu Lab',
      material: 'PLA',
      colorName: 'Matte Orange',
      colorHex: '#ff6347',
      diameter: 1.75,
      totalWeight: 1000,
      remainingWeight: 920,
      price: 19.99,
      purchaseDate: new Date('2024-12-18'),
      store: 'Bambu Store',
      opened: true,
      openedDate: new Date('2024-12-20'),
      location: 'Shelf B2',
      notes: 'Optimized for Bambu',
    },
  ];

  const createdFilaments = [];
  for (const filament of filaments) {
    const spool = await prisma.filamentSpool.create({ data: filament });
    createdFilaments.push(spool);
  }

  // Create usage entries
  await prisma.filamentUsage.create({
    data: {
      filamentSpoolId: createdFilaments[0].id,
      gramsUsed: 250,
      usageDate: new Date('2024-11-22'),
      printerId: printer1.id,
      modelId: model1.id,
      notes: 'Calibration print',
    },
  });

  await prisma.filamentUsage.create({
    data: {
      filamentSpoolId: createdFilaments[2].id,
      gramsUsed: 550,
      usageDate: new Date('2024-10-25'),
      printerId: printer2.id,
      modelId: model2.id,
      notes: 'Large miniature',
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`Created ${createdFilaments.length} filaments`);
  console.log('Created 2 printers');
  console.log('Created 4 nozzles');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
