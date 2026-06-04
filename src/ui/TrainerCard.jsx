import { trainer } from "../data/trainer.js";

export default function TrainerCard() {
  return (
    <div className="trainer-card">
      <div className="card-header">
        <div className="card-avatar">
          {trainer.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <h2 className="card-name">{trainer.name}</h2>
          <p className="card-subtitle">{trainer.trainerName}</p>
        </div>
      </div>

      <div className="card-section">
        <div className="card-row">
          <span className="card-label">University</span>
          <span>{trainer.university}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Degree</span>
          <span>{trainer.degree}</span>
        </div>
        <div className="card-row">
          <span className="card-label">CGPA</span>
          <span className="card-highlight">{trainer.cgpa}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Year</span>
          <span>{trainer.startYear} – {trainer.graduationYear}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Location</span>
          <span>{trainer.location}</span>
        </div>
      </div>

      <div className="card-section">
        <div className="card-row">
          <span className="card-label">Starter</span>
          <span className="card-highlight">{trainer.starter} ({trainer.starterType})</span>
        </div>
      </div>

      <div className="card-section">
        <p className="card-goal">{trainer.goal}</p>
      </div>

      <div className="card-section">
        <span className="card-label">Hobbies</span>
        <div className="card-tags">
          {trainer.hobbies.map((h) => (
            <span key={h} className="card-tag">{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
