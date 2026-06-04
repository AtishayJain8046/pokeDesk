# Trainer Atishay — Pokemon Portfolio

A Gen 3 GBA-style Pokemon portfolio website where visitors play as **Trainer Atishay** and explore Pallet Town to discover his resume, projects, skills, and experience.

**[Live Demo →](#)** *(add your Vercel URL after deploying)*

![Pokemon Portfolio](https://img.shields.io/badge/Built_With-Phaser_3_+_React_18-185FA5?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square) ![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square)

---

## What Is This?

Instead of a traditional portfolio page, this is a fully playable **top-down RPG** built with Phaser 3 and React. Walk around Pallet Town, enter buildings, talk to NPCs and Pokemon, and discover everything about me — my projects, internships, skills, and contact links — all through gameplay.

**Tone:** Professional but immersive. Not a gimmick — a genuinely explorable world.

---

## The World

```
                  ┌─────────────┐
                  │  Oak's Lab  │  ← 4 projects as Pokemon
                  │  (AI Lab)   │
                  └──────┬──────┘
                         │
    ┌──────────┐    ┌────┴───────┐    ┌─────────────┐
    │ Trainer  │────│  Pallet    │────│ Experience  │
    │   Gym    │    │   Town     │    │     HQ      │
    │ (Hobbies)│    │ (Centre)   │    │(Internships)│
    └──────────┘    └─────┬──────┘    └─────────────┘
                          │
   ┌─────────────┐   ┌───┴────┐   ┌──────────────┐
   │  Atishay's  │   │Snorlax │   │   Pokemon    │
   │   House     │   │blocking│   │   Center     │
   └─────────────┘   └───┬────┘   │  (Socials)   │
                          │        └──────────────┘
                    ┌─────┴──────┐
                    │  Route 1   │  ← Contact modal
                    └────────────┘
```

### Buildings

| Building | What's Inside |
|---|---|
| **Oak's AI Lab** | 4 project stations — talk to Mewtwo (MemGraph AI), Charizard (MicroGPT), Alakazam (DocRAG), Jigglypuff (Audio Recognition). Each shows project details + GitHub link. |
| **Experience HQ** | All 3 internships in one place — Mirav Labs (AI Research), ISFCR (Cloud Security), Embrione (Logistics Head). |
| **Trainer Gym** | Hobbies and personality — gym, Balatro, Slay the Spire, Valorant. |
| **Atishay's House** | Mom NPC with personal dialogue and life details. |
| **Pokemon Center** | Social links hub — LinkedIn, GitHub, Email, Resume download. |

### Key Interactions

- **Snorlax** blocks the path south. Talk to it → play the Poke Flute → it wakes up → contact modal with LinkedIn, GitHub, Email, and resume download.
- **Oak's Lab Pokemon** — walk up and press SPACE to learn about each project, then click "View on GitHub" to visit the repo.
- **Save Game** — downloads the resume PDF. Available in the sidebar and contact modals.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Game engine | **Phaser 3** — physics, sprites, tilemaps, camera, scene management |
| UI / overlays | **React 18** — sidebar, dialogue boxes, modals, project cards |
| Pixel art | **Procedurally generated** — all sprites drawn via Canvas API in BootScene |
| Audio | **Howler.js** — 8-bit BGM + SFX, also procedurally generated |
| Build | **Vite** |
| Hosting | **Vercel** (static) |

No backend. No external assets. Everything is generated at runtime.

---

## Project Structure

```
portfolio/
├── public/
│   └── resume/
│       └── AtishayJain_Resume_v2.pdf
├── src/
│   ├── game/
│   │   ├── scenes/
│   │   │   ├── BootScene.js          ← Sprite generation (all pixel art)
│   │   │   ├── IntroScene.js         ← Boot screen + Oak intro
│   │   │   ├── PalletTownScene.js    ← Main overworld
│   │   │   ├── OaksLabScene.js       ← Projects (Pokemon stations)
│   │   │   ├── ExperienceHQScene.js  ← All internships
│   │   │   ├── TrainerGymScene.js    ← Hobbies
│   │   │   ├── AtishayHouseScene.js  ← Personal
│   │   │   └── PokeCenterScene.js    ← Socials hub
│   │   ├── entities/
│   │   │   ├── Player.js             ← Movement, animation, input
│   │   │   └── NPC.js                ← Interaction zones, dialogue
│   │   └── systems/
│   │       ├── DialogueSystem.js     ← Typewriter text, advance/end
│   │       └── TransitionSystem.js   ← Scene fade transitions
│   ├── ui/
│   │   ├── Sidebar.jsx               ← 4-tab sidebar
│   │   ├── TrainerCard.jsx           ← Profile info
│   │   ├── Pokedex.jsx               ← Skills as Pokemon entries
│   │   ├── ExperienceTab.jsx         ← Internship timeline
│   │   ├── DialogueBox.jsx           ← Typewriter overlay
│   │   ├── ProjectCard.jsx           ← Project detail + GitHub link
│   │   ├── SocialsPanel.jsx          ← LinkedIn/GitHub/Email/Resume
│   │   ├── SnorlaxModal.jsx          ← Poke Flute + contact modal
│   │   ├── AudioToggle.jsx           ← 8-bit BGM/SFX toggle
│   │   └── MobileDpad.jsx            ← Touch controls
│   ├── data/
│   │   ├── trainer.js                ← Personal info
│   │   ├── projects.js               ← 4 projects
│   │   ├── skills.js                 ← 9 skill entries
│   │   ├── experience.js             ← 3 internships
│   │   └── npcDialogue.js            ← All NPC text
│   ├── App.jsx                        ← Phaser + React bridge
│   ├── main.jsx                       ← Entry point
│   └── index.css                      ← All styles
├── index.html
├── vite.config.js
└── package.json
```

---

## Run Locally

```bash
# Clone
git clone https://github.com/atishayjain8046/portfolio.git
cd portfolio

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

Open `http://localhost:5173` and start exploring.

---

## Controls

| Input | Action |
|---|---|
| `WASD` or `Arrow keys` | Move |
| `SPACE` | Interact with NPCs / advance dialogue |
| Click dialogue box | Advance or skip typewriter |
| `♪` button (top-left) | Toggle 8-bit audio |
| Mobile: D-pad + A button | Touch controls on small screens |

---

## Deploy

```bash
npm i -g vercel
vercel --prod
```

Or connect the GitHub repo to [Vercel](https://vercel.com) for auto-deploy on every push.

---

## Customizing

All content lives in `src/data/`. Edit these files to update:

- **`trainer.js`** — name, university, CGPA, links, bio
- **`projects.js`** — project details, tech stacks, GitHub URLs
- **`skills.js`** — skill names, levels, Pokemon mappings
- **`experience.js`** — internships, roles, bullet points
- **`npcDialogue.js`** — every line of NPC text

Drop your actual resume at `public/resume/AtishayJain_Resume_v2.pdf`.

---

## Visual Identity

| Property | Value |
|---|---|
| Era | Gen 3 GBA style |
| Primary palette | Dark navy `#0a1628`, Water blue `#185FA5` |
| Accents | Mint `#4ecfa0`, Sky `#7ecfff`, Amber `#f0a020` |
| Fonts | Press Start 2P (pixel headings), Inter (body text) |
| Tile size | 16x16px, camera zoom 2.5x |
| Starter | Greninja (Water / Dark) |

---

## Credits

Built by **Atishay Jain** with assistance from Claude.

Pokemon is a trademark of Nintendo / Game Freak / Creatures Inc. This is a fan-inspired portfolio project for personal and educational use only. No official Pokemon assets are used — all sprites are original pixel art generated programmatically.
