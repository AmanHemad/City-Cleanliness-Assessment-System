import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About CityClean</h1>
        <p>
          Transforming urban sanitation through community engagement and cutting-edge Artificial Intelligence.
        </p>
      </div>

      <div className="about-content">
        <div className="about-section full-width">
          <h2>🌍 How This Project Helped</h2>
          <p>
            City cleanliness has traditionally been monitored through slow, manual inspections. By introducing the City Cleanliness Assessment System, we've drastically reduced response times for urban sanitation issues by bridging the gap between citizens and municipal authorities.
          </p>
          <p>
            Our platform allows authorities to pinpoint exactly where resources are needed most. Since deployment, the system has helped municipalities resolve countless local hazards, reduced disease transmission risks from standing garbage, and empowered citizens to take direct action in their own neighborhoods. AI scoring removes human bias and prioritizes severe hazards automatically.
          </p>
        </div>

        <div className="about-section full-width">
          <h2>⚙️ How It Works</h2>
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Citizen Reporting</h3>
                <p>A citizen spots a cleanliness issue (garbage, sewage leak, etc.) and captures a photo using our platform. The location is automatically geo-tagged.</p>
              </div>
            </div>
            
            <div className="timeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>The uploaded image is instantly processed by our Machine Learning model. The model calculates a "Cleanliness Score" and severity ranking.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Admin Assignment</h3>
                <p>Municipal admins view the severity on a live City Map and assign the nearest or most appropriate contractor to handle the issue.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Resolution & Verification</h3>
                <p>The contractor resolves the issue and uploads a "Resolved Photo". The ML model verifies the cleanup, and the original reporting citizen gets to officially confirm the resolution!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
