from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from typing import List
import os
import shutil
import uuid
from pathlib import Path

from fastapi.responses import FileResponse

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
async def update_page(
    page_id: int,
    page_data: PageUpdate,
    user: str = Depends(get_current_user),
):
    update_data = page_data.model_dump(exclude_unset=True)

    updated_count = await PageDAO.update(id=page_id, **update_data)
    if not updated_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found or no changes"
        )

    page = await PageDAO.get_one_or_none(id=page_id)
    return page


@router.delete("/{page_id}/")
async def delete_page(page_id: int, user: str = Depends(get_current_user)):
    deleted_count = await PageDAO.delete(id=page_id)
    if not deleted_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return {"ok": True, "message": "Page successfully deleted"}

@router.post("/{page_id}/files/", response_model=dict)
async def upload_files(
    page_id: int,
    files: List[UploadFile] = File(...),
    user: str = Depends(get_current_user)
):
    page = await PageDAO.get_one_or_none(id=page_id, user_id=user.id)
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    
    upload_dir = Path("uploads/pages") / str(page_id)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    new_files = []
    for file in files:
        if file.size > 10 * 1024 * 1024:  
            raise HTTPException(400, f"File {file.filename} too large")
        
        ext = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = upload_dir / unique_filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        new_files.append(str(file_path.relative_to("uploads")))
    
    current_files = page.files or []
    page.files = current_files + new_files
    
    await PageDAO.update(id=page_id, files=page.files)
    
    return {
        "files_added": len(new_files),
        "total_files": len(page.files),
        "new_files": new_files
    }

@router.get("/{page_id}/files/", response_model=List[str])
async def list_page_files(page_id: int, user: str = Depends(get_current_user)):
    page = await PageDAO.get_one_or_none(id=page_id, user_id=user.id)
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page.files or []

@router.delete("/{page_id}/files/{filename}/")
async def delete_file(
    page_id: int,
    filename: str,
    user: str = Depends(get_current_user)
):
    page = await PageDAO.get_one_or_none(id=page_id, user_id=user.id)
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    
    file_path = Path("uploads/pages") / str(page_id) / filename
    if file_path.exists():
        file_path.unlink()
    
    if filename in page.files:
        page.files.remove(filename)
        await PageDAO.update(id=page_id, files=page.files)
    
    return {"message": "File deleted", "remaining_files": len(page.files or [])}

@router.get("/{page_id}/files/{filename}/")
async def download_file(page_id: int, filename: str, user: str = Depends(get_current_user)):
    page = await PageDAO.get_one_or_none(id=page_id, user_id=user.id)
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    
    if filename not in (page.files or []):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    file_path = Path("uploads/pages") / str(page_id) / filename
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found on disk")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
