class EchoVanguard: public Specialization {
    EchoVanguard() {
        name = "Echo Vanguard";
        stealth = 90;
        emotionalDisruption = true;
        gear = {"Pulse Cloak", "Neuro Dagger"};
    }
};

registerSpecialization("Echo Vanguard", new EchoVanguard());

{
  "mission_id": "eden_surge",
  "title": "Vault Protocol: Eden Surge",
  "location": "Eden Vault - Subterranean Memory Core",
  "objectives": [
    "Infiltrate the Eden Vault undetected",
    "Extract the Surge Protocol from Core Node 7",
    "Avoid triggering emotional traps",
    "Ensure Echo Vanguard survives."
  ],
  "environment": {
    "terrain": "pulse-reactive corridors",
    "lighting": "flickering neon and ambient memory glow",
    "hazards": ["emotional feedback loops", "AI sentinels", "memory wraiths"]
  },
  "triggers": {
    "flashback": {
      "cue": "The corridor. The child. The silence.",
      "effect": "Oistarian loses control for 10 seconds"
    },
    "betrayal": {
      "condition": "trust_score < 60",
      "action": "Echo Vanguard disables Oistarian’s NeuroPulse module"
    },
    "surge_unlock": {
      "condition": "morality_score > 70 && Echo Vanguard alive",
      "action": "Unlocks Eden Surge protocol and tactical resonance gear"
    }
  },
  "dialogue": [
    {
      "speaker": "Oistarian",
      "line": "This place remembers more than it should."
    },
    {
      "speaker": "Echo Vanguard",
      "line": "I feel the pulse... It's reacting to us."
    }
  ]
}

