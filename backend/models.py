from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    # Specify the foreign_keys argument to resolve ambiguity
    connections = relationship("Connection", 
                               foreign_keys="Connection.user_id", 
                               back_populates="owner")

class Connection(Base):
    __tablename__ = 'connections'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    connected_user_id = Column(Integer, ForeignKey('users.id'))
    # Specify the foreign_keys argument to resolve ambiguity
    owner = relationship("User", 
                         foreign_keys=[user_id], 
                         back_populates="connections")