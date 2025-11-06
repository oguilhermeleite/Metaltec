'use client';

import { useState, useMemo } from 'react';
import { Search, Package, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  code: string;
  name: string;
  color: string;
  floor: number;
}

interface Movement {
  id: string;
  movementType: string;
  timestamp: string;
  product: Product;
  toLocation: string | null;
}

interface Props {
  products: Product[];
  recentMovements: Movement[];
  overflowCount: number;
  criticalCount: number;
}

export default function MobileSearchInterface({
  products,
  recentMovements,
  overflowCount,
  criticalCount,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return products
      .filter(p =>
        p.code.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [searchQuery, products]);

  const handleProductSelect = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-metaltec-blue text-white px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Metaltec Estoque</h1>
            <p className="text-blue-200 text-sm">Controle de Armazenagem</p>
          </div>
          <Link
            href="/profile"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Package className="w-5 h-5" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Buscar código do produto..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
              autoComplete="off"
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left touch-target"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.code}</p>
                    <p className="text-sm text-gray-600">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Andar {product.floor} • {product.color}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {isSearchFocused && searchQuery && filteredProducts.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl p-6 text-center z-50">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Nenhum produto encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Tente outro código</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/receive"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-metaltec-blue transition touch-target flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-medium text-gray-900 text-center">Armazenar Item</p>
            <p className="text-xs text-gray-500 mt-1">Receber de Guatupê</p>
          </Link>

          <Link
            href="/overflow"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-metaltec-blue transition touch-target flex flex-col items-center justify-center relative"
          >
            {overflowCount > 0 && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {overflowCount}
              </div>
            )}
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="font-medium text-gray-900 text-center">Gordura</p>
            <p className="text-xs text-gray-500 mt-1">Ver aguardando</p>
          </Link>

          <Link
            href="/critical"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-metaltec-blue transition touch-target flex flex-col items-center justify-center relative"
          >
            {criticalCount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {criticalCount}
              </div>
            )}
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="font-medium text-gray-900 text-center">Itens Críticos</p>
            <p className="text-xs text-gray-500 mt-1">0 caixas</p>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-metaltec-blue transition touch-target flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-medium text-gray-900 text-center">Ver Estoque</p>
            <p className="text-xs text-gray-500 mt-1">Visão completa</p>
          </Link>
        </div>
      </div>

      {/* Recent Movements */}
      {recentMovements.length > 0 && (
        <div className="px-4 pb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Movimentações Recentes</h2>
          <div className="space-y-2">
            {recentMovements.slice(0, 5).map((movement) => (
              <div
                key={movement.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{movement.product.code}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {movement.movementType === 'RECEIVED' && '📦 Recebido'}
                      {movement.movementType === 'STORED' && '✅ Armazenado'}
                      {movement.movementType === 'MOVED' && '🔄 Movido'}
                      {movement.movementType === 'WITHDRAWN' && '📤 Retirado'}
                      {movement.toLocation && ` → ${movement.toLocation}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(movement.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
