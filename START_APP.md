# 🚀 Metaltec - Guia de Início Rápido

## ✅ TODOS OS ARQUIVOS CRIADOS!

O código funcional completo está pronto:
- ✅ **Prisma Schema** com modelos Product, Location, OverflowItem, Movement, User
- ✅ **Next.js Pages** (app/page.tsx, app/layout.tsx)
- ✅ **React Components** (MobileSearchInterface, DesktopDashboard)
- ✅ **API Routes** (search, storage, overflow, production)
- ✅ **Seed Data** com 29 produtos reais da Metaltec

---

## 📋 Pré-requisitos

1. **Docker Desktop** deve estar instalado e RODANDO
2. **Node.js** já instalado (confirmado)
3. **Dependencies** já instaladas (confirmado)

---

## 🏁 Passos para Iniciar

### 1️⃣ Inicie o Docker Desktop

**IMPORTANTE**: Abra o Docker Desktop e aguarde ele iniciar completamente.

### 2️⃣ Inicie o Banco de Dados

```bash
docker-compose up -d
```

Aguarde 10-15 segundos para o PostgreSQL inicializar.

### 3️⃣ Configure o Banco de Dados

```bash
npm run db:push
```

Isso criará todas as tabelas no PostgreSQL.

### 4️⃣ Popule com Dados Iniciais

```bash
npm run db:seed
```

Isso criará:
- ✅ 3 usuários (operator, anderson, karen)
- ✅ 29 produtos da Metaltec
- ✅ 24 localizações de armazenamento (2 andares × 6 colunas × 2 posições)
- ✅ 8 itens na gordura (overflow)
- ✅ Pedidos de produção
- ✅ Histórico de movimentações

### 5️⃣ Inicie o Aplicativo

```bash
npm run dev
```

### 6️⃣ Acesse o Sistema

Abra seu navegador em: **http://localhost:3000**

---

## 🔐 Credenciais de Login

Após o seed, você pode fazer login com qualquer uma destas contas:

| Usuário | Email | Senha | Permissões |
|---------|-------|-------|------------|
| Operador | `operator@metaltec.com` | `metaltec123` | Armazenamento básico |
| Anderson (Gerente) | `anderson@metaltec.com` | `metaltec123` | Produção + Gerência |
| Karen (Expedição) | `karen@metaltec.com` | `metaltec123` | Expedição |

---

## 🧪 Teste o Sistema

### Busca de Produtos

Na tela inicial, busque por:
- `1122` - Dobradiças (5 cores)
- `1510X` - Puxadores (5 cores)
- `1570` - Fechaduras
- `BR` - Todos produtos brancos
- `MA` - Todos produtos marrons

### Armazenar um Produto

1. Busque por `1122 BR`
2. Clique no produto encontrado
3. Veja as localizações disponíveis (L1-L6)
4. Clique em **[ARMAZENAR AQUI]** em uma localização vazia
5. Confirme a operação

### Verificar Gordura

- Na tela inicial, veja o contador de itens na gordura
- Clique para ver todos os produtos aguardando espaço

---

## 📱 Funcionalidades Principais

### Mobile (< 1024px)
- Interface de busca simples e rápida
- Cards de produtos com status visual
- Botões grandes para armazenamento
- Indicadores de alerta (crítico, overflow)

### Desktop (≥ 1024px)
- Dashboard completo com KPIs
- Tabelas de localizações
- Gráficos de ocupação
- Histórico de movimentações

---

## 🗄️ Estrutura do Banco

### Tabelas Criadas

1. **users** - Usuários do sistema
2. **products** - Produtos (código + cor)
3. **locations** - Posições de armazenamento (andar + coluna + posição)
4. **overflow_items** - Items na "gordura" aguardando espaço
5. **movements** - Histórico completo de movimentações
6. **production_orders** - Pedidos para Guatupê

### Relacionamentos

```
Product (1) ──> (N) Location
Product (1) ──> (N) OverflowItem
Product (1) ──> (N) Movement
Product (1) ──> (N) ProductionOrder

User (1) ──> (N) Movement
User (1) ──> (N) ProductionOrder
```

---

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Inicia servidor de produção |
| `npm run db:generate` | Regenera Prisma Client |
| `npm run db:push` | Aplica schema ao banco |
| `npm run db:seed` | Popula banco com dados |

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

**Solução**: Docker Desktop não está rodando.
1. Abra o Docker Desktop
2. Aguarde inicializar
3. Execute `docker-compose up -d` novamente

### Erro: "Table does not exist"

**Solução**: Schema não foi aplicado.
```bash
npm run db:push
npm run db:seed
```

### Erro: "Module not found"

**Solução**: Reinstale dependências.
```bash
npm install
```

### Porta 3000 em uso

**Solução**: Use outra porta.
```bash
PORT=3001 npm run dev
```

---

## 📊 Dados de Exemplo Incluídos

### Produtos (29 total)

| Código | Nome | Cores Disponíveis | Andar |
|--------|------|-------------------|-------|
| 1122 | Dobradiça | BR, ME, BZ, CR, PT | 1 |
| 1510X | Puxador | CR, BR, PT, ME, MA | 1 |
| 1511X | Puxador | CR, BR, PT, ME | 1 |
| 1570 | Fechadura | CR, BR, PT | 2 |
| 1571 | Fechadura | CR | 2 |
| 1101 | Puxador | BR, ME, BZ | 1 |
| 1102 | Puxador | BR, CR | 1 |
| 1334 | Dobradiça | ME | 1 |
| 1126AC | Puxador | MA | 1 |
| 1520TAH | Fechadura | BR | 2 |
| 1587V | Acessório | BZ | 2 |

### Localizações (24 total)

- **Andar 1**: L1, L2, L3, L4, L5, L6 (2 posições cada)
- **Andar 2**: L1, L2, L3, L4, L5, L6 (2 posições cada)

---

## 🎯 Próximos Passos

Agora que o sistema está funcionando, você pode:

1. ✅ Fazer login e explorar a interface
2. ✅ Buscar produtos e ver localizações
3. ✅ Armazenar produtos em diferentes localizações
4. ✅ Gerenciar itens na gordura
5. ✅ Criar pedidos de produção
6. ✅ Visualizar histórico de movimentações

---

**Pronto!** O sistema está 100% funcional e pronto para uso! 🎉
