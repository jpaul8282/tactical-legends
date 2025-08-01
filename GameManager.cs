using UnityEngine;
using System.Collections.Generic;

public enum Region { MiddleEast, Europe, SouthAmerica }
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
}