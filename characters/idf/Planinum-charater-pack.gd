# Get a specific platinum character
var elite_sniper = get_platinum_character(0)

# Get random characters
var random_platinum = get_random_platinum()
var random_silver = get_random_silver()

# Demo the packs
demo_character_packs()

# Tactical Legend Character Pack System
# GDScript implementation for character management

extends Node

class_name TacticalCharacterPacks

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
	CYBER_WARFARE
}

# Base character class
class TacticalCharacter:
	var name: String
	var codename: String
	var specialization: Specialization
	var rarity: CharacterRarity
	var stats: Dictionary
	var equipment: Array
	var background: String
	var portrait_path: String
	var voice_lines: Array
	
	func _init(n: String, c: String, spec: Specialization, r: CharacterRarity):
		name = n
		codename = c
		specialization = spec
		rarity = r
		stats = {
			"health": 100,
			"armor": 50,
			"speed": 70,
			"accuracy": 80,
			"stealth": 60,
			"leadership": 50
		}
		equipment = []
		voice_lines = []

# Platinum Character Pack (Top 25 Elite Characters)
var platinum_pack: Array = []

# Silver Character Pack (Next 75 Characters)
var silver_pack: Array = []

# Initialize character packs
func _ready():
	create_platinum_pack()
	create_silver_pack()
	print("Tactical Legend Character Packs Loaded!")
	print("Platinum Pack: ", platinum_pack.size(), " characters")
	print("Silver Pack: ", silver_pack.size(), " characters")

# Create Platinum Pack - Elite Tier Characters
func create_platinum_pack():
	# Top 25 Elite Female Tactical Operators
	var platinum_characters = [
		# Snipers
		{"name": "Maya 'Ghost' Cohen", "spec": Specialization.SNIPER, "stats": {"health": 90, "armor": 40, "speed": 75, "accuracy": 98, "stealth": 95, "leadership": 80}},
		{"name": "Noa 'Silence' Roth", "spec": Specialization.SNIPER, "stats": {"health": 85, "armor": 35, "speed": 80, "accuracy": 96, "stealth": 92, "leadership": 75}},
		{"name": "Shira 'Eagle Eye' Bar", "spec": Specialization.SNIPER, "stats": {"health": 88, "armor": 38, "speed": 77, "accuracy": 97, "stealth": 90, "leadership": 78}},
		
		# Assault Specialists
		{"name": "Tal 'Storm' Levi", "spec": Specialization.ASSAULT, "stats": {"health": 120, "armor": 80, "speed": 85, "accuracy": 90, "stealth": 60, "leadership": 88}},
		{"name": "Yael 'Thunder' Katz", "spec": Specialization.ASSAULT, "stats": {"health": 115, "armor": 75, "speed": 88, "accuracy": 87, "stealth": 55, "leadership": 85}},
		{"name": "Adi 'Blitz' Shamir", "spec": Specialization.ASSAULT, "stats": {"health": 118, "armor": 78, "speed": 90, "accuracy": 89, "stealth": 58, "leadership": 90}},
		
		# Combat Medics
		{"name": "Liora 'Angel' Goldberg", "spec": Specialization.MEDIC, "stats": {"health": 95, "armor": 60, "speed": 82, "accuracy": 78, "stealth": 70, "leadership": 95}},
		{"name": "Michal 'Lifeline' Ben-David", "spec": Specialization.MEDIC, "stats": {"health": 92, "armor": 55, "speed": 85, "accuracy": 75, "stealth": 68, "leadership": 92}},
		{"name": "Hadar 'Phoenix' Klein", "spec": Specialization.MEDIC, "stats": {"health": 98, "armor": 58, "speed": 80, "accuracy": 80, "stealth": 72, "leadership": 88}},
		
		# Engineers
		{"name": "Gal 'Tech' Rosenberg", "spec": Specialization.ENGINEER, "stats": {"health": 85, "armor": 70, "speed": 65, "accuracy": 82, "stealth": 75, "leadership": 85}},
		{"name": "Roni 'Builder' Stern", "spec": Specialization.ENGINEER, "stats": {"health": 88, "armor": 68, "speed": 68, "accuracy": 80, "stealth": 78, "leadership": 82}},
		{"name": "Dana 'Fortress' Weiss", "spec": Specialization.ENGINEER, "stats": {"health": 90, "armor": 75, "speed": 62, "accuracy": 85, "stealth": 72, "leadership": 88}},
		
		# Demolitions Experts
		{"name": "Inbar 'Boom' Yakir", "spec": Specialization.DEMOLITIONS, "stats": {"health": 100, "armor": 85, "speed": 70, "accuracy": 88, "stealth": 65, "leadership": 80}},
		{"name": "Keren 'Blast' Tzur", "spec": Specialization.DEMOLITIONS, "stats": {"health": 105, "armor": 82, "speed": 68, "accuracy": 90, "stealth": 62, "leadership": 78}},
		
		# Reconnaissance
		{"name": "Hila 'Scout' Dahan", "spec": Specialization.RECONNAISSANCE, "stats": {"health": 80, "armor": 45, "speed": 95, "accuracy": 85, "stealth": 98, "leadership": 75}},
		{"name": "Rotem 'Shadow' Avni", "spec": Specialization.RECONNAISSANCE, "stats": {"health": 78, "armor": 40, "speed": 98, "accuracy": 82, "stealth": 96, "leadership": 72}},
		{"name": "Neta 'Whisper' Gal", "spec": Specialization.RECONNAISSANCE, "stats": {"health": 82, "armor": 42, "speed": 92, "accuracy": 88, "stealth": 94, "leadership": 78}},
		
		# Communications
		{"name": "Orna 'Signal' Paz", "spec": Specialization.COMMUNICATIONS, "stats": {"health": 85, "armor": 50, "speed": 75, "accuracy": 80, "stealth": 80, "leadership": 95}},
		{"name": "Sivan 'Network' Ram", "spec": Specialization.COMMUNICATIONS, "stats": {"health": 82, "armor": 48, "speed": 78, "accuracy": 78, "stealth": 82, "leadership": 92}},
		
		# Anti-Armor
		{"name": "Merav 'Tank Buster' Mor", "spec": Specialization.ANTI_ARMOR, "stats": {"health": 110, "armor": 90, "speed": 60, "accuracy": 92, "stealth": 55, "leadership": 85}},
		{"name": "Efrat 'Piercer' Zohar", "spec": Specialization.ANTI_ARMOR, "stats": {"health": 108, "armor": 88, "speed": 58, "accuracy": 90, "stealth": 52, "leadership": 82}},
		
		# Heavy Weapons
		{"name": "Vered 'Crusher' Barak", "spec": Specialization.HEAVY_WEAPONS, "stats": {"health": 125, "armor": 95, "speed": 50, "accuracy": 88, "stealth": 40, "leadership": 88}},
		{"name": "Tamar 'Devastator' Gil", "spec": Specialization.HEAVY_WEAPONS, "stats": {"health": 128, "armor": 92, "speed": 48, "accuracy": 85, "stealth": 38, "leadership": 85}},
		
		# Cyber Warfare
		{"name": "Noy 'Hacker' Ashkenazi", "spec": Specialization.CYBER_WARFARE, "stats": {"health": 75, "armor": 35, "speed": 85, "accuracy": 75, "stealth": 88, "leadership": 90}},
		{"name": "Stav 'Digital' Mizrahi", "spec": Specialization.CYBER_WARFARE, "stats": {"health": 78, "armor": 38, "speed": 88, "accuracy": 78, "stealth": 85, "leadership": 88}}
	]
	
	for i in range(platinum_characters.size()):
		var char_data = platinum_characters[i]
		var character = TacticalCharacter.new(char_data.name, "P-" + str(i+1).pad_zeros(2), char_data.spec, CharacterRarity.PLATINUM)
		character.stats = char_data.stats
		character.portrait_path = "res://portraits/platinum/" + char_data.name.replace(" ", "_").replace("'", "").to_lower() + ".png"
		character.background = generate_background(char_data.spec, CharacterRarity.PLATINUM)
		character.equipment = generate_equipment(char_data.spec, CharacterRarity.PLATINUM)
		character.voice_lines = generate_voice_lines(char_data.spec)
		platinum_pack.append(character)

# Create Silver Pack - Standard Tier Characters
func create_silver_pack():
	# Generate 75 Silver tier characters
	var silver_names = [
		"Anat", "Bat-Sheva", "Carmit", "Dafna", "Einav", "Faye", "Gila", "Hadas", "Irit", "Judith",
		"Kinneret", "Leah", "Miri", "Nurit", "Orit", "Pnina", "Rina", "Sigal", "Tova", "Uri",
		"Varda", "Warda", "Ximena", "Yaffa", "Ziva", "Abigail", "Bracha", "Chana", "Devora", "Esther",
		"Freida", "Golda", "Hadassa", "Ilana", "Jael", "Keren", "Liat", "Maayan", "Naama", "Ofira",
		"Penina", "Rachel", "Shoshana", "Talia", "Urit", "Vardina", "Yara", "Zehava", "Amit", "Bina",
		"Chen", "Dina", "Elinor", "Fira", "Galia", "Haya", "Iona", "Jasmine", "Kira", "Lior",
		"Maya", "Nava", "Orna", "Pazit", "Ronit", "Shira", "Tikva", "Uriel", "Vered", "Yael",
		"Zara", "Aviva", "Batya", "Celia", "Dalia"
	]
	
	var specializations = [
		Specialization.ASSAULT, Specialization.SNIPER, Specialization.MEDIC, Specialization.ENGINEER,
		Specialization.RECONNAISSANCE, Specialization.COMMUNICATIONS, Specialization.DEMOLITIONS,
		Specialization.ANTI_ARMOR, Specialization.HEAVY_WEAPONS, Specialization.CYBER_WARFARE
	]
	
	for i in range(75):
		var base_name = silver_names[i]
		var spec = specializations[i % specializations.size()]
		var codename = generate_codename(spec)
		var full_name = base_name + " '" + codename + "' " + generate_surname()
		
		var character = TacticalCharacter.new(full_name, "S-" + str(i+1).pad_zeros(2), spec, CharacterRarity.SILVER)
		character.stats = generate_silver_stats(spec)
		character.portrait_path = "res://portraits/silver/" + base_name.to_lower() + "_" + codename.to_lower() + ".png"
		character.background = generate_background(spec, CharacterRarity.SILVER)
		character.equipment = generate_equipment(spec, CharacterRarity.SILVER)
		character.voice_lines = generate_voice_lines(spec)
		silver_pack.append(character)

# Generate appropriate stats for silver characters
func generate_silver_stats(spec: Specialization) -> Dictionary:
	var base_stats = {"health": 85, "armor": 45, "speed": 65, "accuracy": 70, "stealth": 55, "leadership": 60}
	
	match spec:
		Specialization.SNIPER:
			base_stats.accuracy += 15
			base_stats.stealth += 12
			base_stats.speed += 5
		Specialization.ASSAULT:
			base_stats.health += 15
			base_stats.armor += 15
			base_stats.speed += 8
		Specialization.MEDIC:
			base_stats.leadership += 15
			base_stats.stealth += 8
		Specialization.ENGINEER:
			base_stats.armor += 12
			base_stats.accuracy += 8
		Specialization.DEMOLITIONS:
			base_stats.armor += 18
			base_stats.health += 12
		Specialization.RECONNAISSANCE:
			base_stats.stealth += 18
			base_stats.speed += 15
		Specialization.COMMUNICATIONS:
			base_stats.leadership += 12
			base_stats.stealth += 10
		Specialization.ANTI_ARMOR:
			base_stats.armor += 20
			base_stats.accuracy += 10
		Specialization.HEAVY_WEAPONS:
			base_stats.health += 20
			base_stats.armor += 22
			base_stats.speed -= 10
		Specialization.CYBER_WARFARE:
			base_stats.stealth += 15
			base_stats.leadership += 10
	
	return base_stats

# Generate background stories
func generate_background(spec: Specialization, rarity: CharacterRarity) -> String:
	var tier = "Elite" if rarity == CharacterRarity.PLATINUM else "Veteran"
	
	match spec:
		Specialization.SNIPER:
			return tier + " marksman with extensive urban warfare experience. Known for precision shots under extreme pressure."
		Specialization.ASSAULT:
			return tier + " front-line combatant specializing in close-quarters battle and rapid deployment scenarios."
		Specialization.MEDIC:
			return tier + " field medic with advanced trauma care training. Has saved countless lives in hostile environments."
		Specialization.ENGINEER:
			return tier + " combat engineer skilled in fortifications, explosives disposal, and battlefield construction."
		Specialization.DEMOLITIONS:
			return tier + " explosives expert trained in both urban and rural demolition operations."
		Specialization.RECONNAISSANCE:
			return tier + " scout specialist with advanced stealth training and intelligence gathering experience."
		Specialization.COMMUNICATIONS:
			return tier + " signals operator maintaining critical battlefield communications and electronic warfare capabilities."
		Specialization.ANTI_ARMOR:
			return tier + " anti-tank specialist trained on multiple heavy weapon systems and vehicle destruction."
		Specialization.HEAVY_WEAPONS:
			return tier + " heavy weapons operator specializing in suppressive fire and area denial tactics."
		Specialization.CYBER_WARFARE:
			return tier + " cyber operations specialist with expertise in electronic warfare and digital infiltration."
	
	return "Experienced tactical operator."

# Generate equipment loadouts
func generate_equipment(spec: Specialization, rarity: CharacterRarity) -> Array:
	var tier_prefix = "Elite " if rarity == CharacterRarity.PLATINUM else "Standard "
	
	match spec:
		Specialization.SNIPER:
			return [tier_prefix + "Sniper Rifle", "Tactical Scope", "Ghillie Suit", "Range Finder"]
		Specialization.ASSAULT:
			return [tier_prefix + "Assault Rifle", "Combat Armor", "Frag Grenades", "Tactical Vest"]
		Specialization.MEDIC:
			return [tier_prefix + "Medical Kit", "Trauma Pack", "Defensive Rifle", "Communication Radio"]
		Specialization.ENGINEER:
			return [tier_prefix + "Tool Kit", "Explosive Ordnance", "Detection Equipment", "Barrier Materials"]
		Specialization.DEMOLITIONS:
			return [tier_prefix + "Explosives Pack", "Detonator", "Blast Shield", "Breaching Charges"]
		Specialization.RECONNAISSANCE:
			return [tier_prefix + "Surveillance Gear", "Stealth Suit", "Compact Rifle", "Night Vision"]
		Specialization.COMMUNICATIONS:
			return [tier_prefix + "Radio Array", "Encryption Device", "Signal Interceptor", "Backup Comms"]
		Specialization.ANTI_ARMOR:
			return [tier_prefix + "Anti-Tank Weapon", "Targeting System", "Heavy Ammunition", "Blast Protection"]
		Specialization.HEAVY_WEAPONS:
			return [tier_prefix + "Heavy Machine Gun", "Ammo Pack", "Bipod Mount", "Suppressive Gear"]
		Specialization.CYBER_WARFARE:
			return [tier_prefix + "Laptop Array", "Signal Jammer", "Hacking Tools", "Encrypted Comms"]
	
	return ["Basic Equipment"]

# Generate voice lines for characters
func generate_voice_lines(spec: Specialization) -> Array:
	match spec:
		Specialization.SNIPER:
			return ["Target acquired", "Taking the shot", "Area clear", "Moving to new position"]
		Specialization.ASSAULT:
			return ["Moving in", "Contact front", "Breaching now", "Area secured"]
		Specialization.MEDIC:
			return ["Medic incoming", "Hold still", "You're going to be fine", "Need assistance here"]
		Specialization.ENGINEER:
			return ["Setting charges", "Barrier deployed", "Route cleared", "Fortification ready"]
		Specialization.DEMOLITIONS:
			return ["Fire in the hole", "Charges set", "Big boom incoming", "Obstacle removed"]
		Specialization.RECONNAISSANCE:
			return ["Eyes on target", "Moving silent", "Intel gathered", "Position compromised"]
		Specialization.COMMUNICATIONS:
			return ["Comms established", "Signal strong", "Message received", "Link secure"]
		Specialization.ANTI_ARMOR:
			return ["Armor detected", "Missile away", "Vehicle neutralized", "Tank down"]
		Specialization.HEAVY_WEAPONS:
			return ["Suppressing fire", "Heavy weapons online", "Area denial active", "Covering fire"]
		Specialization.CYBER_WARFARE:
			return ["System breached", "Network compromised", "Digital infiltration complete", "Firewall down"]
	
	return ["Ready for orders"]

# Utility functions
func generate_codename(spec: Specialization) -> String:
	var codenames = {
		Specialization.SNIPER: ["Viper", "Falcon", "Phantom", "Razor", "Scope"],
		Specialization.ASSAULT: ["Tempest", "Fury", "Blaze", "Impact", "Charge"],
		Specialization.MEDIC: ["Mercy", "Heal", "Guardian", "Pulse", "Care"],
		Specialization.ENGINEER: ["Forge", "Build", "Steel", "Wire", "Frame"],
		Specialization.DEMOLITIONS: ["Spark", "Fuse", "Detonate", "Blast", "Boom"],
		Specialization.RECONNAISSANCE: ["Eyes", "Track", "Hunt", "Prowl", "Seek"],
		Specialization.COMMUNICATIONS: ["Voice", "Link", "Wave", "Connect", "Relay"],
		Specialization.ANTI_ARMOR: ["Pierce", "Breach", "Crush", "Break", "Smash"],
		Specialization.HEAVY_WEAPONS: ["Thunder", "Storm", "Hammer", "Titan", "Force"],
		Specialization.CYBER_WARFARE: ["Byte", "Code", "Virus", "Matrix", "Decrypt"]
	}
	
	var options = codenames.get(spec, ["Operator"])
	return options[randi() % options.size()]

func generate_surname() -> String:
	var surnames = ["Cohen", "Levy", "Miller", "Roth", "Goldberg", "Klein", "Stern", "Weiss", "Rosenberg", "Katz",
					"Ben-David", "Shamir", "Yakir", "Tzur", "Dahan", "Avni", "Gal", "Paz", "Ram", "Mor", "Zohar",
					"Barak", "Gil", "Ashkenazi", "Mizrahi", "Peretz", "Biton", "Malka", "Shalom", "Azoulay"]
	return surnames[randi() % surnames.size()]

# Character pack management functions
func get_platinum_character(index: int) -> TacticalCharacter:
	if index >= 0 and index < platinum_pack.size():
		return platinum_pack[index]
	return null

func get_silver_character(index: int) -> TacticalCharacter:
	if index >= 0 and index < silver_pack.size():
		return silver_pack[index]
	return null

func get_random_platinum() -> TacticalCharacter:
	return platinum_pack[randi() % platinum_pack.size()]

func get_random_silver() -> TacticalCharacter:
	return silver_pack[randi() % silver_pack.size()]

# Print character details
func print_character_info(character: TacticalCharacter):
	print("=== CHARACTER INFO ===")
	print("Name: ", character.name)
	print("Codename: ", character.codename)
	print("Specialization: ", Specialization.keys()[character.specialization])
	print("Rarity: ", CharacterRarity.keys()[character.rarity])
	print("Stats: ", character.stats)
	print("Equipment: ", character.equipment)
	print("Background: ", character.background)
	print("Voice Lines: ", character.voice_lines)
	print("========================")

# Example usage function
func demo_character_packs():
	print("\n=== PLATINUM PACK DEMO ===")
	for i in range(min(5, platinum_pack.size())):
		print_character_info(platinum_pack[i])
	
	print("\n=== SILVER PACK DEMO ===")
	for i in range(min(5, silver_pack.size())):
		print_character_info(silver_pack[i])
