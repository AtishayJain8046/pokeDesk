export const npcDialogue = {
  oak: [
    "Ah, welcome! I am Prof. Oak — curator of Trainer Atishay's world.",
    "Atishay is a Computer Science student at PES University, Bengaluru.",
    "He specialises in AI/ML systems — particularly graph-augmented memory and RAG pipelines.",
    "His flagship project, MemGraph AI, is in the lab to the north. I'd recommend starting there.",
    "Oh — and Greninja is following him. His favourite. Of course.",
  ],

  mom: [
    "Welcome! Atishay's out exploring — probably optimising something.",
    "He loves Balatro and Slay the Spire. Says deck-building is basically systems design.",
    "He also hits the gym. Then comes home and writes PyTorch code. I don't understand either thing.",
    "He wants to be an AI/ML engineer. Building systems that actually understand context, not just retrieve it.",
  ],

  neighbour1: [
    "I heard Atishay plays Valorant. He says it trains his reaction time.",
    "I think he just likes shooting things. Don't tell him I said that.",
  ],

  neighbour2: [
    "His favourite Pokémon is Greninja. He even picked it as his starter on this portfolio.",
    "Consistency is a virtue, young trainer.",
  ],

  kidNPC: [
    "Atishay said Slay the Spire is basically gradient descent.",
    "You iterate on a strategy until the run converges.",
    "I have no idea what that means but it sounded really cool.",
  ],

  dreamerNPC: [
    "He's aiming to be an AI/ML engineer.",
    "Not just using LLMs — building the memory and reasoning layers underneath them.",
    "MemGraph AI is step one. There's more coming.",
  ],

  snorlax: [
    "Zzzzzz...",
    "*The Snorlax is deep asleep. It's blocking the path south.*",
    "*Maybe the Poké Flute would wake it?*",
  ],

  snorlaxAwoken: [
    "*The Snorlax yawns enormously...*",
    "*It rolls to the side. The road south is now open.*",
    "Yaaawn... Fine. Fine. You can pass.",
  ],

  cyberGuard: [
    "Halt! This is the ISFCR Cyber Outpost.",
    "Trainer Atishay just joined this June — onboarding in progress.",
    "Cloud infrastructure security operations are under construction.",
    "Come back soon. Big things are being built in there.",
  ],

  embrionNPC1: [
    "That hackathon last month was incredible!",
    "Atishay handled all the logistics. 100+ of us showed up and everything ran perfectly.",
  ],

  embrionNPC2: [
    "Promoted to Logistics Head in his first year.",
    "Coordinates vendors, procurement, cross-team timelines. All of it.",
  ],

  researcherMemGraph: [
    "Welcome to Station 1. This is Atishay's legendary project — MemGraph AI.",
    "The problem: vector RAG can't answer relational questions. 'What have I changed my mind about?' stumps it.",
    "Solution: a live Neo4j property graph + Qdrant vector store, fused via reciprocal rank fusion.",
    "The ontology has 7 node types and 10 edge types. Every conversation updates the graph in real time.",
    "See the GitHub for full architecture details.",
  ],

  researcherMicroGPT: [
    "Station 2. MicroGPT. Built entirely from scratch.",
    "Multi-head self-attention, positional encoding, transformer blocks — all hand-coded in PyTorch.",
    "No HuggingFace abstractions. Atishay wanted to understand it from first principles.",
    "Trained on Tiny Shakespeare. The model learned to write like the Bard.",
  ],

  researcherDocRAG: [
    "Station 3. Document Intelligence Chatbot.",
    "Production-style RAG: PDFs chunked, embedded, indexed into FAISS.",
    "Top-k retrieval injects context into the LLM. Chunk size carefully tuned for precision.",
    "Streamlit front-end. Real-time multi-turn querying over any uploaded document.",
  ],

  researcherAudio: [
    "Station 4. Audio Recognition System.",
    "Shazam, basically. Built from scratch.",
    "Spectrogram peak constellations → hashed into a reference database → query matched via hash lookup.",
    "Modular pipeline: preprocessing, fingerprint generation, and similarity matching are fully separate.",
  ],
};
