PlanTulm
@startuml
title Tactical Legend: Core Component Diagram

component "Fusion Engine" as Fusion
component "Synergy Calculator" as Synergy
component "Mutation Selector" as Mutation
component "Glyph Generator" as Glyphs
component "Achievement Tracker" as Achievements
component "Crafting Tree Manager" as Crafting

Fusion --> Synergy : calculateSynergy()
Fusion --> Mutation : selectMutationPath()
Fusion --> Glyphs : generateGlyph()
Fusion --> Achievements : checkAchievements()
Fusion --> Crafting : fetchRelicMetadata()

@enduml

