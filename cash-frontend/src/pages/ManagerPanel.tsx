import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Cashier {
  id: number;
  name: string;
  role: string;
}

interface Shift {
  id: number;
  cashier_id: number;
  start_time: string;
  end_time: string | null;
  final_cash: number | null;
}

interface Summary {
  income: number;
  expense: number;
  profit: number;
}

export default function ManagerPanel() {
  const navigate = useNavigate();

  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [name, setName] = useState("");
  const [filterCashierId, setFilterCashierId] = useState<number | "">("");
  const [filterDate, setFilterDate] = useState("");

  const API = "http://localhost:8000";

  useEffect(() => {
    fetchCashiers();
  }, []);

  // ... остальной код без изменений


  const fetchCashiers = async () => {
    const res = await axios.get(`${API}/cashiers`);
    setCashiers(res.data);
  };

  const addCashier = async () => {
    if (!name.trim()) return;
    await axios.post(`${API}/cashiers/`, { name, role: "cashier" });
    fetchCashiers();
    setName("");
  };

  const handleDeleteCashier = async (id: number) => {
    await axios.delete(`${API}/cashiers/${id}`);
    fetchCashiers();
  };

  const handlePromoteCashier = async (id: number) => {
    await axios.put(`${API}/cashiers/${id}`, { role: "manager" });
    fetchCashiers();
  };

  const applyFilters = async () => {
    const params: any = {};
    if (filterCashierId) params.cashier_id = filterCashierId;
    if (filterDate) params.date = filterDate;

    const shiftsRes = await axios.get(`${API}/shifts/filter`, { params });
    const summaryRes = await axios.get(`${API}/summary`, { params });

    setShifts(shiftsRes.data);
    setSummary(summaryRes.data);
  };

  const exportCSV = () => {
    const csv = [
      ["ID", "Cashier", "Start", "End", "Final Cash"],
      ...shifts.map((s) => [
        s.id,
        cashiers.find((c) => c.id === s.cashier_id)?.name || s.cashier_id,
        s.start_time,
        s.end_time || "Ongoing",
        s.final_cash ?? "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shifts.csv";
    link.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📋 Manager Panel</h1>

      {/* Add Cashier */}
      <div className="mb-6">
        <input
          placeholder="New cashier name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={addCashier} className="bg-green-500 text-white px-4 py-2 rounded">
          ➕ Add Cashier
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2">Фильтр по роли:</label>
        <select
          className="border p-2"
          onChange={(e) => {
            const role = e.target.value;
            if (!role) fetchCashiers();
            else setCashiers((prev) => prev.filter((c) => c.role === role));
          }}
        >
          <option value="">Все</option>
          <option value="cashier">cashier</option>
          <option value="manager">manager</option>
        </select>
      </div>

      {/* Cashier Table */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">👤 Cashiers</h2>
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashiers.map((c) => (
              <tr
                key={c.id}
                className={c.role === "manager" ? "bg-green-100" : "bg-white"}
              >
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.role}</td>
                <td className="border p-2 space-x-2">
                  {c.role === "cashier" && (
                    <button
                      onClick={() => handlePromoteCashier(c.id)}
                      className="bg-yellow-400 px-2 py-1 rounded text-white"
                    >
                      Promote
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCashier(c.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          value={filterCashierId}
          onChange={(e) => setFilterCashierId(Number(e.target.value) || "")}
          className="border p-2"
        >
          <option value="">All Cashiers</option>
          {cashiers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2"
        />
        <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded">
          🔍 Filter
        </button>
        <button onClick={exportCSV} className="bg-gray-700 text-white px-4 py-2 rounded">
          ⬇ Export CSV
        </button>

        <button
          onClick={() => navigate("/report")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          📊 Перейти к отчёту
        </button>
      </div>

      {/* Shifts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Cashier</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Final Cash</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{cashiers.find((c) => c.id === s.cashier_id)?.name || s.cashier_id}</td>
                <td className="border p-2">{s.start_time.replace("T", " ").slice(0, 16)}</td>
                <td className="border p-2">{s.end_time ? s.end_time.replace("T", " ").slice(0, 16) : "⏳"}</td>
                <td className="border p-2">{s.final_cash ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold text-lg mb-2">📊 Summary</h2>
          <p>💵 Income: ₼{summary.income.toFixed(2)}</p>
          <p>💸 Expense: ₼{summary.expense.toFixed(2)}</p>
          <p>📈 Profit: ₼{summary.profit.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

<div className="mb-4 flex gap-2">
  <button
    onClick={() => navigate("/report")}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    📄 Перейти в отчёты
  </button>
  <button
    onClick={() => navigate("/transactions")}
    className="bg-purple-600 text-white px-4 py-2 rounded"
  >
    💰 История транзакций
  </button>
</div>