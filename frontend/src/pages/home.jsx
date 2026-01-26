import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <h1>City Cleanliness Assessment System</h1>
        <p>
          An intelligent urban monitoring platform that analyzes city
          cleanliness using image-based reporting and spatial data analytics.
        </p>

        <button onClick={() => navigate("/map")}>
          View City Cleanliness Map
        </button>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div>
          <h3>Image-Based Reporting</h3>
          <p>
            Citizens and authorities can report cleanliness issues using real
            images captured at ground level.
          </p>
        </div>

        <div>
          <h3>Location Intelligence</h3>
          <p>
            Every issue is mapped geographically, enabling area-wise analysis
            and hotspot identification.
          </p>
        </div>

        <div>
          <h3>Cleanliness Scoring</h3>
          <p>
            Machine learning models evaluate cleanliness severity and generate
            objective cleanliness percentages.
          </p>
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact">
        <h2>Why This System Matters</h2>
        <p>
          Manual inspections are slow and subjective. This platform enables
          data-driven decision making for urban authorities, ensuring faster
          response, transparency, and improved quality of life.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 City Cleanliness Assessment System</p>
      </footer>
    </>
  );
}

export default Home;
