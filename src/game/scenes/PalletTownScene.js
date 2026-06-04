import Phaser from "phaser";
import Player from "../entities/Player.js";
import NPC from "../entities/NPC.js";
import DialogueSystem from "../systems/DialogueSystem.js";
import TransitionSystem from "../systems/TransitionSystem.js";
import { npcDialogue } from "../../data/npcDialogue.js";

const T = 16;
const MW = 40;
const MH = 35;

export default class PalletTownScene extends Phaser.Scene {
  constructor() {
    super("PalletTown");
  }

  init(data) {
    this.spawnX = data.spawnX || 20 * T;
    this.spawnY = data.spawnY || 22 * T;
  }

  create() {
    this.physics.world.setBounds(0, 0, MW * T, MH * T);
    this.cameras.main.setBounds(0, 0, MW * T, MH * T);

    this.wallBodies = this.physics.add.staticGroup();

    this.paintGround();
    this.paintPaths();
    this.paintWater();
    this.paintBuildings();
    this.paintTrees();
    this.paintDecorations();
    this.paintBorderFence();
    this.addLabels();

    this.createNPCs();
    this.createPlayer();
    this.setupCamera();
    this.setupDialogue();
    this.setupDoors();

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

  // ─── Ground ───
  paintGround() {
    for (let y = 0; y < MH; y++) {
      for (let x = 0; x < MW; x++) {
        const variant = (x * 7 + y * 13) % 4;
        this.add.image(x * T + T / 2, y * T + T / 2, `tile_grass_${variant}`).setDepth(0);
      }
    }
  }

  // ─── Paths ───
  paintPaths() {
    const paths = [];

    // Main vertical road (center)
    for (let y = 4; y < 32; y++) {
      paths.push([19, y], [20, y]);
    }

    // Horizontal road connecting buildings (row 16-17)
    for (let x = 5; x < 35; x++) {
      paths.push([x, 16], [x, 17]);
    }

    // Path to Oak's Lab
    for (let y = 6; y < 10; y++) {
      paths.push([19, y], [20, y]);
    }

    // Path branches to Embrione (west)
    for (let x = 7; x < 19; x++) {
      paths.push([x, 10], [x, 11]);
    }

    // Path branches to Cyber Outpost (east)
    for (let x = 21; x < 33; x++) {
      paths.push([x, 10], [x, 11]);
    }

    // Path to Atishay's house (south-west)
    for (let x = 7; x < 19; x++) {
      paths.push([x, 22], [x, 23]);
    }

    // Path to Pokémon Center (south-east)
    for (let x = 21; x < 33; x++) {
      paths.push([x, 22], [x, 23]);
    }

    // Path south past snorlax
    for (let y = 26; y < 32; y++) {
      paths.push([19, y], [20, y]);
    }

    for (const [x, y] of paths) {
      this.add.image(x * T + T / 2, y * T + T / 2, "tile_path").setDepth(1);
    }
  }

  // ─── Water ───
  paintWater() {
    // Pond — north-west area (away from buildings)
    for (let y = 4; y < 8; y++) {
      for (let x = 4; x < 10; x++) {
        const v = (x + y) % 2;
        this.add.image(x * T + T / 2, y * T + T / 2, `tile_water_${v}`).setDepth(1);
        const w = this.wallBodies.create(x * T + T / 2, y * T + T / 2, null);
        w.setSize(T, T).setVisible(false);
      }
    }
  }

  // ─── Buildings ───
  paintBuildings() {
    // Each building: roof row, wall rows with windows, wall row with door
    this.drawBuilding(17, 4, 7, 5, "tile_roof_blue", "tile_lab_wall", "tile_lab_door", 20, "tile_window");
    this.drawBuilding(5, 8, 6, 4, "tile_roof", "tile_wall", "tile_door", 8, "tile_window");
    this.drawBuilding(30, 8, 6, 4, "tile_roof", "tile_wall", "tile_door", 33, "tile_window");
    this.drawBuilding(5, 20, 6, 4, "tile_roof", "tile_wall", "tile_door", 8, "tile_window");
    // Pokémon Center (socials) — south-east area
    this.drawBuilding(27, 20, 7, 4, "tile_roof_center", "tile_center_wall", "tile_center_door", 30, "tile_window");
  }

  drawBuilding(bx, by, bw, bh, roofTex, wallTex, doorTex, doorX, winTex) {
    for (let y = by; y < by + bh; y++) {
      for (let x = bx; x < bx + bw; x++) {
        const px = x * T + T / 2;
        const py = y * T + T / 2;
        let tex = wallTex;

        if (y === by) {
          tex = roofTex;
        } else if (y === by + bh - 1 && x === doorX) {
          tex = doorTex;
          this.add.image(px, py, tex).setDepth(2);
          continue; // door is walkable
        } else if (y === by + 1 && (x === bx + 1 || x === bx + bw - 2)) {
          tex = winTex;
        }

        this.add.image(px, py, tex).setDepth(2);
        const w = this.wallBodies.create(px, py, null);
        w.setSize(T, T).setVisible(false);
      }
    }
  }

  // ─── Trees ───
  paintTrees() {
    const treePositions = [
      // West tree line
      [2, 6], [2, 10], [2, 14], [2, 18], [2, 22], [2, 26], [2, 30],
      [3, 8], [3, 12], [3, 16], [3, 20], [3, 24], [3, 28],
      // East tree line
      [37, 6], [37, 10], [37, 14], [37, 18], [37, 22], [37, 26], [37, 30],
      [38, 8], [38, 12], [38, 16], [38, 20], [38, 24], [38, 28],
      // Top tree line
      [6, 2], [9, 2], [12, 2], [15, 2], [25, 2], [28, 2], [31, 2], [34, 2],
      // Around buildings (scattered)
      [13, 7], [25, 7], [13, 13], [27, 13],
      // Park area south
      [14, 28], [16, 30], [24, 28], [26, 30],
      [12, 26], [28, 26],
    ];

    for (const [tx, ty] of treePositions) {
      // Tree sprite is 16x32, placed so trunk is at (tx, ty) and canopy above
      const img = this.add.image(tx * T + T / 2, ty * T, "deco_tree").setOrigin(0.5, 0.5).setDepth(15);

      // Collision on trunk area (bottom tile)
      const w = this.wallBodies.create(tx * T + T / 2, ty * T + T / 2, null);
      w.setSize(T, T).setVisible(false);
      // Canopy collision
      const wTop = this.wallBodies.create(tx * T + T / 2, (ty - 1) * T + T / 2, null);
      wTop.setSize(T, T).setVisible(false);
    }
  }

  // ─── Decorations ───
  paintDecorations() {
    // Flowers
    const flowerSpots = [
      [6, 14, "red"], [7, 15, "blue"], [11, 19, "yellow"],
      [29, 14, "red"], [33, 15, "blue"], [35, 20, "yellow"],
      [15, 25, "red"], [25, 25, "blue"], [22, 19, "yellow"],
      [10, 7, "red"], [30, 7, "blue"],
    ];
    for (const [fx, fy, color] of flowerSpots) {
      this.add.image(fx * T + T / 2, fy * T + T / 2, `deco_flowers_${color}`).setDepth(1);
    }

    // Signs
    const signs = [
      [18, 14, "PALLET TOWN"],
      [17, 9, "OAK'S AI LAB"],
      [6, 19, "ATISHAY'S HOUSE"],
    ];
    for (const [sx, sy] of signs) {
      this.add.image(sx * T + T / 2, sy * T + T / 2, "deco_sign").setDepth(3);
      const sw = this.wallBodies.create(sx * T + T / 2, sy * T + T / 2, null);
      sw.setSize(T, T).setVisible(false);
    }

    // Mailboxes near houses
    const mailboxes = [[10, 12], [10, 24], [34, 12]];
    for (const [mx, my] of mailboxes) {
      this.add.image(mx * T + T / 2, my * T + T / 2, "deco_mailbox").setDepth(3);
      const mw = this.wallBodies.create(mx * T + T / 2, my * T + T / 2, null);
      mw.setSize(T, T).setVisible(false);
    }

    // Pokeball on ground (easter egg)
    this.add.image(26 * T + T / 2, 20 * T + T / 2, "deco_pokeball").setDepth(2);

    // Tall grass patches
    const tallGrassAreas = [
      { x: 14, y: 18, w: 3, h: 2 },
      { x: 23, y: 18, w: 3, h: 2 },
      { x: 32, y: 18, w: 3, h: 3 },
    ];
    for (const area of tallGrassAreas) {
      for (let ay = area.y; ay < area.y + area.h; ay++) {
        for (let ax = area.x; ax < area.x + area.w; ax++) {
          this.add.image(ax * T + T / 2, ay * T + T / 2, "tile_tallgrass").setDepth(1);
        }
      }
    }
  }

  // ─── Border fence ───
  paintBorderFence() {
    for (let x = 0; x < MW; x++) {
      this.addFence(x, 0);
      this.addFence(x, 1);
      this.addFence(x, MH - 1);
      this.addFence(x, MH - 2);
    }
    for (let y = 0; y < MH; y++) {
      this.addFence(0, y);
      this.addFence(1, y);
      this.addFence(MW - 1, y);
      this.addFence(MW - 2, y);
    }
  }

  addFence(x, y) {
    const px = x * T + T / 2;
    const py = y * T + T / 2;
    this.add.image(px, py, "tile_fence").setDepth(2);
    const w = this.wallBodies.create(px, py, null);
    w.setSize(T, T).setVisible(false);
  }

  // ─── Labels ───
  addLabels() {
    const pixel = { fontSize: "7px", fontFamily: "'Press Start 2P', monospace" };

    this.add.text(20 * T, 3.5 * T, "OAK'S AI LAB", { ...pixel, color: "#7ecfff" }).setOrigin(0.5).setDepth(25);
    this.add.text(8 * T, 7.5 * T, "TRAINER GYM", { ...pixel, color: "#4ecfa0" }).setOrigin(0.5).setDepth(25);
    this.add.text(33 * T, 7.5 * T, "EXPERIENCE HQ", { ...pixel, color: "#f0a020" }).setOrigin(0.5).setDepth(25);
    this.add.text(8 * T, 19.5 * T, "ATISHAY'S HOUSE", { ...pixel, color: "#ff90b0" }).setOrigin(0.5).setDepth(25);
    this.add.text(30 * T, 19.5 * T, "POKÉMON CENTER", { ...pixel, color: "#e04040" }).setOrigin(0.5).setDepth(25);

    this.add.text(20 * T, 15 * T, "PALLET TOWN", {
      fontSize: "9px", fontFamily: "'Press Start 2P', monospace", color: "#4ecfa0",
    }).setOrigin(0.5).setDepth(25);
    this.add.text(20 * T, 15.8 * T, "Where new journeys begin", {
      fontSize: "7px", fontFamily: "Inter, sans-serif", color: "#7ecfff",
    }).setOrigin(0.5).setDepth(25);
  }

  // ─── NPCs ───
  createNPCs() {
    this.npcs = [];
    this.npcGroup = this.physics.add.staticGroup();

    const defs = [
      { x: 17, y: 13, tex: "npc_oak", key: "oak", lines: npcDialogue.oak },
      { x: 23, y: 15, tex: "npc_villager", key: "neighbour1", lines: npcDialogue.neighbour1 },
      { x: 28, y: 17, tex: "npc_villager_f", key: "neighbour2", lines: npcDialogue.neighbour2 },
      { x: 13, y: 17, tex: "npc_kid", key: "kidNPC", lines: npcDialogue.kidNPC },
      { x: 24, y: 12, tex: "npc_villager", key: "dreamerNPC", lines: npcDialogue.dreamerNPC },
      { x: 20, y: 26, tex: "npc_snorlax", key: "snorlax", lines: npcDialogue.snorlax },
    ];

    for (const d of defs) {
      const npc = new NPC(this, d.x * T + T / 2, d.y * T + T / 2, d.tex, d.key, d.lines);
      this.npcs.push(npc);
      this.npcGroup.add(npc);
    }
  }

  // ─── Player ───
  createPlayer() {
    this.player = new Player(this, this.spawnX, this.spawnY);
    this.physics.add.collider(this.player, this.wallBodies);
    this.physics.add.collider(this.player, this.npcGroup);

    this.greninja = this.add.sprite(this.spawnX, this.spawnY + T, "greninja", 0).setDepth(9);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.setBackgroundColor("#0a1628");
  }

  // ─── Dialogue ───
  setupDialogue() {
    this.dialogueSystem = new DialogueSystem(this);
    this.snorlaxAwake = false;

    this.dialogueSystem.onDialogueStart = (key) => {
      this.player.freeze();
      this.game.events.emit("dialogue-start", key);
    };
    this.dialogueSystem.onDialogueLine = (line, isLast) => {
      this.game.events.emit("dialogue-line", { text: line, isLast });
    };
    this.dialogueSystem.onDialogueEnd = () => {
      this.player.unfreeze();
      const wasKey = this.dialogueSystem.lastKey;
      this.game.events.emit("dialogue-end");

      if (wasKey === "snorlax" && !this.snorlaxAwake) {
        this.player.freeze();
        this.game.events.emit("snorlax-block");
      }
    };

    // Listen for React telling us to wake Snorlax
    this.game.events.on("snorlax-wake", () => {
      this.wakeSnorlax();
    });

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

  // ─── Snorlax wake animation ───
  wakeSnorlax() {
    this.snorlaxAwake = true;
    const snorlax = this.npcs.find(n => n.dialogueKey === "snorlax");
    if (!snorlax) return;

    // Show awoken dialogue
    snorlax.dialogueLines = npcDialogue.snorlaxAwoken;
    snorlax.resetDialogue();

    // Shake animation
    this.tweens.add({
      targets: snorlax,
      x: snorlax.x - 3,
      duration: 80,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        // Slide Snorlax to the side
        this.tweens.add({
          targets: snorlax,
          x: snorlax.x + 3 * T,
          duration: 600,
          ease: "Power2",
          onComplete: () => {
            // Remove from collision group so path is open
            snorlax.body.enable = false;
            this.npcGroup.remove(snorlax);
            snorlax.setAlpha(0.5);

            this.player.unfreeze();
            this.game.events.emit("snorlax-awoke");
          },
        });
      },
    });
  }

  // ─── Doors ───
  setupDoors() {
    this.transition = new TransitionSystem(this);

    const doors = [
      { x: 20, y: 8, scene: "OaksLab", label: "Oak's Lab" },
      { x: 8, y: 11, scene: "TrainerGym", label: "Trainer Gym" },
      { x: 33, y: 11, scene: "ExperienceHQ", label: "Experience HQ" },
      { x: 8, y: 23, scene: "AtishayHouse", label: "Atishay's House" },
      { x: 30, y: 23, scene: "PokeCenter", label: "Pokémon Center" },
    ];

    for (const door of doors) {
      const zone = this.add.zone(door.x * T + T / 2, door.y * T + T / 2, T, T);
      this.physics.add.existing(zone, true);

      this.physics.add.overlap(this.player, zone, () => {
        if (!this.transition.transitioning) {
          this.transition.fadeToScene(door.scene, {
            returnScene: "PalletTown",
            returnX: door.x * T + T / 2,
            returnY: (door.y + 1) * T + T / 2,
          });
        }
      });
    }
  }

  update() {
    this.player.update();

    if (this.player.positionHistory.length > 8) {
      const target = this.player.positionHistory[8];
      this.greninja.x += (target.x - this.greninja.x) * 0.15;
      this.greninja.y += (target.y - this.greninja.y) * 0.15;
    }

    let showPrompt = false;
    if (!this.dialogueSystem.active) {
      for (const npc of this.npcs) {
        if (npc.isPlayerNearby(this.player)) {
          this.interactPrompt.setPosition(npc.x - 10, npc.y - 14);
          showPrompt = true;
          break;
        }
      }
    }
    this.interactPrompt.setVisible(showPrompt);
  }
}
