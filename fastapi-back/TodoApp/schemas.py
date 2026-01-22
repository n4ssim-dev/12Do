from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TodoRequest(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=100)
    priority: int = Field(gt=0, lt=6)
    complete: bool = False
    theme: Optional[str] = None

    class Config:
        from_attributes = True 

class TodoResponse(BaseModel):
    id: int
    title: str
    description: str
    priority: int
    complete: bool
    created_at: datetime
    theme: str | None

    class Config:
        from_attributes = True



class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    phone_number: str | None

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ChangePhoneNumberRequest(BaseModel):
    phone_number: str


class CreateUserRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str
    role: str
    phone_number: str
