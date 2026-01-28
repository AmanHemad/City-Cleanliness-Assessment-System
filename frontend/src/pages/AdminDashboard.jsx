import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await fetch("http://localhost:5000/api/reports");
    const data = await res.json();
    setReports(data.filter(r => r.status === "OPEN"));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveIssue = async (id, image) => {
    const formData = new FormData();
    formData.append("image", image);

    await fetch(`http://localhost:5000/api/report/${id}/resolve`, {
      method: "POST",
      body: formData,
    });

    fetchReports(); // refresh
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛠 Admin Dashboard</h2>

      {reports.map((r) => (
        <div key={r._id} style={{ marginBottom: "20px" }}>
          <p><b>Reason:</b> {r.reason}</p>
          <img
            src={`http://localhost:5000/uploads/${r.imageBefore}`}
            alt="Before"
            width="200"
          />
          <br />
          <input
            type="file"
            onChange={(e) => resolveIssue(r._id, e.target.files[0])}
          />
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
