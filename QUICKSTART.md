# 🚀 Quick Start - Metaltec Estoque

## Início Rápido (5 minutos)

### 1. Instalar PostgreSQL

**Windows**:
```bash
# Download PostgreSQL 14+ de postgresql.org
# OU use Docker:
docker run --name metaltec-db -e POSTGRES_PASSWORD=metaltec123 -e POSTGRES_DB=metaltec_estoque -p 5432:5432 -d postgres:14
```

**Mac**:
```bash
brew install postgresql@14
brew services start postgresql@14
createdb metaltec_estoque
```

**Linux**:
```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb metaltec_estoque
```

### 2. Configurar Banco de Dados

```bash
# Edite o arquivo .env se necessário (já está configurado)
# Depois execute:
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Rodar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

### 4. Fazer Login

Use qualquer uma das contas de demonstração:

- **Operador**: operador@metaltec.com.br / metaltec123
- **Gerente**: anderson@metaltec.com.br / metaltec123
- **Expedição**: karen@metaltec.com.br / metaltec123

## 📱 Testar no Celular

1. Descubra seu IP local:
   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. No celular, acesse:
   ```
   http://SEU-IP:3000
   ```

3. Instale como PWA:
   - Android: Menu → "Instalar app"
   - iOS: Compartilhar → "Adicionar à Tela de Início"

## 🔍 Testar Funcionalidades

### Buscar Produto
1. Na tela inicial, digite código: "1122 BR"
2. Clique no produto
3. Veja locais disponíveis

### Armazenar Item
1. Busque produto
2. Selecione quantidade (1, 2, 3...)
3. Escolha local sugerido
4. Confirme armazenagem

### Ver Dashboard (Desktop)
1. Acesse no navegador do PC
2. Veja KPIs e visualização dos andares
3. Monitore movimentações

## ❌ Problemas Comuns

### "Erro de conexão com banco"
```bash
# Verifique se PostgreSQL está rodando:
psql -U postgres -d metaltec_estoque

# Se não existir, crie:
createdb metaltec_estoque
```

### "Module not found"
```bash
# Reinstale dependências:
rm -rf node_modules package-lock.json
npm install
```

### "Prisma error"
```bash
# Regenere o Prisma Client:
npm run db:generate
npm run db:push
```

## 🎯 Próximos Passos

1. ✅ Sistema rodando localmente
2. 📱 Teste no celular
3. 👥 Adicione usuários reais
4. 📦 Importe produtos da planilha Excel
5. 🚀 Deploy em produção (Vercel)

## 📞 Precisa de Ajuda?

Consulte o README.md completo ou abra uma issue no GitHub.
