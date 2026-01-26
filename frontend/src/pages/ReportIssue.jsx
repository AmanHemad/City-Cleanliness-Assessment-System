import { useState } from "react";

function ReportIssue() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(image, location);
    alert("Issue submitted (backend coming next)");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Report Cleanliness Issue</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Enter location / area"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReportIssue;
