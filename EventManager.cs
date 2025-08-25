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

