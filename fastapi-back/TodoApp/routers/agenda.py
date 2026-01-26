from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session
from typing import List, Annotated
from datetime import date, datetime, time

from ..dependencies import get_db
from ..models import Todos
from ..models import AgendaEvent
from ..schemas import AgendaEventRequest, AgendaEventResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/agenda",
    tags=["agenda"]
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/", response_model=AgendaEventResponse)
def create_agenda_event(
    user: user_dependency,
    db: db_dependency,
    request: AgendaEventRequest
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")

    todo = db.query(Todos).filter(
        Todos.id == request.todo_id,
        Todos.owner_id == user.get("id")
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found.")

    if request.end_date <= request.start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    event = AgendaEvent(
        todo_id=todo.id,
        owner_id=user.get("id"),
        title=todo.title,
        start_date=request.start_date,
        end_date=request.end_date,
        all_day=request.all_day,
        color=request.color,
        notes=request.notes
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.get("/", response_model=List[AgendaEventResponse])
def read_agenda(
    user: user_dependency,
    db: db_dependency,
    start: date = Query(...),
    end: date = Query(...)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")

    start_dt = datetime.combine(start, time.min)
    end_dt = datetime.combine(end, time.max)

    return (
        db.query(AgendaEvent)
        .filter(AgendaEvent.owner_id == user.get("id"))
        .filter(AgendaEvent.start_date <= end_dt)
        .filter(AgendaEvent.end_date >= start_dt)
        .order_by(AgendaEvent.start_date)
        .all()
    )

@router.delete("/{event_id}", status_code=204)
def delete_agenda_event(
    user: user_dependency,
    db: db_dependency,
    event_id: int = Path(gt=0)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")

    event = db.query(AgendaEvent).filter(
        AgendaEvent.id == event_id,
        AgendaEvent.owner_id == user.get("id")
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")

    db.delete(event)
    db.commit()


