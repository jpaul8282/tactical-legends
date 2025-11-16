// C++ example
void MoveUnit(int unitId, int x, int y);
void SpawnEnemy(string type, int x, int y);
// C# example
public void TriggerMission(string missionId);
public Squad GetPlayerSquad();
# ai_sniper.py
def on_turn(game):
    for unit in game.get_enemy_units():
        if unit.type == "Sniper":
            unit.move_to_cover()
            unit.aim_at_highest_threat()
          Wiki/
├── Getting Started
│   └── Installing the Modding SDK
├── Python Scripting
│   ├── AI Behavior Scripts
│   ├── Mission Generators
│   └── Codex Hooks
├── System Diagrams
│   ├── Squad Builder Flow
│   ├── Gear Upgrade Pipeline
│   └── Emotional Recon System
├── UI Modding
│   └── Dashboard & Codex Viewer
├── Plugin Architecture
│   └── How to Extend Tactical Legends
