import { useState } from "react";
import "./ReportIssue.css";

function ReportIssue() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setStatus("📍 Getting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const formData = new FormData();
        formData.append("image", image);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        setStatus("⬆ Uploading report...");

        try {
          await fetch("http://localhost:5000/api/report", {
            method: "POST",
            body: formData,
          });

          setStatus("✅ Report uploaded successfully!");
          setImage(null);
          setPreview(null);
        } catch (err) {
          setStatus("❌ Upload failed");
        }
      },
      () => {
        alert("Location permission denied");
        setStatus("");
      }
    );
  };

  return (
    <div className="report-container">

      <div className="report-card">

        <h2>Report Road / Cleanliness Issue</h2>

        <p className="report-description">
          Help keep your city clean. Upload an image of the issue and our
          system will automatically record the location.
        </p>

        {/* IMAGE PREVIEW */}

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="preview-image"
          />
        )}

        {/* FILE INPUT */}

        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <span>📷 Select Image</span>
        </label>

        {/* BUTTON */}

        <button className="upload-btn" onClick={handleSubmit}>
          Submit Report
        </button>

        {/* STATUS */}

        {status && <p className="status">{status}</p>}

      </div>

    </div>
  );
}

export default ReportIssue;