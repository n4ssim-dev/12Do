from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from fastapi import status
from passlib.context import CryptContext
from dotenv import load_dotenv
import pytest

from ..database import Base
from ..models import Todos, Users
from ..main import app
from ..dependencies import get_db, get_current_user
import os

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
load_dotenv()

SQLALCHEMY_DB_TEST_URL = os.getenv('SQLALCHEMY_DB_TEST_URL')

engine = create_engine(
    SQLALCHEMY_DB_TEST_URL,
    connect_args={"check_same_thread":False},
    poolclass= StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {'username': 'nassim','id': 1, 'role':'admin'}

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

@pytest.fixture
def test_todo():
    db = TestingSessionLocal()
    db.query(Todos).delete()
    
    todo = Todos(
        title='Learn to code',
        description='Need to learn everyday.',
        priority=1,
        complete=False,
        owner_id=1
    )

    db.add(todo)
    db.commit()
    db.refresh(todo)
    yield todo
    
    db.query(Todos).delete()
    db.commit()
    db.close()

@pytest.fixture
def test_user():
    db = TestingSessionLocal()

    user = Users(
        id=1,
        username="nassim",
        email="nassim@test.com",
        first_name="Nassim",
        last_name="Test",
        role="admin",
        hashed_password=bcrypt_context.hash("testpassword"),
        is_active=True,
        phone_number="0600000000"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    yield user

    db.query(Users).delete()
    db.commit()
    db.close()
