import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin-login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminData(res.data.admin);

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
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard 🛠️</h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginTop: "-10px" }}>
          Monitor platform metrics and manage system operations.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#38bdf8", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Dashboard...</p>
      ) : (
        <>
          {/* STATS GRID */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card blue">
              <h3>Total Issues</h3>
              <p>{stats.total}</p>
            </div>
            
            <div className="admin-stat-card red">
              <h3>Pending Assignment</h3>
              <p>{stats.pending}</p>
            </div>

            <div className="admin-stat-card orange">
              <h3>In Progress</h3>
              <p>{stats.inProgress}</p>
            </div>

            <div className="admin-stat-card green">
              <h3>Fully Resolved</h3>
              <p>{stats.resolved}</p>
            </div>
          </div>

          {adminData && (
            <div className="admin-account-section">
              <h2>Account Information</h2>
              <div className="admin-info-row">
                <span className="admin-info-label">Email Address</span>
                <span className="admin-info-value">{adminData.email}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Access Level</span>
                <span className="admin-info-value" style={{ color: "#34d399" }}>Administrator</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Admin ID</span>
                <span className="admin-info-value id-text">{adminData._id}</span>
              </div>
            </div>
          )}

          <div className="admin-actions">
            <button
              className="admin-btn primary"
              onClick={() => navigate("/map")}
            >
              🗺️ Open Operations Map
            </button>

            <button
              className="admin-btn danger"
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin-login");
              }}
            >
              🔒 Terminate Session
            </button>
          </div>
        </>
      )}
    </div>
  );
}