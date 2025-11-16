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

using UnityEngine;
using System.Collections.Generic;

public class CampaignManager: MonoBehaviour
{
    public List<Mission> campaignMissions;
    public GameState gameState;

    void Start()
    {
        gameState = new GameState();
        gameState.InitializeSquad();
        LoadCampaign();
        StartMission(0);
    }

    void LoadCampaign()
    {
        campaignMissions = new List<Mission>
        {
            new Mission("Echoes in the Dust", new List<string> {
                "Locate Eden Vault entrance",
                "Survive Memory Wraith ambush"
            }, "Ruins of Oistaria Prime", "Chapter 1"),

            new Mission("Vault Breathes", new List<string> {
                "Navigate corridors",
                "Disable AI sentinels",
                "Extract Surge Protocol"
            }, "Pulse-reactive corridors", "Chapter 2"),

            new Mission("Surge Unbound", new List<string> {
                "Defeat Vault Guardian",
                "Escape Eden collapse"
            }, "Core Chamber", "Chapter 3")
        };
    }

    public void StartMission(int index)
    {
        Mission current = campaignMissions[index];
        Debug.Log($"Starting Mission: {current.title}");
        foreach (string obj in current.objectives)
            Debug.Log($"Objective: {obj}");

        EventManager.TriggerRandomEvent(gameState);
        MoraleManager.CheckMorale(gameState.squad);
        DialogueManager.PlayDialogue(gameState.squad);
    }
}

using System.Collections.Generic;

public class Mission
{
    public string title;
    public List<string> objectives;
    public string environment;
    public string chapter;

    public Mission(string title, List<string> objectives, string environment, string chapter)
    {
        this.title = title;
        this.objectives = objectives;
        this.environment = environment;
        this.chapter = chapter;
    }
}

using System.Collections.Generic;

public class GameState
{
    public int trustScore = 65;
    public int moralityScore = 80;
    public List<SquadMember> squad = new List<SquadMember>();
    public string faction = "Neutral";

    public void InitializeSquad()
    {
        squad.Add(new SquadMember("Echo Vanguard", 85));
        squad.Add(new SquadMember("Oistarian", 45));
        squad.Add(new SquadMember("Korr Vex", 60));
        squad.Add(new SquadMember("Nyla Sera", 70));
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

using UnityEngine;

public static class EventManager
{
    public static void TriggerRandomEvent(GameState state)
    {
        int roll = Random.Range(0, 100);
        if (roll < 20)
        {
            Debug.Log("Event: Ally Wounded");
            MoraleManager.AdjustMorale(state.squad, -20);
        }
        else if (roll < 40)
        {
            Debug.Log("Event: Emotional Trigger");
            MoraleManager.AdjustMorale(state.squad, -25);
        }
        else if (roll < 60)
        {
            Debug.Log("Event: Save Teammate");
            MoraleManager.AdjustMorale(state.squad, 25);
        }
        else
        {
            Debug.Log("Event: Mission Success");
            MoraleManager.AdjustMorale(state.squad, 15);
        }
    }
}

using UnityEngine;
using System.Collections.Generic;

public static class MoraleManager
{
    public static void AdjustMorale(List<SquadMember> squad, int change)
    {
        foreach (var member in squad)
        {
            member.morale = Mathf.Clamp(member.morale + change, 0, 100);
        }
    }

    public static void CheckMorale(List<SquadMember> squad)
    {
        foreach (var member in squad)
        {
            string level = GetMoraleLevel(member.morale);
            Debug.Log($"{member.name} morale: {member.morale} ({level})");
        }
    }

    private static string GetMoraleLevel(int morale)
    {
        if (morale >= 80) return "High";
        if (morale >= 40) return "Neutral";
        if (morale > 0) return "Low";
        return "Broken";
    }
}

using UnityEngine;
using System.Collections.Generic;

public static class DialogueManager
{
    public static void PlayDialogue(List<SquadMember> squad)
    {
        foreach (var member in squad)
        {
            string line = GetDialogue(member);
            Debug.Log(line);
        }
    }

    private static string GetDialogue(SquadMember member)
    {
        if (member.morale >= 80)
            return $"{member.name}: “We finish this together.";
        else if (member.morale >= 40)
            return $"{member.name}: “I’m holding it together. For now.”
        else if (member.morale > 0)
            return $"{member.name}: “I’m not sure I can keep going.";
        else
            return $"{member.name}: “I’m done. Don’t count on me.";
    }
}

