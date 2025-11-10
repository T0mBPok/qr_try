from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List

from src.qr.schemas import QRCreate, QROut, QRUpdate
from src.qr.dao import QRDAO
from src.user.dependencies import get_current_user

router = APIRouter(prefix='/qr', tags=['QR'])

@router.post("/", response_model=QROut)
async def create_qr(qr_data: QRCreate, user: str = Depends(get_current_user)):
    qr = await QRDAO.add(user=user, name=qr_data.name, description=qr_data.description)
    return qr


@router.get("/{qr_id}/", response_model=QROut)
async def get_qr(qr_id: int, user: str = Depends(get_current_user)):
    qr = await QRDAO.get_one_or_none(id=qr_id, user_id=user.id)
    if not qr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR not found")
    return qr


@router.get("/", response_model=List[QROut])
async def get_all_qrs(user: str = Depends(get_current_user)):
    qrs = await QRDAO.get(user_id=user.id)
    return qrs


@router.put("/{qr_id}/", response_model=QROut)
async def update_qr(qr_id: int, qr_data: QRUpdate, user: str = Depends(get_current_user)):
    updated_count = await QRDAO.update(id=qr_id, **qr_data.model_dump(exclude_unset=True))
    if not updated_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR not found or no changes")
    qr = await QRDAO.get_one_or_none(id=qr_id)
    return qr


@router.delete("/{qr_id}/")
async def delete_qr(qr_id: int, user: str = Depends(get_current_user)):
    deleted_count = await QRDAO.delete(id=qr_id)
    if not deleted_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR not found")
    return {"ok": True, "message": "QR successfully deleted"}
