Data Structure
const relic = {
  name: "Ashen Phantom",
  traits: ["Burn", "Stealth", "Phase Echo", "Prism Memory"],
  lore: "Forged in silence.",
  memoryLog: [
    {
      opponent: "Nyla Sera",
      faction: "Oistarian",
      result: "Victory",
      gainedTraits: ["Phase Echo"],
      loreFragment: "Faced Nyla Sera in the Rift. Echoes of Oistarian linger."
    },
    {
      opponent: "Kael",
      faction: "Crystari",
      result: "Defeat",
      gainedTraits: ["Prism Memory"],
      loreFragment: "His relic shattered mine—but the shards remembered."
    }
  ]
};

UI Component (HTML + CSS)
<div id="relicViewer">
  <h2 id="relicName"></h2>
  <p id="relicLore"></p>
  <ul id="traitList"></ul>
  <div id="memoryTimeline"></div>
</div>

#relicViewer {
  background: #1c1c1c;
  color: #eee;
  padding: 20px;
  border-radius: 10px;
  font-family: 'Orbitron', sans-serif;
}
#memoryTimeline div {
  margin: 10px 0;
  padding: 10px;
  background: #333;
  border-left: 5px solid #888;
}

Viewer Logic (JavaScript)
function renderRelicViewer(relic) {
  document.getElementById("relicName").textContent = relic.name;
  document.getElementById("relicLore").textContent = relic.lore;

  const traitList = document.getElementById("traitList");
  traitList.innerHTML = relic.traits.map(trait => `<li>${trait}</li>`).join("");

  const timeline = document.getElementById("memoryTimeline");
  timeline.innerHTML = relic.memoryLog.map(mem => `
    <div>
      <strong>${mem.opponent} (${mem.faction})</strong> - ${mem.result}<br>
      <em>Gained: ${mem.gainedTraits.join(", ")}</em><br>
      ${mem.loreFragment}
    </div>
  `).join("");
}

renderRelicViewer(relic);

Synergy Heatmap (Hex Grid Simulation)
Grid Setup
const grid = Array(7).fill().map(() => Array(7).fill({ synergy: 0 }));

const squad = [
  { name: "Striker", x: 2, y: 3, role: "Attack", relic: "Flame Core" },
  { name: "Mystic", x: 3, y: 3, role: "Support", relic: "Echo Lens" },
  { name: "Commander", x: 4, y: 3, role: "Tactician", relic: "Shield Matrix" }
];

Synergy Calculation
function calculateSynergy(grid, squad) {
  squad.forEach(unit => {
    grid[unit.y][unit.x].synergy += 2; // base synergy
    squad.forEach(other => {
      if (unit !== other) {
        const dx = Math.abs(unit.x - other.x);
        const dy = Math.abs(unit.y - other.y);
        if (dx <= 1 && dy <= 1) {
          grid[unit.y][unit.x].synergy += 3; // proximity bonus
        }
      }
    });
  });
}

Heatmap Rendering (HTML + CSS)
html
<div id="heatmapGrid"></div>

#heatmapGrid {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  grid-gap: 2px;
}
.tile {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 12px;
  border-radius: 5px;
}
.low { background: #400; }
.medium { background: #880; }
.high { background: #0a0; }

Render Heatmap
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
      div.textContent = cell.synergy;
      container.appendChild(div);
    });
  });
}

calculateSynergy(grid, squad);
renderHeatmap(grid);

