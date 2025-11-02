[![CI](https://github.com/jurgen-paul/tactical-legends/actions/workflows/ci.yml/badge.svg)](https://github.com/jurgen-paul/tactical-legends/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

# Tactical Legends

Welcome to **Tactical Legends**, an open-source tactical strategy game focused on turn-based combat, deep squad customization, and replayable missions. Whether you’re a strategist, developer, or gamer, our modular codebase lets you contribute, experiment, and play on your favorite platform.

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

Tactical Legends delivers engaging tactical gameplay built with C++ and SDL2, designed for extensibility and cross-platform support. Plan your moves, outwit adaptive AI, and enjoy a game that grows with community contributions.

## Features

- Turn-based tactical combat
- Modular codebase using CMake
- Cross-platform support (Windows, macOS, Linux)
- SDL2-powered graphics and audio
- Unit testing via CTest
- Deep squad customization and branching campaign (coming soon)

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
Project Overview: Tactical Legends – Rise of OISTARIAN
Tactical Legends is a cross-platform game designed for strategic depth and replayability. It features:
• 	Turn-based tactical combat with adaptive AI
• 	Modular codebase using CMake for easy extension
• 	Cross-platform support (Windows, macOS, Linux)
• 	SDL2-powered graphics and audio
• 	Deep squad customization and branching campaign structure
• 	Unit testing via CTest for robust development

Tactical Legends Game Architecture Diagram
Diagram Highlights:
• 	Central Game Loop powered by SDL2
• 	Modular AI System with combat and stealth logic
• 	Campaign Manager for branching storylines
• 	Audio Manager for immersive sound design
• 	UI Layer built with Vue and C++
• 	Data Layer using Prisma and JSON configs
• 	Build & Deployment via CMake and YAML workflows
• 	Testing supported by CTest
<img width="1105" height="811" alt="tactical-legend diagram" src="https://github.com/user-attachments/assets/e6e160a1-1a7d-42f6-8991-63b6786e1112" />

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
<img width="950" height="657" alt="onboarding flow(tactical-legend)" src="https://github.com/user-attachments/assets/31835e2c-649f-4518-a8db-625105ac725b" />
The flow is split into two main tracks:
🔍 Discovery & Setup
• 	Discover the project on GitHub
• 	Read the README and contribution guidelines
• 	Set up the development environment (C++, SDL2, CMake)
• 	Explore the codebase (AI, UI, Campaign Manager)
• 	Pick an issue or feature to work on
🛠️ Contribution & Review
• 	Fork the repository and create a branch
• 	Develop and test changes locally
• 	Submit a pull request
• 	Participate in code review and make revisions
• 	Merge and celebrate your contribution 🎉
Each stage is represented with labeled boxes and directional arrows to show progression. It’s designed to be intuitive and beginner-friendly.
Click/open the card above to download the diagram.

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
