from src.database import Base, int_pk, str_uniq
from sqlalchemy.orm import Mapped, relationship
from src.qr.models import QR

class User(Base):
    id: Mapped[int_pk]
    username: Mapped[str_uniq]
    password: Mapped[str]
    email: Mapped[str_uniq]
    
    qrs: Mapped[list["QR"]] = relationship("QR", back_populates='user')