from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
import models
import schemas
from typing import List
from uuid import UUID




def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_connection(db: Session, user_id_1: UUID, user_id_2: UUID):
    db_connection = models.Connection(user_id=user_id_1, connected_user_id=user_id_2)
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection

def get_user_connections(db: Session, user_id: UUID) -> List[models.User]:
    """
    Retrieves connections for a user based on user_id.
    Returns a list of User models representing connected users.
    """
    # Query to fetch connections where user_id is the initiator
    connections_initiated = db.query(models.User).join(
        models.Connection,
        models.Connection.connected_user_id == models.User.id
    ).filter(models.Connection.user_id == user_id).all()
    
    # Query to fetch connections where user_id is the receiver
    connections_received = db.query(models.User).join(
        models.Connection,
        models.Connection.user_id == models.User.id
    ).filter(models.Connection.connected_user_id == user_id).all()
    
    # Combine and return the list of connected users (remove duplicates)
    connected_users = list(set(connections_initiated + connections_received))
    
    return connected_users




def get_all_users(db: Session):
    return db.query(models.User).all()




def delete_user(db: Session, user_id: UUID):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def get_connection(db: Session, user_id_1: UUID, user_id_2: UUID):
    # Check if there's a connection from user_id_1 to user_id_2 or from user_id_2 to user_id_1
    db_connection = db.query(models.Connection).filter(
        (models.Connection.user_id == user_id_1) & (models.Connection.connected_user_id == user_id_2) |
        (models.Connection.user_id == user_id_2) & (models.Connection.connected_user_id == user_id_1)
    ).first()
    return db_connection

def delete_connection(db: Session, user_id_1: UUID, user_id_2: UUID):
    db_connection = db.query(models.Connection).filter(
        models.Connection.user_id == user_id_1,
        models.Connection.connected_user_id == user_id_2
    ).first()
    if db_connection:
        db.delete(db_connection)
        db.commit()
        return True
    return False

def modify_user(db: Session, user_id: UUID, updated_user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.name = updated_user.name
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def get_user_profile_with_connections(db: Session, user_id: UUID):
    user_with_connections = db.query(models.User).options(
        joinedload(models.User.connections).joinedload(models.Connection.owner)
    ).filter(models.User.id == user_id).first()
    return user_with_connections

def get_possible_users_to_connect(db: Session, user_id: UUID) -> List[models.User]:
    # Query to fetch user IDs that the current user is already connected with as initiator
    connected_user_ids_initiator = db.query(models.Connection.connected_user_id).filter(models.Connection.user_id == user_id).all()
    connected_user_ids_initiator = {id[0] for id in connected_user_ids_initiator}  # Convert to set for O(1) lookup

    # Query to fetch user IDs that the current user is already connected with as receiver
    connected_user_ids_receiver = db.query(models.Connection.user_id).filter(models.Connection.connected_user_id == user_id).all()
    connected_user_ids_receiver = {id[0] for id in connected_user_ids_receiver}  # Convert to set for O(1) lookup

    # Combine connected user IDs from both initiator and receiver perspectives
    connected_user_ids = connected_user_ids_initiator.union(connected_user_ids_receiver)

    # Fetch possible users to connect with
    possible_users = db.query(models.User).filter(models.User.id != user_id, ~models.User.id.in_(connected_user_ids)).all()

    return possible_users

