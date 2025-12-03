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
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const skip = (page - 1) * limit;

    const where = productId ? { productId } : {};

    const [movements, total] = await Promise.all([
      prisma.movement.findMany({
        where,
        include: {
          product: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip,
      }),
      prisma.movement.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      movements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Movements history error:', error);
    return NextResponse.json({ error: 'Erro ao carregar histórico' }, { status: 500 });
  }
}
