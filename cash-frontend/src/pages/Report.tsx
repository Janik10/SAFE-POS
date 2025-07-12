import { useEffect, useState } from "react";
import { getShifts, getTransactions } from "../api/cashierApi";

interface Shift {
  id: number;
  cashier_id: number;
  start_time: string;
  end_time: string | null;
  final_cash: number | null;
}

interface Transaction {
  id: number;
  shift_id: number;
  cashier_id: number;
  type: string;
  amount: number;
  timestamp: string;
}

export default function Report() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [selectedCashierId, setSelectedCashierId] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const cashierId = localStorage.getItem("cashierId");
    if (!role || !cashierId) {
      alert("Сначала войдите в систему");
      window.location.href = "/";
      return;
    }
    async function fetchData() {
      try {
        const shiftData = await getShifts();
        const txnData = await getTransactions();
        setShifts(shiftData);
        setTransactions(txnData);
      } catch {
        alert("Ошибка при загрузке данных");
      }
    }
    fetchData();
  }, []);

  const calculatePredictedCash = (shiftId: number) => {
    const filtered = transactions.filter((t) => t.shift_id === shiftId);
    let total = 0;
    for (let t of filtered) {
      if (t.type === "income") total += t.amount;
      else if (t.type === "expense") total -= t.amount;
    }
    return total;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredShifts = shifts.filter((shift) => {
    const matchCashier = selectedCashierId ? shift.cashier_id === selectedCashierId : true;
    const matchDate = selectedDate
      ? shift.start_time.startsWith(selectedDate) // 2025-07-04
      : true;
    return matchCashier && matchDate;
  });

  const summary = filteredShifts.reduce(
    (acc, shift) => {
      const total = calculatePredictedCash(shift.id);
      acc.total += total;
      acc.expense += transactions
        .filter((t) => t.shift_id === shift.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      acc.income += transactions
        .filter((t) => t.shift_id === shift.id && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      return acc;
    },
    { total: 0, income: 0, expense: 0 }
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Отчёты по сменам</h1>

      <div className="flex gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="ID кассира"
          value={selectedCashierId}
          onChange={(e) =>
            setSelectedCashierId(
              e.target.value === "" ? "" : parseInt(e.target.value)
            )
          }
          className="border p-2"
        />
      </div>

      <table className="table-auto border w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID Смены</th>
            <th className="border px-4 py-2">ID Кассира</th>
            <th className="border px-4 py-2">Начало</th>
            <th className="border px-4 py-2">Конец</th>
            <th className="border px-4 py-2">Итоговая касса</th>
            <th className="border px-4 py-2">Предсказанная касса</th>
          </tr>
        </thead>
        <tbody>
          {filteredShifts.map((shift) => (
            <tr
              key={shift.id}
              onClick={() => window.location.href = `/shift/${shift.id}/transactions`}
              className={`cursor-pointer ${
                shift.final_cash !== null &&
                Math.abs(shift.final_cash - calculatePredictedCash(shift.id)) > 1
                  ? "bg-red-100"
                  : ""
              }`}
            >
              <td className="border px-4 py-2">{shift.id}</td>
              <td className="border px-4 py-2">{shift.cashier_id}</td>
              <td className="border px-4 py-2">{formatDate(shift.start_time)}</td>
              <td className="border px-4 py-2">{formatDate(shift.end_time)}</td>
              <td className="border px-4 py-2">
                {shift.final_cash != null ? shift.final_cash.toFixed(2) : "—"}
              </td>
              <td className="border px-4 py-2">
                {calculatePredictedCash(shift.id).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 border-t pt-4 text-sm">
        <h2 className="font-bold text-lg mb-2">Сводка по фильтру:</h2>
        <p>Доход: {summary.income.toFixed(2)} ₼</p>
        <p>Расход: {summary.expense.toFixed(2)} ₼</p>
        <p>Прибыль: {(summary.income - summary.expense).toFixed(2)} ₼</p>

        {filteredShifts.map((shift) => {
            const predicted = calculatePredictedCash(shift.id);
            const final = shift.final_cash;
            if (final != null && Math.abs(final - predicted) > 5) {
              return (
                <p key={shift.id} className="text-red-600 mt-2 font-semibold">
                  ⚠️ Смена #{shift.id} подозрительна: расхождение более 5 AZN (реальная: {final}, ожидаемая: {predicted})
                </p>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
}
