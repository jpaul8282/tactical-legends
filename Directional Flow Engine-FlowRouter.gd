GDscript
extends Node

var ac1 = preload("res://nodes/ActionCore.tscn").instance()

func _ready():
    add_child(ac1)
    route(ac1, "left", "left1")
    route(ac1, "right", "right1")
    route(ac1, "up", "up1")
    route(ac1, "up_alt", "up2")
    route(ac1, "down", "down1")
    route(ac1, "down_alt", "down2")

func route(source, direction, target_name):
    var target = get_node_or_null(target_name)
    if target:
        source.connect_direction(direction, target)


