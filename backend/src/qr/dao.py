from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from src.dao.base import BaseDAO
from src.qr.models import QR
from src.page.models import Page
from src.database import with_session

class QRDAO(BaseDAO):
    model = QR
    
    @with_session
    async def add(
        session,
        user,
        name: str,
        src: str,
        description: str,
        link: str | None = None
    ) -> QR:

        qr = QR(
            user_id=user.id,
            name=name,
            description=description,
            src=src,
            link=link  # временно, если None — обновим ниже
        )
        session.add(qr)
        await session.flush()  # нужен qr.id

        # если ссылка не передана — создаём Page и кладём page_id в link
        if not link:
            page = Page(
                user_id=user.id,
                qr_id=qr.id,
                name=name,
                background={"type": "color", "value": "#ffffff"},
                elements=[]
            )
            session.add(page)
            await session.flush()  # нужен page.id

            qr.link = f"http://localhost:9000/page/{page.id}"

        try:
            await session.commit()
            await session.refresh(qr)
        except SQLAlchemyError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

        return qr