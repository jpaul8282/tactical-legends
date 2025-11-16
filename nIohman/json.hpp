// Unit.h
#pragma once
#include <string>
#include <vector>
#include <map>

struct Ability {
    std::string id;
    std::string name;
    std::string description;
    int cooldown = 0;
    bool passive = false;
};

class Unit {
public:
    std::string unit_id;
    std::string name;
    std::string description;
    std::string faction;
    std::string sprite;

    int hp, attack, defense, movement, range, initiative;
    std::vector<Ability> abilities;
    std::map<std::string, int> resistances;
    std::vector<std::string> tags;
    int cost_gold = 0;
    int cost_mana = 0;
};
// UnitLoader.cpp
#include "Unit.h"
#include <fstream>
#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

Unit loadUnitFromFile(const std::string& filepath) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open unit file: " + filepath);
    }

    json j;
    file >> j;

    Unit unit;
    unit.unit_id = j.at("unit_id").get<std::string>();
    unit.name = j.at("name").get<std::string>();
    unit.description = j.value("description", "");
    unit.faction = j.value("faction", "Neutral");
    unit.sprite = j.at("sprite").get<std::string>();

    auto stats = j.at("stats");
    unit.hp = stats.at("hp").get<int>();
    unit.attack = stats.at("attack").get<int>();
    unit.defense = stats.at("defense").get<int>();
    unit.movement = stats.at("movement").get<int>();
    unit.range = stats.at("range").get<int>();
    unit.initiative = stats.at("initiative").get<int>();

    for (const auto& ab : j.at("abilities")) {
        Ability ability;
        ability.id = ab.at("id").get<std::string>();
        ability.name = ab.at("name").get<std::string>();
        ability.description = ab.value("description", "");
        ability.cooldown = ab.value("cooldown", 0);
        ability.passive = ab.value("passive", false);
        unit.abilities.push_back(ability);
    }

    if (j.contains("resistances")) {
        for (auto& [key, value] : j["resistances"].items()) {
            unit.resistances[key] = value.get<int>();
        }
    }

    unit.tags = j.value("tags", std::vector<std::string>{});
    unit.cost_gold = j["cost"].value("gold", 0);
    unit.cost_mana = j["cost"].value("mana", 0);

    return unit;
}


{
  "unit_id": "shadow_knight",
  "name": "Shadow Knight",
  "description": "A stealthy melee fighter with lifesteal abilities.",
  "faction": "Dark Legion",
  "sprite": "assets/unit_sprites/shadow_knight.png",
  "stats": {
    "hp": 120,
    "attack": 30,
    "defense": 15,
    "movement": 4,
    "range": 1,
    "initiative": 8
  },
  "abilities": [
    {
      "id": "stealth",
      "name": "Stealth",
      "description": "Invisible to enemies unless adjacent.",
      "cooldown": 3
    },
    {
      "id": "lifesteal",
      "name": "Lifesteal",
      "description": "Heals for 50% of damage dealt.",
      "passive": true
    }
  ],
  "resistances": {
    "fire": -10,
    "ice": 20,
    "poison": 50
  },
  "tags": ["melee", "dark", "elite"],
  "cost": {
    "gold": 300,
    "mana": 50
  }
}
#include "Unit.h"
#include <iostream>

int main() {
    try {
        Unit shadowKnight = loadUnitFromFile("mods/my_mod/shadow_knight.json");
        std::cout << "Loaded unit: " << shadowKnight.name << " with HP: " << shadowKnight.hp << "\n";
    } catch (const std::exception& e) {
        std::cerr << "Error loading unit: " << e.what() << "\n";
    }
}


