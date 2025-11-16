GDSCRIPT
extends Node

class_name ActorLink

var actor_foo1
var actor_foo2

func _ready():
    actor_foo1 = preload("res://actors/Foo1.tscn").instance()
    actor_foo2 = preload("res://actors/Foo2.tscn").instance()
    add_child(actor_foo1)
    add_child(actor_foo2)

    connect_actors(actor_foo1, actor_foo2)

func connect_actors(a1, a2):
    a1.linked_actor = a2
    a2.linked_actor = a1

