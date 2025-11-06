import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProductDetailView from '@/components/ProductDetailView';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    redirect('/');
  }

  // Find current locations for this product
  const currentLocations = await prisma.location.findMany({
    where: { productId: product.id },
    orderBy: [{ floor: 'asc' }, { column: 'asc' }],
  });

  // Find available locations on the same floor
  const availableLocations = await prisma.location.findMany({
    where: {
      floor: product.floor,
      OR: [
        { productId: null },
        { productId: product.id, quantity: { lt: 2 } },
      ],
    },
    orderBy: [{ column: 'asc' }, { boxPosition: 'asc' }],
  });

  // Check if product is in overflow
  const overflowItems = await prisma.overflowItem.findMany({
    where: { productId: product.id },
  });

  // Get recent movements for this product
  const recentMovements = await prisma.movement.findMany({
    where: { productId: product.id },
    include: { user: true },
    orderBy: { timestamp: 'desc' },
    take: 10,
  });

  return (
    <ProductDetailView
      product={product}
      currentLocations={currentLocations}
      availableLocations={availableLocations}
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
      userName={session.user?.name || ''}
      userId={(session.user as any)?.id || ''}
    />
  );
}
