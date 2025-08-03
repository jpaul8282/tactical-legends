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

public void SlideToMenu(GameObject currentMenu, GameObject nextMenu)
{
    LeanTween.moveX(currentMenu.GetComponent<RectTransform>(), -2000f, 0.4f).setEaseInBack().setOnComplete(() =>
    {
        currentMenu.SetActive(false);
        nextMenu.SetActive(true);
        LeanTween.moveX(nextMenu.GetComponent<RectTransform>(), 0f, 0.4f).setEaseOutExpo();
    });
}

public ParticleSystem hudFlashParticle;

public void TriggerHUDFeedback(Vector3 uiPosition)
{
    hudFlashParticle.transform.position = uiPosition;
    hudFlashParticle.Play();
    TriggerHUDPing(); // Reuse audio ping from the immersion manager
}

public enum RegionType { Desert, Submarine, Forest }
public AudioSource ambientSource;
public AudioClip desertAmbience, subAmbience, forestAmbience;

public void SetRegionAmbience(RegionType type)
{
    switch (type)
    {
        case RegionType.Desert:
            ambientSource.clip = desertAmbience;
            ambientSource.volume = 0.5f;
            break;
        case RegionType.Submarine:
            ambientSource.clip = subAmbience;
            ambientSource.volume = 0.8f;
            ambientSource.spatialBlend = 1f; // 3D echo chamber
            break;
        case RegionType.Forest:
            ambientSource.clip = forestAmbience;
            ambientSource.volume = 0.6f;
            break;
    }
    ambientSource.Play();
}

public void UpdateHUDState(string state)
{
    switch (state)
    {
        case "Stealth":
            hudFlashParticle.startColor = Color.cyan;
            TriggerStealthPulse();
            break;
        case "Alert":
            hudFlashParticle.startColor = Color.red;
            TriggerHUDPing();
            break;
        case "Boosted":
            hudFlashParticle.startColor = Color.yellow;
            TriggerMutatorEffect("TimeDilation");
            break;
    }
    hudFlashParticle.Play();
}

public void BlendAmbientLayers(RegionType region, float tension)
{
    ambientSource.volume = Mathf.Lerp(0.3f, 0.9f, tension);

    if (region == RegionType.Desert && tension > 0.7f)
    {
        // Add sandstorm layer, increase wind howl
    }
    else if (region == RegionType.Submarine && tension > 0.6f)
    {
        // Metallic groans + pressure hisses
    }
    // Smooth crossfades between audio zones
}

public AudioClip sonarPing;
public GameObject sonarRipplePrefab;

public void TriggerSonar(Vector3 origin)
{
    AudioSource.PlayClipAtPoint(sonarPing, origin);

    GameObject ripple = Instantiate(sonarRipplePrefab, origin, Quaternion.identity);
    ripple.transform.localScale = Vector3.zero;
    LeanTween.scale(ripple, Vector3.one * 5f, 1f).setEaseOutCirc();

    Destroy(ripple, 2f); // Clean up effect
}

public void OnMissionPhaseChanged(string phase)
{
    switch (phase)
    {
        case "Extraction":
            SetRegionAmbience(RegionType.Submarine);
            PlayBriefing(extractionDialogue, "Alert");
            break;
        case "Infiltration":
            UpdateHUDState("Stealth");
            TriggerSonar(player.transform.position);
            break;
        case "Boss":
            UpdateEncryptedMenuVisual(true);
            BlendAmbientLayers(RegionType.Desert, 0.9f);
            break;
    }
}

public void BroadcastSquadSonar(Vector3 origin)
{
    foreach (var teammate in squadList)
    {
        if (teammate != null)
        {
            AudioSource.PlayClipAtPoint(sonarPing, teammate.transform.position);
            Instantiate(sonarRipplePrefab, teammate.transform.position, Quaternion.identity);
        }
    }
}

public void StartCipherChallenge(AudioClip targetRhythm)
{
    PlayRhythm(targetRhythm); // AI-Generated encryption pulse
    // Wait for player input rhythm via timing taps
}

public void ValidateRhythmInput(float[] userPattern, float[] targetPattern)
{
    bool isMatch = CompareRhythms(userPattern, targetPattern);
    if (isMatch)
    {
        TriggerVaultUnlock(); // Add distortion dissolve FX
    }
    else
    {
        PlayFailureTone(); // Echo-ping scramble with HUD flicker
    }
}

public GameObject[] cipherRings;
public AudioClip cipherRhythm;

public void SyncCipherVisuals(float[] pulseTimings)
{
    for (int i = 0; i < cipherRings.Length; i++)
    {
        float delay = pulseTimings[i];
        LeanTween.scale(cipherRings[i], Vector3.one * 1.2f, 0.2f).setDelay(delay).setEaseOutElastic().setLoopPingPong(2);
        // Optional: color shift glow via emission based on rhythm match
    }
    AudioSource.PlayClipAtPoint(cipherRhythm, transform.position);
}

public void PlayStealthStepSound(Vector3 position, float heartbeatRate)
{
    float pitchMod = Mathf.Clamp(heartbeatRate / 120f, 0.8f, 1.3f);
    AudioSource stepAudio = gameObject.AddComponent<AudioSource>();
    stepAudio.clip = Resources.Load<AudioClip>("Stealth/step");
    stepAudio.pitch = pitchMod;
    stepAudio.spatialBlend = 1f;
    stepAudio.Play();
    Destroy(stepAudio, 1f);
}

public void TriggerEchoDisruptor(Vector3 zoneCenter, float radius)
{
    GameObject disruptorField = Instantiate(disruptorFXPrefab, zoneCenter, Quaternion.identity);
    AudioLowPassFilter lowPass = disruptorField.AddComponent<AudioLowPassFilter>();
    lowPass.cutoffFrequency = 500f;

    Collider[] affected = Physics.OverlapSphere(zoneCenter, radius);
    foreach (Collider unit in affected)
    {
        if (unit.CompareTag("Player"))
        {
            // Reduce sonar clarity
            unit.GetComponent<PlayerSonar>().SetDisrupted(true);
        }
    }

    Destroy(disruptorField, 5f); // Auto-fade after effect duration
}

public void StartGearRemixChallenge(AudioClip remixLoop)
{
    AudioSource remixSource = gameObject.AddComponent<AudioSource>();
    remixSource.clip = remixLoop;
    remixSource.loop = true;
    remixSource.Play();

    // UI shows beat pads or timed glyph pulses
    // Player must tap in rhythm to cycle gear options
}

public void StartSquadCipherSequence(AudioClip[] playerRhythms)
{
    for (int i = 0; i < playerRhythms.Length; i++)
    {
        float delay = i * 1.2f;
        AudioSource playerTone = squad[i].AddComponent<AudioSource>();
        playerTone.clip = playerRhythms[i];
        playerTone.PlayDelayed(delay);

        // HUD pulses in sync with each player’s beat
        TriggerHUDGlyphPulse(squad[i].transform.position, delay);
    }

    // If all players time correctly → trigger unlock ripple
}

public void TriggerBossShieldBreak(float[] playerInputs, float[] coreBeatPattern)
{
    if (CompareRhythms(playerInputs, coreBeatPattern))
    {
        bossShield.SetActive(false);
        PlayShieldBreakFX();
        bossHealth.vulnerable = true;
    }
    else
    {
        PlayShieldDistortion();
        FlashScreenRed();
    }
}

public void SetFactionAudioTheme(string faction)
{
    switch (faction)
    {
        case "Pulseborn": LoadRhythm("tribal_stomp"); break;
        case "Synthronauts": LoadRhythm("machine_pulse"); break;
        case "Echo Ascendants": LoadRhythm("harmonic_drift"); break;
    }
    // Apply rhythm influence to menu FX, stealth steps, HUD glow
}

public void ActivateSonicStormPhase()
{
    AudioSource stormSource = gameObject.AddComponent<AudioSource>();
    stormSource.clip = Resources.Load<AudioClip>("Endgame/sonic_storm_theme");
    stormSource.loop = true;
    stormSource.Play();

    SpawnEchoCyclones(); // Giant waveform tornadoes
    ShiftTerrainViaRhythm(); // Floor pulses open vault paths
    WarpSkyboxTo Beat(); // Sky syncs with musical climax
}

public void UpdateFactionMenuStyle(string faction)
{
    switch (faction)
    {
        case "Pulseborn":
            PlayMenuBeat("tribal_stomp");
            AnimateMenuRipple("drum_burst");
            break;
        case "Synthronauts":
            PlayMenuBeat("synth_ticks");
            AnimateMenuGlitchGate("grid_flicker");
            break;
        case "Echo Ascendants":
            PlayMenuBeat("harmonic_wave");
            AnimateMenuFade("resonant_glow");
            break;
    }
}

Cinematic Trailer Script: Tactical Legends — The Resonance War
[Opening Scene: Faint pulse in dark] 🎧 Whispers echo… a vault trembles…
NARRATOR (deep and melodic):
"In the age of silence, rhythm became the weapon. Factions rose. Harmony fractured. And only resonance remains."
[Flash cuts: HUD glyphs sync. Squad sonar pulses. A boss shimmers behind an audio shield.]
🎵 Music builds—a tribal stomp, followed by synth bursts and melodic waves colliding.
NARRATOR:
"You don't just fight. You perform. Decode vaults. Remix gear. Shatter shields with rhythm. Lead your squad through echo storms and cipher harmonics."
[Quick-cut beats: Menu flashes. HUD syncs. Echo cyclone. Boss roar.]
NARRATOR (crescendo):
"Tactical Legends. The war isn't over. The next beat… is yours."
[Logo pulses with beat. Sonic ring ripple out. Screen fades.]

public void AnimateFactionIntro(string faction, float inputTempo)
{
    AudioSource theme = GetComponent<AudioSource>();
    theme.clip = Resources.Load<AudioClip>($"FactionThemes/{faction}");
    theme.pitch = Mathf.Clamp(inputTempo / 60f, 0.9f, 1.2f);
    theme.Play();

    AnimateSigilGlow(faction, inputTempo);
    PulseBackgroundFX(inputTempo);
}

Cinematic In-Game Cutscene: Echofall
[Scene 1 – Vault Doors Pulse]
Rhythmic glyphs rotate. A vault cracks open with sonic resonance.
VOICEOVER (calm, resonant):
"Echo does not lie. It reveals. It remembers. It decides."
🎧 Ambient build—faction beat layers sneak in: tribal drum, synthetic pulse, melodic drift.
[Scene 2 – Squad Pulse March]
Each member emits synchronized sonar rings. The terrain ripples.
VOICEOVER:
"They march not as soldiers… but as signals. Carriers of broken harmony."
[Scene 3 – Boss Emerges]
Shrouded in audio armor. HUD glitches. Music distortion blares.
🎵 Players rise, tap in rhythm. HUD pulses match beat. Shield cracks.
VOICEOVER (echoing):
"The storm begins again. Tactical Legends rise."
🎬 Logo flashes with waveform ripples. Sound fades. Glyph echoes drift.
public void StartLoadingCipherChallenge()
{
    AudioSource loadingTrack = GetComponent<AudioSource>();
    loadingTrack.clip = Resources.Load<AudioClip>("Loading/loading_beatloop");
    loadingTrack.Play();

    ShowGlyphGrid(); // UI grid pulses in rhythm
    BeginBeatMatchInput(); // Players tap inputs to sync
}

public void StartCreditSymphony()
{
    foreach (var faction in factions)
    {
        PlayFactionMelody(faction); // Layered beats
        AnimateCreditWave(faction); // Dev names appear in synced pulses
    }

    ShowRemixControls(); // Allow tempo, pitch, FX adjustments
}

// Resonance of War – The Six-Phase Manifesto
void LaunchIntroSequence() {
    FadeIn("battlefield_whispers.mp3", 2.0f);
    PlaySound("thunder_crack.wav");
    AnimateHUDPulse("softRhythm");

    Narrator.Speak("In a world where tactics collide with sound… where every choice echoes across terrain… Tactical Legends rises with a revolutionary blueprint.");
}

void RenderGameDevManifesto() {
    SceneManager.Load("BlueprintReveal");
    Animate("PageFlip");
    Transition("WireframeToGameplay");

    Narrator.Speak("Phase by phase, we designed not just a game… but a philosophy.");

    Manifesto.AddPhase("Strategic Immersion Core", 
        "Weather becomes weapon. Cities breathe tactics. Vision and morale bend to nature’s tempo.");
    Manifesto.AddPhase("Environmental Dynamics", 
        "Traps whisper from rooftops. Civilian clutter isn’t chaos—it’s opportunity.");
    Manifesto.AddPhase("Rhythm-Fueled Multiplayer", 
        "Teams tune their tactics. Dualities sync to survive. The battlefield becomes a beatmap.");
    Manifesto.AddPhase("Audio Intelligence", 
        "Menus shimmer with encrypted tones. HUD particles respond like sonar waves.");
    Manifesto.AddPhase("Cipher Battles & Boss Cadence", 
        "Harmonic combos breach shields. Vaults open with sonic resonance. Players perform, not just play.");
    Manifesto.AddPhase("Endgame Symphony", 
        "Factions pulse with sound DNA. A sonic storm reshapes the world—terrain and skybox move to your music.");

    UI.Overlay("composer_notes.png");
    UI.Overlay("dev_sketches.png");
    UI.Overlay("logic_tree_animation.gif");
}

void InteractiveLoreTimeline() {
    SceneManager.Load("StarfieldTimeline");
    Animate("ScrollUnfurl");
    UI.PulseNodes("speakerPulse");

    Narrator.Speak("The war isn’t told—it’s unlocked.");

    Timeline.AddEvent("Beat Shard Encounter", "sniper_harmonics.wav");
    Timeline.AddEvent("Faction Rise", "stealth_echoes.wav");
    Timeline.AddEvent("Temporal Rupture", "ambient_storm_hum.wav");
}

void VisualRoadmapMarketing() {
    SceneManager.Load("MarketingIcons");
    Animate("IconRipple", ["thundercloud", "waveform", "fractal_cipher"]);

    Narrator.Speak("For investors. For fans. For believers.");

    Roadmap.VisualizePhase("Strategic Immersion", "icon_weather.png");
    Roadmap.VisualizePhase("Audio Intelligence", "icon_waveform.png");
    Roadmap.VisualizeGameplayLoop("AnimatedSequence_01.gif");

    UI.DisplaySplash("Tactical Legends", "Conduct the War. Play the Pulse.");
}

/ Timeline Setup
PlayableDirector director = GetComponent<PlayableDirector>();
TimelineAsset sixPhaseTimeline = Resources.Load<TimelineAsset>("Timelines/SixPhaseManifesto");

// Binding Tracks
director.playableAsset = sixPhaseTimeline;
director.SetGenericBinding(trackNarration, narratorAudioSource);
director.SetGenericBinding(trackCamera, cineCamera);
director.SetGenericBinding(trackAnimation, manifestAnimationController);

// Trigger at Start
void Start() {
    director.Play();
}

Event BeginPlay
→ Create Level Sequence "SixPhaseManifesto"
→ Attach AudioComponent to Narrator
→ Fade In HUD -> Play "BattlefieldWhispers"
→ Timeline: [Phase1_WeatherFX] → [Phase2_TrapReveal] → ...
→ Trigger: PulseHUDParticles()
→ CameraRig: MoveTo(PhaseViewTarget, TransitionCurve)
→ Spawn Decals & UI Elements synced to rhythm

void BeginSixPhaseManifestoCutscene() {
    director.playableAsset = Resources.Load<TimelineAsset>("SixPhaseManifestoTimeline");
    
    // Bind timeline tracks
    director.SetGenericBinding(cineCameraTrack, cameraController);
    director.SetGenericBinding(audioTrack, narratorSource);
    director.SetGenericBinding(animationTrack, phaseAnimation);

    HUD.FadeIn("whispers_hud.mp3");
    SoundManager.Play("thunder_crack.wav");
    FXManager.Pulse("introRhythm");

    director.Play();
}


