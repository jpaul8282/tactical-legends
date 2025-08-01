using UnityEngine;

public class CinematicManager : MonoBehaviour
{
    public void PlayCinematic(string cinematicName)
    {
        // Integrate Unity Timeline or custom cutscene logic
        Debug.Log("Playing cinematic: " + cinematicName);
        // Example: TimelineDirector.Play(cinematicName);
    }
}