import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
import pytest
import uuid
from backend.models.models import User, Base
from crud.user_crud import create_connection
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException
from fastapi.testclient import TestClient
from main import app  # Adjust the import path according to your project structure

client = TestClient(app)

# Setup a test database (in-memory SQLite for simplicity)
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    # Create an in-memory SQLite database for testing
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def sample_user_by_id(db_session):
    # Create and return a sample user with a specific UUID
    user_id = uuid.uuid4()
    user = User(id=user_id, name="Sample User By ID", email="samplebyid@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def another_sample_user(db_session):
    # Create and return another sample user
    user_id = uuid.uuid4()
    user = User(id=user_id, name="Another Sample User", email="anothersample@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

def test_create_connection_between_two_users(db_session, sample_user_by_id, another_sample_user):
    # Given two users in the database
    # When creating a connection between them
    connection = create_connection(db_session, sample_user_by_id.id, another_sample_user.id)
    # Then a connection is successfully created
    assert connection is not None
    assert connection.user_id == sample_user_by_id.id
    assert connection.connected_user_id == another_sample_user.id

def test_create_connection_with_non_existing_user(db_session, sample_user_by_id):
    # Given a valid user and a non-existing user UUID
    non_existing_user_id = uuid.uuid4()
    # When attempting to create a connection through the API
    response = client.post("/connect", json={
        "user_id": str(sample_user_by_id.id),
        "connected_user_id": str(non_existing_user_id)
    })
    # Then the request should fail with a 404 status code
    assert response.status_code == 404

