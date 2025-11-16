@startuml
title Tactical Legend: Relic Fusion Sequence

actor RelicCrafter
Participant "Fusion Engine" as Engine
participant "Synergy Calculator" as Synergy
participant "Mutation Selector" as Mutation
Participant "Achievement Tracker" as Achievements
participant "Glyph Visualizer" as Glyphs

RelicCrafter -> Engine: Select Relic A & Relic B
Engine -> Synergy: Calculate synergy score
Synergy --> Engine: Return synergy score

Engine -> Mutation: Determine mutation path (weighted)
Mutation --> Engine: Return mutation path

Engine -> Achievements: Check fusion history
Achievements --> Engine: Return unlocked achievements

Engine -> Glyphs: Generate animated glyph
Glyphs --> Engine: Return glyph visual

Engine --> RelicCrafter : Display fusion result\n(name, traits, lore, glyph, achievements)

@enduml

