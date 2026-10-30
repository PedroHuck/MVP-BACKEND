from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import create_access_token, get_current_admin, verify_password
from app.models import User
from app.schemas import LoginIn, TokenOut

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


def _authenticate(session: Session, email: str, senha: str) -> User:
    user = session.exec(select(User).where(User.email == email.lower())).first()
    if not user or not verify_password(senha, user.senha_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-mail ou senha inválidos")
    return user


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, session: Session = Depends(get_session)):
    user = _authenticate(session, data.email, data.senha)
    return TokenOut(access_token=create_access_token(str(user.id)), nome=user.nome, email=user.email)


@router.post("/token", include_in_schema=False)
def token_for_swagger(form: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = _authenticate(session, form.username, form.password)
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer"}


@router.get("/me")
def me(user: User = Depends(get_current_admin)):
    return {"id": user.id, "nome": user.nome, "email": user.email}
