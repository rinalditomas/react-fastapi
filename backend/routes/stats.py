from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.statistics_crud as crud
import schemas
from db.database import get_db

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)

@router.get("/", response_model=schemas.Stats)
def get_stats(db: Session = Depends(get_db)):
    try:
        stats = crud.get_statistics(db)
        return schemas.Stats(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")
