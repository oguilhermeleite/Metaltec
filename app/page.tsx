'use client';

import { Package, AlertTriangle, Database } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-metaltec-blue to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-metaltec-blue rounded-full mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Metaltec Estoque</h1>
          <p className="text-lg text-gray-600 mt-2">Sistema de Controle de Estoque</p>
        </div>

        {/* Static Mode Warning */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">Modo Estático Ativado</h2>
              <p className="text-sm text-yellow-800">
                Este site está hospedado no GitHub Pages como uma página estática.
                Todos os recursos de banco de dados foram desabilitados.
              </p>
            </div>
          </div>
        </div>

        {/* Features Disabled */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Database className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recursos Desabilitados:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Autenticação de usuários (NextAuth)</li>
                <li>• Banco de dados PostgreSQL (Prisma)</li>
                <li>• API Routes do Next.js</li>
                <li>• Busca e armazenagem de produtos</li>
                <li>• Dashboard com dados reais</li>
                <li>• Gestão de overflow (Gordura)</li>
                <li>• Histórico de movimentações</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Sobre o Projeto:</h3>
          <p className="text-sm text-gray-700 mb-4">
            Sistema completo de controle de estoque para Metaltec Ferragens - Fabricante de ferragens
            para vidro temperado em São José dos Pinhais/PR.
          </p>

          <div className="bg-metaltec-blue bg-opacity-5 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Tecnologias:</span> Next.js 14, React, TypeScript,
              Tailwind CSS, PostgreSQL, Prisma, NextAuth.js
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Para executar com todos os recursos funcionais, você precisa de um servidor Node.js
            com PostgreSQL. Consulte o README.md para instruções de instalação completa.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            Desenvolvido para Metaltec Ferragens
          </p>
          <p className="text-xs text-gray-500 mt-1">
            São José dos Pinhais/PR - Brasil
          </p>
        </div>
      </div>
    </div>
  );
}
