from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas

router = APIRouter(prefix="/cashiers", tags=["cashiers"])

@router.post("/", response_model=schemas.Cashier)
def create_cashier(cashier: schemas.CashierCreate, db: Session = Depends(get_db)):
    new_cashier = models.Cashier(name=cashier.name, role="cashier")
    db.add(new_cashier)
    db.commit()
    db.refresh(new_cashier)
    return new_cashier

@router.get("/", response_model=list[schemas.Cashier])
def get_all_cashiers(db: Session = Depends(get_db)):
    return db.query(models.Cashier).all()

@router.get("/{cashier_id}", response_model=schemas.Cashier)
def get_cashier_by_id(cashier_id: int, db: Session = Depends(get_db)):
    cashier = db.query(models.Cashier).filter(models.Cashier.id == cashier_id).first()
    if not cashier:
        raise HTTPException(status_code=404, detail="Кассир не найден")
    return cashier

# 👇 Обновить роль кассира
@router.put("/{cashier_id}", response_model=schemas.Cashier)
def update_cashier_role(cashier_id: int, db: Session = Depends(get_db)):
    cashier = db.query(models.Cashier).filter(models.Cashier.id == cashier_id).first()
    if not cashier:
        raise HTTPException(status_code=404, detail="Cashier not found")
    cashier.role = "manager"
    db.commit()
    db.refresh(cashier)
    return cashier

# 👇 Удалить кассира
@router.delete("/{cashier_id}")
def delete_cashier(cashier_id: int, db: Session = Depends(get_db)):
    cashier = db.query(models.Cashier).filter(models.Cashier.id == cashier_id).first()
    if not cashier:
        raise HTTPException(status_code=404, detail="Cashier not found")
    db.delete(cashier)
    db.commit()
    return {"message": "Cashier deleted"}
