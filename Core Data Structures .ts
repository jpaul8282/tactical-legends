Relic class
class Relic {
  constructor(name, type, faction, traits) {
    this.name = name;
    this.type = type; // e.g. "Flame", "Crystal"
    this.faction = faction; // "Vaultborn", "Eden Core", "Oistarian"
    this.traits = traits; // e.g. ["Burn", "AoE"]
  }
}

FusionResult Class
class FusionResult {
  constructor(name, synergyScore, mutationPath, traits, lore, achievementUnlocked) {
    this.name = name;
    this.synergyScore = synergyScore;
    this.mutationPath = mutationPath;
    this.traits = traits;
    this.lore = lore;
    this.achievementUnlocked = achievementUnlocked;
  }
}
Fusion Logic Simulation
function fuseRelics(relicA, relicB) {
  // 1. Calculate the synergy score
  let synergyScore = calculateSynergy(relicA, relicB);

  // 2. Apply factional modifiers
  synergyScore += applyFactionBonus(relicA, relicB);

  // 3. Determine mutation path (weighted random)
  const mutationPath = weightedMutationPath(synergyScore);

  // 4. Generate traits and lore
  const traits = generateTraits(relicA, relicB, mutationPath);
  const lore = generateLore(relicA, relicB, mutationPath);

  // 5. Store fusion history and check achievements
  const achievementUnlocked = checkAchievements(relicA, relicB, mutationPath);

  Return new FusionResult("Ashen Phantom", synergyScore, mutationPath, traits, lore, achievementUnlocked);
}

Synergy Score Calculation
function calculateSynergy(a, b) {
  let score = 0;
  if (a.type === b.type) score += 30;
  if (a.faction === b.faction) score += 20;

  const sharedTraits = a.traits.filter(t => b.traits.includes(t));
  score += sharedTraits.length * 10;

  return score;
}

Factional Modifiers
function applyFactionBonus(a, b) {
  let bonus = 0;
  if (a.faction === "Eden Core" || b.faction === "Eden Core") {
    if (a.type === "Crystal" || b.type === "Crystal") bonus += 15;
  }
  if (a.faction === "Vaultborn" && b.type === "Terra") bonus += 10;
  return bonus;
}

Weighted Mutation Path
function weightedMutationPath(score) {
  const roll = Math.random() * 100;
  if (score > 70 && roll < 60) return "Legendary Awakening";
  if (score > 50 && roll < 80) return "Factional Infusion";
  return "Hybrid Fusion";
}

Trait & Lore Generation
function generateTraits(a, b, path) {
  const traits = [...new Set([...a.traits, ...b.traits])];
  If (path === "Legendary Awakening") traits.push("Echo Surge");
  return traits;
}

function generateLore(a, b, path) {
  return `Forged from ${a.name} and ${b.name}, this relic walks the ${path} path. It remembers the silence of ${a.faction} and the fury of ${b.faction}.`;
}

Fusion History & Achievements
const fusionLog = [];

function checkAchievements(a, b, path) {
  fusionLog.push({ relicA: a.name, relicB: b.name, path });

  if (fusionLog.length >= 10) return "Master Synthesist";
  if (path === "Legendary Awakening") return "Awakened One";
  return null;
}

Sample Output
{
  "name": "Ashen Phantom",
  "synergyScore": 85,
  "mutationPath": "Legendary Awakening",
  "traits": ["Burn", "Stealth", "Echo Surge"],
  "lore": "Forged from Flame Relic and Void Relic, this relic walks the Legendary Awakening path...",
  "achievementUnlocked": "Awakened One"
}

