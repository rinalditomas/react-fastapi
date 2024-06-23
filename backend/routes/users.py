from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.user_crud as crud 
import schemas
from db.database import get_db
from typing import List
from uuid import UUID

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Manual validation for name
    if not user.name or not user.name.strip():
        raise HTTPException(status_code=400, detail="Username cannot be empty.")
    
    # Manual validation for email
    if not user.email or not user.email.strip():
        raise HTTPException(status_code=400, detail="Email cannot be empty.")
    if '@' not in user.email:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    
    # Check if an email already exists
    existing_user = crud.get_user_by_email(db=db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already in use.")
    
    try:
        db_user = crud.create_user(db=db, user=user)
        return {"id": db_user.id, "name": db_user.name, "email": db_user.email}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not create the user.")


    
@router.get("/", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    try:
        users = crud.get_all_users(db=db)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not retrieve users.")
    

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
    
@router.post("/connect", response_model=schemas.Connection)
def create_connection(connection_create: schemas.ConnectionCreate, db: Session = Depends(get_db)):
    user_id_1 = connection_create.user_id
    user_id_2 = connection_create.connected_user_id
    
    # Check if the connection already exists
    existing_connection = crud.get_connection(db=db, user_id_1=user_id_1, user_id_2=user_id_2)
    if existing_connection:
        raise HTTPException(status_code=400, detail="Connection already exists between these users.")

    try:
        # Proceed to create the connection using the modified function signature
        db_connection = crud.create_connection(db=db, user_id_1=user_id_1, user_id_2=user_id_2)
        return db_connection
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Could not create the connection. Error: {e}")

@router.get("/{user_id}/connections", response_model=List[schemas.User])
def read_user_connections(user_id: UUID, db: Session = Depends(get_db)):
    return crud.get_user_connections(user_id=user_id, db=db)


@router.delete("/{user_id}")
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    try:
        result = crud.delete_user(db=db, user_id=user_id)
        if result:
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not delete the user.")


@router.put("/{user_id}")
def modify_user(user_id: UUID, user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        updated_user = crud.modify_user(db=db, user_id=user_id, updated_user=user)
        if updated_user:
            return {"id": updated_user.id, "name": updated_user.name}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not update the user.")


@router.get("/{user_id}/possible_connections", response_model=List[schemas.User])
def get_possible_connections(user_id: UUID, db: Session = Depends(get_db)):
    try:
        possible_users = crud.get_possible_users_to_connect(db=db, user_id=user_id)
        return possible_users
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not retrieve possible connections.")

@router.delete("/connections/{user_id_1}/{user_id_2}", status_code=204)
def delete_user_connection(user_id_1: UUID, user_id_2: UUID, db: Session = Depends(get_db)):
    """
    Delete a connection between two users.
    """
    try:
        success = crud.delete_connection(db=db, user_id_1=user_id_1, user_id_2=user_id_2)
        if not success:
            raise HTTPException(status_code=404, detail="Connection not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not delete the connection.")
    return {"detail": "Connection deleted successfully"}
