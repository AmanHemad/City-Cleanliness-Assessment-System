import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Login from "./Login";
import "./ReportIssue.css";

// ─── Persist pending image across login ─────────────────────────────────────
const PENDING_KEY = "cityClean_pendingReport";

async function savePendingImage(file) {
  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify({
      name: file.name,
      type: file.type,
    })
  );
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
  const [user, setUser] = useState(undefined);
  const [showLogin, setShowLogin] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = () => {
    setIsCameraOpen(true);
  };

  useEffect(() => {
    let activeStream = null;

    if (isCameraOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error(err);
          setStatus("❌ Could not access the camera. Ensure you gave permissions and are using HTTPS or localhost.");
          setIsCameraOpen(false);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const stopCamera = () => {
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          setImage(file);
          setPreview(URL.createObjectURL(file));
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

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

  console.log("Selected file:", file);

  // ✅ validate file
  if (!file.type.startsWith("image/")) {
    setStatus("❌ Please upload a valid image file.");
    return;
  }

  // ✅ normalize file (VERY IMPORTANT FIX)
  const fixedFile = new File([file], file.name, {
    type: file.type || "image/jpeg",
  });

  if (!user) {
    await savePendingImage(fixedFile);
    setShowLogin(true);
    return;
  }

  setImage(fixedFile);
  setPreview(URL.createObjectURL(fixedFile));
  setStatus("");
};

  // ── Submit ──────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  if (!image) {
    setStatus("⚠️ Please select an image first.");
    return;
  }

  if (!user) {
    await savePendingImage(image);
    setShowLogin(true);
    return;
  }

  if (!navigator.geolocation) {
    setStatus("❌ Geolocation not supported.");
    return;
  }

  setLoading(true);
  setStatus("📍 Getting location...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        setStatus("⬆️ Uploading image...");

        const formData = new FormData();
        formData.append("image", image);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        // 🔥 FIXED USERNAME LOGIC (IMPORTANT)
        const username =
          user.displayName ||
          user.email?.split("@")[0] ||
          "Anonymous";

        console.log("USER OBJECT:", user);
        console.log("USERNAME:", username);

        formData.append("username", username);
        formData.append("email", user.email || "No Email");

        const res = await fetch("http://localhost:5000/api/report", {
          method: "POST",
          body: formData,
        });

        const text = await res.text();
console.log("🔥 RAW SERVER RESPONSE:", text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  console.error("❌ BACKEND RETURNED HTML:", text);
  throw new Error("Server crashed (check backend terminal)");
}
        console.log("SERVER RESPONSE:", data);

        if (!res.ok) throw new Error("Upload failed");

        setStatus("✅ Report submitted successfully!");
        setImage(null);
        setPreview(null);
      } catch (err) {
        console.error(err);
        setStatus("❌ Upload failed.");
      }

      setLoading(false);
    },
    () => {
      setStatus("❌ Location denied.");
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
          {/* 🔥 USER BADGE */}
{preview && user && (
  <div className="reporter-name-badge">
    <div className="reporter-avatar">
      {(user.displayName || user.email || "?")
        .charAt(0)
        .toUpperCase()}
    </div>

    <div className="reporter-info">
      <p className="reporter-label">Uploaded by</p>
      <p className="reporter-name">
        {user.displayName ||
          user.email?.split("@")[0] ||
          "Anonymous"}
      </p>
    </div>
  </div>
)}

{/* EXISTING IMAGE (KEEP THIS SAME) */}
{preview && (
  <img src={preview} alt="preview" className="preview-image" />
)}
          

          <div className="upload-options">
            {!isCameraOpen ? (
              <>
                <button
                  type="button"
                  className="upload-box"
                  onClick={startCamera}
                  disabled={loading}
                >
                  <span>📸 Open Camera</span>
                </button>

                <label className="upload-box">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <span>📁 Upload from Device</span>
                </label>
              </>
            ) : (
              <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="video-preview"></video>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', width: '100%' }}>
                  <button type="button" className="upload-btn" onClick={capturePhoto}>🔴 Capture</button>
                  <button type="button" className="upload-btn" onClick={stopCamera} style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>Cancel</button>
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              </div>
            )}
          </div>

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