from src.database import Base, int_pk
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey, JSON
from src.qr.models import QR

class Page(Base):
    id: Mapped[int_pk]
    QR_id: Mapped[int] = mapped_column(ForeignKey('qrs.id', ondelete='CASCADE'))
    background: Mapped[dict] = mapped_column(JSON)
    elements: Mapped[list[dict]] = mapped_column(JSON)
    
    qr: Mapped['QR'] = relationship("QR")