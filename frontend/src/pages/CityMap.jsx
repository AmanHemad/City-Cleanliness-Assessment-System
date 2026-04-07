import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  useMap,
  GeoJSON
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Recenter helper */
const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
};

const CityMap = () => {
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([16.5104, 80.6465]);
  const [search, setSearch] = useState("");
  const [boundary, setBoundary] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const navigate = useNavigate();

  /* Fetch reports */
  useEffect(() => {
    const fetchReports = () => {
      fetch("http://localhost:5000/api/report")
        .then((res) => res.json())
        .then((data) => {
          console.log("REPORT DATA:", data); // 🔥 DEBUG

          setReports(data);

          if (!initialized && data.length > 0) {
            const latest = data[0];
            setMapCenter([
              Number(latest.latitude),
              Number(latest.longitude)
            ]);
            setInitialized(true);
          }
        })
        .catch((err) => console.error(err));
    };

    fetchReports();
    const interval = setInterval(fetchReports, 5000);

    return () => clearInterval(interval);
  }, [initialized]);

  /* 🔥 FORCE LEAFLET REFRESH AFTER DATA LOAD */
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, [reports]);

  /* Search */
  const searchLocation = async () => {
    if (!search) return;

    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${search}&limit=1`
      );

      const data = await res.json();

      if (!data.features.length) {
        alert("Location not found");
        return;
      }

      const place = data.features[0];

      const lat = place.geometry.coordinates[1];
      const lon = place.geometry.coordinates[0];

      setMapCenter([lat, lon]);
      setBoundary(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* Color */
  const getColor = (condition) => {
    if (condition === "BAD") return "red";
    if (condition === "MODERATE") return "orange";
    return "green";
  };

  return (
    <div style={{ position: "relative" }}>
      {/* SEARCH */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px"
        }}
      >
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button onClick={searchLocation}>Search</button>
      </div>

      {/* REPORT BUTTON */}
      <button
        onClick={() => navigate("/report")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}
      >
        🚨 Report
      </button>

      {/* MAP */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap center={mapCenter} />

        {/* REPORTS */}
        {reports.map((report) => {
          console.log("IMAGE URL:", report.imageBefore); // 🔥 DEBUG

          return (
            <Circle
              key={report._id}
              center={[
                Number(report.latitude),
                Number(report.longitude)
              ]}
              radius={30}
              pathOptions={{ color: getColor(report.condition) }}
            >
              <Popup>
  <div style={{ width: "220px", minHeight: "200px" }}>
    
    {report.imageBefore && (
      <img
        src={report.imageBefore}
        alt="road"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/200";
        }}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "8px"
        }}
      />
    )}

    {/* 🔥 NEW */}
    <p><b>👤 Uploaded by:</b> {report.username || "Anonymous"}</p>

    <p><b>Status:</b> {report.status}</p>
    <p><b>Condition:</b> {report.condition}</p>
    <p><b>Score:</b> {report.mlScore}</p>
    <p><b>Reason:</b> {report.reason}</p>
  </div>
</Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CityMap;