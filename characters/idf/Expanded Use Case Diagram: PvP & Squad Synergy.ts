@startuml
title Tactical Legend: Expanded Use Case Diagram

actor Player
actor GameEngine
actor Opponent
actor SquadMember

usecase "Initiate Relic Fusion" as UC1
usecase "Apply Faction Modifier" as UC2
usecase "Select Mutation Path" as UC3
usecase "Generate Glyph" as UC4
usecase "Compose Fusion Lore" as UC5
usecase "Unlock Achievement" as UC6
usecase "Update Relic Codex" as UC7
usecase "Trade Relic (PvP)" as UC8
usecase "Sync Squad Relics" as UC9
usecase "Trigger Squad Synergy Bonus" as UC10

Player --> UC1
Player --> UC8
Player --> UC9
Player --> UC10

Opponent --> UC8

SquadMember --> UC9
SquadMember --> UC10

UC1 --> UC2
UC1 --> UC3
UC1 --> UC4
UC1 --> UC5
UC1 --> UC6
UC1 --> UC7

UC9 --> UC10
UC8 --> UC7

GameEngine --> UC2
GameEngine --> UC3
GameEngine --> UC4
GameEngine --> UC5
GameEngine --> UC6
GameEngine --> UC7
GameEngine --> UC8
GameEngine --> UC9
GameEngine --> UC10

@enduml

Simulation Logic
function evolveRelic(relic, opponentHistory) {
  let newTraits = [...relic.traits];
  let loreFragments = [];

  opponentHistory.forEach(opponent => {
    if (opponent.faction === "Oistarian") newTraits.push("Phase Echo");
    if (opponent.usedRelicType === "Crystal") newTraits.push("Prism Memory");

    loreFragments.push(`Faced ${opponent.name} in the Rift. Echoes of ${opponent.faction} linger.`);
  });

  relic.traits = [...new Set(newTraits)];
  relic.lore += "\n" + loreFragments.join("\n");

  return relic;
}

Sample Output
{
  "name": "Ashen Phantom",
  "traits": ["Burn", "Stealth", "Phase Echo", "Prism Memory"],
  "lore": "Forged in silence. Faced Nyla Sera in the Rift. Echoes of Oistarian linger."
}

