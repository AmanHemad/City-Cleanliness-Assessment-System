import { useNavigate } from "react-router-dom";
import CleaningAnimation from "../Components/CleaningAnimation";
import "./Home.css";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    reports: 0, areas: 0, accuracy: 0, citizens: 0,
  });

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      setStats({
        reports: start * 12,
        areas: start * 3,
        accuracy: start,
        citizens: start * 20,
      });
      if (start === 100) clearInterval(interval);
    }, 20);
  }, []);

  return (
    <>
      <section className="hero">
        {/* Animation fills the whole hero background */}
        <CleaningAnimation />

        {/* All text content sits above animation via z-index */}
        <div className="hero-content">
          <h1>City Cleanliness Assessment System</h1>
          <p>
            Intelligent monitoring platform that analyzes urban cleanliness
            using image-based reporting and spatial intelligence.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/map")}>View Cleanliness Map</button>
            <button className="secondary" onClick={() => navigate("/report")}>
              Report Issue
            </button>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card"><h2>{stats.reports}+</h2><p>Issues Reported</p></div>
        <div className="stat-card"><h2>{stats.areas}+</h2><p>Areas Monitored</p></div>
        <div className="stat-card"><h2>{stats.accuracy}%</h2><p>ML Accuracy</p></div>
        <div className="stat-card"><h2>{stats.citizens}+</h2><p>Citizens Participating</p></div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Image-Based Reporting</h3>
          <p>Citizens upload real images of waste or sanitation issues. Our system processes these images and identifies cleanliness problems.</p>
        </div>
        <div className="feature-card">
          <h3>Location Intelligence</h3>
          <p>Each report is geo-tagged and mapped, allowing authorities to detect garbage hotspots across the city.</p>
        </div>
        <div className="feature-card">
          <h3>AI Cleanliness Scoring</h3>
          <p>Machine learning models analyze images and generate objective cleanliness scores for every location.</p>
        </div>
      </section>

      <section className="impact">
        <h2>Smart Cities Need Smart Monitoring</h2>
        <p>Traditional inspection methods are slow and inefficient. Our system enables real-time cleanliness monitoring through community reporting, AI analysis, and spatial data visualization.</p>
        <button onClick={() => navigate("/dashboard")}>Explore Cleanliness Dashboard</button>
      </section>

      <footer className="footer">
        <p>© 2026 City Cleanliness Assessment System</p>
      </footer>
    </>
  );
}

export default Home;