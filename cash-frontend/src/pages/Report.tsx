import { useEffect, useState } from "react";
import { getShifts } from "../api/cashierApi";

export default function Report() {
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getShifts();
        setShifts(data);
      } catch (error) {
        alert("Ошибка при загрузке смен");
      }
    };

    fetchShifts();
  }, []);

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Отчёты по сменам</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID Смены</th>
            <th className="border px-4 py-2">ID Кассира</th>
            <th className="border px-4 py-2">Начало</th>
            <th className="border px-4 py-2">Конец</th>
            <th className="border px-4 py-2">Итоговая касса</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id}>
              <td className="border px-4 py-2">{shift.id}</td>
              <td className="border px-4 py-2">{shift.cashier_id}</td>
              <td className="border px-4 py-2">{shift.start_time}</td>
              <td className="border px-4 py-2">{shift.end_time || "—"}</td>
              <td className="border px-4 py-2">{shift.final_cash || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
