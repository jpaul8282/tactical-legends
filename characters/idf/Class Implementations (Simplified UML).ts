@startuml
title Tactical Legend: Core Class Architecture

' Main fusion engine orchestrating relic transformation
class RelicFusionEngine {
  +initiateFusion(relicA, relicB)
  -validateRelics()
  -computeSynergy()
  -applyFactionalModifiers()
  -determineMutationPath()
  -generateGlyphArtifact()
  -composeRelicLore()
}

' Calculates synergy between relics based on traits
class SynergyCalculator {
  +calculateSynergy(relicA, relicB)
  -analyzeTraitOverlap()
  -scoreSynergyLevel()
}

' Applies faction-specific bonuses to relics
class FactionalModifier {
  +applyFactionBonus(relic, faction)
  -retrieveFactionAttributes()
}

' Determines mutation outcomes and effects
class MutationSelector {
  +determineMutationPath(relic)
  -rollMutationOutcome()
  -applyMutationEffects()
}

' Generates glyphs with embedded relic stats
class GlyphGenerator {
  +generateGlyphArtifact(relic)
  -selectGlyphTemplate()
  -embedRelicStats()
}

' Crafts lore narratives for fused relics
class LoreComposer {
  +composeRelicLore(relicA, relicB)
  -generateRelicBackstory()
  -integrateFactionHistory()
}

' Tracks player achievements and rewards
class AchievementTracker {
  +evaluateFusionMilestones()
  +unlockAchievementRewards()
}

' Maintains relic records and archives
class RelicCodex {
  +updateRelicEntry(relic)
  +archiveRelicData()
}

@enduml




@startuml
title Tactical Legend: Key Class Implementations

class RelicFusionEngine {
  +initiateFusion(relicA, relicB)
  -validateRelics()
  -applySynergy()
  -applyFactionModifiers()
  -selectMutation()
  -generateGlyph()
  -composeLore()
}

class SynergyCalculator {
  +calculate(relicA, relicB)
  -evaluateTraitOverlap()
  -scoreSynergy()
}

class FactionalModifier {
  +applyModifiers(relic, faction)
  -fetchFactionBonus()
}

class MutationSelector {
  +selectMutationPath(relic)
  -rollMutation()
  -applyMutationEffects()
}

class GlyphGenerator {
  +generateGlyph(relic)
  -selectTemplate()
  -embedStats()
}

class LoreComposer {
  +compose(relicA, relicB)
  -generateBackstory()
  -linkToFactionHistory()
}

class AchievementTracker {
  +checkFusionMilestones()
  +unlockRewards()
}

class RelicCodex {
  +updateEntry(relic)
  +archiveRelic()
}

@enduml

