# setup-prisma.ps1
# Script helper para preparar Prisma no projeto (Windows PowerShell)
# Execute este script dentro da pasta server (ou simplesmente execute-o: \server\setup-prisma.ps1)

Set-StrictMode -Version Latest

function Write-Header($text) {
    Write-Host "`n==== $text ==== `n" -ForegroundColor Cyan
}

# Diretório do script (deve ser a pasta server)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Header "Prisma setup helper"

# Checar .env
if (-Not (Test-Path -Path .env)) {
    Write-Warning ".env não encontrado em $scriptDir. Crie um arquivo '.env' com DATABASE_URL e outras variáveis antes de prosseguir."
    $continue = Read-Host "Deseja criar um .env com a DATABASE_URL agora? (s/n)"
    if ($continue -match '^[sS]') {
        $dbUrl = Read-Host "Cole a sua DATABASE_URL (ex: mysql://user:pass@host:3306/dbname)"
        if ($dbUrl) {
            "DATABASE_URL=`"$dbUrl`"" | Out-File -FilePath .env -Encoding UTF8
            Write-Host ".env criado com sucesso." -ForegroundColor Green
        } else {
            Write-Error "DATABASE_URL vazia. Abortando."
            exit 1
        }
    } else {
        Write-Error "Coloque o arquivo .env com DATABASE_URL e execute este script novamente." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ".env encontrado. Usando as variáveis existentes." -ForegroundColor Green
}

# Mostrar DATABASE_URL (parcial) para confirmar
try {
    $envContent = Get-Content .env -Raw
    if ($envContent -match 'DATABASE_URL\s*=\s*"?([^"\n]+)"?') {
        $dbPreview = $Matches[1]
        Write-Host "DATABASE_URL encontrada (preview): $($dbPreview.Substring(0, [Math]::Min(40, $dbPreview.Length)))..."
    } else {
        Write-Warning "DATABASE_URL não encontrada no .env; verifique o arquivo antes de prosseguir."
    }
} catch {
    Write-Warning "Não foi possível ler .env: $_"
}

# Checar Node
$node = & node -v 2>$null
if (-not $?) {
    Write-Error "Node não encontrado no PATH. Instale Node.js antes de continuar." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Node encontrado: $node" -ForegroundColor Green
}

# Instalar dependências (npm install) se node_modules não existir
if (-Not (Test-Path node_modules)) {
    Write-Header "Instalando dependências (npm install)"
    npm install
} else {
    Write-Host "node_modules já existe — pulando 'npm install'. (Se quiser reinstalar, remova node_modules e rode o script novamente)." -ForegroundColor Yellow
}

# Garantir @prisma/client
$hasPrismaClient = (npm ls @prisma/client --depth=0 --json 2>$null) -ne $null
if (-not $hasPrismaClient) {
    Write-Header "Instalando @prisma/client"
    npm install @prisma/client
} else {
    Write-Host "@prisma/client já instalado." -ForegroundColor Green
}

# Garantir prisma CLI como dev dependency
$hasPrismaCli = (npm ls prisma --depth=0 --json 2>$null) -ne $null
if (-not $hasPrismaCli) {
    Write-Header "Instalando prisma (dev dependency)"
    npm install prisma --save-dev
} else {
    Write-Host "prisma CLI já instalado." -ForegroundColor Green
}

# Gerar Prisma Client
Write-Header "Gerando Prisma Client (npx prisma generate)"
$npxGen = npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao gerar Prisma Client. Veja a saída acima para mais detalhes." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Pergunta antes de aplicar migrations
$apply = Read-Host "Deseja aplicar as migrations e criar as tabelas no banco agora? (S/n)"
if ($apply -match '^[nN]') {
    Write-Host "Pulando migrate. Você pode rodar 'npx prisma migrate dev --name init' manualmente quando quiser." -ForegroundColor Yellow
    exit 0
}

# Aplicar migration
Write-Header "Aplicando migration (npx prisma migrate dev --name init)"
$npxMig = npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao aplicar migration. Verifique a DATABASE_URL, se o MySQL está rodando e as credenciais." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host 'Prisma configurado e migrations aplicadas com sucesso.' -ForegroundColor Green
Write-Host 'Você pode agora rodar: npm run dev (backend) e no root: npm run dev (frontend)' -ForegroundColor Cyan
exit 0
