public class DayCycleManager : MonoBehaviour
{
    public Light directionalLight;
    public float cycleDuration = 300f;

    public void BeginCycle()
    {
        StartCoroutine(DayNightRoutine());
    }

    IEnumerator DayNightRoutine()
    {
        while (true)
        {
            // Night
            directionalLight.intensity = 0.2f;
            TriggerEvent("NightRaid");

            yield return new WaitForSeconds(cycleDuration);

            // Day
            directionalLight.intensity = 1f;
            TriggerEvent("DayPatrol");

            yield return new WaitForSeconds(cycleDuration);
        }
    }
}

