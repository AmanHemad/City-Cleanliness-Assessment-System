import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CityMap from "./pages/CityMap";
import Report from "./pages/ReportIssue"
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/report" element={<Report />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
