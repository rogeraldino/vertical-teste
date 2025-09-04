**vertical-loto-ts**

Sistema full-stack em Node e React com autenticação por access_token e refresh_token, persistência em PostgreSQL e mapeamento via TypeORM. A identidade visual segue um azul-noite com efeito Liquid Glass aplicado em login, botões, modais e cards.

**Stack**

Backend usa Node.js 20+, TypeScript em ESM (NodeNext), Express 5, TypeORM 0.3 e PostgreSQL 15. Autenticação com JWT (access e refresh com rotação de jti), hashing de senha com bcrypt, CORS configurável, middleware de autenticação Bearer e tratador central de erros.

Frontend usa React com Vite e TypeScript, Axios com interceptor que faz refresh automático e trava múltiplos refresh simultâneos, React Router e CSS puro para o tema Liquid Glass.

Infra tem Docker para o banco (docker-compose) e configuração por meio de arquivos .env.

**Arquitetura**

No backend há app.ts e server.ts para bootstrap do Express, config/env.ts para tipar variáveis de ambiente, config/data-source.ts para o DataSource do TypeORM, pasta database com as migrations, domain com entities e dtos (Zod), modules com auth, users e posts, middlewares com auth e error handler e utils com helpers de bcrypt, jwt e paginação. A raiz do backend possui ormconfig.ts para a CLI do TypeORM apontar para o DataSource.

No frontend há api com axios e interceptors, auth com AuthContext e guarda, components com LoginModal, PostModal e ProfileMenu, pages com Login, Register, PostsList e NewPost, services com auth, posts e users, styles com globals.css e types com tipos compartilhados.

**Modelagem de dados**

Tabela users com id (uuid), username único, password com hash, created_at, updated_at e deleted_at para soft delete. Tabela user_logins registra sessões de refresh (id, user_id, created_at) e permite rotacionar e invalidar refresh tokens. Tabela posts com id, user_id referenciando users, title, message e created_at.

**Endpoints**

1. Criação de usuário em POST /api/users com corpo contendo username e password.
2. Exclusão da própria conta em DELETE /api/users/me, que marca deleted_at e apaga sessões e posts do usuário. 
3. Login em POST /api/auth/login com username e password retornando access_token e refresh_token. 
4. Refresh em POST /api/auth/refresh recebendo o refresh_token e entregando novo par de tokens com rotação. 
5. Logout em POST /api/auth/logout invalidando a sessão atual. Perfil em GET /api/auth/me retornando id e username. 
6. Meus posts em GET /api/posts e criação em POST /api/posts com title e message. 
7. Feed global em GET /api/posts/all com parâmetros page, size e username, retornando as últimas postagens e o nome do autor.

**Variáveis de ambiente**

Backend em backend/.env: PORT=3000, NODE_ENV=development, CORS_ORIGIN=http://localhost:5173
, DB_HOST, DB_PORT=5432, DB_USERNAME, DB_PASSWORD, DB_NAME=vertical_loto, JWT_SECRET, JWT_ACCESS_EXPIRES_IN=15m, JWT_REFRESH_EXPIRES_IN=7d, BCRYPT_SALT_ROUNDS=10.

Frontend em frontend/.env: VITE_API_URL=http://localhost:3000/api
.

**Instalação no Windows (PostgreSQL local)**

Instale Node LTS, Git e PostgreSQL 15. Durante a instalação do Postgres mantenha a porta 5432, usuário postgres e defina a senha (tem que coincidir com a senha do .env do backend). Crie o banco vertical_loto. Opcionalmente crie um usuário admin com senha admin e conceda privilégios no banco.

No backend, entre na pasta backend, copie .env preenchendo DB_HOST=localhost, credenciais e segredo JWT, instale dependências com npm install, aplique as migrations com npm run migration:run e inicie com npm run dev. A API ficará em http://localhost:3000/api
.

No frontend, entre na pasta frontend, copie .env.example para .env com VITE_API_URL apontando para http://localhost:3000/api
, instale dependências e execute npm run dev. A aplicação abrirá em http://localhost:5173
.

**Instalação no WSL 2 (DB no Docker)**

Ative WSL 2 com uma distribuição Ubuntu e instale Docker Desktop habilitando o motor WSL e a integração com sua distro. No WSL, dentro do diretório do projeto, suba o Postgres com docker compose up -d db. O compose mapeia 5432 para o host, então use DB_HOST igual ao IP do conteiner (VM), DB_PORT=5432, DB_USERNAME=admin, DB_PASSWORD=admin e DB_NAME=vertical_loto no .env do backend. 

Com o banco ativo, no WSL rode o backend como no Windows: copie o .env, instale dependências, aplique migrations e inicie o servidor. No frontend, faça o mesmo e acesse pelo navegador do Windows em http://localhost:5173
, que comunicará com http://localhost:3000
no WSL normalmente.

