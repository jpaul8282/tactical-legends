name: CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Install dependencies
      run: sudo apt update && sudo apt install -y cmake g++ libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev

    - name: Create build directory
      run: mkdir build

    - name: Configure CMake
      run: cmake -S. -B build

    - name: Build
      run: cmake --build build

    - name: Run Tests
      run: |
        cd build
        ctest --output-on-failure
      continue-on-error: true
