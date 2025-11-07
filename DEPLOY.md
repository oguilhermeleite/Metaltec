# 🚀 Deploy em Produção - Metaltec Estoque

## Opção 1: Vercel + Supabase (GRÁTIS) ⭐ Recomendado

### Passo 1: Configurar Banco de Dados (Supabase)

1. Acesse: https://supabase.com
2. Crie conta gratuita
3. Clique em "New Project"
4. Preencha:
   - **Name**: metaltec-estoque
   - **Database Password**: (anote a senha!)
   - **Region**: South America (São Paulo)
5. Aguarde criação (~2 minutos)
6. Vá em **Settings** → **Database**
7. Role até **Connection String** → **URI**
8. Copie a connection string (formato: `postgresql://postgres:[PASSWORD]@...`)

### Passo 2: Deploy na Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New" → "Project"
4. Selecione o repositório `Metaltec`
5. Em **Environment Variables**, adicione:

```
DATABASE_URL = postgresql://postgres:[SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres
NEXTAUTH_URL = https://seu-projeto.vercel.app
NEXTAUTH_SECRET = cole-aqui-um-secret-gerado
```

**Para gerar NEXTAUTH_SECRET**: Execute `openssl rand -base64 32` ou use https://generate-secret.vercel.app/32

6. Clique em **Deploy**
7. Aguarde 2-3 minutos

### Passo 3: Popular Banco de Dados

Após o deploy:

```bash
# Clone o repo
git clone https://github.com/oguilhermeleite/Metaltec.git
cd Metaltec

# Configure o .env com a URL de produção
DATABASE_URL="sua-connection-string-do-supabase"

# Rode os comandos
npm install
npm run db:push
npm run db:seed
```

✅ **Pronto! Sistema no ar em:** https://seu-projeto.vercel.app

---

## Opção 2: Railway (Tudo em um lugar)

### Setup Rápido

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha `Metaltec`
6. Clique em "Add Service" → "Database" → "PostgreSQL"
7. Copie a `DATABASE_URL` gerada
8. Vá em seu projeto → Variables → Add Variable:

```
DATABASE_URL = [URL gerada pelo Railway]
NEXTAUTH_URL = https://metaltec-production.up.railway.app
NEXTAUTH_SECRET = [gere um secret]
```

9. Railway fará deploy automático

### Popular Banco

```bash
# Conecte ao banco do Railway
DATABASE_URL="[URL do Railway]" npm run db:push
DATABASE_URL="[URL do Railway]" npm run db:seed
```

---

## Opção 3: Render (Grátis também)

### Banco de Dados

1. Acesse: https://render.com
2. Crie conta
3. New → PostgreSQL
4. Nome: `metaltec-db`
5. Copie a **External Database URL**

### Deploy da Aplicação

1. New → Web Service
2. Conecte ao GitHub
3. Selecione `Metaltec`
4. Configure:
   - **Build Command**: `npm install && npm run db:generate`
   - **Start Command**: `npm start`
5. Environment Variables:

```
DATABASE_URL = [External Database URL]
NEXTAUTH_URL = https://metaltec.onrender.com
NEXTAUTH_SECRET = [gere um secret]
```

6. Deploy

---

## 📋 Checklist Pós-Deploy

- [ ] Aplicação está acessível
- [ ] Login funciona
- [ ] Banco de dados populado (rode seed)
- [ ] Busca de produtos funciona
- [ ] Dashboard mostra dados
- [ ] PWA instalável no celular
- [ ] Teste em dispositivo móvel

---

## 🔐 Usuários Iniciais

Após `npm run db:seed`, você terá:

- **operador@metaltec.com.br** / metaltec123
- **anderson@metaltec.com.br** / metaltec123
- **karen@metaltec.com.br** / metaltec123

**⚠️ IMPORTANTE**: Altere as senhas em produção!

---

## 🌐 Domínio Personalizado (Opcional)

### Vercel

1. Settings → Domains
2. Adicione: `estoque.metaltecferragens.com.br`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `estoque`
   - Value: `cname.vercel-dns.com`

### Railway

1. Settings → Domains
2. Adicione domínio customizado
3. Configure DNS conforme instruções

---

## 📊 Monitoramento

### Vercel Analytics (Grátis)

1. Projeto → Analytics
2. Ative gratuitamente
3. Veja métricas de uso

### Logs

- **Vercel**: Projeto → Logs
- **Railway**: Projeto → Deployments → View Logs
- **Render**: Dashboard → Logs

---

## 🔄 Atualizações

Para atualizar o sistema em produção:

```bash
git add .
git commit -m "Atualização do sistema"
git push origin main
```

Vercel/Railway/Render farão deploy automático!

---

## ❓ Problemas Comuns

### "Can't reach database"
- Verifique se DATABASE_URL está correto
- Confirme que banco está ativo

### "Module not found"
- Adicione build command: `npm install`
- Verifique node version (18+)

### "Auth error"
- Verifique NEXTAUTH_SECRET
- Confirme NEXTAUTH_URL está correto

---

## 📞 Suporte

Problemas? Abra uma issue no GitHub:
https://github.com/oguilhermeleite/Metaltec/issues

---

**Tempo estimado de deploy: 10-15 minutos** ⚡
