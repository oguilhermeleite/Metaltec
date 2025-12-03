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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'IN_PRODUCTION';

    const productionOrders = await prisma.productionOrder.findMany({
      where: {
        status: status as any,
      },
      include: {
        product: true,
        orderedByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      orders: productionOrders,
      count: productionOrders.length,
    });
  } catch (error) {
    console.error('Production list error:', error);
    return NextResponse.json({ error: 'Erro ao listar produção' }, { status: 500 });
  }
}
