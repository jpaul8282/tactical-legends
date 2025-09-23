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