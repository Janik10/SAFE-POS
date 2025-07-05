from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.models import Base  # 👈 добавь это

DATABASE_URL = "sqlite:///./cashlogger.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db():
    Base.metadata.create_all(bind=engine)

# ✅ добавь эту функцию, чтобы FastAPI мог подключаться к БД
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
