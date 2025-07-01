import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [cashierId, setCashierId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (cashierId) {
      localStorage.setItem("cashierId", cashierId);
      navigate("/dashboard");
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
