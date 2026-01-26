from .database import Base
from sqlalchemy import Column,Integer, String, Boolean, ForeignKey, DateTime
from datetime import datetime, timezone, UTC

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True,index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)
    phone_number = Column(String)


class Todos(Base):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    priority = Column(Integer)
    complete = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    theme = Column(String)


class AgendaEvent(Base):
    __tablename__ = "agenda_events"

    id = Column(Integer, primary_key=True, index=True)

    todo_id = Column(Integer, ForeignKey("todos.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    all_day = Column(Boolean, default=False)

    color = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))