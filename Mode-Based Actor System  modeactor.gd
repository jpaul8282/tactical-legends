GDscript
extends Node

func _ready():
    var mode_actor = preload("res://actors/Mode1Actor.tscn").instance()
    var fooa1 = preload("res://actors/FooA1.tscn").instance()
    var foo1l = preload("res://actors/Foo1L.tscn").instance()

    add_child(mode_actor)
    add_child(fooa1)
    add_child(foo1l)

    mode_actor.connect_to(fooa1)
    mode_actor.route("right", foo1l)

