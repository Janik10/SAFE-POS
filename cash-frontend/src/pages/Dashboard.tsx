import { useState } from "react";
import {
  startShift,
  endShift,
  createTransaction,
} from "../api/cashierApi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [cashierId, setCashierId] = useState<number>(1); // пока фиксировано
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("income");
  const [finalCash, setFinalCash] = useState<number>(0); // 👈 важно
  const navigate = useNavigate();

  const handleStartShift = async () => {
    try {
      const data = await startShift(cashierId);
      setShiftId(data.id);
      alert("Смена начата!");
    } catch (error) {
      alert("Ошибка при запуске смены");
    }
  };

  const handleEndShift = async () => {
    if (!shiftId) return alert("Нет активной смены");
    try {
      await endShift(shiftId, finalCash); // 👈 передаём итог
      setShiftId(null);
      alert("Смена завершена!");
    } catch (error) {
      alert("Ошибка при завершении смены");
    }
  };

  const handleCreateTransaction = async () => {
    if (!shiftId) return alert("Нет активной смены");
    try {
      await createTransaction({ type, amount, cashier_id: cashierId, shift_id: shiftId });
      alert("Транзакция добавлена");
    } catch (error) {
      alert("Ошибка при добавлении транзакции");
    }
  };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Панель кассира</h1>

      <div className="flex gap-4">
        <button className="bg-green-500 px-4 py-2 text-white" onClick={handleStartShift}>
          Начать смену
        </button>
        <button className="bg-red-500 px-4 py-2 text-white" onClick={handleEndShift}>
          Завершить смену
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="number"
          placeholder="Сумма транзакции"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 w-full"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full"
          aria-label="Тип транзакции"
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>

        <button className="bg-blue-500 px-4 py-2 text-white" onClick={handleCreateTransaction}>
          Добавить транзакцию
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Финальная сумма в кассе</label>
        <input
            type="number"
            placeholder="Итоговая касса"
            value={finalCash}
            onChange={(e) => setFinalCash(Number(e.target.value))}
            className="border p-2 w-full"
            />
      </div>

      <button
        className="underline text-blue-600"
        onClick={() => navigate("/report")}
      >
        Перейти к отчету
      </button>
    </div>
  );
}
