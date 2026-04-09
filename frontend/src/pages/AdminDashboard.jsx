import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        // ❌ No token → redirect
        if (!token) {
          navigate("/admin-login");
          return;
        }

        // ✅ Verify token with backend
        await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED (important)
          },
        });

      } catch (err) {
        console.error(err);
        alert("Access Denied ❌");
        navigate("/admin-login");
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard 🛠️</h1>
      <p>Welcome Admin 🚀</p>

      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          background: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}