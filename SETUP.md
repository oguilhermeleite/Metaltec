# 🚀 SETUP COMPLETO - Metaltec Estoque

## ⚡ Setup Rápido (3 passos)

### 1️⃣ Instalar PostgreSQL

**OPÇÃO A - Docker (Mais Fácil):**
```bash
docker run --name metaltec-db -e POSTGRES_PASSWORD=metaltec123 -e POSTGRES_USER=metaltec -e POSTGRES_DB=metaltec_estoque -p 5432:5432 -d postgres:14
```

**OPÇÃO B - Instalar PostgreSQL:**
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql@14`
- Linux: `sudo apt install postgresql`

### 2️⃣ Configurar Banco de Dados

```bash
npm run db:push
npm run db:seed
```

### 3️⃣ Rodar Aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🔑 Login

Após o seed, use:
- **Email**: operador@metaltec.com.br
- **Senha**: metaltec123

---

## ❌ Problemas?

### "Can't reach database"
PostgreSQL não está rodando. Execute:
```bash
docker start metaltec-db
```

### "Module not found"
```bash
npm install
```

### "Prisma error"
```bash
npm run db:generate
npm run db:push
```

---

## 📱 Testar no Celular

1. Descubra seu IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. No celular: `http://SEU-IP:3000`
3. Instale como PWA

---

## 🚀 Pronto!

Sistema funcionando? Comece usando:
1. Busque produto: "1122 BR"
2. Armazene caixas
3. Veja o dashboard

**Suporte**: Consulte README.md ou QUICKSTART.md
