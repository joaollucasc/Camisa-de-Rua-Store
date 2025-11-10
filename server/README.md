Server (Express) — esqueleto para desenvolvimento
==================

Esta pasta contém um servidor Express mínimo usado apenas para desenvolvimento local e testes rápidos.

Resumo das mudanças realizadas:
- Autenticação atualizada para usar bcrypt (hash de senhas) e JWT (access token). Escolha: fluxo com access token + refresh token em cookie HttpOnly (opção B).
- Middleware `authMiddleware` adicionado para validar o access token.
- Rotas de exemplo em `src/routes/` e controladores em `src/controllers/`.
- Prisma scaffold criado em `server/prisma/schema.prisma` com modelos `User` e `Product`.

Variáveis de ambiente necessárias:
- `DATABASE_URL` — string de conexão MySQL para o Prisma, ex.: `mysql://user:password@localhost:3306/dbname`
- `JWT_SECRET` — segredo para assinar tokens JWT
- `PORT` — porta do servidor (opcional, default 4000)

Como configurar o banco (MySQL) e Prisma:
1. Instale e rode um servidor MySQL local (ou use um serviço remoto).
2. Defina `DATABASE_URL` no `.env` do `server` com a string de conexão.
3. No diretório `server`, rode:

   npm install
   npx prisma generate
   npx prisma migrate dev --name init

4. O comando `migrate` criará as tabelas do schema (User, Product) no banco.

Fluxo de autenticação (Opção B - recomendado para produção):
- POST /api/auth/login -> valida credenciais, retorna access token (no body) e envia refresh token em cookie HttpOnly+Secure.
- POST /api/auth/refresh -> usa cookie HttpOnly para trocar refresh por novo access token.
- POST /api/auth/logout -> revoga refresh token e remove cookie.

Observações de segurança:
- Nunca commite `DATABASE_URL` ou `JWT_SECRET` no repositório.
- Em produção use HTTPS e cookies `Secure` + `SameSite=Strict` (ou Lax dependendo do caso).
- Implemente rotacionamento e revogação de refresh tokens (usar DB/Redis para armazená-los).

Exemplo de variáveis em `.env` (servidor):

DATABASE_URL="mysql://root:senha@localhost:3306/cdr_store"
JWT_SECRET="um-segredo-muito-forte"
PORT=4000

Se quiser, eu continuo e implemento completamente o fluxo (refresh tokens com armazenamento no DB via Prisma, endpoints /refresh e /logout, proteger POST /api/produtos). Diga se quer que eu proceda com:
- (A) armazenar refresh tokens em tabela `RefreshToken` no banco via Prisma (recomendado), ou
- (B) usar arquivo JSON temporário (rápido, não recomendado para produção).
