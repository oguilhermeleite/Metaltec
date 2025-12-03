import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { suggestBestLocation } from '@/lib/location-utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Digite pelo menos 2 caracteres para buscar' },
        { status: 400 }
      );
    }

    // Search products by code or name
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        overflow: {
          where: { resolved: false },
        },
        productionOrders: {
          where: { status: 'IN_PRODUCTION' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      take: 20, // Limit to 20 results
    });

    // Add smart suggestions for each product
    const productsWithSuggestions = products.map(product => {
      const locations = product.locations as Record<string, any>;
      const suggestion = suggestBestLocation(product.floor, locations);

      return {
        ...product,
        suggestion,
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithSuggestions,
      count: productsWithSuggestions.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
