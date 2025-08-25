⚔️ PvP Link Activation Simulation
Data Model
const relicWeb = {
  core: "Ember Crown",
  links: [
    { target: "Flame Echo", type: "direct", active: false },
    { target: "Ashen Forge", type: "composition", active: false },
    { target: "Prism Shell", type: "containment", active: false },
    { target: "Surge Node", type: "augmentation", active: false },
    { target: "Obsidian Veil", type: "colorbound", active: false },
    { target: "Pulse Arrow", type: "directed", active: false },
    { target: "Null Bloom", type: "zero", active: false },
    { target: "Skybrand", type: "ascendant", active: false },
    { target: "Chrono Seed", type: "encapsulated", active: false }
  ]
};

function activateLink(targetName) {
  const link = relicWeb.links.find(l => l.target === targetName);
  if (link) {
    link.active = true;
    console.log(`🔗 ${link.type.toUpperCase()} link to ${targetName} activated!`);
    triggerEffect(link.type, targetName);
  }
}

function triggerEffect(type, target) {
  switch (type) {
    case "direct": console.log(`→ ${target} gains passive trait sync.`); break;
    case "composition": console.log(`→ ${target} unlocks fusion traits.`); break;
    case "containment": console.log(`→ ${target} seals cooldowns.`); break;
    case "augmentation": console.log(`→ ${target} boosts stats.`); break;
    case "colorbound": console.log(`→ ${target} triggers elemental synergy.`); break;
    case "directed": console.log(`→ ${target} receives tactical commands.`); break;
    case "zero": console.log(`→ ${target} nullifies traits.`); break;
    case "ascendant": console.log(`→ ${target} evolves to legendary tier.`); break;
    case "encapsulated": console.log(`→ ${target} stores time-memory traits.`); break;
  }
}

PvP Simulation Example
activateLink("Ashen Forge");     // Composition
activateLink("Pulse Arrow");     // Directed
activateLink("Skybrand");        // Ascendant

Link Decay Over Time (Unless Refreshed by Synergy)
Data Model
const relicLinks = [
  {
    from: "Ember Crown",
    to: "Flame Echo",
    type: "direct",
    active: true,
    decay: 100, // max 100, decays over time
    refreshed: false
  }
];

Decay Logic
function decayLinks() {
  relicLinks.forEach(link => {
    if (!link.refreshed) {
      link.decay -= 5;
      if (link.decay <= 0) {
        link.active = false;
        console.log(`⚠️ Link between ${link.from} and ${link.to} has decayed.`);
      }
    } else {
      link.decay = Math.min(link.decay + 10, 100); // refresh synergy
      link.refreshed = false;
    }
  });
}

Game Loop Hook
setInterval(() => {
  decayLinks();
  renderRelicWeb(); // updates canvas
}, 3000);

Multi-Node Resonance (Combo Circuits)
function checkResonanceCircuit(nodes) {
  const circuit = nodes.filter(n => n.traits.includes("Echo") || n.traits.includes("Flame"));
  if (circuit.length >= 3) {
    console.log("🔮 Resonance Circuit Activated!");
    applyResonanceBonus(circuit);
  }
}

Bonus Effects
function applyResonanceBonus(circuit) {
  circuit.forEach(node => {
    node. synergy += 10;
    node.traits.push("Resonant Pulse");
  });
}

Relic Web Editor (Canvas-Based UI)
HTML Canvas Setup
<canvas id="relicCanvas" width="800" height="600"></canvas>

Canvas Rendering
function renderRelicWeb() {
  const ctx = document.getElementById("relicCanvas").getContext("2d");
  ctx.clearRect(0, 0, 800, 600);

  relicLinks.forEach(link => {
    const from = getNodePosition(link.from);
    const to = getNodePosition(link.to);
    ctx.strokeStyle = link.active? "#0f0" : "#555";
    ctx.lineWidth = link.decay / 20;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  relicNodes.forEach(node => {
    const pos = getNodePosition(node.name);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText(node.name, pos.x - 20, pos.y + 30);
  });
}

Node Positioning
function getNodePosition(name) {
  const index = relicNodes.findIndex(n => n.name === name);
  const angle = (index / relicNodes.length) * 2 * Math.PI;
  const radius = 200;
  return {
    x: 400 + radius * Math.cos(angle),
    y: 300 + radius * Math.sin(angle)
  };
}


