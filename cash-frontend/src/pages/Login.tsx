import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [cashierId, setCashierId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!cashierId.trim()) return;

    try {
      const res = await axios.get(`http://localhost:8000/cashiers/${cashierId}/exists`);
      const { role } = res.data;

      localStorage.setItem("cashierId", cashierId);

      if (role === "manager") {
        navigate("/manager");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Кассир не найден");
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
          className="w-full border px-4 py-2 rounded-lg mb-2"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Войти
        </button>
      </div>
    </div>
  );
};

export default Login;
