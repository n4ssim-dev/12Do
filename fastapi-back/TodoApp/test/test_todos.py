from fastapi import status
from ..models import Todos
from .utils import *


def test_read_one_authenticated(test_todo):
    response = client.get(f'/todos/todo/{test_todo.id}')
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
            'title': 'Learn to code',
            'description': 'Need to learn everyday.',
            'priority': 1,
            'complete': False
        }
    
def test_read_one_authenticated_not_found():
    response = client.get('/todos/todo/999999')
    assert response.status_code == 404
    assert response.json() == {'detail': 'Todo not found.'}

def test_create_todo():
    request_data={
        'title': 'New todo',
        'description': 'New description',
        'priority': 2,
        'complete': True
    }

    response = client.post('/todos/todo', json=request_data)
    assert response.status_code == 201

    db = TestingSessionLocal()

    model = db.query(Todos).filter(Todos.title == "New todo").first()
    
    assert model is not None 
    assert model.title == request_data['title']
    db.close()

def test_update_todo(test_todo):
    request_data = {
        'title': 'Change the title',
        'description': 'Updated description',
        'priority': 5,
        'complete': False
    }
    
    response = client.put(f"/todos/todo/{test_todo.id}", json=request_data)
    assert response.status_code == 204
    
    db = TestingSessionLocal()
    model = db.query(Todos).filter(Todos.id == test_todo.id).first()
    
    assert model is not None
    assert model.title == 'Change the title'
    db.close()

def test_update_todo_not_found(test_todo):
    request_data = {
        'title': 'Change the title of the todo already saved !',
        'description': 'Need to learn everyday.',
        'priority': 5,
        'complete': False
    }
    
    response = client.put(f"/todos/todo/{test_todo.id+1}",json=request_data)
    assert response.status_code == 404
    assert response.json() == {'detail': 'Todo not found.'}

def test_delete_todo(test_todo):
    response = client.delete(f"/todos/todo/{test_todo.id}")
    assert response.status_code == 204
    
    db = TestingSessionLocal()
    model = db.query(Todos).filter(
        Todos.title == test_todo.title
    ).first()
    assert model is None

def test_delete_todo_not_found(test_todo):
    response = client.delete(f"/todos/todo/{test_todo.id +1}")
    assert response.status_code == 404
    assert response.json() == {'detail': 'Todo not found.'}