from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from src.dao.base import BaseDAO
from src.qr.models import QR
from src.page.models import Page
from src.database import with_session

class QRDAO(BaseDAO):
    model = QR
    
    @with_session
    async def add(session, user: str, name: str, description:str, link: str|None = None) -> QR:
        if not link:
            qr = QR(
                    user_id=user.id,
                    link=f"https://##/pages/{name}"
                )
            session.add(qr)
            session.flush()
            
            page = Page(
                user_id = user.id,
                qr_id = qr.id,
                name=name,
                background={"type": "color", "value": "#ffffff"},
                elements=[]
            )
            session.add(page)
        else:
            qr = QR(
                    user_id=user.id,
                    link=link
                )
        session.add(qr)
        
        try:
            await session.commit()
            await session.refresh(qr)
        except SQLAlchemyError as e:
            await session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)
        return qr