from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator

TipoAtracao = Literal["Trilha", "Cachoeira", "Parque"]
Nivel = Literal["Fácil", "Médio", "Difícil"]


class LoginIn(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=1)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nome: str
    email: EmailStr


class AtracaoIn(BaseModel):
    nome: str = Field(min_length=2, max_length=150)
    tipo: TipoAtracao
    descricao: str = Field(min_length=1)
    localizacao: str = Field(min_length=1, max_length=200)
    nivel_dificuldade: Nivel = "Fácil"
    disponivel: bool = True
    imagem_url: str = ""


class AtracaoOut(AtracaoIn):
    id: int
    created_at: datetime


class EventoIn(BaseModel):
    titulo: str = Field(min_length=2, max_length=150)
    descricao: str = Field(min_length=1)
    data_inicio: date
    data_fim: date
    vagas_ou_capacidade: Optional[int] = Field(default=None, ge=0)
    disponivel: bool = True
    atracao_id: Optional[int] = None
    imagem_url: str = ""

    @model_validator(mode="after")
    def check_dates(self):
        if self.data_fim < self.data_inicio:
            raise ValueError("data_fim deve ser igual ou posterior a data_inicio")
        return self


class EventoOut(EventoIn):
    id: int
    created_at: datetime


class DisponibilidadeIn(BaseModel):
    disponivel: Optional[bool] = None  # se omitido, alterna o valor atual
