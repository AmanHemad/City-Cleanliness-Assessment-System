import { useState } from "react";

function ReportIssue() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const formData = new FormData();
        formData.append("image", image);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        setStatus("Uploading data...");
        
        await fetch("http://localhost:5000/api/report", {

          method: "POST",
          body: formData,
        });

        setStatus("Uploaded successfully ✅");
      },
      () => {
        alert("Location permission denied");
        setStatus("");
      }
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Report Road / Cleanliness Issue</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <br /><br />

      <button onClick={handleSubmit}>Upload</button>
      <p>{status}</p>
    </div>
  );
}

export default ReportIssue;
