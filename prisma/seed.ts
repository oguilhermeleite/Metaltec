import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample products based on specifications
const floor1Products = [
  { code: '1122 BR', name: 'Dobradiça 1122 Branca', color: 'Branca', colorSuffix: 'BR', material: null },
  { code: '1510X CR', name: 'Puxador 1510X Cromado', color: 'Cromado', colorSuffix: 'CR', material: 'X' },
  { code: '1511X ME', name: 'Puxador 1511X Metálico', color: 'Metálico', colorSuffix: 'ME', material: 'X' },
  { code: '1570 CR', name: 'Fechadura 1570 Cromada', color: 'Cromado', colorSuffix: 'CR', material: null },
  { code: '1571 MA', name: 'Fechadura 1571 Marrom', color: 'Marrom', colorSuffix: 'MA', material: null },
  { code: '1101 BZ', name: 'Puxador 1101 Bronze', color: 'Bronze', colorSuffix: 'BZ', material: null },
  { code: '1102 PT', name: 'Puxador 1102 Preto', color: 'Preto', colorSuffix: 'PT', material: null },
  { code: '1334 ME', name: 'Dobradiça 1334 Metálica', color: 'Metálico', colorSuffix: 'ME', material: null },
  { code: '1126AC MA', name: 'Puxador 1126AC Marrom', color: 'Marrom', colorSuffix: 'MA', material: null },
  { code: '1520TAH BR', name: 'Fechadura 1520TAH Branca', color: 'Branca', colorSuffix: 'BR', material: null },
  { code: '1521 PT', name: 'Fechadura 1521 Preta', color: 'Preto', colorSuffix: 'PT', material: null },
  { code: '1125X CR', name: 'Puxador 1125X Cromado', color: 'Cromado', colorSuffix: 'CR', material: 'X' },
  { code: '1560XZ BZ', name: 'Puxador 1560XZ Bronze', color: 'Bronze', colorSuffix: 'BZ', material: 'XZ' },
  { code: '1340 ME', name: 'Dobradiça 1340 Metálica', color: 'Metálico', colorSuffix: 'ME', material: null },
  { code: '1103 BR', name: 'Puxador 1103 Branco', color: 'Branca', colorSuffix: 'BR', material: null },
  { code: '1104XJ CR', name: 'Puxador 1104XJ Cromado', color: 'Cromado', colorSuffix: 'CR', material: 'XJ' },
  { code: '1530 PT', name: 'Fechadura 1530 Preta', color: 'Preto', colorSuffix: 'PT', material: null },
  { code: '1127 MA', name: 'Puxador 1127 Marrom', color: 'Marrom', colorSuffix: 'MA', material: null },
  { code: '1128XZ ME', name: 'Puxador 1128XZ Metálico', color: 'Metálico', colorSuffix: 'ME', material: 'XZ' },
  { code: '1572 CR', name: 'Fechadura 1572 Cromada', color: 'Cromado', colorSuffix: 'CR', material: null },
  // Additional Floor 1 products
  { code: '1105G BR', name: 'Puxador 1105G Branco', color: 'Branca', colorSuffix: 'BR', material: 'G' },
  { code: '1335 BZ', name: 'Dobradiça 1335 Bronze', color: 'Bronze', colorSuffix: 'BZ', material: null },
  { code: '1540M PT', name: 'Fechadura 1540M Preta', color: 'Preto', colorSuffix: 'PT', material: 'M' },
  { code: '1129 CR', name: 'Puxador 1129 Cromado', color: 'Cromado', colorSuffix: 'CR', material: null },
  { code: '1106X MA', name: 'Puxador 1106X Marrom', color: 'Marrom', colorSuffix: 'MA', material: 'X' },
];

const floor2Products = [
  { code: '2001 BR', name: 'Roldana 2001 Branca', color: 'Branca', colorSuffix: 'BR', material: null },
  { code: '2010X CR', name: 'Roldana 2010X Cromada', color: 'Cromado', colorSuffix: 'CR', material: 'X' },
  { code: '2020 ME', name: 'Trilho 2020 Metálico', color: 'Metálico', colorSuffix: 'ME', material: null },
  { code: '2030 PT', name: 'Trilho 2030 Preto', color: 'Preto', colorSuffix: 'PT', material: null },
  { code: '2040XZ BZ', name: 'Roldana 2040XZ Bronze', color: 'Bronze', colorSuffix: 'BZ', material: 'XZ' },
  { code: '2050 MA', name: 'Trilho 2050 Marrom', color: 'Marrom', colorSuffix: 'MA', material: null },
  { code: '2060X BR', name: 'Suporte 2060X Branco', color: 'Branca', colorSuffix: 'BR', material: 'X' },
  { code: '2070 CR', name: 'Suporte 2070 Cromado', color: 'Cromado', colorSuffix: 'CR', material: null },
  { code: '2080XJ ME', name: 'Roldana 2080XJ Metálica', color: 'Metálico', colorSuffix: 'ME', material: 'XJ' },
  { code: '2090 PT', name: 'Trilho 2090 Preto', color: 'Preto', colorSuffix: 'PT', material: null },
  { code: '2100G BZ', name: 'Suporte 2100G Bronze', color: 'Bronze', colorSuffix: 'BZ', material: 'G' },
  { code: '2110 MA', name: 'Roldana 2110 Marrom', color: 'Marrom', colorSuffix: 'MA', material: null },
  { code: '2120XZ CR', name: 'Trilho 2120XZ Cromado', color: 'Cromado', colorSuffix: 'CR', material: 'XZ' },
  { code: '2130 BR', name: 'Suporte 2130 Branco', color: 'Branca', colorSuffix: 'BR', material: null },
  { code: '2140X PT', name: 'Roldana 2140X Preta', color: 'Preto', colorSuffix: 'PT', material: 'X' },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clean database (be careful with this in production!)
  await prisma.movement.deleteMany();
  await prisma.overflowAction.deleteMany();
  await prisma.overflowItem.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.location.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned');

  // Create default users
  const hashedPassword = await bcrypt.hash('metaltec123', 10);

  const operator = await prisma.user.create({
    data: {
      email: 'operador@metaltec.com.br',
      name: 'Operador Principal',
      password: hashedPassword,
      role: 'OPERATOR',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'anderson@metaltec.com.br',
      name: 'Anderson (Gerente)',
      password: hashedPassword,
      role: 'MANAGER',
    },
  });

  const expedition = await prisma.user.create({
    data: {
      email: 'karen@metaltec.com.br',
      name: 'Karen (Expedição)',
      password: hashedPassword,
      role: 'EXPEDITION',
    },
  });

  console.log('✅ Users created (password: metaltec123)');

  // Create Floor 1 products
  for (const product of floor1Products) {
    await prisma.product.create({
      data: {
        ...product,
        floor: 1,
      },
    });
  }

  console.log(`✅ Created ${floor1Products.length} Floor 1 products`);

  // Create Floor 2 products
  for (const product of floor2Products) {
    await prisma.product.create({
      data: {
        ...product,
        floor: 2,
      },
    });
  }

  console.log(`✅ Created ${floor2Products.length} Floor 2 products`);

  // Create all locations (2 floors × 6 columns × 2 box positions = 24 locations)
  const columns = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
  let locationCount = 0;

  for (let floor = 1; floor <= 2; floor++) {
    for (const column of columns) {
      for (let boxPosition = 1; boxPosition <= 2; boxPosition++) {
        await prisma.location.create({
          data: {
            floor,
            column,
            boxPosition,
            status: 'EMPTY',
            quantity: 0,
          },
        });
        locationCount++;
      }
    }
  }

  console.log(`✅ Created ${locationCount} storage locations (2 floors × 6 columns × 2 positions)`);

  // Add some sample stock to demonstrate different states
  const sampleProducts = await prisma.product.findMany({ take: 10 });
  const locations = await prisma.location.findMany({ where: { floor: 1 }, take: 10 });

  for (let i = 0; i < Math.min(sampleProducts.length, locations.length); i++) {
    const status = i % 3 === 0 ? 'EMPTY' : i % 3 === 1 ? 'LOW' : 'FULL';
    const quantity = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;

    await prisma.location.update({
      where: { id: locations[i].id },
      data: {
        productId: sampleProducts[i].id,
        status,
        quantity,
      },
    });

    // Create movement history
    if (quantity > 0) {
      await prisma.movement.create({
        data: {
          productId: sampleProducts[i].id,
          locationId: locations[i].id,
          userId: operator.id,
          movementType: 'RECEIVED',
          quantityBefore: 0,
          quantityAfter: quantity,
          toLocation: `Floor ${locations[i].floor}, ${locations[i].column}`,
          notes: 'Initial seed data',
        },
      });
    }
  }

  console.log('✅ Added sample stock with different statuses');

  // Add a few overflow items to demonstrate the overflow system
  const overflowProducts = await prisma.product.findMany({ skip: 10, take: 3 });

  for (const product of overflowProducts) {
    await prisma.overflowItem.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1,
        waitingForFloor: product.floor,
        notes: 'Aguardando espaço na prateleira',
        priority: Math.floor(Math.random() * 10),
      },
    });
  }

  console.log('✅ Added sample overflow items');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Operador: operador@metaltec.com.br / metaltec123');
  console.log('   Gerente: anderson@metaltec.com.br / metaltec123');
  console.log('   Expedição: karen@metaltec.com.br / metaltec123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
