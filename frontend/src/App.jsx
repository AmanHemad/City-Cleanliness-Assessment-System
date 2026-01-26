import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CityMap from "./pages/CityMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<CityMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
