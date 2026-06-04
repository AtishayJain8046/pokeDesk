import Phaser from "phaser";
import Player from "../entities/Player.js";
import NPC from "../entities/NPC.js";
import DialogueSystem from "../systems/DialogueSystem.js";
import TransitionSystem from "../systems/TransitionSystem.js";
import { npcDialogue } from "../../data/npcDialogue.js";
import { projects } from "../../data/projects.js";

const T = 16;
const W = 18;
const H = 14;

export default class OaksLabScene extends Phaser.Scene {
  constructor() {
    super("OaksLab");
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

    this.buildLab();
    this.createPokemonStations();
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

  buildLab() {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x * T + T / 2;
        const py = y * T + T / 2;
        const isWall = y === 0 || x === 0 || x === W - 1;
        const isDoor = y === H - 1 && x === 9;
        const isBottomWall = y === H - 1 && !isDoor;

        if (isWall || isBottomWall) {
          this.add.image(px, py, "tile_lab_wall").setDepth(1);
          const w = this.wallBodies.create(px, py, null);
          w.setSize(T, T).setVisible(false);
        } else if (isDoor) {
          this.add.image(px, py, "tile_lab_door").setDepth(0);
        } else {
          this.add.image(px, py, "tile_lab_floor").setDepth(0);
        }
      }
    }

    // Machines behind each Pokémon station
    for (let x = 2; x < 5; x++) this.addWallObj(x, 1, "tile_machine");
    for (let x = 13; x < 16; x++) this.addWallObj(x, 1, "tile_machine");
    for (let x = 2; x < 5; x++) this.addWallObj(x, 7, "tile_machine");
    for (let x = 13; x < 16; x++) this.addWallObj(x, 7, "tile_machine");

    // Central bookshelves
    this.addWallObj(8, 1, "tile_bookshelf");
    this.addWallObj(9, 1, "tile_bookshelf");
    this.addWallObj(10, 1, "tile_bookshelf");

    // Pokéball markers on the floor under each station
    const stationPositions = [[3, 3], [14, 3], [3, 9], [14, 9]];
    for (const [sx, sy] of stationPositions) {
      this.add.image(sx * T + T / 2, (sy + 1) * T + T / 2, "deco_pokeball").setDepth(0);
    }

    this.add.text(W * T / 2, T * 0.3, "PROF. OAK'S AI LAB", {
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

  createPokemonStations() {
    this.npcs = [];
    this.npcGroup = this.physics.add.staticGroup();

    const stations = [
      {
        x: 3, y: 3,
        sprite: "pkmn_mewtwo",
        key: "researcherMemGraph",
        lines: npcDialogue.researcherMemGraph,
        project: projects.find(p => p.id === "memgraph"),
        label: "MEWTWO\nMemGraph AI",
        labelColor: "#c8a8e8",
      },
      {
        x: 14, y: 3,
        sprite: "pkmn_charizard",
        key: "researcherMicroGPT",
        lines: npcDialogue.researcherMicroGPT,
        project: projects.find(p => p.id === "microgpt"),
        label: "CHARIZARD\nMicroGPT",
        labelColor: "#e08030",
      },
      {
        x: 3, y: 9,
        sprite: "pkmn_alakazam",
        key: "researcherDocRAG",
        lines: npcDialogue.researcherDocRAG,
        project: projects.find(p => p.id === "docrag"),
        label: "ALAKAZAM\nDocRAG",
        labelColor: "#d0a040",
      },
      {
        x: 14, y: 9,
        sprite: "pkmn_jigglypuff",
        key: "researcherAudio",
        lines: npcDialogue.researcherAudio,
        project: projects.find(p => p.id === "audio"),
        label: "JIGGLYPUFF\nAudio Rec.",
        labelColor: "#ffa0b0",
      },
    ];

    for (const s of stations) {
      const npc = new NPC(
        this,
        s.x * T + T / 2,
        s.y * T + T / 2,
        s.sprite,
        s.key,
        s.lines
      );
      npc.projectData = s.project;
      this.npcs.push(npc);
      this.npcGroup.add(npc);

      // Station label
      this.add.text(s.x * T + T / 2, (s.y + 2) * T, s.label, {
        fontSize: "5px",
        fontFamily: "'Press Start 2P', monospace",
        color: s.labelColor,
        align: "center",
      }).setOrigin(0.5).setDepth(25);
    }
  }

  createPlayer() {
    this.player = new Player(this, 9 * T + T / 2, 12 * T + T / 2);
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
    this.dialogueSystem.onDialogueStart = (key) => {
      this.player.freeze();
      const npc = this.npcs.find(n => n.dialogueKey === key);
      this.game.events.emit("dialogue-start", key);
      if (npc?.projectData) {
        this.game.events.emit("project-focus", npc.projectData);
      }
    };
    this.dialogueSystem.onDialogueLine = (line, isLast) => {
      this.game.events.emit("dialogue-line", { text: line, isLast });
    };
    this.dialogueSystem.onDialogueEnd = () => {
      this.player.unfreeze();
      this.game.events.emit("dialogue-end");
      this.game.events.emit("project-blur");
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
