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
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);
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
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
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
            
            {/* If USER is logged in */}
            {user && (
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
            )}

            {/* If NO USER and NO ADMIN are logged in */}
            {!user && !localStorage.getItem("adminToken") && (
              <div className="nav-user-wrapper" ref={loginDropdownRef}>
                <button
                  className="nav-login-btn"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  Login <span style={{ fontSize: "10px" }}>{loginDropdownOpen ? "▲" : "▼"}</span>
                </button>

                {loginDropdownOpen && (
                  <div className="nav-dropdown" style={{ minWidth: "180px", right: 0 }}>
                    <button
                      className="nav-dropdown-item"
                      onClick={() => { setLoginOpen(true); setLoginDropdownOpen(false); }}
                    >
                      🚶‍♂️ Citizen Login
                    </button>
                    <div className="nav-dropdown-divider" />
                    <button
                      className="nav-dropdown-item"
                      onClick={() => { navigate("/admin-login"); setLoginDropdownOpen(false); }}
                    >
                      🛡️ Admin Access
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* If ADMIN is logged in but NO USER */}
            {!user && localStorage.getItem("adminToken") && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="nav-admin-btn"
                  style={{ background: "#4f46e5", color: "white" }}
                  onClick={() => navigate("/admin-dashboard")}
                >
                  ⚙️ Admin Panel
                </button>
                <button
                  className="nav-admin-btn"
                  style={{ background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5" }}
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    window.location.reload();
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}