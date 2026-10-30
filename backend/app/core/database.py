from sqlmodel import SQLModel, Session, create_engine
from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def init_db() -> None:
    from app import models  # noqa: F401  (registra as tabelas)
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
