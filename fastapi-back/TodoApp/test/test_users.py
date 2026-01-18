from .utils import *
from ..models import Users

from fastapi import status

def test_return_user(test_user):
    response = client.get('/user/')
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["username"] == "nassim"

def test_change_password_success(test_user):
    response = client.put(
        "/user/change-password",
        json={
            "old_password": "testpassword",
            "new_password": "passwordtest"
        }
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Password changed successfully."

    db = TestingSessionLocal()
    user = db.query(Users).filter(Users.id == test_user.id).first()

    assert bcrypt_context.verify("passwordtest", user.hashed_password)

def test_change_password_invalid_current_password():
    response = client.put(
        "/user/change-password",
        json={
            "old_password": "zoubizoubizou",
            "new_password": "passwordtest"
        }
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "User not found."

def test_change_phone_number_success(test_user):
    response = client.put('/user/change-phonenumber',json = {"phone_number": "0612345678"})
    assert response.status_code == 200
    assert response.json() == {"message": "Phone number updated successfully."}

    db = TestingSessionLocal()
    user_in_db = db.query(Users).filter(Users.id == test_user.id).first()
    assert user_in_db.phone_number == "0612345678"
