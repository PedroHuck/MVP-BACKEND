from datetime import date, datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(unique=True, index=True)
    senha_hash: str
    created_at: datetime = Field(default_factory=_now)


class Atracao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    tipo: str = Field(index=True)
    descricao: str
    localizacao: str
    nivel_dificuldade: str = "Fácil"
    disponivel: bool = Field(default=True, index=True)
    imagem_url: str = ""
    created_at: datetime = Field(default_factory=_now)


class Evento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    descricao: str
    data_inicio: date
    data_fim: date
    vagas_ou_capacidade: Optional[int] = None
    disponivel: bool = Field(default=True, index=True)
    atracao_id: Optional[int] = Field(default=None, foreign_key="atracao.id")
    imagem_url: str = ""
    created_at: datetime = Field(default_factory=_now)
