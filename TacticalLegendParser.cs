using System.Collections.Generic;
using System.Text.Regular Expressions;

public static class TacticalLegendParser
{
    // Define tag mappings
    private static readonly Dictionary<string, string> tagMap = new Dictionary<string, string>
    {
        { "~~echo-wave~~", "<i><color=#00FFFF>EchoWave</color></i>" },
        { "**vault-sigil**", "<b><color=#3366FF>VaultSigil</color></b>" },
        { "//eden-glyph//", "<i><color=#66FF66>EdenGlyph</color></i>" },
        { "--stricken-protocol--", "<s>StrickenProtocol</s>" },
        { "__underlined-command__", "<u>UnderlinedCommand</u>" },
        { "~__unstable-thread__", "<u><color=#FF3333>UnstableThread</color></u>" },
        { "<vb>", "<b><color=#3366FF>" },
        { "<oi>", "<i><color=#FF9900>" },
        { "<ec:mono>", "<font=monospace><color=#66FF66>" },
        { "<strike:green>", "<s><color=green>" },
        { "<underline:red>", "<u><color=red>" },
        { "<wave:#0000FF>", "<i><color=#0000FF>" },
        { "<color:eden-blue>", "<color=#66FFCC>" },
        { "<back:vault-orange>", "<mark=#FFA500>" },
        { "<size:20>", "<size=20>" }
    };

    // Apply formatting to input text
    public static string Parse(string input)
    {
        foreach (var tag in tagMap)
        {
            input = input.Replace(tag.Key, tag.Value);
        }

        // Close any open tags (simplified)
        input = Regex.Replace(input, @"(?<!</)(EchoWave|VaultSigil|EdenGlyph|StrickenProtocol|UnderlinedCommand|UnstableThread)", "$1</color></i></b></u></s>");

        return input;
    }
}

TacticalLegendUIRenderer
├── TextStyler (applies markup styles)
├── AnimationEngine (animates styled elements)
├── VoiceoverManager (triggers audio cues)
├── CodexUnlocker (tracks lore progression)
└── UIController (coordinates rendering)
public class TextStyler: MonoBehaviour
{
    public TextMeshProUGUI targetText;

    public void ApplyStyledText(string rawInput)
    {
        string styled = TacticalLegendParser.Parse(rawInput);
        targetText.text = styled;
    }
}

public class AnimationEngine: MonoBehaviour
{
    public void AnimateTag(string tagType, GameObject target)
    {
        switch (tagType)
        {
            case "vault-sigil":
                StartCoroutine(GlowEffect(target, Color.blue));
                break;
            case "eden-glyph":
                StartCoroutine(PulseEffect(target, Color.green));
                break;
            case "echo-wave":
                StartCoroutine(WaveEffect(target));
                break;
        }
    }

    IEnumerator GlowEffect(GameObject obj, Color glowColor) { /* ... */ }
    IEnumerator PulseEffect(GameObject obj, Color pulseColor) { /* ... */ }
    IEnumerator WaveEffect(GameObject obj) { /* ... */ }
}

public class VoiceoverManager: MonoBehaviour
{
    public AudioSource audioSource;
    public AudioClip vaultbornClip;
    public AudioClip edenWhisper;
    public AudioClip oistarianAlert;

    public void TriggerVoice(string tagType)
    {
        switch (tagType)
        {
            case "vault-sigil":
                audioSource.PlayOneShot(vaultbornClip);
                break;
            case "eden-glyph":
                audioSource.PlayOneShot(edenWhisper);
                break;
            case "oistarian-alert":
                audioSource.PlayOneShot(oistarianAlert);
                break;
        }
    }
}

public class CodexUnlocker: MonoBehaviour
{
    private HashSet<string> unlockedEntries = new HashSet<string>();

    public void UnlockEntry(string entryID)
    {
        if (!unlockedEntries.Contains(entryID))
        {
            unlockedEntries.Add(entryID);
            DisplayCodexEntry(entryID);
        }
    }

    void DisplayCodexEntry(string entryID)
    {
        // Show lore panel, animate reveal, etc.
        Debug.Log($"Codex Entry Unlocked: {entryID}");
    }
}

public class UIController: MonoBehaviour
{
    public TextStyler styler;
    public AnimationEngine animator;
    public VoiceoverManager voiceManager;
    public CodexUnlocker codex;

    public void RenderLog(string rawText)
    {
        styler.ApplyStyledText(rawText);

        foreach (string tag in ExtractTags(rawText))
        {
            animator.AnimateTag(tag, styler.gameObject);
            voiceManager.TriggerVoice(tag);
            codex.UnlockEntry(tag);
        }
    }

    List<string> ExtractTags(string input)
    {
        // Simple tag detection logic
        return new List<string> { "vault-sigil", "eden-glyph" }; // Example
    }
}

string log = "**vault-sigil** Echo-27 activated ~~echo-wave~~ protocol near Eden ruins.";
uiController.RenderLog(log);

RelicViewer
public class RelicViewer: MonoBehaviour
{
    public GameObject relicModel;
    public Material vaultbornShader;
    public Material edenShader;
    public Material oistarianShader;

    public void DisplayRelic(RelicData relic)
    {
        relicModel.GetComponent<MeshRenderer>().material = GetFactionShader(relic.faction);
        relicModel.transform.rotation = Quaternion.identity;
        relicModel.SetActive(true);
        RelicLoreOverlay.Show(relic.lore);
        VoiceoverManager.PlayRelicWhisper(relic.faction);
    }

    private Material GetFactionShader(string faction)
    {
        return faction switch
        {
            "Vaultborn" => vaultbornShader,
            "Eden Core" => edenShader,
            "Oistarian" => oistarianShader,
            _ => vaultbornShader
        };
    }
}

UISkinManager
public class UISkinManager: MonoBehaviour
{
    public UITheme vaultbornTheme;
    public UITheme edenTheme;
    public UITheme oistarianTheme;

    public void ApplyFactionSkin(string faction)
    {
        UITheme theme = faction switch
        {
            "Vaultborn" => vaultbornTheme,
            "Eden Core" => edenTheme,
            "Oistarian" => oistarianTheme,
            _ => vaultbornTheme
        };

        UIStyler.ApplyTheme(theme);
        AmbientFXManager.TriggerFactionAmbient(faction);
    }
}

public class RelicData
{
    public string name;
    public string faction;
    public string lore;
    public GameObject modelPrefab;
}

RelicData surgeBeacon = new RelicData {
    name = "Surge Beacon",
    faction = "Eden Core",
    lore = "Forged in the Eden storms, this relic stabilizes Echo ruptures.",
    modelPrefab = surgeBeaconModel
};

relicViewer.DisplayRelic(surgeBeacon);
uiSkinManager.ApplyFactionSkin(surgeBeacon.faction);

public class RelicFusionPreviewer : MonoBehaviour
{
    public GameObject fusionModel;
    public TextMeshProUGUI fusionStats;
    public TextMeshProUGUI fusionLore;

    public void PreviewFusion(Relic relicA, Relic relicB)
    {
        fusionModel.GetComponent<MeshRenderer>().material = BlendShaders(relicA.faction, relicB.faction);
        fusionStats.text = $"Projected ATK: {(relicA.attack + relicB.attack) / 2 + 10}";
        fusionLore.text = GenerateFusionLore(relicA, relicB);
    }

    private Material BlendShaders(string factionA, string factionB) { /* ... */ }
    private string GenerateFusionLore(Relic a, Relic b)
    {
        return $"When {a.name} meets {b.name}, the vault remembers both. A relic of dual memory emerges.";
    }
}

{
  "relicName": "Stormcaller Matrix",
  "origin": "Vaultborn + Eden Core",
  "inscription": "Forged in the aftermath of EchoStorm 7. It remembers the silence of Eden and the fury of Vaultborn vengeance. Bound by the hands of Echo-27 and Nyla Sera."
}

public string GenerateLoreInscription(Relic relic, List<SquadMember> contributors)
{
    string origin = $"{relic.factionA} + {relic.factionB}";
    string squadNames = string.Join(" and ", contributors.Select(c => c.name));
    return $"Forged in the aftermath of {relic.eventTag}. It remembers the silence of {relic.factionB} and the fury of {relic.factionA}. Bound by the hands of {squadNames}.";
}

{
  "relicID": "VX-77",
  "currentOwner": "Echo-27",
  "previousOwners": ["Nyla Sera", "Gunwafa"],
  "bondLevel": 3,
  "sharedLore": "Forged in Hollow Grid. Echoed through three hands. Still remembers the Siege."
}

public FusionResult PreviewFusion(Relic relicA, Relic relicB)
{
    var hybridStats = CalculateStats(relicA, relicB);
    var traitSynergy = AnalyzeTraits(relicA.traits, relicB.traits);
    var lore = GenerateFusionLore(relicA, relicB);

    return new FusionResult {
        stats = hybridStats,
        synergy = traitSynergy,
        lorePreview = lore
    };
}

public void SimulateEvolution(Relic relic, MissionData mission)
{
    if (mission.survived && mission.difficulty > 7)
        relic.traits.Add("Endurance Echo");

    if (mission.usedWithAllyRelic)
        relic.traits.Add("Bonded Memory");

    relic.lore += $"Evolved during {mission.name}, adapting to {mission.environment}.";
}

