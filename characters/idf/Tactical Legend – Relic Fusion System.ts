@startuml
title Tactical Legend: Relic Fusion Component Diagram

package "Fusion System" {
  [RelicFusionEngine] --> [SynergyCalculator]
  [RelicFusionEngine] --> [FactionalModifier]
  [RelicFusionEngine] --> [MutationSelector]
  [RelicFusionEngine] --> [GlyphGenerator]
  [RelicFusionEngine] --> [LoreComposer]
}

package "Data Management" {
  [RelicRepository]
  [FactionDatabase]
  [MutationLibrary]
  [GlyphTemplates]
  [LoreArchive]
}

package "UI & Player Interaction" {
  [FusionUI]
  [AchievementTracker]
  [RelicCodex]
}

[FusionUI] --> [RelicFusionEngine]
[RelicFusionEngine] --> [RelicRepository]
[RelicFusionEngine] --> [FactionDatabase]
[RelicFusionEngine] --> [MutationLibrary]
[RelicFusionEngine] --> [GlyphTemplates]
[RelicFusionEngine] --> [LoreArchive]
[RelicFusionEngine] --> [AchievementTracker]
[RelicFusionEngine] --> [RelicCodex]

@enduml

