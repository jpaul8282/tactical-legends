GDscript
extends Node

func _ready():
    var component1 = preload("res://components/Component1.tscn").instance()
    var componentC = preload("res://components/ComponentC.tscn").instance()
    var component3 = preload("res://components/Component3.tscn").instance()

    add_child(component1)
    add_child(componentC)
    add_child(component3)

    component1.chain_to(componentC)
    component3.link_to(componentC, label="foo")

