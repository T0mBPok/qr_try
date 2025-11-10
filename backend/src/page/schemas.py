from pydantic import BaseModel, HttpUrl, Field
from typing import Literal, Union, Optional, List

class BaseElement(BaseModel):
    id: int
    x: float
    y: float
    z_index: int = 0
    type: str

# --- Типы элементов ---
class RectangleElement(BaseElement):
    type: Literal["rectangle"]
    width: float
    height: float
    fill_color: Optional[str] = None
    stroke_color: Optional[str] = None
    stroke_width: Optional[float] = 0
    
class EllipseElement(BaseElement):
    type: Literal["ellipse"]
    width: float
    height: float
    fill_color: Optional[str] = "#ffffff"
    stroke_color: Optional[str] = None
    stroke_width: Optional[float] = 0
    
class LineElement(BaseElement):
    type: Literal["line"]
    x2: float
    y2: float
    stroke_color: Optional[str] = "#000000"
    stroke_width: Optional[float] = 1

class TextElement(BaseElement):
    type: Literal["text"]
    text: str
    font_family: Optional[str] = "Arial"
    font_size: Optional[int] = 16
    font_weight: Optional[str] = "normal"  
    text_align: Optional[Literal["left", "center", "right"]] = "left"
    color: Optional[str] = "#000000"

class ImageElement(BaseElement):
    type: Literal["image"]
    src: HttpUrl | str 
    width: float
    height: float
    border_radius: Optional[float] = 0
    fit: Optional[Literal["contain", "cover", "fill"]] = "contain"

class FrameElement(BaseElement):
    type: Literal["frame"]
    width: float
    height: float
    background_color: Optional[str] = None
    children: Optional[List[int]] = Field(default_factory=list, description="ID дочерних элементов")

PageElement = Union[
    RectangleElement,
    EllipseElement,
    LineElement,
    TextElement,
    ImageElement,
    FrameElement
]

class PageCreate(BaseModel):
    qr_id: int | None = None
    name: str
    background: dict = Field(default_factory=lambda: {"type": "color", "value": "#ffffff"})
    elements: List[PageElement | None] = Field(default_factory=list)

class PageUpdate(BaseModel):
    qr_id: int | None = None
    name: str | None = None
    background: dict | None = None
    elements: List[PageElement] | None = None

class PageOut(BaseModel):
    id: int
    name: str
    user_id: int
    qr_id: int | None = None
    background: dict
    elements: List[PageElement | None] = None

    class Config:
        from_attributes = True