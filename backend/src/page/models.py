from src.database import Base, int_pk
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey
from src.qr.models import QR
from src.pageElement.models import PageElement

class Page(Base):
    id: Mapped[int_pk]
    QR_id: Mapped[int] = mapped_column(ForeignKey('qrs.id', ondelete='CASCADE'))
    page_elements: Mapped[list['PageElements']] = relationship('PageElements', back_populates="page")
    
    qr: Mapped['QR'] = relationship("QR")
