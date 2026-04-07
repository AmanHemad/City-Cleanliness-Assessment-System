import { useState, useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/home";
import CityMap from "./pages/CityMap";
import Report from "./pages/ReportIssue";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Google redirect success:", result.user.displayName);
        }
      })
      .catch((err) => {
        console.error("Redirect error:", err.code, err.message);
      });

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  if (authLoading) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#0a0a0f",
      color: "#fff",
      fontSize: "1.1rem",
      letterSpacing: "0.05em"
    }}>
      Signing you in...
    </div>
  );

  return (
     <BrowserRouter>
  <Navbar user={user} />
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