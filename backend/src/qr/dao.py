from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from src.dao.base import BaseDAO
from src.qr.models import QR
from src.page.models import Page
from src.database import with_session

class QRDAO(BaseDAO):
    model = QR
    
    @with_session
    async def add(session, user: str, name: str, description) -> QR:
        qr = QR(
                user_id=user.id,
                name=name,
                description=description,
                link=f"https://##/pages/{name}"
            )
        session.add(qr)
        await session.flush()
        
        page = Page(
                qr_id=qr.id,
                background={"type": "color", "value": "#ffffff"},
                elements=[]
            )
        session.add(page)
        
        try:
            await session.commit()
            await session.refresh(qr)
        except SQLAlchemyError:
            await session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return qr