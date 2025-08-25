@startuml
title Tactical Legend: Relic Lifecycle State Diagram

[*] --> Crafted: via Crafting Tree
Crafted --> Infused: trait infusion
Infused --> Factionalized: faction essence applied
Factionalized --> Fused: combined with another relic
Fused --> Mutated: mutation path selected
Mutated --> Awakened: legendary synergy achieved
Awakened --> Archived: stored in Relic Codex
Archived --> [*]

@enduml



