import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import "./Navbar.css";

export default function Navbar({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "User";
  const displayEmail = user?.email ?? "";

  const navItems = [
    { label: "Home", path: "/" },
    { label: "City Map", path: "/map" },
    { label: "Dash Board", path: "/dashboard" },
    { label: "Report Issue", path: "/report" },
    { label: "About Us", path: "/about"}
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => navigate("/")}>
          CityClean
        </div>

        <div className="nav-right">
          {/* Navigation Links */}
          <ul className="nav-links">
            {navItems.map(({ label, path }) => (
              <li
                key={path}
                className={location.pathname === path ? "active" : ""}
                onClick={() => navigate(path)}
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Right Side Buttons */}
          <div style={{ display: "flex", alignItems: "center" }}>
            
            {/* Login OR User */}
            {user ? (
              <div className="nav-user-wrapper" ref={dropdownRef}>
                <div
                  className="nav-user-trigger"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="nav-user-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="nav-user-avatar">{initials}</div>
                  )}
                  <span className="nav-username">{displayName}</span>
                  <span className="nav-chevron">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={displayName}
                          className="nav-dropdown-avatar-img"
                        />
                      ) : (
                        <div className="nav-dropdown-avatar">
                          {initials}
                        </div>
                      )}
                      <div className="nav-dropdown-info">
                        <span className="nav-dropdown-name">
                          {displayName}
                        </span>
                        <span className="nav-dropdown-email">
                          {displayEmail}
                        </span>
                      </div>
                    </div>

                    <div className="nav-dropdown-divider" />

                    <button
                      className="nav-dropdown-item"
                      onClick={() => {
                        navigate("/dashboard");
                        setDropdownOpen(false);
                      }}
                    >
                      👤 My Account
                    </button>

                    <div className="nav-dropdown-divider" />

                    <button
                      className="nav-dropdown-item nav-dropdown-logout"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="nav-login-btn"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </button>
            )}

            {/* ✅ ADMIN BUTTONS (Hide completely if a normal user is logged in) */}
            {!user && (
              <>
                {localStorage.getItem("adminToken") ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="nav-admin-btn"
                      style={{ background: "#4f46e5", color: "white" }}
                      onClick={() => navigate("/admin-dashboard")}
                    >
                      Admin Panel
                    </button>
                    <button
                      className="nav-admin-btn"
                      style={{ background: "#ef4444", color: "white", padding: "6px 12px" }}
                      onClick={() => {
                        localStorage.removeItem("adminToken");
                        window.location.reload();
                      }}
                    >
                      Admin Logout
                    </button>
                  </div>
                ) : (
                  <button
                    className="nav-admin-btn"
                    onClick={() => navigate("/admin-login")}
                  >
                    Admin Login
                  </button>
                )}
              </>
            )}

          </div>
        </div>
      </nav>

      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}