from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend import database, models, schemas, crud
from typing import List


from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # пока открыто всем
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
    return crud.start_shift(db, data.cashier_id)

@app.post("/shifts/{shift_id}/end", response_model=schemas.Shift)
def end_shift(shift_id: int, data: schemas.ShiftEnd, db: Session = Depends(get_db)):
    return crud.end_shift(db, shift_id, data.final_cash)

@app.get("/shifts/{shift_id}/report")
def shift_report(shift_id: int, db: Session = Depends(get_db)):
    return crud.get_shift_report(db, shift_id)

@app.get("/shifts", response_model=List[schemas.Shift])
def get_all_shifts(db: Session = Depends(get_db)):
    return db.query(models.Shift).all()
