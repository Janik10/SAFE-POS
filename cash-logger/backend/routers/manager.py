from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

router = APIRouter(prefix="/managers", tags=["managers"])

@router.post("/", response_model=schemas.Cashier)
def create_manager(manager: schemas.ManagerCreate, db: Session = Depends(get_db)):
    new_manager = models.Cashier(name=manager.name, role="manager")
    db.add(new_manager)
    db.commit()
    db.refresh(new_manager)
    return new_manager

@router.get("/", response_model=list[schemas.Cashier])
def get_all_managers(db: Session = Depends(get_db)):
    return db.query(models.Cashier).filter(models.Cashier.role == "manager").all()

@router.get("/{manager_id}", response_model=schemas.Cashier)
def get_manager_by_id(manager_id: int, db: Session = Depends(get_db)):
    manager = db.query(models.Cashier).filter(models.Cashier.id == manager_id, models.Cashier.role == "manager").first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")
    return manager
