import React, { useState } from "react";
import FlameDetection from "./components/FlameDetection";
import GassDetection from "./components/GassDetection";
import MachineTemperatureDetection from "./components/MachineTemperatureDetection";
import RoomHumidityDetection from "./components/RoomHumidityDetection";
import RoomTemperatureDetection from "./components/RoomTemperatureDetection";

const App = () => {
  const [activeTab, setActiveTab] = useState("GassSensor");

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="container">
      <h1>INDUSTRIAL PARAMETER MONITORING SYSTEM</h1>
      {/* switching tabs */}
      <div className="switch-tabs">
        {/* gass sensor  */}
        <button
          className={`tab ${activeTab === "GassSensor" ? "active" : ""}`}
          onClick={() => showTab("GassSensor")}
        >
          Gass Detection
        </button>
        <button
          className={`tab ${activeTab === "FlameSensor" ? "active" : ""}`}
          onClick={() => showTab("FlameSensor")}
        >
          Flame Detection
        </button>
        <button
          className={`tab ${
            activeTab === "Dst11Sensor_Temperature" ? "active" : ""
          }`}
          onClick={() => showTab("Dst11Sensor_Temperature")}
        >
          Room Temperature Detection
        </button>
        <button
          className={`tab ${
            activeTab === "Dst11Sensor_Humidity" ? "active" : ""
          }`}
          onClick={() => showTab("Dst11Sensor_Humidity")}
        >
          Room Humidity Detection
        </button>
        <button
          className={`tab ${activeTab === "TemperatureSensor" ? "active" : ""}`}
          onClick={() => showTab("TemperatureSensor")}
        >
          Machine Temperature Detection
        </button>
      </div>

      {/* contents */}
      <div
        id="GassSensor"
        className={`container-content${
          activeTab === "GassSensor" ? "active" : ""
        }`}
      >
        <h2>Gass Detection</h2>
        <GassDetection />
      </div>

      <div
        id="FlameSensor"
        className={`container-content${
          activeTab === "FlameSensor" ? "active" : ""
        }`}
      >
        <h2>Flame Detection</h2>
        <FlameDetection />
      </div>

      <div
        id="Dst11Sensor_Temperature"
        className={`container-content${
          activeTab === "Dst11Sensor_Temperature" ? "active" : ""
        }`}
      >
        <h2>Room Temperature Detection</h2>
        <RoomTemperatureDetection />
      </div>

      <div
        id="Dst11Sensor_Humidity"
        className={`container-content${
          activeTab === "Dst11Sensor_Humidity" ? "active" : ""
        }`}
      >
        <h2>Room Humidity Detection</h2>
        <RoomHumidityDetection />
      </div>

      <div
        id="TemperatureSensor"
        className={`container-content${
          activeTab === "TemperatureSensor" ? "active" : ""
        }`}
      >
        <h2>Machine Temperature Detection</h2>
        <MachineTemperatureDetection />
      </div>
    </div>
  );
};

export default App;
