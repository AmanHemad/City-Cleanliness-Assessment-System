import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const CityMap = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchReports = () => {
    fetch("http://localhost:5000/api/reports")
      .then(res => res.json())
      .then(data => setReports(data));
  };

  fetchReports();
  const interval = setInterval(fetchReports, 5000); // every 5 sec

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  const center =
    reports.length > 0
      ? [reports[0].latitude, reports[0].longitude]
      : [16.5104, 80.6465];

  const getColor = (condition) => {
    if (condition === "BAD") return "red";
    if (condition === "MODERATE") return "orange";
    return "green";
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 🔴 REPORT ISSUE BUTTON */}
      <button
        onClick={() => navigate("/report")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 16px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🚨 Report an Issue
      </button>

      <MapContainer center={center} zoom={15} style={{ height: "100vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {reports.map((report) => (
          <Circle
            key={report._id}
            center={[report.latitude, report.longitude]}
            radius={30}
            pathOptions={{ color: getColor(report.condition) }}
          >
            <Popup>
              <div style={{ width: "200px" }}>
                <img
                  src={`http://localhost:5000/uploads/${report.imageBefore}`}
                  alt="Issue"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
                <p><b>Status:</b> {report.status}</p>
                <p><b>Condition:</b> {report.condition}</p>
                <p><b>Score:</b> {report.mlScore}</p>
                <p><b>Reason:</b> {report.reason}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default CityMap;
