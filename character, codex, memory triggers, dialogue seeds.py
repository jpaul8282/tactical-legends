Sue character file (characters/sue.json)
{
"characterID": "Sue",
"name": "Sue",
"role": "Mentor / Hidden Guardian",
"affiliations": ["Iron Veil", "Echo Alliance"],
"description": "Former intelligence asset, mentor to Zoe, keeper of Eden’s truth, spectral guide in Echo Protocol moments.",
"emblem": "crest_sue.png",
"voice": {
"tone": "calm",
"motifs": [
{"id": "sue_whisper", "sound": "sue_whisper.wav", "occurrence": "memory_trigger"},
{"id": "sue_chime", "sound": "sue_chime.wav", "occurrence": "codex_unlock"}
]
},
"memoriesReferenced": ["origin_memory", "betrayal_memory"]
}

Sue memory seeds (memories/sue_memories.json)
{
"memories": [
{
"memoryID": "M_SUE_ORIGIN",
"scene": "origin",
"lines": [
{"speaker": "Sue", "text": "The archive teaches patience, and patience buys time."},
{"speaker": "Zoe", "text": "Patience. Even with Eden watching us?"}
],
"tone": "reflective",
"trigger": {"type": "proximity", "object": "sue_dataslate_fragment", "delaySec": 0}
},
{
"memoryID": "M_SUE_BETRAYAL",
"scene": "betrayal",
"lines": [
{"speaker": "Sue", "text": "Not every betrayal is born equal; some save more lives than they ruin."},
{"speaker": "Kane", "text": "That philosophy costs us something."}
],
"tone": "somber",
"trigger": {"type": "combat_event", "delaySec": 2}
}
]
}

Codex entries (codex/sue_codex.json)
{
"codexID": "SU-CX-01",
"title": "Sue’s Codex: The Quiet Gate",
"summary": "Encrypted notes on Eden’s fault and containment protocols",
"accessLevelRequired": 2,
"linkedMissions": ["Sand Echo", "Echo Protocol"],
"entries": [
{
"entryID": "SU-CX-01-A",
"hint": "A map overlay marks hidden Eden sites; consult memory triggers for routes.",
"notes": [
"Eden’s fault is multi-layered: data integrity, containment, and moral coding.",
"Containment requires balancing mercy and necessity; Sue’s blocks preserve Zoe’s future."
],
"reveals": [
{"type": "location", "target": "Eden-Hall-Delta"},
{"type": "mechanic", "target": "Containment Protocol"}
],
"requires": ["EF-2/3_unlocked"]
}
]
}

Echo Fragment upgrade path (fragments/echo_fragments.json)
{
"fragments": [
{
"id": "EF-1/3",
"name": "Echo Fragment 1 of 3",
"unlocked": true,
"description": "Partial memory shard recovered from first secured terminal.",
"effects": {"echoDeckUpgrade": true}
},
{
"id": "EF-2/3",
"name": "Echo Fragment 2 of 3",
"unlocked": false,
"description": "Hidden layer of Eden’s fault revealed via Sue’s codex.",
"effects": {"unlockCodexEntry": "SU-CX-01"}
},
{
"id": "EF-3/3",
"name": "Echo Fragment 3 of 3",
"unlocked": false,
"description": "Final shard completing the Echo HoloDeck upgrade.",
"effects": {"upgradeTier": "v1.1"}
}
]
}

Memory trigger seeds for Sue-influenced moments (mem_triggers/memory_triggers.json)
{
"triggers": [
{
"triggerID": "T_SUE_DS_FRAGMENT",
"type": "object_interaction",
"objectID": "sues_dataslate_fragment",
"flashbackID": "M_SUE_ORIGIN",
"durationSec": 6,
"outcome": {
"mentalResilienceDelta": 3,
"dialogueVariant": "empathy"
}
},
{
"triggerID": "T_SUE_ECHO_PROTOCOL_HINT",
"type": "overlay_event",
"overlayID": "sue_hint_overlay",
"durationSec": 5,
"outcome": {
"moralityShift": 0,
"dialogueVariant": "warning"
}
}
]
}

Dialogue seeds (dialogue/dialogue_sue.json)
{
"scenes": [
{
"sceneID": "VaultOfEchoes_A",
"lines": [
{"character": "Sue", "text": "The archive hides what you’re not ready to see until you’ve learned to look with a steadier hand."},
{"character": "Zoe", "text": "Then teach me to read it without breaking."}
],
"branch": "A_empathy"
},
{
"sceneID": "VaultOfEchoes_B",
"lines": [
{"character": "Sue", "text": "Some files are sleeping for a reason—their dreams bite back when awakened."},
{"character": "Kane", "text": "Careful, Sue. The truth hurts."}
],
"branch": "B_ruthlessness"
}
]
}

War Table overlay and memory UI cues (ui/war_table_ui.json)
{
"overlayID": "sue_overlay",
"title": "Sue’s Guidance",
"icon": "icon_sue.png",
"description": "Mentor presence guiding memory cues and codex access decisions.",
"hudCues": [
{"type": "emotive", "variant": " empathy", "color": "gold", "sfx": "sue_chime.wav"},
{"type": "warning", "variant": " ruthlessness", "color": "blue", "sfx": "sue_whisper.wav"}
],
"notifications": [
{"trigger": "memories_unlocked", "text": "A Sue memory surfaces."},
{"trigger": "codex_access", "text": "Sue’s Codex reveals new paths."}
]
}

Triggered endings and flags (endings_flags.json)
{
"endings": [
{
"id": "END_SUE_TRUST_HIGH",
"conditions": ["branch_empthy_complete", "codex_access_granted"],
"outcome": {"ally": "Sue", "trustImpact": "+1", "finalState": "Sue remains active ally"}
},
{
"id": "END_SUE_TRUST_LOW",
"conditions": ["branch_ruthlessness", "no_codex_access"],
"outcome": {"ally": "Sue", "trustImpact": "-1", "finalState": "Sue withdraws and warns Zoe"}
}
]
}
  function onEchoProtocolEntry(player, missionState):
// Triggered after Sand Echo and Echo Protocol intro
presentChoice("Choose approach to hidden facility", options=["A_MemoryLockOverride", "B_ForceBypass"])
choice = getPlayerChoice()

if choice == "A_MemoryLockOverride":
// Branch A: Empathy path
player.trustWithSue += 8
player.moralityScore += 0.5
logWarTableIncident("EchoProtocol_A_MemoryOverride", {"trustDelta": +8, "moralityDelta": +0.5})
unlockOverlay("sue_overlay", variant="empathy")
grantQuestReward("EchoBridge_A")
// Trigger Sue-guided memory flash
triggerMemoryFlash("M_SUE_ORIGIN", delay=0)
// Access controlled by codex
if hasCodexAccess("SU-CX-01"):
unlockCodexEntry("SU-CX-01")
else if choice == "B_ForceBypass":
// Branch B: Ruthlessness path
player.trustWithSue -= 6
player.moralityScore -= 0.7
logWarTableIncident("EchoProtocol_B_ForceBypass", {"trustDelta": -6, "moralityDelta": -0.7})
unlockOverlay("sue_overlay", variant="warning")
grantQuestReward("EchoBridge_B")
// Ruthlessness memory flash
triggerMemoryFlash("M_SUE_BETRAYAL", delay=2)
// Possibly give early access to high-tier intel
if not isUnlocked("EF-1/3"):
unlockFragment("EF-1/3")
 (simplified)
function triggerMemoryFlash(memoryID, delay):
wait(delay)
displayFlashback(memoryID) // uses memory data from memories/sue_memories.json
// Memory effects
if memoryID == "M_SUE_ORIGIN":
// Increase resilience in the empathy path
player.mentalResilience += 2
else if memoryID == "M_SUE_BETRAYAL":
player.mentalResilience -= 1
// Optional: raise suspicion about Sue if Ruth's path

 War Table log and UI update
function logWarTableIncident(incidentID, delta):
entry = {
"incidentID": incidentID,
"timestamp": currentGameTime(),
"factionTrustDelta": delta.trustDelta,
"moralityShift": delta.moralityDelta,
"notes": "Updated via Sue influence"
}
WarTable.logs.append
