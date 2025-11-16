using UnityEngine;

public class SecretOperations : MonoBehaviour
{
    public Mission[] SecretOps;

    public void TriggerSecretOp(int opId)
    {
        // Unique objectives, special rewards, higher difficulty
        GameManager.Instance.AllMissions.Find(m => m.Title == SecretOps[opId].Title).Status = MissionStatus.Unlocked;
    }
}