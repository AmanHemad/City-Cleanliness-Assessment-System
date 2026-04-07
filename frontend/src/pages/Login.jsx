import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import "./Login.css";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6.1C12.4 13 17.7 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
    <path fill="#FBBC05" d="M10.4 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.8-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6.1z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-4.2-13.6-9.9l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);



export default function Login({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setError(""); setSuccess(""); setEmail("");
    setPassword(""); setName(""); setConfirmPassword(""); setShowPassword(false);
  };

  const switchMode = (newMode) => { reset(); setMode(newMode); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (mode === "register" && password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (mode === "register" && password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (mode === "login")         { await signInWithEmailAndPassword(auth, email, password); onClose(); }
      else if (mode === "register") { await createUserWithEmailAndPassword(auth, email, password); onClose(); }
      else if (mode === "reset")    { await sendPasswordResetEmail(auth, email); setSuccess("Reset link sent! Check your inbox."); }
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"       ? "No account found with this email."           :
        err.code === "auth/wrong-password"        ? "Incorrect password."                         :
        err.code === "auth/email-already-in-use"  ? "An account with this email already exists."  :
        err.code === "auth/invalid-email"         ? "Please enter a valid email address."         :
        err.code === "auth/invalid-credential"    ? "Invalid email or password."                  :
        err.message;
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) onClose();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user")
        setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  const titles = {
    login:    { heading: "Welcome back",   sub: "Sign in to continue monitoring your city" },
    register: { heading: "Join CityClean", sub: "Help make your city cleaner — it's free"  },
    reset:    { heading: "Reset password", sub: "We'll send a recovery link to your email" },
  };

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`login-modal${mode === "register" ? " login-modal--register" : ""}`}
           role="dialog" aria-modal="true" aria-label="Authentication">

        {/* Header */}
        <div className="login-header">
          <div>
            <h2 className="login-title">{titles[mode].heading}</h2>
            <p className="login-subtitle">{titles[mode].sub}</p>
          </div>
          <button className="login-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>

      

        {/* Google */}
        {mode !== "reset" && (
          <>
            <button className="login-google" onClick={handleGoogle} disabled={loading}>
              <GoogleIcon />
              {loading ? "Opening Google..." : mode === "register" ? "Sign up with Google" : "Continue with Google"}
            </button>
            <div className="login-divider"><span>or</span></div>
          </>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {mode === "register" && (
            <div className="login-field">
              <label htmlFor="login-name">Full Name</label>
              <input id="login-name" type="text" placeholder="e.g. Ravi Kumar"
                value={name} onChange={(e) => setName(e.target.value)}
                required autoComplete="name" />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email" />
          </div>

          {mode !== "reset" && (
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-password-wrap">
                <input id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Min. 6 characters" : "Enter your password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoComplete={mode === "register" ? "new-password" : "current-password"} />
                <button type="button" className="login-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {mode === "register" && (
            <div className="login-field">
              <label htmlFor="login-confirm">Confirm Password</label>
              <input id="login-confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                required autoComplete="new-password" />
            </div>
          )}

          {mode === "login" && (
            <button type="button" className="login-forgot" onClick={() => switchMode("reset")}>
              Forgot password?
            </button>
          )}

          {error   && <div className="login-error"   role="alert" ><span className="login-error-icon"  >!</span>{error}  </div>}
          {success && <div className="login-success" role="status"><span className="login-success-icon">✓</span>{success}</div>}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? <span className="login-spinner" /> :
              mode === "login"    ? "Login"             :
              mode === "register" ? "Create My Account" :
                                    "Send Reset Link"}
          </button>

          {mode === "register" && (
            <p className="login-terms">By creating an account you agree to our terms of service.</p>
          )}
        </form>

        <p className="login-switch">
          {mode === "login"    && <>New to CityClean? <span onClick={() => switchMode("register")}>Create account</span></>}
          {mode === "register" && <>Already have an account? <span onClick={() => switchMode("login")}>Login</span></>}
          {mode === "reset"    && <>Remembered it? <span onClick={() => switchMode("login")}>Back to login</span></>}
        </p>
      </div>
    </div>
  );
}