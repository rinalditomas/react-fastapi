from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud  # Import the CRUD operations
import backend.models.models as models
import schemas
from db.database import engine, get_db
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as user_router
from routes.stats import router as stats_router


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(user_router)
app.include_router(stats_router)  # Include the stats router
