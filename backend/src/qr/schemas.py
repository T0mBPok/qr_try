from fastapi import Form
from pydantic import BaseModel
from typing import Any, Dict, Optional

class QROut(BaseModel):
    id: int
    name: str
    description: str | None = None
    link: str
    src: str 

    class Config:
        from_attributes = True

class QRCreate(BaseModel):
    name: str
    description: Optional[str] = None
    link: Optional[str] = None
    qr_style: Dict[str, Any]
    
    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        description: str = Form(...),
        link: int = Form(...),
    ):
        return cls(name=name, description=description, link=link)

class QRUpdate(BaseModel):
    description: Optional[str] = None
    link: Optional[str] = None
