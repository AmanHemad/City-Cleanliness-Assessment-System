import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  useMap
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "leaflet/dist/leaflet.css";
import "./CityMap.css"; // Added CSS import

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
  const [initialized, setInitialized] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Firebase user tracking
  const [uploadingReportId, setUploadingReportId] = useState(null); // Tracks which report is currently uploading
  const [isDarkMap, setIsDarkMap] = useState(false);

  const contractors = ["Ramesh", "Suresh", "Mahesh"];
  const navigate = useNavigate();

  // ✅ TRACK FIREBASE USER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  // ✅ ADMIN VERIFY (ONLY ONE PLACE)
  useEffect(() => {
    // If a regular user is logged in, they CANNOT have admin privileges in the UI.
    if (currentUser) {
      setIsAdmin(false);
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch("http://localhost:5000/api/admin/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) setIsAdmin(true);
        else setIsAdmin(false);
      })
      .catch(() => setIsAdmin(false));
  }, [currentUser]);

  // ✅ FETCH REPORTS
  useEffect(() => {
    const fetchReports = () => {
      fetch("http://localhost:5000/api/report")
        .then((res) => res.json())
        .then((data) => {
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

  // ✅ REFRESH MAP
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, [reports]);

  // ✅ SEARCH LOCATION
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
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ COLOR
  const getColor = (condition) => {
    if (condition === "BAD") return "red";
    if (condition === "MODERATE") return "orange";
    return "green";
  };

  // ✅ ASSIGN CONTRACTOR (ADMIN)
  const assignContractor = async (reportId) => {
    if (!selectedContractor) {
      alert("Select contractor first");
      return;
    }

    const token = localStorage.getItem("adminToken");

    await fetch("http://localhost:5000/api/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reportId,
        contractorName: selectedContractor,
      }),
    });

    alert("Assigned ✅");
  };

  // ✅ UPLOAD RESOLVED IMAGE (ADMIN)
  const uploadResolved = async (reportId, file) => {
    const token = localStorage.getItem("adminToken");
    
    setUploadingReportId(reportId); // Start loading

    const formData = new FormData();
    formData.append("image", file);
    formData.append("reportId", reportId);

    try {
      await fetch("http://localhost:5000/api/upload-resolved", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      alert("Uploaded ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to upload");
    } finally {
      setUploadingReportId(null); // End loading
    }
  };

  // ✅ RESOLVE REPORT (ADMIN)
  const resolveReport = async (reportId) => {
    const token = localStorage.getItem("adminToken");

    await fetch("http://localhost:5000/api/resolve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reportId }),
    });

    alert("Resolved ✅");
  };

  // ✅ CONFIRM RESOLUTION (USER)
  const confirmResolution = async (reportId) => {
    try {
      const res = await fetch("http://localhost:5000/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId }),
      });
      
      if (!res.ok) throw new Error("Failed to confirm");
      alert("Resolution Confirmed ✅ The issue is now closed.");
    } catch (err) {
      console.error(err);
      alert("Error confirming resolution");
    }
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
        />
        <button onClick={searchLocation}>Search</button>
      </div>

      {/* REPORT BUTTON & THEME BUTTON */}
      <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px"
      }}>
        <button
          onClick={() => setIsDarkMap(!isDarkMap)}
          style={{
            padding: "10px",
            background: isDarkMap ? "#1e293b" : "#ffffff",
            color: isDarkMap ? "#ffffff" : "#000000",
            border: "2px solid #38bdf8",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isDarkMap ? "☀️ Light Map" : "🌙 Dark Map"}
        </button>

        <button
          onClick={() => navigate("/report")}
          style={{
            padding: "10px 15px",
            background: "linear-gradient(135deg, #ef4444, #b91c1c)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(239, 68, 68, 0.4)"
          }}
        >
          🚨 Report Issue
        </button>
      </div>

      {/* MAP */}
      <div style={{ height: "100vh", width: "100%" }}>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
        >
          {isDarkMap ? (
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />
          ) : (
            <TileLayer 
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
              attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
            />
          )}

        <RecenterMap center={mapCenter} />

        {reports.map((report, index) => {
          const offset = index * 0.00003;

          return (
            <Circle
              key={report._id}
              center={[
                Number(report.latitude) + offset,
                Number(report.longitude) + offset
              ]}
              radius={40}
              pathOptions={{
                color: getColor(report.condition),
                fillColor: getColor(report.condition),
                fillOpacity: 0.3
              }}
            >
              <Popup maxWidth={450}>
                <div className="popup-container">
                  {/* HEADER */}
                  <div className="popup-header">
                    <div>
                      <h3>📍 {report.reason || "Issue Details"}</h3>
                      <div className="reporter-username">By {report.username || "Anonymous"}</div>
                    </div>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>

                  {/* IMAGES */}
                  <div className="popup-images">
                    <div className="image-row">
                      {report.imageBefore && (
                        <div className="image-card">
                          <span className="image-label">Before</span>
                          <img src={report.imageBefore} alt="Before" />
                        </div>
                      )}
                      {report.imageML && (
                        <div className="image-card">
                          <span className="image-label">AI Before</span>
                          <img src={report.imageML} alt="AI Before" />
                        </div>
                      )}
                    </div>
                    
                    {report.imageAfter && (
                      <div className="image-row">
                        <div className="image-card">
                          <span className="image-label">After</span>
                          <img src={report.imageAfter} alt="After" />
                        </div>
                        {report.resolvedML && (
                          <div className="image-card">
                            <span className="image-label">AI After</span>
                            <img src={report.resolvedML} alt="AI After" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="popup-details">
                    <p>
                      <span>Condition:</span>
                      <span className={`condition-badge ${report.condition?.toLowerCase()}`}>
                        {report.condition}
                      </span>
                    </p>
                    <p>
                      <span>ML Score:</span>
                      <span className="ml-score-badge">{report.mlScore} / 100</span>
                    </p>
                    {report.assignedContractor && (
                      <p>
                        <span>Contractor:</span>
                        <b>{report.assignedContractor}</b>
                      </p>
                    )}
                  </div>

                  {/* CONTROLS (ADMIN VS USER) */}
                  <div className="popup-actions">
                    {isAdmin ? (
                      <>
                        <p className="admin-panel-title">🛡️ Admin Controls</p>
                        
                        {!report.assignedContractor && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <select 
                              className="popup-select"
                              onChange={(e) => setSelectedContractor(e.target.value)}
                            >
                              <option value="">Select Contractor</option>
                              {contractors.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <button className="popup-btn btn-primary" onClick={() => assignContractor(report._id)}>
                              Assign
                            </button>
                          </div>
                        )}

                        {!report.imageAfter && report.assignedContractor && (
                          <div className="file-upload-wrapper">
                            <button 
                               className="popup-btn btn-outline" 
                               style={{width: '100%', opacity: uploadingReportId === report._id ? 0.7 : 1}}
                               disabled={uploadingReportId === report._id}
                            >
                              {uploadingReportId === report._id 
                                ? "⏳ Uploading & Analyzing..." 
                                : "📸 Upload Resolved Photo"}
                            </button>
                            <input
                              type="file"
                              disabled={uploadingReportId === report._id}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert("❌ Image is too large! Please upload a photo under 5MB.");
                                    return;
                                  }
                                  uploadResolved(report._id, file);
                                }
                              }}
                            />
                          </div>
                        )}

                        {/* Admin Fallback to bypass user confirmation if needed */}
                        {report.imageAfter && report.status !== "RESOLVED" && (
                          <button className="popup-btn btn-success" onClick={() => resolveReport(report._id)}>
                            ✅ Mark Resolved (Override)
                          </button>
                        )}
                        
                        {report.status === "RESOLVED" && (
                          <div className="waiting-message" style={{color: '#15803d', background: '#dcfce7'}}>
                            ✔ Resolution Finalized
                          </div>
                        )}
                      </>
                    ) : ( 
                      /* REGULAR USER / REPORTER VIEW */
                      <>
                        {report.status !== "RESOLVED" && report.imageAfter && (
                          (currentUser?.email && report.email && currentUser.email === report.email) ? (
                            <button className="popup-btn btn-success" onClick={() => confirmResolution(report._id)}>
                              ✅ Confirm Issue Resolved
                            </button>
                          ) : (
                            <div className="waiting-message">
                              ⏳ Waiting for {report.username || "reporter"} to confirm resolution...
                            </div>
                          )
                        )}
                        
                        {report.status === "RESOLVED" && (
                          <div className="waiting-message" style={{color: '#15803d', background: '#dcfce7', fontWeight: '500'}}>
                            🎉 Issue Successfully Resolved and Closed!
                          </div>
                        )}

                        {/* If user is not admin, not resolved, and no imageAfter, just info */}
                        {report.status !== "RESOLVED" && !report.imageAfter && (
                           <div className="waiting-message">
                             {report.assignedContractor 
                               ? `Contractor ${report.assignedContractor} is working on it.` 
                               : "Pending contractor assignment."}
                           </div>
                        )}
                      </>
                    )}
                  </div>

                </div>
              </Popup>
            </Circle>
          );
        })}
        </MapContainer>
      </div>
    </div>
  );
};

export default CityMap;