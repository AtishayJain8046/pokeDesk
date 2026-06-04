import { experience } from "../data/experience.js";

export default function ExperienceTab() {
  return (
    <div className="experience-tab">
      <h3 className="exp-title">EXPERIENCE</h3>
      <div className="exp-timeline">
        {experience.map((exp) => (
          <div key={exp.id} className={`exp-card ${exp.status === "onboarding" ? "onboarding" : ""}`}>
            <div className="exp-header">
              <h4 className="exp-org">{exp.org}</h4>
              <span className="exp-period">{exp.period}</span>
            </div>
            <div className="exp-role">
              {exp.role}
              {exp.status === "onboarding" && <span className="exp-badge">ONBOARDING</span>}
            </div>
            <div className="exp-location">{exp.location}</div>
            <ul className="exp-points">
              {exp.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
