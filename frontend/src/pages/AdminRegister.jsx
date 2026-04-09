import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // reuse SAME CSS

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    adminCode: ""   // ✅ added
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ extra validation (optional but good)
    if (!form.email || !form.password || !form.adminCode) {
      alert("All fields are required ❌");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/admin/register", form);

      alert("Admin Registered Successfully ✅");
      navigate("/admin-login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-card">

        <h1 className="admin-title">Create Admin</h1>
        <p className="admin-subtitle">
          Register to manage your city system
        </p>

        <form onSubmit={handleRegister}>

          {/* Email */}
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="admin@example.com"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
          />

          {/* ✅ NEW: Admin Code */}
          <label>Admin Secret Code</label>
          <input
            type="text"
            name="adminCode"
            placeholder="Enter admin code"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="admin-footer">
          Already Admin?{" "}
          <span onClick={() => navigate("/admin-login")}>
            Login here
          </span>
        </p>

      </div>
    </div>
  );
}