from datetime import datetime
from sqlalchemy.sql.sqltypes import DateTime
from typing import Annotated
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, declared_attr, mapped_column, Mapped
from sqlalchemy import func
from src.config import get_db_url


DATABASE_URL = get_db_url()
print(DATABASE_URL)
engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)
def with_session(func):
    async def wrapper(*args, **kwargs):
        async with async_session_maker() as session:
            return await func(*args, session=session, **kwargs)
    return wrapper

#Настройка аннотаций
int_pk = Annotated[int, mapped_column(primary_key=True)]
created_at = Annotated[datetime, mapped_column(DateTime, server_default=func.now())]
updated_at = Annotated[datetime, mapped_column(DateTime, server_default=func.now(), onupdate=func.now())]
str_uniq = Annotated[str, mapped_column(unique=True, nullable=False)]


class Base(AsyncAttrs, DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return f"{cls.__name__.lower()}s"
    
    created_at: Mapped[created_at]