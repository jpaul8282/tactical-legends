@startuml
allowmixing

title Tactical Legend: Faction Crafting & Fusion System

' Actors
actor Commander
actor SquadMember

' Components
component "Vaultborn Forge" as VBForge
component "Oistarian Lab" as OLab
component "Echo Fusion Core" as FusionCore
component "Faction Bonus Registry" as BonusRegistry
component "Loadout Manager" as LoadoutMgr
component "Inventory System" as Inventory

' Use Cases
(Extract Vault Fragments) as Extract
(Craft ArmorModule) as Craft
(Fuse Gear) as Fuse
(Apply Faction Bonus) as ApplyBonus
(Equip Squad Loadout) as Equip

' Relationships
Commander --> Extract
Commander --> Craft
Commander --> Fuse
Commander --> ApplyBonus
SquadMember --> Equip

Extract --> Inventory
Craft --> VBForge
Craft --> OLab
Fuse --> FusionCore
ApplyBonus --> BonusRegistry
Equip --> LoadoutMgr
LoadoutMgr --> Inventory

' Data Store
database VaultData
Inventory --> VaultData

VaultData: {
  "fragmentType": "EchoCore"
  "originFaction": "Vaultborn"
  "rarity": "Legendary"
}

' Faction Logic
VBForge --> BonusRegistry: Vaultborn Traits
OLab --> BonusRegistry: Oistarian Traits
FusionCore --> BonusRegistry: Hybrid Traits

@enduml

