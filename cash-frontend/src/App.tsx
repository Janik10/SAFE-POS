import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import ManagerPanel from "./pages/ManagerPanel";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/manager" element={<ManagerPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
