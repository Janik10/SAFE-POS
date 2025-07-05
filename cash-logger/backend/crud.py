from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import datetime
from typing import Optional
from fastapi import  Depends, HTTPException

# 📦 Транзакции
def create_transaction(db: Session, txn: schemas.TransactionCreate):
    db_txn = models.Transaction(**txn.dict())
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

# ⏱ Смены
def start_shift(db: Session, cashier_id: int):
    cashier = db.query(models.Cashier).get(cashier_id)
    if not cashier:
        raise HTTPException(status_code=404, detail="Кассир не найден")  # ✅ Новый код

    if cashier.role != "cashier":
        raise HTTPException(status_code=403, detail="Только кассиры могут начинать смены.")

    shift = models.Shift(cashier_id=cashier_id)
    db.add(shift)
    db.commit()
    db.refresh(shift)
    return shift



def end_shift(db: Session, shift_id: int, final_cash: float):
    shift = db.query(models.Shift).get(shift_id)
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")

    if shift.end_time is not None:
        raise HTTPException(status_code=400, detail="Shift already ended")

    cashier = db.query(models.Cashier).get(shift.cashier_id)
    if cashier.role != "cashier":
        raise HTTPException(status_code=403, detail="Only cashiers can end shifts.")

    shift.end_time = datetime.utcnow()
    shift.final_cash = final_cash
    db.commit()
    db.refresh(shift)
    return shift



def get_shift_report(db: Session, shift_id: int):
    shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if not shift:
        return {"error": "Смена не найдена"}

    txns = db.query(models.Transaction).filter(models.Transaction.shift_id == shift_id).all()

    total_sales = sum(t.amount for t in txns if t.type == "sale" and t.amount)
    total_returns = sum(t.amount for t in txns if t.type == "return" and t.amount)
    net_total = total_sales - total_returns

    final_cash = shift.final_cash if shift.final_cash is not None else 0.0
    diff = final_cash - net_total

    return {
        "shift_id": shift_id,
        "sales": total_sales,
        "returns": total_returns,
        "net_total": net_total,
        "final_cash_reported": final_cash,
        "difference": diff,
        "status": "OK" if abs(diff) <= 1 else "POTENTIAL ISSUE"
    }

def get_shift_summary(db: Session, cashier_id: Optional[int] = None, date: Optional[str] = None):
    query = db.query(models.Transaction)
    if cashier_id:
        query = query.filter(models.Transaction.cashier_id == cashier_id)
    if date:
        query = query.filter(models.Transaction.timestamp.like(f"{date}%"))

    transactions = query.all()
    income = sum(t.amount for t in transactions if t.type == "income")
    expense = sum(t.amount for t in transactions if t.type == "expense")
    profit = income - expense
    return {"income": income, "expense": expense, "profit": profit}

