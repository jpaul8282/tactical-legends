class Character {
  -name: string
  -health: int
  +takeDamage()
  +useAbility()
}

class Ability {
  -cooldown: int
  +activate()
}

Character --> Ability
Ability --> Effect

Cpp
while (gameRunning) {
    handleInput();
    updateGameState();
    renderFrame();
}

TEST(AbilityTest, FireballDealsCorrectDamage) {
    Character target("Enemy", 100);
    Fireball fireball;
    fireball.activate(target);
    EXPECT_EQ(target.getHealth(), 70); // assuming 30 damage
}

class GaleSurge: public Ability {
public:
    void activate(Character& caster, std::vector<Character>& targets);
};

@startuml

class Character {
  -name: string
  -health: int
  -mana: int
  -position: Vector2
  -abilities: List<Ability>
  -traits: List<Trait>
  +takeDamage(int)
  +useAbility(Ability, Target)
  +moveTo(Vector2)
}

class Ability {
  -name: string
  -cooldown: int
  -manaCost: int
  -effect: Effect
  +activate(Character, Target)
}

class Effect {
  -type: EffectType
  -magnitude: int
  -duration: int
  +apply(Character)
}

class Trait {
  -name: string
  -modifier: Modifier
  +applyTo(Character)
}

class Modifier {
  -stat: StatType
  -value: float
  +modify(Character)
}

enum EffectType {
  Damage
  Heal
  Buff
  Debuff
  Knockback
}

enum StatType {
  Health
  Mana
  Speed
  Defense
  Attack
}

Character --> Ability: uses >
Ability --> Effect: triggers >
Character --> Trait: has >
Trait --> Modifier: applies >

@enduml

@startuml SylraCharacterSystem

class Character {
  -name: string
  -health: int
  -mana: int
  -position: Vector2
  -abilities: List<Ability>
  +takeDamage(int)
  +useAbility(Ability, Target)
  +moveTo(Vector2)
}

class Sylra extends Character {
  -windAffinity: float
  +invokeGaleSurge(Target)
}

class GaleSurge extends Ability {
  -pushDistance: int
  -interruptCasting: bool
  +activate(Character, List<Target>)
}

class Effect {
  -type: EffectType
  -magnitude: int
  -duration: int
  +apply(Character)
}

Sylra --> GaleSurge: uses >
GaleSurge --> Effect: triggers >
Character --> Ability: has >
Ability --> Effect: applies >

@enduml

plaintext
1. Player selects Sylra → chooses Gale Surge → targets 3 enemies
2. GaleSurge::activate() is called
3. For each target:
   a. Check if target is casting → apply interrupt
   b. Calculate push vector → apply knockback
   c. Apply visual FX (wind burst, stagger animation)
4. Deduct mana from Sylra
5. Start Gale Surge cooldown

@startuml CombatFlow

actor Player
participant Sylra
participant GaleSurge
participant TargetEnemy
participant Effect

Player -> Sylra : use GaleSurge()
Sylra -> GaleSurge : activate(targets)
GaleSurge -> TargetEnemy : applyEffect()
GaleSurge -> Effect : Knockback + Interrupt
Effect -> TargetEnemy : modifyState()

@enduml
