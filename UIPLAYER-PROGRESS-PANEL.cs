intro_cutscene:
  visuals:
    - "Dark ocean trench with storm flashing overhead"
    - "Agents descend into pressure hatch with glowing masks"
    - "Enemy sonar ping distorts screen with red pulses"
  narration:
    - speaker: "Narrator"
      line: "Beneath the waves lies the final code. But enemies don’t just guard—they listen. Make noise, and you vanish."
  transition:
    - effect: "Water ripple morph into tactical HUD
public class UIPlayerProgressPanel : MonoBehaviour
{
    public Image divisionBadge;
    public Text rankTitle;
    public Slider intelRatingBar;
    public Text nextReward;

    public void UpdateUI(PlayerData data)
    {
        rankTitle.text = data.rank.ToString();
        intelRatingBar.value = data.intelScore / data.rankThreshold;
        nextReward.text = data.upcomingUnlock;
        divisionBadge.sprite = BadgeLibrary.GetBadge(data.rank);
    }
}

public enum AudioMood { Calm, Alert, Combat, Unknown }

public class SoundProfileManager : MonoBehaviour
{
    public AudioClip calmAmbience, alertLoop, combatPulse;

    public void ChangeAudioMood(AudioMood mood)
    {
        switch (mood)
        {
            case AudioMood.Calm:
                PlayClip(calmAmbience);
                break;
            case AudioMood.Alert:
                PlayLoop(alertLoop);
                break;
            case AudioMood.Combat:
                Intensify(combatPulse);
                break;
        }
    }

    void PlayClip(AudioClip clip)
    {
        AudioSource.PlayClipAtPoint(clip, transform.position);
    }
}

