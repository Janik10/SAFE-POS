const BASE_URL = "http://127.0.0.1:8000"; // или свой адрес backend

export async function startShift(cashier_id: number) {
  const response = await fetch(`${BASE_URL}/shifts/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cashier_id }),
  });

  if (!response.ok) throw new Error("Ошибка при начале смены");

  return await response.json();
}

export async function endShift(shiftId: number, finalCash: number) {
  const response = await fetch(`http://127.0.0.1:8000/shifts/${shiftId}/end`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ final_cash: finalCash }), // 👈 обязательно отправить нужное поле
  });

  if (!response.ok) throw new Error("Ошибка при завершении смены");

  return await response.json();
}

export async function createTransaction(data: {
  type: string;
  amount: number;
  cashier_id: number;
  shift_id: number;
}) {
  const response = await fetch(`${BASE_URL}/transactions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Ошибка при создании транзакции");

  return await response.json();
}

export async function getTransactions() {
  const response = await fetch(`${BASE_URL}/transactions/`);
  if (!response.ok) throw new Error("Ошибка при получении транзакций");
  return await response.json();
}

export async function getShifts() {
  const response = await fetch(`${BASE_URL}/shifts`);
  if (!response.ok) throw new Error("Ошибка при получении смен");
  return await response.json();
}
