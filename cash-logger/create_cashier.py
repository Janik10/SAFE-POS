from backend.database import SessionLocal
from backend.models import Cashier

# Создание сессии с БД
db = SessionLocal()

# Новый кассир
new_cashier = Cashier(name="Admin", role="cashier")
db.add(new_cashier)
db.commit()
db.refresh(new_cashier)

print("✅ Кассир создан:")
print("ID:", new_cashier.id)
print("Имя:", new_cashier.name)
print("Роль:", new_cashier.role)

db.close()
