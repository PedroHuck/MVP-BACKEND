from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ORIGINS
from app.core.database import init_db
from app.routers import atracoes, auth, eventos
from app.services.seed import seed


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    seed()
    yield


app = FastAPI(
    title="Terê Verde Online API",
    description="API do MVP do Circuito Terê Verde (Teresópolis).",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(atracoes.router)
app.include_router(eventos.router)


@app.get("/", tags=["Saúde"])
def root():
    return {"status": "ok", "docs": "/docs"}
