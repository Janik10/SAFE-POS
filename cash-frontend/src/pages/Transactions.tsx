import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTransactions } from "../api/cashierApi";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  cashier_id: number;
  shift_id: number;
  timestamp: string;
}

export default function Transactions() {
  const { id } = useParams(); // id смены (если есть)
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    console.log("Transactions page loaded, id:", id);
    if (id) {
      // если передан shift_id — грузим только по смене
      fetch(`http://127.0.0.1:8000/transactions/by-shift/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Transactions by shift:", data);
          setTransactions(data);
        })
        .catch((err) => {
          console.error("Error loading shift transactions:", err);
          alert("Ошибка при загрузке транзакций по смене");
        });
    } else {
      // иначе — загружаем все
      console.log("Loading all transactions...");
      getTransactions()
        .then((data) => {
          console.log("All transactions:", data);
          setTransactions(data);
        })
        .catch((err) => {
          console.error("Error loading all transactions:", err);
          alert("Ошибка при загрузке транзакций");
        });
    }
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {id ? `🧾 Транзакции по смене #${id}` : "🧾 История всех транзакций"}
      </h2>

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
}
