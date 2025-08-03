public class AudioManager : MonoBehaviour
{
    public AudioClip sirenLoop, crowdChant, rainDrip;

    public void PlayAmbientLayer(string layerName)
    {
        switch (layerName)
        {
            case "SirenLoop":
                AudioSource.PlayClipAtPoint(sirenLoop, transform.position);
                break;
            case "CrowdChant":
                AudioSource.PlayClipAtPoint(crowdChant, transform.position);
                break;
            case "RainDrip":
                AudioSource.PlayClipAtPoint(rainDrip, transform.position);
                break;
        }
    }
}

