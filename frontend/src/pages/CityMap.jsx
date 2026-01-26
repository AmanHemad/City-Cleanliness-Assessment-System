import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./CityMap.css";

const areaConditions = [
  {
    name: "Main Academic Block Road",
    center: [16.4453, 80.6219],
    score: 92, // GOOD
  },
  {
    name: "Library Junction",
    center: [16.4458, 80.6223],
    score: 78, // MODERATE
  },
  {
    name: "Admin Block Road",
    center: [16.4461, 80.6227],
    score: 65, // MODERATE
  },
  {
    name: "Hostel Main Road",
    center: [16.4446, 80.6225],
    score: 48, // MODERATE
  },
  {
    name: "Hostel Backside Road",
    center: [16.4441, 80.6230],
    score: 32, // BAD
  },
  {
    name: "Canteen Area Road",
    center: [16.4466, 80.6233],
    score: 20, // EXTREME BAD
  },
  {
    name: "Sports Ground Road",
    center: [16.4470, 80.6220],
    score: 85, // GOOD
  },
  {
    name: "Main Gate Road",
    center: [16.4474, 80.6215],
    score: 40, // BORDERLINE
  },
];


const getCircleStyle = (score) => {
  if (score >= 80) return { color: "#16a34a" };
  if (score >= 40) return { color: "#f59e0b" };
  return { color: "#dc2626", className: "blink" };
};

function CityMap() {
  return (
    <div className="map-page">
      <h2>Campus Road Condition Monitoring</h2>

      <MapContainer
        center={[16.4454, 80.6225]}
        zoom={15}
        className="map-container"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {areaConditions.map((area, index) => {
          const style = getCircleStyle(area.score);

          return (
            <Circle
              key={index}
              center={area.center}
              radius={60}
              pathOptions={{
                color: style.color,
                fillColor: style.color,
                fillOpacity: 0.4,
                className: style.className || "",
              }}
            >
              {/* THIS is what makes clicking work */}
              <Popup>
                <strong>{area.name}</strong>
                <br />
                Cleanliness Score: {area.score}%
                <br />
                Condition:{" "}
                {area.score >= 80
                  ? "Good"
                  : area.score >= 40
                  ? "Moderate"
                  : "Severe"}
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default CityMap;
