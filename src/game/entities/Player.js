import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 120;

  constructor(scene, x, y) {
    super(scene, x, y, "player", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setSize(12, 12);
    this.setOffset(2, 4);
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    this.direction = "down";
    this.isMoving = false;
    this.frozen = false;

    this.createAnimations(scene);

    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
      arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
      arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
      arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    this.interactKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.positionHistory = [];
  }

  createAnimations(scene) {
    const dirs = [
      { key: "down", row: 0 },
      { key: "left", row: 1 },
      { key: "right", row: 2 },
      { key: "up", row: 3 },
    ];
    for (const { key, row } of dirs) {
      if (!scene.anims.exists(`player_walk_${key}`)) {
        scene.anims.create({
          key: `player_walk_${key}`,
          frames: scene.anims.generateFrameNumbers("player", {
            start: row * 4,
            end: row * 4 + 3,
          }),
          frameRate: 8,
          repeat: -1,
        });
      }
      if (!scene.anims.exists(`player_idle_${key}`)) {
        scene.anims.create({
          key: `player_idle_${key}`,
          frames: [{ key: "player", frame: row * 4 }],
          frameRate: 1,
        });
      }
    }
  }

  freeze() {
    this.frozen = true;
    this.setVelocity(0, 0);
    this.play(`player_idle_${this.direction}`, true);
  }

  unfreeze() {
    this.frozen = false;
  }

  getFacingTile() {
    const offsets = {
      up: { x: 0, y: -16 },
      down: { x: 0, y: 16 },
      left: { x: -16, y: 0 },
      right: { x: 16, y: 0 },
    };
    const off = offsets[this.direction];
    return { x: this.x + off.x, y: this.y + off.y };
  }

  update() {
    if (this.frozen) return;

    const speed = Player.SPEED;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.cursors.arrowLeft.isDown) {
      vx = -speed;
      this.direction = "left";
    } else if (this.cursors.right.isDown || this.cursors.arrowRight.isDown) {
      vx = speed;
      this.direction = "right";
    }

    if (this.cursors.up.isDown || this.cursors.arrowUp.isDown) {
      vy = -speed;
      this.direction = "up";
    } else if (this.cursors.down.isDown || this.cursors.arrowDown.isDown) {
      vy = speed;
      this.direction = "down";
    }

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      const factor = Math.SQRT1_2;
      vx *= factor;
      vy *= factor;
    }

    this.setVelocity(vx, vy);
    this.isMoving = vx !== 0 || vy !== 0;

    if (this.isMoving) {
      this.play(`player_walk_${this.direction}`, true);
      this.positionHistory.unshift({ x: this.x, y: this.y });
      if (this.positionHistory.length > 20) this.positionHistory.pop();
    } else {
      this.play(`player_idle_${this.direction}`, true);
    }
  }
}
