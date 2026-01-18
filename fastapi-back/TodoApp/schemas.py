from pydantic import BaseModel, Field

class TodoRequest(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=100)
    priority: int = Field(gt=0, lt=6)
    complete: bool = False

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
        orm_mode = True

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
