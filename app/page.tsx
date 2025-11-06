import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MobileSearchInterface from '@/components/MobileSearchInterface';
import DesktopDashboard from '@/components/DesktopDashboard';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch initial data for the dashboard
  const [products, locations, overflowItems, recentMovements] = await Promise.all([
    prisma.product.findMany({
      take: 100,
      orderBy: { code: 'asc' },
    }),
    prisma.location.findMany({
      include: { product: true },
      orderBy: [{ floor: 'asc' }, { column: 'asc' }, { boxPosition: 'asc' }],
    }),
    prisma.overflowItem.findMany({
      include: { product: true },
      orderBy: { dateStored: 'asc' },
      take: 20,
    }),
    prisma.movement.findMany({
      include: { product: true, user: true },
      orderBy: { timestamp: 'desc' },
      take: 10,
    }),
  ]);

  // Calculate KPIs
  const criticalLocations = locations.filter(l => l.status === 'EMPTY' && l.productId).length;
  const lowStock = locations.filter(l => l.status === 'LOW').length;
  const inProduction = locations.filter(l => l.status === 'IN_PRODUCTION').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View - Primary Interface */}
      <div className="lg:hidden">
        <MobileSearchInterface
          products={products}
          recentMovements={recentMovements.map(m => ({
            ...m,
            timestamp: m.timestamp.toISOString(),
          }))}
          overflowCount={overflowItems.length}
          criticalCount={criticalLocations}
        />
      </div>

      {/* Desktop View - Dashboard */}
      <div className="hidden lg:block">
        <DesktopDashboard
          products={products}
          locations={locations}
          overflowItems={overflowItems.map(item => ({
            ...item,
            dateStored: item.dateStored.toISOString(),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          }))}
          recentMovements={recentMovements.map(m => ({
            ...m,
            timestamp: m.timestamp.toISOString(),
          }))}
          kpis={{
            critical: criticalLocations,
            low: lowStock,
            inProduction,
            overflow: overflowItems.length,
          }}
        />
      </div>
    </div>
  );
}
