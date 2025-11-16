🎯 Purpose
Visualize how squad members evolve based on battlefield decisions, trauma, and factional influence.
🧠 Data Model
const dnaTree = {
  name: "Kane",
  baseTraits: ["Ruthless", "Calculating"],
  mutations: [
    {
      name: "Echo Pulse Sensitivity",
      source: "Vault of Echoes",
      type: "Environmental",
      tier: 1
    },
    {
      name: "Iron Veil Resistance",
      source: "Iron Bastion Siege",
      type: "Combat",
      tier: 2
    }
  ]
};

🖼️ Canvas Rendering
html
<canvas id="dnaCanvas" width="800" height="600"></canvas>

function renderDNATree(tree) {
  const ctx = document.getElementById("dnaCanvas").getContext("2d");
  ctx.clearRect(0, 0, 800, 600);

  // Draw base traits
  ctx.fillStyle = "#fff";
  ctx.font = "16px Orbitron";
  ctx.fillText(`Base Traits: ${tree.baseTraits.join(", ")}`, 50, 50);

  // Draw mutation nodes
  tree.mutations.forEach((mutation, i) => {
    const x = 100 + i * 200;
    const y = 150 + mutation.tier * 100;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = mutation.type === "Combat"? "#f00" : "#0af";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(mutation.name, x - 40, y + 50);
    ctx.strokeStyle = "#888";
    ctx.moveTo(400, 100); // root node
    ctx.lineTo(x, y);
    ctx.stroke();
  });
}

🔮 Echo Forge UI Prototype
🎯 Purpose
Craft gear that reacts to music tempo and emotional state, with resonance-based effects.
🧠 Gear Blueprint

const gear = {
  name: "Pulseblade",
  tempo: 120,
  emotion: "rage",
  effects: ["+15% crit during tempo sync", "Echo trail visual"]
};

🖼️ Canvas UI
html
<canvas id="forgeCanvas" width="800" height="400"></canvas>

function renderEchoForge(gear) {
  const ctx = document.getElementById("forgeCanvas").getContext("2d");
  ctx.clearRect(0, 0, 800, 400);

  // Gear node
  ctx.beginPath();
  ctx.arc(400, 200, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff0";
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.fillText(gear.name, 370, 260);

  // Tempo slider
  ctx.fillStyle = "#fff";
  ctx.fillText(`Tempo: ${gear.tempo} BPM`, 50, 50);
  ctx.fillRect(50, 70, gear.tempo, 10);

  // Emotion indicator
  ctx.fillText(`Emotion: ${gear.emotion}`, 50, 100);
  ctx.fillStyle = gear.emotion === "rage"? "#f00" : "#00f";
  ctx.fillRect(50, 120, 100, 10);

  // Effects
  gear.effects.forEach((effect, i) => {
    ctx.fillStyle = "#fff";
    ctx.fillText(effect, 50, 160 + i * 20);
  });
}

🔁 Integration Hooks
• 	Sync DNA mutations with combat logs and faction events
• 	Trigger gear resonance effects based on AudioManager tempo and squad emotional state
• 	Save/load configurations for tactical loadouts
