from typing import Callable, Dict, Tuple, Any, List
import random

class Unit:
    def __init__(self, name: str, position: Tuple[int, int], max_hp: int = 100, team: str = None):
        self.name: str = name
        self.position: Tuple[int, int] = position
        self.abilities: Dict[str, Callable] = {}
        self.cooldowns: Dict[str, int] = {}
        self.max_hp: int = max_hp
        self.hp: int = max_hp
        self.team: str = team
        self.status_effects: Dict[str, int] = {}  # e.g. {'stunned': 2}
        self.shield: int = 0
        self.energy: int = 100  # Futuristic energy bar
        self.cloaked: bool = False
        self.augmentations: List[str] = []

    def set_ability(self, ability_name: str, ability_func: Callable, cooldown: int):
        self.abilities[ability_name] = (ability_func, cooldown)
        self.cooldowns[ability_name] = 0

    def can_use_ability(self, ability_name: str) -> bool:
        return self.cooldowns.get(ability_name, 0) == 0 and not self.status_effects.get("stunned", 0)

    def use_ability(self, ability_name: str, *args, **kwargs) -> str:
        if not self.can_use_ability(ability_name):
            if self.status_effects.get("stunned", 0):
                return f"{self.name} is stunned and cannot act."
            return f"Ability {ability_name} is on cooldown for {self.cooldowns[ability_name]} more turns."
        ability_func, default_cooldown = self.abilities[ability_name]
        result = ability_func(self, *args, **kwargs)
        self.cooldowns[ability_name] = result.get('cooldown', default_cooldown)
        return result['message']

    def take_damage(self, amount: int):
        damage_taken = max(0, amount - self.shield)
        self.hp = max(0, self.hp - damage_taken)
        self.shield = max(0, self.shield - amount)
        return f"{self.name} takes {damage_taken} damage! HP: {self.hp}"

    def heal(self, amount: int):
        self.hp = min(self.max_hp, self.hp + amount)
        return f"{self.name} heals {amount} HP! HP: {self.hp}"

    def add_status(self, status: str, turns: int):
        self.status_effects[status] = turns

    def end_turn(self):
        for ab in self.cooldowns:
            if self.cooldowns[ab] > 0:
                self.cooldowns[ab] -= 1
        expired = []
        for status in self.status_effects:
            self.status_effects[status] -= 1
            if self.status_effects[status] <= 0:
                expired.append(status)
        for status in expired:
            del self.status_effects[status]
        # Energy regeneration for futuristic units
        self.energy = min(100, self.energy + 10)

    # Futuristic feature: Cloak device
    def set_cloak(self, turns: int):
        self.cloaked = True
        self.add_status("cloaked", turns)

    def remove_cloak(self):
        self.cloaked = False

# --- Super Soldier Futuristic Abilities ---
def nano_heal(unit, target_unit, amount: int = 40):
    if unit.energy < 20:
        return {"message": f"{unit.name} lacks energy for Nano-Heal.", "cooldown": 0}
    unit.energy -= 20
    msg = target_unit.heal(amount)
    return {"message": f"{unit.name} uses Nano-Heal! {msg}", "cooldown": 2}

def plasma_blast(unit, target_unit, damage: int = 50):
    if unit.energy < 30:
        return {"message": f"{unit.name} lacks energy for Plasma Blast.", "cooldown": 0}
    if abs(unit.position[0] - target_unit.position[0]) + abs(unit.position[1] - target_unit.position[1]) > 6:
        return {"message": "Target is out of plasma blast range.", "cooldown": 0}
    unit.energy -= 30
    msg = target_unit.take_damage(damage)
    return {"message": f"{unit.name} fires Plasma Blast! {msg}", "cooldown": 3}

def adaptive_shield(unit, amount: int = 40, duration: int = 2):
    if unit.energy < 25:
        return {"message": f"{unit.name} lacks energy for Adaptive Shield.", "cooldown": 0}
    unit.energy -= 25
    unit.shield += amount
    unit.add_status("shielded", duration)
    return {"message": f"{unit.name} deploys Adaptive Shield for {duration} turns!", "cooldown": 4}

def cloak_device(unit, duration: int = 2):
    if unit.energy < 30:
        return {"message": f"{unit.name} lacks energy for Cloak Device.", "cooldown": 0}
    unit.energy -= 30
    unit.set_cloak(duration)
    return {"message": f"{unit.name} activates Cloak Device and is invisible for {duration} turns!", "cooldown": 5}

def overclock(unit):
    if unit.energy < 40:
        return {"message": f"{unit.name} lacks energy for Overclock.", "cooldown": 0}
    unit.energy -= 40
    unit.add_status("overclocked", 2)
    # Overclock doubles all damage for 2 turns (would require custom logic in take_damage/abilities)
    return {"message": f"{unit.name} overclocks: doubled damage for 2 turns!", "cooldown": 6}

def tactical_blink(unit, grid_size: Tuple[int, int]):
    if unit.energy < 15:
        return {"message": f"{unit.name} lacks energy for Tactical Blink.", "cooldown": 0}
    unit.energy -= 15
    x = random.randint(max(0, unit.position[0] - 3), min(grid_size[0] - 1, unit.position[0] + 3))
    y = random.randint(max(0, unit.position[1] - 3), min(grid_size[1] - 1, unit.position[1] + 3))
    unit.position = (x, y)
    return {"message": f"{unit.name} blinks tactically to {unit.position}!", "cooldown": 2}

def emp_pulse(unit, units: List[Unit], range_limit: int = 2):
    if unit.energy < 35:
        return {"message": f"{unit.name} lacks energy for EMP Pulse.", "cooldown": 0}
    unit.energy -= 35
    affected = []
    for target in units:
        dist = abs(unit.position[0] - target.position[0]) + abs(unit.position[1] - target.position[1])
        if dist <= range_limit:
            target.add_status("stunned", 1)
            affected.append(target.name)
    return {"message": f"{unit.name} emits EMP Pulse! Stunned: {', '.join(affected)}", "cooldown": 5}

def nanite_swarm(unit, target_unit):
    if unit.energy < 25:
        return {"message": f"{unit.name} lacks energy for Nanite Swarm.", "cooldown": 0}
    unit.energy -= 25
    target_unit.add_status("nanite_infection", 2)
    return {"message": f"{unit.name} infects {target_unit.name} with Nanite Swarm (2 turns damage over time)!", "cooldown": 4}

# Example usage:
if __name__ == "__main__":
    cyborg = Unit("Nova Cyborg", (1, 1), max_hp=150)
    cyborg.set_ability("Nano Heal", nano_heal, cooldown=2)
    cyborg.set_ability("Plasma Blast", plasma_blast, cooldown=3)
    cyborg.set_ability("Adaptive Shield", adaptive_shield, cooldown=4)
    cyborg.set_ability("Cloak Device", cloak_device, cooldown=5)
    cyborg.set_ability("Overclock", overclock, cooldown=6)
    cyborg.set_ability("Tactical Blink", tactical_blink, cooldown=2)
    cyborg.set_ability("EMP Pulse", emp_pulse, cooldown=5)
    cyborg.set_ability("Nanite Swarm", nanite_swarm, cooldown=4)

    soldier = Unit("Atlas Soldier", (2, 2), max_hp=120)
    medic = Unit("Quantum Medic", (1, 2), max_hp=100)

    print(cyborg.use_ability("Nano Heal", cyborg))
    print(cyborg.use_ability("Plasma Blast", soldier))
    print(cyborg.use_ability("Adaptive Shield"))
    print(cyborg.use_ability("Cloak Device"))
    print(cyborg.use_ability("Overclock"))
    print(cyborg.use_ability("Tactical Blink", (10, 10)))
    print(cyborg.use_ability("EMP Pulse", [soldier, medic]))
    print(cyborg.use_ability("Nanite Swarm", soldier))

    # End turn logic for status/energy regen and cloak expiration
    cyborg.end_turn()
    print(f"Energy after recharge: {cyborg.energy}")
    print(f"Status effects: {cyborg.status_effects}")
