from src.database import Base, int_pk, str_uniq
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey

class QR(Base):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    description: Mapped[str | None]
    name: Mapped[str]
    link: Mapped[str] = mapped_column(nullable=True)
    src: Mapped[str]
    
    user: Mapped['User'] = relationship('User', back_populates='qrs')
    page: Mapped["Page"] = relationship('Page', back_populates='qr')

    short_code: Mapped[str_uniq] = mapped_column(unique=True)
    link: Mapped[str | None] = mapped_column(nullable=True)