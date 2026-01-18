from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from starlette import status
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

from ..database import SessionLocal
from ..schemas import UserResponse, ChangePasswordRequest, ChangePhoneNumberRequest
from ..models import Users
from .auth import user_dependency, db_dependency
from ..dependencies import get_db


load_dotenv()

router = APIRouter(
    prefix='/user',
    tags=['user']
)

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


@router.get('/',status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_user(user: user_dependency,
                   db: db_dependency):
    if not user:
        raise HTTPException(status_code=401,detail='User not authenticated')
    
    user_infos = (
            db.query(Users)
            .filter(Users.id == user.get('id'))
            .first()
            )
    if not user_infos:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_infos

@router.put('/change-password')
async def change_password(user: user_dependency,
                          db: db_dependency,
                          passwords: ChangePasswordRequest):
    if not user:
        raise HTTPException(status_code=401, detail='Authentication failed.')
    
    user_model = db.query(Users).filter(Users.id == user["id"]).first()

    if not user_model:
        raise HTTPException(status_code=404, detail='User not found.')
    
    if not bcrypt_context.verify(passwords.old_password, 
                                 user_model.hashed_password):
        raise HTTPException(status_code=401, detail='Old password is incorrect.')
    
    user_model.hashed_password = bcrypt_context.hash(passwords.new_password)

    db.add(user_model)
    db.commit()

    return {"message": "Password changed successfully."}

@router.put('/change-phonenumber')
async def change_phone_number(user: user_dependency,
                              db: db_dependency,
                              phone_number : ChangePhoneNumberRequest):
    if not user:
        raise HTTPException(status_code=401,detail="Authentication failed.")
    
    user_model = db.query(Users).filter(Users.id == user["id"]).first()

    if not user_model:
        raise HTTPException(status_code=404, detail="User not found.")
    
    new_phone_number = phone_number.phone_number
    if not new_phone_number:
        raise HTTPException(status_code=400, detail="You must provide a phone number.")
    elif new_phone_number == user_model.phone_number:
        raise HTTPException(status_code=400, detail="You must provide a new phone number.")
    
    user_model.phone_number = new_phone_number
    db.add(user_model)
    db.commit()

    return {"message": "Phone number updated successfully."}
    


