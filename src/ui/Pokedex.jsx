import { useState } from "react";
import { skills } from "../data/skills.js";

const TYPE_COLORS = {
  Normal: "#A8A878",
  Fire: "#F08030",
  Water: "#6890F0",
  Electric: "#F8D030",
  Psychic: "#F85888",
  Fighting: "#C03028",
  Rock: "#B8A038",
};

export default function Pokedex() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="pokedex">
      <h3 className="pokedex-title">POKÉDEX — Skills</h3>
      <div className="pokedex-list">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`pokedex-entry ${expanded === skill.id ? "expanded" : ""}`}
            onClick={() => setExpanded(expanded === skill.id ? null : skill.id)}
          >
            <div className="entry-header">
              <span
                className="entry-type-dot"
                style={{ backgroundColor: TYPE_COLORS[skill.type] || "#888" }}
              />
              <span className="entry-name">{skill.name}</span>
              <span className="entry-pokemon">{skill.pokemon}</span>
            </div>

            <div className="entry-level-bar">
              <div
                className="entry-level-fill"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: TYPE_COLORS[skill.type] || "#4ecfa0",
                }}
              />
              <span className="entry-level-text">Lv.{skill.level}</span>
            </div>

            {expanded === skill.id && (
              <div className="entry-details">
                <span className="entry-type-badge" style={{ backgroundColor: TYPE_COLORS[skill.type] || "#888" }}>
                  {skill.type}
                </span>
                <p className="entry-desc">{skill.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
