from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_admin
from app.models import Atracao
from app.schemas import AtracaoIn, AtracaoOut, DisponibilidadeIn

router = APIRouter(prefix="/api/atracoes", tags=["Atrações"])


def _get(session: Session, id: int) -> Atracao:
    obj = session.get(Atracao, id)
    if not obj:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Atração não encontrada")
    return obj


@router.get("", response_model=list[AtracaoOut])
def listar(tipo: Optional[str] = None, disponivel: Optional[bool] = None, session: Session = Depends(get_session)):
    q = select(Atracao)
    if tipo:
        q = q.where(Atracao.tipo == tipo)
    if disponivel is not None:
        q = q.where(Atracao.disponivel == disponivel)
    return session.exec(q.order_by(Atracao.created_at.desc())).all()


@router.get("/{id}", response_model=AtracaoOut)
def detalhe(id: int, session: Session = Depends(get_session)):
    return _get(session, id)


@router.post("", response_model=AtracaoOut, status_code=201, dependencies=[Depends(get_current_admin)])
def criar(data: AtracaoIn, session: Session = Depends(get_session)):
    obj = Atracao(**data.model_dump())
    session.add(obj); session.commit(); session.refresh(obj)
    return obj


@router.put("/{id}", response_model=AtracaoOut, dependencies=[Depends(get_current_admin)])
def editar(id: int, data: AtracaoIn, session: Session = Depends(get_session)):
    obj = _get(session, id)
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    session.add(obj); session.commit(); session.refresh(obj)
    return obj


@router.delete("/{id}", status_code=204, dependencies=[Depends(get_current_admin)])
def excluir(id: int, session: Session = Depends(get_session)):
    session.delete(_get(session, id)); session.commit()
    return Response(status_code=204)


@router.patch("/{id}/disponibilidade", response_model=AtracaoOut, dependencies=[Depends(get_current_admin)])
def alternar(id: int, data: DisponibilidadeIn | None = None, session: Session = Depends(get_session)):
    obj = _get(session, id)
    obj.disponivel = (not obj.disponivel) if data is None or data.disponivel is None else data.disponivel
    session.add(obj); session.commit(); session.refresh(obj)
    return obj
