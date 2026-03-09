import { useState, useEffect } from "react";
import "./Dashboard.css";

import { Line, Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {

  const [theme,setTheme] = useState("light");

  useEffect(()=>{
    document.body.setAttribute("data-theme",theme);
  },[theme]);

  const toggleTheme = ()=>{
    setTheme(theme==="light" ? "dark" : "light");
  };

  /* =======================
      LINE CHART
  ======================= */

  const reportsData = {
    labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets:[
      {
        label:"Reports",
        data:[12,18,10,15,20,17,24],
        borderColor:"#6366f1",

        backgroundColor:(context)=>{
          const {ctx,chartArea} = context.chart;
          if(!chartArea) return;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0,"rgba(99,102,241,0.9)");
          gradient.addColorStop(0.5,"rgba(59,130,246,0.4)");
          gradient.addColorStop(1,"rgba(14,165,233,0.05)");

          return gradient;
        },

        fill:true,
        tension:0.4,
        borderWidth:3
      }
    ]
  };

  /* =======================
      PIE CHART
  ======================= */

  const issueData = {
    labels:["Garbage","Sewage","Plastic","Water"],
    datasets:[
      {
        data:[40,25,20,15],

        backgroundColor:(context)=>{

          const ctx=context.chart.ctx;

          const g1=ctx.createLinearGradient(0,0,200,200);
          g1.addColorStop(0,"#ff7a7a");
          g1.addColorStop(1,"#ff2d2d");

          const g2=ctx.createLinearGradient(0,0,200,200);
          g2.addColorStop(0,"#ffc371");
          g2.addColorStop(1,"#ff7b00");

          const g3=ctx.createLinearGradient(0,0,200,200);
          g3.addColorStop(0,"#60a5fa");
          g3.addColorStop(1,"#2563eb");

          const g4=ctx.createLinearGradient(0,0,200,200);
          g4.addColorStop(0,"#4ade80");
          g4.addColorStop(1,"#16a34a");

          return [g1,g2,g3,g4];
        }
      }
    ]
  };

  /* =======================
      CLEAN AREAS
  ======================= */

  const cleanCities={
    labels:["Ward 5","Ward 3","Ward 2","Ward 8","Ward 6"],
    datasets:[
      {
        label:"Clean %",
        data:[92,88,86,82,80],

        backgroundColor:(context)=>{

          const {ctx,chartArea}=context.chart;
          if(!chartArea) return;

          const gradient=ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0,"#34d399");
          gradient.addColorStop(1,"#059669");

          return gradient;
        },

        borderRadius:8
      }
    ]
  };

  /* =======================
      DIRTY AREAS
  ======================= */

  const dirtyCities={
    labels:["Ward 4","Ward 7","Ward 1","Ward 9","Ward 10"],
    datasets:[
      {
        label:"Pollution %",
        data:[65,60,55,52,50],

        backgroundColor:(context)=>{

          const {ctx,chartArea}=context.chart;
          if(!chartArea) return;

          const gradient=ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0,"#fb7185");
          gradient.addColorStop(1,"#e11d48");

          return gradient;
        },

        borderRadius:8
      }
    ]
  };

  const options={responsive:true};

  return(

    <div className="dashboard">

      {/* THEME TOGGLE */}

      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme==="light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* TITLE */}

      <h1 className="dashboard-title">
        City Cleanliness Dashboard
      </h1>

      {/* CLEANEST AREA */}

      <div className="top-card">

        <div className="top-icon">🏆</div>

        <div>
          <h3>Cleanest Area</h3>
          <h2>Ward 5</h2>
          <p>Highest cleanliness score based on recent reports.</p>
        </div>

      </div>

      {/* KPI CARDS */}

      <div className="kpi-grid">

        <div className="kpi-card">
          <span>📊</span>
          <h4>Total Reports</h4>
          <p>1284</p>
        </div>

        <div className="kpi-card">
          <span>🧹</span>
          <h4>Clean Areas</h4>
          <p>78%</p>
        </div>

        <div className="kpi-card">
          <span>⚠️</span>
          <h4>Dirty Areas</h4>
          <p>22%</p>
        </div>

        <div className="kpi-card">
          <span>🤖</span>
          <h4>AI Accuracy</h4>
          <p>92%</p>
        </div>

      </div>

      {/* CHARTS */}

      <div className="chart-grid">

        <div className="chart-card">
          <h3>Reports Over Time</h3>
          <Line data={reportsData} options={options}/>
        </div>

        <div className="chart-card">
          <h3>Issue Distribution</h3>
          <Pie data={issueData} options={options}/>
        </div>

      </div>

      <div className="chart-grid">

        <div className="chart-card">
          <h3>Top Clean Areas</h3>
          <Bar data={cleanCities} options={options}/>
        </div>

        <div className="chart-card">
          <h3>Top Dirty Areas</h3>
          <Bar data={dirtyCities} options={options}/>
        </div>

      </div>

    </div>

  );
}

export default Dashboard;