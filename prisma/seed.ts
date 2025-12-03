import { PrismaClient, Color, Material } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Real Metaltec products from specification
const productsData = [
  // 1122 series - Floor 1
  { code: '1122', name: 'Dobradiça 1122', color: Color.BR, floor: 1, material: Material.ALUMINUM },
  { code: '1122', name: 'Dobradiça 1122', color: Color.ME, floor: 1, material: Material.ALUMINUM },
  { code: '1122', name: 'Dobradiça 1122', color: Color.BZ, floor: 1, material: Material.ALUMINUM },
  { code: '1122', name: 'Dobradiça 1122', color: Color.CR, floor: 1, material: Material.ALUMINUM },
  { code: '1122', name: 'Dobradiça 1122', color: Color.PT, floor: 1, material: Material.ALUMINUM },

  // 1510X series - Floor 1
  { code: '1510X', name: 'Puxador 1510X', color: Color.CR, floor: 1, material: Material.ALUMINUM },
  { code: '1510X', name: 'Puxador 1510X', color: Color.BR, floor: 1, material: Material.ALUMINUM },
  { code: '1510X', name: 'Puxador 1510X', color: Color.PT, floor: 1, material: Material.ALUMINUM },
  { code: '1510X', name: 'Puxador 1510X', color: Color.ME, floor: 1, material: Material.ALUMINUM },
  { code: '1510X', name: 'Puxador 1510X', color: Color.MA, floor: 1, material: Material.ALUMINUM },

  // 1511X series - Floor 1
  { code: '1511X', name: 'Puxador 1511X', color: Color.CR, floor: 1, material: Material.ALUMINUM },
  { code: '1511X', name: 'Puxador 1511X', color: Color.BR, floor: 1, material: Material.ALUMINUM },
  { code: '1511X', name: 'Puxador 1511X', color: Color.PT, floor: 1, material: Material.ALUMINUM },
  { code: '1511X', name: 'Puxador 1511X', color: Color.ME, floor: 1, material: Material.ALUMINUM },

  // 1570/1571 series - Floor 2
  { code: '1570', name: 'Fechadura 1570', color: Color.CR, floor: 2, material: Material.ZAMAK },
  { code: '1570', name: 'Fechadura 1570', color: Color.BR, floor: 2, material: Material.ZAMAK },
  { code: '1570', name: 'Fechadura 1570', color: Color.PT, floor: 2, material: Material.ZAMAK },
  { code: '1571', name: 'Fechadura 1571', color: Color.CR, floor: 2, material: Material.ZAMAK },

  // 1101/1102 series - Floor 1
  { code: '1101', name: 'Puxador 1101', color: Color.BR, floor: 1, material: Material.ALUMINUM },
  { code: '1101', name: 'Puxador 1101', color: Color.ME, floor: 1, material: Material.ALUMINUM },
  { code: '1101', name: 'Puxador 1101', color: Color.BZ, floor: 1, material: Material.ALUMINUM },
  { code: '1102', name: 'Puxador 1102', color: Color.BR, floor: 1, material: Material.ALUMINUM },
  { code: '1102', name: 'Puxador 1102', color: Color.CR, floor: 1, material: Material.ALUMINUM },

  // Special products
  { code: '1334', name: 'Dobradiça 1334', color: Color.ME, floor: 1, material: Material.ALUMINUM },
  { code: '1126AC', name: 'Puxador 1126AC', color: Color.MA, floor: 1, material: Material.ALUMINUM },
  { code: '1520TAH', name: 'Fechadura 1520TAH', color: Color.BR, floor: 2, material: Material.BRASS },
  { code: '1587V', name: 'Acessório 1587V', color: Color.BZ, floor: 2, material: Material.BRASS },
];

function getRandomStatus(): number | string {
  const rand = Math.random();
  if (rand < 0.25) return 0; // Empty
  if (rand < 0.5) return 1;  // 1 box
  if (rand < 0.85) return 2; // Full (2 boxes)
  return 'OK'; // In production
}

function generateLocationsForProduct(): any {
  const columns = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
  const locations: any = {};

  columns.forEach(col => {
    locations[col] = getRandomStatus();
  });

  return locations;
}

async function main() {
  console.log('🌱 Starting Metaltec database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.movement.deleteMany();
  await prisma.overflow.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleaned\n');

  // Create users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('metaltec123', 10);

  const operator = await prisma.user.create({
    data: {
      email: 'operator@metaltec.com',
      name: 'Operador Principal',
      password: hashedPassword,
      role: 'OPERATOR',
    },
  });

  const anderson = await prisma.user.create({
    data: {
      email: 'anderson@metaltec.com',
      name: 'Anderson (Gerente)',
      password: hashedPassword,
      role: 'MANAGER',
    },
  });

  const karen = await prisma.user.create({
    data: {
      email: 'karen@metaltec.com',
      name: 'Karen (Expedição)',
      password: hashedPassword,
      role: 'EXPEDITION',
    },
  });

  console.log('✅ Created 3 users (password: metaltec123)\n');

  // Create products with locations
  console.log('📦 Creating products with location data...');
  const createdProducts = [];

  for (const productData of productsData) {
    const locations = generateLocationsForProduct();

    const product = await prisma.product.create({
      data: {
        code: productData.code,
        name: productData.name,
        color: productData.color,
        material: productData.material,
        floor: productData.floor,
        locations: locations,
      },
    });

    createdProducts.push(product);

    // Create some movement history for products that have stock
    const locationEntries = Object.entries(locations);
    for (const [column, status] of locationEntries) {
      if (typeof status === 'number' && status > 0) {
        await prisma.movement.create({
          data: {
            productId: product.id,
            type: 'STORAGE',
            from: 'RECEIVING',
            to: column,
            quantity: status as number,
            userId: operator.id,
            notes: 'Estoque inicial',
          },
        });
      }
    }
  }

  console.log(`✅ Created ${createdProducts.length} products with varied statuses\n`);

  // Create overflow items (5 items waiting for space)
  console.log('📥 Creating overflow items...');
  const overflowCount = 5;

  for (let i = 0; i < overflowCount; i++) {
    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const daysAgo = Math.floor(Math.random() * 14); // 0-14 days ago

    await prisma.overflow.create({
      data: {
        productId: randomProduct.id,
        quantity: Math.floor(Math.random() * 3) + 1, // 1-3 boxes
        storedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        waitingForFloor: randomProduct.floor,
        waitingForColumn: `L${Math.floor(Math.random() * 6) + 1}`,
        notes: 'Aguardando espaço em prateleira',
        resolved: false,
      },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: randomProduct.id,
        type: 'OVERFLOW',
        from: 'RECEIVING',
        to: 'OVERFLOW',
        quantity: Math.floor(Math.random() * 3) + 1,
        userId: operator.id,
        notes: 'Sem espaço disponível',
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created ${overflowCount} overflow items\n`);

  // Create production orders for items marked as "OK"
  console.log('🏭 Creating production orders...');
  let productionOrderCount = 0;

  for (const product of createdProducts) {
    const locations = product.locations as any;
    const hasOKStatus = Object.values(locations).includes('OK');

    if (hasOKStatus) {
      await prisma.productionOrder.create({
        data: {
          productId: product.id,
          quantityOrdered: Math.floor(Math.random() * 20) + 10, // 10-30 boxes
          orderedBy: anderson.id,
          expectedDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000), // 1-14 days from now
          status: 'IN_PRODUCTION',
          notes: 'Produção solicitada - estoque crítico',
        },
      });

      // Create movement record
      await prisma.movement.create({
        data: {
          productId: product.id,
          type: 'PRODUCTION',
          from: null,
          to: 'PRODUCTION',
          quantity: 0,
          userId: anderson.id,
          notes: 'Marcado como em produção (OK)',
        },
      });

      productionOrderCount++;
    }
  }

  console.log(`✅ Created ${productionOrderCount} production orders\n`);

  // Summary
  console.log('📊 SEED SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Users: 3`);
  console.log(`✅ Products: ${createdProducts.length}`);
  console.log(`✅ Overflow Items: ${overflowCount}`);
  console.log(`✅ Production Orders: ${productionOrderCount}`);
  console.log(`✅ Movement Records: ${await prisma.movement.count()}`);
  console.log('═══════════════════════════════════════\n');

  console.log('🔐 LOGIN CREDENTIALS:');
  console.log('───────────────────────────────────────');
  console.log('Operator: operator@metaltec.com / metaltec123');
  console.log('Manager:  anderson@metaltec.com / metaltec123');
  console.log('Expedition: karen@metaltec.com / metaltec123');
  console.log('───────────────────────────────────────\n');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
