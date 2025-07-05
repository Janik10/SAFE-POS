from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.orm import declarative_base
Base = declarative_base()


class Cashier(Base):
    __tablename__ = "cashiers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, default="cashier")
    shifts = relationship("Shift", back_populates="cashier")
    transactions = relationship("Transaction", back_populates="cashier")

class Shift(Base):
    __tablename__ = "shifts"
    id = Column(Integer, primary_key=True, index=True)
    cashier_id = Column(Integer, ForeignKey("cashiers.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    final_cash = Column(Float, nullable=True)

    cashier = relationship("Cashier", back_populates="shifts")
    transactions = relationship("Transaction", backref="shift")  # 👈 ДОБАВЬ ЭТО

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    amount = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    cashier_id = Column(Integer, ForeignKey("cashiers.id"))

    cashier = relationship("Cashier", back_populates="transactions")
