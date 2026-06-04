import Phaser from "phaser";
import Player from "../entities/Player.js";
import NPC from "../entities/NPC.js";
import DialogueSystem from "../systems/DialogueSystem.js";
import TransitionSystem from "../systems/TransitionSystem.js";

const T = 16;
const W = 18;
const H = 12;

const miravDialogue = [
  "Welcome to Station 1 — Mirav Labs. Atishay is an AI Research Intern here.",
  "He's designing MemGraph AI — a hybrid graph + vector memory system.",
  "It combines Neo4j with Qdrant for structural multi-hop retrieval.",
  "The LLM extraction pipeline parses conversations into typed triples.",
  "Fusion retrieval: ANN vector search + 2-hop Cypher traversal.",
  "Target: >20% precision over vector-only RAG.",
];

const isfcrDialogue = [
  "Station 2 — ISFCR Centre for Cyber Security, PES University.",
  "Atishay just joined as a Cloud Security Intern — June 2026.",
  "He'll work on cloud infrastructure security and vulnerability assessment.",
  "Onboarding in progress. Big things are being built here.",
];

const embrionDialogue = [
  "Station 3 — Embrione, the CSE Department Club at PES University.",
  "Atishay is the Logistics Head — promoted in his first year!",
  "He runs end-to-end operations for workshops, hackathons, and seminars.",
  "100+ attendees per event. Vendor contracts, procurement, execution — all of it.",
];

export default class ExperienceHQScene extends Phaser.Scene {
  constructor() {
    super("ExperienceHQ");
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
        const isDoor = y === H - 1 && x === 9;
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

    // Station desks
    for (let x = 2; x < 5; x++) this.addWallObj(x, 1, "tile_machine");
    for (let x = 8; x < 11; x++) this.addWallObj(x, 1, "tile_bookshelf");
    for (let x = 13; x < 16; x++) this.addWallObj(x, 1, "tile_machine");

    // Tables for each station
    this.addWallObj(3, 4, "tile_table");
    this.addWallObj(4, 4, "tile_table");
    this.addWallObj(9, 4, "tile_table");
    this.addWallObj(14, 4, "tile_table");
    this.addWallObj(15, 4, "tile_table");

    // Station labels
    const style = { fontSize: "5px", fontFamily: "'Press Start 2P', monospace", align: "center" };
    this.add.text(3 * T + T / 2, 3 * T, "MIRAV LABS\nAI Research", { ...style, color: "#7ecfff" }).setOrigin(0.5).setDepth(25);
    this.add.text(9 * T + T / 2, 3 * T, "ISFCR\nCyber Security", { ...style, color: "#f0a020" }).setOrigin(0.5).setDepth(25);
    this.add.text(14 * T + T / 2, 3 * T, "EMBRIONE\nLogistics", { ...style, color: "#4ecfa0" }).setOrigin(0.5).setDepth(25);

    this.add.text(W * T / 2, T * 0.3, "EXPERIENCE HQ", {
      fontSize: "6px",
      fontFamily: "'Press Start 2P', monospace",
      color: "#f0a020",
    }).setOrigin(0.5).setDepth(25);
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

    const defs = [
      { x: 3, y: 6, tex: "npc_researcher", key: "mirav", lines: miravDialogue },
      { x: 9, y: 6, tex: "npc_guard", key: "isfcr", lines: isfcrDialogue },
      { x: 14, y: 6, tex: "npc_villager", key: "embrion", lines: embrionDialogue },
    ];

    for (const d of defs) {
      const npc = new NPC(this, d.x * T + T / 2, d.y * T + T / 2, d.tex, d.key, d.lines);
      this.npcs.push(npc);
      this.npcGroup.add(npc);
    }
  }

  createPlayer() {
    this.player = new Player(this, 9 * T + T / 2, 10 * T + T / 2);
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
    const exitZone = this.add.zone(9 * T + T / 2, (H - 1) * T + T / 2, T, T);
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
