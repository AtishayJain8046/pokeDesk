const RARITY_COLORS = {
  Legendary: "#f0a020",
  Rare: "#e04040",
  Uncommon: "#4ecfa0",
  Unique: "#c080f0",
};

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className="project-rarity" style={{ color: RARITY_COLORS[project.rarity] || "#fff" }}>
          {project.rarity}
        </span>
        <h3 className="project-name">{project.name}</h3>
        <p className="project-subtitle">{project.subtitle}</p>
      </div>

      <div className="project-card-body">
        <div className="project-stack">
          {project.stack.slice(0, 6).map((s) => (
            <span key={s} className="project-stack-tag">{s}</span>
          ))}
          {project.stack.length > 6 && (
            <span className="project-stack-tag">+{project.stack.length - 6}</span>
          )}
        </div>

        {project.problem && (
          <p className="project-desc"><strong>Problem:</strong> {project.problem}</p>
        )}
        <p className="project-desc"><strong>Solution:</strong> {project.solution}</p>
      </div>

      <a
        className="project-github-btn"
        href={`https://${project.github}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        View on GitHub →
      </a>
    </div>
  );
}
