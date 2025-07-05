from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# 💰 Транзакция
class TransactionCreate(BaseModel):
    type: str  # 'sale', 'return', 'cancel', 'open_drawer'
    amount: Optional[float] = None
    cashier_id: int
    shift_id: int

class Transaction(TransactionCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# 🕒 Смена
class ShiftStart(BaseModel):
    cashier_id: int

class ShiftEnd(BaseModel):
    final_cash: float

class Shift(BaseModel):
    id: int
    cashier_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    final_cash: Optional[float] = None

    class Config:
        from_attributes = True


# 👤 Кассир
class CashierCreate(BaseModel):
    name: str
    role: Optional[str] = "cashier"

class Cashier(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True
