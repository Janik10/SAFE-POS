import React, { useEffect, useState } from "react";
import { getTransactions } from "../api/cashierApi";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  cashier_id: number;
  shift_id: number;
  timestamp: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => alert("Ошибка при загрузке транзакций"));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧾 История транзакций</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Тип</th>
            <th className="border p-2">Сумма</th>
            <th className="border p-2">Кассир</th>
            <th className="border p-2">Смена</th>
            <th className="border p-2">Время</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.type}</td>
              <td className="border p-2">{t.amount}</td>
              <td className="border p-2">{t.cashier_id}</td>
              <td className="border p-2">{t.shift_id}</td>
              <td className="border p-2">{new Date(t.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
