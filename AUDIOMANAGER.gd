extends Node

# Exported audio streams, assign these in the Godot editor
@export var siren_loop: AudioStream
@export var crowd_chant: AudioStream
@export var rain_drip: AudioStream

var _players := {}

func _ready():
    # Pre-create audio players for each layer
    _create_player("SirenLoop", siren_loop)
    _create_player("CrowdChant", crowd_chant)
    _create_player("RainDrip", rain_drip)

func _create_player(layer_name: String, audio_stream: AudioStream) -> void:
    var player = AudioStreamPlayer.new()
    player.stream = audio_stream
    player.name = layer_name
    player.autoplay = false
    add_child(player)
    _players[layer_name] = player

func play_ambient_layer(layer_name: String) -> void:
    var player = _players.get(layer_name)
    if player:
        player.play()
    else:
        push_warning("No audio player found for layer: %s" % layer_name)
