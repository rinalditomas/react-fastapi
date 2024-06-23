from pydantic import BaseModel, validator
from datetime import datetime
from typing import List, Optional
from uuid import UUID  # Import UUID

class UserBase(BaseModel):
    name: str
    email: str  # Changed from EmailStr to str

class UserCreate(UserBase):
    pass

class ConnectionBase(BaseModel):
    user_id: UUID
    connected_user_id: UUID

class ConnectionCreate(ConnectionBase):
    pass


class Connection(ConnectionBase):
    id: UUID
    connection_made_at: datetime
    class Config:
        from_attributes = True

class User(UserBase):
    id: UUID
    created_at: Optional[datetime] = None  # Make optional and default to None
    last_updated_at: Optional[datetime] = None  # Make optional and default to None
    class Config:
        from_attributes = True

class Stats(BaseModel):
    user_count: int
    connection_count: int
    average_connections_per_user: float
    last_connection: Optional[datetime] = None  
