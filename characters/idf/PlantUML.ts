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

