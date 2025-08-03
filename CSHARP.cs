public class CivilianBehavior : MonoBehaviour
{
    public enum EmotionState { Calm, Fear, Panic, Resist }
    private EmotionState currentState = EmotionState.Calm;

    void Update()
    {
        DetectThreats();
        HandleEmotion();
    }

    void DetectThreats()
    {
        float nearestEnemyDistance = GetNearestEnemyDistance();

        if (nearestEnemyDistance < 5f)
            currentState = EmotionState.Panic;
        else if (nearestEnemyDistance < 10f)
            currentState = EmotionState.Fear;
        else
            currentState = EmotionState.Calm;
    }

    void HandleEmotion()
    {
        switch (currentState)
        {
            case EmotionState.Calm:
                Wander();
                break;
            case EmotionState.Fear:
                RunFromThreat();
                break;
            case EmotionState.Panic:
                KnockOverObjects();
                break;
            case EmotionState.Resist:
                GrabThrown Object();
                break;
        }
    }

    float GetNearestEnemyDistance()
    {
        // Mockup detection logic (replace with actual radar)
        return UnityEngine.Random.Range(3f, 20f);
    }
}

