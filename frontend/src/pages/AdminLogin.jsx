import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    adminKey: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );

      localStorage.setItem("adminToken", res.data.token);
      alert("Admin Login Successful ✅");
      navigate("/admin-dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Access Denied ❌");
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-card">

        <h1 className="admin-title">Admin Login</h1>
        <p className="admin-subtitle">
          Only authorized admins can access
        </p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="admin@example.com"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            required
          />

          {/* 🔐 SECRET KEY FIELD */}
          <label>Admin Secret Key</label>
          <input
            type="password"
            name="adminKey"
            placeholder="Enter secret key"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="admin-footer">
          New Admin?{" "}
          <span onClick={() => navigate("/admin-register")}>
            Create account
          </span>
        </p>

      </div>
    </div>
  );
}