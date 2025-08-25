using UnityEngine;
using System.Collections.Generic;

public class MissionManager: MonoBehaviour
{
    public List<Mission> Missions;

    public void StartMission(int missionId)
    {
        Missions[missionId].Status = MissionStatus.Unlocked;
        // Load level/map, set objectives, spawn enemies, etc.
    }

    public void CompleteObjective(int missionId, string objective)
    {
        // Mark objective complete, check if mission finished
    }

    public void GrantReward(int missionId)
    {
        GameManager.Instance.Player.AddReward(Missions[missionId].Reward);
    }
}
using UnityEngine;
using System.Collections.Generic;

public class MissionManager: MonoBehaviour
{
    public string missionId = "vault_breathes";
    public List<string> objectives = new List<string> {
        "Navigate corridors",
        "Disable AI sentinels",
        "Extract Surge Protocol"
    };

    public List<string> enemies = new List<string> {
        "AI Sentinel", "Memory Wraith"
    };

    public GameState gameState;

    void Start()
    {
        gameState = new GameState();
        gameState.InitializeSquad();
        StartMission();
    }

    void StartMission()
    {
        Debug.Log("Mission Started: " + missionId);
        foreach (string obj in objectives)
            Debug.Log("Objective: " + obj);

        EventManager.TriggerRandomEvent(gameState);
        MoraleManager.CheckMorale(gameState.squad);
        DialogueManager.PlayDialogue(gameState.squad);
    }
}

using System.Collections.Generic;

public class GameState
{
    public int trustScore = 65;
    public int moralityScore = 80;
    public List<SquadMember> squad = new List<SquadMember>();

    public void InitializeSquad()
    {
        squad.Add(new SquadMember("Echo Vanguard", 85));
        squad.Add(new SquadMember("Oistarian", 45));
    }
}

public class SquadMember
{
    public string name;
    public int morale;
    public string status;

    public SquadMember(string name, int morale)
    {
        this.name = name;
        this.morale = morale;
        this.status = "Active";
    }
}

