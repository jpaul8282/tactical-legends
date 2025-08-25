@startuml
title Tactical Legend: Deployment Architecture

node "Player Device" {
  component "Game Client"
  artifact "Relic Viewer"
  artifact "Fusion Crucible UI"
  control "Input Handler"
  boundary "Factional UI Skin"
  file "Local Codex Cache"
}

cloud "EchoLink Network" {
  agent "Transmission Relay"
  queue "Encrypted Relic Queue"
  database "Relic Ledger"
  process "Bond Sync Engine"
}

node "Game Server" {
  component "Mission Engine"
  component "Relic Evolution Simulator"
  storage "Player Relic Vault"
  collections "Squad Loadouts"
  control "Codex Unlocker"
  interface "Faction Bonus Registry"
  package "Lore Generator"
}

folder "Faction Services" {
  frame "Vaultborn Forge"
  frame "Oistarian Lab"
  frame "Eden Core Archive"
}

actor "Commander"
actor/ "SquadMember"

rectangle "Codex Terminal" {
  card "Lore Entry"
  label "Inscription Decoder"
  hexagon "Escape Sequence Parser"
}

circle "Fusion Preview Hologram"
stack "UI Theme Manager"
entity "Relic Object"
usecase "View Relic"
usecase/ "Transmit Relic"

"Commander" --> "Game Client"
"SquadMember" --> "Fusion Crucible UI"
"Game Client" --> "EchoLink Network"
"Game Client" --> "Game Server"
"Fusion Crucible UI" --> "Fusion Preview Hologram"
"Relic Viewer" --> "Codex Terminal"
"Codex Terminal" --> "Escape Sequence Parser"
"Game Server" --> "Faction Services"
"Faction Services" --> "Faction Bonus Registry"
"Game Server" --> "EchoLink Network"
"Game Server" --> "Relic Evolution Simulator"
"Game Client" --> "UI Theme Manager"
"UI Theme Manager" --> "Factional UI Skin"
"Game Server" --> "Lore Generator"
"Lore Generator" --> "Codex Terminal"
"Codex Unlocker" --> "Local Codex Cache"
"Encrypted Relic Queue" --> "Relic Ledger"
"Bond Sync Engine" --> "Relic Evolution Simulator"

@enduml
@startuml
title Real-Time Squad Sync

actor "Commander"
actor "SquadMember"

node "SquadSyncService" {
  queue "SquadStateQueue"
  process "Sync Dispatcher"
  database "SquadStateDB"
}

"Commander" --> "GameClientService"
"SquadMember" --> "GameClientService"
"GameClientService" --> "SquadSyncService": Publish/Subscribe
"SquadSyncService" --> "SquadStateQueue"
"Sync Dispatcher" --> "SquadStateDB"
"SquadSyncService" --> "GameClientService": Push Updates

@enduml
@startuml
title Relic Mutation Pipeline

start
: Receive Relic Data;
: Validate Relic Integrity;
: Apply Mutation Algorithm;
: Check Factional Influence;
: Generate Lore Fragment;
: Update Relic Ledger;
stop

@enduml
@startuml
title Tactical Legend Microservices Deployment

cloud "EchoLink Network" {
  component "TransmissionService"
  queue "EncryptedRelicQueue"
}

node "Player Device" {
  component "GameClientService"
  component "UIThemeService"
}

node "Game Server Cluster" {
  component "SquadSyncService"
  component "RelicMutationService"
  component "VaultService"
  component "FactionService"
  component "CodexService"
  component "LoreGeneratorService"
}

"GameClientService" --> "SquadSyncService"
"GameClientService" --> "TransmissionService"
"GameClientService" --> "UIThemeService"
"SquadSyncService" --> "VaultService"
"RelicMutationService" --> "VaultService"
"RelicMutationService" --> "FactionService"
"RelicMutationService" --> "LoreGeneratorService"
"CodexService" --> "GameClientService"
"LoreGeneratorService" --> "CodexService"

@enduml
@startuml
title Tactical Legend: Strategic Deployment Map

' === Squad Roles ===
folder "Squad Command Structure" [
<b>Roles of the Vanguard</b>  
----  
Commander – Tactical Lead  
Sentinel – Defensive Anchor  
Striker – Offensive Specialist  
Mystic – Relic Manipulator  
Scout – Recon & Mobility  
====  
Each role channels unique relic affinities  
....  
Styled for battlefield clarity  
]

' === Relic Types ===
database "Relic Vault" [
<b>Sanctum of Relics</b>  
----  
Relic Types:  
• Echo Relic – Sound-based disruption  
• Flame Relic – Area denial & burn  
• Chrono Relic – Time manipulation  
• Void Relic – Stealth & phasing  
• Terra Relic – Defensive constructs  
====  
Mutation Paths:  
• Hybrid Fusion  
• Factional Infusion  
• Legendary Awakening  
....  
Styled for tactical evolution  
]

' === Faction-Specific UI Overlays ===
card "Factional UI Skins" [
<b>Visual Identity Layers</b>  
----  
Faction Overlays:  
• Vaultborn – Metallic, forge-inspired  
• Oistarian – Organic, neural weave  
• Eden Core – Crystal, radiant glyphs  
====  
Overlay Modules:  
• HUD Enhancer  
• Relic Preview Hologram  
• Squad Sync Pulse  
....  
Styled for immersive command  
<i><color:blue>(added in V1.2020.7)</color></i>
]

' === Node Infrastructure ===
node "EchoNode Alpha" [
<b>Beacon of Command</b>  
----  
Handles:  
• Squad Sync  
• Relic Transmission  
• UI Overlay Dispatch  
====  
Connected to:  
• Relic Vault  
• Squad Command Structure  
• Factional UI Skins  
....  
Styled for tactical clarity  
]

' === Usecase Actions ===
usecase "Relic Transmission" [
<b>Legendary Action</b>  
----  
Phase Divider  
====  
Transmit → Mutate → Deploy  
....  
Styled for mythic flow  
]

usecase "Squad Sync Pulse" [
<b>Real-Time Coordination</b>  
----  
Sync Roles  
Update Relic States  
Broadcast Tactical Alerts  
====  
Styled for squad cohesion  
]

@enduml

  text
Relic A: Flame Relic (Burn, AoE)
Relic B: Void Relic (Stealth, Phase)

→ Fusion Result: "Ashen Phantom"
- Traits: Phased Burn, Invisible AoE
- Mutation Path: Hybrid
- Lore Fragment: “Forged in the silence between worlds, the Ashen Phantom leaves no trace but flame.”

@startuml
title Tactical Legend: Layered Tactical Dashboard

' === Layer 1: Command HUD ===
folder "Command HUD" {
  card "Squad Role Panel" [
    <b>Squad Composition</b>
    ----
    Commander 🛡️  
    Striker ⚔️  
    Mystic 🔮  
    Scout 🕵️  
    Sentinel 🧱  
    ===
    Role-based relic affinity
  ]

  card "Faction Overlay Toggle" [
    <b>Faction UI Skins</b>
    ----
    Vaultborn – Metallic Forge  
    Oistarian – Neural Weave  
    Eden Core – Crystal Glyphs  
    ===
    Dynamic HUD styling
  ]

  card "Mission Feed" [
    <b>Objective Tracker</b>
    ----
    Primary: Secure Relic Site  
    Secondary: Sync Squad  
    ===
    Countdown + Tactical Alerts
  ]
}

' === Layer 2: Relic Fusion Console ===
folder "Relic Fusion Console" {
  card "Fusion Crucible" [
    <b>Relic Fusion Interface</b>
    ----
    Slot A: Flame Relic  
    Slot B: Void Relic  
    ===
    Predicted Result: Ashen Phantom  
    Traits: Phased Burn, Invisible AoE
  ]

  card "Mutation Preview Panel" [
    <b>Fusion Outcome</b>
    ----
    Path: Hybrid  
    Synergy Score: 87%  
    ===
    Factional Boost: Oistarian +15%
  ]

  card "Lore Fragment Scroll" [
    <b>Generated Lore</b>
    ----
    “Forged in the silence between worlds,  
    the Ashen Phantom leaves no trace but flame.”  
    ===
    Styled with faction glyphs
  ]
}

' === Layer 3: Battlefield Grid ===
folder "Battlefield Grid" {
  node "Hex-Grid Map" [
    <b>Terrain Visualization</b>
    ----
    Zones: Forest, Ruins, Echo Rift  
    ===
    Fog of War: Dynamic Reveal
  ]

  node "Squad Sync Pulse" [
    <b>Real-Time Coordination</b>
    ----
    Commander → All Roles  
    Mystic → Relic Zones  
    Scout → Terrain Reveal  
    ===
    Animated pulse rings
  ]

  node "Relic Activation Zones" [
    <b>Effect Overlays</b>
    ----
    Flame Burst – Red AoE  
    Chrono Freeze – Blue Radius  
    Void Phase – Shadow Field  
    ===
    Tactical impact visualization
  ]
}

' === Relic Taxonomy ===
database "Relic Vault" [
  <b>Relic Classification</b>
  ----
  Flame Relic – Burn, AoE  
  Echo Relic – Disruption, Pulse  
  Chrono Relic – Time Shift  
  Void Relic – Stealth, Phase  
  Terra Relic – Shield, Terrain  
  Neural Relic – Mind Link  
  Crystal Relic – Reveal, Cleanse  
  ===
  Mutation Paths: Hybrid, Infusion, Awakening
]

@enduml





