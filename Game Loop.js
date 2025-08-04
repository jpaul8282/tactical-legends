let currentPlayer = 0;
const players = ["Player1", "Player2"];

function gameLoop() {
  console.log(`It's ${players[currentPlayer]}'s turn.`);
  // handle player input, actions, and end turn
  processTurn(players[currentPlayer]);
  checkGameOver();
  currentPlayer = (currentPlayer + 1) % players.length;
}

 Entity System
class Unit {
  constructor(name, health, attack, defense, abilities) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.abilities = abilities || [];
    this.position = { x: 0, y: 0 };
  }

  move(x, y) {
    this.position = { x, y };
    console.log(`${this.name} moves to (${x}, ${y})`);
  }

  isAlive() {
    return this.health > 0;
  }
}

Combat Logic
function calculateDamage(attacker, defender) {
  const baseDamage = attacker.attack - defender.defense;
  const damage = Math.max(baseDamage, 1); // minimum 1 damage
  defender.health -= damage;
  console.log(`${attacker.name} hits ${defender.name} for ${damage} damage!`);
  if (!defender.isAlive()) {
    console.log(`${defender.name} has fallen.`);
  }
}

function checkGameOver() {
  // simplistic condition: if all units of a player are dead
  const allUnitsDead = false; // implement based on your unit list
  if (allUnitsDead) {
    console.log("Game Over!");
  }
}

function getTerrainBonus(unit, terrainType) {
  switch (terrainType) {
    case "desert":
      return unit.type === "light" ? { movement: +1 } : { accuracy: -0.1 };
    case "dune":
      return unit.isStationary ? { defense: +0.2, movement: -1 } : {};
    case "ruins":
      return { defense: +0.3, projectileDeflectChance: 0.5 };
    case "oil":
      return { resourceBoost: +1, fireVulnerability: true };
    case "storm":
      return { visionReduction: 0.25, noAirTargeting: true };
    case "trench":
      return { defense: +0.5, movementLimit: 1 };
    case "minefield":
      return { hidden: true, damageOnStep: [30, 50] };
    default:
      return {};
  }
}

