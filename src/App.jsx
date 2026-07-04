import { useState } from "react";
import "./App.css";

function App() {
  const [temperature, setTemperature] = useState("");
  const [runtime, setRuntime] = useState("");
  const [vibration, setVibration] = useState("");
  const [production, setProduction] = useState("");
  const [oilLevel, setOilLevel] = useState("");
  const [report, setReport] = useState(null);

  const predictRisk = () => {

  if (
    temperature === "" ||
    runtime === "" ||
    vibration === "" ||
    oilLevel === ""
  ) {
    alert("Please fill all fields");
    return;
  }

  let score = 0;

  if (Number(temperature) > 75) score++;
  if (Number(runtime) > 800) score++;
  if (Number(vibration) > 5.5) score++;
  if (Number(oilLevel) < 40) score++;

  let risk = "";
  let healthScore = 100 - score * 25;
  let recommendation = "";

  if (score <= 1) {
    risk = "Low Risk";
    recommendation =
      "Machine is operating normally. Continue regular monitoring.";
  } else if (score <= 2) {
    risk = "Medium Risk";
    recommendation =
      "Monitor machine parameters and schedule preventive maintenance.";
  } else {
    risk = "High Risk";
    recommendation =
      "Immediate maintenance inspection is recommended.";
  }

  setReport({
    risk,
    healthScore,
    recommendation,
  });
};

  return (
    <div className="container">
      <h1> Machine Risk Detector</h1>

<p className="subtitle">
Predict machine health using operational parameters
</p>

      <input
        type="number"
        placeholder="Temperature"
        onChange={(e) => setTemperature(e.target.value)}
      />

      <input
        type="number"
        placeholder="Runtime Hours"
        onChange={(e) => setRuntime(e.target.value)}
      />

      <input
        type="number"
        placeholder="Vibration"
        onChange={(e) => setVibration(e.target.value)}
      />

      <input
        type="number"
        placeholder="Oil Level"
        onChange={(e) => setOilLevel(e.target.value)}
      />

      <button onClick={predictRisk}>
        Predict Risk
      </button>

      {report && (
  <div className={`result ${report.risk.toLowerCase().replace(" ", "-")}`}>

    <h2>Machine Health Report</h2>

    <h3>
      {report.risk === "Low Risk" && "🟢"}
      {report.risk === "Medium Risk" && "🟡"}
      {report.risk === "High Risk" && "🔴"}

      {" "}
      {report.risk}
    </h3>

    <p>
      <strong>Health Score :</strong> {report.healthScore}%
    </p>

    <p>
      {report.recommendation}
    </p>

  </div>
)}

    </div>
  );
}

export default App;