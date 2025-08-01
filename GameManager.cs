using UnityEngine;
using System.Collections.Generic;

public enum Region { MiddleEast, Europe, SouthAmerica, Israel, Gaza }
public enum MissionStatus { Locked, Unlocked, Completed }

[System.Serializable]
public class Mission
{
    public string Title;
    public string Description;
    public Region MissionRegion;
    public bool IsSecretOp;
    public MissionStatus Status;
    public int Reward;
    public string[] Objectives;
}

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;
    public List<Mission> AllMissions;
    public PlayerAgent Player;
    public int TotalRewards = 0;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
        DontDestroyOnLoad(gameObject);
    }

    public void CompleteMission(Mission mission)
    {
        mission.Status = MissionStatus.Completed;
        TotalRewards += mission.Reward;
        // Unlock the next mission or secret op
    }

    public Mission GetNextMission()
    {
        foreach (var m in AllMissions)
            if (m.Status == MissionStatus.Unlocked)
                return m;
        return null;
    }

    // Example mission: "The Hunt for Hamas"
    public void PopulateMissions()
    {
        AllMissions = new List<Mission>
        {
            new Mission {
                Title = "Operation Desert Ghost",
                Description = "Infiltrate a fortified enemy compound to retrieve stolen intel.",
                MissionRegion = Region.MiddleEast,
                IsSecretOp = false,
                Status = MissionStatus.Unlocked,
                Reward = 1500,
                Objectives = new[] { "Infiltrate compound", "Retrieve intel", "Exfiltrate" }
            },
            new Mission {
                Title = "The Hunt for Hamas",
                Description = "Stealthily locate and neutralize Hamas leadership in a dense urban environment. Avoid civilian casualties.",
                MissionRegion = Region.Gaza,
                IsSecretOp = true,
                Status = MissionStatus.Locked,
                Reward = 4000,
                Objectives = new[] { "Locate cell leader", "Gather intel", "Neutralize target", "Escape undetected" }
            },
            // Add more missions as needed
        };
    }
}