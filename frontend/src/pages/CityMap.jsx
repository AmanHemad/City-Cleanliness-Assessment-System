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

  /* Fetch reports every 5 seconds */
  useEffect(() => {
    const fetchReports = () => {
      fetch("http://localhost:5000/api/report")
        .then((res) => res.json())
        .then((data) => {
          setReports(data);

          // Only center map once on first load
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

  /* Search location */
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

    setBoundary(null); // photon usually gives point only
  } catch (err) {
    console.error(err);
  }
};
  /* Circle color */
  const getColor = (condition) => {
    if (condition === "BAD") return "red";
    if (condition === "MODERATE") return "orange";
    return "green";
  };

  return (
    <div style={{ position: "relative" }}>

      {/* SEARCH BAR */}
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
  placeholder="Search city, area, street..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") searchLocation();
  }}
  style={{
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "240px"
  }}
/>

        <button
          onClick={searchLocation}
          style={{
            padding: "8px 12px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {/* REPORT BUTTON */}
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
          fontWeight: "bold"
        }}
      >
        🚨 Report an Issue
      </button>

      {/* MAP */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap center={mapCenter} />

        {/* SEARCH BOUNDARY */}
        {boundary && (
          <GeoJSON
            data={boundary}
            style={{
              color: "#1976d2",
              weight: 3,
              dashArray: "6 6",
              fillOpacity: 0.05
            }}
          />
        )}

        {/* REPORT CIRCLES */}
        {reports.map((report) => (
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
              <div style={{ width: "200px" }}>
                <img
                  src={report.imageBefore}
                  alt="road"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "8px"
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