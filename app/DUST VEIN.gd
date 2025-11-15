# DUST VEIN — Game Design Document (Godot-ready)

> **Genre:** 2D Survival • Shooter • Exploration

> **Visual Style:** Hand-painted desert mosaics mixed with neon-ink calligraphy FX

> **Tone:** Mythic, tense, atmospheric — non-political, non-stereotypical

---

## Contents

1. High Concept
2. Core Loop & Flow
3. Systems & Mechanics
4. Controls & Input (Godot mappings)
5. Player: Abilities, Stats, & Progression
6. Weapons & Veinstone Modules
7. Enemy Factions & AI Behaviors
8. Boss Fights
9. Level & Biome Design (sample levels)
10. UI/UX, HUD, and Menus
11. Art Direction, Pixel Art Prompts & Animation Ideas
12. Godot Implementation — Scene structure & Pseudocode
13. Sound & Music Direction
14. Progression & Meta Systems
15. Tools, Assets List & Pipeline
16. Milestones, Scope & Roadmap
17. QA, Balancing, and Metrics
18. Appendices (tuning numbers, sample wave charts)

---

# 1. High Concept

**DUST VEIN** places the player (Tarin) in a mythic desert where fractured "Vein Nodes" must be rebooted each night. Daytime is exploration and resource-gathering; nights are survival waves of calligraphic monsters. The visual identity fuses tiled mosaic motion with neon-ink calligraphic FX that form weapons and enemies.

**Pitch:** Surf dunes by day, re-ignite Vein Nodes by night — shoot through procedurally shifting calligraphic enemies using glyph-shaped bullets and modular Veinstone upgrades.

---

# 2. Core Loop & Flow

**Minute-to-minute:** Explore → Gather (Star Sand, Veinstone Fragments, Shade) → Upgrade/Equip → Survive Night Waves → Reach/Reboot Next Vein Node → Gain Memory/Progression → Repeat

**Session loop (30–45 min run):**

* Start at a safe hub (restores Hope Gauge)
* Day: explore up to 3 sub-areas; salvage modules and resources
* Night: face 8–12 procedural waves while reaching a target Vein Node
* End: Successful reboot grants module(s) and story beats; failure increases world corruption and raises difficulty

**Risk vs Reward:** Longer exploration yields better modules but increases night difficulty (corruption index scales with time/collected fragments).

---

# 3. Systems & Mechanics (detailed)

### Calligraphic Shooting System

* Bullets are named *Glyphs* and are visualized as stylized calligraphic shapes.
* Each glyph type defines projectile behavior (speed, homing, piercing, ricochet, return, spread).
* Players can equip 1 primary glyph and 1 secondary effect module (Veinstone Module).
* Bullet interactions with tile-mosaic cause temporary rearrangements (visual feedback + gameplay: certain tile patterns can modify projectile behavior if tuned).

**Glyph Patterns (examples)**

* *Diwani Spiral*: homing spiral (slow speed, high tracking)
* *Kūfic Line*: piercing straight-line laser (high damage, linear)
* *Naskh Burst*: rapid triple-shot spread (fast fire, low per-shot damage)

### Sand Vein Survival Cycle

* **Daytime Systems:** exploration encounters, shops (traders), puzzles inside ruins, shade hunting, resource node timers.
* **Nighttime Systems:** corruption growth, spawning algorithm that uses a *procedural footprint system* (see Appendix A). Enemy spawn points evolve depending on sandflow simulation.

### Heat & Shade Mechanics

* Heat bar increases when exposed to open sunlight; Night cools air.
* High heat => hallucination overlay (enemies duplicated; aim sway; targeting reticle jitter)
* Low temperature => movement and reload penalties (blurred edges & frost overlay)
* Shade objects: tents, archways, vapor pools create microclimate zones that reduce heat or increase warmth at night.

### Fluid Sand Movement

* Implemented as variable friction zones. Slope detection modifies velocity: downhill adds speed, uphill drains stamina.
* Player movement has a subtle momentum buffer to simulate surf.

---

# 4. Controls & Input (Godot mappings)

**Default (Keyboard + Mouse)**

* Move: A / D or Left / Right
* Jump / Climb: Space
* Dash / Evade: Shift
* Aim: Mouse
* Shoot: Left Click
* Alt-fire / Secondary: Right Click
* Interact / Reboot: E
* Open Map / Inventory: Tab

**Gamepad (DualShock / Xbox)**

* Move: Left Stick
* Aim: Right Stick
* Shoot: RT / R2
* Alt-fire: RB / R1
* Dash: B / Circle
* Interact: A / Cross
* Menu: Start

Mapping notes: Support remapping and sensitivity for aim (important for glyph-shooting precision).

---

# 5. Player: Abilities, Stats, & Progression

**Core Stats**

* **Resolve (HP-similar):** When depleted, world corruption spikes. Refill via memories or resting.
* **Stamina:** sprint, climb, dash consumption.
* **Hope Gauge:** acts as a soft-death mechanic; when 0, player enters Corrupted State (enemies buffed).
* **Heat:** environment stat, not player-chosen.

**Abilities & Unlocks**

* Double Jump (unlocked early)
* Sand Surfing (passive boost down slopes)
* Glyph Combo (allows equipping two glyphs)
* Veinstone Crafting tree (attach modules to weapons)

Progression is fragment-based: collect Veinstone Modules and Memory Echoes to unlock weapon and ability branches.

---

# 6. Weapons & Veinstone Modules

**Weapon Archetypes:**

* **Recurve Shooter (Primary):** Semi-auto glyph cannon. Balanced DPS. Good starter.
* **Piercer (Laser):** Slower fire, pierces enemies and some terrain.
* **Scatterbow:** Wide spread, good against singular huge enemies.
* **Sling (Heavy):** High-damage slow projectile that creates area-anchors.

**Sample Modules (attachable)**

* *Water-Pulse:* Heals small HP on reload.
* *Memory Echo:* Bullets spawn echo projectiles retracing past shots (good for choke points).
* *Glass Helix:* Increases crit chance when moving > 60% move speed.
* *Thermal Shroud:* Reduces heat accumulation by 20%.

**Crafting & Rarity**

* Common (salvage), Uncommon (ruins), Rare (boss drops), Legendary (endgame/plot)

---

# 7. Enemy Factions & AI Behaviors

**1) Sand Murmurs (small swarms)**

* Behavior: swarm, split on hit unless hit by piercing glyphs.
* AI: Boid-like group movement with occasional dive attacks.
* Player counters: piercing line glyphs, area control.

**2) Glassborn (medium)**

* Behavior: armor frames that charge and leap; on death, shards remain on ground.
* AI: Telegraphed leap attack; chase when player is moving fast.
* Player counters: trap with slowing modules; avoid shard fields.

**3) The Hollow Caravan (support/elite)**

* Behavior: carry lanterns that emit Hope-draining aura.
* AI: Keep distance; attempt to sandbox or protect other enemies.
* Player counters: focus-fire to snuff lanterns; use burst glyphs.

**4) The Storm Choir (boss faction)**

* Behavior: large moving body, phases tied to different glyph interactions.
* AI: multi-segmented health zones; summons smaller script-wings; environmental attacks (calligraphy ribbons that become solid barriers).

**General AI Implementation Notes:**

* Use behavior trees or modular state machines per enemy type.
* Enemy spawners should reference procedural footprint maps to choose spawn nodes.

---

# 8. Boss Fights (design examples)

## A) Choir-Mother — "Rimal of Echoes"

**Stage 1:** low-altitude serpentine body sweeps; players must shoot glyph nodes to reveal weakpoints.
**Stage 2:** summons glassborn minions and creates ribbon barriers; players use Kūfic Line to pierce through ribbons that reflect.
**Stage 3:** sky descent; large area corruption pulse — player must reach Vein anchors to create shelter.

**Mechanics:**

* Weakpoints pulse in calligraphic script; hitting in order prevents shield regeneration.
* Choir-Mother shifts between forms that invert glyph behaviors (e.g., homing becomes anti-homing).

## B) Hollow Captain — "Lantern King"

* Uses range & aura to drain Hope; summons caravan phantoms.
* Players must extinguish lanterns (contextual interactions) while managing adds.

Bosses should be multi-phased, readable (telegraphed cues), and designed around player glyph combos and environment use.

---

# 9. Level & Biome Design (sample run)

**Hub: The Oasis Archive** — safe hub, shops, crafting bench, memory wells.

**Day 1: Caravan Hubs → Cliff Libraries → Star-Market Ruins**

* Tutorial waves, basic resources, introduce Heat system.

**Night 1:** Intro waves, introduces Sand Murmurs and small Glassborn.

**Mid Run: The Endless Minaret**

* Vertical traversal, wind tunnels, layered Vein Nodes.

**Final Run: The Ink Oasis (endgame)**

* Environmental hazards that rearrange tile mosaic rapidly; final boss occurs above the Ink Lake.

**Level Design Principles:**

* Create short loops (20–40 seconds traversal) between cover points
* Balanced sightlines for each glyph type
* Multiple paths to Vein Nodes to encourage exploration and tactical choices

---

# 10. UI/UX, HUD, and Menus

**HUD elements:**

* Center: crosshair (glyph-synced)
* Top-left: Hope Gauge (artful ink meter)
* Top-right: Heat / Stamina radial bars
* Bottom-left: Equipped Glyph & Module icons with cooldown indicators
* Mini-map toggle (top-center) showing Vein Nodes & player marker

**Menu flow:**

* Pause Menu → Inventory (swap glyphs/modules) → Crafting (attach modules) → Codex/Lore

**Accessibility:**

* Color-blind glyph patterns (shape + color) — glyphs must have unique silhouettes
* Adjustable font sizes and UI scaling

---

# 11. Art Direction, Pixel Art Prompts & Animation Ideas

**General:** Hand-painted tiles with mosaic movement: each tile subtly rotates/offset on player movement. Calligraphic FX glow neon-ink colors (turquoise, magenta accents on warm desert palette).

**Pixel Art Prompts (for artists/AI):**

1. "Tarin — 32x48px pixel sprite, desert hooded courier, ink-scarf, Veinstone satchel glowing cyan, idle breathing and sliding animation frames."
2. "Diwani Spiral bullet — 16x16px glyph, animated spiral tail of neon-ink particles, leaves small rotating mosaic ripple where it lands."
3. "Sand Murmur — 24x24px swarm sprite composed of drifting black script; split animation into two smaller script-sprites."
4. "Glass Scorpion — 48x32px, crystalline body refracting light, death shatter into 6 shard sprites with small collision boxes."
5. "Vein Node — 96x96 px altar, carved mosaic, pulsing inner core that breathes light when reactivated."

**Animation Ideas:**

* Tiles rotate 2–6 degrees on player movement and revert slowly
* Bullets rearrange tiles into temporary patterns for 1.2s
* Enemy death: calligraphic explosion that spawns particle-letter spray with physics
* Heat shimmer: vertex offset shader for top 20% of screen

---

# 12. Godot Implementation — Scene structure & Pseudocode

**Folder structure (Godot project)**

```
res://
  scenes/
    Player.tscn
    Enemy.tscn
    VeinNode.tscn
    Level_Manager.tscn
    HUD.tscn
    Boss_ChoirMother.tscn
  scripts/
    player.gd
    enemy.gd
    spawner.gd
    vein_node.gd
    wave_manager.gd
  assets/
    sprites/
    particles/
    audio/
```

**Key Scenes**

* *Player.tscn* — KinematicBody2D root, AnimatedSprite, CollisionShape2D, Player.gd
* *Enemy.tscn* — for base enemies, instanced with parameters
* *Level_Manager.tscn* — manages sun cycle, sand simulation, spawn nodes

**Pseudocode: Player core (GDScript-like)**

```gdscript
# player.gd (outline)
extends KinematicBody2D

const GRAVITY = 1200
var velocity = Vector2.ZERO
var speed = 200
var stamina = 100
var resolve = 100
var heat = 0

onready var sprite = $AnimatedSprite
onready var shoot_timer = $ShootTimer

func _physics_process(delta):
    handle_input(delta)
    apply_gravity(delta)
    apply_sand_friction()
    velocity = move_and_slide(velocity, Vector2.UP)
    update_heat(delta)

func handle_input(delta):
    var dir = Vector2.ZERO
    dir.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = -420
    if Input.is_action_just_pressed("dash") and stamina > 20:
        do_dash(dir)
    if Input.is_action_pressed("shoot"):
        attempt_shoot()

func attempt_shoot():
    if shoot_timer.time_left == 0:
        spawn_glyph(position, aim_direction())
        shoot_timer.start(current_glyph.fire_rate)

func spawn_glyph(pos, dir):
    var glyph = load("res://scenes/Glyph.tscn").instance()
    glyph.setup(current_glyph, dir, owner=self)
    get_parent().add_child(glyph)

func update_heat(delta):
    heat += get_environment_heat_delta() * delta
    if heat > heat_threshold:
        apply_hallucinations()
```

**Spawner / Wave manager pseudocode**

```gdscript
# wave_manager.gd
extends Node

var current_wave = 0
var waves = [] # configured wave tables
onready var spawner = $Spawner

func start_night():
    current_wave = 0
    spawn_next_wave()

func spawn_next_wave():
    var table = waves[current_wave]
    for spawn_def in table:
        spawner.spawn(spawn_def.enemy_type, spawn_def.count, spawn_def.path)
    current_wave += 1
    if current_wave < waves.size():
        yield(get_tree().create_timer(table.duration), "timeout")
        spawn_next_wave()
    else:
        emit_signal("all_waves_spawned")
```

**Vein Node reboot (interaction)**

```gdscript
# vein_node.gd
extends Area2D
var is_active = false

func _on_player_interact(player):
    if not is_active and player.has_enough_resources():
        is_active = true
        play_reboot_sequence() # particle, sound, world-state changes
        emit_signal("vein_rebooted")
```

**Procedural spawn footprint note:** maintain a heatmap of tile scores; the spawner samples high-score tiles for enemies and updates over time as sandflow sim runs.

---

# 13. Sound & Music Direction

* **Music:** modal scales, oud-like plucked motifs blended with electronic pads; leitmotif for Vein Nodes (vocalise choir + glass harmonic).
* **SFX:** neon-ink bullet swishes, tile shuffle clacks, glass shards chime, wind-calligraphy whisper layers.
* **Ambience:** day = wind + distant caravan bells; night = low choir hums + sand shifting.

---

# 14. Progression & Meta Systems

* **Run-based meta:** Unlock permanent modules and cosmetic inks via Memory Echoes.
* **Rogue-lite elements:** Increasing difficulty per run, persistent upgrades between runs.
* **Narrative unlocks:** Memory fragments unlock codex entries and story beats (Tarin's past, Vein origins).

---

# 15. Tools, Assets List & Pipeline

**Art:** Aseprite/Photoshop for pixels and hand-painted assets
**Code:** Godot 4.x (GDScript)
**Audio:** Reaper/FL Studio, field recordings for wind

**Required assets:**

* Player sprite set (idle, run, slide, dash, aim, shoot)
* Glyph projectile sprites & animations
* Enemy sprites & death VFX
* Tile-mosaic tileset with 8 variants + shader masks
* UI icons (glyphs, modules, bars)
* Music stems and SFX packs

---

# 16. Milestones, Scope & Roadmap

**Prototype (4–6 weeks)**

* Core player movement & sand surf
* One glyph type + basic enemies
* One Vein Node with reboot mechanic

**Vertical Slice (8–12 weeks)**

* Day/Night loop implemented
* 3 glyph patterns, 4 enemies, 1 miniboss
* Basic art style implemented + shader tile motion

**Alpha (3–4 months)**

* Additional biomes, full progression tree, audio
* Balance passes

**Beta & Release (3–6 months)**

* Polish, performance, localization
* Marketing assets

---

# 17. QA, Balancing, and Metrics

**Metrics to track:**

* Average survival time per run
* Time spent in each biome
* Most/least used glyphs & modules
* Death causes (environment vs enemies)

**Balancing hooks:** Spawn cap, adaptive wave scaling, module tuning values in external JSON or Godot resource files for live tuning.

---

# 18. Appendices

**Appendix A — Procedural Footprint System (concept)**

* Maintain a grid of values representing how "disturbed" a tile is (player movement, past spawns, wind direction)
* Each minute, apply convolution filter simulating wind-driven sand drift
* Spawner samples tiles where footprint > threshold for dynamic spawns

**Appendix B — Sample Wave Chart (Night 3)**

1. 00:00 — 8 Sand Murmurs (melee swarms)
2. 01:30 — 4 Glassborn Scouts (leapers)
3. 03:00 — Hollow Caravan Scout arrives, spawns 3 Whisperlings
4. 05:00 — Mini Glassborn ambush (2)
5. 07:30 — Boss-ish formation: Storm Choir fragment (mini)

---

# Closing notes

# player.gd
extends CharacterBody2D
# Godot 4.x

@export_category("Movement")
@export var walk_speed: float = 220.0
@export var accel: float = 1500.0
@export var friction: float = 1200.0
@export var jump_velocity: float = 420.0
@export var gravity: float = 1500.0

@export_category("Dash")
@export var dash_speed: float = 520.0
@export var dash_duration: float = 0.18
@export var dash_stamina_cost: float = 20.0

@export_category("Stamina / Resolve")
@export var max_stamina: float = 100.0
@export var stamina_recovery_per_sec: float = 12.0
@export var max_resolve: float = 100.0

@export_category("Heat")
@export var max_heat: float = 100.0
@export var heat_increase_rate: float = 6.0
@export var heat_decrease_rate: float = 8.0

@export_category("Shooting")
@export var glyph_scene: PackedScene
@export var fire_rate: float = 0.16 # seconds
@export var aim_speed: float = 8.0

# state
var velocity: Vector2 = Vector2.ZERO
var wanted_velocity_x: float = 0.0
var is_dashing: bool = false
var stamina: float
var resolve: float
var heat: float

onready var sprite: AnimatedSprite2D = $Sprite
onready var muzzle: Marker2D = $Muzzle
onready var shoot_timer: Timer = $ShootTimer
onready var dash_timer: Timer = $DashTimer
onready var interaction_area: Area2D = $InteractionArea

func _ready():
    stamina = max_stamina
    resolve = max_resolve
    heat = 0.0
    shoot_timer.wait_time = fire_rate
    shoot_timer.one_shot = false
    dash_timer.wait_time = dash_duration
    dash_timer.one_shot = true

func _physics_process(delta):
    handle_gravity(delta)
    handle_input(delta)
    apply_movement(delta)
    update_heat(delta)
    recover_stamina(delta)

func handle_input(delta):
    # Horizontal
    var input_dir = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
    wanted_velocity_x = input_dir * walk_speed

    # Jump
    if Input.is_action_just_pressed("ui_up") and is_on_floor():
        velocity.y = -jump_velocity

    # Dash
    if Input.is_action_just_pressed("dash") and stamina >= dash_stamina_cost and not is_dashing:
        start_dash(input_dir)

    # Shooting (mouse / controller right stick)
    if Input.is_action_pressed("shoot") and not shoot_timer.is_stopped():
        # shoot_timer running means auto; we want controlled fire:
        pass
    if Input.is_action_pressed("shoot") and shoot_timer.is_stopped():
        shoot_timer.start()
        attempt_shoot()
    if Input.is_action_just_released("shoot"):
        shoot_timer.stop()

func start_dash(dir):
    if dir == 0:
        # dash forward based on facing
        dir = (sprite.flip_h ? -1 : 1)
    is_dashing = true
    stamina -= dash_stamina_cost
    velocity.x = dir * dash_speed
    dash_timer.start()
    # play dash animation/sfx
    sprite.play("dash")

func _on_DashTimer_timeout():
    is_dashing = false

func attempt_shoot():
    if shoot_timer.time_left > 0 and not shoot_timer.is_stopped():
        # already firing (guard)
        return
    # immediate spawn then start repeating via timer
    spawn_glyph()
    shoot_timer.start(fire_rate)

func _on_ShootTimer_timeout():
    spawn_glyph()

func spawn_glyph():
    if glyph_scene == null:
        return
    var aim_dir = get_aim_direction()
    if aim_dir == Vector2.ZERO:
        aim_dir = Vector2.RIGHT if not sprite.flip_h else Vector2.LEFT
    var glyph = glyph_scene.instantiate()
    if glyph == null:
        return
    glyph.global_position = muzzle.global_position
    glyph.setup(aim_dir, self)
    get_tree().current_scene.add_child(glyph)

func get_aim_direction() -> Vector2:
    # Mouse-based aim by default
    if Input.get_last_mouse_position() != null:
        var mouse_pos = get_global_mouse_position()
        var dir = (mouse_pos - muzzle.global_position).normalized()
        return dir
    return Vector2.ZERO

func handle_gravity(delta):
    if not is_on_floor():
        velocity.y += gravity * delta
    else:
        # small snap to floor
        if velocity.y > 0:
            velocity.y = 0

func apply_movement(delta):
    if is_dashing:
        # maintain dash velocity, small drag applied
        velocity.x = lerp(velocity.x, 0, 6 * delta)
    else:
        # accelerate toward wanted velocity
        var diff = wanted_velocity_x - velocity.x
        var accel_step = accel * delta
        if abs(diff) <= accel_step:
            velocity.x = wanted_velocity_x
        else:
            velocity.x += sign(diff) * accel_step
        # friction when no input
        if abs(wanted_velocity_x) < 0.01 and is_on_floor():
            velocity.x = move_toward(velocity.x, 0, friction * delta)

    velocity = move_and_slide(velocity, Vector2.UP)

    # sprite flip
    if velocity.x > 5:
        sprite.flip_h = false
    elif velocity.x < -5:
        sprite.flip_h = true

func recover_stamina(delta):
    stamina = clamp(stamina + stamina_recovery_per_sec * delta, 0, max_stamina)

func update_heat(delta):
    # extremely simple environment check: if player y < some threshold => daytime high heat
    # In a real level, replace with environment queries (light level / zone)
    var is_in_sun = true
    if is_in_sun:
        heat = clamp(heat + heat_increase_rate * delta, 0, max_heat)
    else:
        heat = clamp(heat - heat_decrease_rate * delta, 0, max_heat)
    # apply heat effects
    if heat >= max_heat * 0.9:
        apply_heat_hallucination(true)
    else:
        apply_heat_hallucination(false)

func apply_heat_hallucination(enabled: bool) -> void:
    # placeholder: toggle shader param or animation; implement in editor
    # e.g., set_material_param("heat_shimmer", enabled ? 1.0 : 0.0)
    pass

# Interaction callback
func _on_InteractionArea_body_entered(body):
    # used for VeinNode interaction
    pass

# Utility: external call to reduce resolve
func add_resolve(delta_amount: float):
    resolve = clamp(resolve + delta_amount, 0, max_resolve)
    if resolve <= 0:
        on_resolve_depleted()

func on_resolve_depleted():
    # world corruption mechanic placeholder
    print("Resolve depleted -- world corruption should rise")
# glyph.gd
extends Area2D

@export var speed: float = 520.0
@export var lifetime: float = 3.0
@export var damage: int = 10
@export var piercing: bool = false
@export var homing: bool = false
@export var homing_strength: float = 6.0

var direction: Vector2 = Vector2.RIGHT
var owner: Node = null
var life_timer: Timer

onready var collision = $CollisionShape2D

func _ready():
    life_timer = $LifeTimer
    life_timer.wait_time = lifetime
    life_timer.one_shot = true
    life_timer.start()
    life_timer.connect("timeout", Callable(self, "_on_LifeTimer_timeout"))
    connect("area_entered", Callable(self, "_on_area_entered"))

func setup(aim_dir: Vector2, owner_node: Node) -> void:
    direction = aim_dir.normalized()
    owner = owner_node
    rotation = direction.angle()

func _process(delta):
    if homing:
        var target = find_nearest_enemy(300)
        if target:
            var to_target = (target.global_position - global_position).normalized()
            direction = direction.lerp(to_target, homing_strength * delta).normalized()
            rotation = direction.angle()
    global_position += direction * speed * delta

func _on_LifeTimer_timeout():
    queue_free()

func _on_area_entered(area: Area2D):
    # ignore collisions with owner or its children
    if area.get_owner() == owner:
        return
    # try damage
    if area.has_method("apply_damage"):
        area.apply_damage(damage, owner)
        if not piercing:
            spawn_impact_vfx()
            queue_free()
    else:
        # hit environment
        spawn_impact_vfx()
        if not piercing:
            queue_free()

func spawn_impact_vfx():
    # placeholder: play particle or sound
    pass

func find_nearest_enemy(radius: float) -> Node2D:
    var space = get_world_2d().direct_space_state
    # very simple search: iterate group "enemies"
    var best: Node2D = null
    var best_d = radius
    for enemy in get_tree().get_nodes_in_group("enemies"):
        if not (enemy is Node2D): continue
        var d = global_position.distance_to(enemy.global_position)
        if d < best_d:
            best_d = d
            best = enemy
    return best
# sand_murmur.gd
extends CharacterBody2D

@export var speed: float = 90.0
@export var max_health: int = 12
@export var split_on_hit: bool = true
@export var split_count: int = 2
@export var detection_radius: float = 220.0

var health: int
var target: Node2D = null

onready var sprite: AnimatedSprite2D = $Sprite
onready var split_timer: Timer = $SplitCooldownTimer

func _ready():
    health = max_health
    add_to_group("enemies")
    split_timer.one_shot = true
    split_timer.wait_time = 0.25

func _physics_process(delta):
    acquire_target()
    if target:
        var dir = (target.global_position - global_position).normalized()
        velocity = dir * speed
    else:
        # idle wandering
        velocity = Vector2.ZERO
    velocity = move_and_slide(velocity, Vector2.UP)
    # animate
    if velocity.length() > 1:
        sprite.play("run")
    else:
        sprite.play("idle")

func apply_damage(amount: int, source: Node) -> void:
    health -= amount
    if health <= 0:
        die()
    else:
        # if split mechanic: create smaller copies (but cooldown to avoid explosion)
        if split_on_hit and not split_timer.is_stopped():
            # do nothing, split recently happened
            pass
        elif split_on_hit:
            split_timer.start()
            split_into_snippets()

func split_into_snippets():
    # attempt to spawn `split_count` new smaller murmur nodes
    var scene = preload("res://scenes/SandMurmur.tscn")
    for i in range(split_count):
        var inst = scene.instantiate()
        inst.global_position = global_position + Vector2(randf_range(-6, 6), randf_range(-6, 6))
        inst.scale *= 0.8
        inst.max_health = max(4, int(max_health * 0.45))
        get_tree().current_scene.add_child(inst)

func die():
    # death VFX & maybe drop loot
    queue_free()

func acquire_target():
    # naive nearest-player search
    var best: Node2D = null
    var best_d = detection_radius
    for p in get_tree().get_nodes_in_group("players"):
        if not (p is Node2D): continue
        var d = global_position.distance_to(p.global_position)
        if d < best_d:
            best_d = d
            best = p
    target = best

# small helper
func randf_range(a, b):
    return a + randf() * (b - a)
# spawner.gd
extends Node

@export var spawn_points: Array[NodePath] = []
@export var sand_murmur_scene: PackedScene
@export var glassborn_scene: PackedScene

# wave table as an Array of Dictionaries
@export var waves: Array = [
    {"time":0.0, "spawn":[ {"type":"sand", "count":6}, {"type":"glass", "count":0} ] },
    {"time":30.0, "spawn":[ {"type":"sand", "count":8}, {"type":"glass", "count":2} ] },
    {"time":60.0, "spawn":[ {"type":"sand", "count":10}, {"type":"glass", "count":3} ] }
]

onready var wave_timer: Timer = $WaveTimer
var current_wave_index: int = -1

func _ready():
    wave_timer.one_shot = true
    start_waves()

func start_waves():
    current_wave_index = -1
    _advance_wave()

func _advance_wave():
    current_wave_index += 1
    if current_wave_index >= waves.size():
        # all waves spawned
        emit_signal("all_waves_completed")
        return
    var wave = waves[current_wave_index]
    spawn_wave(wave)
    var next_time = 0.0
    if current_wave_index + 1 < waves.size():
        next_time = waves[current_wave_index + 1].get("time", 999) - wave.get("time", 0)
    else:
        next_time = 9999
    wave_timer.start(next_time)
    wave_timer.connect("timeout", Callable(self, "_on_WaveTimer_timeout"), [], CONNECT_ONESHOT)

func _on_WaveTimer_timeout():
    _advance_wave()

func spawn_wave(wave_def: Dictionary) -> void:
    var spawn_list = wave_def.get("spawn", [])
    for entry in spawn_list:
        var typ = entry.get("type", "")
        var count = int(entry.get("count", 0))
        for i in range(count):
            spawn_enemy(typ)

func pick_spawn_point() -> Vector2:
    if spawn_points.empty():
        return Vector2.ZERO
    var idx = randi() % spawn_points.size()
    var node = get_node(spawn_points[idx])
    return node.global_position if node else Vector2.ZERO

func spawn_enemy(typ: String) -> void:
    var pos = pick_spawn_point()
    var inst: Node = null
    if typ == "sand":
        inst = sand_murmur_scene.instantiate()
    elif typ == "glass":
        inst = glassborn_scene.instantiate()
    else:
        return
    inst.global_position = pos + Vector2(randf_range(-8,8), randf_range(-8,8))
    get_tree().current_scene.add_child(inst)

func randf_range(a, b):
    return a + randf() * (b - a)
# vein_node.gd
extends Area2D

@export var reboot_time: float = 3.0
@export var required_fragments: int = 3
@export var is_active: bool = false
@export var activation_radius: float = 48.0

# optional references for VFX / Sound
@export var reboot_effect_scene: PackedScene
@export var active_anim: String = "active"
@export var idle_anim: String = "idle"

onready var anim: AnimatedSprite2D = $AnimatedSprite2D
onready var reboot_timer: Timer = $RebootTimer

func _ready():
    reboot_timer.one_shot = true
    reboot_timer.wait_time = reboot_time
    connect("body_entered", Callable(self, "_on_body_entered"))

func _on_body_entered(body):
    # If a player enters, attempt to start reboot
    if not body.is_in_group("players"):
        return
    if is_active:
        return
    if not player_has_resources(body):
        # optionally show UI hint
        return
    # start reboot
    reboot_timer.start()
    # optional: lock player input, play progress UI
    reboot_timer.connect("timeout", Callable(self, "_on_RebootTimer_timeout"), [], CONNECT_ONESHOT)

func _on_RebootTimer_timeout():
    perform_reboot()

func perform_reboot():
    is_active = true
    # play animation
    if anim:
        anim.play(active_anim)
    # spawn effect
    if reboot_effect_scene:
        var fx = reboot_effect_scene.instantiate()
        fx.global_position = global_position
        get_tree().current_scene.add_child(fx)
    # inform level manager
    emit_signal("vein_rebooted", self)
    # optionally permanently alter environment, reduce corruption, heal nearby players
    heal_nearby_players()

func player_has_resources(player) -> bool:
    # placeholder: check player for required fragments
    if player.has_method("consume_fragments"):
        return player.consume_fragments(required_fragments)
    # no method => assume yes (for early prototyping)
    return true

func heal_nearby_players():
    for p in get_tree().get_nodes_in_group("players"):
        if p.global_position.distance_to(global_position) <= 120:
            if p.has_method("add_resolve"):
                p.add_resolve(12)
# player.gd
extends CharacterBody2D
# Godot 4.x — Player core logic: movement, dash, heat, shooting, interaction

@export_category("Movement")
@export var walk_speed: float = 220.0
@export var accel: float = 2200.0
@export var friction: float = 1800.0
@export var jump_velocity: float = 460.0
@export var gravity: float = 1500.0

@export_category("Dash")
@export var dash_speed: float = 520.0
@export var dash_duration: float = 0.18
@export var dash_stamina_cost: float = 20.0

@export_category("Stamina / Resolve")
@export var max_stamina: float = 100.0
@export var stamina_recovery_per_sec: float = 18.0
@export var max_resolve: float = 100.0

@export_category("Heat")
@export var max_heat: float = 100.0
@export var heat_increase_rate: float = 6.0
@export var heat_decrease_rate: float = 10.0

@export_category("Shooting")
@export var glyph_scene: PackedScene
@export var fire_rate: float = 0.16 # seconds between shots

# runtime state
var velocity: Vector2 = Vector2.ZERO
var stamina: float
var resolve: float
var heat: float
var is_dashing: bool = false
var wanted_velocity_x: float = 0.0

onready var sprite: AnimatedSprite2D = $Sprite
onready var muzzle: Marker2D = $Muzzle
onready var shoot_timer: Timer = $ShootTimer
onready var dash_timer: Timer = $DashTimer
onready var interaction_area: Area2D = $InteractionArea

func _ready():
    stamina = max_stamina
    resolve = max_resolve
    heat = 0.0
    shoot_timer.wait_time = fire_rate
    shoot_timer.one_shot = false
    # connect timers
    if not shoot_timer.is_connected("timeout", Callable(self, "_on_ShootTimer_timeout")):
        shoot_timer.timeout.connect(_on_ShootTimer_timeout)
    if not dash_timer.is_connected("timeout", Callable(self, "_on_DashTimer_timeout")):
        dash_timer.timeout.connect(_on_DashTimer_timeout)
    # add player to players group for enemies to find
    add_to_group("players")
    # connect interaction area
    if not interaction_area.is_connected("body_entered", Callable(self, "_on_InteractionArea_body_entered")):
        interaction_area.body_entered.connect(_on_InteractionArea_body_entered)

func _physics_process(delta):
    handle_gravity(delta)
    handle_input(delta)
    apply_movement(delta)
    update_heat(delta)
    recover_stamina(delta)
    update_animation()

# --- INPUT / ACTIONS ---
func handle_input(delta):
    var left = Input.is_action_pressed("move_left")
    var right = Input.is_action_pressed("move_right")
    var dir = int(right) - int(left)
    wanted_velocity_x = dir * walk_speed

    # Jump
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = -jump_velocity

    # Dash
    if Input.is_action_just_pressed("dash") and stamina >= dash_stamina_cost and not is_dashing:
        start_dash(dir)

    # Shooting
    if Input.is_action_just_pressed("shoot"):
        attempt_shoot()
        if shoot_timer.is_stopped():
            shoot_timer.start()
    elif Input.is_action_just_released("shoot"):
        if not shoot_timer.is_stopped():
            shoot_timer.stop()

    # Interact (manual)
    if Input.is_action_just_pressed("interact"):
        # send a "try_interact" signal to all bodies inside InteractionArea
        for b in interaction_area.get_overlapping_bodies():
            if b and b.has_method("player_try_reboot"):
                b.player_try_reboot(self)

func start_dash(dir):
    var dash_dir = dir
    if dash_dir == 0:
        dash_dir = -1 if sprite.flip_h else 1
    is_dashing = true
    stamina = max(0.0, stamina - dash_stamina_cost)
    velocity.x = dash_dir * dash_speed
    dash_timer.start(dash_duration)
    if sprite.has_animation("dash"):
        sprite.play("dash")

func _on_DashTimer_timeout():
    is_dashing = false

# --- SHOOTING ---
func attempt_shoot():
    if glyph_scene == null:
        return
    spawn_glyph()

func _on_ShootTimer_timeout():
    spawn_glyph()

func spawn_glyph():
    if glyph_scene == null:
        return
    var aim_dir = get_aim_direction()
    if aim_dir == Vector2.ZERO:
        aim_dir = Vector2.RIGHT if not sprite.flip_h else Vector2.LEFT
    var glyph = glyph_scene.instantiate()
    glyph.global_position = muzzle.global_position
    glyph.setup(aim_dir, self)
    get_tree().current_scene.add_child(glyph)

func get_aim_direction() -> Vector2:
    # Mouse aim: prefer mouse if window has focus
    if get_viewport().get_mouse_position() != null:
        var mouse_world = get_global_mouse_position()
        var d = (mouse_world - muzzle.global_position)
        if d.length() > 6:
            return d.normalized()
    # fallback: facing direction
    return Vector2.ZERO

# --- MOVEMENT & PHYSICS ---
func handle_gravity(delta):
    if not is_on_floor():
        velocity.y += gravity * delta
    else:
        if velocity.y > 0:
            velocity.y = 0

func apply_movement(delta):
    if is_dashing:
        # slight drag
        velocity.x = lerp(velocity.x, 0, 6 * delta)
    else:
        # accelerate toward wanted velocity
        var diff = wanted_velocity_x - velocity.x
        var step = accel * delta
        if abs(diff) <= step:
            velocity.x = wanted_velocity_x
        else:
            velocity.x += sign(diff) * step
        # friction
        if abs(wanted_velocity_x) < 0.01 and is_on_floor():
            velocity.x = move_toward(velocity.x, 0, friction * delta)

    velocity = move_and_slide(velocity, Vector2.UP)
    # update facing
    if velocity.x > 6:
        sprite.flip_h = false
    elif velocity.x < -6:
        sprite.flip_h = true

func recover_stamina(delta):
    stamina = clamp(stamina + stamina_recovery_per_sec * delta, 0, max_stamina)

# --- HEAT & EFFECTS ---
func update_heat(delta):
    # Simplified: use Y position as "sun intensity": lower Y = higher heat (example)
    # Replace with environment queries for accurate behavior.
    var in_sun = true
    # If InteractionArea overlaps a node tagged "shade_zone" we'd consider not in sun (not implemented here)
    if in_sun:
        heat = clamp(heat + heat_increase_rate * delta, 0, max_heat)
    else:
        heat = clamp(heat - heat_decrease_rate * delta, 0, max_heat)
    if heat >= max_heat * 0.9:
        # TODO: apply hallucination effect (shader param)
        pass

# --- ANIMATION ---
func update_animation():
    if is_dashing:
        return
    if not is_on_floor():
        if velocity.y < 0:
            sprite.play("jump") if sprite.has_animation("jump") else sprite.play("idle")
        else:
            sprite.play("fall") if sprite.has_animation("fall") else sprite.play("idle")
    elif abs(velocity.x) > 10:
        sprite.play("run") if sprite.has_animation("run") else sprite.play("idle")
    else:
        sprite.play("idle")

# --- RESOLVE (health-like) ---
func add_resolve(amount: float):
    resolve = clamp(resolve + amount, 0, max_resolve)
    if resolve <= 0:
        on_resolve_depleted()

func on_resolve_depleted():
    # placeholder: inform level manager or trigger corruption mode
    print("Resolve depleted — trigger corruption")

# InteractionArea callback (optional)
func _on_InteractionArea_body_entered(body):
    # if the body is a VeinNode, try to interact automatically
    if body and body.has_method("player_try_reboot"):
        body.player_try_reboot(self)
# glyph.gd
extends Area2D
# Generic glyph projectile: supports piercing, homing, basic damage on contact

@export var speed: float = 520.0
@export var lifetime: float = 3.0
@export var damage: int = 12
@export var piercing: bool = false
@export var homing: bool = false
@export var homing_strength: float = 6.0
@export var rotation_speed: float = 0.0 # optional visual rotation

var direction: Vector2 = Vector2.RIGHT
var owner: Node = null
var life_timer: Timer

onready var life_t: Timer = $LifeTimer

func _ready():
    life_t.wait_time = lifetime
    life_t.one_shot = true
    life_t.start()
    if not life_t.is_connected("timeout", Callable(self, "_on_LifeTimer_timeout")):
        life_t.timeout.connect(_on_LifeTimer_timeout)
    connect("area_entered", Callable(self, "_on_area_entered"))

func setup(aim_dir: Vector2, owner_node: Node) -> void:
    direction = aim_dir.normalized() if aim_dir.length() > 0 else Vector2.RIGHT
    owner = owner_node
    rotation = direction.angle()

func _process(delta):
    if homing:
        var target = find_nearest_enemy(400)
        if target:
            var to_target = (target.global_position - global_position).normalized()
            direction = direction.lerp(to_target, homing_strength * delta).normalized()
            rotation = direction.angle()
    global_position += direction * speed * delta
    if rotation_speed != 0:
        rotation += rotation_speed * delta

func _on_LifeTimer_timeout():
    queue_free()

func _on_area_entered(area: Area2D):
    # Ignore collisions with owner and their children
    if owner and (area == owner or area.is_in_group(owner.name)):
        return
    # Damage enemies (they should implement apply_damage(amount, source))
    if area.get_parent() and area.get_parent().has_method("apply_damage"):
        area.get_parent().apply_damage(damage, owner)
        spawn_impact_vfx()
        if not piercing:
            queue_free()
        return
    # If the collided object itself has apply_damage()
    if area.has_method("apply_damage"):
        area.apply_damage(damage, owner)
        spawn_impact_vfx()
        if not piercing:
            queue_free()
        return
    # otherwise, hit environment
    spawn_impact_vfx()
    if not piercing:
        queue_free()

func spawn_impact_vfx():
    # placeholder — add particles / sound spawn
    pass

func find_nearest_enemy(radius: float) -> Node2D:
    var best: Node2D = null
    var best_d = radius
    for enemy in get_tree().get_nodes_in_group("enemies"):
        if not enemy is Node2D:
            continue
        var d = global_position.distance_to(enemy.global_position)
        if d < best_d:
            best_d = d
            best = enemy
    return best
# sand_murmur.gd
extends CharacterBody2D
# Small swarm enemy that chases player and splits when hit by non-piercing glyphs

@export var speed: float = 90.0
@export var max_health: int = 12
@export var split_on_hit: bool = true
@export var split_count: int = 2
@export var detection_radius: float = 220.0
@export var min_scale_on_split: float = 0.6

var health: int
var target: Node2D = null

onready var sprite: AnimatedSprite2D = $Sprite
onready var split_timer: Timer = $SplitCooldownTimer

func _ready():
    health = max_health
    add_to_group("enemies")
    split_timer.one_shot = true
    split_timer.wait_time = 0.25

func _physics_process(delta):
    acquire_target()
    if target:
        var dir = (target.global_position - global_position).normalized()
        velocity = dir * speed
    else:
        velocity = Vector2.ZERO
    velocity = move_and_slide(velocity, Vector2.UP)
    # basic animation switching
    if velocity.length() > 6:
        sprite.play("run") if sprite.has_animation("run") else sprite.play("idle")
    else:
        sprite.play("idle")

func apply_damage(amount: int, source: Node) -> void:
    health -= amount
    # if hit by piercing projectile, we still take damage but splitting might be different
    if health <= 0:
        die()
        return
    # trigger split (but cooldown)
    if split_on_hit and not split_timer.is_stopped():
        return
    if split_on_hit:
        split_timer.start()
        split_into_snippets()

func split_into_snippets():
    var scene_path = "res://SandMurmur.tscn"
    var base_scene: PackedScene = preload(scene_path)
    for i in range(split_count):
        var inst = base_scene.instantiate()
        inst.global_position = global_position + Vector2(randf_range(-8,8), randf_range(-8,8))
        inst.scale = self.scale * min_scale_on_split
        inst.max_health = max(3, int(max_health * 0.45))
        # small nudge so they fly outward
        if inst.has_method("velocity"):
            inst.velocity = Vector2(randf_range(-30,30), randf_range(-10,10))
        get_tree().current_scene.add_child(inst)

func die():
    # add VFX, drop etc.
    queue_free()

func acquire_target():
    var best: Node2D = null
    var best_d = detection_radius
    for p in get_tree().get_nodes_in_group("players"):
        if not p is Node2D:
            continue
        var d = global_position.distance_to(p.global_position)
        if d < best_d:
            best_d = d
            best = p
    target = best

func randf_range(a: float, b: float) -> float:
    return a + randf() * (b - a)
# glassborn.gd
extends CharacterBody2D
# Mid-tier enemy: chases player, performs leap attack, spawns shards on death

@export var speed: float = 100.0
@export var leap_speed: float = 460.0
@export var leap_cooldown: float = 2.0
@export var max_health: int = 40
@export var shard_scene: PackedScene
@export var shard_count_on_death: int = 6
@export var detection_radius: float = 380.0

var health: int
var target: Node2D = null
var can_leap: bool = true

onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
onready var leap_timer: Timer = $LeapCooldown

func _ready():
    health = max_health
    add_to_group("enemies")
    leap_timer.one_shot = true
    leap_timer.wait_time = leap_cooldown
    if not leap_timer.is_connected("timeout", Callable(self, "_on_LeapCooldown_timeout")):
        leap_timer.timeout.connect(_on_LeapCooldown_timeout)

func _physics_process(delta):
    acquire_target()
    if target:
        var dist = global_position.distance_to(target.global_position)
        if dist <= 140 and can_leap:
            do_leap_towards(target.global_position)
        else:
            # chase
            var dir = (target.global_position - global_position).normalized()
            velocity = dir * speed
            velocity = move_and_slide(velocity, Vector2.UP)
    else:
        velocity = Vector2.ZERO

    # animation
    if velocity.length() > 6:
        sprite.play("run") if sprite.has_animation("run") else sprite.play("idle")
    else:
        sprite.play("idle")

func do_leap_towards(dest: Vector2):
    can_leap = false
    var dir = (dest - global_position).normalized()
    # small impulse style leap: we simulate by setting velocity briefly
    velocity = dir * leap_speed
    # perform movement for a single physics frame as jump impulse then let physics continue
    move_and_slide(velocity, Vector2.UP)
    leap_timer.start()

func _on_LeapCooldown_timeout():
    can_leap = true

func apply_damage(amount: int, source: Node) -> void:
    health -= amount
    if health <= 0:
        die()

func die():
    spawn_shards()
    queue_free()

func spawn_shards():
    if shard_scene == null:
        return
    for i in range(shard_count_on_death):
        var s = shard_scene.instantiate()
        s.global_position = global_position + Vector2(randf_range(-8,8), randf_range(-8,8))
        # if shard has init_velocity
        if s.has_method("init_velocity"):
            var v = Vector2(randf_range(-1,1), randf_range(-1,1)).normalized() * randf_range(120,260)
            s.init_velocity(v)
        get_tree().current_scene.add_child(s)

func acquire_target():
    var best: Node2D = null
    var best_d = detection_radius
    for p in get_tree().get_nodes_in_group("players"):
        if not p is Node2D:
            continue
        var d = global_position.distance_to(p.global_position)
        if d < best_d:
            best_d = d
            best = p
    target = best

func randf_range(a: float, b: float) -> float:
    return a + randf() * (b - a)
# vein_node.gd
extends Area2D
# Vein Node: player interaction and reboot logic

@export var reboot_time: float = 3.0
@export var required_fragments: int = 3
@export var is_active: bool = false
@export var reboot_effect_scene: PackedScene

# animation names (optional)
@export var active_anim: String = "active"
@export var idle_anim: String = "idle"
@export var progress_anim: String = "reboot"

onready var anim: AnimatedSprite2D = $AnimatedSprite2D
onready var reboot_timer: Timer = $RebootTimer

func _ready():
    reboot_timer.one_shot = true
    reboot_timer.wait_time = reboot_time
    if not is_connected("body_entered", Callable(self, "_on_body_entered")):
        body_entered.connect(_on_body_entered)
    if anim:
        anim.play(idle_anim) if anim.has_animation(idle_anim) else null

# Called when a body enters (player)
func _on_body_entered(body):
    if is_active:
        return
    if not body.is_in_group("players"):
        return
    # Attempt to auto-reboot if player has resources
    if player_has_resources(body):
        # start reboot progress
        reboot_timer.start()
        if anim and anim.has_animation(progress_anim):
            anim.play(progress_anim)
        # lock player control? optional: call a method on player to disable actions
        # connect timeout
        if not reboot_timer.is_connected("timeout", Callable(self, "_on_RebootTimer_timeout")):
            reboot_timer.timeout.connect(_on_RebootTimer_timeout)

# Alternate manual interaction method (used by player's interact action)
func player_try_reboot(player):
    if is_active:
        return false
    if not player_has_resources(player):
        # optionally show UI hint (insufficient fragments)
        return false
    reboot_timer.start()
    if anim and anim.has_animation(progress_anim):
        anim.play(progress_anim)
    if not reboot_timer.is_connected("timeout", Callable(self, "_on_RebootTimer_timeout")):
        reboot_timer.timeout.connect(_on_RebootTimer_timeout)
    return true

func _on_RebootTimer_timeout():
    perform_reboot()

func perform_reboot():
    is_active = true
    if anim and anim.has_animation(active_anim):
        anim.play(active_anim)
    if reboot_effect_scene:
        var fx = reboot_effect_scene.instantiate()
        fx.global_position = global_position
        get_tree().current_scene.add_child(fx)
    # heal nearby players
    heal_nearby_players()
    # emit a signal if other systems want to know (optional)
    if has_signal("vein_rebooted"):
        emit_signal("vein_rebooted", self)

func player_has_resources(player) -> bool:
    # Expected convention: player has method `consume_fragments(count)` that returns true if consumed
    if player.has_method("consume_fragments"):
        return player.consume_fragments(required_fragments)
    # If no method present on player, assume success for prototyping
    return true

func heal_nearby_players():
    var radius = 120.0
    for p in get_tree().get_nodes_in_group("players"):
        if p is Node2D and p.global_position.distance_to(global_position) <= radius:
            if p.has_method("add_resolve"):
                p.add_resolve(12)
