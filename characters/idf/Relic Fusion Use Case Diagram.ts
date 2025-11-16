@startuml
title Tactical Legend: Relic Fusion Use Case Diagram

actor Player
actor GameEngine

usecase "Initiate Relic Fusion" as UC1
usecase "Apply Faction Modifier" as UC2
usecase "Select Mutation Path" as UC3
usecase "Generate Glyph" as UC4
usecase "Compose Fusion Lore" as UC5
usecase "Unlock Achievement" as UC6
usecase "Update Relic Codex" as UC7

Player --> UC1
UC1 --> UC2
UC1 --> UC3
UC1 --> UC4
UC1 --> UC5
UC1 --> UC6
UC1 --> UC7

GameEngine --> UC2
GameEngine --> UC3
GameEngine --> UC4
GameEngine --> UC5
GameEngine --> UC6
GameEngine --> UC7

@enduml

