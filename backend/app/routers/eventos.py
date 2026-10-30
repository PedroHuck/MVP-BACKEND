from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_admin
from app.models import Atracao, Evento
from app.schemas import DisponibilidadeIn, EventoIn, EventoOut

router = APIRouter(prefix="/api/eventos", tags=["Eventos"])


def _get(session: Session, id: int) -> Evento:
    obj = session.get(Evento, id)
    if not obj:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Evento não encontrado")
    return obj


def _check_atracao(session: Session, atracao_id: Optional[int]):
    if atracao_id is not None and not session.get(Atracao, atracao_id):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "atracao_id inexistente")


@router.get("", response_model=list[EventoOut])
def listar(disponivel: Optional[bool] = None, session: Session = Depends(get_session)):
    q = select(Evento)
    if disponivel is not None:
        q = q.where(Evento.disponivel == disponivel)
    return session.exec(q.order_by(Evento.data_inicio)).all()


@router.get("/{id}", response_model=EventoOut)
def detalhe(id: int, session: Session = Depends(get_session)):
    return _get(session, id)


@router.post("", response_model=EventoOut, status_code=201, dependencies=[Depends(get_current_admin)])
def criar(data: EventoIn, session: Session = Depends(get_session)):
    _check_atracao(session, data.atracao_id)
    obj = Evento(**data.model_dump())
    session.add(obj); session.commit(); session.refresh(obj)
    return obj


@router.put("/{id}", response_model=EventoOut, dependencies=[Depends(get_current_admin)])
def editar(id: int, data: EventoIn, session: Session = Depends(get_session)):
    obj = _get(session, id)
    _check_atracao(session, data.atracao_id)
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    session.add(obj); session.commit(); session.refresh(obj)
    return obj


@router.delete("/{id}", status_code=204, dependencies=[Depends(get_current_admin)])
def excluir(id: int, session: Session = Depends(get_session)):
    session.delete(_get(session, id)); session.commit()
    return Response(status_code=204)


@router.patch("/{id}/disponibilidade", response_model=EventoOut, dependencies=[Depends(get_current_admin)])
def alternar(id: int, data: DisponibilidadeIn | None = None, session: Session = Depends(get_session)):
    obj = _get(session, id)
    obj.disponivel = (not obj.disponivel) if data is None or data.disponivel is None else data.disponivel
    session.add(obj); session.commit(); session.refresh(obj)
    return obj
