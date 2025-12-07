from src.dao.base import BaseDAO
from src.page.models import Page
from src.database import with_session
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from src.qr.models import QR
from sqlalchemy import select, update

class PageDAO(BaseDAO):
    model = Page
    
    @classmethod
    @with_session
    async def add(cls, session, user_id: int, name: str, background: dict, elements: list, files: list, qr_id: int | None = None):
        existing = await session.execute(select(cls.model).filter_by(name=name))
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Page with name '{name}' already exists"
            )

        page = cls.model(
            user_id=user_id,
            qr_id=qr_id,
            name=name,
            background=background,
            elements=elements,
            files=files
        )
        session.add(page)
        await session.flush()

        if qr_id:
            qr = await session.get(QR, qr_id)
            if not qr:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR not found")
            qr.link = f"https://##/pages/{name}"
            session.add(qr)

        try:
            await session.commit()
            await session.refresh(page)
        except SQLAlchemyError as e:
            await session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        return page
    
    @classmethod
    @with_session
    async def update(cls, session, id: int, **values):
        qr_id = values.get('qr_id')
        name = values.get('name')
        
        if qr_id is not None or name is not None:
            page = await session.get(cls.model, id)
            if not page:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
            
            if qr_id is not None:
                qr = await session.get(QR, qr_id)
                if not qr:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR not found")
                qr.link = f"https://##/pages/{name or page.name}"
                session.add(qr)

        result = await session.execute(update(cls.model).where(cls.model.id == id).values(**values))
        try:
            await session.commit()
        except SQLAlchemyError:
            await session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return result.rowcount