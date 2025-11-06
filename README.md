# Metaltec Estoque | Controle

Sistema completo de controle de estoque para Metaltec Ferragens - Fabricante de ferragens para vidro temperado em São José dos Pinhais/PR.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Visão Geral

Sistema web responsivo (mobile-first + desktop) para controle de armazenagem que substitui planilhas manuais e otimiza o processo de estocagem de peças no armazém da Metaltec.

### Funcionalidades Principais

✅ **Interface Mobile-First** - Otimizada para operadores de armazém
✅ **Busca Inteligente** - Autocomplete com resultados instantâneos
✅ **Sugestões de Localização** - Sistema inteligente sugere melhor local para armazenar
✅ **Gestão de Overflow (Gordura)** - Controle de itens aguardando espaço
✅ **Dashboard Desktop** - Visualização completa com KPIs e mapas de calor
✅ **Histórico de Movimentações** - Auditoria completa de todas as operações
✅ **PWA** - Instalável no celular, funciona offline
✅ **Multi-usuário** - Diferentes permissões por função

## 🏢 Contexto do Negócio

### Estrutura do Armazém

- **2 Andares** (Floor 1 e Floor 2)
- Cada andar tem **6 Colunas** (L1, L2, L3, L4, L5, L6)
- Cada coluna comporta **até 2 caixas**
- **Total**: 24 posições de armazenagem (2 × 6 × 2)

### Status de Estoque

- `0` = **CRITICAL** (sem caixas) - Vermelho
- `1` = **LOW** (1 caixa) - Amarelo
- `2` = **FULL** (2 caixas) - Verde
- `OK` = **IN PRODUCTION** na Guatupê - Azul

### Fluxo Operacional

```
Produção (Afonso Pena)
  ↓
Guatupê (Pintura)
  ↓
Retorno → Armazém
  ↓
Expedição (Karen)
```

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **PWA**: Service Worker + Manifest
- **Deployment**: Vercel-ready

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/metaltec/estoque-control.git
cd estoque-control
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/metaltec_estoque?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Para gerar o `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. **Configure o banco de dados**

```bash
# Gerar Prisma Client
npm run db:generate

# Criar as tabelas no banco
npm run db:push

# Popular com dados de exemplo
npm run db:seed
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000)

## 👥 Usuários de Demonstração

Após executar o seed, você terá acesso com:

| Usuário | Email | Senha | Permissões |
|---------|-------|-------|------------|
| **Operador** | operador@metaltec.com.br | metaltec123 | Armazenar, mover, consultar |
| **Gerente (Anderson)** | anderson@metaltec.com.br | metaltec123 | Dashboard, marcar como "OK", relatórios |
| **Expedição (Karen)** | karen@metaltec.com.br | metaltec123 | Visualizar estoque, registrar retiradas |

## 📱 Uso do Sistema

### Interface Mobile (Operador)

1. **Receber Peças do Caminhão**
   - Abrir app no celular
   - Buscar código do produto (ex: "1122 BR")
   - Sistema mostra locais disponíveis
   - Selecionar quantidade de caixas (1, 2, 3...)
   - Confirmar armazenagem

2. **Sem Espaço? → Gordura**
   - Sistema detecta quando não há espaço
   - Oferece opção "Armazenar na Gordura"
   - Item fica aguardando com prioridade por tempo

3. **Transferir da Gordura para Prateleira**
   - Ver itens na gordura (ordenados por mais antigos)
   - Sistema alerta quando abrir espaço
   - Transferir com 1 clique

### Interface Desktop (Gestão)

1. **Dashboard com KPIs**
   - Itens críticos (0 caixas)
   - Estoque baixo (1 caixa)
   - Em produção (OK)
   - Na gordura

2. **Visualização de Andares**
   - Mapa de calor por coluna
   - Percentual de ocupação
   - Status visual por cor

3. **Relatórios**
   - Movimentações recentes
   - Itens aguardando há mais tempo
   - Histórico completo

## 🗄️ Estrutura do Banco de Dados

### Principais Tabelas

- **users** - Usuários e permissões
- **products** - Catálogo de produtos (~200 itens)
- **locations** - 24 posições físicas de armazenagem
- **overflow_items** - Itens na gordura aguardando espaço
- **movements** - Histórico completo de movimentações
- **production_orders** - Itens marcados como "OK" (em produção)

## 🎨 Design System

### Cores Oficiais Metaltec

- **Primário**: `#1e3a8a` (Metaltec Blue)
- **Secundário**: `#3b82f6` (Light Blue)
- **Sucesso**: `#22c55e` (Green)
- **Aviso**: `#eab308` (Yellow)
- **Crítico**: `#ef4444` (Red)

### Tipografia

- Família: System fonts (San Francisco, Segoe UI, Roboto)
- Tamanho mínimo: 16px (evita zoom no iOS)
- Alvos de toque: Mínimo 44px × 44px

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Build para produção
npm start           # Inicia servidor de produção

# Database
npm run db:generate  # Gera Prisma Client
npm run db:push      # Sincroniza schema com DB
npm run db:seed      # Popula com dados de exemplo

# Qualidade
npm run lint         # Roda ESLint
```

## 📊 Banco de Dados PostgreSQL

### Configuração Local com Docker

```bash
docker run --name metaltec-db \
  -e POSTGRES_USER=metaltec \
  -e POSTGRES_PASSWORD=metaltec123 \
  -e POSTGRES_DB=metaltec_estoque \
  -p 5432:5432 \
  -d postgres:14
```

### Configuração de Produção

Recomendações:
- **Supabase** (PostgreSQL gerenciado gratuito)
- **Railway** (PostgreSQL + deploy do app)
- **Render** (PostgreSQL gratuito)

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositório no Vercel
2. Adicionar variáveis de ambiente
3. Deploy automático

```bash
vercel --prod
```

### Variáveis de Ambiente para Produção

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="sua-chave-secreta"
```

## 📱 Instalação como PWA

### No Android (Chrome)

1. Acesse o sistema no navegador
2. Menu (⋮) → "Instalar app"
3. Ícone aparecerá na tela inicial

### No iOS (Safari)

1. Acesse o sistema
2. Botão Compartilhar
3. "Adicionar à Tela de Início"

## 🔐 Segurança

- ✅ Autenticação com NextAuth
- ✅ Senhas com hash bcrypt
- ✅ Sessions JWT
- ✅ Proteção de rotas server-side
- ✅ Validação de permissões por role
- ✅ Auditoria completa de movimentações

## 🐛 Troubleshooting

### Erro de Conexão com Banco

```bash
# Verifique se o PostgreSQL está rodando
psql -U metaltec -d metaltec_estoque

# Recrie o banco se necessário
npm run db:push
```

### PWA não instala

- Certifique-se que está em HTTPS (produção)
- Limpe cache do navegador
- Verifique console para erros do Service Worker

### Problemas com Prisma

```bash
# Regenerar client
npm run db:generate

# Reset completo (CUIDADO: apaga dados)
npx prisma migrate reset
```

## 📈 Roadmap

### Fase 1 - MVP ✅
- [x] Sistema de autenticação
- [x] Busca e armazenagem mobile
- [x] Dashboard desktop
- [x] Gestão de overflow
- [x] Histórico de movimentações

### Fase 2 - Melhorias 🚧
- [ ] Notificações push quando espaço abre
- [ ] Relatórios em PDF/Excel
- [ ] Gráficos de tendências
- [ ] Busca por código de barras (câmera)

### Fase 3 - Avançado 📋
- [ ] Integração com ERP
- [ ] Previsão de reabastecimento (ML)
- [ ] App nativo (React Native)
- [ ] Integração com Guatupê

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da **Metaltec Ferragens**.

## 📞 Suporte

Para dúvidas ou problemas:
- **Email**: suporte@metaltecferragens.com.br
- **Website**: https://metaltecferragens.com.br
- **Issues**: GitHub Issues

---

Desenvolvido com ❤️ para Metaltec Ferragens
São José dos Pinhais/PR - Brasil
