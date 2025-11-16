const WeatherSystem = {
  currentCondition: null,
  temperature: null,
  visibility: null,
  effectsOnBattlefield: {},

  initialize(region) {
    switch (region) {
      case "Tel Aviv":
        this.setCondition("dry heat", 36, "moderate");
        this.setUrbanDynamics("civilian density", "intel cover");
        break;
      case "Jerusalem":
        this.setCondition("desert wind", 40, "low");
        this.setUrbanDynamics("historic layout", "limited sightlines");
        break;
      case "Golan Heights":
        this.setCondition("stormy front", 12, "foggy");
        this.setUrbanDynamics("open terrain", "long-range combat");
        break;
      default:
        this.setCondition("clear", 25, "high");
    }
  },

  setCondition(type, temp, visibility) {
    this.currentCondition = type;
    this.temperature = temp;
    this.visibility = visibility;
    this.effectsOnBattlefield = this.generateEffects(type);
  },

  setUrbanDynamics(layout, intel) {
    this.effectsOnBattlefield["urbanLayout"] = layout;
    this.effectsOnBattlefield["intelStrategy"] = intel;
  },

  generateEffects(type) {
    switch (type) {
      case "dry heat":
        return {
          staminaDrain: true,
          cooldownReduction: false,
          opticalMirage: true,
        };
      case "desert wind":
        return {
          rangedAccuracyPenalty: true,
          stealthBoost: false,
          visibilityObscured: true,
        };
      case "stormy front":
        return {
          movementSlowdown: true,
          coverAdvantage: true,
          moraleImpact: true,
        };
      default:
        return {};
    }
  }
};

