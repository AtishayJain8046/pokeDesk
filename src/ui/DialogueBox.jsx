import { useState, useEffect, useRef } from "react";

export default function DialogueBox({ text, isLast, onAdvance }) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  const handleClick = () => {
    if (isTyping) {
      setDisplayed(text);
      setIsTyping(false);
      indexRef.current = text.length;
    } else {
      onAdvance();
    }
  };

  return (
    <div className="dialogue-box" onClick={handleClick}>
      <p className="dialogue-text">{displayed}</p>
      {!isTyping && (
        <span className="dialogue-advance">
          {isLast ? "✕ Close" : "▼ Next"}
        </span>
      )}
    </div>
  );
}
