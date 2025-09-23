mkdir -p scripts/ai
touch scripts/ai/hello_sniper.py
# hello_sniper.py

def on_turn(game):
    for unit in game.get_enemy_units():
        if unit.type == "Sniper":
            unit.move_to_cover()
            unit.aim_at_highest_threat()
            game.log(f"{unit.name} moved and aimed at a threat.")
"ai_script": "scripts/ai/hello_sniper.py"
mission.AIScript = "scripts/ai/hello_sniper.py";
# hello_sniper.py (alternate)
def on_turn(game):
    for unit in game.get_enemy_units():
        if unit.health < 50:
            unit.retreat()
        else:
            unit.attack_nearest()
