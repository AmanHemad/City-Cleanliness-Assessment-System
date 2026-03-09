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

function Dashboard(){

const reportsData={
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[
{
label:"Reports",
data:[12,18,10,15,20,17,24],
borderColor:"#38bdf8",
backgroundColor:"rgba(56,189,248,0.15)",
tension:0.4,
fill:true
}
]
};

const issueData={
labels:["Garbage","Sewage","Plastic","Water"],
datasets:[
{
data:[40,25,20,15],
backgroundColor:["#ef4444","#f59e0b","#3b82f6","#22c55e"]
}
]
};

const cleanCities={
labels:["Ward 5","Ward 3","Ward 2","Ward 8","Ward 6"],
datasets:[
{
label:"Clean %",
data:[92,88,86,82,80],
backgroundColor:"#3b82f6"
}
]
};

const dirtyCities={
labels:["Ward 4","Ward 7","Ward 1","Ward 9","Ward 10"],
datasets:[
{
label:"Pollution %",
data:[65,60,55,52,50],
backgroundColor:"#ef4444"
}
]
};

return(

<div className="dashboard">

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

{/* KPI */}

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
<Line data={reportsData}/>
</div>

<div className="chart-card">
<h3>Issue Distribution</h3>
<Pie data={issueData}/>
</div>

</div>

<div className="chart-grid">

<div className="chart-card">
<h3>Top Clean Areas</h3>
<Bar data={cleanCities}/>
</div>

<div className="chart-card">
<h3>Top Dirty Areas</h3>
<Bar data={dirtyCities}/>
</div>

</div>

</div>

);

}

export default Dashboard;