from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, create_engine, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import event

import uuid


Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, index=True, unique=True, nullable=False)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())  
    connections = relationship("Connection", 
                               foreign_keys="Connection.user_id", 
                               back_populates="owner")

class Connection(Base):
    __tablename__ = 'connections'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    connected_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    connection_made_at = Column(DateTime(timezone=True), server_default=func.now())  
    owner = relationship("User", 
                         foreign_keys=[user_id], 
                         back_populates="connections")
