# Camisa de Rua Store

Aplicação front-end em React + Vite com um esqueleto de backend (Express) dentro da pasta `server`.

Este repositório contém uma loja simples (frontend) e um servidor mínimo para desenvolvimento local.

Principais comandos (na raiz):

- Instalar dependências: `npm install`
- Iniciar front-end em modo dev: `npm run dev`
- Build de produção: `npm run build`
- Visualizar build: `npm run preview`
- Lint: `npm run lint`

Backend (opcional):

- Entrar na pasta do servidor: `cd server`
- Instalar dependências do servidor: `npm install`
- Iniciar o servidor em modo dev: `npm run dev`

Observações importantes:

- Autenticação leve no frontend usa `localStorage` (ver `src/components/ModalAuth.jsx`). Há um usuário de teste: `teste@teste.com` / `123456`.
- Dados de produto atualmente estão em `src/data/produtos.js`.
- Estilos usam TailwindCSS; tokens em `tailwind.config.js`.

Estrutura relevante:

- `src/` — código front-end (React)
- `public/images/` — imagens e assets públicos
- `server/` — servidor Express mínimo (opcional)

Se quiser que eu implemente endpoints reais no servidor (ex.: autenticação JWT, endpoints de produtos com persistência), me diga qual stack prefere (SQLite/Postgres/File) e eu implemento.
