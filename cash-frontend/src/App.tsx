import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import ManagerPanel from "./pages/ManagerPanel";
import Transactions from "./pages/Transactions"; // 🔥 NEW
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute allowedRoles={["cashier", "manager"]} element={<Dashboard />} />}
        />
        <Route
          path="/report"
          element={<ProtectedRoute allowedRoles={["manager"]} element={<Report />} />}
        />
        <Route
          path="/manager"
          element={<ProtectedRoute allowedRoles={["manager"]} element={<ManagerPanel />} />}
        />
        <Route
          path="/transactions"
          element={<ProtectedRoute allowedRoles={["manager"]} element={<Transactions />} />}
        />
        <Route
          path="/shift/:id/transactions"
          element={<ProtectedRoute allowedRoles={["manager"]} element={<Transactions />} />}
        />

      </Routes>
    </Router>
  );
}
export default App;