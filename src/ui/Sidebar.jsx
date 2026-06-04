import { useState } from "react";
import TrainerCard from "./TrainerCard.jsx";
import Pokedex from "./Pokedex.jsx";
import ExperienceTab from "./ExperienceTab.jsx";
import { trainer } from "../data/trainer.js";

const TABS = [
  { id: "trainer", label: "ID", title: "Trainer Card" },
  { id: "pokedex", label: "DEX", title: "Pokédex" },
  { id: "experience", label: "EXP", title: "Experience" },
  { id: "save", label: "SAVE", title: "Save Game" },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("trainer");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const link = document.createElement("a");
    link.href = trainer.resumePDF;
    link.download = "AtishayJain_Resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">TRAINER ATISHAY</h1>
      </div>

      <div className="sidebar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => (tab.id === "save" ? handleSave() : setActiveTab(tab.id))}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {activeTab === "trainer" && <TrainerCard />}
        {activeTab === "pokedex" && <Pokedex />}
        {activeTab === "experience" && <ExperienceTab />}
      </div>

      {saved && (
        <div className="save-toast">
          Progress saved!
        </div>
      )}
    </div>
  );
}
