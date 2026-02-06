from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
import requests
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy.util import deprecated
from starlette import status
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import timedelta, datetime, timezone
from dotenv import load_dotenv
import os

from ..database import SessionLocal
from ..schemas import CreateUserRequest, Token
from ..models import Users
from ..dependencies import get_db


load_dotenv()


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


db_dependency = Annotated[Session, Depends(get_db)]

# /---------------/ ENDPOINTS / --------------------/ #

def authenticate_user(username: str,password: str, db):
    user = db.query(Users).filter(Users.username == username).first()

    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(username: str, role: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id, 'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: str = payload.get('id')
        user_role: str = payload.get('role')
        
        if username is None or user_id is None or user_role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate credentials.')

        return {'username': username, 'id': int(user_id), 'role': user_role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate credentials.')
    
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user(db : db_dependency,
                      create_user_request: CreateUserRequest):
    create_user_model = Users(
        email = create_user_request.email,
        username = create_user_request.username,
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        role = create_user_request.role,
        hashed_password = bcrypt_context.hash(create_user_request.password),
        is_active = True,
        phone_number = create_user_request.phone_number
    )

    db.add(create_user_model)
    db.commit()


@router.post('/token', response_model= Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate credentials.')
    token = create_access_token(user.username,user.role,user.id,timedelta(days=1))

    return {'access_token': token, 'token_type': 'bearer'}

####-------------------- GOOGLE OAUTH ---------------------####

@router.get("/google/login")
async def google_login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&scope=openid%20email%20profile"
    )
    return RedirectResponse(google_auth_url)

@router.get("/google/callback")
async def google_callback(request: Request, db: db_dependency):
    code = request.query_params.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="Code Google manquant")

    # 1. Échange code → token
    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        },
    )

    token_data = token_res.json()
    access_token = token_data.get("access_token")

    # 2. Infos utilisateur Google
    user_res = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    google_user = user_res.json()
    email = google_user["email"]

    # 3. Création / récupération user
    user = db.query(Users).filter(Users.email == email).first()

    if not user:
        user = Users(
            email=email,
            username=email,
            first_name=google_user.get("given_name", ""),
            last_name=google_user.get("family_name", ""),
            role="user",
            hashed_password=bcrypt_context.hash(os.urandom(16).hex()),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Génération JWT interne
    jwt_token = create_access_token(
        user.username,
        user.role,
        user.id,
        timedelta(days=1)
    )

    # 5. Redirection vers le front avec token
    return RedirectResponse(
        f"http://localhost:3000/oauth-success?token={jwt_token}"
    )
