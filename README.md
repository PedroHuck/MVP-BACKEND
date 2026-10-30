# Terê Verde Online — MVP (FastAPI + SQLite + React)

Plataforma de ecoturismo do Circuito Terê Verde (Teresópolis). Os dados incluídos são **fictícios** — cadastre os reais pelo painel.

## Estrutura
```
backend/
  app/
    core/       config.py, database.py (SQLite/SQLModel), security.py (JWT + bcrypt)
    models/     User, Atracao, Evento (tabelas)
    schemas/    Schemas Pydantic de entrada/saída
    routers/    auth.py, atracoes.py, eventos.py
    services/   seed.py (admin padrão + dados de exemplo)
    main.py     App FastAPI, CORS, startup
frontend/
  src/
    services/api.js        Axios + interceptor JWT
    context/AuthContext    Login/logout, token no localStorage
    components/            Header, Cards, FormModal
    pages/                 Home, Explorar, Detalhe, Login, Admin
```

## Back-end
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Swagger: http://localhost:8000/docs (botão **Authorize** aceita e-mail/senha)
- Na primeira execução é criado `tereverde.db` e o admin padrão **admin@tereverde.com / admin123** (troque em produção via variáveis `ADMIN_EMAIL`/`ADMIN_PASSWORD`).
- Variáveis opcionais em `.env.example` (`SECRET_KEY` deve ser trocada em produção).

## Front-end
```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:8000
npm install
npm run dev              # http://localhost:5173
```

## Endpoints
| Método | Rota | Acesso |
|---|---|---|
| POST | /api/auth/login | Público |
| GET | /api/atracoes?tipo=&disponivel= | Público |
| GET | /api/atracoes/{id} | Público |
| POST/PUT/DELETE | /api/atracoes[/{id}] | Admin (JWT) |
| PATCH | /api/atracoes/{id}/disponibilidade | Admin (JWT) |
| GET | /api/eventos?disponivel= | Público |
| GET | /api/eventos/{id} | Público |
| POST/PUT/DELETE | /api/eventos[/{id}] | Admin (JWT) |
| PATCH | /api/eventos/{id}/disponibilidade | Admin (JWT) |

O PATCH de disponibilidade alterna o status atual; opcionalmente aceita `{"disponivel": true|false}`.
