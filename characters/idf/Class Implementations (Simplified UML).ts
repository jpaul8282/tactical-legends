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

