from pydantic import BaseModel

class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True 

class ConnectionBase(BaseModel):
    user_id: int
    connected_user_id: int

class ConnectionCreate(ConnectionBase):
    pass

class Connection(ConnectionBase):
    id: int
    class Config:
        from_attributes = True  