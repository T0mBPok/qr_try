# src/page/public_router.py
from fastapi import APIRouter, HTTPException, status
from src.page.dao import PageDAO

public_router = APIRouter(prefix='/public', tags=['Public Pages'])

@public_router.get("/{page_name}/")
async def get_public_page(page_name: str):
    page = await PageDAO.get_one_or_none(name=page_name)
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    # Возвращаем данные для фронтенда в формате PublicPage.tsx
    return {
        "id": page.id,
        "title": page.name,
        "description": "",  # Добавьте поле в модель если нужно
        "published": True,  # Добавьте поле published в модель
        "content": {
            "blocks": page.elements or [],
            "theme": {
                "background": page.background,
                "textColor": "#ffffff",  # Нужно хранить в БД
                "accentColor": "#7c6afa"  # Нужно хранить в БД
            },
            "settings": {
                "animations": {
                    "enabled": False
                }
            }
        }
    }