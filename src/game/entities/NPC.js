import Phaser from "phaser";

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, dialogueKey, dialogueLines) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.setSize(14, 14);
    this.setOffset(1, 1);
    this.setDepth(9);
    this.setImmovable(true);

    this.dialogueKey = dialogueKey;
    this.dialogueLines = dialogueLines;
    this.currentLine = 0;

    this.interactionZone = scene.add.zone(x, y, 32, 32);
    scene.physics.add.existing(this.interactionZone, true);
  }

  getNextLine() {
    const line = this.dialogueLines[this.currentLine];
    this.currentLine = (this.currentLine + 1) % this.dialogueLines.length;
    return line;
  }

  resetDialogue() {
    this.currentLine = 0;
  }

  isPlayerNearby(player) {
    return Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) < 28;
  }
}
