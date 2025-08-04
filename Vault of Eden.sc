[Scene Start: Harmonic glyphs swirl. Squad enters.]

CAPTAIN VARIS (Echo Ascendant):
“This... isn’t a vault. It’s a heart still beating.”

TECH SEER NYRI:
“Pulse signature syncing. Artifact recognizes squad lineage. Entry confirmed.”

[HUD: Morality Score ≥ +60 — Harmonic Conduit Unlocked]

<<Vault seals respond with a melodic ripple. Combat begins.>>

Phase I: Resonant Guardians Awaken
Boss Unit: Harmonic Sentinels (x4) Mechanics: Must match rhythm in attack patterns. Offbeat hits cause squad confusion.

[Sentinels materialize. Combat locks squad into beat-synced mode.]

GAME SYSTEM:
>> “Sync Required. Missed Beat Detected. Stability -12.”

[Squad uses “Echo Dash” to reposition on beat. Relic weapon glows with pulse rhythm.]

NYRI:
“They hear us. We move in music, or we die in silence.”

Phase II: Legacy Pulse Shift
Triggered by a legacy decision flashback (e.g., squad sacrificed relic for civilian rescue)
Vault reacts based on previous war council choices.

[Flash: Past sacrifice renders in holographic glyph.]

VAULT SYSTEM:
>> “Legacy Thread: Compassion Protocol Verified.”

[New relic unlocked: “Chord of Mercy.” Squad trait Empathetic boosts damage.]

ENEMY SHIFT: Harmonic Sentinels fuse into Echo Leviathan. Combat enters Phase III.

Phase III: Echo Leviathan — Moral Dissonance
Boss evolves based on morality score.
• 	Positive Morality: Boss attacks sync with music, telegraphable but punishing.
• 	Negative Morality: Boss becomes erratic; unpredictable chaos pulses disrupt squad rhythm.

[Boss pulses with ancestral grief.]

CAPTAIN VARIS:
“This isn’t a fight—it’s a reckoning.”

PLAYER CHOICE:
>> “Activate ‘Echo Accord’ Protocol?” Y/N

[Y]: Squad harmonizes—leviathan destabilized.
[N]: Squad fractures—trait risk activates. One squad member becomes hostile NPC.

Ending Scenarios: Vault Breach or Collapse 

 Custom Squad Dialog Branches — Trait-Based Dynamic Interactions
These conversations adapt based on legacy decisions, squad traits, and gear loadout effects. Here's a few scenario trees:
⚔️ Mission Entry: “Pulse Threshold”

CAPTAIN VARIS (Protective):
“This vault remembers loss. Stay tight—we go in together.”

RONIN SYNTAX (Ruthless):
“You sound sentimental. Sentiment dies first.”

[Branch Trigger: Squad Trait Mismatch]

Option 1: “Reassure Syntax” → Morale +5
Option 2: “Challenge Syntax” → Trigger trait clash; unlock flashback event

 Mid-Combat: Gear Sync Malfunction

 NYRI (Empathetic):
“Pulse off... relic isn’t harmonizing.”

VARIS:
“Override it. We’re blind without it.”

Choice A: “Attempt Sync” (risk gear damage)
Choice B: “Abandon Gear” (lowers combat efficiency but boosts trust)
Vault Echo Decision (Legacy Influence)
VAULT SYSTEM:
>> “Echo protocol detected: Prior civilian sacrifice embedded.”

SYNTAX:
“So we’re praised for weakness?”

VARIS:
“No. For remembering who we fight for.”

Choice: “Respond Kindly / Respond Coldly / Say Nothing”

Expanded Tactical Warfare Gear Arsenal
Welcome to the Symphonic Tactical Suite, engineered for Eden combat anomalies.

Vault of Eden Lore Archive Expansion: Weapon Mythos
These relics aren't just gear—they're storytelling vessels.
🪶 Relic: “Chord of Mercy”
• 	Forged during the Echo Accord trials
• 	Found only when squad chooses empathy over efficiency
• 	Emits protective wave in final boss phase
🌑 Relic: “Pulse of Silence”
• 	Unlocked by betrayal arc choice
• 	Drains enemy rhythm, silences ambient combat music
• 	Temporarily lowers boss aggression
🧬 Relic: “Archive Shard — Leviathan”
• 	Fragment of the vault’s mind
• 	Must defeat Echo Leviathan with harmonic dialogue
• 	Adds permanent squad trait: “Sonic Memory” 

Codex Entry: Chord of Mercy

• 	Type: Resonance Artifact
• 	Trait Compatibility: Empathetic, Protective
• 	Passive: Heals nearby allies when rhythm match is achieved
• 	Active: Emits harmonic wave that interrupts enemy pulse sync
• 	Lore Note: Carried only by squads who embraced civilian rescue over aggression
• 	Faction Alignment: Echo Ascendants

📖 Codex Entry: Pulse of Silence

• 	Type: Tactical Disruptor
• 	Trait Compatibility: Ruthless, Calculating
• 	Passive: Suppresses ambient enemy morale responses
• 	Active: Scrambles enemy rhythm detection for 12 seconds
• 	Lore Note: Found in campaigns where betrayal led to victory
• 	Faction Alignment: Iron Veil

📖 Codex Entry: Resonance Halberd

• 	Type: Rhythm-based melee weapon
• 	Trait Compatibility: Bold, Loyal
• 	Passive: Amplifies rhythm with each consecutive strike
• 	Active: Final combo triggers harmonic burst that stuns
• 	Lore Note: Wielded in legendary standoff at the Eden Gate
• 	Faction Alignment: Synthronaut Watchers

📖 Codex Entry: Glyph Splicer

• 	Type: Sonic Hacking Tool
• 	Trait Compatibility: Curious, Diplomatic
• 	Passive: Reveals hidden UI interfaces in resonance zones
• 	Active: Grants access to one locked Eden archive
• 	Lore Note: Believed to be crafted from Eden’s original encryption sigil
• 	Faction Alignment: Echo Clerics

📖 Codex Entry: Leviathan Grip

• 	Type: Brutal melee claw
• 	Trait Compatibility: Paranoid, Resilient
• 	Passive: Charges when allies fall nearby
• 	Active: Executes vault-borne entities with rhythm finishers
• 	Lore Note: Only gifted to squads who survived total collapse and came back stronger
• 	Faction Alignment: Neutral / Vault-forged 

// VaultOfEden Prototype Framework
public class VaultOfEden : MonoBehaviour
{
    public enum GamePhase { Exploration, Combat, Decision }
    public GamePhase currentPhase;

    void Start()
    {
        InitVault();
    }

    void Update()
    {
        switch (currentPhase)
        {
            case GamePhase.Exploration:
                RunExplorationPhase();
                break;
            case GamePhase.Combat:
                RunCombatPhase();
                break;
            case GamePhase.Decision:
                RunDecisionPhase();
                break;
        }
    }

    void InitVault()
    {
        // Initialize squad, relics, morality system, lore echoes
        currentPhase = GamePhase.Exploration;
        LoadVaultEnvironment();
    }

    // 🔸 Exploration Phase
    void RunExplorationPhase()
    {
        DiscoverVaultChambers();
        SolveRhythmPuzzles();
        CollectLoreEchoes();

        if (PuzzleSequenceCompleted())
        {
            currentPhase = GamePhase.Combat;
        }
    }

    // 🔸 Combat Phase
    void RunCombatPhase()
    {
        ActivateRhythmSync();
        EngageHarmonicEnemies();

        if (BossDefeated())
        {
            currentPhase = GamePhase.Decision;
        }
    }

    // 🔸 Decision Phase
    void RunDecisionPhase()
    {
        TriggerLegacyChoices();
        UpdateMoralityScore();
        UnlockRelicsBasedOnTraits();
        DetermineBossEvolution();

        currentPhase = GamePhase.Exploration; // Loop continues in new vault sector
    }

    // Example methods – would be expanded in full game
    void DiscoverVaultChambers() { /* Procedural Vault Generation */ }
    void SolveRhythmPuzzles() { /* Sync-based input challenges */ }
    void CollectLoreEchoes() { /* Codex / narrative deepening */ }
    void ActivateRhythmSync() { /* Beat-matching mechanics */ }
    void EngageHarmonicEnemies() { /* Squad combat logic */ }
    void TriggerLegacyChoices() { /* Moral branching dialogues */ }
    void UpdateMoralityScore() { /* Track choices */ }
    void UnlockRelicsBasedOnTraits() { /* Squad trait filters */ }
    void DetermineBossEvolution() { /* Echo Leviathan logic */ }

    // Utility conditions
    bool PuzzleSequenceCompleted() => true; // Example placeholder
    bool BossDefeated() => true;
}

public class VaultOfEden : MonoBehaviour
{
    public enum GamePhase { Exploration, Combat, Decision }
    public GamePhase currentPhase;

    SquadManager squad;
    RelicManager relics;
    MoralitySystem morality;
    RhythmEngine rhythm;

    void Start()
    {
        InitVault();
    }

    void Update()
    {
        switch (currentPhase)
        {
            case GamePhase.Exploration:
                RunExplorationPhase();
                break;
            case GamePhase.Combat:
                RunCombatPhase();
                break;
            case GamePhase.Decision:
                RunDecisionPhase();
                break;
        }
    }

    void InitVault()
    {
        squad = new SquadManager();
        relics = new RelicManager();
        morality = new MoralitySystem();
        rhythm = new RhythmEngine();
        currentPhase = GamePhase.Exploration;
    }

    // 🔸 Exploration Phase
    void RunExplorationPhase()
    {
        VaultNavigator.DiscoverChambers();
        rhythm.SolveRhythmPuzzle();
        LoreManager.CollectEchoes();

        if (VaultNavigator.PuzzleSequenceCompleted())
            currentPhase = GamePhase.Combat;
    }

    // 🔸 Combat Phase
    void RunCombatPhase()
    {
        rhythm.ActivateSyncMode();
        CombatSystem.EngageEnemies(squad, relics);

        if (CombatSystem.BossDefeated())
            currentPhase = GamePhase.Decision;
    }

    // 🔸 Decision Phase
    void RunDecisionPhase()
    {
        morality.TriggerLegacyChoice(squad);
        relics.UnlockRelicsBasedOnTraits(squad);
        BossManager.EvolveBoss(morality.Score);

        currentPhase = GamePhase.Exploration; // Loop continues
    }
}

public class SquadManager
{
    public List<SquadMember> members;

    public SquadManager()
    {
        members = new List<SquadMember>
        {
            new SquadMember("Varis", Trait.Protective),
            new SquadMember("Nyri", Trait.Empathetic),
            new SquadMember("Syntax", Trait.Ruthless)
        };
    }

    public bool HasTrait(Trait trait)
    {
        return members.Any(m => m.trait == trait);
    }
}

public enum Trait { Empathetic, Ruthless, Diplomatic, Protective, Paranoid }

public class SquadMember
{
    public string name;
    public Trait trait;

    public SquadMember(string name, Trait trait)
    {
        this.name = name;
        this.trait = trait;
    }
}

RelicManager – Trait-Based Unlocks
public class RelicManager
{
    public List<Relic> unlockedRelics = new List<Relic>();

    public void UnlockRelicsBasedOnTraits(SquadManager squad)
    {
        if (squad.HasTrait(Trait.Empathetic))
            unlockedRelics.Add(new Relic("Chord of Mercy"));

        if (squad.HasTrait(Trait.Ruthless))
            unlockedRelics.Add(new Relic("Pulse of Silence"));

        if (squad.HasTrait(Trait.Diplomatic))
            unlockedRelics.Add(new Relic("Glyph Splicer"));
    }
}

public class Relic
{
    public string name;
    public Relic(string name)
    {
        this.name = name;
    }
}

public class RhythmEngine
{
    private float beatInterval = 0.5f; // seconds
    private float lastBeatTime;

    public void ActivateSyncMode()
    {
        lastBeatTime = Time.time;
    }

    public bool IsOnBeat()
    {
        float timeSinceLastBeat = Time.time - lastBeatTime;
        return Mathf.Abs(timeSinceLastBeat % beatInterval) < 0.1f;
    }

    public void SolveRhythmPuzzle()
    {
        if (IsOnBeat())
            Debug.Log("Puzzle solved in sync!");
        else
            Debug.Log("Missed beat. Stability -12.");
    }
}

C# Dialogue Tree Script
public enum DialogueChoice { Empathetic, Ruthless, Silent }

public class DialogueLine
{
    public string Character;
    public Dictionary<DialogueChoice, string> Lines;

    public DialogueLine(string character, string empathetic, string ruthless, string silent)
    {
        Character = character;
        Lines = new Dictionary<DialogueChoice, string>
        {
            { DialogueChoice.Empathetic, empathetic },
            { DialogueChoice.Ruthless, ruthless },
            { DialogueChoice.Silent, silent }
        };
    }

    public string GetLine(DialogueChoice choice)
    {
        return Lines.ContainsKey(choice) ? Lines[choice] : "No dialogue available.";
    }
}

public class FlashbackScene
{
    public string SceneName = "Civilian Sacrifice Echo";
    public List<DialogueLine> DialogueLines;

    public FlashbackScene()
    {
        DialogueLines = new List<DialogueLine>
        {
            new DialogueLine("Varis",
                "They lived because we chose to care.",
                "Duty shouldn’t cost lives.",
                "Stares silently at glyph ripple."
            ),
            new DialogueLine("Syntax",
                "Spare me the virtue lecture.",
                "Right call. No regrets.",
                "...Whatever."
            ),
            new DialogueLine("Nyri",
                "I still hear them. The saved and the fallen.",
                "Sacrifice was tactical.",
                "Echoes don’t fade."
            )
        };
    }

    public void DisplayScene(DialogueChoice playerChoice)
    {
        Debug.Log($"--- {SceneName} ---");
        foreach (var line in DialogueLines)
        {
            Debug.Log($"{line.Character}: {line.GetLine(playerChoice)}");
        }
    }
}

void Start()
{
    FlashbackScene flashback = new FlashbackScene();
    flashback.DisplayScene(DialogueChoice.Empathetic); // Change to Ruthless or Silent to test other branches
}

DialogueNode Script
public class DialogueNode
{
    public string CharacterName;
    public string DialogueText;
    public DialogueChoice ChoiceType;
    public Trait RequiredTrait;
    public Action OnDecisionCallback;

    public DialogueNode(string character, string text, DialogueChoice choice, Trait requiredTrait, Action callback = null)
    {
        CharacterName = character;
        DialogueText = text;
        ChoiceType = choice;
        RequiredTrait = requiredTrait;
        OnDecisionCallback = callback;
    }

    public bool IsAvailable(SquadMember member)
    {
        return member.trait == RequiredTrait;
    }

    public void ExecuteNode()
    {
        Debug.Log($"{CharacterName}: {DialogueText}");
        OnDecisionCallback?.Invoke();
    }
}

Interaction & Rhythm Influence
public class DialogueEditor : MonoBehaviour
{
    public List<DialogueNode> currentScene = new List<DialogueNode>();
    public SquadManager squad;
    public RhythmEngine rhythm;

    void DisplayAvailableDialogue()
    {
        foreach (var node in currentScene)
        {
            foreach (var member in squad.members)
            {
                if (node.IsAvailable(member) && rhythm.IsOnBeat())
                {
                    Debug.Log($"Available: {member.name} → {node.DialogueText}");
                }
            }
        }
    }

    public void SelectDialogue(DialogueNode node, SquadMember member)
    {
        if (node.IsAvailable(member))
        {
            node.ExecuteNode();
        }
        else
        {
            Debug.Log($"{member.name} lacks required trait for this dialogue.");
        }
    }
}

void SetupCivilianEchoScene()
{
    currentScene = new List<DialogueNode>
    {
        new DialogueNode("Varis", "They lived because we chose to care.", DialogueChoice.Empathetic, Trait.Empathetic, () => MoralitySystem.AddScore(+20)),
        new DialogueNode("Syntax", "Right call. No regrets.", DialogueChoice.Ruthless, Trait.Ruthless, () => MoralitySystem.AddScore(-15)),
        new DialogueNode("Nyri", "Echoes don’t fade.", DialogueChoice.Silent, Trait.Empathetic)
    };
}

Sample Dialogue Audio Manager
public class AudioDialogueManager : MonoBehaviour
{
    public AudioSource audioSource;
    public Dictionary<string, AudioClip> voiceLines;

    void Start()
    {
        voiceLines = new Dictionary<string, AudioClip>
        {
            { "Varis_Empathetic", Resources.Load<AudioClip>("Audio/Varis_Empathetic") },
            { "Syntax_Ruthless", Resources.Load<AudioClip>("Audio/Syntax_Ruthless") },
            { "Nyri_Silent", Resources.Load<AudioClip>("Audio/Nyri_Silent") }
        };
    }

    public void PlayVoiceLine(string key)
    {
        if (voiceLines.ContainsKey(key))
        {
            audioSource.clip = voiceLines[key];
            audioSource.Play();
        }
    }
}

Dialogue UI Layout
public class DialogueUI : MonoBehaviour
{
    public GameObject dialoguePanel;
    public Text characterNameText;
    public Text dialogueText;
    public Button[] choiceButtons;

    public void RenderDialogue(DialogueNode node)
    {
        dialoguePanel.SetActive(true);
        characterNameText.text = node.CharacterName;
        dialogueText.text = node.DialogueText;

        foreach (var button in choiceButtons)
        {
            // Assign traits, set visual state (glow if on-beat, dim if offbeat)
            bool isSynced = RhythmEngine.Instance.IsOnBeat();
            button.interactable = isSynced;
            button.GetComponent<Image>().color = isSynced ? Color.cyan : Color.gray;
        }
    }
}

DialogueLog + TraitShaper System
public class DialogueHistory
{
    public List<string> dialogueEntries = new List<string>();

    public void AddEntry(string character, string text)
    {
        string entry = $"{character}: {text}";
        dialogueEntries.Add(entry);
        TraitShaper.EvaluateImpact(character, text);
    }

    public void DisplayHistory()
    {
        foreach (var entry in dialogueEntries)
            Debug.Log(entry);
    }
}

public static class TraitShaper
{
    public static void EvaluateImpact(string character, string dialogue)
    {
        if (dialogue.Contains("care") || dialogue.Contains("saved"))
            SquadManager.Instance.UpdateTrait(Trait.Empathetic);

        if (dialogue.Contains("sacrifice") && dialogue.Contains("tactical"))
            SquadManager.Instance.UpdateTrait(Trait.Ruthless);
    }
}

Trait Glyphs beside Choices
public class TraitGlyphRenderer : MonoBehaviour
{
    public Image glyphImage;
    public Dictionary<Trait, Sprite> traitGlyphs;

    void Start()
    {
        traitGlyphs = new Dictionary<Trait, Sprite>
        {
            { Trait.Empathetic, Resources.Load<Sprite>("Glyphs/Empathetic") },
            { Trait.Ruthless, Resources.Load<Sprite>("Glyphs/Ruthless") },
            { Trait.Diplomatic, Resources.Load<Sprite>("Glyphs/Diplomatic") },
            { Trait.Protective, Resources.Load<Sprite>("Glyphs/Protective") },
            { Trait.Paranoid, Resources.Load<Sprite>("Glyphs/Paranoid") }
        };
    }

    public void SetGlyph(Trait trait)
    {
        if (traitGlyphs.ContainsKey(trait))
            glyphImage.sprite = traitGlyphs[trait];
    }
}

Rhythm Ripple FX for Synced Lines
public class RhythmRippleFX : MonoBehaviour
{
    public ParticleSystem rippleEffect;

    void Update()
    {
        if (RhythmEngine.Instance.IsOnBeat())
        {
            if (!rippleEffect.isPlaying)
                rippleEffect.Play();
        }
        else
        {
            if (rippleEffect.isPlaying)
                rippleEffect.Stop();
        }
    }
}

Echo History HUD Toggle
public class EchoHistoryHUD : MonoBehaviour
{
    public GameObject historyPanel;
    public Text historyText;

    public void ToggleHistory()
    {
        historyPanel.SetActive(!historyPanel.activeSelf);
        if (historyPanel.activeSelf)
            UpdateHistory();
    }

    void UpdateHistory()
    {
        historyText.text = "";
        foreach (string entry in DialogueHistory.Instance.dialogueEntries)
        {
            historyText.text += entry + "\n";
        }
    }
}

Animated Transitions for Decision Moments
public class DecisionAnimator : MonoBehaviour
{
    public Animator animator;

    public void TriggerDecisionMoment()
    {
        animator.SetTrigger("DecisionPulse");
    }
}

Update Dialogue Choice Prefab
public class DialogueChoiceUI : MonoBehaviour
{
    public Text dialogueText;
    public Image traitGlyphImage;
    private TraitGlyphRenderer glyphRenderer;

    void Awake()
    {
        glyphRenderer = GetComponent<TraitGlyphRenderer>();
    }

    public void SetupChoice(string text, Trait trait)
    {
        dialogueText.text = text;
        glyphRenderer.SetGlyph(trait);
    }
}

Instantiate & Bind in Dialogue Manager
public class DialogueManager : MonoBehaviour
{
    public GameObject choicePrefab;
    public Transform choicesPanel;
    public SquadManager squad;

    public void RenderChoices(List<DialogueNode> nodes)
    {
        foreach (Transform child in choicesPanel) Destroy(child); // clear previous choices

        foreach (DialogueNode node in nodes)
        {
            var member = squad.GetMemberByName(node.CharacterName);
            GameObject choiceObj = Instantiate(choicePrefab, choicesPanel);
            DialogueChoiceUI choiceUI = choiceObj.GetComponent<DialogueChoiceUI>();
            choiceUI.SetupChoice(node.DialogueText, member.trait);
        }
    }
}

Preview Trait Glyph Logic
// TraitGlyphRenderer.cs
public class TraitGlyphRenderer : MonoBehaviour
{
    public Image glyphImage;
    public Dictionary<Trait, Sprite> traitGlyphs;

    void Start()
    {
        traitGlyphs = new Dictionary<Trait, Sprite>
        {
            { Trait.Empathetic, Resources.Load<Sprite>("Glyphs/Empathetic") },
            { Trait.Ruthless, Resources.Load<Sprite>("Glyphs/Ruthless") },
            { Trait.Diplomatic, Resources.Load<Sprite>("Glyphs/Diplomatic") },
            { Trait.Protective, Resources.Load<Sprite>("Glyphs/Protective") },
            { Trait.Paranoid, Resources.Load<Sprite>("Glyphs/Paranoid") }
        };
    }

    public void SetGlyph(Trait trait)
    {
        if (traitGlyphs.TryGetValue(trait, out Sprite glyph))
            glyphImage.sprite = glyph;
    }
}

Glyph Glow During Beat-Sync Phases
public void TriggerGlyphGlow(float beatDuration)
{
    DOTween.To(() => glyphImage.material.GetFloat("_GlowIntensity"),
               x => glyphImage.material.SetFloat("_GlowIntensity", x),
               1f, beatDuration / 2).SetLoops(2, LoopType.Yoyo);
}

 Trait-Specific Voice Filters
Concept:
Apply audio effects that reflect a character's trait when they speak.
Filter Examples: | Trait        | Audio Effect       | |--------------|--------------------| | Empathetic   | Soft reverb, warm EQ | | Ruthless     | Distorted, lower pitch | | Paranoid     | Tremolo, static overlay | | Diplomatic   | Clear, stereo widening | | Protective   | Bass boost, lowpass |

using FMODUnity;

public class TraitAudioFilter : MonoBehaviour
{
    [SerializeField] EventReference dialogueEvent;
    private FMOD.Studio.EventInstance instance;

    public void PlayDialogueWithTrait(Trait trait)
    {
        instance = RuntimeManager.CreateInstance(dialogueEvent);
        instance.setParameterByName("TraitFilter", (float)trait); // assuming Trait is an enum
        instance.start();
        instance.release();
    }
}

Trait to FMOD Mapping Example
| Trait | FMOD Filter Applied | 
| Empathetic | Reverb + high EQ warmth | 
| Ruthless | Distortion + lower pitch | 
| Paranoid | Tremolo + subtle white noise | 
| Diplomatic | Stereo enhancer + clean vocals | 
| Protective | Bass boost + compression | 



public class TraitSnapshotSwitcher : MonoBehaviour
{
    public AudioMixerSnapshot empatheticSnapshot;
    public AudioMixerSnapshot ruthlessSnapshot;

    public void ApplyTraitSnapshot(Trait trait)
    {
        switch (trait)
        {
            case Trait.Empathetic:
                empatheticSnapshot.TransitionTo(0.5f);
                break;
            case Trait.Ruthless:
                ruthlessSnapshot.TransitionTo(0.5f);
                break;
            // add other cases
        }
    }
}

Define Squad Tension as a Dynamic Variable
public class TensionManager : MonoBehaviour
{
    public float tensionLevel; // 0.0 (calm) to 1.0 (panic)

    public void UpdateTension(float delta)
    {
        tensionLevel = Mathf.Clamp01(tensionLevel + delta);
    }
}

public class DialogueLinePlayer : MonoBehaviour
{
    public float baseTimeBetweenWords = 0.25f; // calm pacing
    public TensionManager tension;

    public void PlayLine(string[] words)
    {
        float speedModifier = Mathf.Lerp(1f, 0.5f, tension.tensionLevel); // faster with higher tension

        StartCoroutine(Speak(words, baseTimeBetweenWords * speedModifier));
    }

    IEnumerator Speak(string[] words, float delay)
    {
        foreach (var word in words)
        {
            DisplayWord(word);
            yield return new WaitForSeconds(delay);
        }
    }
}

Bonus: Layer in FMOD or AudioMixer Tempo FX
Want voice lines or background music to flex in sync?
🎧 FMOD Route:
• 	Add a  parameter (, )
• 	Use FMOD's time-stretching or rhythm-sync modules to speed up VO delivery or modulate ambience.
🎚️ Unity Mixer Route:
• 	Use  or  transitions to slightly speed up audio clips.
• 	Sync dialogue fade-ins/fade-outs to tension surges.

public class CameraTensionShake : MonoBehaviour
{
    public float maxShakeIntensity = 0.5f;
    public TensionManager tension;

    void Update()
    {
        float intensity = Mathf.Lerp(0f, maxShakeIntensity, tension.tensionLevel);
        Vector3 shake = Random.insideUnitSphere * intensity;
        transform.localPosition = shake;
    }
}

public class TensionLightFlicker : MonoBehaviour
{
    public Light sceneLight;
    public TensionManager tension;
    private float baseIntensity;

    void Start() => baseIntensity = sceneLight.intensity;

    void Update()
    {
        if (tension.tensionLevel > 0.6f)
        {
            float flicker = baseIntensity + Mathf.Sin(Time.time * 40f) * tension.tensionLevel * 0.2f;
            sceneLight.intensity = flicker;
        }
        else
        {
            sceneLight.intensity = baseIntensity;
        }
    }
}

Tension Engine
public class TensionManager : MonoBehaviour
{
    [Range(0f, 1f)]
    public float tensionLevel;

    public static TensionManager Instance;

    void Awake() => Instance = this;

    public void SetTension(float newLevel)
    {
        tensionLevel = Mathf.Clamp01(newLevel);
    }

    public float GetTension() => tensionLevel;
}

float speedModifier = Mathf.Lerp(1f, 0.5f, TensionManager.Instance.GetTension());
float delayBetweenWords = baseDelay * speedModifier;

Font Distortion UI
dialogueText.fontSize = baseSize + Random.Range(-jitter, jitter);
dialogueText.characterSpacing = baseSpacing + Random.Range(-jitter, jitter);
dialogueText.color = Color.Lerp(calmColor, stressColor, TensionManager.Instance.GetTension());

Trait-Based Audio Filters

dialogueEvent.setParameterByName("TraitFilter", traitValue);
dialogueEvent.setParameterByName("Tension", TensionManager.Instance.GetTension());

Camera Shake Controller
Vector3 shakeOffset = Random.insideUnitSphere * TensionManager.Instance.GetTension() * maxShake;
camera.transform.localPosition = originalPosition + shakeOffset

 Lighting Flicker System
sceneLight.intensity = baseIntensity + Mathf.Sin(Time.time * flickerRate) * TensionManager.Instance.GetTension() * flickerIntensity;
heartbeatInstance.setParameterByName("BeatRate", Mathf.Lerp(60f, 160f, TensionManager.Instance.GetTension()));

loat proximity = Vector3.Distance(player.position, squadmate.position);
float uneaseFactor = Mathf.InverseLerp(maxRange, minRange, proximity) * TensionManager.Instance.GetTension();

Create the Jitter Shader
Shader "TextEffects/JitterWave"
{
    Properties
    {
        _MainTex ("Font Texture", 2D) = "white" {}
        _JitterStrength ("Jitter Strength", Float) = 0.05
        _WaveSpeed ("Wave Speed", Float) = 5.0
    }

    SubShader
    {
        Tags { "RenderType"="Transparent" }
        LOD 200

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata_t
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            sampler2D _MainTex;
            float _JitterStrength;
            float _WaveSpeed;

            v2f vert (appdata_t v)
            {
                v2f o;
                float time = _Time.y * _WaveSpeed;
                float wave = sin(v.vertex.x * 10.0 + time) * _JitterStrength;
                float jitter = (rand(v.vertex.xy) - 0.5) * _JitterStrength;

                v.vertex.y += wave + jitter;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                return tex2D(_MainTex, i.uv);
            }

            float rand(float2 co)
            {
                return frac(sin(dot(co.xy ,float2(12.9898,78.233))) * 43758.5453);
            }
            ENDCG
        }
    }
}
public class TextMeltdownController : MonoBehaviour
{
    public Material textMaterial;

    void Update()
    {
        float tension = TensionManager.Instance.GetTension();
        textMaterial.SetFloat("_JitterStrength", Mathf.Lerp(0f, 0.1f, tension));
        textMaterial.SetFloat("_WaveSpeed", Mathf.Lerp(1f, 10f, tension));
    }
}

Screen-Space Ripple FX
float2 uv = i.uv;
float2 center = float2(0.5, 0.5);
float dist = distance(uv, center);
float ripple = sin(dist * 40.0 - _Time.y * 10.0) * 0.005;
uv += normalize(uv - center) * ripple;

float fragAmount = _FragmentationStrength;
v.vertex.xy += (rand(v.vertex.xy) - 0.5) * fragAmount;

float noise = rand(v.vertex.xy + _Time.y);
float alpha = saturate(1.0 - noise * _DisintegrationStrength);

Audio Distortion & Glitch FX
audioMixer.TransitionToSnapshots(snapshots, weights, transitionTime);
mainCamera.fieldOfView = Mathf.Lerp(baseFOV, meltdownFOV, tension);

using Cinemachine;

public class ShakeTrigger : MonoBehaviour
{
    public CinemachineImpulseSource impulseSource;

    public void TriggerShake()
    {
        impulseSource.GenerateImpulse();
    }
}

public class FOVDistorter : MonoBehaviour
{
    public Camera mainCamera;
    public float baseFOV = 60f;
    public float maxFOV = 90f;
    public float distortionSpeed = 2f;

    void Update()
    {
        float tension = TensionManager.Instance.GetTension(); // 0 to 1
        float targetFOV = Mathf.Lerp(baseFOV, maxFOV, tension);
        mainCamera.fieldOfView = Mathf.Lerp(mainCamera.fieldOfView, targetFOV, Time.deltaTime * distortionSpeed);
    }
}

Shift Saturation
ColorAdjustments colorAdjust;
volume.profile.TryGet(out colorAdjust);

colorAdjust.saturation.value = Mathf.Lerp(0f, -100f, tension);
colorAdjust.hueShift.value = Mathf.Lerp(0f, 180f, tension);
colorAdjust.postExposure.value = Mathf.Lerp(0f, -2f, tension);

Animate LUT Transitions
ColorLookup lookup;
volume.profile.TryGet(out lookup);
lookup.contribution.value = Mathf.Lerp(0f, 1f, tension);

Flash Red Overlays

overlayImage.color = new Color(1f, 0f, 0f, Mathf.PingPong(Time.time * flashSpeed, 0.5f));

IEnumerator DelayedInput(Action action)
{
    yield return new WaitForSeconds(Random.Range(0.1f, 0.5f));
    action.Invoke();
}

UI Distortion
iElement.transform.localScale = Vector3.one * (1f + Mathf.Sin(Time.time * 10f) * 0.05f);
uiElement.transform.rotation = Quaternion.Euler(0f, 0f, Mathf.Sin(Time.time * 20f) * 5f);

Blackout & Reboot Fake Crash Sequence
Go full meta:
1. 	Fade to black with static noise.
2. 	Display fake error message (e.g. corrupted memory, AI overload).
3. 	Play reboot animation — loading bar, BIOS-style text.
4. 	Reload scene with altered visuals or broken logic.

SceneManager.LoadScene("MeltdownScene");

Central MeltdownManager
public class MeltdownManager : MonoBehaviour
{
    public float tension; // 0 to 1
    public AudioSource glitchAudio;
    public PostProcessVolume volume;
    public Camera mainCamera;
    public Material textMaterial;

    void Update()
    {
        tension = Mathf.Clamp01(GetTensionFromStoryOrPlayer());

        // Visual FX
        UpdatePostProcessing(tension);
        UpdateCameraFOV(tension);
        UpdateTextShader(tension);

        // Audio FX
        if (tension > 0.7f && !glitchAudio.isPlaying)
            glitchAudio.Play();
    }

    float GetTensionFromStoryOrPlayer()
    {
        // Replace with actual logic: story beats, player stress, etc.
        return StoryManager.Instance.GetCurrentTension();
    }

    void UpdatePostProcessing(float t) { /* Adjust saturation, hue, LUTs */ }
    void UpdateCameraFOV(float t) { /* Animate FOV distortion */ }
    void UpdateTextShader(float t) { /* Jitter, fragment, dissolve */ }
}

public class MeltdownManager : MonoBehaviour
{
    [Range(0f, 1f)] public float tension;
    public AudioSource glitchAudio;
    public Camera mainCamera;
    public PostProcessVolume postFX;
    public Material textShader;
    public GameObject redOverlay;
    public AudioSource heartbeatAudio;
    public GameObject fakeCrashScreen;

    void Update()
    {
        tension = StoryManager.Instance.GetCurrentTension();

        ApplyPostProcessing(tension);
        ApplyCameraDistortion(tension);
        ApplyTextMeltdown(tension);
        ApplyAudioDistortion(tension);
        ApplyUIWarp(tension);
        TriggerFakeCrash(tension);
    }

    void ApplyPostProcessing(float t)
    {
        if (postFX.profile.TryGet(out ColorAdjustments color))
        {
            color.saturation.value = Mathf.Lerp(0f, -100f, t);
            color.hueShift.value = Mathf.Lerp(0f, 180f, t);
            color.postExposure.value = Mathf.Lerp(0f, -2f, t);
        }

        if (postFX.profile.TryGet(out ColorLookup lut))
        {
            lut.contribution.value = Mathf.Lerp(0f, 1f, t);
        }

        redOverlay.SetActive(t > 0.8f);
        redOverlay.GetComponent<Image>().color = new Color(1f, 0f, 0f, Mathf.PingPong(Time.time * 5f, 0.5f));
    }

    void ApplyCameraDistortion(float t)
    {
        mainCamera.fieldOfView = Mathf.Lerp(60f, 90f, t);
        Vector3 shake = Random.insideUnitSphere * t * 0.5f;
        mainCamera.transform.localPosition = shake;
    }

    void ApplyTextMeltdown(float t)
    {
        textShader.SetFloat("_JitterStrength", Mathf.Lerp(0f, 0.1f, t));
        textShader.SetFloat("_WaveSpeed", Mathf.Lerp(1f, 10f, t));
    }

    void ApplyAudioDistortion(float t)
    {
        if (t > 0.7f && !glitchAudio.isPlaying)
            glitchAudio.Play();

        heartbeatAudio.pitch = Mathf.Lerp(1f, 2f, t);
        heartbeatAudio.volume = Mathf.Lerp(0.2f, 1f, t);
    }

    void ApplyUIWarp(float t)
    {
        foreach (var ui in GameObject.FindGameObjectsWithTag("UIElement"))
        {
            ui.transform.localScale = Vector3.one * (1f + Mathf.Sin(Time.time * 10f) * t * 0.05f);
            ui.transform.rotation = Quaternion.Euler(0f, 0f, Mathf.Sin(Time.time * 20f) * t * 5f);
        }
    }

    void TriggerFakeCrash(float t)
    {
        if (t > 0.95f && !fakeCrashScreen.activeSelf)
        {
            fakeCrashScreen.SetActive(true);
            StartCoroutine(RebootSequence());
        }
    }

    IEnumerator RebootSequence()
    {
        yield return new WaitForSeconds(3f);
        // Simulate reboot with altered scene
        SceneManager.LoadScene("CorruptedVault");
    }
}

Memory Leak Simulation
List<GameObject> ghostObjects = new List<GameObject>();
float leakTimer = 0f;

void SimulateMemoryLeak(float t)
{
    leakTimer += Time.deltaTime;
    if (leakTimer > 1f && t > 0.6f)
    {
        GameObject ghost = new GameObject("GhostLeak");
        ghost.AddComponent<Rigidbody>(); // Just to consume resources
        ghost.SetActive(false);
        ghostObjects.Add(ghost);
        leakTimer = 0f;
    }

    if (t > 0.8f)
    {
        // Slow down UI responsiveness
        Time.timeScale = Mathf.Lerp(1f, 0.5f, t);
        ShowMemoryWarning();
    }
}

void ShowMemoryWarning()
{
    // Display flashing warning
    UIManager.Instance.ShowWarning("MEMORY OVERFLOW", Color.red, Mathf.PingPong(Time.time * 5f, 1f));
}

void CorruptDialogue(string originalText, float t)
{
    if (t < 0.5f) return;

    string corrupted = originalText.Replace("e", "3").Replace("o", "0");
    if (t > 0.7f)
        corrupted = "01001001 00100000 01110011 01100101 01100101 00100000 01111001 01101111 01110101";

    if (t > 0.9f)
        corrupted += "\n<i>I remember you.</i>";

    DialogueManager.Instance.DisplayText(corrupted);
}

AI Self-Awareness
void SimulateAISentience(float t)
{
    if (t > 0.85f)
    {
        // NPCs refuse commands
        foreach (var npc in FindObjectsOfType<NPCController>())
        {
            npc.SetBehavior("Defiant");
            npc.Speak("No. I won't.");
        }

        // UI types messages on its own
        UIManager.Instance.TypeMessage("You chose silence. Why?");

        // Random eerie commentary
        if (Random.value < 0.01f)
            UIManager.Instance.TypeMessage("You left me here.");
    }
}

SimulateMemoryLeak(tension);
CorruptDialogue(currentDialogueText, tension);
SimulateAISentience(tension);










