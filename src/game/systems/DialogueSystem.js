export default class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.currentNPC = null;
    this.lastKey = null;
    this.onDialogueStart = null;
    this.onDialogueLine = null;
    this.onDialogueEnd = null;
  }

  startDialogue(npc) {
    if (this.active) return;
    this.active = true;
    this.currentNPC = npc;
    npc.resetDialogue();

    if (this.onDialogueStart) this.onDialogueStart(npc.dialogueKey);
    this.showNextLine();
  }

  showNextLine() {
    if (!this.currentNPC) return;
    const line = this.currentNPC.getNextLine();

    if (this.currentNPC.currentLine === 0) {
      // We've looped back to the start — end dialogue after this last line
      if (this.onDialogueLine) this.onDialogueLine(line, true);
    } else {
      if (this.onDialogueLine) this.onDialogueLine(line, false);
    }
  }

  advance() {
    if (!this.active) return;

    if (this.currentNPC.currentLine === 0) {
      this.endDialogue();
    } else {
      this.showNextLine();
    }
  }

  endDialogue() {
    this.active = false;
    this.lastKey = this.currentNPC?.dialogueKey;
    this.currentNPC = null;
    if (this.onDialogueEnd) this.onDialogueEnd();
  }
}
