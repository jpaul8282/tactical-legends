@startuml
title Tactical Legend: Crafting Recipe Tree

allowmixing

' Materials
artifact "EchoCore" as EchoCore
artifact "Eden Alloy" as EdenAlloy
artifact "Vault Crystal" as VaultCrystal

' Intermediate Relics
component "Surge Beacon" as SurgeBeacon
component "Echo Stabilizer" as EchoStabilizer

' Final Relic
component "Stormcaller Matrix" as Stormcaller

' Relationships
EchoCore --> SurgeBeacon : + Eden Alloy
EdenAlloy --> SurgeBeacon

EchoCore --> EchoStabilizer : + Vault Crystal
VaultCrystal --> EchoStabilizer

SurgeBeacon --> Stormcaller : + EchoStabilizer
EchoStabilizer --> Stormcaller

Note the right of SurgeBeacon
  Relic Type: Tactical
  Faction Affinity: Eden Core
end note

Note the right of Stormcaller
  Relic Type: Legendary
  Grants: Echo Storm Immunity
end note

@enduml

