# 🚀 COMECE AQUI - Metaltec Estoque

## ⚡ Início Ultra-Rápido (2 Comandos)

### Tem Docker? Use isso:

```bash
# 1. Inicie o PostgreSQL
docker-compose up -d

# 2. Configure e rode
npm run db:push && npm run db:seed && npm run dev
```

**Pronto!** Acesse: http://localhost:3000

---

### Não tem Docker? Use o script:

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## 📱 USANDO O SISTEMA

### 1️⃣ Faça Login

- **Email**: `operador@metaltec.com.br`
- **Senha**: `metaltec123`

### 2️⃣ Busque um Produto

Digite na busca: `1122 BR`

### 3️⃣ Armazene Caixas

1. Selecione quantidade (1, 2, 3...)
2. Escolha o local sugerido
3. Confirme!

### 4️⃣ Veja o Dashboard

No desktop, visualize:
- Mapa dos andares
- Itens críticos
- Movimentações recentes

---

## 📂 ARQUIVOS IMPORTANTES

| Arquivo | O que faz |
|---------|-----------|
| `SETUP.md` | Guia de instalação completo |
| `DEPLOY.md` | Como colocar no ar (produção) |
| `README.md` | Documentação técnica completa |
| `docker-compose.yml` | PostgreSQL fácil com Docker |

---

## 🆘 PROBLEMAS?

### "Can't reach database"

**Solução rápida com Docker:**
```bash
docker-compose up -d
npm run db:push
npm run db:seed
```

### "Module not found"

```bash
npm install
```

### Prisma dando erro

```bash
npm run db:generate
```

---

## 🌐 COLOCAR NO AR (Deploy)

### Opção 1: Vercel + Supabase (GRÁTIS)

1. Crie banco em: https://supabase.com
2. Deploy em: https://vercel.com
3. Configure variáveis de ambiente
4. Rode `npm run db:seed`

**Detalhes completos:** Veja `DEPLOY.md`

---

## 📊 ESTRUTURA RÁPIDA

```
📦 Metaltec/
├── 📱 app/              → Páginas e API
├── 🎨 components/       → Interface mobile e desktop
├── 🗄️  prisma/          → Banco de dados
├── 📄 SETUP.md          → Como instalar
├── 🚀 DEPLOY.md         → Como fazer deploy
└── 📖 README.md         → Documentação completa
```

---

## ✨ FUNCIONALIDADES

✅ **Mobile-First** - Otimizado para celular
✅ **Busca Inteligente** - Encontre produtos rápido
✅ **Sugestões Automáticas** - Sistema sugere onde armazenar
✅ **Gestão de Overflow** - Controle de gordura
✅ **Dashboard Desktop** - Visualização completa
✅ **Histórico Completo** - Todas as movimentações
✅ **PWA** - Instale no celular como app

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Configure o banco (Docker ou PostgreSQL)
2. ✅ Rode `npm run dev`
3. ✅ Teste no celular
4. ✅ Faça deploy em produção
5. ✅ Customize produtos no `prisma/seed.ts`

---

## 📞 AJUDA

- **Setup**: `SETUP.md`
- **Deploy**: `DEPLOY.md`
- **Técnico**: `README.md`
- **Issues**: https://github.com/oguilhermeleite/Metaltec/issues

---

## 🏢 SOBRE

Sistema completo de controle de estoque para **Metaltec Ferragens**
São José dos Pinhais/PR - Brasil

**Desenvolvido com:**
Next.js 14 • TypeScript • PostgreSQL • Tailwind CSS • PWA

---

**💡 Dica:** Este projeto está 100% funcional e pronto para produção!

