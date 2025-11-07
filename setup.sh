#!/bin/bash

echo "================================================"
echo "   METALTEC ESTOQUE - SETUP AUTOMÁTICO"
echo "================================================"
echo ""

# Check Node.js
echo "[1/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ ERRO: Node.js não encontrado!"
    echo "Instale em: https://nodejs.org"
    exit 1
fi
echo "✅ OK: Node.js instalado!"
echo ""

# Install dependencies
echo "[2/4] Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ ERRO ao instalar dependências!"
    exit 1
fi
echo "✅ OK: Dependências instaladas!"
echo ""

# Generate Prisma Client
echo "[3/4] Gerando Prisma Client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "❌ ERRO ao gerar Prisma Client!"
    exit 1
fi
echo "✅ OK: Prisma Client gerado!"
echo ""

# Check PostgreSQL
echo "[4/4] Verificando PostgreSQL..."
npm run db:push > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo ""
    echo "================================================"
    echo "   ⚠️  ATENÇÃO: PostgreSQL não está rodando!"
    echo "================================================"
    echo ""
    echo "Escolha uma opção:"
    echo ""
    echo "1. Usar Docker (recomendado):"
    echo "   docker run --name metaltec-db -e POSTGRES_PASSWORD=metaltec123 -e POSTGRES_USER=metaltec -e POSTGRES_DB=metaltec_estoque -p 5432:5432 -d postgres:14"
    echo ""
    echo "2. Instalar PostgreSQL:"
    echo "   Mac: brew install postgresql@14"
    echo "   Linux: sudo apt install postgresql"
    echo ""
    echo "Depois execute:"
    echo "   npm run db:push"
    echo "   npm run db:seed"
    echo "   npm run dev"
    echo ""
    exit 1
fi

echo "Criando banco de dados e populando com dados..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "⚠️  AVISO: Seed pode ter falhado. Tente manualmente: npm run db:seed"
fi
echo ""

echo "================================================"
echo "   ✅ SETUP COMPLETO!"
echo "================================================"
echo ""
echo "Para iniciar o servidor:"
echo "   npm run dev"
echo ""
echo "Depois acesse: http://localhost:3000"
echo ""
echo "Login:"
echo "   Email: operador@metaltec.com.br"
echo "   Senha: metaltec123"
echo ""
echo "================================================"
