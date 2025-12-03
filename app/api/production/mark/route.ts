import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { productId, column, quantityOrdered, expectedDate, notes } = await request.json();

    if (!productId || !column) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    });

    // Check if user is manager
    if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas gerentes podem marcar como em produção' },
        { status: 403 }
      );
    }

    // Update product location to "OK"
    const locations = product.locations as Record<string, any>;
    const updatedLocations = {
      ...locations,
      [column]: 'OK',
    };

    await prisma.product.update({
      where: { id: productId },
      data: { locations: updatedLocations },
    });

    // Create production order
    const productionOrder = await prisma.productionOrder.create({
      data: {
        productId: product.id,
        quantityOrdered: quantityOrdered || 10,
        orderedBy: user.id,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        status: 'IN_PRODUCTION',
        notes: notes || 'Estoque crítico - produção solicitada',
      },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: product.id,
        type: 'PRODUCTION',
        from: column,
        to: 'PRODUÇÃO',
        quantity: 0,
        userId: user.id,
        notes: `Marcado como em produção (OK) em ${column}`,
      },
    });

    return NextResponse.json({
      success: true,
      productionOrder,
      message: 'Produto marcado como em produção',
    });
  } catch (error) {
    console.error('Production mark error:', error);
    return NextResponse.json({ error: 'Erro ao marcar produção' }, { status: 500 });
  }
}
