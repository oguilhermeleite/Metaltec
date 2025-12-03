import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateNewStatus } from '@/lib/location-utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { overflowId, column, quantity } = await request.json();

    if (!overflowId || !column) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Get overflow item
    const overflowItem = await prisma.overflow.findUnique({
      where: { id: overflowId },
      include: { product: true },
    });

    if (!overflowItem) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    }

    const product = overflowItem.product;
    const locations = product.locations as Record<string, any>;
    const currentStatus = locations[column] ?? 0;

    // Validate space available
    const transferQty = quantity || overflowItem.quantity;
    if (typeof currentStatus === 'number' && currentStatus + transferQty > 2) {
      return NextResponse.json(
        { error: 'Espaço insuficiente na localização' },
        { status: 400 }
      );
    }

    // Update product location
    const newStatus = calculateNewStatus(currentStatus, transferQty);
    const updatedLocations = {
      ...locations,
      [column]: newStatus,
    };

    await prisma.product.update({
      where: { id: product.id },
      data: { locations: updatedLocations },
    });

    // Update overflow item
    const remainingQty = overflowItem.quantity - transferQty;
    if (remainingQty <= 0) {
      await prisma.overflow.update({
        where: { id: overflowId },
        data: {
          resolved: true,
          resolvedAt: new Date(),
        },
      });
    } else {
      await prisma.overflow.update({
        where: { id: overflowId },
        data: { quantity: remainingQty },
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: product.id,
        type: 'TRANSFER',
        from: 'GORDURA',
        to: column,
        quantity: transferQty,
        userId: user?.id || '',
        notes: `Transferido ${transferQty} caixa(s) da gordura para ${column}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${transferQty} caixa(s) transferida(s) com sucesso`,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json({ error: 'Erro ao transferir' }, { status: 500 });
  }
}
