'use client';

import { Package, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  code: string;
  name: string;
  color: string;
  floor: number;
}

interface Location {
  id: string;
  floor: number;
  column: string;
  boxPosition: number;
  status: string;
  quantity: number;
  productId: string | null;
  product: Product | null;
}

interface OverflowItem {
  id: string;
  quantity: number;
  dateStored: string;
  product: Product;
}

interface Movement {
  id: string;
  movementType: string;
  timestamp: string;
  product: Product;
  toLocation: string | null;
  user: { name: string };
}

interface KPIs {
  critical: number;
  low: number;
  inProduction: number;
  overflow: number;
}

interface Props {
  products: Product[];
  locations: Location[];
  overflowItems: OverflowItem[];
  recentMovements: Movement[];
  kpis: KPIs;
}

export default function DesktopDashboard({
  products,
  locations,
  overflowItems,
  recentMovements,
  kpis,
}: Props) {
  // Calculate floor occupancy
  const floor1Locations = locations.filter(l => l.floor === 1);
  const floor2Locations = locations.filter(l => l.floor === 2);
  const floor1Occupancy = (floor1Locations.filter(l => l.quantity > 0).length / floor1Locations.length) * 100;
  const floor2Occupancy = (floor2Locations.filter(l => l.quantity > 0).length / floor2Locations.length) * 100;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Metaltec Estoque | Controle</h1>
            <p className="text-gray-600 mt-1">Dashboard de Controle de Armazenagem</p>
          </div>
          <Link
            href="/receive"
            className="bg-metaltec-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition"
          >
            + Armazenar Item
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-3xl font-bold text-red-600">{kpis.critical}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Itens Críticos</h3>
            <p className="text-xs text-gray-400 mt-1">0 caixas no estoque</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-yellow-600">{kpis.low}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Estoque Baixo</h3>
            <p className="text-xs text-gray-400 mt-1">1 caixa apenas</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-blue-600">{kpis.inProduction}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Em Produção</h3>
            <p className="text-xs text-gray-400 mt-1">Status: OK</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-orange-600">{kpis.overflow}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Na Gordura</h3>
            <p className="text-xs text-gray-400 mt-1">Aguardando espaço</p>
          </div>
        </div>

        {/* Floor Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Floor 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Andar 1</h2>
              <span className="text-sm text-gray-600">{floor1Occupancy.toFixed(0)}% ocupado</span>
            </div>
            <div className="space-y-2">
              {['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((column) => {
                const columnLocations = floor1Locations.filter(l => l.column === column);
                const filled = columnLocations.filter(l => l.quantity > 0).length;
                return (
                  <div key={column} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 w-8">{column}</span>
                    <div className="flex-1 flex gap-1">
                      {columnLocations.map((loc) => (
                        <div
                          key={loc.id}
                          className={`flex-1 h-10 rounded ${
                            loc.status === 'EMPTY' ? 'bg-gray-100' :
                            loc.status === 'LOW' ? 'bg-yellow-400' :
                            loc.status === 'FULL' ? 'bg-green-500' :
                            'bg-blue-500'
                          }`}
                          title={loc.product?.code || 'Vazio'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">{filled}/2</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floor 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Andar 2</h2>
              <span className="text-sm text-gray-600">{floor2Occupancy.toFixed(0)}% ocupado</span>
            </div>
            <div className="space-y-2">
              {['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((column) => {
                const columnLocations = floor2Locations.filter(l => l.column === column);
                const filled = columnLocations.filter(l => l.quantity > 0).length;
                return (
                  <div key={column} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 w-8">{column}</span>
                    <div className="flex-1 flex gap-1">
                      {columnLocations.map((loc) => (
                        <div
                          key={loc.id}
                          className={`flex-1 h-10 rounded ${
                            loc.status === 'EMPTY' ? 'bg-gray-100' :
                            loc.status === 'LOW' ? 'bg-yellow-400' :
                            loc.status === 'FULL' ? 'bg-green-500' :
                            'bg-blue-500'
                          }`}
                          title={loc.product?.code || 'Vazio'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">{filled}/2</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Movements & Overflow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Movements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Movimentações Recentes</h2>
            <div className="space-y-3">
              {recentMovements.slice(0, 5).map((movement) => (
                <div key={movement.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{movement.product.code}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {movement.movementType} {movement.toLocation && `→ ${movement.toLocation}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Por {movement.user.name}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(movement.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Overflow Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Itens na Gordura</h2>
            {overflowItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum item aguardando</p>
            ) : (
              <div className="space-y-3">
                {overflowItems.slice(0, 5).map((item) => {
                  const daysWaiting = Math.floor(
                    (Date.now() - new Date(item.dateStored).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={item.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.code}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.quantity} caixas</p>
                      </div>
                      <p className="text-xs text-orange-600 font-medium">
                        {daysWaiting}d aguardando
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
