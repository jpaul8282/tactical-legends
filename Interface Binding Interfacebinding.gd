GDscript
extends Node

var comp1
var interf1

func _ready():
    comp1 = preload("res://components/Comp1.tscn").instance()
    interf1 = preload("res://interfaces/Interf1.gd").new()
    add_child(comp1)

    comp1.bind_interface(interf1)

