const InteractiveObjects = {
  objects: [],

  initialize(map) {
    this.objects = [
      this.createTrap("landmine", map.getRandomTile(), "explosive", { damage: 50, delay: 0 }),
      this.createTrap("snare wire", map.getTile("alley"), "entangle", { duration: 2 }),

      this.createCover("wooden crate", map.getTile("market"), "destructible", { hp: 30 }),
      this.createCover("stone wall", map.getTile("courtyard"), "semi-permanent", { hp: 100 }),

      this.createPowerUp("medkit", map.getTile("rooftop"), "healing", { healAmount: 30 }),
      this.createPowerUp("intel drone", map.getTile("checkpoint"), "recon", { visionBoost: 5, duration: 3 })
    ];
  },

  createTrap(name, location, effectType, effectProps) {
    return {
      type: "trap",
      name,
      location,
      triggered: false,
      effect: { type: effectType, ...effectProps },
      onTrigger(unit) {
        this.triggered = true;
        console.log(`${name} triggered by ${unit.name}`);
        unit.applyEffect(this.effect);
      }
    };
  },

  createCover(name, location, durabilityType, props) {
    return {
      type: "cover",
      name,
      location,
      durability: durabilityType,
      hp: props.hp,
      takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) console.log(`${name} destroyed!`);
      }
    };
  },

  createPowerUp(name, location, effectType, effectProps) {
    return {
      type: "power-up",
      name,
      location,
      collected: false,
      effect: { type: effectType, ...effectProps },
      onCollect(unit) {
        this.collected = true;
        console.log(`${unit.name} collected ${name}`);
        unit.applyEffect(this.effect);
      }
    };
  }
};
console.log(`${this.name} triggered by ${unit.name}`);
if (!effectProps.damage && effectType === "explosive") {
  throw new Error("Explosive traps must define damage.");
}
class Trap {
  constructor(name, location, effect) { ... }
  onTrigger(unit) { ... }
}
id: `${type}-${name}-${location.x}-${location.y}`
InteractiveObjects.registerType("sensor", createSensorFn);
onTrigger(unit) {
  this.triggered = true;
  if (this.script) this. script.execute(unit);
}
lore: "An old crate used by the Oistarian resistance..."

