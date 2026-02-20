import { PrismaClient, Color, Material, LocationStatus } from '@prisma/client';
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

function getRandomStatus(): LocationStatus {
  const rand = Math.random();
  if (rand < 0.25) return LocationStatus.EMPTY;
  if (rand < 0.5) return LocationStatus.LOW;
  if (rand < 0.85) return LocationStatus.FULL;
  return LocationStatus.IN_PRODUCTION;
}

async function main() {
  console.log('🌱 Starting Metaltec database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.movement.deleteMany();
  await prisma.overflowItem.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.location.deleteMany();
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

  // Create products
  console.log('📦 Creating products...');
  const createdProducts = [];

  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: {
        code: productData.code,
        name: productData.name,
        color: productData.color,
        material: productData.material,
        floor: productData.floor,
      },
    });

    createdProducts.push(product);
  }

  console.log(`✅ Created ${createdProducts.length} products\n`);

  // Create all storage locations (2 floors × 6 columns × 2 box positions = 24 locations)
  console.log('📍 Creating storage locations...');
  const columns = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
  const floors = [1, 2];
  const boxPositions = [1, 2]; // 1 = bottom, 2 = top

  let locationCount = 0;
  const allLocations = [];

  for (const floor of floors) {
    for (const column of columns) {
      for (const boxPosition of boxPositions) {
        // Randomly assign products to some locations
        const shouldAssignProduct = Math.random() > 0.3; // 70% chance of having a product
        const randomProduct = shouldAssignProduct
          ? createdProducts.filter(p => p.floor === floor)[Math.floor(Math.random() * createdProducts.filter(p => p.floor === floor).length)]
          : null;

        const status = randomProduct ? getRandomStatus() : LocationStatus.EMPTY;

        const location = await prisma.location.create({
          data: {
            floor,
            column,
            boxPosition,
            productId: randomProduct?.id || null,
            status,
          },
        });

        allLocations.push(location);
        locationCount++;

        // Create movement history for filled locations
        if (randomProduct && status !== LocationStatus.EMPTY) {
          await prisma.movement.create({
            data: {
              productId: randomProduct.id,
              type: 'STORAGE',
              from: 'RECEIVING',
              to: `${column}`,
              quantity: status === LocationStatus.FULL ? 2 : 1,
              userId: operator.id,
              notes: 'Estoque inicial',
            },
          });
        }

        // Create production order for IN_PRODUCTION status
        if (randomProduct && status === LocationStatus.IN_PRODUCTION) {
          await prisma.productionOrder.create({
            data: {
              productId: randomProduct.id,
              quantityOrdered: Math.floor(Math.random() * 20) + 10,
              orderedBy: anderson.id,
              expectedDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000),
              status: 'IN_PRODUCTION',
              notes: 'Produção solicitada - estoque crítico',
            },
          });

          await prisma.movement.create({
            data: {
              productId: randomProduct.id,
              type: 'PRODUCTION',
              from: null,
              to: 'PRODUCTION',
              quantity: 0,
              userId: anderson.id,
              notes: 'Marcado como em produção (OK)',
            },
          });
        }
      }
    }
  }

  console.log(`✅ Created ${locationCount} storage locations\n`);

  // Create overflow items (items waiting for space)
  console.log('📥 Creating overflow items...');
  const overflowCount = 8;

  for (let i = 0; i < overflowCount; i++) {
    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const daysAgo = Math.floor(Math.random() * 14);
    const quantity = Math.floor(Math.random() * 3) + 1;

    await prisma.overflowItem.create({
      data: {
        productId: randomProduct.id,
        quantity,
        dateStored: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        waitingForFloor: randomProduct.floor,
        waitingForColumn: columns[Math.floor(Math.random() * columns.length)],
        notes: 'Aguardando espaço em prateleira',
        resolved: false,
      },
    });

    await prisma.movement.create({
      data: {
        productId: randomProduct.id,
        type: 'OVERFLOW',
        from: 'RECEIVING',
        to: 'OVERFLOW',
        quantity,
        userId: operator.id,
        notes: 'Sem espaço disponível',
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created ${overflowCount} overflow items\n`);

  // Summary
  const stats = {
    users: await prisma.user.count(),
    products: await prisma.product.count(),
    locations: await prisma.location.count(),
    overflowItems: await prisma.overflowItem.count(),
    productionOrders: await prisma.productionOrder.count(),
    movements: await prisma.movement.count(),
  };

  console.log('📊 SEED SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Users: ${stats.users}`);
  console.log(`✅ Products: ${stats.products}`);
  console.log(`✅ Storage Locations: ${stats.locations}`);
  console.log(`✅ Overflow Items: ${stats.overflowItems}`);
  console.log(`✅ Production Orders: ${stats.productionOrders}`);
  console.log(`✅ Movement Records: ${stats.movements}`);
  console.log('═══════════════════════════════════════\n');

  console.log('🔐 LOGIN CREDENTIALS:');
  console.log('───────────────────────────────────────');
  console.log('Operator: operator@metaltec.com / metaltec123');
  console.log('Manager:  anderson@metaltec.com / metaltec123');
  console.log('Expedition: karen@metaltec.com / metaltec123');
  console.log('───────────────────────────────────────\n');

  console.log('🎉 Seed completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. npm run dev');
  console.log('   2. Open http://localhost:3000');
  console.log('   3. Login with any of the credentials above\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
