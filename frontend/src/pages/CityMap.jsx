import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

/* 🔄 Helper to recenter map dynamically */
const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 17);
  }, [center, map]);

  return null;
};

const CityMap = () => {
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([16.5104, 80.6465]); // default
  const navigate = useNavigate();

  /* 🔄 Fetch reports every 5 seconds */
  useEffect(() => {
    const fetchReports = () => {
      fetch("http://localhost:5000/api/report")
        .then((res) => res.json())
        .then((data) => {
          console.log("MAP DATA:", data);
          setReports(data);

          if (data.length > 0) {
            const latest = data[0]; // latest report
            setMapCenter([
              Number(latest.latitude),
              Number(latest.longitude),
            ]);
          }
        })
        .catch((err) => console.error(err));
    };

    fetchReports();
    const interval = setInterval(fetchReports, 5000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (condition) => {
    if (condition === "BAD") return "red";
    if (condition === "MODERATE") return "orange";
    return "green";
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 🚨 REPORT ISSUE BUTTON */}
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

      <MapContainer
        center={mapCenter}
        zoom={17}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap center={mapCenter} />

        {reports.map((report) => (
          <Circle
            key={report._id}
            center={[
              Number(report.latitude),
              Number(report.longitude),
            ]}
            radius={30}
            pathOptions={{ color: getColor(report.condition) }}
          >
            <Popup>
              <div style={{ width: "200px" }}>
                <img
                  src={report.imageBefore}
                  alt="road"
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
