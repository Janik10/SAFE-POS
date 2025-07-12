import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  timestamp: string;
}

export default function ShiftTransactions() {
  const { id } = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/transactions/by-shift/${id}`)
      .then((res) => res.json())
      .then(setTransactions);
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💰 Транзакции за смену #{id}</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Тип</th>
            <th className="border p-2">Сумма</th>
            <th className="border p-2">Время</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.type}</td>
              <td className="border p-2">{t.amount}</td>
              <td className="border p-2">{new Date(t.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
