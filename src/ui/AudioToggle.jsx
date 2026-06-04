import { useState, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";

// Generate 8-bit sounds programmatically using Web Audio API via Howler
function createBeepDataURI(freq, duration, type = "square") {
  const sampleRate = 44100;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    let val = 0;
    if (type === "square") {
      val = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.3 : -0.3;
    } else if (type === "sine") {
      val = Math.sin(2 * Math.PI * freq * t) * 0.3;
    } else if (type === "triangle") {
      val = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t)) * 0.3;
    }
    // Fade out at end
    const fade = Math.min(1, (samples - i) / (sampleRate * 0.05));
    buffer[i] = val * fade;
  }

  // Encode as WAV
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples * blockAlign;
  const headerSize = 44;
  const buf = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buf);

  const writeStr = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < samples; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    view.setInt16(headerSize + i * 2, s * 0x7FFF, true);
  }

  const blob = new Blob([buf], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

// Generate a simple 8-bit melody for BGM
function createBGMDataURI() {
  const sampleRate = 44100;
  const bpm = 120;
  const beatDur = 60 / bpm;
  // Simple Pallet Town-inspired melody
  const notes = [
    262, 294, 330, 349, 392, 349, 330, 294,
    262, 294, 330, 392, 440, 392, 349, 330,
    294, 330, 349, 392, 440, 523, 440, 392,
    349, 330, 294, 262, 294, 330, 262, 0,
  ];
  const noteDur = beatDur * 0.5;
  const totalSamples = Math.floor(sampleRate * notes.length * noteDur);
  const buffer = new Float32Array(totalSamples);

  for (let n = 0; n < notes.length; n++) {
    const freq = notes[n];
    const start = Math.floor(n * noteDur * sampleRate);
    const len = Math.floor(noteDur * sampleRate);
    for (let i = 0; i < len; i++) {
      const t = i / sampleRate;
      if (freq === 0) continue;
      // Square wave + slight triangle overlay for GBA feel
      const sq = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.15 : -0.15;
      const tri = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t)) * 0.08;
      // Envelope
      const attack = Math.min(1, i / (sampleRate * 0.01));
      const release = Math.min(1, (len - i) / (sampleRate * 0.03));
      buffer[start + i] = (sq + tri) * attack * release;
    }
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = totalSamples * blockAlign;
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);
  const writeStr = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF"); view.setUint32(4, 36 + dataSize, true); writeStr(8, "WAVE");
  writeStr(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true); view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true); writeStr(36, "data"); view.setUint32(40, dataSize, true);

  for (let i = 0; i < totalSamples; i++) {
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, buffer[i])) * 0x7FFF, true);
  }

  const blob = new Blob([buf], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

export default function AudioToggle({ gameRef }) {
  const [muted, setMuted] = useState(true);
  const bgmRef = useRef(null);
  const sfxRef = useRef({});

  useEffect(() => {
    // Create BGM
    bgmRef.current = new Howl({
      src: [createBGMDataURI()],
      loop: true,
      volume: 0.3,
    });

    // Create SFX
    sfxRef.current.blip = new Howl({ src: [createBeepDataURI(600, 0.06)], volume: 0.2 });
    sfxRef.current.door = new Howl({ src: [createBeepDataURI(400, 0.15, "triangle")], volume: 0.2 });
    sfxRef.current.save = new Howl({ src: [createBeepDataURI(523, 0.1, "square")], volume: 0.25 });

    // Listen for game events to play SFX
    const g = gameRef.current;
    if (g) {
      const onDialogueStart = () => sfxRef.current.blip?.play();
      const onDialogueLine = () => sfxRef.current.blip?.play();
      g.events.on("dialogue-start", onDialogueStart);
      g.events.on("dialogue-line", onDialogueLine);

      return () => {
        g.events.off("dialogue-start", onDialogueStart);
        g.events.off("dialogue-line", onDialogueLine);
        bgmRef.current?.unload();
      };
    }
  }, [gameRef]);

  const toggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    Howler.mute(newMuted);
    if (!newMuted && bgmRef.current && !bgmRef.current.playing()) {
      bgmRef.current.play();
    }
  };

  return (
    <button className={`audio-toggle ${muted ? "muted" : ""}`} onClick={toggle}>
      {muted ? "🔇" : "♪"}
    </button>
  );
}
