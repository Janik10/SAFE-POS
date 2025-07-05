# routers/cashiers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas, database

router = APIRouter(prefix="/cashiers", tags=["cashiers"])

@router.post("/", response_model=schemas.Cashier)
def create_cashier(cashier: schemas.CashierCreate, db: Session = Depends(get_db)):
    new_cashier = models.Cashier(name=cashier.name, role="cashier")  # укажи роль
    db.add(new_cashier)
    db.commit()
    db.refresh(new_cashier)
    return new_cashier

@router.get("/", response_model=list[schemas.Cashier])
def get_all_cashiers(db: Session = Depends(get_db)):
    return db.query(models.Cashier).all()


