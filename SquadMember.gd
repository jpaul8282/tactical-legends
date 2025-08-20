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
            member.attack += member.attack * 0.1
            member.defense -= member.defense * 0.1
        "Fearful":
            member.movement_range -= 1
            if randf() < 0.2:
                member.skip_turn = true
        "Hopeful":
            member.healing_received += member.healing_received * 0.05
        _:
            pass


