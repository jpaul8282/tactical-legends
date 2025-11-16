while (game.isRunning()) {
    inputManager.pollEvents();     // Handle keyboard/mouse
    game.update(deltaTime);        // Update game state
    renderer.clear();              // Clear screen
    game.render();                 // Draw everything
    renderer.present();            // Show frame
}

class Unit {
public:
    int health;
    int attack;
    std::string name;
};

class Emotion {
public:
    float trust;
    float fear;
    float loyalty;
};

class Unit {
public:
    int health;
    int attack;
    std::string name;
    Emotion emotion;
};

void testEmotionSystem() {
    Emotion e;
    e.trust = 0.8;
    e.fear = 0.2;
    assert(e.trust > e.fear);  // Should pass
}

Unit shadowblade;
shadowblade.name = "Shadowblade";
shadowblade.health = 100;
shadowblade.attack = 25;
shadowblade. abilities.push_back(new Stealth());

class Stealth: public Ability {
public:
    void activate(Unit& user) override {
        user.setInvisible(true);
        std::cout << user.name << " is now hidden in the shadows.\n";
    }
};

void testStealthAbility() {
    Unit s;
    s.name = "Shadowblade";
    Stealth stealth;
    stealth.activate(s);
    assert(s.isInvisible() == true);
}

