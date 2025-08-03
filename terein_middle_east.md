{
  "feature": "Comprehensive Terrain System for Middle-East Maps",
  "description": "Implements realistic terrain rules for forests, hills, and rivers to enhance tactical depth in Middle-East scenarios.",
  "terrains": [
    {
      "type": "Forest",
      "effects": {
        "movement": {
          "modifier": "slow",
          "details": "Units move at 60% speed through forest tiles."
        },
        "pathfinding": {
          "penalty": "increased cost",
          "details": "AI/pathfinding algorithms favor routes avoiding forests unless necessary."
        },
        "visibility": {
          "modifier": "reduced",
          "details": "Units have 40% less line-of-sight in forests; spotting enemies is harder."
        },
        "combat": {
          "defense_bonus": 20,
          "attack_penalty": 10,
          "details": "Defending units in forests receive a 20% defense bonus; attacking units suffer a 10% penalty due to cover."
        }
      }
    },
    {
      "type": "Hill",
      "effects": {
        "movement": {
          "modifier": "slow_uphill",
          "details": "Units ascend hills at 70% speed; descending is normal speed."
        },
        "pathfinding": {
          "penalty": "uphill preference",
          "details": "Pathfinding prefers routes avoiding steep hills unless strategic advantage is gained."
        },
        "visibility": {
          "modifier": "increased",
          "details": "Units on hills gain +2 map tiles to their line-of-sight range."
        },
        "combat": {
          "attack_bonus": 15,
          "defense_bonus": 15,
          "details": "Units on higher elevation gain 15% bonus to both attack and defense against units below."
        }
      }
    },
    {
      "type": "River",
      "effects": {
        "movement": {
          "modifier": "restricted",
          "details": "Units cannot cross rivers except at bridges/fords; speed at crossings is reduced to 40%."
        },
        "pathfinding": {
          "penalty": "high cost",
          "details": "Pathfinding algorithms strongly avoid direct river crossings unless at a designated crossing point."
        },
        "visibility": {
          "modifier": "neutral",
          "details": "Rivers do not affect unit visibility."
        },
        "combat": {
          "defense_bonus": 25,
          "attack_penalty": 15,
          "details": "Defending units on riverbanks gain 25% defense; attacking units crossing rivers suffer 15% penalty due to terrain disadvantage."
        }
      }
    }
  ],
  "implementation_notes": [
    "Integrate terrain modifiers into movement and pathfinding algorithms.",
    "Adjust line-of-sight calculations based on terrain type and elevation.",
    "Apply combat modifiers contextually during engagements depending on unit position relative to terrain.",
    "Terrain rules apply to all unit types unless specifically exempted by scenario or unit class."
  ],
  "goal": "Increase realism and tactical challenge for Middle-East scenarios by leveraging terrain effects."
}
