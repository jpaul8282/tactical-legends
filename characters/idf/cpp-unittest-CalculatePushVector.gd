#include <gtest/gtest.h>
#include "MoraleSystem.h"

TEST(MoraleSystemTest, MoraleBoostFromAllies) {
    MoraleSystem morale;
    Unit ally1, ally2;
    morale.addNearbyAlly(ally1);
    morale.addNearbyAlly(ally2);
    EXPECT_GT(morale.getMoraleLevel(), 50);
}

[Test]
public void MiniMap_ShouldUpdateOnUnitMove() {
    var map = new MiniMap();
    var unit = new Unit { Position = new Vector2(5, 5) };
    map.TrackUnit(unit);
    unit.Position = new Vector2(6, 5);
    map.Update();
    Assert.AreEqual(new Vector2(6, 5), map.GetUnitPosition(unit));
}

void GaleSurge::activate(Character& caster, std::vector<Character*>& targets) {
    if (!caster.hasEnoughMana(manaCost)) return;

    caster.consumeMana(manaCost);
    startCooldown();

    for (Character* target : targets) {
        if (target->isCasting()) {
            target->interruptCasting();
            target->emotionSystem().trigger("panic");
        }

        if (!target->hasTrait("KnockbackImmunity")) {
            Vector2 pushVector = calculatePushVector(caster.getPosition(), target->getPosition(), pushDistance);
            target->applyKnockback(pushVector);
        }

        triggerFX(caster, *target);
    }
}

void GaleSurge::triggerFX(Character& caster, Character& target) {
    FXManager::playEffect("WindBurst", target.getPosition());
    SoundManager::playSound("GaleSurgeCast", caster.getPosition());
    AnimationManager::play("Stagger", target);
}

void EmotionSystem::trigger(const std::string& emotion) {
    if (emotion == "panic") {
        currentState = EmotionState::Panicked;
        AIController::adjustBehavior("retreat");
        AnimationManager::play("Panic", owner);
    }
}

TEST(GaleSurgeTest, KnockbackImmuneTargetIsNotMoved) {
    Character target("Tank", 100);
    target.addTrait("KnockbackImmunity");

    GaleSurge gale;
    gale.activate(caster, { &target });

    EXPECT_EQ(target.getPosition(), originalPosition);
}

TEST(GaleSurgeTest, InterruptsCastingAndTriggersPanic) {
    Character target("Mage", 80);
    target.startCasting("Fireball");

    GaleSurge gale;
    gale.activate(caster, { &target });

    EXPECT_FALSE(target.isCasting());
    EXPECT_EQ(target.emotionSystem().getState(), EmotionState::Panicked);
}

Vector2 GaleSurge::calculatePushVector(const Vector2& casterPos, const Vector2& targetPos, int pushDistance) {
    Vector2 direction = targetPos - casterPos;
    direction.normalize(); // unit vector
    return direction * pushDistance;
}

Vector2 finalPos = targetPos + calculatePushVector(casterPos, targetPos, pushDistance);
if (!Map::isValidTile(finalPos)) {
    finalPos = Map::nearestValidTile(targetPos);
}

void AIController::adjustBehavior(const std::string& trigger) {
    if (trigger == "panic") {
        currentState = AIState::Panicked;
        pathfinding.setTarget(safeZone);
        combat.disableAggression();
        stats.modifyAccuracy(-0.3f);
        dialogue.play("Retreating!");
    }
}

