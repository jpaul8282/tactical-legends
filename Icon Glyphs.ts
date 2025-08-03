public class PhaseGlyph : MonoBehaviour {
    public string phaseName;
    public Sprite glyphIcon;
    public Color glowColor;
    public AudioSource audioSource;
    private float pulseIntensity = 0.0f;

    void Update() {
        pulseIntensity = Mathf.PingPong(Time.time * 2f, 1f);
        AnimateGlyph();
    }

    void AnimateGlyph() {
        transform.Rotate(Vector3.up * Time.deltaTime * 20f);
        float beatLevel = AudioManager.GetRhythmValue(audioSource);

        // Glow based on beat
        GetComponent<SpriteRenderer>().material.SetColor("_GlowColor", glowColor * beatLevel);
        transform.localScale = Vector3.one * (1f + beatLevel * 0.25f);
    }
}

public class MissionSelector : MonoBehaviour {
    public List<MissionNode> missions;
    public AudioClip soundtrack;
    public AudioReactiveUI beatGrid;
    public GlyphRing phaseGlyphs;
    public FactionBannerController bannerAnimator;
    public SkyboxPulseManager skyboxController;

    void Start() {
        AudioManager.Play(track: soundtrack);
        bannerAnimator.AnimateFactions(new string[] {"Pulseborn", "Synthronauts", "Echo Clerics"});
        phaseGlyphs.InitializeGlyphRotation();
    }

    void Update() {
        beatGrid.ListenForBeatTap();
        skyboxController.AnimateToMusicTempo();
        foreach (var mission in missions) {
            mission.UpdateLockState(AudioManager.CurrentRhythmPattern);
        }
    }
}

public class MissionNode {
    public bool isUnlocked;
    public string requiredBeatSequence;
    public void UpdateLockState(string currentBeat) {
        isUnlocked = (currentBeat == requiredBeatSequence);
        AnimateLockUI();
    }

    void AnimateLockUI() {
        if (!isUnlocked) {
            VisualFX.Shimmer("SonicReverb");
        } else {
            UIManager.PulseHighlight(this);
        }
    }
}

