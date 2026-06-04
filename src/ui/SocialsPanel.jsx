import { trainer } from "../data/trainer.js";

const socials = [
  {
    label: "LinkedIn",
    url: `https://${trainer.linkedin}`,
    color: "#0a66c2",
    icon: "in",
  },
  {
    label: "GitHub",
    url: `https://${trainer.github}`,
    color: "#e8e8e8",
    icon: "</>",
  },
  {
    label: "Email",
    url: `mailto:${trainer.email}`,
    color: "#4ecfa0",
    icon: "@",
  },
  {
    label: "Resume",
    url: trainer.resumePDF,
    color: "#f0a020",
    icon: "↓",
    download: true,
  },
];

export default function SocialsPanel() {
  return (
    <div className="socials-panel">
      <h3 className="socials-title">CONNECT WITH ATISHAY</h3>
      <div className="socials-grid">
        {socials.map((s) => (
          <a
            key={s.label}
            className="social-link"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            download={s.download ? "AtishayJain_Resume.pdf" : undefined}
            style={{ borderColor: s.color }}
          >
            <span className="social-icon" style={{ backgroundColor: s.color }}>
              {s.icon}
            </span>
            <span className="social-label">{s.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
