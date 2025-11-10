from src.database import Base, int_pk, str_uniq
from sqlalchemy.orm import Mapped, relationship

class User(Base):
    id: Mapped[int_pk]
    username: Mapped[str_uniq]
    password: Mapped[str]
    qrs: Mapped[list["QR"]] = relationship("QR", back_populates='user')