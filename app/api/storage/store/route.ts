import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, locationId, quantity, userId } = await request.json();

    if (!productId || !locationId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the location and product
    const [location, product] = await Promise.all([
      prisma.location.findUnique({ where: { id: locationId } }),
      prisma.product.findUnique({ where: { id: productId } }),
    ]);

    if (!location || !product) {
      return NextResponse.json(
        { error: 'Location or product not found' },
        { status: 404 }
      );
    }

    // Calculate new quantity
    const newQuantity = location.quantity + quantity;
    if (newQuantity > 2) {
      return NextResponse.json(
        { error: 'Cannot store more than 2 boxes per location' },
        { status: 400 }
      );
    }

    // Determine new status
    let newStatus: 'EMPTY' | 'LOW' | 'FULL' = 'EMPTY';
    if (newQuantity === 1) newStatus = 'LOW';
    else if (newQuantity === 2) newStatus = 'FULL';

    // Update location
    const updatedLocation = await prisma.location.update({
      where: { id: locationId },
      data: {
        productId: product.id,
        quantity: newQuantity,
        status: newStatus,
      },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: product.id,
        locationId: location.id,
        userId: userId || session.user?.email || 'unknown',
        movementType: 'STORED',
        quantityBefore: location.quantity,
        quantityAfter: newQuantity,
        toLocation: `Andar ${location.floor}, ${location.column}`,
        notes: `Armazenado ${quantity} caixa(s)`,
      },
    });

    return NextResponse.json({
      success: true,
      location: updatedLocation,
    });
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
