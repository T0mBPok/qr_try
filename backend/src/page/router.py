from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from src.page.schemas import PageCreate, PageUpdate, PageOut
from src.page.dao import PageDAO
from src.user.dependencies import get_current_user

router = APIRouter(prefix='/page', tags=['Page'])

@router.post("/", response_model=PageOut)
async def create_page(page_data: PageCreate, user: str = Depends(get_current_user)):
    page = await PageDAO.add(**page_data.model_dump(), user_id=user.id)
    return page

@router.get("/{page_id}/", response_model=PageOut)
async def get_page(page_id: int, user: str = Depends(get_current_user)):
    page = await PageDAO.get_one_or_none(id=page_id, user_id=user.id)
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page

@router.get("/", response_model=List[PageOut])
async def get_all_pages(user: str = Depends(get_current_user)):
    pages = await PageDAO.get(user_id=user.id)
    return pages

@router.put("/{page_id}/", response_model=PageOut)
async def update_page(page_id: int, page_data: PageUpdate, user: str = Depends(get_current_user)):
    update_data = page_data.model_dump(exclude_unset=True)
    if 'elements' in update_data:
        update_data['elements'] = [e.model_dump() for e in update_data['elements']]
    
    updated_count = await PageDAO.update(id=page_id, **update_data)
    if not updated_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found or no changes")
    
    page = await PageDAO.get_one_or_none(id=page_id)
    return page

@router.delete("/{page_id}/")
async def delete_page(page_id: int, user: str = Depends(get_current_user)):
    deleted_count = await PageDAO.delete(id=page_id)
    if not deleted_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return {"ok": True, "message": "Page successfully deleted"}
