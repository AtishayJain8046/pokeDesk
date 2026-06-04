import Phaser from "phaser";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    // Phase 1: Boot screen
    this.showBootScreen();
  }

  showBootScreen() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // Pokéball logo
    const g = this.add.graphics();
    g.fillStyle(0xe03030);
    g.fillCircle(cx, cy - 30, 24);
    g.fillStyle(0xf0f0f0);
    g.fillRect(cx - 24, cy - 32, 48, 2);
    g.fillCircle(cx, cy - 30, 6);
    g.fillStyle(0xe03030);
    g.fillRect(cx - 24, cy - 54, 48, 24);

    const title = this.add.text(cx, cy + 20, "ATISHAY'S WORLD", {
      fontSize: "12px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#f0a020",
    }).setOrigin(0.5).setAlpha(0);

    const copyright = this.add.text(cx, cy + 45, "© 2026  Trainer Atishay", {
      fontSize: "7px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#7ecfff",
    }).setOrigin(0.5).setAlpha(0);

    // Fade in
    this.tweens.add({
      targets: [title, copyright],
      alpha: 1,
      duration: 800,
      delay: 400,
      onComplete: () => {
        // After 1.5s, show "Press Start"
        this.time.delayedCall(1500, () => {
          this.showPressStart(cx, cy, [g, title, copyright]);
        });
      },
    });
  }

  showPressStart(cx, cy, bootElements) {
    const press = this.add.text(cx, cy + 80, "PRESS START", {
      fontSize: "10px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#e8f4ff",
    }).setOrigin(0.5);

    this.tweens.add({
      targets: press,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    const startGame = () => {
      this.input.keyboard.off("keydown", startGame);
      this.input.off("pointerdown", startGame);

      // Fade everything out
      this.tweens.add({
        targets: [...bootElements, press],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          bootElements.forEach((e) => e.destroy());
          press.destroy();
          this.showOakIntro(cx);
        },
      });
    };

    this.input.keyboard.on("keydown", startGame);
    this.input.on("pointerdown", startGame);
  }

  showOakIntro(cx) {
    // Oak sprite
    const oak = this.add.image(cx, 100, "npc_oak").setScale(4).setAlpha(0);

    this.tweens.add({
      targets: oak,
      alpha: 1,
      duration: 600,
    });

    const lines = [
      "Hello there! Welcome to the world\nof Trainer Atishay!",
      "I am Prof. Oak — curator of\nhis portfolio.",
      "Atishay is a Computer Science\nstudent at PES University.",
      "He specialises in AI/ML systems —\nparticularly memory and RAG.",
      "His partner is Greninja.\nIt will follow him everywhere.",
      "Now, let's explore his world!",
    ];

    let lineIndex = 0;

    const textBox = this.add.rectangle(cx, 260, 380, 80, 0x0d2240)
      .setStrokeStyle(2, 0x185fa5).setAlpha(0);
    const dialogueText = this.add.text(cx, 250, "", {
      fontSize: "9px",
      fontFamily: "Inter, sans-serif",
      color: "#e8f4ff",
      wordWrap: { width: 350 },
      align: "center",
      lineSpacing: 6,
    }).setOrigin(0.5, 0.5).setAlpha(0);
    const advanceHint = this.add.text(cx, 290, "▼", {
      fontSize: "10px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#f0a020",
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: advanceHint,
      alpha: 0,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    const showLine = () => {
      if (lineIndex >= lines.length) {
        // Done — transition to game
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("PalletTown");
        });
        return;
      }

      textBox.setAlpha(1);
      dialogueText.setAlpha(1);
      advanceHint.setAlpha(1);

      // Typewriter effect
      const full = lines[lineIndex];
      dialogueText.setText("");
      let charIdx = 0;
      const timer = this.time.addEvent({
        delay: 30,
        callback: () => {
          charIdx++;
          dialogueText.setText(full.slice(0, charIdx));
          if (charIdx >= full.length) timer.destroy();
        },
        repeat: full.length - 1,
      });

      lineIndex++;
    };

    // Show Greninja at right moment
    this.time.delayedCall(600, () => {
      showLine();
    });

    const advance = () => {
      showLine();
    };

    this.input.keyboard.on("keydown", advance);
    this.input.on("pointerdown", advance);
  }
}
