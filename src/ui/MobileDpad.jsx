import { useRef, useCallback } from "react";

export default function MobileDpad({ gameRef }) {
  const activeKeys = useRef(new Set());

  const pressKey = useCallback((keyCode) => {
    if (activeKeys.current.has(keyCode)) return;
    activeKeys.current.add(keyCode);
    window.dispatchEvent(new KeyboardEvent("keydown", { keyCode, bubbles: true }));
  }, []);

  const releaseKey = useCallback((keyCode) => {
    activeKeys.current.delete(keyCode);
    window.dispatchEvent(new KeyboardEvent("keyup", { keyCode, bubbles: true }));
  }, []);

  const releaseAll = useCallback(() => {
    for (const k of activeKeys.current) {
      window.dispatchEvent(new KeyboardEvent("keyup", { keyCode: k, bubbles: true }));
    }
    activeKeys.current.clear();
  }, []);

  const handleAction = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 32, key: " ", code: "Space", bubbles: true }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 32, key: " ", code: "Space", bubbles: true }));
    }, 100);
  };

  const btn = (label, keyCode, className) => (
    <button
      className={`dpad-btn ${className}`}
      onTouchStart={(e) => { e.preventDefault(); pressKey(keyCode); }}
      onTouchEnd={(e) => { e.preventDefault(); releaseKey(keyCode); }}
      onTouchCancel={releaseAll}
      onMouseDown={() => pressKey(keyCode)}
      onMouseUp={() => releaseKey(keyCode)}
      onMouseLeave={() => releaseKey(keyCode)}
    >
      {label}
    </button>
  );

  return (
    <div className="mobile-dpad">
      <div className="dpad-cross">
        {btn("▲", 38, "dpad-up")}
        <div className="dpad-row">
          {btn("◀", 37, "dpad-left")}
          <div className="dpad-center" />
          {btn("▶", 39, "dpad-right")}
        </div>
        {btn("▼", 40, "dpad-down")}
      </div>
      <button className="dpad-action" onTouchStart={handleAction} onMouseDown={handleAction}>
        A
      </button>
    </div>
  );
}
