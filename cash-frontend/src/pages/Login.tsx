import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [cashierId, setCashierId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!cashierId) return;

  try {
    const res = await fetch(`http://localhost:8000/cashiers/${cashierId}`);
    if (!res.ok) {
      alert("Кассир не найден");
      return;
    }

    const data = await res.json();

    localStorage.setItem("cashierId", data.id.toString());
    localStorage.setItem("role", data.role);

    if (data.role === "manager") {
      navigate("/manager");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    alert("Ошибка при логине");
  }
};

const handleCashierLogin = async () => {
  if (!cashierId) return;

  try {
    const res = await fetch(`http://localhost:8000/cashiers/${cashierId}`);
    if (!res.ok) {
      alert("Кассир не найден");
      return;
    }

    const data = await res.json();

    if (data.role !== "cashier") {
      alert("Этот ID не принадлежит кассиру");
      return;
    }

    localStorage.setItem("cashierId", data.id.toString());
    localStorage.setItem("role", data.role);
    navigate("/dashboard");
  } catch (err) {
    alert("Ошибка при логине");
  }
};

const handleManagerLogin = async () => {
  if (!cashierId) return;

  try {
    const res = await fetch(`http://localhost:8000/cashiers/${cashierId}`);
    if (!res.ok) {
      alert("Кассир не найден");
      return;
    }

    const data = await res.json();

    if (data.role !== "manager") {
      alert("Этот ID не принадлежит менеджеру");
      return;
    }

    localStorage.setItem("cashierId", data.id.toString());
    localStorage.setItem("role", data.role);
    navigate("/manager");
  } catch (err) {
    alert("Ошибка при логине");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">SAFE-POS</h1>
        <input
          type="text"
          placeholder="ID кассира"
          value={cashierId}
          onChange={(e) => setCashierId(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mb-4"
        />
        <button
          onClick={handleCashierLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Войти как кассир
        </button>
        <button
          onClick={handleManagerLogin}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mt-2"
        >
          Войти как менеджер
        </button>
      </div>
    </div>
  );
};

export default Login;
