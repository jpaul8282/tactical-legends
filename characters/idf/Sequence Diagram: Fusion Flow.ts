PlanTulm
@startuml
title Tactical Legend: Relic Fusion Sequence

actor RelicCrafter
participant "Fusion Engine"
participant "Crafting Tree Manager"
participant "Synergy Calculator"
participant "Factional Modifier Engine"
participant "Mutation Selector"
participant "Lore Composer"
participant "Glyph Generator"
participant "Achievement Tracker"
participant "Relic Codex"

RelicCrafter -> "Fusion Engine" : initiateFusion(relicA, relicB)
"Fusion Engine" -> "Crafting Tree Manager" : fetchRelicMetadata()
"Fusion Engine" -> "Synergy Calculator" : calculateSynergy()
"Fusion Engine" -> "Factional Modifier Engine" : applyFactionBonus()
"Fusion Engine" -> "Mutation Selector" : selectMutationPath()
"Fusion Engine" -> "Lore Composer" : generateFusionLore()
"Fusion Engine" -> "Glyph Generator" : generateGlyph()
"Fusion Engine" -> "Achievement Tracker" : checkAchievements()
"Fusion Engine" -> "Relic Codex" : updateCodexEntry()

"Fusion Engine" --> RelicCrafter : returnFusionResult()

@enduml

