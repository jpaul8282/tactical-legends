{
  "fusion": {
    "relicA": "Flame Relic",
    "relicB": "Void Relic",
    "result": "Ashen Phantom",
    "traits": ["Phased Burn", "Invisible AoE"],
    "faction": "Oistarian",
    "lore": "Forged in the silence between worlds, the Ashen Phantom leaves no trace but flame."
  }
}

javascript
function simulateFusion() {
  const relicA = "Flame Relic";
  const relicB = "Void Relic";
  const result = "Ashen Phantom";
  const traits = ["Phased Burn", "Invisible AoE"];
  const faction = "Oistarian";

  const lore = `Forged in the silence between worlds, the ${result} leaves no trace but flame.`;

  document.getElementById("mutationPreview").innerText = `Result: ${result}\nTraits: ${traits.join(", ")}`;
  document.getElementById("loreScroll").innerText = lore;
}

