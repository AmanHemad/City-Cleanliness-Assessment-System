import { MapContainer, TileLayer, Circle } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./CityMap.css";

function CityMap() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
    
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="map-page">
      {/* 🔹 HEADER + REPORT BUTTON (HERE) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2>Campus Cleanliness Map</h2>

        <button
          onClick={() => navigate("/report")}
          style={{
            padding: "10px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Report an Issue
        </button>
      </div>

      {/* 🔹 MAP STARTS HERE */}
      <MapContainer
         center={[16.5104, 80.6465]}
        zoom={17}
        className="map-container"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((item, i) => (
          <Circle
            key={i}
            center={[item.latitude, item.longitude]}
            radius={60}
            pathOptions={{
              color:
                item.mlScore >= 80
                  ? "green"
                  : item.mlScore >= 40
                  ? "orange"
                  : "red",
              fillOpacity: 0.4,
              className: item.mlScore < 40 ? "blink" : "",
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default CityMap;
