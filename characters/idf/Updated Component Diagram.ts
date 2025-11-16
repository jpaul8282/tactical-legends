PlanTulm
@startuml
title Tactical Legend: Expanded Component Architecture

component "Fusion Engine" as Fusion
component "Synergy Calculator" as Synergy
component "Mutation Selector" as Mutation
component "Glyph Generator" as Glyphs
component "Achievement Tracker" as Achievements
component "Crafting Tree Manager" as Crafting
component "Relic Codex" as Codex
component "Factional Modifier Engine" as FactionMod
component "Lore Composer" as Lore

Fusion --> Synergy : calculateSynergy()
Fusion --> Mutation : selectMutationPath()
Fusion --> Glyphs : generateGlyph()
Fusion --> Achievements : checkAchievements()
Fusion --> Crafting : fetchRelicMetadata()
Fusion --> Codex : queryRelicEntry()
Fusion --> FactionMod : applyFactionBonus()
Fusion --> Lore : generateFusionLore()

@enduml

