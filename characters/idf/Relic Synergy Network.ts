// Define relic nodes
const relicNodes = {
  node1: { name: "Ashen Phantom", type: "Core Relic" },
  node2: { name: "Flame Core", type: "Offensive Relic" },
  node3: { name: "Echo Lens", type: "Support Relic" },
  node4: { name: "Shadow Prism", type: "Stealth Relic" },
  node5: { name: "Shield Matrix", type: "Defensive Relic" }
};

// Define synergy links
const synergyLinks = [
  {
    source: "node1",
    target: "node2",
    type: "direct",
    label: "Flame Bond",
    effect: "Burn AoE +10%"
  },
  {
    source: "node1",
    target: "node3",
    type: "resonance",
    label: "Echo Sync",
    effect: "Cooldown Reduction"
  },
  {
    source: "node1",
    target: "node4",
    type: "unstable",
    label: "Shadow Pulse",
    effect: "Chance to trigger stealth burst"
  },
  {
    source: "node1",
    target: "node5",
    type: "fusion",
    label: "Shield Merge",
    effect: "Gain temporary invulnerability"
  }
];

// Render synergy map
function renderSynergyMap(nodes, links) {
  links.forEach(link => {
    const source = nodes[link.source].name;
    const target = nodes[link.target].name;
    console.log(`${source} ↔ ${target} [${link.label}] → ${link.effect}`);
  });
}

renderSynergyMap(relicNodes, synergyLinks);

Output Example
Ashen Phantom ↔ Flame Core [Flame Bond] → Burn AoE +10%
Ashen Phantom ↔ Echo Lens [Echo Sync] → Cooldown Reduction
Ashen Phantom ↔ Shadow Prism [Shadow Pulse] → Chance to trigger stealth burst
Ashen Phantom ↔ Shield Matrix [Shield Merge] → Gain temporary invulnerability
