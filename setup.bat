@echo off
echo ================================================
echo    METALTEC ESTOQUE - SETUP AUTOMATICO
echo ================================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js instalado!
echo.

echo [2/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias!
    pause
    exit /b 1
)
echo OK: Dependencias instaladas!
echo.

echo [3/4] Gerando Prisma Client...
call npm run db:generate
if errorlevel 1 (
    echo ERRO ao gerar Prisma Client!
    pause
    exit /b 1
)
echo OK: Prisma Client gerado!
echo.

echo [4/4] Verificando PostgreSQL...
call npm run db:push >nul 2>&1
if errorlevel 1 (
    echo.
    echo ================================================
    echo    ATENCAO: PostgreSQL nao esta rodando!
    echo ================================================
    echo.
    echo Escolha uma opcao:
    echo.
    echo 1. Usar Docker (recomendado):
    echo    docker run --name metaltec-db -e POSTGRES_PASSWORD=metaltec123 -e POSTGRES_USER=metaltec -e POSTGRES_DB=metaltec_estoque -p 5432:5432 -d postgres:14
    echo.
    echo 2. Instalar PostgreSQL:
    echo    https://www.postgresql.org/download/windows/
    echo.
    echo Depois execute:
    echo    npm run db:push
    echo    npm run db:seed
    echo    npm run dev
    echo.
    pause
    exit /b 1
)

echo Criando banco de dados e populando com dados...
call npm run db:seed
if errorlevel 1 (
    echo AVISO: Seed pode ter falhado. Tente manualmente: npm run db:seed
)
echo.

echo ================================================
echo    SETUP COMPLETO!
echo ================================================
echo.
echo Para iniciar o servidor:
echo    npm run dev
echo.
echo Depois acesse: http://localhost:3000
echo.
echo Login:
echo    Email: operador@metaltec.com.br
echo    Senha: metaltec123
echo.
echo ================================================
pause
