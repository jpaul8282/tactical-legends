GDscript
extends Node

func _ready():
    var aze1 = preload("res://components/Aze1.tscn").instance()
    var aze2 = preload("res://components/Aze2.tscn").instance()

    add_child(aze1)
    add_child(aze2)

    aze1.establish_protocol(aze2)

