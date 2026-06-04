import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.generateAllSprites();
  }

  px(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  generateAllSprites() {
    this.generatePlayerSheet();
    this.generateGreninjaSheet();
    this.generateNPCSprites();
    this.generatePokemonSprites();
    this.generateTileSprites();
    this.generateBuildingTiles();
    this.generateDecorations();
  }

  // ─── Player: boy trainer with blue cap, blue jacket ───
  generatePlayerSheet() {
    const W = 16, H = 16, COLS = 4, ROWS = 4;
    const c = document.createElement("canvas");
    c.width = W * COLS;
    c.height = H * ROWS;
    const ctx = c.getContext("2d");

    const drawFrame = (col, row, walkOffset) => {
      const ox = col * W, oy = row * H;
      const skin = "#f5c8a0";
      const hair = "#3a2518";
      const cap = "#185FA5";
      const capLight = "#2980d0";
      const shirt = "#185FA5";
      const shirtLight = "#2a8fe0";
      const pants = "#1a1a3e";
      const shoe = "#333";
      const eye = "#222";
      const wobble = walkOffset % 2 === 1 ? 1 : 0;

      // directions: 0=down, 1=left, 2=right, 3=up
      // Cap
      if (row === 3) {
        // facing up — show back of cap
        this.rect(ctx, ox + 4, oy + 1, 8, 3, cap);
        this.rect(ctx, ox + 5, oy + 0, 6, 1, cap);
        this.rect(ctx, ox + 5, oy + 1, 6, 2, capLight);
        // hair below cap
        this.rect(ctx, ox + 4, oy + 3, 8, 2, hair);
      } else {
        // cap brim
        this.rect(ctx, ox + 3, oy + 2, 10, 2, cap);
        this.rect(ctx, ox + 4, oy + 0, 8, 2, cap);
        this.rect(ctx, ox + 5, oy + 0, 6, 1, capLight);
        // hair sides
        this.rect(ctx, ox + 3, oy + 3, 2, 2, hair);
        this.rect(ctx, ox + 11, oy + 3, 2, 2, hair);
      }

      // Face
      this.rect(ctx, ox + 5, oy + 3, 6, 4, skin);
      // Eyes (direction dependent)
      if (row === 0) { // down
        this.px(ctx, ox + 6, oy + 5, eye);
        this.px(ctx, ox + 9, oy + 5, eye);
        // mouth
        this.px(ctx, ox + 7, oy + 6, "#d48a70");
        this.px(ctx, ox + 8, oy + 6, "#d48a70");
      } else if (row === 1) { // left
        this.px(ctx, ox + 5, oy + 5, eye);
        this.px(ctx, ox + 7, oy + 5, eye);
      } else if (row === 2) { // right
        this.px(ctx, ox + 8, oy + 5, eye);
        this.px(ctx, ox + 10, oy + 5, eye);
      }
      // up = no face

      // Shirt / body
      this.rect(ctx, ox + 4, oy + 7, 8, 4, shirt);
      this.rect(ctx, ox + 5, oy + 7, 6, 3, shirtLight);
      // arms
      this.rect(ctx, ox + 3, oy + 8, 1, 3, skin);
      this.rect(ctx, ox + 12, oy + 8, 1, 3, skin);

      // Pants
      this.rect(ctx, ox + 5, oy + 11, 3, 2, pants);
      this.rect(ctx, ox + 8, oy + 11, 3, 2, pants);

      // Shoes with walk animation
      if (wobble) {
        this.rect(ctx, ox + 4, oy + 13, 3, 2, shoe);
        this.rect(ctx, ox + 9, oy + 13, 3, 2, shoe);
      } else {
        this.rect(ctx, ox + 5, oy + 13, 3, 2, shoe);
        this.rect(ctx, ox + 8, oy + 13, 3, 2, shoe);
      }
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawFrame(col, row, col);
      }
    }

    this.textures.addSpriteSheet("player", c, { frameWidth: W, frameHeight: H });
  }

  // ─── Greninja follower ───
  generateGreninjaSheet() {
    const W = 16, H = 16, COLS = 4, ROWS = 4;
    const c = document.createElement("canvas");
    c.width = W * COLS;
    c.height = H * ROWS;
    const ctx = c.getContext("2d");

    const drawFrame = (col, row, wo) => {
      const ox = col * W, oy = row * H;
      const body = "#2a4a7f";
      const belly = "#7ecfff";
      const tongue = "#ff4060";
      const eye = "#cc2222";
      const eyeW = "#fff";
      const dark = "#1a2a50";

      // Head
      this.rect(ctx, ox + 4, oy + 1, 8, 6, body);
      this.rect(ctx, ox + 3, oy + 2, 10, 4, body);
      // "ears" / head fins
      this.rect(ctx, ox + 2, oy + 0, 2, 3, dark);
      this.rect(ctx, ox + 12, oy + 0, 2, 3, dark);

      if (row !== 3) { // not facing up
        // eyes
        this.rect(ctx, ox + 5, oy + 3, 2, 2, eyeW);
        this.rect(ctx, ox + 9, oy + 3, 2, 2, eyeW);
        this.px(ctx, ox + 6, oy + 3, eye);
        this.px(ctx, ox + 10, oy + 3, eye);
      }
      if (row === 0) { // facing down — tongue scarf
        this.rect(ctx, ox + 7, oy + 6, 2, 1, tongue);
        this.rect(ctx, ox + 3, oy + 5, 3, 2, tongue);
        this.rect(ctx, ox + 10, oy + 5, 3, 2, tongue);
      }

      // Body
      this.rect(ctx, ox + 5, oy + 7, 6, 4, body);
      this.rect(ctx, ox + 6, oy + 7, 4, 3, belly);

      // Legs
      const legShift = wo % 2 === 1 ? 1 : 0;
      this.rect(ctx, ox + 4 + legShift, oy + 11, 3, 3, body);
      this.rect(ctx, ox + 9 - legShift, oy + 11, 3, 3, body);
      // feet
      this.rect(ctx, ox + 3 + legShift, oy + 13, 4, 2, dark);
      this.rect(ctx, ox + 9 - legShift, oy + 13, 4, 2, dark);
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawFrame(col, row, col);
      }
    }

    this.textures.addSpriteSheet("greninja", c, { frameWidth: W, frameHeight: H });
  }

  // ─── NPC sprites ───
  generateNPCSprites() {
    const npcs = {
      npc_oak: { coat: "#f5f0e0", shirt: "#8B4513", hair: "#888", skin: "#f0c090", pants: "#5a3a1a" },
      npc_mom: { coat: "#ff90b0", shirt: "#e06080", hair: "#8B4513", skin: "#f5c8a0", pants: "#4a3060" },
      npc_villager: { coat: "#4ecfa0", shirt: "#2a9060", hair: "#444", skin: "#f5c8a0", pants: "#2a4070" },
      npc_villager_f: { coat: "#f0a0d0", shirt: "#c070a0", hair: "#8B4513", skin: "#f5c8a0", pants: "#6a3050" },
      npc_guard: { coat: "#f0a020", shirt: "#c08010", hair: "#222", skin: "#d4a070", pants: "#333" },
      npc_snorlax: { isSnorlax: true },
      npc_researcher: { coat: "#e8e8e8", shirt: "#7ecfff", hair: "#555", skin: "#f5c8a0", pants: "#3a5080" },
      npc_kid: { coat: "#f0d040", shirt: "#d0b020", hair: "#222", skin: "#f5c8a0", pants: "#3060a0", isSmall: true },
    };

    for (const [name, cfg] of Object.entries(npcs)) {
      const c = document.createElement("canvas");
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext("2d");

      if (cfg.isSnorlax) {
        this.drawSnorlax(ctx);
      } else {
        this.drawNPCCharacter(ctx, cfg);
      }

      this.textures.addImage(name, c);
    }
  }

  drawNPCCharacter(ctx, cfg) {
    const yOff = cfg.isSmall ? 3 : 0;
    // Hair/head
    this.rect(ctx, 4, yOff + 0, 8, 3, cfg.hair);
    this.rect(ctx, 3, yOff + 1, 10, 2, cfg.hair);
    // Face
    this.rect(ctx, 5, yOff + 3, 6, 3, cfg.skin);
    this.rect(ctx, 4, yOff + 3, 8, 2, cfg.skin);
    // Eyes
    this.px(ctx, 6, yOff + 4, "#222");
    this.px(ctx, 9, yOff + 4, "#222");
    // Body
    this.rect(ctx, 4, yOff + 6, 8, 4, cfg.coat);
    this.rect(ctx, 5, yOff + 7, 6, 2, cfg.shirt);
    // Arms
    this.rect(ctx, 3, yOff + 7, 1, 3, cfg.skin);
    this.rect(ctx, 12, yOff + 7, 1, 3, cfg.skin);
    // Pants
    this.rect(ctx, 5, yOff + 10, 3, 2, cfg.pants);
    this.rect(ctx, 8, yOff + 10, 3, 2, cfg.pants);
    // Shoes
    this.rect(ctx, 5, yOff + 12, 3, 2, "#333");
    this.rect(ctx, 8, yOff + 12, 3, 2, "#333");
  }

  drawSnorlax(ctx) {
    // big round body
    this.rect(ctx, 2, 2, 12, 12, "#2d5a3d");
    this.rect(ctx, 3, 1, 10, 13, "#2d5a3d");
    this.rect(ctx, 1, 4, 14, 8, "#2d5a3d");
    // belly
    this.rect(ctx, 4, 5, 8, 7, "#a8c8a0");
    this.rect(ctx, 5, 4, 6, 9, "#a8c8a0");
    // face
    this.rect(ctx, 5, 2, 6, 3, "#2d5a3d");
    // closed eyes (sleeping)
    this.rect(ctx, 5, 3, 2, 1, "#111");
    this.rect(ctx, 9, 3, 2, 1, "#111");
    // mouth
    this.px(ctx, 7, 4, "#111");
    this.px(ctx, 8, 4, "#111");
    // claws/feet
    this.rect(ctx, 2, 12, 3, 2, "#1a3a2a");
    this.rect(ctx, 11, 12, 3, 2, "#1a3a2a");
    // Zzz
    this.px(ctx, 13, 1, "#fff");
    this.px(ctx, 14, 0, "#fff");
  }

  // ─── Pokémon sprites (16x16 each) ───
  generatePokemonSprites() {
    // Mewtwo — MemGraph AI (Legendary, Psychic purple)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      const body = "#c8a8e8";
      const belly = "#e0d0f0";
      const tail = "#9070c0";
      const eye = "#7030a0";
      // Tail (behind)
      this.rect(ctx, 2, 8, 2, 6, tail);
      this.rect(ctx, 1, 6, 2, 3, tail);
      this.px(ctx, 0, 5, tail);
      // Body
      this.rect(ctx, 5, 4, 6, 8, body);
      this.rect(ctx, 4, 5, 8, 6, body);
      // Belly
      this.rect(ctx, 6, 6, 4, 5, belly);
      // Head
      this.rect(ctx, 5, 1, 6, 4, body);
      this.rect(ctx, 6, 0, 4, 2, body);
      // Horns
      this.rect(ctx, 4, 0, 2, 2, tail);
      this.rect(ctx, 10, 0, 2, 2, tail);
      // Eyes
      this.rect(ctx, 6, 2, 2, 2, "#fff");
      this.rect(ctx, 9, 2, 2, 2, "#fff");
      this.px(ctx, 7, 3, eye);
      this.px(ctx, 10, 3, eye);
      // Legs
      this.rect(ctx, 5, 12, 2, 3, body);
      this.rect(ctx, 9, 12, 2, 3, body);
      this.rect(ctx, 4, 14, 3, 1, tail);
      this.rect(ctx, 9, 14, 3, 1, tail);
      // Arm tube
      this.rect(ctx, 12, 5, 2, 4, body);
      this.px(ctx, 13, 4, body);
      // Glow
      this.px(ctx, 7, 1, "#e0c0ff");
      this.textures.addImage("pkmn_mewtwo", c);
    }

    // Charizard — MicroGPT (Rare, Fire)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      const body = "#e08030";
      const belly = "#f0c868";
      const wing = "#40a0a0";
      const dark = "#b06020";
      // Wings
      this.rect(ctx, 0, 2, 4, 6, wing);
      this.rect(ctx, 1, 1, 3, 2, wing);
      this.rect(ctx, 12, 2, 4, 6, wing);
      this.rect(ctx, 12, 1, 3, 2, wing);
      // Body
      this.rect(ctx, 5, 4, 6, 7, body);
      this.rect(ctx, 4, 5, 8, 5, body);
      // Belly
      this.rect(ctx, 6, 6, 4, 4, belly);
      // Head
      this.rect(ctx, 5, 1, 6, 4, body);
      this.rect(ctx, 6, 0, 4, 2, body);
      // Horns
      this.px(ctx, 5, 0, dark);
      this.px(ctx, 10, 0, dark);
      // Eyes
      this.rect(ctx, 6, 2, 2, 1, "#fff");
      this.rect(ctx, 9, 2, 2, 1, "#fff");
      this.px(ctx, 7, 2, "#2050a0");
      this.px(ctx, 10, 2, "#2050a0");
      // Tail flame
      this.rect(ctx, 3, 10, 2, 3, body);
      this.rect(ctx, 2, 9, 2, 2, "#f04030");
      this.px(ctx, 1, 8, "#f0d040");
      this.px(ctx, 3, 8, "#f0d040");
      // Legs
      this.rect(ctx, 5, 11, 3, 4, body);
      this.rect(ctx, 9, 11, 3, 4, body);
      this.rect(ctx, 5, 14, 3, 1, dark);
      this.rect(ctx, 9, 14, 3, 1, dark);
      this.textures.addImage("pkmn_charizard", c);
    }

    // Alakazam — DocRAG (Uncommon, Psychic)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      const body = "#d0a040";
      const dark = "#a07830";
      const armor = "#8a6020";
      // Body
      this.rect(ctx, 5, 5, 6, 6, body);
      this.rect(ctx, 4, 6, 8, 4, body);
      // Head (large)
      this.rect(ctx, 4, 0, 8, 6, body);
      this.rect(ctx, 3, 1, 10, 4, body);
      // Mustache
      this.rect(ctx, 2, 4, 3, 2, dark);
      this.rect(ctx, 11, 4, 3, 2, dark);
      this.rect(ctx, 1, 5, 2, 1, dark);
      this.rect(ctx, 13, 5, 2, 1, dark);
      // Eyes
      this.rect(ctx, 5, 2, 2, 2, "#fff");
      this.rect(ctx, 9, 2, 2, 2, "#fff");
      this.px(ctx, 6, 3, "#c03030");
      this.px(ctx, 10, 3, "#c03030");
      // Armor
      this.rect(ctx, 5, 6, 6, 2, armor);
      // Spoons
      this.rect(ctx, 1, 6, 2, 1, "#d0d0d0");
      this.rect(ctx, 0, 5, 2, 2, "#e0e0e0");
      this.rect(ctx, 13, 6, 2, 1, "#d0d0d0");
      this.rect(ctx, 14, 5, 2, 2, "#e0e0e0");
      // Legs
      this.rect(ctx, 5, 11, 2, 4, body);
      this.rect(ctx, 9, 11, 2, 4, body);
      this.rect(ctx, 5, 14, 2, 1, dark);
      this.rect(ctx, 9, 14, 2, 1, dark);
      // Feet
      this.rect(ctx, 4, 14, 3, 1, dark);
      this.rect(ctx, 9, 14, 3, 1, dark);
      this.textures.addImage("pkmn_alakazam", c);
    }

    // Jigglypuff — Audio Recognition (Unique, Normal/Fairy)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      const body = "#ffa0b0";
      const light = "#ffc8d0";
      const dark = "#e07080";
      // Body (round)
      this.rect(ctx, 3, 3, 10, 10, body);
      this.rect(ctx, 2, 4, 12, 8, body);
      this.rect(ctx, 4, 2, 8, 12, body);
      // Highlight
      this.rect(ctx, 4, 3, 4, 3, light);
      // Hair curl
      this.rect(ctx, 6, 0, 4, 3, body);
      this.rect(ctx, 7, 0, 2, 1, dark);
      this.px(ctx, 5, 1, dark);
      this.px(ctx, 10, 1, dark);
      // Eyes (big cute)
      this.rect(ctx, 4, 5, 3, 3, "#fff");
      this.rect(ctx, 9, 5, 3, 3, "#fff");
      this.rect(ctx, 5, 6, 2, 2, "#40a0c0");
      this.rect(ctx, 10, 6, 2, 2, "#40a0c0");
      this.px(ctx, 6, 6, "#206080");
      this.px(ctx, 11, 6, "#206080");
      // Highlight in eyes
      this.px(ctx, 5, 6, "#fff");
      this.px(ctx, 10, 6, "#fff");
      // Mouth (singing)
      this.rect(ctx, 6, 9, 4, 2, dark);
      this.rect(ctx, 7, 9, 2, 1, "#fff");
      // Ears
      this.px(ctx, 2, 3, dark);
      this.px(ctx, 1, 2, dark);
      this.px(ctx, 13, 3, dark);
      this.px(ctx, 14, 2, dark);
      // Feet
      this.rect(ctx, 4, 13, 3, 2, body);
      this.rect(ctx, 9, 13, 3, 2, body);
      // Music notes (singing!)
      this.px(ctx, 14, 4, "#40c060");
      this.px(ctx, 15, 3, "#40c060");
      this.px(ctx, 0, 6, "#4080e0");
      this.textures.addImage("pkmn_jigglypuff", c);
    }
  }

  // ─── Tile sprites ───
  generateTileSprites() {
    // Grass variants
    for (let v = 0; v < 4; v++) {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      const greens = ["#5a9a3a", "#4a8a2a", "#6aaa4a", "#509030"];
      this.rect(ctx, 0, 0, 16, 16, greens[v]);
      // grass blades
      const detailColor = v % 2 === 0 ? "#6ab04a" : "#4a9030";
      const spots = [[2, 3], [7, 1], [12, 5], [4, 10], [9, 13], [14, 8], [1, 7], [10, 2]];
      for (const [sx, sy] of spots.slice(0, 3 + v)) {
        this.px(ctx, sx, sy, detailColor);
        this.px(ctx, sx + 1, sy + 1, detailColor);
      }
      this.textures.addImage(`tile_grass_${v}`, c);
    }

    // Tall grass
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#4a8a2a");
      for (let i = 0; i < 8; i++) {
        const gx = (i * 4 + 1) % 14;
        this.rect(ctx, gx, 2, 1, 6, "#3a7a1a");
        this.rect(ctx, gx + 1, 0, 1, 5, "#6aba4a");
        this.rect(ctx, gx, 8, 1, 6, "#3a7a1a");
        this.rect(ctx, gx + 1, 7, 1, 5, "#6aba4a");
      }
      this.textures.addImage("tile_tallgrass", c);
    }

    // Path
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d4b87a");
      this.rect(ctx, 1, 1, 14, 14, "#e0c890");
      // texture
      this.px(ctx, 3, 3, "#c8b070");
      this.px(ctx, 8, 6, "#c8b070");
      this.px(ctx, 12, 11, "#c8b070");
      this.px(ctx, 5, 13, "#c8b070");
      this.textures.addImage("tile_path", c);
    }

    // Water
    for (let v = 0; v < 2; v++) {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#2070c0");
      this.rect(ctx, 1, 1, 14, 14, "#3088d0");
      // wave lines
      const wOff = v * 4;
      for (let i = 0; i < 3; i++) {
        const wy = 3 + i * 5 + wOff % 3;
        this.rect(ctx, 2, wy, 4, 1, "#60b0e8");
        this.rect(ctx, 9, wy + 2, 5, 1, "#60b0e8");
      }
      this.textures.addImage(`tile_water_${v}`, c);
    }

    // Fence horizontal
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#5a9a3a"); // grass bg
      this.rect(ctx, 0, 5, 16, 2, "#9a7a50");
      this.rect(ctx, 0, 9, 16, 2, "#9a7a50");
      // posts
      this.rect(ctx, 1, 3, 2, 10, "#8a6a40");
      this.rect(ctx, 13, 3, 2, 10, "#8a6a40");
      // highlight
      this.rect(ctx, 0, 5, 16, 1, "#b09060");
      this.rect(ctx, 0, 9, 16, 1, "#b09060");
      this.textures.addImage("tile_fence", c);
    }

    // Ledge / cliff
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#5a7050");
      this.rect(ctx, 0, 0, 16, 4, "#6a8060");
      this.rect(ctx, 0, 14, 16, 2, "#3a5030");
      this.textures.addImage("tile_ledge", c);
    }

    // Floor (interior)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d8c8a0");
      this.rect(ctx, 0, 0, 8, 8, "#ddd0a8");
      this.rect(ctx, 8, 8, 8, 8, "#ddd0a8");
      this.rect(ctx, 0, 0, 16, 1, "#c8b890");
      this.rect(ctx, 0, 0, 1, 16, "#c8b890");
      this.textures.addImage("tile_floor", c);
    }

    // Lab floor
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#e0e8f0");
      this.rect(ctx, 0, 0, 8, 8, "#e8f0f8");
      this.rect(ctx, 8, 8, 8, 8, "#e8f0f8");
      this.rect(ctx, 0, 0, 16, 1, "#d0d8e0");
      this.rect(ctx, 0, 0, 1, 16, "#d0d8e0");
      this.textures.addImage("tile_lab_floor", c);
    }
  }

  // ─── Building parts ───
  generateBuildingTiles() {
    // House wall
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#c0a880");
      this.rect(ctx, 1, 1, 14, 14, "#d0b890");
      // brick lines
      this.rect(ctx, 0, 4, 16, 1, "#b09870");
      this.rect(ctx, 0, 8, 16, 1, "#b09870");
      this.rect(ctx, 0, 12, 16, 1, "#b09870");
      this.rect(ctx, 8, 0, 1, 4, "#b09870");
      this.rect(ctx, 4, 4, 1, 4, "#b09870");
      this.rect(ctx, 12, 4, 1, 4, "#b09870");
      this.textures.addImage("tile_wall", c);
    }

    // Lab wall
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#c0c8d8");
      this.rect(ctx, 1, 1, 14, 14, "#d0d8e8");
      this.rect(ctx, 0, 8, 16, 1, "#b0b8c8");
      this.textures.addImage("tile_lab_wall", c);
    }

    // Roof (red/brown)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#b03030");
      // shingle pattern
      for (let y = 0; y < 16; y += 4) {
        const off = (y / 4) % 2 === 0 ? 0 : 4;
        for (let x = off; x < 16; x += 8) {
          this.rect(ctx, x, y, 8, 4, "#c04040");
          this.rect(ctx, x, y, 8, 1, "#d05050");
        }
      }
      this.textures.addImage("tile_roof", c);
    }

    // Blue roof (lab)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#2a5090");
      for (let y = 0; y < 16; y += 4) {
        const off = (y / 4) % 2 === 0 ? 0 : 4;
        for (let x = off; x < 16; x += 8) {
          this.rect(ctx, x, y, 8, 4, "#3060a0");
          this.rect(ctx, x, y, 8, 1, "#4070b0");
        }
      }
      this.textures.addImage("tile_roof_blue", c);
    }

    // Window
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d0b890"); // wall bg
      // window frame
      this.rect(ctx, 3, 2, 10, 10, "#6a5a40");
      this.rect(ctx, 4, 3, 8, 8, "#90c8f0");
      // cross
      this.rect(ctx, 7, 3, 2, 8, "#6a5a40");
      this.rect(ctx, 4, 6, 8, 2, "#6a5a40");
      // light reflection
      this.rect(ctx, 5, 4, 2, 2, "#c0e8ff");
      // sill
      this.rect(ctx, 2, 12, 12, 2, "#8a7a60");
      this.textures.addImage("tile_window", c);
    }

    // Door
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d0b890"); // wall bg
      // door frame
      this.rect(ctx, 3, 2, 10, 14, "#5a4a30");
      this.rect(ctx, 4, 3, 8, 12, "#8a6a40");
      this.rect(ctx, 4, 3, 4, 12, "#9a7a50");
      // handle
      this.rect(ctx, 10, 9, 1, 2, "#f0d060");
      // step
      this.rect(ctx, 2, 14, 12, 2, "#a09080");
      this.textures.addImage("tile_door", c);
    }

    // Lab door (blue)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d0d8e8");
      this.rect(ctx, 3, 2, 10, 14, "#3060a0");
      this.rect(ctx, 4, 3, 8, 12, "#4080c0");
      this.rect(ctx, 4, 3, 4, 12, "#5090d0");
      this.rect(ctx, 10, 9, 1, 2, "#f0d060");
      this.rect(ctx, 2, 14, 12, 2, "#a0a8b8");
      this.textures.addImage("tile_lab_door", c);
    }

    // Pokémon Center roof (orange/red with cross)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#e04040");
      this.rect(ctx, 1, 1, 14, 14, "#e85050");
      // White cross
      this.rect(ctx, 6, 3, 4, 10, "#fff");
      this.rect(ctx, 3, 6, 10, 4, "#fff");
      this.textures.addImage("tile_roof_center", c);
    }

    // Pokémon Center wall (cream/white)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#e8d8c0");
      this.rect(ctx, 1, 1, 14, 14, "#f0e8d8");
      this.rect(ctx, 0, 8, 16, 1, "#d8c8b0");
      this.textures.addImage("tile_center_wall", c);
    }

    // Pokémon Center door (red sliding)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#f0e8d8");
      this.rect(ctx, 2, 1, 12, 14, "#e04040");
      this.rect(ctx, 3, 2, 10, 12, "#f06060");
      this.rect(ctx, 7, 2, 2, 12, "#c03030");
      this.rect(ctx, 2, 14, 12, 2, "#b0a090");
      this.textures.addImage("tile_center_door", c);
    }

    // Interior wall
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#a09080");
      this.rect(ctx, 0, 12, 16, 4, "#8a7a6a");
      this.rect(ctx, 0, 0, 16, 2, "#b0a090");
      this.textures.addImage("tile_int_wall", c);
    }

    // Rug
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d8c8a0");
      this.rect(ctx, 1, 1, 14, 14, "#c04040");
      this.rect(ctx, 2, 2, 12, 12, "#d06060");
      this.rect(ctx, 4, 4, 8, 8, "#c04040");
      this.textures.addImage("tile_rug", c);
    }

    // Machine / computer (for lab)
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#e0e8f0"); // floor bg
      this.rect(ctx, 2, 2, 12, 12, "#555");
      this.rect(ctx, 3, 3, 10, 7, "#2a8040");
      // screen glow
      this.rect(ctx, 4, 4, 8, 5, "#40c060");
      // text lines
      this.rect(ctx, 5, 5, 6, 1, "#80f0a0");
      this.rect(ctx, 5, 7, 4, 1, "#80f0a0");
      // base
      this.rect(ctx, 4, 11, 8, 3, "#444");
      this.textures.addImage("tile_machine", c);
    }

    // Bookshelf
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#6a5030");
      // shelves
      this.rect(ctx, 0, 5, 16, 1, "#5a4020");
      this.rect(ctx, 0, 10, 16, 1, "#5a4020");
      this.rect(ctx, 0, 15, 16, 1, "#5a4020");
      // books
      const bookColors = ["#c03030", "#3060c0", "#30a060", "#d0a030", "#8030a0"];
      for (let shelf = 0; shelf < 3; shelf++) {
        const sy = shelf * 5 + 1;
        for (let b = 0; b < 5; b++) {
          this.rect(ctx, 1 + b * 3, sy, 2, 4, bookColors[(b + shelf) % 5]);
        }
      }
      this.textures.addImage("tile_bookshelf", c);
    }

    // Table
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#d8c8a0"); // floor bg
      this.rect(ctx, 1, 4, 14, 8, "#8a6a40");
      this.rect(ctx, 2, 5, 12, 6, "#a08050");
      this.rect(ctx, 2, 12, 2, 4, "#7a5a30");
      this.rect(ctx, 12, 12, 2, 4, "#7a5a30");
      this.textures.addImage("tile_table", c);
    }
  }

  // ─── Decorations ───
  generateDecorations() {
    // Tree (16x32 — takes 2 vertical tiles)
    {
      const c = document.createElement("canvas");
      c.width = 16;
      c.height = 32;
      const ctx = c.getContext("2d");

      // Canopy (top tile)
      this.rect(ctx, 2, 0, 12, 4, "#2a7030");
      this.rect(ctx, 0, 4, 16, 8, "#3a8040");
      this.rect(ctx, 1, 2, 14, 8, "#3a8040");
      this.rect(ctx, 2, 1, 12, 4, "#4a9050");
      // highlights
      this.rect(ctx, 4, 2, 3, 2, "#5aaa60");
      this.rect(ctx, 9, 4, 4, 2, "#5aaa60");
      // shadow
      this.rect(ctx, 1, 10, 14, 2, "#2a6028");

      // Bottom half — trunk visible, more canopy
      this.rect(ctx, 0, 12, 16, 6, "#3a8040");
      this.rect(ctx, 1, 12, 14, 4, "#2a7030");
      // trunk
      this.rect(ctx, 6, 18, 4, 14, "#7a5a30");
      this.rect(ctx, 5, 18, 6, 2, "#6a4a20");
      this.rect(ctx, 7, 18, 2, 14, "#8a6a40");
      // roots
      this.rect(ctx, 4, 30, 8, 2, "#6a4a20");

      this.textures.addImage("deco_tree", c);
    }

    // Flower patches
    const flowerSets = [
      { name: "deco_flowers_red", petal: "#e04040", center: "#f0d040" },
      { name: "deco_flowers_blue", petal: "#4070d0", center: "#f0f0f0" },
      { name: "deco_flowers_yellow", petal: "#f0d040", center: "#e08020" },
    ];
    for (const { name, petal, center } of flowerSets) {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#5a9a3a"); // grass
      const spots = [[3, 3], [9, 2], [6, 8], [12, 10], [2, 12]];
      for (const [fx, fy] of spots) {
        this.px(ctx, fx, fy, petal);
        this.px(ctx, fx + 1, fy, petal);
        this.px(ctx, fx, fy + 1, petal);
        this.px(ctx, fx + 1, fy + 1, center);
      }
      this.textures.addImage(name, c);
    }

    // Sign
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#5a9a3a"); // grass bg
      // post
      this.rect(ctx, 7, 8, 2, 8, "#7a5a30");
      // sign board
      this.rect(ctx, 2, 2, 12, 7, "#c8a860");
      this.rect(ctx, 3, 3, 10, 5, "#e0c878");
      // text lines
      this.rect(ctx, 4, 4, 8, 1, "#6a5a40");
      this.rect(ctx, 4, 6, 6, 1, "#6a5a40");
      this.textures.addImage("deco_sign", c);
    }

    // Pokéball item on ground
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#5a9a3a");
      // ball
      this.rect(ctx, 5, 5, 6, 6, "#e03030");
      this.rect(ctx, 5, 8, 6, 3, "#f0f0f0");
      this.rect(ctx, 5, 7, 6, 2, "#333");
      this.rect(ctx, 7, 7, 2, 2, "#f0f0f0");
      this.textures.addImage("deco_pokeball", c);
    }

    // Mailbox
    {
      const c = this.makeTile();
      const ctx = c.getContext("2d");
      this.rect(ctx, 0, 0, 16, 16, "#5a9a3a");
      this.rect(ctx, 6, 6, 4, 10, "#7a5a30");
      this.rect(ctx, 4, 3, 8, 5, "#3060c0");
      this.rect(ctx, 5, 4, 6, 3, "#4080e0");
      this.rect(ctx, 4, 3, 8, 1, "#2050a0");
      this.textures.addImage("deco_mailbox", c);
    }
  }

  makeTile() {
    const c = document.createElement("canvas");
    c.width = 16;
    c.height = 16;
    return c;
  }

  create() {
    this.scene.start("Intro");
  }
}
