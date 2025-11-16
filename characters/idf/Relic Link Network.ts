const relics = {
  artifact1: { name: "Core Relic: Ember Crown" },
  artifact2: { name: "Linked Relic: Flame Echo" },
  artifact3: { name: "Composite Relic: Ashen Forge" },
  artifact4: { name: "Containment Relic: Prism Shell" },
  artifact5: { name: "Augment Relic: Surge Node" },
  artifact6: { name: "Colorbound Relic: Obsidian Veil" },
  artifact7: { name: "Directed Relic: Pulse Arrow" },
  artifact8: { name: "Zero Relic: Null Bloom" },
  artifact9: { name: "Ascendant Relic: Skybrand" },
  artifact10: { name: "Encapsulated Relic: Chrono Seed" }
};
Tactical Script
const relicLinks = [
  { from: "artifact1", to: "artifact2", type: "direct", effect: "Passive trait sync" },
  { from: "artifact1", to: "artifact3", type: "composition", effect: "Fusion trait unlocked" },
  { from: "artifact1", to: "artifact4", type: "containment", effect: "Cooldown seal applied" },
  { from: "artifact1", to: "artifact5", type: "augmentation", effect: "Stat boost + active skill" },
  { from: "artifact1", to: "artifact6", type: "colorbound", effect: "Elemental synergy triggered" },
  { from: "artifact1", to: "artifact7", type: "directed", effect: "Ranged command synergy" },
  { from: "artifact1", to: "artifact8", type: "zero", effect: "Trait nullification" },
  { from: "artifact1", to: "artifact9", type: "ascendant", effect: "Legendary evolution" },
  { from: "artifact1", to: "artifact10", type: "encapsulated", effect: "Time-memory storage" }
];
Sample Output
Ember Crown → Flame Echo [Direct Link] → Passive trait sync  
Ember Crown → Ashen Forge [Composition Link] → Fusion trait unlocked  
Ember Crown → Prism Shell [Containment Link] → Cooldown seal applied  
Ember Crown → Surge Node [Augmentation Link] → Stat boost + active skill  
Ember Crown → Obsidian Veil [Colorbound Link] → Elemental synergy triggered  
Ember Crown → Pulse Arrow [Directed Link] → Ranged command synergy  
Ember Crown → Null Bloom [Zero Link] → Trait nullification  
Ember Crown → Skybrand [Ascendant Link] → Legendary evolution  
Ember Crown → Chrono Seed [Encapsulated Link] → Time-memory storage  


