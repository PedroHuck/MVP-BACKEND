from datetime import date

from sqlmodel import Session, select

from app.core.config import ADMIN_EMAIL, ADMIN_PASSWORD
from app.core.database import engine
from app.core.security import hash_password
from app.models import Atracao, Evento, User

IMG = "https://images.unsplash.com/photo-{}?w=1200"


def seed() -> None:
    with Session(engine) as s:
        if not s.exec(select(User)).first():
            s.add(User(nome="Administrador", email=ADMIN_EMAIL, senha_hash=hash_password(ADMIN_PASSWORD)))
            print(f"[seed] Admin padrão criado: {ADMIN_EMAIL}")
        if not s.exec(select(Atracao)).first():
            atracoes = [
                Atracao(nome="Trilha do Mirante Exemplo", tipo="Trilha", descricao="Trilha de exemplo com vista panorâmica.", localizacao="Parque Exemplo A", nivel_dificuldade="Médio", imagem_url=IMG.format("1551632811-561732d1e306")),
                Atracao(nome="Travessia da Serra (exemplo)", tipo="Trilha", descricao="Travessia longa de exemplo.", localizacao="Parque Exemplo A", nivel_dificuldade="Difícil", imagem_url=IMG.format("1464822759023-fed622ff2c3b")),
                Atracao(nome="Cachoeira Véu Exemplo", tipo="Cachoeira", descricao="Queda d'água de exemplo com poço.", localizacao="Parque Exemplo B", imagem_url=IMG.format("1432405972618-c60b0225b8f9")),
                Atracao(nome="Parque Natural Exemplo", tipo="Parque", descricao="Unidade de conservação de exemplo.", localizacao="Centro", disponivel=False, imagem_url=IMG.format("1441974231531-c6227db76b6e")),
            ]
            s.add_all(atracoes)
            s.flush()
            s.add_all([
                Evento(titulo="Temporada de Montanhismo (exemplo)", descricao="Temporada seca de exemplo.", data_inicio=date(2026, 5, 1), data_fim=date(2026, 10, 31), atracao_id=atracoes[1].id, imagem_url=IMG.format("1501555088652-021faa106b9b")),
                Evento(titulo="Observação de Aves (exemplo)", descricao="Passeio guiado de exemplo.", data_inicio=date(2026, 11, 15), data_fim=date(2026, 11, 15), vagas_ou_capacidade=25, atracao_id=atracoes[0].id, imagem_url=IMG.format("1444464666168-49d633b86797")),
            ])
        s.commit()
