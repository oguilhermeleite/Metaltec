'use client';

import { useRouter } from 'next/navigation';
import { Package, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-metaltec-blue to-blue-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-metaltec-blue rounded-full mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Metaltec Estoque</h1>
          <p className="text-sm text-gray-600 mt-2">Sistema de Controle de Estoque</p>
        </div>

        {/* Static Mode Warning */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-yellow-900 mb-2">Autenticação Desabilitada</h2>
              <p className="text-xs text-yellow-800">
                O login está desabilitado porque este site está rodando em modo estático no GitHub Pages.
                Não há servidor backend ou banco de dados disponível.
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-4">
            Este é um site estático de demonstração. Para usar o sistema completo com autenticação e banco de dados,
            você precisa:
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Servidor Node.js</li>
            <li>• Banco de dados PostgreSQL</li>
            <li>• Variáveis de ambiente configuradas</li>
          </ul>
        </div>

        {/* Navigation */}
        <button
          onClick={() => router.push('/')}
          className="w-full mt-6 bg-metaltec-blue text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition"
        >
          Voltar para Página Inicial
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Consulte o README.md para instruções de instalação completa
          </p>
        </div>
      </div>
    </div>
  );
}
