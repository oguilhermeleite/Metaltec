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

    const { productId, quantity, waitingForColumn } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    });

    // Create overflow item
    const overflowItem = await prisma.overflow.create({
      data: {
        productId: product.id,
        quantity,
        waitingForFloor: product.floor,
        waitingForColumn: waitingForColumn || null,
        notes: 'Aguardando espaço em prateleira',
        resolved: false,
      },
    });

    // Create movement record
    await prisma.movement.create({
      data: {
        productId: product.id,
        type: 'OVERFLOW',
        from: 'RECEBIMENTO',
        to: 'GORDURA',
        quantity,
        userId: user?.id || '',
        notes: `${quantity} caixa(s) enviada(s) para gordura - sem espaço`,
      },
    });

    return NextResponse.json({
      success: true,
      overflowItem,
    });
  } catch (error) {
    console.error('Overflow error:', error);
    return NextResponse.json({ error: 'Erro ao armazenar na gordura' }, { status: 500 });
  }
}

// GET - List overflow items
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved') === 'true';

    const overflowItems = await prisma.overflow.findMany({
      where: { resolved },
      include: {
        product: true,
      },
      orderBy: { storedDate: 'asc' }, // Oldest first
    });

    return NextResponse.json({
      success: true,
      items: overflowItems,
      count: overflowItems.length,
    });
  } catch (error) {
    console.error('Overflow list error:', error);
    return NextResponse.json({ error: 'Erro ao listar gordura' }, { status: 500 });
  }
}
