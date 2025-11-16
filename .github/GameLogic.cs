using System;
using System.Linq;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Defines the various states of a relic's unlock progression.
/// </summary>
public enum RelicUnlockState
{
    /// <summary>The relic is not yet known or acquired by the player.</summary>
    Locked,
    /// <summary>The relic's existence has been discovered, but it is not yet usable.</summary>
    Discovered,
    /// <summary>The relic has been fully unlocked and is available for use.</summary>
    Unlocked
}

/// <summary>
/// Serializable data class for a single Relic item.
/// </summary>
[Serializable]
public class Relic
{
    public string name;
    public string type;
    public string bonus;
    public string unlockMethod;
    public string[] linkedOperatives;
    public RelicUnlockState unlockState = RelicUnlockState.Locked;
}

/// <summary>
/// Serializable data class for a single Operative character.
/// </summary>
[Serializable]
public class Operative
{
    public string name;
    public bool isUnlocked;
}

/// <summary>
/// A ScriptableObject to hold all game-related data, such as relics and operatives.
/// Using a ScriptableObject allows for easy data management in the Unity editor.
/// </summary>
[CreateAssetMenu(fileName = "CodexData", menuName = "Game Data/Codex")]
public class CodexData : ScriptableObject
{
    public List<Relic> relics = new List<Relic>();
    public List<Operative> operatives = new List<Operative>();
}

/// <summary>
/// A static class to manage and broadcast game-wide events.
/// This acts as a central hub for communication between different systems.
/// </summary>
public static class GameEvents
{
    public static Action<string> OnMissionCompleted;
    public static Action<string> OnRelicDiscovered;

    public static void MissionCompleted(string missionName)
    {
        OnMissionCompleted?.Invoke(missionName);
    }

    public static void RelicDiscovered(string relicName)
    {
        OnRelicDiscovered?.Invoke(relicName);
    }
}

/// <summary>
/// Manages the unlocking logic for relics and their associated operatives.
/// This class handles event subscriptions and state changes.
/// </summary>
public class RelicUnlockManager : MonoBehaviour
{
    [SerializeField]
    private CodexData codex;
    
    private Dictionary<string, Relic> relicCache;
    private Dictionary<string, Operative> operativeCache;

    private void Awake()
    {
        // Cache the lists into dictionaries for faster lookups
        relicCache = codex.relics.ToDictionary(r => r.name, r => r);
        operativeCache = codex.operatives.ToDictionary(o => o.name, o => o);
    }

    private void OnEnable()
    {
        GameEvents.OnMissionCompleted += HandleMissionUnlock;
        GameEvents.OnRelicDiscovered += HandleRelicDiscovery;
    }

    private void OnDisable()
    {
        GameEvents.OnMissionCompleted -= HandleMissionUnlock;
        GameEvents.OnRelicDiscovered -= HandleRelicDiscovery;
    }

    private void HandleMissionUnlock(string missionName)
    {
        foreach (Relic relic in codex.relics)
        {
            if (relic.unlockMethod.Contains(missionName) && relic.unlockState == RelicUnlockState.Locked)
            {
                relic.unlockState = RelicUnlockState.Unlocked;
                Debug.Log($"Relic Unlocked: {relic.name}");
                UnlockLinkedOperatives(relic);
            }
        }
    }

    private void HandleRelicDiscovery(string relicName)
    {
        if (relicCache.TryGetValue(relicName, out Relic relic))
        {
            if (relic.unlockState == RelicUnlockState.Locked)
            {
                relic.unlockState = RelicUnlockState.Discovered;
                Debug.Log($"Relic Discovered: {relic.name}");
            }
        }
    }

    private void UnlockLinkedOperatives(Relic relic)
    {
        foreach (string opName in relic.linkedOperatives)
        {
            if (operativeCache.TryGetValue(opName, out Operative operative))
            {
                operative.isUnlocked = true;
                Debug.Log($"Operative Unlocked: {operative.name}");
            }
        }
    }
}

/// <summary>
/// A MonoBehaviour to handle the display logic for a Relic in the UI.
/// This separates UI concerns from core game logic.
/// </summary>
public class RelicDisplay : MonoBehaviour
{
    public TMPro.TMP_Text relicNameText;
    public TMPro.TMP_Text bonusText;
    public TMPro.TMP_Text statusText;
    
    /// <summary>
    /// Displays the data from a given relic on the UI elements.
    /// </summary>
    /// <param name="relic">The relic to display.</param>
    public void DisplayRelic(Relic relic)
    {
        relicNameText.text = relic.name;
        bonusText.text = relic.bonus;
        
        // Use a switch expression for cleaner state-based text assignment.
        statusText.text = relic.unlockState switch
        {
            RelicUnlockState.Locked => "🔒 Locked",
            RelicUnlockState.Discovered => "🧩 Discovered",
            RelicUnlockState.Unlocked => "✅ Unlocked",
            _ => "Unknown"
        };
    }
}
