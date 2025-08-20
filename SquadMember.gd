class_name SquadMember
extends Resource

var name: String
var class_type: String
var gear: Dictionary
var traits: Array
var emotional_state: String

extends Node

var squad: Array = []

func add_member(member: SquadMember):
    squad.append(member)

func remove_member(index: int):
    squad.remove_at(index)

func get_squad_summary() -> String:
    var summary = ""
    for member in squad:
        summary += "%s (%s)\n" % [member.name, member.class_type]
    return summary

extends Node3D

@export var character_data: SquadMember

func _ready():
    load_model(character_data.class_type)
    apply_gear(character_data.gear)
    set_emotion(character_data.emotional_state)

func load_model(class_type: String):
    var path = "res://Models/%s.tscn" % class_type
    var model = load(path).instantiate()
    add_child(model)

func apply_gear(gear: Dictionary):
    for item in gear.keys():
        var gear_path = "res://Gear/%s.tscn" % gear[item]
        var gear_model = load(gear_path).instantiate()
        add_child(gear_model)

func set_emotion(emotion: String):
    # Example: change material or play animation
    if emotion == "angry":
        $AnimationPlayer.play("rage_pose")

Control
├── VBoxContainer (SquadList)
│   ├── HBoxContainer (for each SquadMember)
│   │   ├── Label (Name)
│   │   ├── OptionButton (Class Type)
│   │   ├── OptionButton (Emotional State)
│   │   ├── Button (Remove)
├── Button (Add Member)
├── Button (Start Game)
extends Control

@onready var squad_list = $SquadList
@onready var add_button = $AddMember
@onready var start_button = $StartGame

var squad: Array = []

func _ready():
    add_button.pressed.connect(add_member)
    start_button.pressed.connect(start_game)

func add_member():
    var member = SquadMember.new()
    member.name = "New Recruit"
    member.class_type = "Soldier"
    member.emotional_state = "Neutral"
    squad.append(member)
    update_ui()

func update_ui():
    squad_list.clear()
    for i in squad.size():
        var hbox = HBoxContainer.new()
        var name_label = Label.new()
        name_label.text = squad[i].name

        var class_picker = OptionButton.new()
        class_picker.add_item("Soldier")
        class_picker.add_item("Medic")
        class_picker.add_item("Sniper")
        class_picker.selected = class_picker.get_item_index(squad[i].class_type)

        var emotion_picker = OptionButton.new()
        emotion_picker.add_item("Neutral")
        emotion_picker.add_item("Angry")
        emotion_picker.add_item("Fearful")
        emotion_picker.add_item("Hopeful")
        emotion_picker.selected = emotion_picker.get_item_index(squad[i].emotional_state)

        class_picker.item_selected.connect(func(index):
            squad[i].class_type = class_picker.get_item_text(index))

        emotion_picker.item_selected.connect(func(index):
            squad[i].emotional_state = emotion_picker.get_item_text(index))

        var remove_btn = Button.new()
        remove_btn.text = "Remove"
        remove_btn.pressed.connect(func(): squad.remove_at(i); update_ui())

        hbox.add_child(name_label)
        hbox.add_child(class_picker)
        hbox.add_child(emotion_picker)
        hbox.add_child(remove_btn)
        squad_list.add_child(hbox)

func apply_emotion_effects(member: SquadMember):
    match member.emotional_state:
        "Angry":
            member. attack += member.attack * 0.1
            member.defense -= member.defense * 0.1
        "Fearful":
            member.movement_range -= 1
            if randf() < 0.2:
                member.skip_turn = true
        "Hopeful":
            member.healing_received += member.healing_received * 0.05
        _:
            pass
func set_emotion(emotion: String):
    match emotion:
        "Angry":
            $AnimationPlayer.play("face_angry")
        "Fearful":
            $AnimationPlayer.play("face_fearful")
        "Hopeful":
            $AnimationPlayer.play("face_hopeful")
        _:
            $AnimationPlayer.play("face_neutral")
res://Audio/VoiceLines/
├── Angry/
├── Fearful/
├── Hopeful/
├── Neutral/
func play_voice(emotion: String, context: String):
    var path = "res://Audio/VoiceLines/%s/%s.wav" % [emotion, context]
    var voice = preload(path)
    $AudioStreamPlayer.stream = voice
    $AudioStreamPlayer.play()
func get_dialogue_line(emotion: String, situation: String) -> String:
    var dialogue = {
        "Angry": {
            "battle_start": "Let's crush them!",
            "loss": "This isn't over!"
        },
        "Fearful": {
            "battle_start": "I... I don't know if we can do this.",
            "loss": "I knew it..."
        },
        "Hopeful": {
            "battle_start": "We’ve got this. Stay strong!",
            "loss": "We’ll learn and come back stronger."
        }
    }
    return dialogue[emotion][situation]
class_name EmotionalTracker
extends Node

var emotional_log: Dictionary = {}
var trauma_score: int = 0
var morale_score: int = 100

func update_emotion(member_name: String, emotion: String):
    emotional_log[member_name] = emotion
    match emotion:
        "Angry": trauma_score += 5
        "Fearful": trauma_score += 10
        "Hopeful": morale_score += 10
        "Neutral": pass

func get_team_mood() -> String:
    if trauma_score > 50:
        return "Traumatized"
    elif morale_score > 150:
        return "Inspired"
    else:
        return "Stable"
class_name DialogueNode
extends Resource

var text: String
var emotion: String
var choices: Array = []  # Each choice is a Dictionary: { "text": String, "next_node": DialogueNode }

raphEdit
├── DialogueNodeUI (GraphNode)
│   ├── LineEdit (Text)
│   ├── OptionButton (Emotion)
│   ├── VBoxContainer (Choices)
│   │   ├── LineEdit (Choice Text)
│   │   ├── Button (Link to Next Node)
class_name EmotionalProfile
extends Resource

var trauma: int = 0
var morale: int = 100
var relationships: Dictionary = {}  # e.g. { "Alex": "trusted", "Mira": "distant" }

func apply_event(event: String):
    match event:
        "rest":
            trauma = max(trauma - 10, 0)
        "victory":
            morale += 15
        "bonding":
            morale += 10
            trauma -= 5
        "loss":
            trauma += 20
            morale -= 15

class_name MemoryLog
extends Resource

var events: Array = []  # Stores dictionaries like { "type": "betrayal", "actor": "Mira", "impact": -20 }

func remember(event_type: String, actor: String, impact: int):
    events. append({ "type": event_type, "actor": actor, "impact": impact })

func get_emotional_bias(actor: String) -> int:
    var bias = 0
    for e in events:
        if e["actor"] == actor:
            bias += e["impact"]
    return bias

func update_music(emotion: String):
    match emotion:
        "hopeful": play_stream("res://music/hope.ogg")
        "tense": play_stream("res://music/tension.ogg")
        "grief": play_stream("res://music/sorrow.ogg")
class_name NarrativeAgent
extends Resource

var emotional_profile: EmotionalProfile
var memory_log: MemoryLog
var current_goal: String = ""

func generate_goal():
    if emotional_profile.trauma > 50:
        current_goal = "seek closure"
    elif memory_log.get_emotional_bias("Mira") > 30:
        current_goal = "protect Mira"
    else:
        current_goal = "prove self-worth"

🔥 Campfire Scene Blueprint: Tactical Downtime, Cinematic Depth
🎭 Scene Setup


🕹️ Mechanics
🗣️ Dialogue Wheel
• 	Radial UI with character portraits.
• 	Choices influenced by emotional state and memory bias.
• 	Locked options appear grayed out with hints like “Too hurt to speak.”
💓 Emotional Feedback Meter
• 	Displays emotional resonance: trust, tension, vulnerability.
• 	Shifts in real-time based on dialogue choices.
• 	Unlocks new options when thresholds are crossed.

🧩 Emotional Interactions

Example: If Mira forgives Alex for a past betrayal, their duo's “Echo Strike” attack becomes available in future battles.

🌌 Bonus Touches
💡 Dynamic Lighting
• 	Firelight dims or flares based on emotional tone.
• 	Blue hues for sorrow, warm orange for connection, flickering shadows for tension.
🎶 Music Shifts
• 	Layered tracks fade in/out based on the emotional feedback meter.
• 	Solo violin for grief, soft piano for intimacy, ambient pads for reflection.
🧠 MemoryLog Integration
• 	Every shared story or emotional breakthrough adds a new entry.
• 	These entries influence future dialogue, combat behavior, and AI-generated goals.

🧪 Optional Enhancements
• 	Voice acting: Whispered lines, pauses, breaths—make it feel lived-in.
• 	Flashback cut-ins: Brief visual memories triggered by dialogue.
• 	Campfire journal: Players can read character reflections after each scene.


Storyboard: Mira & Alex Campfire Scene
🌙 Scene Context
• 	Setting: A quiet glade post-mission. The fire crackles. Mira sits apart, staring into the flames. Alex approaches hesitantly.
• 	Emotional History: Alex made a tactical decision that cost Mira her brother. Mira hasn’t spoken to him since.

🗣️ Dialogue Flow


🎭 Cinematic Touches
• 	Camera: Slow zoom on Mira’s face as she speaks. Cut to Alex’s clenched hands.
• 	Lighting: Fire dims during tension, flares during forgiveness.
• 	Music: Sparse piano during grief, strings swell as trust returns.

🎛️ Emotional Feedback Meter UI
🧩 Design Elements

🎨 Visual Style
• 	Theme: Organic, ember-like glow with soft transitions
• 	Animation: Pulse effect when emotions shift dramatically
• 	Sound: Subtle chime when a new emotional threshold is crossed

🧠 Integration with Gameplay
• 	Emotional meter influences:
• 	Dialogue options
• 	Combat synergy
• 	AI behavior in future missions
• 	Music and lighting in real-time


CanvasLayer
├── Control (EmotionalMeterUI)
│   ├── TextureProgress (MeterBar)
│   ├── Label (EmotionLabel)
│   ├── AnimationPlayer (PulseEffect)
│   ├── IconContainer (UnlockIcons)
Key Features
• 	MeterBar: A segmented horizontal bar with 5 emotional states:
• 	🔴 Tension
• 	🟠 Vulnerability
• 	🔵 Sadness
• 	🟢 Trust
• 	🟣 Bonding
• 	EmotionLabel: Displays current dominant emotion (e.g., “Trust rising…”)
• 	PulseEffect: Animates glow when emotional thresholds are crossed
• 	UnlockIcons: Appears when duo abilities or new dialogue paths unlock (e.g. 🗡️ “Echo Strike”)

func update_emotion(emotion: String, intensity: float):
    $MeterBar.value = intensity
    $EmotionLabel.text = emotion.capitalize() + " rising..."
    $PulseEffect.play("pulse_" + emotion)
    
    if intensity > 80 and emotion == "bonding":
        $UnlockIcons.show()

class_name DialogueNode
extends Resource

var speaker: String
var text: String
var emotion: String
var choices: Array = []  # Each choice: { "text": String, "next_node": DialogueNode, "emotion_shift": int }

 Scene Flow
🔹 Node 1: Opening
speaker = "Mira"
text = "You shouldn’t be here."
emotion = "tension"
choices = [
  { "text": "I know. But I had to try.", "next_node": Node2, "emotion_shift": +10 },
  { "text": "I’ll leave if you want.", "next_node": Node3, "emotion_shift": -5 }
]

Node 2: Vulnerability
speaker = "Alex"
text = "I thought I was protecting everyone. I was wrong."
emotion = "vulnerability"
choices = [
  { "text": "He was all I had left.", "next_node": Node4, "emotion_shift": +15 },
  { "text": "You don’t get to rewrite history.", "next_node": Node5, "emotion_shift": -20 }
]

Node 4: Forgiveness Path
speaker = "Mira"
text = "I don’t know if I can forgive you."
emotion = "sadness"
choices = [
  { "text": "I’m not asking for that. Just… let me carry some of the weight.", "next_node": Node6, "emotion_shift": +20 }
]

Node 6: Bonding Moment
speaker = "Mira"
text = "He believed in you. Maybe I should try."
emotion = "bonding"
choices = [
  { "text": "Then let’s honor him together.", "next_node": null, "emotion_shift": +30 }
]

Duo Ability: Echo Strike
🌌 Origin
Unlocked only after Mira forgives Alex during the campfire scene, when emotional bonding reaches a threshold. It’s not just a move—it’s a symbol of reconciliation.

🎯 Ability Overview
|  |  | 
|  |  | 
|  |  | 
|  |  | 
|  |  | 
|  |  | 
|  |  | 



🧠 Mechanics
- Phase 1: Mira performs a swift strike that marks the target.
- Phase 2: Alex follows up with a delayed echo attack that deals bonus damage based on Mira’s emotional state.
- Synergy Bonus: If Mira’s trust in Alex is high (from MemoryLog), the echo strike has a chance to stun.
func echo_strike(target):
    if is_adjacent(mira, alex) and mira.morale > 80:
        mira.attack(target)
        yield(get_tree().create_timer(0.5), "timeout")
        var bonus = mira.emotional_profile.trust_level * 0.1
        alex.attack(target, damage_multiplier=1.5 + bonus)

Visual & Audio Flair
- Animation: Mira’s blade leaves a glowing trail; Alex’s echo strike follows the same arc with a spectral shimmer.
- Sound: Two-part audio—first a sharp slash, then a resonant echo like a memory returning.
- UI: Duo icon pulses when available; tooltip reads: “Strike together. Heal together.”
Emotional Impact
- Unlocking Echo Strike updates both characters’ MemoryLogs:
- { "type": "bonding", "actor": "Alex", "impact": +30 }
- { "type": "forgiveness", "actor": "Mira", "impact": +25 }
- Future campfire scenes may reference this moment, deepening their arc.

This isn’t just a skill—it’s a narrative artifact. A move that says: we’ve been through pain, but we fight as one now. Want to sketch the next duo ability for a different pair, or build the in-game tooltip and animation concept for Echo Strike?

New Duo Ability: Shield of Silence
Pair: Liora (stoic guardian) & Tamsin (traumatized scout)
Theme: Protection through unspoken understanding
🌌 Origin
Unlocked when Liora chooses to sit beside Tamsin during a campfire scene without speaking—just presence. No words, just warmth. Emotional bonding through silence.
🛡️ Ability Overview

🧠 Mechanics
• 	Tamsin gains a temporary shield that absorbs 50% damage for 2 turns.
• 	If Tamsin is targeted while shielded, Liora auto-counters with a protective strike.
• 	Emotional resonance increases if the shield is broken—Tamsin gains courage.

🗡️ Echo Strike: Tooltip & Animation Concept
🧾 Tooltip Design

🎭 Animation Concept
🔹 Mira’s Phase
• 	Visual: Quick dash forward, blade leaves a glowing trail.
• 	Sound: Sharp slash with a rising string note.
• 	Effect: Target marked with a shimmering sigil.
🔹 Alex’s Phase
• 	Visual: After a beat, Alex’s blade follows the same arc—ghostly echo shimmer.
• 	Sound: Resonant echo slash, like a memory returning.
• 	Effect: Critical hit lands with a flash of light and a pulse from the Emotional Meter.
🔹 Emotional Meter Reaction
• 	Glows purple (bonding) and pulses.
• 	Tooltip briefly updates: “Echo Strike landed. Trust deepens.”

Storyboard: Silent Campfire Moment — Shield of Silence
🌙 Scene Setup
• 	Location: A quiet glade. The fire crackles softly. Tamsin sits alone, knees drawn to chest, staring into the flames.
• 	Lighting: Cool blue shadows, warm firelight flickering across her face.
• 	Music: Sparse piano with ambient pads—gentle, introspective.

Scene Flow
🔹 Frame 1: Isolation
• 	Camera: Wide shot. Tamsin sits apart from the others.
• 	Action: She doesn’t speak. Her morale is low. Trauma score rising.
🔹 Frame 2: Liora Approaches
• 	Camera: Slow pan as Liora walks into frame.
• 	Action: She sits beside Tamsin. No words. Just presence.
• 	Lighting: Firelight softens. Shadows recede slightly.
🔹 Frame 3: Shared Silence
• 	Camera: Close-up on their faces. Tamsin glances sideways. Liora doesn’t look at her—watches the fire.
• 	Action: Tamsin exhales. Her shoulders drop slightly.
• 	Music: A single cello note joins the piano.
🔹 Frame 4: Unlock Trigger
• 	System Message: “Shield of Silence unlocked. Trust through presence.”
• 	MemoryLog Update:

{
  "type": "bonding",
  "actor": "Liora",
  "impact": +25,
  "method": "nonverbal"
}

CombatHUD
├── DuoAbilityPanel
│   ├── Icon (Pair Portraits)
│   ├── Label (Ability Name)
│   ├── CooldownBar
│   ├── TriggerButton
│   ├── TooltipPopup
Key Features
🔹 Icon
• 	Displays portraits of the duo (e.g., Mira & Alex, Liora & Tamsin)
• 	Glows when ability is available
• 	Grays out when on cooldown or when  emotional conditions are unmet
🔹 Label
• 	Shows ability name: Echo Strike, Shield of Silence, etc.
• 	Color-coded by type: 🗡️ Offensive, 🛡️ Defensive, 💫 Emotional
🔹 CooldownBar
• 	Horizontal bar showing turns until reactivation
• 	Tooltip: “Available in 2 turns. Emotional bond required.”
🔹 TriggerButton
• 	Appears when:
• 	Characters are in correct formation (adjacent or nearby)
• 	Emotional meter threshold is met
• 	Ability is off cooldown
🔹 TooltipPopup
• 	On hover or tap:
Echo Strike
Mira & Alex
“Strike together. Heal together.”
Requires: Trust > 80, Adjacent Position
Cooldown: 3 turns
Emotional Integration
• 	UI dynamically updates based on:
• 	Emotional Feedback Meter
• 	MemoryLog entries
• 	Morale and trauma scores
• 	Example:
• 	If Mira’s trust in Alex drops below 50, Echo Strike greys out with the tooltip: “Trust fractured. Ability unavailable.”

Relationship History Engine
Each duo has a MemoryLog that tracks:
{
  "pair": ["Liora", "Tamsin"],
  "trust": 82,
  "resentment": 12,
  "shared_missions": 5,
  "trauma_events": ["Fall of Emberhold"],
  "bond_level": "Deep",
  "ability_evolution": {
    "Shield of Silence": "Silent Aegis"
  }
}

Bond Level: Determines access to advanced forms
• 	Trauma Events: Unlock unique abilities with emotional resonance
• 	Trust vs. Resentment: Affects cooldowns, potency, and availability
Ability Evolution Framework
🔹 Base Ability: Echo Strike
• 	Initial: Basic dual attack with minor heal
• 	If Trust > 80: Evolves into Echo Reverb (adds AoE splash)
• 	If Resentment > 50: Mutates into Echo Clash (damages both enemies and allies)
• 	If Trauma Shared: Unlocks Echo Remnant (leaves healing zone behind)
🔹 UI Feedback
• 	Ability icon pulses with color based on bond state:
• 	💙 Blue = Trust
• 	🔥 Red = Conflict
• 	🌫️ Grey = Trauma
• 	Hover tooltip shows:

Echo Reverb
Mira & Alex
“Strike together. Heal together.”
Bond Level: Deep
Trust: 92
Evolution Path: Reverb

UI Layout
RelationshipMap
├── Nodes (Characters)
│   ├── Portrait
│   ├── Bond Level Indicator
│   ├── Emotional Aura (color-coded)
├── Edges (Connections)
│   ├── Type: Trust / Conflict / History
│   ├── Strength: Numeric + Visual Thickness
│   ├── Tooltip: Relationship Summary
├── Filters
│   ├── Show: Trust / Trauma / Duo Abilities / Mentorships

Visual Cues
|  |  |  | 
|  |  |  | 
|  |  |  | 
|  |  |  | 
|  |  |  | 


- 
Liora
Bonded with: Tamsin (Deep)
Duo Ability: Silent Aegis
Trust: 82 | Resentment: 12
Shared Trauma: Fall of Emberhold

Mentorship System — Shaping the Bond Arc
🧩 Core Concept
Players can assign a Mentor to a duo to influence:
- Emotional growth
- Ability evolution paths
- Conflict resolution or intensification

🧠 Mechanics
🔹 Mentor Roles
Each mentor has a Bond Philosophy:
|  |  |  | 
|  |  |  | 
|  |  |  | 
|  |  |  | 


🔹 Mentorship Actions
- Campfire Dialogues: Mentor initiates reflection scenes
- Combat Coaching: Mentor gives tactical advice mid-battle
- Memory Weaving: Mentor helps duo reframe past trauma
🔹 UI Integration
- In Relationship Map, click a duo → “Assign Mentor”
- Tooltip:
Mentor: Mira
Influence: +Trust, -Resentment
Projected Evolution: Echo Reverb



🧬 Evolution Forecasting
Mentorship reveals Projected Paths:
- Echo Strike → Echo Reverb → Echo Resonance
- Shield of Silence → Silent Aegis → Voidguard
Players can nudge evolution by:
- Choosing a mentor
- Triggering bonding events
- Managing emotional states

Mechanics
🔹 Mentor Roles
Each mentor has a Bond Philosophy:
|  |  |  | 
|  |  |  | 
|  |  |  | 
|  |  |  | 


Mentorship Actions
- Campfire Dialogues: Mentor initiates reflection scenes
- Combat Coaching: Mentor gives tactical advice mid-battle
- Memory Weaving: Mentor helps duo reframe past trauma
🔹 UI Integration
- In Relationship Map, click a duo → “Assign Mentor”
- Tooltip:
Mentor: Mira
Influence: +Trust, -Resentment
Projected Evolution: Echo Reverb

Conflict Detection Engine
{
  "pair": ["Kael", "Sera"],
  "trust": 42,
  "resentment": 68,
  "last_conflict": "Mission: Ashfall",
  "status": "Fractured"
}

Thresholds:
• 	Resentment > 60 → Conflict state
• 	Trust < 50 → Duo abilities disabled
• 	Status: Fractured, Tense, Healing

Resolution Paths
Dialogue System
• 	Branching dialogue with emotional stakes
• 	Player chooses tone: Empathetic, Confrontational, Avoidant
• 	Example:
Kael: “You left me behind.”
Sera:
  [Empathetic] “I panicked. I’m sorry.”
  [Confrontational] “You would’ve done the same.”
  [Avoidant] “Let’s not talk about this.”

Echo Reconciliation
Kael & Sera
“Forgiveness forged in fire.”
Status: Healing
Trust: 65 → 80
Resentment: 68 → 40



