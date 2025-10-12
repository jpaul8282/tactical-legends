public class CivilianBehavior: MonoBehaviour
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
    ripple. transform.localScale = Vector3.zero;
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
[Logo pulses with beat. Sonic ring ripples out. Screen fades.]

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
        "Weather becomes a weapon. Cities breathe tactics. Vision and morale bend to nature’s tempo.");
    Manifesto.AddPhase("Environmental Dynamics", 
        "Traps whisper from rooftops. Civilian clutter isn’t chaos—it’s opportunity.");
    Manifesto.AddPhase("Rhythm-Fueled Multiplayer", 
        Teams tune their tactics. Dualities sync to survive. The battlefield becomes a beatmap.");
    Manifesto.AddPhase("Audio Intelligence", 
        "Menus shimmer with encrypted tones. HUD particles respond like sonar waves.");
    Manifesto.AddPhase("Cipher Battles & Boss Cadence", 
        "Harmonic combos breach shields. Vaults open with sonic resonance. Players perform, not just play.");
    Manifesto.AddPhase("Endgame Symphony", 
        "Factions pulse with sound DNA. A sonic storm reshapes the world—terrain and skybox move to your music."

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

// SylraCutIn.cs — Cinematic Cut-In Script

void TriggerGaleSurgeCutIn() {
    HideHUD();
    FreezeGameplay();

    // Scene 1: The Silence Before the Storm
    PlayCameraZoom("FaceCloseUp");
    PlayVFX("WindParticles", Sylra.Position);
    PlaySFX("HeartbeatPulse");
    Animate("Sylra_EyesOpen_Glow");

    Wait(1.5f);

    // Scene 2: Glyph Awakening
    PlayCameraPan("OverheadZoomOut");
    SpawnVFX("GlyphSigil", Sylra.Position);
    PlaySFX("WindWhispers");
    Animate("Sylra_ChannelEnergy");

    Wait(2.0f);

    // Scene 3: The Surge Unleashed
    PlayCameraAngle("SideDynamic");
    Animate("Sylra_ThrustForward");
    SpawnVFX("WindShockwave", Sylra.ForwardDirection);
    PlaySFX("ThunderCrack");
    ApplyForceToEnemies("PushBack", Sylra.ForwardDirection, radius: 10f);

    Wait(1.0f);

    // Scene 4: Morale Shift
    PlayCameraCut("AlliesReact");
    AnimateAllies("RallyPose");
    PlaySFX("AllyCheer");
    BoostAllyStats("Morale", amount: +20);

    Wait(1.5f);

    // Scene 5: The Calm Returns
    PlayCameraWide("BattlefieldFade");
    FadeOutVFX("GlyphSigil");
    PlaySFX("WindChime");
    Animate("Sylra_Exhale");
    ShowHUD();
    UnfreezeGameplay();

    StartCooldown("GaleSurge");
}

using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class SylraCutIn: MonoBehaviour
{
    public Animator sylraAnimator;
    public AudioSource voiceoverSource;
    public AudioSource sfxSource;
    public Cinemachine.CinemachineVirtualCamera[] cutInCameras;
    public Text subtitleText;
    public GameObject hud;

    void Start()
    {
        StartCoroutine(PlayGaleSurgeCutIn());
    }

    IEnumerator PlayGaleSurgeCutIn()
    {
        hud.SetActive(false);
        Time.timeScale = 0f;

        // Scene 1: Eyes Open
        SwitchCamera(0); // Face close-up
        PlaySFX("heartbeat");
        sylraAnimator.Play("EyesOpenGlow");
        yield return ShowSubtitle("The wind... it listens.", 2f);
        yield return new WaitForSecondsRealtime(1.5f);

        // Scene 2: Glyph Awakening
        SwitchCamera(1); // Overhead zoom
        PlaySFX("glyph_rise");
        sylraAnimator.Play("ChannelEnergy");
        yield return ShowSubtitle("Ancient breath, awaken.", 2f);
        yield return new WaitForSecondsRealtime(2f);

        // Scene 3: Surge Unleashed
        SwitchCamera(2); // Dynamic side angle
        PlaySFX("wind_surge");
        sylraAnimator.Play("ThrustForward");
        ApplyEnemyPushback();
        yield return ShowSubtitle("Gale Surge!", 1.5f);

        // Scene 4: Morale Shift
        SwitchCamera(3); // Allies react
        PlaySFX("ally_cheer");
        BoostAllyMorale();
        yield return ShowSubtitle("She's with us!", 1.5f);

        // Scene 5: Calm Returns
        SwitchCamera(4); // Wide battlefield
        PlaySFX("wind_chime");
        sylraAnimator.Play("Exhale");
        yield return ShowSubtitle("Balance restored.", 2f);

        hud.SetActive(true);
        Time.timeScale = 1f;
        StartCooldown("GaleSurge");
    }

    void SwitchCamera(int index)
    {
        for (int i = 0; i < cutInCameras.Length; i++)
            cutInCameras[i].gameObject.SetActive(i == index);
    }

    void PlaySFX(string clipName)
    {
        AudioClip clip = Resources.Load<AudioClip>($"Audio/SFX/{clipName}");
        sfxSource.PlayOneShot(clip);
    }

    IEnumerator ShowSubtitle(string text, float duration)
    {
        subtitleText.text = text;
        voiceoverSource.clip = Resources.Load<AudioClip>($"Audio/Voiceovers/{text}");
        voiceoverSource.Play();
        yield return new WaitForSecondsRealtime(duration);
        subtitleText.text = "";
    }

    void ApplyEnemyPushback()
    {
        // Add force to nearby enemies
        foreach (var enemy in FindObjectsOfType<Enemy>())
        {
            Vector3 direction = (enemy.transform.position - sylraAnimator.transform.position).normalized;
            enemy.GetComponent<Rigidbody>().AddForce(direction * 500f);
        }
    }

    void BoostAllyMorale()
    {
        foreach (var ally in FindObjectsOfType<Ally>())
        {
            ally.Morale += 20;
        }
    }

    void StartCooldown(string abilityName)
    {
        // Trigger cooldown logic
        Debug.Log($"{abilityName} cooldown started.");
    }
}

PhantomBreach.cs
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PhantomBreach: MonoBehaviour
{
    public float stealthDuration = 8f;
    public float markRadius = 15f;
    public LayerMask enemyLayer;
    public GameObject markVFX;
    public AudioClip activateSFX;
    public AudioClip takedownSFX;
    public AudioSource audioSource;
    public SkinnedMeshRenderer agentRenderer;
    public Material stealthMaterial;
    public Material normalMaterial;

    private bool isStealthed = false;
    private List<GameObject> markedEnemies = new List<GameObject>();

    public void ActivatePhantomBreach()
    {
        StartCoroutine(ExecutePhantomBreach());
    }

    IEnumerator ExecutePhantomBreach()
    {
        // Step 1: Activate Stealth
        isStealthed = true;
        agentRenderer.material = stealthMaterial;
        audioSource.PlayOneShot(activateSFX);
        Debug.Log("Phantom Breach activated.");

        // Step 2: Mark Enemies
        Collider[] enemies = Physics.OverlapSphere(transform.position, markRadius, enemyLayer);
        foreach (Collider enemy in enemies)
        {
            markedEnemies.Add(enemy.gameObject);
            Instantiate(markVFX, enemy.transform.position + Vector3.up * 2f, Quaternion.identity);
        }

        yield return new WaitForSeconds(stealthDuration / 2f);

        // Step 3: Silent Takedowns
        foreach (GameObject enemy in markedEnemies)
        {
            if (enemy != null)
            {
                Vector3 direction = (enemy.transform.position - transform.position).normalized;
                transform.LookAt(enemy.transform);
                audioSource.PlayOneShot(takedownSFX);
                enemy.GetComponent<Enemy>().EliminateSilently();
                yield return new WaitForSeconds(0.5f);
            }
        }

        // Step 4: Exit Stealth
        yield return new WaitForSeconds(stealthDuration / 2f);
        isStealthed = false;
        agentRenderer.material = normalMaterial;
        markedEnemies.Clear();
        Debug.Log("Phantom Breach ended.");
    }
}

public class Enemy: MonoBehaviour
{
    public void EliminateSilently()
    {
        // Play animation, disable AI, fade out
        Debug.Log($"{gameObject.name} eliminated silently.");
        Destroy(gameObject, 1f);
    }
}

public class ThermalVision: MonoBehaviour
{
    public Material thermalMaterial;
    public Camera playerCamera;
    private bool isActive = false;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.T))
        {
            ToggleThermalVision();
        }
    }

    void ToggleThermalVision()
    {
        isActive = !isActive;
        playerCamera.GetComponent<Camera>().cullingMask = isActive ? LayerMask.GetMask("Heat") : LayerMask.GetMask("Default");
        RenderSettings.skybox = isActive? thermalMaterial: null;
        Debug.Log("Thermal Vision " + (isActive ? "Activated": "Deactivated"));
    }
}

public class WallBreach: MonoBehaviour
{
    public GameObject breachChargePrefab;
    public float breachDelay = 3f;
    public LayerMask breachableLayer;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.B))
        {
            RaycastHit hit;
            if (Physics.Raycast(transform.position, transform.forward, out hit, 5f, breachableLayer))
            {
                StartCoroutine(PlaceAndDetonateCharge(hit.point));
            }
        }
    }

    IEnumerator PlaceAndDetonateCharge(Vector3 position)
    {
        GameObject charge = Instantiate(breachChargePrefab, position, Quaternion.identity);
        Debug.Log("Charge placed.");
        yield return new WaitForSeconds(breachDelay);
        Destroy(charge);
        ExplodeWall(position);
    }

    void ExplodeWall(Vector3 position)
    {
        Collider[] affected = Physics.OverlapSphere(position, 5f);
        foreach (var obj in affected)
        {
            if (obj.CompareTag("Wall"))
            {
                Destroy(obj.gameObject);
                Debug.Log("Wall breached.");
            }
        }
    }
}

using UnityEngine.UI;

public class CooldownUI: MonoBehaviour
{
    public Image cooldownBar;
    public float cooldownTime = 10f;
    private float cooldownRemaining = 0f;

    void Update()
    {
        if (cooldownRemaining > 0)
        {
            cooldownRemaining -= Time.deltaTime;
            cooldownBar.fillAmount = cooldownRemaining / cooldownTime;
        }
    }

    public void TriggerCooldown()
    {
        cooldownRemaining = cooldownTime;
        cooldownBar.fillAmount = 1f;
    }
}
// ═══════════════════════════════════════════════════════════════
// TACTICAL LEGENDS - UNITY GAME SYSTEMS (REFACTORED)
// ═══════════════════════════════════════════════════════════════

using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;
using Cinemachine;
using UnityEngine.Playables;

// ═══════════════════════════════════════════════════════════════
// 1. CIVILIAN AI SYSTEM
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Controls civilian NPC emotional states and behaviors based on threat levels
/// </summary>
public class CivilianBehavior: MonoBehaviour
{
    public enum EmotionState { Calm, Fear, Panic, Resist }
    
    [Header("AI Configuration")]
    [SerializeField] private EmotionState currentState = EmotionState.Calm;
    [SerializeField] private float panicDistance = 5f;
    [SerializeField] private float fearDistance = 10f;
    [SerializeField] private float detectionInterval = 0.5f;
    
    [Header("Movement")]
    [SerializeField] private float wanderSpeed = 2f;
    [SerializeField] private float runSpeed = 6f;
    
    private float nextDetectionTime;
    
    void Update()
    {
        if (Time.time >= nextDetectionTime)
        {
            DetectThreats();
            nextDetectionTime = Time.time + detectionInterval;
        }
        
        HandleEmotion();
    }

    void DetectThreats()
    {
        float nearestEnemyDistance = GetNearestEnemyDistance();

        if (nearestEnemyDistance < panicDistance)
            currentState = EmotionState.Panic;
        else if (nearestEnemyDistance < fearDistance)
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
                GrabThrownObject();
                break;
        }
    }

    float GetNearestEnemyDistance()
    {
        // TODO: Replace with actual enemy detection system
        GameObject[] enemies = GameObject.FindGameObjectsWithTag("Enemy");
        float minDistance = float.MaxValue;
        
        foreach (GameObject enemy in enemies)
        {
            float distance = Vector3.Distance(transform.position, enemy.transform.position);
            if (distance < minDistance)
                minDistance = distance;
        }
        
        return minDistance == float.MaxValue? 999f : minDistance;
    }
    
    void Wander() 
    { 
        // TODO: Implement wandering behavior
    }
    
    void RunFromThreat() 
    { 
        // TODO: Implement fleeing behavior
    }
    
    void KnockOverObjects() 
    { 
        // TODO: Implement panic interactions
    }
    
    void GrabThrownObject() 
    { 
        // TODO: Implement resistance behavior
    }
}

// ═══════════════════════════════════════════════════════════════
// 2. UI/UX SYSTEMS
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Handles animated menu transitions and UI effects
/// </summary>
public class UIManager: MonoBehaviour
{
    [Header("HUD Feedback")]
    [SerializeField] private ParticleSystem hudFlashParticle;
    
    [Header("Audio")]
    [SerializeField] private AudioSource audioSource;
    
    /// <summary>
    /// Slides between menu screens with smooth animation
    /// </summary>
    public void SlideToMenu(GameObject currentMenu, GameObject nextMenu)
    {
        RectTransform currentRect = currentMenu.GetComponent<RectTransform>();
        RectTransform nextRect = nextMenu.GetComponent<RectTransform>();
        
        LeanTween.moveX(currentRect, -2000f, 0.4f)
            .setEaseInBack()
            .setOnComplete(() =>
            {
                currentMenu.SetActive(false);
                nextMenu.SetActive(true);
                nextRect.anchoredPosition = new Vector2(2000f, nextRect.anchoredPosition.y);
                LeanTween.moveX(nextRect, 0f, 0.4f).setEaseOutExpo();
            });
    }

    /// <summary>
    /// Triggers visual feedback at UI position
    /// </summary>
    public void TriggerHUDFeedback(Vector3 uiPosition)
    {
        if (hudFlashParticle != null)
        {
            hudFlashParticle.transform.position = uiPosition;
            hudFlashParticle.Play();
        }
        
        TriggerHUDPing();
    }
    
    /// <summary>
    /// Updates HUD appearance based on game state
    /// </summary>
    public void UpdateHUDState(string state)
    {
        if (hudFlashParticle == null) return;
        
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
    
    void TriggerHUDPing() { /* TODO: Implement */ }
    void TriggerStealthPulse() { /* TODO: Implement */ }
    void TriggerMutatorEffect(string effect) { /* TODO: Implement */ }
}

/// <summary>
/// Cooldown visualization for abilities
/// </summary>
public class CooldownUI: MonoBehaviour
{
    [SerializeField] private Image cooldownBar;
    [SerializeField] private float cooldownTime = 10f;
    
    private float cooldownRemaining = 0f;

    void Update()
    {
        if (cooldownRemaining > 0)
        {
            cooldownRemaining -= Time.deltaTime;
            cooldownBar.fillAmount = cooldownRemaining / cooldownTime;
        }
    }

    public void TriggerCooldown()
    {
        cooldownRemaining = cooldownTime;
        cooldownBar.fillAmount = 1f;
    }
    
    public bool IsReady() => cooldownRemaining <= 0;
}

// ═══════════════════════════════════════════════════════════════
// 3. AUDIO SYSTEMS
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Dynamic audio manager for environmental and tactical audio
/// </summary>
public class AudioManager: MonoBehaviour
{
    public enum RegionType { Desert, Submarine, Forest }
    
    [Header("Ambient Audio")]
    [SerializeField] private AudioSource ambientSource;
    [SerializeField] private AudioClip desertAmbience;
    [SerializeField] private AudioClip subAmbience;
    [SerializeField] private AudioClip forestAmbience;
    
    [Header("Tactical Audio")]
    [SerializeField] private AudioClip sonarPing;
    [SerializeField] private GameObject sonarRipplePrefab;
    
    /// <summary>
    /// Sets ambient audio based on region type
    /// </summary>
    public void SetRegionAmbience(RegionType type)
    {
        if (ambientSource == null) return;
        
        switch (type)
        {
            case RegionType.Desert:
                ambientSource.clip = desertAmbience;
                ambientSource.volume = 0.5f;
                ambientSource.spatialBlend = 0f;
                break;
                
            case RegionType.Submarine:
                ambientSource.clip = subAmbience;
                ambientSource.volume = 0.8f;
                ambientSource.spatialBlend = 1f; // 3D echo chamber effect
                break;
                
            case RegionType.Forest:
                ambientSource.clip = forestAmbience;
                ambientSource.volume = 0.6f;
                ambientSource.spatialBlend = 0.5f;
                break;
        }
        
        ambientSource.Play();
    }

    /// <summary>
    /// Dynamically adjusts audio based on tension level
    /// </summary>
    public void BlendAmbientLayers(RegionType region, float tension)
    {
        tension = Mathf.Clamp01(tension);
        ambientSource.volume = Mathf.Lerp(0.3f, 0.9f, tension);

        if (region == RegionType.Desert && tension > 0.7f)
        {
            // TODO: Add sandstorm layer audio
        }
        else if (region == RegionType.Submarine && tension > 0.6f)
        {
            // TODO: Add metallic groans + pressure hisses
        }
    }

    /// <summary>
    /// Triggers sonar pulse effect with audio and visual
    /// </summary>
    public void TriggerSonar(Vector3 origin)
    {
        if (sonarPing != null)
            AudioSource.PlayClipAtPoint(sonarPing, origin);

        if (sonarRipplePrefab != null)
        {
            GameObject ripple = Instantiate(sonarRipplePrefab, origin, Quaternion.identity);
            ripple. transform.localScale = Vector3.zero;
            LeanTween.scale(ripple, Vector3.one * 5f, 1f).setEaseOutCirc();
            Destroy(ripple, 2f);
        }
    }
    
    /// <summary>
    /// Plays stealth footstep with dynamic pitch based on heartbeat
    /// </summary>
    public void PlayStealthStepSound(Vector3 position, float heartbeatRate)
    {
        float pitchMod = Mathf.Clamp(heartbeatRate / 120f, 0.8f, 1.3f);
        AudioSource stepAudio = gameObject.AddComponent<AudioSource>();
        stepAudio.clip = Resources.Load<AudioClip>("Stealth/step");
        stepAudio.pitch = pitchMod;
        stepAudio.spatialBlend = 1f;
        stepAudio.volume = 0.5f;
        stepAudio.Play();
        Destroy(stepAudio, 1f);
    }
    
    /// <summary>
    /// Sets faction-specific audio theme
    /// </summary>
    public void SetFactionAudioTheme(string faction)
    {
        string rhythmPath = faction switch
        {
            "Pulseborn" => "tribal_stomp",
            "Synthronauts" => "machine_pulse",
            "Echo Ascendants" => "harmonic_drift",
            _ => "default_theme"
        };
        
        LoadRhythm(rhythmPath);
    }
    
    void LoadRhythm(string rhythmName)
    {
        AudioClip rhythm = Resources.Load<AudioClip>($"Audio/Rhythms/{rhythmName}");
        if (rhythm != null && ambientSource != null)
        {
            ambientSource.clip = rhythm;
            ambientSource.Play();
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 4. RHYTHM/CIPHER GAMEPLAY SYSTEMS
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Handles rhythm-based cipher challenges and boss mechanics
/// </summary>
public class RhythmCipherSystem: MonoBehaviour
{
    [Header("Cipher Configuration")]
    [SerializeField] private GameObject[] cipherRings;
    [SerializeField] private AudioClip cipherRhythm;
    [SerializeField] private float rhythmTolerance = 0.15f;
    
    /// <summary>
    /// Initiates cipher challenge with target rhythm
    /// </summary>
    public void StartCipherChallenge(AudioClip targetRhythm)
    {
        PlayRhythm(targetRhythm);
        // TODO: Wait for player input rhythm via timing taps
    }

    /// <summary>
    /// Validates player rhythm input against target pattern
    /// </summary>
    public void ValidateRhythmInput(float[] userPattern, float[] targetPattern)
    {
        bool isMatch = CompareRhythms(userPattern, targetPattern);
        
        if (isMatch)
        {
            TriggerVaultUnlock();
        }
        else
        {
            PlayFailureTone();
        }
    }
    
    /// <summary>
    /// Compares two rhythm patterns within tolerance
    /// </summary>
    bool CompareRhythms(float[] userPattern, float[] targetPattern)
    {
        if (userPattern.Length != targetPattern.Length)
            return false;
            
        for (int i = 0; i < userPattern.Length; i++)
        {
            if (Mathf.Abs(userPattern[i] - targetPattern[i]) > rhythmTolerance)
                return false;
        }
        
        return true;
    }

    /// <summary>
    /// Synchronizes visual cipher rings with audio pulses
    /// </summary>
    public void SyncCipherVisuals(float[] pulseTimings)
    {
        for (int i = 0; i < cipherRings.Length && i < pulseTimings.Length; i++)
        {
            float delay = pulseTimings[i];
            LeanTween.scale(cipherRings[i], Vector3.one * 1.2f, 0.2f)
                .setDelay(delay)
                .setEaseOutElastic()
                .setLoopPingPong(2);
        }
        
        if (cipherRhythm != null)
            AudioSource.PlayClipAtPoint(cipherRhythm, transform.position);
    }
    
    /// <summary>
    /// Boss shield break mechanic using rhythm matching
    /// </summary>
    public void TriggerBossShieldBreak(float[] playerInputs, float[] coreBeatPattern, GameObject bossShield)
    {
        if (CompareRhythms(playerInputs, coreBeatPattern))
        {
            bossShield.SetActive(false);
            PlayShieldBreakFX();
            // TODO: Set boss vulnerability
        }
        else
        {
            PlayShieldDistortion();
            FlashScreenRed();
        }
    }
    
    void PlayRhythm(AudioClip rhythm) { /* TODO: Implement */ }
    void TriggerVaultUnlock() { /* TODO: Implement */ }
    void PlayFailureTone() { /* TODO: Implement */ }
    void PlayShieldBreakFX() { /* TODO: Implement */ }
    void PlayShieldDistortion() { /* TODO: Implement */ }
    void FlashScreenRed() { /* TODO: Implement */ }
}

// ═══════════════════════════════════════════════════════════════
// 5. MISSION & PHASE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Manages mission phases and dynamic event triggers
/// </summary>
public class MissionPhaseManager: MonoBehaviour
{
    [SerializeField] private AudioManager audioManager;
    [SerializeField] private UIManager uiManager;
    [SerializeField] private RhythmCipherSystem rhythmSystem;
    [SerializeField] private GameObject player;
    
    public void OnMissionPhaseChanged(string phase)
    {
        switch (phase)
        {
            case "Extraction":
                audioManager.SetRegionAmbience(AudioManager.RegionType.Submarine);
                PlayBriefing("extractionDialogue", "Alert");
                break;
                
            case "Infiltration":
                uiManager.UpdateHUDState("Stealth");
                audioManager.TriggerSonar(player.transform.position);
                break;
                
            case "Boss":
                UpdateEncryptedMenuVisual(true);
                audioManager.BlendAmbientLayers(AudioManager.RegionType.Desert, 0.9f);
                break;
        }
    }
    
    void PlayBriefing(string dialogue, string hudState)
    {
        // TODO: Implement briefing system
        uiManager.UpdateHUDState(hudState);
    }
    
    void UpdateEncryptedMenuVisual(bool encrypted)
    {
        // TODO: Implement encrypted menu visual
    }
}

// ═══════════════════════════════════════════════════════════════
// 6. SPECIAL ABILITIES - SYLRA'S GALE SURGE
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Cinematic ability cutscene with camera control and VFX
/// </summary>
public class SylraGaleSurge: MonoBehaviour
{
    [Header("References")]
    [SerializeField] private Animator sylraAnimator;
    [SerializeField] private AudioSource voiceoverSource;
    [SerializeField] private AudioSource sfxSource;
    [SerializeField] private CinemachineVirtualCamera[] cutInCameras;
    [SerializeField] private Text subtitleText;
    [SerializeField] private GameObject hud;
    
    [Header("VFX")]
    [SerializeField] private GameObject windParticles;
    [SerializeField] private GameObject glyphSigil;
    [SerializeField] private GameObject windShockwave;
    
    [Header("Settings")]
    [SerializeField] private float pushbackForce = 500f;
    [SerializeField] private float pushbackRadius = 10f;
    [SerializeField] private int moraleBoost = 20;
    
    public void TriggerGaleSurge()
    {
        StartCoroutine(PlayGaleSurgeCutIn());
    }

    IEnumerator PlayGaleSurgeCutIn()
    {
        // Freeze game and hide HUD
        hud.SetActive(false);
        Time.timeScale = 0f;

        // Scene 1: Eyes Open
        SwitchCamera(0);
        PlaySFX("heartbeat");
        sylraAnimator.Play("EyesOpenGlow");
        yield return ShowSubtitle("The wind... it listens.", 2f);
        yield return new WaitForSecondsRealtime(1.5f);

        // Scene 2: Glyph Awakening
        SwitchCamera(1);
        PlaySFX("glyph_rise");
        sylraAnimator.Play("ChannelEnergy");
        Instantiate(glyphSigil, transform.position, Quaternion.identity);
        yield return ShowSubtitle("Ancient breath, awaken.", 2f);
        yield return new WaitForSecondsRealtime(2f);

        // Scene 3: Surge Unleashed
        SwitchCamera(2);
        PlaySFX("wind_surge");
        sylraAnimator.Play("ThrustForward");
        ApplyEnemyPushback();
        yield return ShowSubtitle("Gale Surge!", 1.5f);

        // Scene 4: Morale Shift
        SwitchCamera(3);
        PlaySFX("ally_cheer");
        BoostAllyMorale();
        yield return ShowSubtitle("She's with us!", 1.5f);

        // Scene 5: Calm Returns
        SwitchCamera(4);
        PlaySFX("wind_chime");
        sylraAnimator.Play("Exhale");
        yield return ShowSubtitle("Balance restored.", 2f);

        // Resume game
        hud.SetActive(true);
        Time.timeScale = 1f;
    }

    void SwitchCamera(int index)
    {
        for (int i = 0; i < cutInCameras.Length; i++)
            cutInCameras[i].gameObject.SetActive(i == index);
    }

    void PlaySFX(string clipName)
    {
        AudioClip clip = Resources.Load<AudioClip>($"Audio/SFX/{clipName}");
        if (clip != null)
            sfxSource.PlayOneShot(clip);
    }

    IEnumerator ShowSubtitle(string text, float duration)
    {
        subtitleText.text = text;
        AudioClip voiceover = Resources.Load<AudioClip>($"Audio/Voiceovers/{text.Replace(" ", "_")}");
        if (voiceover != null)
        {
            voiceoverSource.clip = voiceover;
            voiceoverSource.Play();
        }
        yield return new WaitForSecondsRealtime(duration);
        subtitleText.text = "";
    }

    void ApplyEnemyPushback()
    {
        Collider[] enemies = Physics.OverlapSphere(transform.position, pushbackRadius);
        foreach (Collider enemy in enemies)
        {
            if (enemy.CompareTag("Enemy"))
            {
                Vector3 direction = (enemy.transform.position - transform.position).normalized;
                Rigidbody rb = enemy.GetComponent<Rigidbody>();
                if (rb != null)
                    rb.AddForce(direction * pushbackForce);
            }
        }
    }

    void BoostAllyMorale()
    {
        GameObject[] allies = GameObject.FindGameObjectsWithTag("Ally");
        foreach (GameObject ally in allies)
        {
            // TODO: Add morale system
            Debug.Log($"Boosted {ally.name} morale by {moraleBoost}");
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 7. TACTICAL ABILITIES
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Phantom Breach - Stealth ability with enemy marking and takedowns
/// </summary>
public class PhantomBreach: MonoBehaviour
{
    [Header("Configuration")]
    [SerializeField] private float stealthDuration = 8f;
    [SerializeField] private float markRadius = 15f;
    [SerializeField] private LayerMask enemyLayer;
    
    [Header("Visual Effects")]
    [SerializeField] private GameObject markVFX;
    [SerializeField] private SkinnedMeshRenderer agentRenderer;
    [SerializeField] private Material stealthMaterial;
    [SerializeField] private Material normalMaterial;
    
    [Header("Audio")]
    [SerializeField] private AudioClip activateSFX;
    [SerializeField] private AudioClip takedownSFX;
    [SerializeField] private AudioSource audioSource;

    private bool isStealthed = false;
    private List<GameObject> markedEnemies = new List<GameObject>();

    public void Activate()
    {
        if (!isStealthed)
            StartCoroutine(ExecutePhantomBreach());
    }

    IEnumerator ExecutePhantomBreach()
    {
        // Step 1: Activate Stealth
        isStealthed = true;
        agentRenderer.material = stealthMaterial;
        audioSource.PlayOneShot(activateSFX);
        Debug.Log("Phantom Breach activated.");

        // Step 2: Mark Enemies
        Collider[] enemies = Physics.OverlapSphere(transform.position, markRadius, enemyLayer);
        foreach (Collider enemy in enemies)
        {
            markedEnemies.Add(enemy.gameObject);
            if (markVFX != null)
            {
                GameObject mark = Instantiate(markVFX, enemy.transform.position + Vector3.up * 2f, Quaternion.identity);
                mark.transform.SetParent(enemy.transform);
            }
        }

        yield return new WaitForSeconds(stealthDuration / 2f);

        // Step 3: Silent Takedowns
        foreach (GameObject enemy in markedEnemies)
        {
            if (enemy != null)
            {
                transform.LookAt(enemy.transform);
                audioSource.PlayOneShot(takedownSFX);
                
                Enemy enemyScript = enemy.GetComponent<Enemy>();
                if (enemyScript != null)
                    enemyScript.EliminateSilently();
                    
                yield return new WaitForSeconds(0.5f);
            }
        }

        // Step 4: Exit Stealth
        yield return new WaitForSeconds(stealthDuration / 2f);
        isStealthed = false;
        agentRenderer.material = normalMaterial;
        markedEnemies.Clear();
        Debug.Log("Phantom Breach ended.");
    }
}

/// <summary>
/// Basic enemy class for Phantom Breach interaction
/// </summary>
public class Enemy: MonoBehaviour
{
    public void EliminateSilently()
    {
        // TODO: Play death animation
        Debug.Log($"{gameObject.name} eliminated silently.");
        Destroy(gameObject, 1f);
    }
}

/// <summary>
/// Thermal vision toggle system
/// </summary>
public class ThermalVision: MonoBehaviour
{
    [SerializeField] private Material thermalMaterial;
    [SerializeField] private Camera playerCamera;
    [SerializeField] private KeyCode toggleKey = KeyCode.T;
    
    private bool isActive = false;

    void Update()
    {
        if (Input.GetKeyDown(toggleKey))
            ToggleThermalVision();
    }

    void ToggleThermalVision()
    {
        isActive = !isActive;
        
        if (isActive)
        {
            playerCamera.cullingMask = LayerMask.GetMask("Heat");
            RenderSettings.skybox = thermalMaterial;
        }
        else
        {
            playerCamera.cullingMask = LayerMask.GetMask("Default");
            RenderSettings.skybox = null;
        }
        
        Debug.Log($"Thermal Vision {(isActive ? "Activated" : "Deactivated")}");
    }
}

/// <summary>
/// Wall breaching mechanic with explosive charges
/// </summary>
public class WallBreach: MonoBehaviour
{
    [SerializeField] private GameObject breachChargePrefab;
    [SerializeField] private float breachDelay = 3f;
    [SerializeField] private float breachRadius = 5f;
    [SerializeField] private LayerMask breachableLayer;
    [SerializeField] private KeyCode breachKey = KeyCode.B;

    void Update()
    {
        if (Input.GetKeyDown(breachKey))
            AttemptBreach();
    }

    void AttemptBreach()
    {
        RaycastHit hit;
        if (Physics.Raycast(transform.position, transform.forward, out hit, 5f, breachableLayer))
        {
            StartCoroutine(PlaceAndDetonateCharge(hit.point, hit.normal));
        }
    }

    IEnumerator PlaceAndDetonateCharge(Vector3 position, Vector3 normal)
    {
        GameObject charge = Instantiate(breachChargePrefab, position, Quaternion.LookRotation(normal));
        Debug.Log("Breach charge placed. Detonating in " + breachDelay + "s");
        
        yield return new WaitForSeconds(breachDelay);
        
        Destroy(charge);
        ExplodeWall(position);
    }

    void ExplodeWall(Vector3 position)
    {
        Collider[] affected = Physics.OverlapSphere(position, breachRadius);
        foreach (Collider obj in affected)
        {
            if (obj.CompareTag("Wall") || obj.CompareTag("Breachable"))
            {
                Destroy(obj.gameObject);
                Debug.Log($"Breached: {obj.name}");
            }
        }
        
        // TODO: Add explosion VFX and audio
    }
}

// ═══════════════════════════════════════════════════════════════
// 8. CINEMATIC TIMELINE SYSTEM
// ═══════════════════════════════════════════════════════════════

/// <summary>
/// Manages cinematic sequences using Unity Timeline
/// </summary>
public class CinematicController: MonoBehaviour
{
    [SerializeField] private PlayableDirector director;
    [SerializeField] private TimelineAsset sixPhaseTimeline;
    [SerializeField] private AudioSource narratorAudioSource;
    [SerializeField] private CinemachineVirtualCamera cineCamera;

    void Start()
    {
        if (sixPhaseTimeline != null)
            PlaySixPhaseManifesto();
    }

    public void PlaySixPhaseManifesto()
    {
        director.playableAsset = sixPhaseTimeline;
        // TODO: Set up timeline track bindings
        director.Play();
    }
}

