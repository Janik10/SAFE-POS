# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    type = Column(String)  # sale, return, cancel, open_drawer
    amount = Column(Float, nullable=True)
    cashier_id = Column(Integer)
    shift_id = Column(Integer, ForeignKey("shifts.id"))

class Shift(Base):
    __tablename__ = "shifts"
    id = Column(Integer, primary_key=True)
    cashier_id = Column(Integer)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    final_cash = Column(Float, nullable=True)
