from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

from backend import database, models, schemas, crud
from backend.routers import cashier
from backend.routers import manager  # <-- сначала импорт

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()  # <-- потом создаем app

app.include_router(cashier.router)
app.include_router(manager.router)



from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8081"],  # 👈 Указан ВАШ фронтенд
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "SAFE-POS работает"}

# 💰 Транзакции
@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(txn: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.create_transaction(db, txn)

@app.get("/transactions/", response_model=list[schemas.Transaction])
def read_transactions(db: Session = Depends(get_db)):
    return crud.get_transactions(db)

# 🕒 Смены
@app.post("/shifts/start", response_model=schemas.Shift)
def start_shift(data: schemas.ShiftStart, db: Session = Depends(get_db)):
    try:
        print("👀 start_shift called with:", data)
        return crud.start_shift(db, data.cashier_id)
    except Exception as e:
        print("❌ ERROR IN /shifts/start:", str(e))
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/shifts/{shift_id}/end", response_model=schemas.Shift)
def end_shift(shift_id: int, data: schemas.ShiftEnd, db: Session = Depends(get_db)):
    return crud.end_shift(db, shift_id, data.final_cash)

@app.get("/shifts/{shift_id}/report")
def shift_report(shift_id: int, db: Session = Depends(get_db)):
    return crud.get_shift_report(db, shift_id)

@app.get("/shifts", response_model=List[schemas.Shift])
def get_all_shifts(db: Session = Depends(get_db)):
    return db.query(models.Shift).all()

@app.get("/shifts/filter", response_model=List[schemas.Shift])
def filter_shifts(
    cashier_id: Optional[int] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Shift)
    if cashier_id:
        query = query.filter(models.Shift.cashier_id == cashier_id)
    if date:
        query = query.filter(models.Shift.start_time.like(f"{date}%"))
    return query.all()

@app.get("/summary")
def get_summary(
    cashier_id: Optional[int] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_shift_summary(db, cashier_id, date)

@app.get("/cashiers/{cashier_id}/exists")
def check_cashier_exists(cashier_id: int, db: Session = Depends(get_db)):
    cashier = db.query(models.Cashier).get(cashier_id)
    if not cashier:
        raise HTTPException(status_code=404, detail="Кассир не найден")
    return {"status": "ok", "name": cashier.name, "role": cashier.role}

@app.get("/transactions/by-shift/{shift_id}", response_model=List[schemas.Transaction])
def get_transactions_by_shift(shift_id: int, db: Session = Depends(get_db)):
    return db.query(models.Transaction).filter(models.Transaction.shift_id == shift_id).all()

@app.post("/shifts/{shift_id}/end")
def end_shift(shift_id: int, shift_end: schemas.ShiftEnd, db: Session = Depends(get_db)):
    shift = db.query(models.Shift).filter_by(id=shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")

    txns = db.query(models.Transaction).filter_by(shift_id=shift_id).all()
    income = sum(t.amount for t in txns if t.type == "income")
    expense = sum(t.amount for t in txns if t.type == "expense")
    shift.end_time = datetime.utcnow()
    shift.final_cash = shift_end.final_cash or (income - expense)

    db.commit()
    return shift
