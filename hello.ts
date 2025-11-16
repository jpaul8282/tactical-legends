// hello.ts
// Tactical Legends Character Management System

/**
 * Represents a Tactical Legends operative with combat specifications
 */
interface Character {
  codename: string;
  specialization: string;
  gear: string[];
  faction?: string;
  rank?: string;
  stats?: CharacterStats;
}

/**
 * Character combat and performance statistics
 */
interface CharacterStats {
  health: number;
  armor: number;
  speed: number;
  stealth: number;
  combatRating: number;
}

/**
 * Mission briefing structure
 */
interface MissionBriefing {
  character: Character;
  greeting: string;
  status: 'READY' | 'STANDBY' | 'DEPLOYED' | 'OFF-DUTY';
  timestamp: string;
}

// Create a sample character with a full profile
const oistarian: Character = {
  codename: "OISTARIAN",
  specialization: "Emotional Recon Specialist",
  faction: "Oistarian Vanguard",
  rank: "Field Operative",
  gear: [
    "Whisper & Roar",
    "NeuroPulse Arm Module",
    "Quantum Comms Device",
    "Tactical HUD Visor"
  ],
  stats: {
    health: 150,
    armor: 75,
    speed: 12,
    stealth: 88,
    combatRating: 82
  }
};

/**
 * Generate a personalized greeting for the operative
 * @param character - The character to greet
 * @returns Formatted greeting message
 */
function greet(character: Character): string {
  const rankTitle = character.rank? `${character.rank} ` : '';
  return `╔════════════════════════════════════════════════╗
║  TACTICAL LEGENDS - MISSION BRIEFING          ║
╚════════════════════════════════════════════════╝

Hello, ${rankTitle}${character.codename}!
Ready for your mission as a ${character.specialization}?

Status: OPERATIONAL
Clearance: GRANTED.
}

/**
 * Display the operative's equipment loadout
 * @param character - The character whose gear to display
 */
function showGear(character: Character): void {
  console.log(`\n╔════════════════════════════════════════════════╗`);
  console.log(`║  EQUIPMENT LOADOUT: ${character.codename.padEnd(24)} ║`);
  console.log(`╚════════════════════════════════════════════════╝\n`);
  
  character.gear.forEach((item, index) => {
    console.log(`  [${index + 1}] ${item}`);
  });
  
  console.log(`\n  Total Items: ${character.gear.length}`);
}

/**
 * Display character statistics
 * @param character - The character whose stats to display
 */
function showStats(character: Character): void {
  if (!character.stats) {
    console.log("\n[!] No stats available for this operative.");
    return;
  }

  console.log(`\n╔════════════════════════════════════════════════╗`);
  console.log(`║  OPERATIVE STATISTICS                          ║`);
  console.log(`╚════════════════════════════════════════════════╝\n`);
  
  const { health, armor, speed, stealth, combatRating } = character.stats;
  
  console.log(`  Health:        ${health} HP       ${'█'.repeat(Math.floor(health / 10))}`);
  console.log(`  Armor:         ${armor}%         ${'█'.repeat(Math.floor(armor / 10))}`);
  console.log(`  Speed:         ${speed} m/s      ${'█'.repeat(speed)}`);
  console.log(`  Stealth:       ${stealth}%        ${'█'.repeat(Math.floor(stealth / 10))}`);
  console.log(`  Combat Rating: ${combatRating}%        ${'█'.repeat(Math.floor(combatRating / 10))}`);
}

/**
 * Generate complete mission briefing
 * @param character - The character for the briefing
 * @returns Mission briefing object
 */
function generateMissionBriefing(character: Character): MissionBriefing {
  return {
    character,
    greeting: greet(character),
    status: 'READY',
    timestamp: new Date().toISOString()
  };
}

/**
 * Add equipment to character loadout
 * @param character - The character to equip
 * @param item - The equipment item to add
 */
function addGear(character: Character, item: string): void {
  character.gear.push(item);
  console.log(`\n[+] Added "${item}" to ${character.codename}'s loadout.`);
}

/**
 * Display complete character profile
 * @param character - The character to display
 */
function displayProfile(character: Character): void {
  console.log(`\n╔════════════════════════════════════════════════╗`);
  console.log(`║  OPERATIVE DOSSIER                             ║`);
  console.log(`╚════════════════════════════════════════════════╝\n`);
  console.log(`  Codename:       ${character.codename}`);
  console.log(`  Specialization: ${character.specialization}`);
  if (character.faction) console.log(`  Faction:        ${character.faction}`);
  if (character.rank) console.log(`  Rank:           ${character.rank}`);
  console.log(`  Equipment:      ${character.gear.length} items`);
}

// ═══════════════════════════════════════════════════════
//  DEMO EXECUTION
// ═══════════════════════════════════════════════════════

console.log("\n" + "=".repeat(50));
console.log("  TACTICAL LEGENDS - CHARACTER SYSTEM v1.0");
console.log("=".repeat(50) + "\n");

// Display greeting
console.log(greet(oistarian));

// Show complete profile
displayProfile(oistarian);

// Show equipment loadout
showGear(oistarian);

// Display stats
showStats(oistarian);

// Demo: Add new gear
addGear(oistarian, "EMP Grenade");

// Generate mission briefing
const briefing = generateMissionBriefing(oistarian);
console.log(`\n╔════════════════════════════════════════════════╗`);
console.log(`║  MISSION STATUS: ${briefing.status.padEnd(32)} ║`);
console.log(`║  Timestamp: ${briefing.timestamp.padEnd(35)} ║`);
console.log(`╚════════════════════════════════════════════════╝\n`);

console.log("\n[✓] All systems operational. Ready for deployment.\n");
