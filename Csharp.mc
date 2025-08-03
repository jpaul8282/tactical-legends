public class ConflictEscalation : MonoBehaviour
{
    public int alertLevel = 0; // 0 = Peaceful, 1 = Alert, 2 = Skirmish, 3 = Warzone
    public int civilianCasualties = 0;
    public string dominantFaction = "Neutral";

    void Update()
    {
        MonitorEvents();
        AdjustAlertLevel();
    }

    void MonitorEvents()
    {
        if (civilianCasualties > 3)
            alertLevel++;
        if (Time.timeSinceLevelLoad > 600 && dominantFaction != "Neutral")
            alertLevel++;
    }

    void AdjustAlertLevel()
    {
        switch (alertLevel)
        {
            case 1:
                TriggerEvent("FactionTensionRise");
                break;
            case 2:
                ActivateCheckpoints();
                break;
            case 3:
                DeployEliteUnits();
                BroadcastWarning();
                break;
        }
    }
}

