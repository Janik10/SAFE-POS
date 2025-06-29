from sqlalchemy.orm import Session
from backend import models, schemas
from datetime import datetime

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
    new_shift = models.Shift(cashier_id=cashier_id)
    db.add(new_shift)
    db.commit()
    db.refresh(new_shift)
    return new_shift

def end_shift(db: Session, shift_id: int, final_cash: float):
    shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if shift:
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
