vertical-loto-ts

Sistema full-stack (Node + React) com autenticação access_token / refresh_token, persistência em PostgreSQL e ORM TypeORM. O visual segue uma identidade azul noite com efeito Liquid Glass no login, botões, modais e cards.

Stack

Backend

Node.js 20+, TypeScript (ESM), Express 5

TypeORM 0.3 (DataSource + Migrations)

PostgreSQL 15

Autenticação: JWT (access + refresh com rotação de jti)

access_token curto (ex.: 15m), refresh_token longo (ex.: 7d)

Hash de senhas: bcrypt

Middlewares: CORS, Auth (Bearer), Error Handler

Frontend

React + Vite + TypeScript

Axios (interceptor com refresh automático e “lock”)

React Router

Liquid Glass UI (CSS puro)

Infra

Docker (Postgres) + docker-compose.yml

.env para variáveis de ambiente

Arquitetura (resumo)
vertical-loto-ts/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts / server.ts  (Express bootstrap)
│  │  ├─ config/
│  │  │  ├─ env.ts           (variáveis ENV tipadas)
│  │  │  └─ data-source.ts   (TypeORM DataSource)
│  │  ├─ database/
│  │  │  └─ migrations/      (migrations TypeORM)
│  │  ├─ domain/
│  │  │  ├─ entities/        (User, Post, UserLogin)
│  │  │  └─ dtos/            (Zod schemas p/ validação)
│  │  ├─ modules/
│  │  │  ├─ auth/            (login, refresh, logout)
│  │  │  ├─ users/           (criar usuário, delete “me”)
│  │  │  └─ posts/           (meus posts, feed global)
│  │  ├─ middlewares/        (auth, error handler)
│  │  └─ utils/              (bcrypt, jwt, paginação)
│  └─ ormconfig.ts           (TypeORM CLI aponta p/ DataSource)
└─ frontend/
└─ src/
├─ api/                (axios + interceptors)
├─ auth/               (AuthContext, ProtectedRoute)
├─ components/         (LoginModal, PostModal, etc)
├─ pages/              (Login, Register, PostsList, NewPost)
├─ services/           (auth, posts, users)
├─ styles/             (globals.css - Liquid Glass)
└─ types/


Modelagem principal

users: id (uuid), username (unique), password (hash), timestamps e deleted_at.

user_logins: sessões/”refresh states” (armazena user_id, created_at); usada para rotacionar/invalidar refresh tokens.

posts: id, user_id (FK), title, message, created_at.

Endpoints (principais)

POST /api/users — cria usuário { username, password }

DELETE /api/users/me — soft delete do usuário logado (marca deleted_at e apaga sessões e posts do usuário)

POST /api/auth/login — { username, password } → { access_token, refresh_token }

POST /api/auth/refresh — { refresh_token } → novo par de tokens (com rotação)

POST /api/auth/logout — invalida a sessão atual

GET /api/auth/me — retorna { id, username } do usuário logado

GET /api/posts — lista meus posts (auth)

POST /api/posts — cria post (auth)

GET /api/posts/all?page&size&username — feed global (10 últimos por padrão) + username do autor (auth)

Variáveis de ambiente
Backend (backend/.env)
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# DB
DB_HOST=localhost          # ver seção Windows/WSL
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=12345
DB_NAME=vertical_loto

# JWT
JWT_SECRET=supersecretkey
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

Frontend (frontend/.env)
VITE_API_URL=http://localhost:3000/api

Scripts úteis
Backend (backend/package.json)

npm run dev — desenvolvimento com ts-node-dev

npm run build — compila TS p/ dist/

npm start — roda dist/server.js

npm run migration:gen — gera migration (a partir das entidades)

npm run migration:run — aplica migrations

npm run migration:revert — reverte última

Frontend (frontend/package.json)

npm run dev — Vite dev server

npm run build — build de produção

npm run preview — pré-visualização do build

Boas práticas adotadas

ESM + TypeScript (NodeNext): imports relativos com sufixo .js no código TS.

DTOs com Zod: validação consistente no controller, respostas 400 limpas.

Auth robusto:

access_token curto; refresh_token longo.

rotação a cada refresh (novo jti), invalidando o anterior.

registro de logins em user_logins e limpeza em logout.

Erro handler central: formata exceptions e mensagens de validação.

CORS configurado por env.

Índices únicos + captura de erro 23505 (duplicidade).

Transações para operações críticas (ex.: delete do usuário).

Frontend com:

Axios interceptor que renova token uma única vez por vez (lock) e repete a request original.

AuthContext central (user + tokens).

CSS simples e performático (Liquid Glass).

Migrations versionadas (sem depender de synchronize: true).

Instalação e Execução
1) Requisitos

Node.js 20+ (LTS)

NPM (ou PNPM/Yarn, se preferir)

Git

Windows: ou PostgreSQL local (instalador) ou Docker Desktop

WSL 2: Ubuntu + Docker (via Docker Desktop integrado ao WSL)

2) Windows (PostgreSQL local — “padrão”)
   2.1 Instalar ferramentas

Node LTS: winget install OpenJS.NodeJS.LTS

Git: winget install Git.Git

PostgreSQL 15: winget install PostgreSQL.PostgreSQL
(ou baixe do site oficial)

Durante a instalação do Postgres, anote:

Porta: 5432 (padrão)

Usuário: postgres

Senha: escolha uma (ex.: 12345)

2.2 Criar DB

Abra pgAdmin ou psql e crie o banco:

CREATE DATABASE vertical_loto;


Se quiser um usuário dedicado:

CREATE USER admin WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE vertical_loto TO admin;

2.3 Backend
cd vertical-loto-ts/backend
cp .env.example .env  # (ou crie .env conforme seção acima)
# DB_HOST=localhost (ou 127.0.0.1)
npm install
npm run migration:run
npm run dev
# API em http://localhost:3000/api

2.4 Frontend
cd ../frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev
# abra http://localhost:5173

3) WSL 2 (DB no Docker)
   3.1 Pré-requisitos

Windows 11/10 com WSL 2 e distro Ubuntu:

wsl --install


Docker Desktop (habilite “Use the WSL 2 based engine” e integração com sua distro)

3.2 Subir o Postgres via Docker (dentro do WSL)

No WSL (Ubuntu):

cd ~/vertical-loto-ts
docker compose up -d db
# (ou) docker-compose up -d db  -- se usa CLI legado


O docker-compose.yml expõe 5432:5432. Assim, você tem DUAS opções para DB_HOST:

Opção A — Use localhost (recomendado)

Como há mapeamento de porta, o backend (rodando no WSL) pode acessar Postgres via:

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin
DB_NAME=vertical_loto


Teste:

sudo apt-get install -y postgresql-client
psql -h 127.0.0.1 -p 5432 -U admin -d vertical_loto -c "select now();"

Opção B — Usar o IP do container

Se preferir usar o IP interno do container (não é necessário, mas é possível):

Descobrir IP do container:

docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ts_postgres


Depois, em .env:

DB_HOST=<IP retornado>


Atenção: esse IP muda se o container for recriado. Prefira localhost com porta mapeada.

3.3 Rodar o backend no WSL
cd backend
cp .env.example .env
# Ajuste DB_* conforme A ou B
npm install
npm run migration:run
npm run dev

3.4 Rodar o frontend no WSL
cd ../frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3000/api
npm install
npm run dev


Abra o navegador no Windows em http://localhost:5173. Ele conversa com o backend do WSL via localhost:3000 normalmente.