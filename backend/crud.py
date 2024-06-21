from sqlalchemy.orm import Session
import models
import schemas
from sqlalchemy import func

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_connection(db: Session, user_id_1: int, user_id_2: int):
    db_connection = models.Connection(user_id=user_id_1, connected_user_id=user_id_2)
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection

def get_user_connections(db: Session, user_id: int):
    return db.query(models.User).join(
        models.Connection, models.User.id == models.Connection.connected_user_id
    ).filter(models.Connection.user_id == user_id).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(models.User).all()

def get_connection_stats(db: Session):
    total_connections = db.query(models.Connection).count()
    # Example stats: total number of connections
    stats = {
        "total_connections": total_connections,
    }
    return stats

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def get_connection(db: Session, user_id_1: int, user_id_2: int):
    # Check if there's a connection from user_id_1 to user_id_2 or from user_id_2 to user_id_1
    db_connection = db.query(models.Connection).filter(
        (models.Connection.user_id == user_id_1) & (models.Connection.connected_user_id == user_id_2) |
        (models.Connection.user_id == user_id_2) & (models.Connection.connected_user_id == user_id_1)
    ).first()
    return db_connection

def delete_connection(db: Session, user_id_1: int, user_id_2: int):
    db_connection = db.query(models.Connection).filter(
        models.Connection.user_id == user_id_1,
        models.Connection.connected_user_id == user_id_2
    ).first()
    if db_connection:
        db.delete(db_connection)
        db.commit()
        return True
    return False

def modify_user(db: Session, user_id: int, updated_user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.name = updated_user.name
        db.commit()
        db.refresh(db_user)
        return db_user
    return None