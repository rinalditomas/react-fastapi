from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud
import schemas
from db.database import get_db
from typing import List

router = APIRouter(
    prefix="/users",
    tags=["users"],
)



@router.post("/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = crud.create_user(db=db, user=user)
        return {"id": db_user.id, "name": db_user.name}
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not create the user.")
    
@router.get("/", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    try:
        users = crud.get_all_users(db=db)
        return users
    except:
        raise HTTPException(status_code=500, detail="Could not retrieve users.")
    
@router.post("/connect")
def create_connection(user_id_1: int, user_id_2: int, db: Session = Depends(get_db)):
    # Check if the connection already exists
    existing_connection = crud.get_connection(db=db, user_id_1=user_id_1, user_id_2=user_id_2)
    if existing_connection:
        return {"message": "Connection already exists between these users."}

    try:
        # Proceed to create the connection if it doesn't exist
        connection = crud.create_connection(db=db, user_id_1=user_id_1, user_id_2=user_id_2)
        return {"message": "Connection created"}
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not create the connection.")

@router.get("/{user_id}/connections")
def get_direct_connections(user_id: int, db: Session = Depends(get_db)):
    try:
        connections = crud.get_user_connections(db=db, user_id=user_id)
        return {"connections": connections}
    except:
        raise HTTPException(status_code=500, detail="Could not retrieve connections.")

@router.get("/stats")
def get_connection_stats(db: Session = Depends(get_db)):
    try:
        stats = crud.get_connection_stats(db=db)
        return {"stats": stats}
    except:
        raise HTTPException(status_code=500, detail="Could not retrieve connection stats.")

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        result = crud.delete_user(db=db, user_id=user_id)
        if result:
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not delete the user.")

@router.delete("/connection/{user_id_1}/{user_id_2}")
def delete_connection(user_id_1: int, user_id_2: int, db: Session = Depends(get_db)):
    try:
        result = crud.delete_connection(db=db, user_id_1=user_id_1, user_id_2=user_id_2)
        if result:
            return {"message": "Connection deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Connection not found")
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not delete the connection.")

@router.put("/{user_id}")
def modify_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        updated_user = crud.modify_user(db=db, user_id=user_id, updated_user=user)
        if updated_user:
            return {"id": updated_user.id, "name": updated_user.name}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not update the user.")