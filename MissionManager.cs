using UnityEngine;
using System.Collections.Generic;

public class MissionManager : MonoBehaviour
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