function applyRelicEffects(grid, squad) {
  squad.forEach(unit => {
    const cell = grid[unit.y][unit.x];
    switch (unit.relic) {
      case "Flame Core":
        cell.effect = "burn";
        break;
      case "Echo Lens":
        cell.effect = "echo";
        break;
      case "Shield Matrix":
        cell.effect = "shield";
        break;
      default:
        cell.effect = null;
    }
  });
}

Visual Styling (CSS)
.tile.burn { box-shadow: 0 0 10px red; }
.tile.echo { box-shadow: 0 0 10px cyan; }
.tile.shield { box-shadow: 0 0 10px gold; }

Update Rendering Logic
function renderHeatmap(grid) {
  const container = document.getElementById("heatmapGrid");
  container.innerHTML = "";

  grid.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement("div");
      div.className = "tile";
      if (cell.synergy < 3) div.classList.add("low");
      else if (cell.synergy < 6) div.classList.add("medium");
      else div.classList.add("high");

      if (cell.effect) div.classList.add(cell.effect);

      div.textContent = cell.synergy;
      container.appendChild(div);
    });
  });
}

Animate Synergy Pulses & Squad Movement
Pulse Animation (CSS)
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
}

.tile.high {
  animation: pulse 1.5s infinite;
}

Squad Movement Simulation
function moveSquadMember(unit, newX, newY) {
  unit.x = newX;
  unit.y = newY;
  updateBattleState(); // triggers re-render and recalculation
}

Real-Time Integration with Battle Engine
Hook into Game Loop
function updateBattleState() {
  resetGrid(grid);
  calculateSynergy(grid, squad);
  applyRelicEffects(grid, squad);
  renderHeatmap(grid);
}

Game Tick Simulation
setInterval(() => {
  // Example: move Mystic randomly
  const mystic = squad.find(u => u.name === "Mystic");
  mystic.x = (mystic.x + 1) % 7;
  updateBattleState();
}, 3000);

