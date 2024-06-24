import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.models import Base, User
from crud.user_crud import get_user_by_email

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
def sample_user(db_session):
    # Create and return a sample user
    user = User(name="Sample User", email="sample@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

def test_get_user_by_email_existing_user(db_session, sample_user):
    # Given a user in the database
    # When retrieving user by email
    user = get_user_by_email(db_session, "sample@example.com")
    # Then the correct user is returned
    assert user is not None
    assert user.email == "sample@example.com"
    assert user.name == "Sample User"

def test_get_user_by_email_non_existing_user(db_session):
    # Given no user in the database with the specified email
    # When retrieving user by email
    user = get_user_by_email(db_session, "nonexistent@example.com")
    # Then None is returned
    assert user is None