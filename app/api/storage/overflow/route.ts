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

    const { productId, quantity, waitingForFloor, userId } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate priority (higher for older items)
    const daysWaiting = 0; // New item
    const priority = 10 - daysWaiting; // Will be updated by cron job

    // Create overflow item
    const overflowItem = await prisma.overflowItem.create({
      data: {
        productId: product.id,
        quantity,
        waitingForFloor: waitingForFloor || product.floor,
        priority,
        notes: 'Aguardando espaço na prateleira',
      },
    });

    // Create overflow action record
    await prisma.overflowAction.create({
      data: {
        overflowItemId: overflowItem.id,
        userId: userId || session.user?.email || 'unknown',
        action: 'ADDED',
        fromLocation: 'Recebimento',
        toLocation: 'OVERFLOW',
        quantity,
      },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: product.id,
        userId: userId || session.user?.email || 'unknown',
        movementType: 'RECEIVED',
        quantityBefore: 0,
        quantityAfter: quantity,
        toLocation: 'Gordura (Overflow)',
        notes: `Armazenado ${quantity} caixa(s) na gordura`,
      },
    });

    return NextResponse.json({
      success: true,
      overflowItem,
    });
  } catch (error) {
    console.error('Overflow storage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
