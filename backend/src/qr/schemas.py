from pydantic import BaseModel
from typing import Optional

class QROut(BaseModel):
    id: int
    user_id: int
    name: str
    description: str
    link: str

    class Config:
        orm_mode = True

class QRCreate(BaseModel):
    user_id: int
    name: str
    description: Optional[str] = None
    link: str

class QRUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
