import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Board(Base):
    __tablename__ = "board"

    id = Column(Integer, primary_key=True)
    x = Column(Integer)
    y = Column(Integer)
    state = Column(String(255))
    updated_at = Column(DateTime, onupdate=datetime.datetime.now)
