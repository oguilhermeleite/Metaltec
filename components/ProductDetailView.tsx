'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, AlertCircle, CheckCircle, Package, Clock } from 'lucide-react';
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
}

interface OverflowItem {
  id: string;
  quantity: number;
  dateStored: string;
}

interface Movement {
  id: string;
  movementType: string;
  timestamp: string;
  toLocation: string | null;
  fromLocation: string | null;
  quantityBefore: number;
  quantityAfter: number;
  user: { name: string };
}

interface Props {
  product: Product;
  currentLocations: Location[];
  availableLocations: Location[];
  overflowItems: OverflowItem[];
  recentMovements: Movement[];
  userName: string;
  userId: string;
}

export default function ProductDetailView({
  product,
  currentLocations,
  availableLocations,
  overflowItems,
  recentMovements,
  userName,
  userId,
}: Props) {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Smart suggestion: prioritize empty locations in same column as existing stock
  const suggestedLocation = availableLocations[0];

  const handleStore = async () => {
    if (!selectedLocation) {
      alert('Selecione um local de armazenagem');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/storage/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          locationId: selectedLocation,
          quantity,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao armazenar item');
      }

      setShowConfirmation(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (error) {
      alert('Erro ao armazenar item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreInOverflow = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/storage/overflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          waitingForFloor: product.floor,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao armazenar na gordura');
      }

      setShowConfirmation(true);
      setTimeout(() => {
        router.push('/overflow');
        router.refresh();
      }, 1500);
    } catch (error) {
      alert('Erro ao armazenar na gordura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Armazenado!</h2>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  const totalInStock = currentLocations.reduce((sum, loc) => sum + loc.quantity, 0);
  const totalInOverflow = overflowItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-metaltec-blue text-white px-4 py-4">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
        <h1 className="text-xl font-bold">{product.code}</h1>
        <p className="text-blue-200 text-sm mt-1">{product.name}</p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-8 py-6">
        <Link href="/" className="text-metaltec-blue hover:underline flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.code}</h1>
          <p className="text-gray-600 mt-1">{product.name}</p>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        {/* Product Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Andar</p>
              <p className="font-semibold text-gray-900">Andar {product.floor}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Cor</p>
              <p className="font-semibold text-gray-900">{product.color}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">No Estoque</p>
              <p className="font-semibold text-gray-900">{totalInStock} caixas</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Na Gordura</p>
              <p className="font-semibold text-gray-900">{totalInOverflow} caixas</p>
            </div>
          </div>
        </div>

        {/* Current Locations */}
        {currentLocations.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locais Atuais
            </h2>
            <div className="space-y-2">
              {currentLocations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    Andar {loc.floor}, {loc.column} - Posição {loc.boxPosition}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    loc.status === 'FULL' ? 'bg-green-100 text-green-700' :
                    loc.status === 'LOW' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {loc.quantity} caixas
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Armazenar Novas Caixas
          </h2>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantas caixas recebeu?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuantity(num)}
                  className={`flex-1 py-3 rounded-lg font-medium transition touch-target ${
                    quantity === num
                      ? 'bg-metaltec-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Available Locations */}
          {availableLocations.length > 0 ? (
            <>
              {suggestedLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">✨ Sugestão Inteligente</p>
                  <p className="text-sm text-blue-700">
                    Andar {suggestedLocation.floor}, {suggestedLocation.column} - Posição {suggestedLocation.boxPosition}
                    {suggestedLocation.quantity === 0 ? ' (Vazio)' : ` (${suggestedLocation.quantity} caixa)`}
                  </p>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o local de armazenagem:
              </label>
              <div className="space-y-2 mb-6">
                {availableLocations.slice(0, 6).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc.id)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left touch-target ${
                      selectedLocation === loc.id
                        ? 'border-metaltec-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Andar {loc.floor}, {loc.column} - Posição {loc.boxPosition}
                      </span>
                      <span className="text-sm text-gray-600">
                        {loc.quantity === 0 ? 'Vazio' : `${loc.quantity} caixa`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleStore}
                disabled={!selectedLocation || loading}
                className="w-full bg-metaltec-blue text-white py-4 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                {loading ? 'Armazenando...' : 'Confirmar Armazenagem'}
              </button>
            </>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 mb-1">Sem espaço disponível</p>
                    <p className="text-sm text-yellow-700">
                      Não há espaço nas prateleiras do Andar {product.floor}. Armazene na gordura.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStoreInOverflow}
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 touch-target"
              >
                {loading ? 'Armazenando...' : 'Armazenar na Gordura'}
              </button>
            </>
          )}
        </div>

        {/* Recent Movements */}
        {recentMovements.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Histórico de Movimentações
            </h2>
            <div className="space-y-3">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {movement.movementType === 'RECEIVED' && '📦 Recebido'}
                      {movement.movementType === 'STORED' && '✅ Armazenado'}
                      {movement.movementType === 'MOVED' && '🔄 Movido'}
                      {movement.movementType === 'WITHDRAWN' && '📤 Retirado'}
                      {movement.movementType === 'TRANSFERRED' && '↔️ Transferido'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {movement.toLocation && `→ ${movement.toLocation}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Por {movement.user.name} • {movement.quantityBefore} → {movement.quantityAfter} caixas
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(movement.timestamp).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
