export const AgentBehavior = {
  patrolPath: [],
  alertLevel: "low",

  initialize(map) {
    this.patrolPath = map.generatePatrolRoute("urban");
    this.alertLevel = "low";
  },

  update(unit, visibleEnemies) {
    if (visibleEnemies.length > 0) {
      this.alertLevel = "high";
      this.initiateEngagement(unit, visibleEnemies[0]);
    } else {
      this.patrol(unit);
    }
  },

  patrol(unit) {
    const nextPoint = this.patrolPath.shift();
    this.patrolPath.push(nextPoint);
    unit.moveTo(nextPoint);
  },

  initiateEngagement(unit, enemy) {
    if (unit.hasCover()) {
      unit.attack(enemy, "burst");
    } else {
      unit.moveToCover().then(() => unit.attack(enemy, "single-shot"));
    }
  }
};

