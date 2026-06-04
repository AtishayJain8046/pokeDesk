import { useState } from "react";
import { trainer } from "../data/trainer.js";

export default function SnorlaxModal({ phase, onPlayFlute, onClose }) {
  const [fluteAnimating, setFluteAnimating] = useState(false);

  const handleFlute = () => {
    setFluteAnimating(true);
    setTimeout(() => {
      onPlayFlute();
    }, 1200);
  };

  if (phase === "blocked") {
    return (
      <div className="snorlax-modal">
        <div className="snorlax-modal-content">
          <p className="snorlax-text">
            A huge Snorlax is blocking the path south!
          </p>
          <p className="snorlax-subtext">
            Maybe the Poké Flute would wake it...
          </p>
          {!fluteAnimating ? (
            <button className="flute-btn" onClick={handleFlute}>
              <span className="flute-icon">♪</span>
              Play Poké Flute
            </button>
          ) : (
            <div className="flute-playing">
              <span className="flute-notes">♪ ♫ ♪ ♫ ♪</span>
              <p>Playing Poké Flute...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "awoke") {
    return (
      <div className="snorlax-modal">
        <div className="snorlax-modal-content contact-modal">
          <h3 className="contact-title">The path is open!</h3>
          <p className="contact-subtitle">Connect with Trainer Atishay</p>

          <div className="contact-links">
            <a
              className="contact-link linkedin"
              href={`https://${trainer.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">in</span>
              LinkedIn
            </a>
            <a
              className="contact-link github"
              href={`https://${trainer.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">{"</>"}</span>
              GitHub
            </a>
            <a
              className="contact-link email"
              href={`mailto:${trainer.email}`}
            >
              <span className="contact-icon">@</span>
              {trainer.email}
            </a>
          </div>

          <a
            className="save-game-btn"
            href={trainer.resumePDF}
            download="AtishayJain_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="save-icon">↓</span>
            Save Game (Download Resume)
          </a>

          <button className="close-modal-btn" onClick={onClose}>
            Continue exploring →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
