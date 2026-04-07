import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Login from "./Login";
import "./ReportIssue.css";

// ─── Persist pending image across login ─────────────────────────────────────
const PENDING_KEY = "cityClean_pendingReport";

async function savePendingImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ name: file.name, type: file.type, data: reader.result })
      );
      resolve();
    };
    reader.readAsDataURL(file);
  });
}

function loadPendingImage() {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const { name, type, data } = JSON.parse(raw);
    const bytes = atob(data.split(",")[1]);
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) ia[i] = bytes.charCodeAt(i);
    return new File([ab], name, { type });
  } catch {
    return null;
  }
}

function clearPendingImage() {
  localStorage.removeItem(PENDING_KEY);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ReportIssue() {
  const [user, setUser]           = useState(undefined);
  const [showLogin, setShowLogin] = useState(false);
  const [image, setImage]         = useState(null);
  const [preview, setPreview]     = useState(null);
  const [status, setStatus]       = useState("");
  const [loading, setLoading]     = useState(false);
  const fileInputRef              = useRef(null);

  // ── Watch auth state ────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      if (firebaseUser) {
        const pending = loadPendingImage();
        if (pending) {
          setImage(pending);
          setPreview(URL.createObjectURL(pending));
          clearPendingImage();
          setStatus("✅ Image restored — click Submit to finish your report.");
        }
      }
    });
    return unsub;
  }, []);

  // ── File selection ──────────────────────────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!user) {
      await savePendingImage(file);
      setShowLogin(true);
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setStatus("");
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!image) { setStatus("⚠️ Please select an image first."); return; }
    if (!user)  { await savePendingImage(image); setShowLogin(true); return; }
    if (!navigator.geolocation) {
      setStatus("❌ Geolocation not supported by your browser.");
      return;
    }

    setLoading(true);
    setStatus("📍 Getting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // ── Send directly to your Cloudinary/Express backend ──────────
          setStatus("⬆️ Uploading image...");

          const formData = new FormData();
          formData.append("image", image);
          formData.append("latitude", latitude);
          formData.append("longitude", longitude);

          const res = await fetch("http://localhost:5000/api/report", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(`Server error: ${res.status}`);

          await res.json(); // report saved to MongoDB with Gemini score

          setStatus("✅ Report submitted successfully! Thank you.");
          setImage(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
          console.error(err);
          setStatus("❌ Upload failed. Please try again.");
        }
        setLoading(false);
      },
      () => {
        setStatus("❌ Location permission denied.");
        setLoading(false);
      }
    );
  };

  if (user === undefined) return null;

  return (
    <>
      <div className="report-container">
        <div className="report-card">
          <h2>Report Road / Cleanliness Issue</h2>
          <p className="report-description">
            Help keep your city clean. Upload an image of the issue and our
            system will automatically record your location.
          </p>

          {!user && (
            <div className="report-auth-notice">
              🔒 You must be{" "}
              <span onClick={() => setShowLogin(true)}>logged in</span>{" "}
              to submit a report.
            </div>
          )}

          {preview && (
            <img src={preview} alt="preview" className="preview-image" />
          )}

          <label className="upload-box">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
            <span>📷 {image ? "Change Image" : "Select Image"}</span>
          </label>

          <button
            className="upload-btn"
            onClick={handleSubmit}
            disabled={loading || !image}
          >
            {loading ? "Submitting…" : "Submit Report"}
          </button>

          {status && <p className="status">{status}</p>}
        </div>
      </div>

      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}