import Phaser from "phaser";
import Player from "../entities/Player.js";
import NPC from "../entities/NPC.js";
import DialogueSystem from "../systems/DialogueSystem.js";
import TransitionSystem from "../systems/TransitionSystem.js";

const T = 16;
const W = 12;
const H = 10;

const trainerDialogue = [
  "Welcome to the Trainer Gym! This is where Atishay levels up.",
  "He hits the gym regularly — gotta keep those stats high.",
  "Then he comes home and plays Balatro. Says deck-building is systems design.",
  "Slay the Spire too. He calls it gradient descent — iterate until the run converges.",
  "And Valorant — he says it trains reaction time. I think he just likes shooting things.",
];

const gymNPCDialogue = [
  "Atishay's training regimen: gym, code, game, repeat.",
  "The real workout is debugging at 2am. Trust me.",
];

export default class TrainerGymScene extends Phaser.Scene {
  constructor() {
    super("TrainerGym");
  }

  init(data) {
    this.returnScene = data.returnScene || "PalletTown";
    this.returnX = data.returnX;
    this.returnY = data.returnY;
  }

  create() {
    this.physics.world.setBounds(0, 0, W * T, H * T);
    this.cameras.main.setBounds(0, 0, W * T, H * T);
    this.wallBodies = this.physics.add.staticGroup();

    this.buildInterior();
    this.createNPCs();
    this.createPlayer();
    this.setupCamera();
    this.setupDialogue();
    this.setupExit();

    this.transition = new TransitionSystem(this);
    this.transition.fadeIn();

    this.interactPrompt = this.add
      .text(0, 0, "SPACE", {
        fontSize: "8px",
        fontFamily: "'Press Start 2P', monospace",
        color: "#f0a020",
        backgroundColor: "#0a1628cc",
        padding: { x: 2, y: 1 },
      })
      .setDepth(100)
      .setVisible(false);
  }

  buildInterior() {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x * T + T / 2;
        const py = y * T + T / 2;
        const isWall = y === 0 || x === 0 || x === W - 1;
        const isDoor = y === H - 1 && x === 6;
        const isBottomWall = y === H - 1 && !isDoor;

        if (isWall || isBottomWall) {
          this.add.image(px, py, "tile_int_wall").setDepth(1);
          const w = this.wallBodies.create(px, py, null);
          w.setSize(T, T).setVisible(false);
        } else if (isDoor) {
          this.add.image(px, py, "tile_door").setDepth(0);
        } else {
          this.add.image(px, py, "tile_floor").setDepth(0);
        }
      }
    }

    // Gym equipment (machines)
    this.addWallObj(2, 1, "tile_machine");
    this.addWallObj(3, 1, "tile_machine");
    this.addWallObj(8, 1, "tile_machine");
    this.addWallObj(9, 1, "tile_machine");

    // Rug in center
    for (let y = 4; y < 6; y++) {
      for (let x = 4; x < 8; x++) {
        this.add.image(x * T + T / 2, y * T + T / 2, "tile_rug").setDepth(0);
      }
    }

    // Bookshelf with games
    this.addWallObj(5, 1, "tile_bookshelf");
    this.addWallObj(6, 1, "tile_bookshelf");

    this.add.text(W * T / 2, T * 0.3, "TRAINER GYM", {
      fontSize: "6px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#4ecfa0",
    }).setOrigin(0.5).setDepth(25);

    // Hobby labels on walls
    const style = { fontSize: "5px", fontFamily: "'Press Start 2P', monospace", color: "#f0a020" };
    this.add.text(3 * T, 3 * T, "GYM", style).setOrigin(0.5).setDepth(25);
    this.add.text(5.5 * T, 3 * T, "GAMES", style).setOrigin(0.5).setDepth(25);
    this.add.text(9 * T, 3 * T, "VALORANT", style).setOrigin(0.5).setDepth(25);
  }

  addWallObj(x, y, tex) {
    const px = x * T + T / 2;
    const py = y * T + T / 2;
    this.add.image(px, py, tex).setDepth(2);
    const w = this.wallBodies.create(px, py, null);
    w.setSize(T, T).setVisible(false);
  }

  createNPCs() {
    this.npcs = [];
    this.npcGroup = this.physics.add.staticGroup();

    const npc1 = new NPC(this, 4 * T + T / 2, 5 * T + T / 2, "npc_villager", "trainer", trainerDialogue);
    const npc2 = new NPC(this, 8 * T + T / 2, 6 * T + T / 2, "npc_kid", "gymNPC", gymNPCDialogue);
    this.npcs.push(npc1, npc2);
    this.npcGroup.add(npc1);
    this.npcGroup.add(npc2);
  }

  createPlayer() {
    this.player = new Player(this, 6 * T + T / 2, 8 * T + T / 2);
    this.player.direction = "up";
    this.physics.add.collider(this.player, this.wallBodies);
    this.physics.add.collider(this.player, this.npcGroup);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.setBackgroundColor("#0a1628");
  }

  setupDialogue() {
    this.dialogueSystem = new DialogueSystem(this);
    this.dialogueSystem.onDialogueStart = () => {
      this.player.freeze();
      this.game.events.emit("dialogue-start");
    };
    this.dialogueSystem.onDialogueLine = (line, isLast) => {
      this.game.events.emit("dialogue-line", { text: line, isLast });
    };
    this.dialogueSystem.onDialogueEnd = () => {
      this.player.unfreeze();
      this.game.events.emit("dialogue-end");
    };

    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.dialogueSystem.active) {
        this.dialogueSystem.advance();
        return;
      }
      for (const npc of this.npcs) {
        if (npc.isPlayerNearby(this.player)) {
          this.dialogueSystem.startDialogue(npc);
          return;
        }
      }
    });
  }

  setupExit() {
    const exitZone = this.add.zone(6 * T + T / 2, (H - 1) * T + T / 2, T, T);
    this.physics.add.existing(exitZone, true);
    this.physics.add.overlap(this.player, exitZone, () => {
      if (!this.transition.transitioning) {
        this.transition.fadeToScene(this.returnScene, {
          spawnX: this.returnX,
          spawnY: this.returnY,
        });
      }
    });
  }

  update() {
    this.player.update();
    let show = false;
    if (!this.dialogueSystem.active) {
      for (const npc of this.npcs) {
        if (npc.isPlayerNearby(this.player)) {
          this.interactPrompt.setPosition(npc.x - 10, npc.y - 14);
          show = true;
          break;
        }
      }
    }
    this.interactPrompt.setVisible(show);
  }
}
