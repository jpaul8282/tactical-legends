[![CI](https://github.com/jurgen-paul/tactical-legends/actions/workflows/ci.yml/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

# Tactical Legends

[![CI](https://github.com/jurgen-paul/tactical-legends/actions/workflows/ci.yml/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## About

Tactical Legends is a strategy game built with C++ and SDL2. The project aims to deliver engaging tactical gameplay with modular, maintainable code.

## Features

- Turn-based tactical combat
- Modular codebase using CMake
- Cross-platform support
- SDL2-based graphics and audio
- Unit tests via CTest

## Installation

### Prerequisites

- CMake >= 3.x
- g++ >= 9.0
- SDL2, SDL2_image, SDL2_mixer, SDL2_ttf

### Setup

```bash
sudo apt update
sudo apt install cmake g++ libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev
git clone https://github.com/jurgen-paul/tactical-legends.git
cd tactical-legends


# Tactical Legends: Rise of OISTARIAN

Welcome to **Tactical Legends: Rise of OISTARIAN**! This project is a tactical turn-based strategy game built in C#. It is designed for strategy enthusiasts who enjoy deep gameplay, challenging AI, and immersive worlds.

---

## Project Overview

**Tactical Legends** is a turn-based tactical game where players control squads of unique characters across diverse battlefields. The game features:
- Deep strategic combat
- Rich lore and story-driven campaigns
- Customizable units and equipment
- Multiplayer and AI modes

The project is open source and welcomes contributions from the community.

---

## Installation Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/jurgen-paul/tactical-legends.git
   cd tactical-legends
   ```
2. **Install Dependencies**
   - Ensure you have [.NET SDK](https://dotnet.microsoft.com/download) installed.
   - Restore NuGet packages:
     ```sh
     dotnet restore
     ```
3. **Build the Project**
   ```sh
   dotnet build
   ```
4. **Run the Game**
   ```sh
   dotnet run
   ```

---

## Usage Guide

- Launch the game using the instructions above.
- Navigate the main menu to start a new campaign, skirmish, or multiplayer match.
- Use the mouse and keyboard to control your units and interact with the UI.
- For advanced options or modding, see the [Wiki](https://github.com/jurgen-paul/tactical-legends/wiki).

---

[![Gameplay Demo](https://img.youtube.com/vi/<VIDEO_ID>/0.jpg)](https://www.youtube.com/watch?v=<VIDEO_ID>)

![Gameplay GIF](docs/gameplay.gif)

## Contribution Guidelines

We welcome contributions! To get started:

1. **Fork the repository** and create your branch from `main`.
2. **Add your feature or fix** with clear code and comments.
3. **Test your changes** before submitting.
4. **Open a Pull Request** with a detailed description of what you changed.

**Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and check out the [Contributing Guide](CONTRIBUTING.md) (to be added).**

If you have questions or feature requests, open an [issue](https://github.com/jurgen-paul/tactical-legends/issues).

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

---

Happy strategizing!
Super Character Incoming: OISTARIAN
🔥 Character Profile: OISTARIAN
| Attribute | Description | 
| 🧠 Codename | OISTARIAN — “The Echo of Forgotten Wars” | 
| 🧬 Origin | Born in the ruins of the Orbital Institute of Strategic Tactics (OIST) | 
| 🕶️ Role | Tactical Commander / Emotional Recon Specialist | 
| 💥 Signature Gear | Dual-phase sniper rifle “Whisper & Roar” + Arm Module “NeuroPulse” | 
| 🧠 Emotional Lock | Cannot launch missions involving betrayal unless trust score > 80 | 
| 🎞️ Flashback Cue | “The corridor. The child. The silence.” | 

https://github.com/user-attachments/assets/13af01b5-07e8-469c-bec9-e04623771d17
🎮 Integration Plan
✅ Wire into Campaign Flow
- OISTARIAN becomes available after completing “Sand Echo” with a trauma score below 50.
- Unlocks hidden mission path: “Echo Protocol” — a stealth op with memory-triggered choices.
🎭 Emotional Branching Scene Generator
- Scene: “The Vault of Echoes”
- Branch A: Trust the voice — unlocks gear mod “Echo Shield”
- Branch B: Silence the voice — triggers flashback and locks “Final Liberation”
🛠️ Gear Upgrade UI with Animated Transitions
- UI Theme: Neural Pulse Grid
- Transitions:
- Fade-in gear holograms with pulse ripple
- Upgrade animations: gear morphs with sound-reactive glow
- Voiceover: OISTARIAN whispers upgrade lore during transitions
🎖️ Tactical Reputation Logs: “War Archive Deployment”
Converted into battlefield intelligence dossiers accessible at the HQ War Table.
🧩 Features:
• 	Timestamped Incident Reports: Track moral infractions, heroic rescues, and controversial tactics
• 	Faction Trust Analytics: Gauge diplomatic leverage, trade embargo risks, alliance perks
• 	Operation Efficiency Index: Success-to-risk ratio for each mission
• 	Debrief Commentary Overlay: Squad audio logs declassified with combat psyche tags (e.g., “Subject Kane shows diminishing empathy”)
🔐 Unlockable via Echo HoloDeck upgrade—grants access to mission simulation replay with tactical overlays and beat-synced squad reactions.

Base Upgrades: Tactical Infrastructure Modules
Each facility offers battlefield advantages and modifies gear, recon, diplomacy, or trait mutation.

| Module Name | Tactical Function | Unlock Requirement | 
| 🛰️ Echo Resonance Forge | Crafts rhythm-reactive gear (Cipher Cloaks, Harmony Blades) | MoralityScore ≥ 50 + Echo Alliance ≥ 60 | 
| 🧩 Iron Bastion Grid | Defensive shield pulses around base perimeter | Ruthless Trait active + Iron Veil trust ≥ 70 | 
| 📡 Tactical HoloDeck | Simulates enemy psychology in upcoming ops | Squad Intelligence rating ≥ 75 | 
| 🔮 Pulse Meditation Room | Reduces squad stress pre-deployment | Mental Resilience avg. ≤ 40 | 

Each room pulses in response to faction music, simulating live resonance threats.

Squad Mental Resilience: “Stress Ops Matrix”
Squad behavior is now tactically impacted by mental durability in war conditions.
Strategic Impacts:
- High Stress Level: Increased reaction delay, potential order rejection
- Low Morale: Decreases shooting accuracy, raises fear wave thresholds
- Trauma Tags: Permanent modifiers (“Wavers Under Fire”, “Echo Shellshock”)
Example Modifier:
if (squadmate.TraumaTags.Contains("ChildLossWitness")) {
    unit.hasTriggerZone = true;
    unit.reactionTime *= 1.5f;
    unit.ambientWhisperVO = "Why didn't we save them...";
}

🎮 Tactical Gear Fix: Equip squad with Empathy Circuit Vests to soften psychological recoil after traumatic events.

🧬 Trait Inheritance: “Lineage Protocol Deployment”
Recruits now spawn with embedded tactical archetypes based on ancestral traits.
Tactical Lineage Flow:
- Kane’s Descendant (Ruthless + Calculating):
- Deploys heavy strike teams
- Unlocks “Battlefield Deception” mission chain
- Vera’s Apprentice (Protective + Paranoid):
- Prefers defensive rescues
- Triggers “Echo Shelter Tactics” ops
Trait Evolution Chain (Simplified Logic):
public TraitType InheritTrait(string parentName) {
    if (parentName == "Kane") return TraitType.Ruthless;
    if (parentName == "Vera") return TraitType.Protective;
    return TraitType.Calculating;
}

🧠 Squad briefing includes ancestral memory excerpts and war hymn fragments from the parent unit’s campaigns.

Trait Inheritance: “Lineage Protocol Deployment”
Recruits now spawn with embedded tactical archetypes based on ancestral traits.
Tactical Lineage Flow:
- Kane’s Descendant (Ruthless + Calculating):
- Deploys heavy strike teams
- Unlocks “Battlefield Deception” mission chain
- Vera’s Apprentice (Protective + Paranoid):
- Prefers defensive rescues
- Triggers “Echo Shelter Tactics” ops

Mission Briefing Deck: Operation — “Vault Protocol: Eden Surge”
Recurring trauma triggers, ancestry-based resistance modifiers

Deployment Map Interface: Tactical Glyph Grid
A command interface where squads and gear are deployed onto live terrain maps—each pulse echoes the faction music in real time.
🎮 System Features
- Dynamic Map Layers:
- Civilian Zones (risk overlays)
- Enemy Trait Densities (Desensitized clusters, Paranoid traps)
- Sonic Disruption Zones (affects gear rhythm)
- Deployment Pods:
- Squad slots based on psychology resistance and terrain affinity
- Visual ripple as glyph markers drop
War Council Simulation: Legacy Arc Branching Engine
A long-form decision simulator where key tactical dilemmas alter squad DNA, faction trust, and mission access.

Council Mechanics
| Council Phase | Decision Type | Resulting Legacy Arc | 
| 🎙️ Ethics Accord | Choose to arm refugees or deny | Echo faction lineage shifts toward Empathetic/Ruthless | 
| ⚔️ Gear Allocation | Sacrifice relic for stealth or retain | Squad morale vs resonance tracker conflict | 
| 📡 Diplomatic Intel | Share vs falsify to Iron Veil | Leads to “Twilight Protocol” betrayal arc | 

Vault of Eden: Strategic Entry Protocol
This is no ordinary objective—it’s a mythic relic vault that requires morality precision, faction harmony, and squad resilience to unlock.
🔐 Entry Requirements
- Morality Alignment: Score ≥ +60 unlocks “Harmonic Conduit”; score ≤ –40 unlocks “Dark Pulse Variant”
- Squad Trait Sync: At least 3 squad members must have compatible archetypes (e.g., Protective + Empathetic)
- Legacy Key Activation: Artifact obtained via past sacrifice; carries encrypted pulse signature
🎵 In-Vault Mechanics
- Combat shifts to rhythm choreography
- Gear reacts to the ambient vault music tempo
- Boss logic tied to legacy decisions: betrayal triggers boss mutation

Step into the world of the future with Tactical Legend, an immersive tactical shooter set in a high-tech, dystopian universe. In this adrenaline-fueled game, players assume the role of elite fighters equipped with cutting-edge weaponry and advanced gear. The game combines intense combat mechanics![TL_001](https://github.com/user-attachments/assets/146e0bdf-083b-4db6-8904-7d94eb51e705)
With strategic planning, players rely on both quick reflexes and clever tactics to outsmart enemies.

Explore sprawling, visually stunning environments—from neon-lit cities and sprawling industrial complexes to alien landscapes. Ut![TL_002](https://github.com/user-attachments/assets/4d5d550b-a127-42d8-aa7f-16e5b9cc4171)
ilize a wide array of futuristic gadgets, from drone companions and energy shields to invisibility cloaks. Play solo or team up with friends in cooperative modes to complete daring missions that challenge your thinking and reflexes.

With its deep customization options, innovative weapon systems, and high-stakes gameplay, Tactical Legend offers an electrifying experience for fans of sci-fi shooters and tactical strategists alike. Prepare for battle and become a legend in the futuristic battlefield!

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Operating System:** Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+, Fedora 36+)
- **Software:**
  - [.NET SDK](https://dotnet.microsoft.com/download) (version 7.0 or higher recommended)
  - [Git](https://git-scm.com/) (version 2.30 or higher)
- **Dependencies:**
  - All C# project dependencies are managed via NuGet.  
    Run `dotnet restore` in the root project directory to install them.
- **Optional Tools:**
  - [Visual Studio 2022](https://visualstudio.microsoft.com/) or [Rider](https://www.jetbrains.com/rider/) (recommended IDEs for C#)
  - [Docker](https://www.docker.com/) (for containerized builds or deployment)
- **Network:** Internet access for cloning the repository and restoring NuGet packages.

MARKDOWN:
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/jurgen-paul/tactical-legends/blob/main/LICENSE)

[![CI](https://github.com/jurgen-paul/tactical-legends/actions/workflows/<workflow_file>.yml/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions)

[![Build and Deploy to Octopus Deploy](https://github.com/jurgen-paul/tactical-legends/actions/workflows/octopusdeploy.yml/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions/workflows/octopusdeploy.yml)
[![CodeQL](https://github.com/jurgen-paul/tactical-legends/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions/workflows/github-code-scanning/codeql)

# Tactical Legends

[![CI](https://github.com/jurgen-paul/tactical-legends/actions/workflows/ci.yml/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## About

Tactical Legends is a strategy game built with C++ and SDL2. The project aims to deliver engaging tactical gameplay with modular, maintainable code.

## Features

- Turn-based tactical combat
- Modular codebase using CMake
- Cross-platform support
- SDL2-based graphics and audio
- Unit tests via CTest

## Installation

### Prerequisites

- CMake >= 3.x
- g++ >= 9.0
- SDL2, SDL2_image, SDL2_mixer, SDL2_ttf

### Setup

```bash
sudo apt update
sudo apt install cmake g++ libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev
git clone https://github.com/jurgen-paul/tactical-legends.git
cd tactical-legends
mkdir build
cmake -S. -B build
cmake --build build
```

## Usage

Run the game executable from the build directory:

```bash
./build/tactical_legends
```

## Testing

Run all unit tests with:

```bash
cd build
ctest --output-on-failure
```

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

To propose changes:
- Fork the repo
- Create a feature branch
- Submit a pull request

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Support

Open an issue on our [GitHub issue tracker](https://github.com/jurgen-paul/tactical-legends/issues) or contact [jurgen-paul](https://github.com/jurgen-paul).

---



> _Note_: If you plan to contribute code, please also review the project's [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines and setup instructions.





