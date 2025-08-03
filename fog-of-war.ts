/**
 * Fog of War Implementation Script
 * 
 * This script provides a basic fog of war system for grid-based strategy games.
 * It hides unexplored areas and only reveals cells within the vision range of player units.
 * Scouting and intelligence gathering become essential for map awareness.
 */

type CellState = "hidden" | "visible" | "explored";

interface Cell {
  state: CellState;
  x: number;
  y: number;
}

interface Unit {
  x: number;
  y: number;
  vision: number;
}

interface Map {
  width: number;
  height: number;
  grid: Cell[][];
}

/**
 * Initialize a map with all cells hidden.
 */
function initializeMap(width: number, height: number): Map {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ state: "hidden", x, y });
    }
    grid.push(row);
  }
  return { width, height, grid };
}

/**
 * Reveal cells within the vision range of all units.
 * Explored cells remain revealed but not currently visible.
 */
function updateFogOfWar(gameMap: Map, units: Unit[]): void {
  // First, set all cells to explored if they were visible, else keep their state
  for (let y = 0; y < gameMap.height; y++) {
    for (let x = 0; x < gameMap.width; x++) {
      const cell = gameMap.grid[y][x];
      if (cell.state === "visible") {
        cell.state = "explored";
      }
    }
  }

  // Reveal cells within vision of each unit
  for (const unit of units) {
    for (let dy = -unit.vision; dy <= unit.vision; dy++) {
      for (let dx = -unit.vision; dx <= unit.vision; dx++) {
        const nx = unit.x + dx;
        const ny = unit.y + dy;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < gameMap.width &&
          ny < gameMap.height &&
          Math.abs(dx) + Math.abs(dy) <= unit.vision
        ) {
          gameMap.grid[ny][nx].state = "visible";
        }
      }
    }
  }
}

/**
 * Utility to print the fog of war map to console (for testing/demo).
 * '■' = hidden, '#' = explored, '.' = visible
 */
function printFogOfWar(gameMap: Map) {
  for (let y = 0; y < gameMap.height; y++) {
    let row = "";
    for (let x = 0; x < gameMap.width; x++) {
      const cell = gameMap.grid[y][x];
      if (cell.state === "hidden") row += "■";
      else if (cell.state === "explored") row += "#";
      else if (cell.state === "visible") row += ".";
    }
    console.log(row);
  }
}

// Example usage:

const map = initializeMap(10, 7);
const playerUnits: Unit[] = [
  { x: 3, y: 3, vision: 2 },
  { x: 7, y: 1, vision: 1 }
];

updateFogOfWar(map, playerUnits);
printFogOfWar(map);

// Call updateFogOfWar whenever units move or map changes.
// Integrate with your game's rendering logic to visually show/hide map tiles based on cell.state.
