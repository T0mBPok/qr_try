from pydantic import BaseModel
from typing import Optional

class QROut(BaseModel):
    id: int
    description: str | None = None
    link: str

    class Config:
        from_attributes = True

class QRCreate(BaseModel):
    name: str
    description: Optional[str] = None
    link: Optional[str] = None

class QRUpdate(BaseModel):
    description: Optional[str] = None
    link: Optional[str] = None
