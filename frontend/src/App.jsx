import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CityMap from "./pages/CityMap";
import Report from "./pages/ReportIssue"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
