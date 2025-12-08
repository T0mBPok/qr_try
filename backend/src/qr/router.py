from pathlib import Path
from typing import List, Dict, Any

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from fastapi.responses import FileResponse

from src.qr.schemas import QRCreate, QRUpdate, QROut
from src.qr.dao import QRDAO
from src.user.dependencies import get_current_user

router = APIRouter(prefix="/qr", tags=["QR"])

QR_ASSETS_DIR = Path("assets/qr")


# =====================
# UTILS
# =====================
# def resolve_qr_image(qr_style: Dict[str, Any]) -> Path:
#     """
#     По qr_style выбирает существующий шаблон QR
#     """
#     pattern = qr_style.get("pattern")
#     eye_style = qr_style.get("eye_style")

#     if not pattern or not eye_style:
#         raise HTTPException(400, "qr_style must contain pattern and eye_style")

#     file_name = f"{pattern}_{eye_style}.png"
#     file_path = QR_ASSETS_DIR / file_name

#     if not file_path.exists():
#         raise HTTPException(
#             status_code=404,
#             detail=f"QR template not found: {file_name}",
#         )

#     return file_path


# =====================
# CREATE
# =====================
@router.post("/", response_model=QROut)
async def create_qr(
    data: QRCreate,
    user=Depends(get_current_user),
):
    # image_path = resolve_qr_image(data.qr_style)
    image_path = ""

    qr = await QRDAO.add(
        user=user,
        name=data.name,
        description=data.description,
        link=data.link,
        src=str(image_path),
    )

    return QROut(
        id=qr.id,
        name=qr.name,
        description=qr.description,
        link=qr.link,
        src=f"/qr/{qr.id}/image/",
    )


# =====================
# GET ALL
# =====================
@router.get("/", response_model=List[QROut])
async def get_all(user=Depends(get_current_user)):
    qrs = await QRDAO.get(user_id=user.id)

    return [
        QROut(
            id=qr.id,
            name=qr.name,
            description=qr.description,
            link=qr.link,
            src=f"/qr/{qr.id}/image/",
        )
        for qr in qrs
    ]


# =====================
# GET ONE
# =====================
@router.get("/{qr_id}/", response_model=QROut)
async def get_one(qr_id: int, user=Depends(get_current_user)):
    qr = await QRDAO.get_one_or_none(id=qr_id, user_id=user.id)
    if not qr:
        raise HTTPException(404, "QR not found")

    return QROut(
        id=qr.id,
        name=qr.name,
        description=qr.description,
        link=qr.link,
        src=f"/qr/{qr.id}/image/",
    )


# =====================
# GET IMAGE
# =====================
@router.get("/{qr_id}/image/")
async def get_image(qr_id: int, user=Depends(get_current_user)):
    qr = await QRDAO.get_one_or_none(id=qr_id, user_id=user.id)
    if not qr:
        raise HTTPException(404, "QR not found")

    file_path = Path(qr.src)
    if not file_path.exists():
        raise HTTPException(404, "QR image missing")

    return FileResponse(file_path, media_type="image/png")


# =====================
# UPDATE (только name)
# =====================
@router.put("/{qr_id}/", response_model=QROut)
async def update_qr(
    qr_id: int,
    data: QRUpdate,
    user=Depends(get_current_user),
):
    updated = await QRDAO.update(
        id=qr_id,
        user_id=user.id,
        **data.model_dump(exclude_unset=True),
    )

    if not updated:
        raise HTTPException(404, "QR not found or no changes")

    qr = await QRDAO.get_one_or_none(id=qr_id, user_id=user.id)

    return QROut(
        id=qr.id,
        name=qr.name,
        description=qr.description,
        link=qr.link,
        src=f"/qr/{qr.id}/image/",
    )


# =====================
# DELETE
# =====================
@router.delete("/{qr_id}/")
async def delete_qr(qr_id: int, user=Depends(get_current_user)):
    deleted = await QRDAO.delete(id=qr_id, user_id=user.id)
    if not deleted:
        raise HTTPException(404, "QR not found")

    return {"ok": True}
