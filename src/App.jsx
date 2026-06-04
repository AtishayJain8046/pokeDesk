import { useEffect, useRef, useState, useCallback } from "react";
import Phaser from "phaser";
import BootScene from "./game/scenes/BootScene.js";
import IntroScene from "./game/scenes/IntroScene.js";
import PalletTownScene from "./game/scenes/PalletTownScene.js";
import OaksLabScene from "./game/scenes/OaksLabScene.js";
import AtishayHouseScene from "./game/scenes/AtishayHouseScene.js";
import ExperienceHQScene from "./game/scenes/ExperienceHQScene.js";
import TrainerGymScene from "./game/scenes/TrainerGymScene.js";
import PokeCenterScene from "./game/scenes/PokeCenterScene.js";
import Sidebar from "./ui/Sidebar.jsx";
import DialogueBox from "./ui/DialogueBox.jsx";
import ProjectCard from "./ui/ProjectCard.jsx";
import SocialsPanel from "./ui/SocialsPanel.jsx";
import SnorlaxModal from "./ui/SnorlaxModal.jsx";
import MobileDpad from "./ui/MobileDpad.jsx";
import AudioToggle from "./ui/AudioToggle.jsx";

export default function App() {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const [dialogue, setDialogue] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [showSocials, setShowSocials] = useState(false);
  const [snorlaxPhase, setSnorlaxPhase] = useState(null);
  const [isMobile] = useState(() => window.innerWidth <= 768);

  const handleDialogueLine = useCallback((data) => setDialogue(data), []);
  const handleDialogueEnd = useCallback(() => setDialogue(null), []);
  const handleProjectFocus = useCallback((p) => setActiveProject(p), []);
  const handleProjectBlur = useCallback(() => setActiveProject(null), []);
  const handleEnterPokeCenter = useCallback(() => setShowSocials(true), []);
  const handleLeavePokeCenter = useCallback(() => setShowSocials(false), []);
  const handleSnorlaxBlock = useCallback(() => setSnorlaxPhase("blocked"), []);
  const handleSnorlaxAwoke = useCallback(() => setSnorlaxPhase("awoke"), []);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 480,
      height: 400,
      pixelArt: true,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scene: [BootScene, IntroScene, PalletTownScene, OaksLabScene, AtishayHouseScene, ExperienceHQScene, TrainerGymScene, PokeCenterScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: "#0a1628",
      input: {
        activePointers: 3,
      },
    };

    gameRef.current = new Phaser.Game(config);

    const g = gameRef.current;
    g.events.on("dialogue-line", handleDialogueLine);
    g.events.on("dialogue-end", handleDialogueEnd);
    g.events.on("project-focus", handleProjectFocus);
    g.events.on("project-blur", handleProjectBlur);
    g.events.on("enter-pokecenter", handleEnterPokeCenter);
    g.events.on("leave-pokecenter", handleLeavePokeCenter);
    g.events.on("snorlax-block", handleSnorlaxBlock);
    g.events.on("snorlax-awoke", handleSnorlaxAwoke);

    return () => {
      g.events.off("dialogue-line", handleDialogueLine);
      g.events.off("dialogue-end", handleDialogueEnd);
      g.events.off("project-focus", handleProjectFocus);
      g.events.off("project-blur", handleProjectBlur);
      g.events.off("enter-pokecenter", handleEnterPokeCenter);
      g.events.off("leave-pokecenter", handleLeavePokeCenter);
      g.events.off("snorlax-block", handleSnorlaxBlock);
      g.events.off("snorlax-awoke", handleSnorlaxAwoke);
      g.destroy(true);
      gameRef.current = null;
    };
  }, [handleDialogueLine, handleDialogueEnd, handleProjectFocus, handleProjectBlur, handleEnterPokeCenter, handleLeavePokeCenter, handleSnorlaxBlock, handleSnorlaxAwoke]);

  const advanceDialogue = () => {
    const scene = gameRef.current?.scene?.getScenes(true)[0];
    scene?.dialogueSystem?.advance();
  };

  const playFlute = () => {
    gameRef.current?.events.emit("snorlax-wake");
  };

  return (
    <div className="app">
      <div className="game-container">
        <div ref={containerRef} className="phaser-container" />
        <AudioToggle gameRef={gameRef} />

        {dialogue && (
          <DialogueBox
            text={dialogue.text}
            isLast={dialogue.isLast}
            onAdvance={advanceDialogue}
          />
        )}

        {activeProject && (
          <div className="project-card-wrapper">
            <ProjectCard project={activeProject} />
          </div>
        )}
        {showSocials && (
          <div className="socials-panel-wrapper">
            <SocialsPanel />
          </div>
        )}

        {snorlaxPhase && (
          <SnorlaxModal
            phase={snorlaxPhase}
            onPlayFlute={playFlute}
            onClose={() => setSnorlaxPhase(null)}
          />
        )}

        {isMobile && <MobileDpad gameRef={gameRef} />}

        <div className="game-controls">
          <span>WASD / Arrow keys to move</span>
          <span>SPACE to interact</span>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
