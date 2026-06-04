import Phaser from "phaser";
import Player from "../entities/Player.js";
import NPC from "../entities/NPC.js";
import DialogueSystem from "../systems/DialogueSystem.js";
import TransitionSystem from "../systems/TransitionSystem.js";

const T = 16;
const W = 14;
const H = 10;

const nurseDialogue = [
  "Welcome to the Pokémon Center! Here you can connect with Trainer Atishay.",
  "His LinkedIn, GitHub, and email are all on the board to the right.",
  "Or talk to the assistant to download his resume — we call it 'Save Game' here!",
];

const assistantDialogue = [
  "Want to save your progress? That's Atishay's resume!",
  "Click the SAVE tab in the sidebar, or I can help you download it.",
];

export default class PokeCenterScene extends Phaser.Scene {
  constructor() {
    super("PokeCenter");
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

    // Emit socials event so React shows the links panel
    this.game.events.emit("enter-pokecenter");
  }

  buildInterior() {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x * T + T / 2;
        const py = y * T + T / 2;
        const isWall = y === 0 || x === 0 || x === W - 1;
        const isDoor = y === H - 1 && x === 7;
        const isBottomWall = y === H - 1 && !isDoor;

        if (isWall || isBottomWall) {
          this.add.image(px, py, "tile_center_wall").setDepth(1);
          const w = this.wallBodies.create(px, py, null);
          w.setSize(T, T).setVisible(false);
        } else if (isDoor) {
          this.add.image(px, py, "tile_center_door").setDepth(0);
        } else {
          this.add.image(px, py, "tile_floor").setDepth(0);
        }
      }
    }

    // Counter
    for (let x = 3; x < 7; x++) {
      this.addWallObj(x, 3, "tile_table");
    }

    // Machine behind counter
    this.addWallObj(4, 1, "tile_machine");
    this.addWallObj(5, 1, "tile_machine");

    // Bookshelves on right (the "social board")
    this.addWallObj(10, 1, "tile_bookshelf");
    this.addWallObj(11, 1, "tile_bookshelf");
    this.addWallObj(12, 1, "tile_bookshelf");

    // Pokéball decoration
    this.add.image(2 * T + T / 2, 7 * T + T / 2, "deco_pokeball").setDepth(1);

    this.add.text(W * T / 2, T * 0.3, "POKÉMON CENTER", {
      fontSize: "6px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#e04040",
    }).setOrigin(0.5).setDepth(25);

    // Social links board (visual)
    const boardX = 11 * T;
    const boardY = 3 * T;
    const boardStyle = {
      fontSize: "5px",
      fontFamily: "'Press Start 2P', monospace",
      align: "left",
    };
    this.add.text(boardX, boardY, "CONNECT", { ...boardStyle, color: "#f0a020" }).setOrigin(0.5).setDepth(25);
    this.add.text(boardX, boardY + 12, "LinkedIn", { ...boardStyle, color: "#4ecfa0" }).setOrigin(0.5).setDepth(25);
    this.add.text(boardX, boardY + 22, "GitHub", { ...boardStyle, color: "#7ecfff" }).setOrigin(0.5).setDepth(25);
    this.add.text(boardX, boardY + 32, "Email", { ...boardStyle, color: "#ffa0b0" }).setOrigin(0.5).setDepth(25);
    this.add.text(boardX, boardY + 42, "Resume", { ...boardStyle, color: "#f0a020" }).setOrigin(0.5).setDepth(25);
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

    const nurse = new NPC(this, 5 * T + T / 2, 4 * T + T / 2, "npc_villager_f", "nurse", nurseDialogue);
    const assistant = new NPC(this, 10 * T + T / 2, 5 * T + T / 2, "npc_villager", "assistant", assistantDialogue);

    this.npcs.push(nurse, assistant);
    this.npcGroup.add(nurse);
    this.npcGroup.add(assistant);
  }

  createPlayer() {
    this.player = new Player(this, 7 * T + T / 2, 7 * T + T / 2);
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
    const exitZone = this.add.zone(7 * T + T / 2, (H - 1) * T + T / 2, T, T);
    this.physics.add.existing(exitZone, true);
    this.physics.add.overlap(this.player, exitZone, () => {
      if (!this.transition.transitioning) {
        this.game.events.emit("leave-pokecenter");
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
