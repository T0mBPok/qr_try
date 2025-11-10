from src.database import Base, int_pk, str_uniq
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey, JSON
from src.qr.models import QR
from src.user.models import User

class Page(Base):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"))
    qr_id: Mapped[int | None] = mapped_column(ForeignKey('qrs.id', ondelete='SET NULL'), nullable=True)
    name: Mapped[str_uniq]
    background: Mapped[dict] = mapped_column(JSON,  default={})
    elements: Mapped[list[dict]] = mapped_column(JSON,  default=[])
    
    qr: Mapped['QR'] = relationship("QR", back_populates='page', uselist=False)
    user: Mapped['User'] = relationship("User")