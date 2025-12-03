import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateNewStatus, checkOverflowSpaceOpened } from '@/lib/location-utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { productId, column, quantity } = await request.json();

    if (!productId || !column || !quantity) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Get product with current locations
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const locations = product.locations as Record<string, any>;
    const currentStatus = locations[column] ?? 0;

    // Check if location can accept more boxes
    if (currentStatus === 'OK') {
      return NextResponse.json(
        { error: 'Localização marcada como "Em Produção"' },
        { status: 400 }
      );
    }

    if (typeof currentStatus === 'number' && currentStatus + quantity > 2) {
      return NextResponse.json(
        { error: 'Esta localização não tem espaço suficiente' },
        { status: 400 }
      );
    }

    // Calculate new status
    const newStatus = calculateNewStatus(currentStatus, quantity);

    // Update product locations
    const updatedLocations = {
      ...locations,
      [column]: newStatus,
    };

    await prisma.product.update({
      where: { id: productId },
      data: { locations: updatedLocations },
    });

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: product.id,
        type: 'STORAGE',
        from: 'RECEBIMENTO',
        to: column,
        quantity: quantity,
        userId: user?.id || '',
        notes: `Armazenado ${quantity} caixa(s) em ${column}`,
      },
    });

    // Check if space opened up for overflow items
    const spaceOpened = checkOverflowSpaceOpened(
      product.floor,
      column,
      currentStatus,
      newStatus
    );

    if (spaceOpened) {
      // Find overflow items waiting for this location
      const waitingItems = await prisma.overflow.findMany({
        where: {
          productId: product.id,
          waitingForColumn: column,
          resolved: false,
        },
        include: {
          product: true,
        },
      });

      return NextResponse.json({
        success: true,
        product: { ...product, locations: updatedLocations },
        overflowAlert: waitingItems.length > 0 ? {
          message: `${waitingItems.length} item(ns) na gordura aguardando por ${column}`,
          items: waitingItems,
        } : null,
      });
    }

    return NextResponse.json({
      success: true,
      product: { ...product, locations: updatedLocations },
    });
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json(
      { error: 'Erro ao armazenar produto' },
      { status: 500 }
    );
  }
}
