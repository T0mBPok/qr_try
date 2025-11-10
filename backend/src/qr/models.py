from src.database import Base, int_pk, str_uniq
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey

class QR(Base):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    name: Mapped[str]
    description: Mapped[str]
    link: Mapped[str_uniq]
    
    user: Mapped['User'] = relationship('User', back_populates='qrs')