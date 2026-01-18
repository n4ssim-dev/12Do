from .utils import *
from ..routers import admin
from ..models import Todos
from fastapi import status

app.dependency_overrides[admin.get_db] = override_get_db
app.dependency_overrides[admin.get_current_user] = override_get_current_user

def test_admin_read_all_authenticated(test_todo):
    response = client.get('/admin/todo')
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0] == {
        'title': 'Learn to code',
        'description': 'Need to learn everyday.',
        'priority': 1,
        'complete': False,
        'id': 1,
        'owner_id': 1
    }


def test_delete_admin_todo(test_todo):
    response = client.delete(f'/admin/todo/{test_todo.id}')
    assert response.status_code == 204

    with TestingSessionLocal() as db:
        model = db.query(Todos).filter(Todos.id == test_todo.id).first()
        assert model is None

def test_delete_admin_todo_not_found(test_todo):
    response = client.delete(f'/admin/todo{test_todo.id +99}')
    assert response.status_code == 404
    assert response.json() == {'detail': 'Not Found'}

