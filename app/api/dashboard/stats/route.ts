import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Get all products
    const products = await prisma.product.findMany({
      include: {
        overflow: {
          where: { resolved: false },
        },
      },
    });

    // Calculate statistics
    let criticalCount = 0; // All locations empty (0)
    let lowCount = 0; // At least one location with 1 box
    let fullCount = 0; // At least one location with 2 boxes
    let inProductionCount = 0; // At least one location with "OK"
    let totalBoxes = 0;

    products.forEach(product => {
      const locations = product.locations as Record<string, any>;
      const statuses = Object.values(locations);

      const hasEmpty = statuses.some(s => s === 0);
      const hasLow = statuses.some(s => s === 1);
      const hasFull = statuses.some(s => s === 2);
      const hasOK = statuses.some(s => s === 'OK');

      // Count boxes
      const productBoxes = statuses.reduce((sum, s) => {
        return sum + (typeof s === 'number' ? s : 0);
      }, 0);
      totalBoxes += productBoxes;

      // Categorize product
      if (hasOK) {
        inProductionCount++;
      } else if (hasFull) {
        fullCount++;
      } else if (hasLow) {
        lowCount++;
      } else if (statuses.every(s => s === 0)) {
        criticalCount++;
      }
    });

    // Get overflow count
    const overflowCount = await prisma.overflow.count({
      where: { resolved: false },
    });

    // Get oldest overflow item
    const oldestOverflow = await prisma.overflow.findFirst({
      where: { resolved: false },
      orderBy: { storedDate: 'asc' },
      include: { product: true },
    });

    // Get recent movements
    const recentMovements = await prisma.movement.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        product: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Floor statistics
    const floor1Products = products.filter(p => p.floor === 1);
    const floor2Products = products.filter(p => p.floor === 2);

    const floor1Boxes = floor1Products.reduce((sum, p) => {
      const locs = p.locations as Record<string, any>;
      return sum + Object.values(locs).reduce((s: number, v: any) =>
        s + (typeof v === 'number' ? v : 0), 0);
    }, 0);

    const floor2Boxes = floor2Products.reduce((sum, p) => {
      const locs = p.locations as Record<string, any>;
      return sum + Object.values(locs).reduce((s: number, v: any) =>
        s + (typeof v === 'number' ? v : 0), 0);
    }, 0);

    const floor1Capacity = floor1Products.length * 6 * 2; // products × 6 columns × 2 boxes
    const floor2Capacity = floor2Products.length * 6 * 2;

    const floor1Occupancy = floor1Capacity > 0
      ? Math.round((floor1Boxes / floor1Capacity) * 100)
      : 0;
    const floor2Occupancy = floor2Capacity > 0
      ? Math.round((floor2Boxes / floor2Capacity) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        critical: criticalCount,
        low: lowCount,
        full: fullCount,
        inProduction: inProductionCount,
        totalProducts: products.length,
        totalBoxes,
        overflow: {
          count: overflowCount,
          oldest: oldestOverflow ? {
            product: oldestOverflow.product,
            daysWaiting: Math.floor(
              (Date.now() - oldestOverflow.storedDate.getTime()) / (1000 * 60 * 60 * 24)
            ),
          } : null,
        },
        floors: {
          floor1: {
            products: floor1Products.length,
            boxes: floor1Boxes,
            capacity: floor1Capacity,
            occupancy: floor1Occupancy,
          },
          floor2: {
            products: floor2Products.length,
            boxes: floor2Boxes,
            capacity: floor2Capacity,
            occupancy: floor2Occupancy,
          },
        },
      },
      recentMovements,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Erro ao carregar estatísticas' }, { status: 500 });
  }
}
