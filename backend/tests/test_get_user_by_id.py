import pytest
import uuid
from backend.models.models import User, Base
from crud.user_crud import get_user_by_id
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Setup a test database (in-memory SQLite for simplicity)
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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

@pytest.fixture
def sample_user_by_id(db_session):
    # Create and return a sample user with a specific UUID
    user_id = uuid.uuid4()
    user = User(id=user_id, name="Sample User By ID", email="samplebyid@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

def test_get_user_by_id_existing_user(db_session, sample_user_by_id):
    # Given a user in the database with a specific UUID
    # When retrieving user by ID
    user = get_user_by_id(db_session, sample_user_by_id.id)
    # Then the correct user is returned
    assert user is not None
    assert user.id == sample_user_by_id.id
    assert user.email == "samplebyid@example.com"
    assert user.name == "Sample User By ID"

def test_get_user_by_id_non_existing_user(db_session):
    # Given no user in the database with the specified UUID
    # When retrieving user by ID
    user = get_user_by_id(db_session, uuid.uuid4())
    # Then None is returned
    assert user is None