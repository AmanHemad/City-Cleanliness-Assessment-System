import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        // ❌ No token → redirect
        if (!token) {
          navigate("/admin-login");
          return;
        }

        // ✅ Verify token & Fetch admin
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminData(res.data.admin);

        // ✅ Fetch all reports for stats
        const reportsRes = await axios.get("http://localhost:5000/api/report");
        const reports = reportsRes.data;

        const total = reports.length;
        const resolved = reports.filter(r => r.status === "RESOLVED").length;
        const inProgress = reports.filter(r => r.contractorStatus === "IN_PROGRESS" && r.status !== "RESOLVED").length;
        const pending = total - resolved - inProgress;

        setStats({ total, pending, inProgress, resolved });

      } catch (err) {
        console.error(err);
        alert("Access Denied ❌");
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div style={{ padding: "40px", fontFamily: "'Inter', sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", background: "-webkit-linear-gradient(45deg, #4f46e5, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Admin Dashboard 🛠️
      </h1>

      {loading ? (
        <p>Loading Dashboard...</p>
      ) : (
        <>
          {/* STATS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "30px", marginBottom: "40px" }}>
            <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "14px", textTransform: "uppercase" }}>Total Issues</h3>
              <p style={{ margin: "10px 0 0 0", fontSize: "36px", fontWeight: "bold", color: "#1d4ed8" }}>{stats.total}</p>
            </div>
            
            <div style={{ background: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: 0, color: "#7f1d1d", fontSize: "14px", textTransform: "uppercase" }}>Pending Need Contractor</h3>
              <p style={{ margin: "10px 0 0 0", fontSize: "36px", fontWeight: "bold", color: "#b91c1c" }}>{stats.pending}</p>
            </div>

            <div style={{ background: "#fff7ed", borderLeft: "4px solid #f97316", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: 0, color: "#7c2d12", fontSize: "14px", textTransform: "uppercase" }}>In Progress</h3>
              <p style={{ margin: "10px 0 0 0", fontSize: "36px", fontWeight: "bold", color: "#c2410c" }}>{stats.inProgress}</p>
            </div>

            <div style={{ background: "#f0fdf4", borderLeft: "4px solid #22c55e", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: 0, color: "#14532d", fontSize: "14px", textTransform: "uppercase" }}>Fully Resolved</h3>
              <p style={{ margin: "10px 0 0 0", fontSize: "36px", fontWeight: "bold", color: "#15803d" }}>{stats.resolved}</p>
            </div>
          </div>

          <h2 style={{ fontSize: "20px", color: "#374151" }}>Account Information</h2>
          {adminData && (
            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb", maxWidth: "400px" }}>
              <p><strong>Email:</strong> {adminData.email}</p>
              <p><strong>Role:</strong> Administrator</p>
              <p style={{fontSize: "12px", color: "#9ca3af"}}><strong>ID:</strong> {adminData._id}</p>
            </div>
          )}

          <button
            onClick={() => navigate("/map")}
            style={{ marginTop: "20px", marginRight: "10px", padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            🗺️ Go to City Map
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin-login");
            }}
            style={{ marginTop: "20px", padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}