import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
import pytest
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from main import app
from fastapi import HTTPException

from backend.models.models import Base, User
import schemas
from crud.user_crud import create_user

# Setup a test database (in-memory SQLite for simplicity)
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

client = TestClient(app)


@pytest.fixture
def db_session():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    # Create a new database session
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_create_user_success(db_session):
    # Given
    test_user_data = schemas.UserCreate(name="John Doe", email="john.doe@example.com")
    # When
    created_user = create_user(db_session, test_user_data)
    # Then
    assert created_user.name == test_user_data.name
    assert created_user.email == test_user_data.email
    # Verify the user is in the database
    db_user = db_session.query(User).filter(User.email == test_user_data.email).first()
    assert db_user is not None
    assert db_user.name == test_user_data.name

def test_create_user_duplicate_email(db_session):
    # Given
    test_user_data = schemas.UserCreate(name="Jane Doe", email="jane.doe@example.com")
    # Create a user with the same email first
    db_session.add(User(name="Existing User", email="jane.doe@example.com"))
    db_session.commit()

    # When/Then
    with pytest.raises(Exception):  # Replace Exception with the specific exception your code raises
        create_user(db_session, test_user_data)

def test_create_user_invalid_input(db_session):
    # Given invalid email format
    test_user_data = {"name": "Invalid User", "email": "invalid-email"}
    # When/Then
    response = client.post("/users/", json=test_user_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid email address."}
    
