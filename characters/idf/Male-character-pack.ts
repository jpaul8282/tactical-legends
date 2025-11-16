# Get elite sniper
var top_sniper = get_platinum_character(0)  # David 'Phantom' Goldstein

# Create tactical squad
var squad = create_squad([get_random_platinum(), get_random_silver()])

# Render character in 3D
var character_3d = render_character_3d(top_sniper)

# View pack statistics
demo_character_packs()

# Male IDF Tactical Character Pack System
# GDScript implementation with 3D character rendering

extends Node

class_name MaleTacticalCharacterPacks

# Character rarity enums
enum CharacterRarity {
	SILVER,
	PLATINUM
}

# Character specialization types
enum Specialization {
	SNIPER,
	ASSAULT,
	MEDIC,
	ENGINEER,
	DEMOLITIONS,
	RECONNAISSANCE,
	COMMUNICATIONS,
	ANTI_ARMOR,
	HEAVY_WEAPONS,
	CYBER_WARFARE,
	SPECIAL_FORCES,
	PILOT
}

# Combat experience levels
enum ExperienceLevel {
	VETERAN,
	ELITE,
	LEGENDARY
}

# Base character class
class MaleTacticalCharacter:
	var name: String
	var codename: String
	var specialization: Specialization
	var rarity: CharacterRarity
	var experience_level: ExperienceLevel
	var stats: Dictionary
	var equipment: Array
	var background: String
	var portrait_path: String
	var model_3d_path: String
	var voice_lines: Array
	var signature_move: String
	var service_record: Dictionary
	
	func _init(n: String, c: String, spec: Specialization, r: CharacterRarity):
		name = n
		codename = c
		specialization = spec
		rarity = r
		experience_level = ExperienceLevel.VETERAN
		stats = {
			"health": 100,
			"armor": 50,
			"speed": 70,
			"accuracy": 80,
			"stealth": 60,
			"leadership": 50,
			"strength": 75,
			"endurance": 70
		}
		equipment = []
		voice_lines = []
		service_record = {"missions_completed": 0, "years_service": 0, "decorations": []}

# Character pack arrays
var platinum_pack: Array = []
var silver_pack: Array = []

# 3D Model management
var character_models: Dictionary = {}

# Initialize character packs
func _ready():
	create_platinum_pack()
	create_silver_pack()
	setup_3d_models()
	print("Male Tactical Legend Character Packs Loaded!")
	print("Platinum Pack: ", platinum_pack.size(), " elite operators")
	print("Silver Pack: ", silver_pack.size(), " veteran operators")

# Create Platinum Pack - Elite Tier (Top 25 Male Operators)
func create_platinum_pack():
	var platinum_characters = [
		# Elite Snipers
		{"name": "David 'Phantom' Goldstein", "spec": Specialization.SNIPER, "exp": ExperienceLevel.LEGENDARY, 
		 "stats": {"health": 95, "armor": 45, "speed": 80, "accuracy": 99, "stealth": 98, "leadership": 85, "strength": 80, "endurance": 88}},
		{"name": "Eitan 'Hawkeye' Rosen", "spec": Specialization.SNIPER, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 90, "armor": 40, "speed": 82, "accuracy": 97, "stealth": 95, "leadership": 80, "strength": 75, "endurance": 85}},
		{"name": "Omer 'Silent Death' Cohen", "spec": Specialization.SNIPER, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 88, "armor": 42, "speed": 85, "accuracy": 96, "stealth": 93, "leadership": 78, "strength": 78, "endurance": 82}},
		
		# Elite Assault Specialists
		{"name": "Ariel 'Thunder' Levy", "spec": Specialization.ASSAULT, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 125, "armor": 85, "speed": 88, "accuracy": 92, "stealth": 65, "leadership": 95, "strength": 95, "endurance": 92}},
		{"name": "Yonatan 'Storm' Katz", "spec": Specialization.ASSAULT, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 120, "armor": 80, "speed": 90, "accuracy": 89, "stealth": 60, "leadership": 88, "strength": 92, "endurance": 90}},
		{"name": "Roi 'Blitzkrieg' Shamir", "spec": Specialization.ASSAULT, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 118, "armor": 82, "speed": 92, "accuracy": 87, "stealth": 62, "leadership": 85, "strength": 90, "endurance": 88}},
		
		# Elite Combat Medics
		{"name": "Noam 'Lifeguard' Ben-David", "spec": Specialization.MEDIC, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 100, "armor": 65, "speed": 85, "accuracy": 82, "stealth": 75, "leadership": 98, "strength": 82, "endurance": 95}},
		{"name": "Itai 'Guardian Angel' Klein", "spec": Specialization.MEDIC, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 95, "armor": 60, "speed": 88, "accuracy": 78, "stealth": 72, "leadership": 92, "strength": 80, "endurance": 90}},
		{"name": "Yair 'Phoenix' Goldberg", "spec": Specialization.MEDIC, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 98, "armor": 62, "speed": 82, "accuracy": 80, "stealth": 70, "leadership": 90, "strength": 78, "endurance": 88}},
		
		# Elite Engineers
		{"name": "Amir 'Fortress' Rosenberg", "spec": Specialization.ENGINEER, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 92, "armor": 75, "speed": 70, "accuracy": 85, "stealth": 78, "leadership": 88, "strength": 88, "endurance": 85}},
		{"name": "Dor 'Constructor' Stern", "spec": Specialization.ENGINEER, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 90, "armor": 72, "speed": 72, "accuracy": 82, "stealth": 75, "leadership": 85, "strength": 85, "endurance": 82}},
		{"name": "Gil 'Architect' Weiss", "spec": Specialization.ENGINEER, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 88, "armor": 70, "speed": 68, "accuracy": 88, "stealth": 72, "leadership": 82, "strength": 90, "endurance": 80}},
		
		# Elite Special Forces
		{"name": "Nadav 'Venom' Bar-Lev", "spec": Specialization.SPECIAL_FORCES, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 115, "armor": 75, "speed": 95, "accuracy": 95, "stealth": 92, "leadership": 92, "strength": 90, "endurance": 95}},
		{"name": "Lior 'Shadow Strike' Dahan", "spec": Specialization.SPECIAL_FORCES, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 110, "armor": 70, "speed": 98, "accuracy": 92, "stealth": 90, "leadership": 88, "strength": 88, "endurance": 92}},
		{"name": "Ido 'Night Hunter' Avni", "spec": Specialization.SPECIAL_FORCES, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 108, "armor": 68, "speed": 96, "accuracy": 90, "stealth": 88, "leadership": 85, "strength": 85, "endurance": 90}},
		
		# Elite Demolitions
		{"name": "Asaf 'Destroyer' Yakir", "spec": Specialization.DEMOLITIONS, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 105, "armor": 88, "speed": 72, "accuracy": 90, "stealth": 68, "leadership": 85, "strength": 95, "endurance": 88}},
		{"name": "Omri 'Bombshell' Tzur", "spec": Specialization.DEMOLITIONS, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 108, "armor": 85, "speed": 70, "accuracy": 88, "stealth": 65, "leadership": 82, "strength": 92, "endurance": 85}},
		
		# Elite Reconnaissance
		{"name": "Yuval 'Ghost Walker' Gal", "spec": Specialization.RECONNAISSANCE, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 85, "armor": 50, "speed": 98, "accuracy": 88, "stealth": 99, "leadership": 80, "strength": 80, "endurance": 95}},
		{"name": "Ron 'Invisible' Paz", "spec": Specialization.RECONNAISSANCE, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 82, "armor": 48, "speed": 95, "accuracy": 85, "stealth": 96, "leadership": 78, "strength": 78, "endurance": 90}},
		
		# Elite Communications
		{"name": "Tal 'Network' Ram", "spec": Specialization.COMMUNICATIONS, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 88, "armor": 55, "speed": 80, "accuracy": 82, "stealth": 85, "leadership": 95, "strength": 75, "endurance": 85}},
		{"name": "Udi 'Signal Master' Mor", "spec": Specialization.COMMUNICATIONS, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 85, "armor": 52, "speed": 82, "accuracy": 80, "stealth": 82, "leadership": 92, "strength": 72, "endurance": 82}},
		
		# Elite Anti-Armor
		{"name": "Barak 'Tank Killer' Zohar", "spec": Specialization.ANTI_ARMOR, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 112, "armor": 92, "speed": 62, "accuracy": 94, "stealth": 58, "leadership": 88, "strength": 95, "endurance": 90}},
		{"name": "Chen 'Armor Piercer' Barak", "spec": Specialization.ANTI_ARMOR, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 110, "armor": 90, "speed": 60, "accuracy": 92, "stealth": 55, "leadership": 85, "strength": 92, "endurance": 88}},
		
		# Elite Heavy Weapons
		{"name": "Amit 'Devastation' Gil", "spec": Specialization.HEAVY_WEAPONS, "exp": ExperienceLevel.LEGENDARY,
		 "stats": {"health": 130, "armor": 98, "speed": 52, "accuracy": 90, "stealth": 42, "leadership": 90, "strength": 98, "endurance": 95}},
		
		# Elite Cyber Warfare
		{"name": "Or 'Ghost Protocol' Mizrahi", "spec": Specialization.CYBER_WARFARE, "exp": ExperienceLevel.ELITE,
		 "stats": {"health": 80, "armor": 42, "speed": 88, "accuracy": 78, "stealth": 90, "leadership": 92, "strength": 70, "endurance": 85}}
	]
	
	for i in range(platinum_characters.size()):
		var char_data = platinum_characters[i]
		var character = MaleTacticalCharacter.new(char_data.name, "P-" + str(i+1).pad_zeros(2), char_data.spec, CharacterRarity.PLATINUM)
		character.stats = char_data.stats
		character.experience_level = char_data.exp
		character.model_3d_path = "res://models/platinum/male_" + str(i+1).pad_zeros(2) + ".gltf"
		character.portrait_path = "res://portraits/platinum/male/" + char_data.name.replace(" ", "_").replace("'", "").to_lower() + ".png"
		character.background = generate_background(char_data.spec, CharacterRarity.PLATINUM, char_data.exp)
		character.equipment = generate_equipment(char_data.spec, CharacterRarity.PLATINUM)
		character.voice_lines = generate_voice_lines(char_data.spec, true)
		character.signature_move = generate_signature_move(char_data.spec)
		character.service_record = generate_service_record(char_data.exp)
		platinum_pack.append(character)

# Create Silver Pack - Standard Tier (75 Characters)
func create_silver_pack():
	var male_names = [
		"Aaron", "Benjamin", "Daniel", "Eli", "Felix", "Gabriel", "Haim", "Isaac", "Jacob", "Kobi",
		"Levi", "Michael", "Nathan", "Oscar", "Peter", "Rami", "Samuel", "Tomer", "Uri", "Victor",
		"William", "Xavier", "Yosef", "Zion", "Alex", "Boris", "Chaim", "Doron", "Erez", "Fabian",
		"Guy", "Hanan", "Ilan", "Jonathan", "Kfir", "Leon", "Matan", "Nir", "Ohad", "Pavel",
		"Qadri", "Rafael", "Shai", "Tov", "Uriel", "Vlad", "Waldo", "Yarden", "Zev", "Avraham",
		"Boaz", "Caleb", "Dani", "Eden", "Fadi", "Gideon", "Hillel", "Itamar", "Josiah", "Keren",
		"Liron", "Menachem", "Natan", "Oren", "Paz", "Ran", "Shimon", "Tzvi", "Uzzi", "Vadir",
		"Yair", "Zach", "Alon", "Benny", "Carmi", "David", "Efraim", "Gal", "Hadar", "Idan",
		"Jeremiah", "Kinneret", "Liam", "Moshe", "Noam", "Oded"
	]
	
	var specializations = [
		Specialization.ASSAULT, Specialization.SNIPER, Specialization.MEDIC, Specialization.ENGINEER,
		Specialization.RECONNAISSANCE, Specialization.COMMUNICATIONS, Specialization.DEMOLITIONS,
		Specialization.ANTI_ARMOR, Specialization.HEAVY_WEAPONS, Specialization.CYBER_WARFARE,
		Specialization.SPECIAL_FORCES, Specialization.PILOT
	]
	
	for i in range(75):
		var base_name = male_names[i]
		var spec = specializations[i % specializations.size()]
		var codename = generate_codename(spec)
		var surname = generate_surname()
		var full_name = base_name + " '" + codename + "' " + surname
		
		var character = MaleTacticalCharacter.new(full_name, "S-" + str(i+1).pad_zeros(2), spec, CharacterRarity.SILVER)
		character.stats = generate_silver_stats(spec)
		character.experience_level = ExperienceLevel.VETERAN
		character.model_3d_path = "res://models/silver/male_" + str(i+1).pad_zeros(2) + ".gltf"
		character.portrait_path = "res://portraits/silver/male/" + base_name.to_lower() + "_" + codename.to_lower() + ".png"
		character.background = generate_background(spec, CharacterRarity.SILVER, ExperienceLevel.VETERAN)
		character.equipment = generate_equipment(spec, CharacterRarity.SILVER)
		character.voice_lines = generate_voice_lines(spec, true)
		character.signature_move = generate_signature_move(spec)
		character.service_record = generate_service_record(ExperienceLevel.VETERAN)
		silver_pack.append(character)

# Generate stats for silver characters
func generate_silver_stats(spec: Specialization) -> Dictionary:
	var base_stats = {"health": 90, "armor": 50, "speed": 70, "accuracy": 75, "stealth": 60, "leadership": 65, "strength": 80, "endurance": 75}
	
	match spec:
		Specialization.SNIPER:
			base_stats.accuracy += 12
			base_stats.stealth += 10
			base_stats.speed += 5
		Specialization.ASSAULT:
			base_stats.health += 12
			base_stats.armor += 12
			base_stats.speed += 8
			base_stats.strength += 10
		Specialization.MEDIC:
			base_stats.leadership += 12
			base_stats.stealth += 8
			base_stats.endurance += 10
		Specialization.ENGINEER:
			base_stats.armor += 10
			base_stats.accuracy += 8
			base_stats.strength += 8
		Specialization.DEMOLITIONS:
			base_stats.armor += 15
			base_stats.health += 10
			base_stats.strength += 12
		Specialization.RECONNAISSANCE:
			base_stats.stealth += 15
			base_stats.speed += 12
			base_stats.endurance += 8
		Specialization.COMMUNICATIONS:
			base_stats.leadership += 10
			base_stats.stealth += 8
		Specialization.ANTI_ARMOR:
			base_stats.armor += 18
			base_stats.accuracy += 8
			base_stats.strength += 15
		Specialization.HEAVY_WEAPONS:
			base_stats.health += 18
			base_stats.armor += 20
			base_stats.speed -= 8
			base_stats.strength += 20
		Specialization.CYBER_WARFARE:
			base_stats.stealth += 12
			base_stats.leadership += 8
		Specialization.SPECIAL_FORCES:
			base_stats.speed += 10
			base_stats.stealth += 10
			base_stats.accuracy += 8
			base_stats.leadership += 8
		Specialization.PILOT:
			base_stats.speed += 15
			base_stats.accuracy += 10
			base_stats.leadership += 8
	
	return base_stats

# Generate detailed backgrounds
func generate_background(spec: Specialization, rarity: CharacterRarity, exp_level: ExperienceLevel) -> String:
	var tier = "Elite" if rarity == CharacterRarity.PLATINUM else "Veteran"
	var exp_desc = ""
	
	match exp_level:
		ExperienceLevel.VETERAN:
			exp_desc = "Experienced operator with multiple successful deployments."
		ExperienceLevel.ELITE:
			exp_desc = "Elite-tier operator with distinguished service record."
		ExperienceLevel.LEGENDARY:
			exp_desc = "Legendary warrior with unmatched combat expertise."
	
	var base_desc = ""
	match spec:
		Specialization.SNIPER:
			base_desc = tier + " precision marksman specializing in long-range elimination."
		Specialization.ASSAULT:
			base_desc = tier + " front-line combatant excelling in direct engagement scenarios."
		Specialization.MEDIC:
			base_desc = tier + " combat medic with advanced battlefield trauma expertise."
		Specialization.ENGINEER:
			base_desc = tier + " combat engineer skilled in fortification and demolition."
		Specialization.DEMOLITIONS:
			base_desc = tier + " explosives specialist trained in urban and rural operations."
		Specialization.RECONNAISSANCE:
			base_desc = tier + " scout with exceptional stealth and intelligence capabilities."
		Specialization.COMMUNICATIONS:
			base_desc = tier + " communications expert maintaining critical battlefield networks."
		Specialization.ANTI_ARMOR:
			base_desc = tier + " anti-vehicle specialist with heavy weapons expertise."
		Specialization.HEAVY_WEAPONS:
			base_desc = tier + " heavy weapons operator providing suppressive fire support."
		Specialization.CYBER_WARFARE:
			base_desc = tier + " cyber operations specialist with electronic warfare training."
		Specialization.SPECIAL_FORCES:
			base_desc = tier + " special forces operator with multi-domain expertise."
		Specialization.PILOT:
			base_desc = tier + " combat pilot with air-to-ground and air-to-air experience."
	
	return base_desc + " " + exp_desc

# Generate signature moves
func generate_signature_move(spec: Specialization) -> String:
	match spec:
		Specialization.SNIPER:
			return "Precision Strike - Guaranteed critical hit on next shot"
		Specialization.ASSAULT:
			return "Berserker Rush - Increased damage and speed for 10 seconds"
		Specialization.MEDIC:
			return "Emergency Revival - Instantly revive and heal nearby allies"
		Specialization.ENGINEER:
			return "Rapid Fortification - Deploy instant cover and barriers"
		Specialization.DEMOLITIONS:
			return "Controlled Demolition - Massive area damage with precision"
		Specialization.RECONNAISSANCE:
			return "Shadow Step - Temporary invisibility and movement boost"
		Specialization.COMMUNICATIONS:
			return "Tactical Override - Coordinate team abilities for massive effect"
		Specialization.ANTI_ARMOR:
			return "Armor Buster - Penetrating shot that ignores all armor"
		Specialization.HEAVY_WEAPONS:
			return "Suppression Fire - Area denial with sustained heavy fire"
		Specialization.CYBER_WARFARE:
			return "System Hack - Disable enemy equipment and abilities"
		Specialization.SPECIAL_FORCES:
			return "Adapt & Overcome - Copy and enhance nearby ally abilities"
		Specialization.PILOT:
			return "Air Strike - Call in precision aerial bombardment"
	
	return "Tactical Expertise"

# Generate service records
func generate_service_record(exp_level: ExperienceLevel) -> Dictionary:
	match exp_level:
		ExperienceLevel.VETERAN:
			return {
				"missions_completed": randi_range(50, 100),
				"years_service": randi_range(5, 10),
				"decorations": ["Service Medal", "Combat Badge"]
			}
		ExperienceLevel.ELITE:
			return {
				"missions_completed": randi_range(100, 200),
				"years_service": randi_range(10, 15),
				"decorations": ["Distinguished Service Cross", "Combat Excellence Award", "Leadership Medal"]
			}
		ExperienceLevel.LEGENDARY:
			return {
				"missions_completed": randi_range(200, 500),
				"years_service": randi_range(15, 25),
				"decorations": ["Medal of Valor", "Legion of Merit", "Combat Hero Award", "Distinguished Service Medal"]
			}
	
	return {"missions_completed": 0, "years_service": 0, "decorations": []}

# Enhanced equipment generation
func generate_equipment(spec: Specialization, rarity: CharacterRarity) -> Array:
	var tier_prefix = "Elite " if rarity == CharacterRarity.PLATINUM else "Standard "
	
	match spec:
		Specialization.SNIPER:
			return [tier_prefix + "Sniper Rifle", "Advanced Scope", "Ghillie Suit", "Ballistic Calculator", "Suppressor"]
		Specialization.ASSAULT:
			return [tier_prefix + "Assault Rifle", "Combat Armor", "Tactical Vest", "Grenades", "Combat Knife"]
		Specialization.MEDIC:
			return [tier_prefix + "Medical Kit", "Trauma Pack", "Defensive Rifle", "Defibrillator", "Morphine"]
		Specialization.ENGINEER:
			return [tier_prefix + "Tool Kit", "Explosives", "Detection Gear", "Welding Kit", "Barrier Kit"]
		Specialization.DEMOLITIONS:
			return [tier_prefix + "Explosive Pack", "Detonator", "Blast Shield", "Breaching Kit", "Mine Detector"]
		Specialization.RECONNAISSANCE:
			return [tier_prefix + "Surveillance Kit", "Stealth Gear", "Compact Rifle", "Night Vision", "Drone"]
		Specialization.COMMUNICATIONS:
			return [tier_prefix + "Radio Array", "Encryption Device", "Signal Booster", "Satellite Link", "Jamming Kit"]
		Specialization.ANTI_ARMOR:
			return [tier_prefix + "Anti-Tank Launcher", "Targeting System", "Heavy Ammo", "Blast Protection", "Rangefinder"]
		Specialization.HEAVY_WEAPONS:
			return [tier_prefix + "Heavy Machine Gun", "Ammo Belt", "Bipod Mount", "Cooling System", "Armor Piercing Rounds"]
		Specialization.CYBER_WARFARE:
			return [tier_prefix + "Laptop Array", "Signal Jammer", "Hacking Tools", "Encrypted Comms", "Data Storage"]
		Specialization.SPECIAL_FORCES:
			return [tier_prefix + "Modular Rifle", "Multi-tool", "Tactical Gear", "Climbing Kit", "Survival Pack"]
		Specialization.PILOT:
			return [tier_prefix + "Flight Suit", "Helmet System", "Navigation Tools", "Emergency Kit", "Sidearm"]
	
	return ["Basic Equipment"]

# Enhanced voice lines with male variants
func generate_voice_lines(spec: Specialization, is_male: bool = true) -> Array:
	var prefix = "Sir, " if is_male else ""
	
	match spec:
		Specialization.SNIPER:
			return [prefix + "Target in sight", "Taking the shot", "Clean kill", "Repositioning"]
		Specialization.ASSAULT:
			return [prefix + "Moving in hot", "Contact front", "Breaching now", "Area secured"]
		Specialization.MEDIC:
			return [prefix + "Medic up", "Hold still soldier", "You're gonna make it", "Medical assistance needed"]
		Specialization.ENGINEER:
			return [prefix + "Charges placed", "Fortifications ready", "Path cleared", "Engineering complete"]
		Specialization.DEMOLITIONS:
			return [prefix + "Fire in the hole", "Boom time", "Obstacle removed", "Explosives armed"]
		Specialization.RECONNAISSANCE:
			return [prefix + "Eyes on target", "Going dark", "Intel acquired", "Position compromised"]
		Specialization.COMMUNICATIONS:
			return [prefix + "Comms online", "Signal established", "Message received", "Network secure"]
		Specialization.ANTI_ARMOR:
			return [prefix + "Armor spotted", "Missile away", "Vehicle down", "Target eliminated"]
		Specialization.HEAVY_WEAPONS:
			return [prefix + "Heavy weapons online", "Laying down fire", "Suppressing targets", "Cover me"]
		Specialization.CYBER_WARFARE:
			return [prefix + "System breached", "Network down", "Digital infiltration complete", "Hacking in progress"]
		Specialization.SPECIAL_FORCES:
			return [prefix + "Going tactical", "Mission critical", "Adapting to situation", "Special ops active"]
		Specialization.PILOT:
			return [prefix + "Air support inbound", "Flight path confirmed", "Weapons hot", "Ready for extraction"]
	
	return [prefix + "Ready for orders"]

# 3D Model setup and management
func setup_3d_models():
	# Initialize 3D model references for character rendering
	character_models = {
		"platinum_male_models": [],
		"silver_male_models": []
	}
	
	# Setup would typically load actual 3D models here
	print("3D Character models initialized")

# Render 3D character preview
func render_character_3d(character: MaleTacticalCharacter) -> Node3D:
	var scene_3d = preload("res://scenes/Character3DViewer.tscn").instantiate()
	
	# Load character model
	if FileAccess.file_exists(character.model_3d_path):
		var model = load(character.model_3d_path)
		scene_3d.add_child(model.instantiate())
	
	# Apply character customizations based on specialization
	customize_3d_model(scene_3d, character)
	
	return scene_3d

# Customize 3D model based on character data
func customize_3d_model(model_node: Node3D, character: MaleTacticalCharacter):
	# Apply specialization-specific equipment and appearance
	var equipment_nodes = model_node.find_children("Equipment*")
	
	for equipment in character.equipment:
		# Enable appropriate equipment models
		var equipment_node_name = "Equipment_" + equipment.replace(" ", "_")
		var equipment_node = model_node.find_child(equipment_node_name)
		if equipment_node:
			equipment_node.visible = true
	
	# Apply rarity-specific materials/textures
	if character.rarity == CharacterRarity.PLATINUM:
		apply_platinum_materials(model_node)
	else:
		apply_silver_materials(model_node)

func apply_platinum_materials(model_node: Node3D):
	# Apply high-quality platinum tier materials
	var mesh_instances = model_node.find_children("", "MeshInstance3D")
	for mesh in mesh_instances:
		if mesh.material_override:
			mesh.material_override.albedo_color = Color(0.9, 0.9, 1.0)  # Platinum tint
			mesh.material_override.metallic = 0.8
			mesh.material_override.roughness = 0.2

func apply_silver_materials(model_node: Node3D):
	# Apply standard silver tier materials
	var mesh_instances = model_node.find_children("", "MeshInstance3D")
	for mesh in mesh_instances:
		if mesh.material_override:
			mesh.material_override.albedo_color = Color(0.8, 0.8, 0.9)  # Silver tint
			mesh.material_override.metallic = 0.6
			mesh.material_override.roughness = 0.4

# Utility functions
func generate_codename(spec: Specialization) -> String:
	var codenames = {
		Specialization.SNIPER: ["Viper", "Falcon", "Phantom", "Razor", "Scope", "Eagle", "Hunter", "Crosshair"],
		Specialization.ASSAULT: ["Tempest", "Fury", "Blaze", "Impact", "Charge", "Storm", "Thunder", "Lightning"],
		Specialization.MEDIC: ["Guardian", "Lifeline", "Pulse", "Phoenix", "Angel", "Shield", "Savior", "Healer"],
		Specialization.ENGINEER: ["Forge", "Builder", "Steel", "Wire", "Frame", "Constructor", "Architect", "Wrench"],
		Specialization.DEMOLITIONS: ["Spark", "Fuse", "Boom", "Blast", "Dynamite", "TNT", "Destroyer", "Kaboom"],
		Specialization.RECONNAISSANCE: ["Ghost", "Shadow", "Scout", "Prowler", "Seeker", "Tracker", "Stalker", "Hunter"],
		Specialization.COMMUNICATIONS: ["Signal", "Link", "Wave", "Network", "Relay", "Echo", "Frequency", "Channel"],
		Specialization.ANTI_ARMOR: ["Piercer", "Breacher", "Crusher", "Smasher", "Tank Killer", "Penetrator", "Destroyer", "Buster"],
		Specialization.HEAVY_WEAPONS: ["Thunder", "Storm", "Hammer", "Titan", "Crusher", "Devastator", "Bulldozer", "Juggernaut"],
		Specialization.CYBER_WARFARE: ["Byte", "Code", "Virus", "Matrix", "Hacker", "Digital", "Cipher", "Protocol"],
		Specialization.SPECIAL_FORCES: ["Venom", "Strike", "Elite", "Alpha", "Delta", "Omega", "Prime", "Apex"],
		Specialization.PILOT: ["Ace", "Sky", "Wing", "Jet", "Falcon", "Eagle", "Hawk", "Phoenix"]
	}
	
	var options = codenames.get(spec, ["Operator"])
	return options[randi() % options.size()]

func generate_surname() -> String:
	var surnames = [
		"Cohen", "Levy", "Miller", "Roth", "Goldberg", "Klein", "Stern", "Weiss", "Rosenberg", "Katz",
		"Ben-David", "Shamir", "Yakir", "Tzur", "Dahan", "Avni", "Gal", "Paz", "Ram", "Mor", "Zohar",
		"Barak", "Gil", "Ashkenazi", "Mizrahi", "Peretz", "Biton", "Malka", "Shalom", "Azoulay",
		"Shapiro", "Friedman", "Hoffman", "Goldman", "Silverman", "Kaplan", "Rubin", "Weinstein",
		"Berger", "Fischer", "Schwartz", "Stein", "Wolf", "Green", "Brown", "Davis", "Wilson",
		"Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez"
	]
	return surnames[randi() % surnames.size()]

# Character pack management functions
func get_platinum_character(index: int) -> MaleTacticalCharacter:
	if index >= 0 and index < platinum_pack.size():
		return platinum_pack[index]
	return null

func get_silver_character(index: int) -> MaleTacticalCharacter:
	if index >= 0 and index < silver_pack.size():
		return silver_pack[index]
	return null

func get_random_platinum() -> MaleTacticalCharacter:
	return platinum_pack[randi() % platinum_pack.size()]

func get_random_silver() -> MaleTacticalCharacter:
	return silver_pack[randi() % silver_pack.size()]

func get_characters_by_specialization(spec: Specialization, rarity: CharacterRarity = CharacterRarity.SILVER) -> Array:
	var filtered_characters = []
	var source_pack = silver_pack if rarity == CharacterRarity.SILVER else platinum_pack
	
	for character in source_pack:
		if character.specialization == spec:
			filtered_characters.append(character)
	
	return filtered_characters

func get_top_performers_by_stat(stat_name: String, count: int = 10) -> Array:
	var all_characters = platinum_pack + silver_pack
	all_characters.sort_custom(func(a, b): return a.stats.get(stat_name, 0) > b.stats.get(stat_name, 0))
	return all_characters.slice(0, min(count, all_characters.size()))

# Character comparison and analytics
func compare_characters(char1: MaleTacticalCharacter, char2: MaleTacticalCharacter) -> Dictionary:
	var comparison = {}
	
	for stat in char1.stats.keys():
		var diff = char1.stats[stat] - char2.stats[stat]
		comparison[stat] = {
			"char1_value": char1.stats[stat],
			"char2_value": char2.stats[stat],
			"difference": diff,
			"winner": char1.name if diff > 0 else char2.name if diff < 0 else "Tie"
		}
	
	return comparison

func get_pack_statistics() -> Dictionary:
	var stats = {
		"total_characters": platinum_pack.size() + silver_pack.size(),
		"platinum_count": platinum_pack.size(),
		"silver_count": silver_pack.size(),
		"specialization_distribution": {},
		"experience_distribution": {},
		"average_stats": {}
	}
	
	# Count specializations
	for character in (platinum_pack + silver_pack):
		var spec_name = Specialization.keys()[character.specialization]
		stats.specialization_distribution[spec_name] = stats.specialization_distribution.get(spec_name, 0) + 1
		
		var exp_name = ExperienceLevel.keys()[character.experience_level]
		stats.experience_distribution[exp_name] = stats.experience_distribution.get(exp_name, 0) + 1
	
	# Calculate average stats
	var stat_totals = {}
	var total_chars = platinum_pack.size() + silver_pack.size()
	
	for character in (platinum_pack + silver_pack):
		for stat_name in character.stats.keys():
			stat_totals[stat_name] = stat_totals.get(stat_name, 0) + character.stats[stat_name]
	
	for stat_name in stat_totals.keys():
		stats.average_stats[stat_name] = stat_totals[stat_name] / total_chars
	
	return stats

# Print character details with enhanced formatting
func print_character_info(character: MaleTacticalCharacter):
	print("╔═══ TACTICAL OPERATOR PROFILE ═══╗")
	print("║ Name: ", character.name)
	print("║ Codename: ", character.codename)
	print("║ Specialization: ", Specialization.keys()[character.specialization])
	print("║ Rarity: ", CharacterRarity.keys()[character.rarity])
	print("║ Experience: ", ExperienceLevel.keys()[character.experience_level])
	print("║")
	print("║ === COMBAT STATS ===")
	for stat in character.stats.keys():
		print("║ ", stat.capitalize(), ": ", character.stats[stat])
	print("║")
	print("║ === SERVICE RECORD ===")
	print("║ Missions: ", character.service_record.missions_completed)
	print("║ Years Service: ", character.service_record.years_service)
	print("║ Decorations: ", character.service_record.decorations)
	print("║")
	print("║ Signature Move: ", character.signature_move)
	print("║ 3D Model: ", character.model_3d_path)
	print("║ Background: ", character.background)
	print("╚════════════════════════════════════╝")

# Mission deployment system
func create_squad(characters: Array) -> Dictionary:
	if characters.size() > 6:
		print("Warning: Squad size limited to 6 members")
		characters = characters.slice(0, 6)
	
	var squad = {
		"members": characters,
		"total_strength": 0,
		"specialization_coverage": [],
		"average_experience": 0,
		"squad_synergy": 0
	}
	
	var total_stats = {}
	var experience_points = 0
	
	for character in characters:
		# Add specialization to coverage
		var spec_name = Specialization.keys()[character.specialization]
		if not spec_name in squad.specialization_coverage:
			squad.specialization_coverage.append(spec_name)
		
		# Calculate total stats
		for stat in character.stats.keys():
			total_stats[stat] = total_stats.get(stat, 0) + character.stats[stat]
		
		# Add experience points
		match character.experience_level:
			ExperienceLevel.VETERAN:
				experience_points += 1
			ExperienceLevel.ELITE:
				experience_points += 2
			ExperienceLevel.LEGENDARY:
				experience_points += 3
	
	squad.total_strength = total_stats.get("health", 0) + total_stats.get("armor", 0) + total_stats.get("accuracy", 0)
	squad.average_experience = experience_points / float(characters.size())
	squad.squad_synergy = squad.specialization_coverage.size() * 10  # Bonus for diverse specializations
	
	return squad

# Enhanced demo function
func demo_character_packs():
	print("\n╔═══ MALE TACTICAL CHARACTER PACKS DEMO ═══╗")
	print("║")
	print("║ === PLATINUM PACK (Elite Operators) ===")
	for i in range(min(3, platinum_pack.size())):
		print_character_info(platinum_pack[i])
	
	print("║")
	print("║ === SILVER PACK (Veteran Operators) ===")
	for i in range(min(3, silver_pack.size())):
		print_character_info(silver_pack[i])
	
	print("║")
	print("║ === PACK STATISTICS ===")
	var stats = get_pack_statistics()
	print("║ Total Characters: ", stats.total_characters)
	print("║ Platinum: ", stats.platinum_count, " | Silver: ", stats.silver_count)
	print("║")
	print("║ Specialization Distribution:")
	for spec in stats.specialization_distribution.keys():
		print("║   ", spec, ": ", stats.specialization_distribution[spec])
	print("║")
	print("║ === SAMPLE SQUAD CREATION ===")
	var sample_squad = create_squad([get_random_platinum(), get_random_silver(), get_random_platinum()])
	print("║ Squad Strength: ", sample_squad.total_strength)
	print("║ Specializations: ", sample_squad.specialization_coverage)
	print("║ Average Experience: ", sample_squad.average_experience)
	print("║ Squad Synergy: ", sample_squad.squad_synergy)
	print("╚═══════════════════════════════════════════════╝")

# Character unlock and progression system
func unlock_character(character: MaleTacticalCharacter, player_level: int) -> bool:
	var required_level = 1
	
	if character.rarity == CharacterRarity.PLATINUM:
		required_level = 20
		if character.experience_level == ExperienceLevel.LEGENDARY:
			required_level = 50
	
	return player_level >= required_level

func upgrade_character(character: MaleTacticalCharacter, stat_name: String, points: int):
	if character.stats.has(stat_name):
		var max_stat = 100 if character.rarity == CharacterRarity.SILVER else 120
		character.stats[stat_name] = min(character.stats[stat_name] + points, max_stat)
		print("Upgraded ", character.name, "'s ", stat_name, " by ", points, " points")

# Save/Load system for character data
func save_character_data(filename: String = "character_packs.save"):
	var save_file = FileAccess.open("user://" + filename, FileAccess.WRITE)
	if save_file:
		var save_data = {
			"platinum_pack": serialize_characters(platinum_pack),
			"silver_pack": serialize_characters(silver_pack),
			"version": "1.0"
		}
		save_file.store_string(JSON.stringify(save_data))
		save_file.close()
		print("Character packs saved successfully")

func serialize_characters(characters: Array) -> Array:
	var serialized = []
	for character in characters:
		serialized.append({
			"name": character.name,
			"codename": character.codename,
			"specialization": character.specialization,
			"rarity": character.rarity,
			"experience_level": character.experience_level,
			"stats": character.stats,
			"service_record": character.service_record
		})
	return serialized
