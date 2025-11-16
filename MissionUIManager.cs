using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class MissionUIManager : MonoBehaviour
{
    public GameObject MissionPanel;
    public Text MissionTitleText;
    public Text MissionDescText;
    public Button StartMissionButton;
    public Dropdown MissionDropdown;
    private List<Mission> missions;

    void Start()
    {
        missions = GameManager.Instance.AllMissions;
        PopulateDropdown();
    }

    void PopulateDropdown()
    {
        MissionDropdown.ClearOptions();
        List<string> options = new List<string>();
        foreach(var m in missions)
            options.Add(m.Title);
        MissionDropdown.AddOptions(options);
        MissionDropdown.onValueChanged.AddListener(OnMissionSelected);
    }

    void OnMissionSelected(int index)
    {
        var mission = missions[index];
        MissionTitleText.text = mission.Title;
        MissionDescText.text = mission.Description;
        StartMissionButton.onClick.RemoveAllListeners();
        StartMissionButton.onClick.AddListener(() => StartSelectedMission(mission));
    }

    void StartSelectedMission(Mission mission)
    {
        GameManager.Instance.CompleteMission(mission);
        // Load map, start gameplay, etc.
    }
}