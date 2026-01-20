from fastapi import FastAPI, APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import Annotated, List
from starlette import status

from ..database import SessionLocal
from ..dependencies import get_db
from ..models import Todos
from ..schemas import TodoRequest, TodoResponse
from .auth import get_current_user

router = APIRouter(
    prefix='/todos',
    tags=['todos']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


# /---------------/ ENDPOINTS / --------------------/ #


@router.get("/", response_model=List[TodoResponse])
def read_all(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication failed.')
    return db.query(Todos).filter(Todos.owner_id == user.get('id')).all()

@router.get("/todo/{todo_id}", response_model=TodoResponse)
def read_todo(user: user_dependency, db: db_dependency, todo_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401,detail='Authentication failed.')
    
    todo = db.query(Todos).filter(Todos.id == todo_id)\
    .filter(Todos.owner_id == user.get('id')).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found.")
    return todo


@router.post("/todo", status_code=status.HTTP_201_CREATED)
def create_todo( user: user_dependency, db: db_dependency, todo_request: TodoRequest):
    if user is None:
        raise HTTPException(status_code=401,detail='Authentication failed.')
 
    todo_model = Todos(**todo_request.model_dump(), owner_id=user.get('id'))

    db.add(todo_model)
    db.commit()

@router.put('/todo/{todo_id}',status_code=status.HTTP_204_NO_CONTENT)
async def update_todo(user: user_dependency,
                      db: db_dependency,
                      todo_request: TodoRequest, 
                      todo_id: int = Path(gt=0)):

    if user is None:
        raise HTTPException(status_code=401,detail='Authentication failed.')
    
    todo_model = db.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == user.get('id')).first()
    
    if not todo_model:
        raise HTTPException(status_code=404,detail="Todo not found.")

    todo_model.title = todo_request.title
    todo_model.description = todo_request.description
    todo_model.priority = todo_request.priority
    todo_model.complete = todo_request.complete

    db.add(todo_model)
    db.commit()

@router.delete('/todo/{todo_id}',status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(user: user_dependency,
                      db: db_dependency,
                      todo_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401,detail='Authentication failed.')
    
    todo_model = db.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == user.get('id')).first()

    if not todo_model:
        raise HTTPException(status_code=404,detail="Todo not found.")
    db.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == user.get('id')).delete()
    db.commit()