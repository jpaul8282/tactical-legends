extends Control

# --- DATA ARRAYS ---
const NAMES = {
	"male": ["Kaelen", "Theron", "Vex", "Zahn", "Drex", "Kors", "Vahn", "Rexus", "Jaxon", "Kyros"],
	"female": ["Lyra", "Zara", "Kira", "Vex", "Nyx", "Sera", "Tara", "Xara", "Maya", "Lux"],
	"neutral": ["Ash", "River", "Storm", "Echo", "Sage", "Nova", "Vale", "Raven", "Phoenix", "Zen"]
}
const SURNAMES = ["Voidborn", "Starforge", "Ironwill", "Shadowbane", "Crystalfall", "Stormwind", "Nightblade", "Goldspear", "Frostborn", "Flameheart"]
const RACES = ["Oistarian Elite", "Neo-Human", "Synthetic Android", "Psionic Mutant", "Cybernetic Augment", "Quantum Entity"]
const CLASSES = [
	{ "name": "Tactical Commander", "description": "Master of battlefield strategy and team coordination" },
	{ "name": "Stealth Operative", "description": "Expert in infiltration and covert operations" },
	{ "name": "Heavy Assault", "description": "Specialized in frontal combat and heavy weapons" },
	{ "name": "Tech Specialist", "description": "Hacker and technology manipulator" },
	{ "name": "Psionic Warrior", "description": "Wielder of mental powers and psychic abilities" },
	{ "name": "Medic Support", "description": "Combat medic with advanced healing capabilities" }
]
const BACKGROUNDS = [
	"Former Oistarian military deserter seeking redemption",
	"Resistance fighter from the outer colonies",
	"Corporate spy turned freedom fighter",
	"Survivor of the Great Purge of 2387",
	"Underground arena champion",
	"Refugee from a destroyed sector",
	"Ex-bounty hunter with a moral awakening",
	"Scientist who discovered Oistarian war crimes",
	"Child of two different warring factions",
	"Time-displaced warrior from the past"
]
const SPECIAL_ABILITIES = [
	"Battle Precognition - Can predict enemy movements",
	"Neural Override - Hack enemy cybernetics",
	"Phase Shift - Briefly become intangible",
	"Energy Manipulation - Control various energy forms",
	"Tactical Rally - Boost entire team's performance",
	"Stealth Field - Turn invisible for short periods",
	"Berserker Rage - Massive damage boost when injured",
	"Shield Projection - Create protective barriers",
	"Mind Link - Telepathic communication with allies",
	"Time Dilation - Slow down personal time perception"
]
const EQUIPMENT = [
	"Plasma Rifle with targeting AI",
	"Quantum Armor with adaptive camouflage",
	"Neural Interface Headset",
	"Molecular Blade that cuts through anything",
	"Portable Shield Generator",
	"Gravitic Boots for wall-walking",
	"Emergency Med-Kit with nano-healers",
	"Tactical Hologram Projector",
	"EMP Grenades",
	"Multi-Tool with 47 functions"
]
const MOTIVATIONS = [
	"Overthrow the Oistarian regime",
	"Find their missing family",
	"Prevent an interdimensional war",
	"Discover the truth about their origins",
	"Protect the last free human colony",
	"Master an ancient fighting technique",
	"Avenge their mentor's death",
	"Stop a planet-destroying weapon",
	"Unite the scattered resistance cells",
	"Break free from mind control programming"
]
const FLAWS = [
	"Haunted by nightmares of past battles",
	"Struggles with trust due to betrayal",
	"Addicted to combat stimulants",
	"Cybernetic implants are slowly failing",
	"Wanted by multiple criminal organizations",
	"Has gaps in memory from mind wipes",
	"Prone to berserker rages in combat",
	"Secretly fears they're becoming like the enemy",
	"Physical weakness due to old injuries",
	"Conflicted loyalty between old and new causes"
]
const FACTIONS = [
	{ "name": "United Resistance Coalition", "description": "The main rebellion against Oistarian rule", "reputation": "Heroic" },
	{ "name": "Oistarian Empire", "description": "The oppressive galactic regime", "reputation": "Tyrannical" },
	{ "name": "Free Traders Alliance", "description": "Independent merchants and smugglers", "reputation": "Neutral" },
	{ "name": "Void Hunters", "description": "Elite bounty hunters and mercenaries", "reputation": "Mercenary" },
	{ "name": "Neo-Terra Liberation Front", "description": "Human supremacist resistance cell", "reputation": "Extremist" },
	{ "name": "The Syndicate", "description": "Criminal underworld organization", "reputation": "Criminal" },
	{ "name": "Quantum Seekers", "description": "Scientists seeking advanced technology", "reputation": "Scientific" },
	{ "name": "Shadow Collective", "description": "Mysterious faction with hidden agenda", "reputation": "Unknown" }
]
const SHIPS = [
	{ "name": "URC Defiance", "type": "Heavy Cruiser", "faction": "United Resistance Coalition", "description": "Flagship of the resistance fleet" },
	{ "name": "Stellar Phantom", "type": "Stealth Frigate", "faction": "United Resistance Coalition", "description": "Advanced cloaking reconnaissance vessel" },
	{ "name": "Iron Vanguard", "type": "Assault Carrier", "faction": "Oistarian Empire", "description": "Oistarian military command ship" },
	{ "name": "Void Reaper", "type": "Destroyer", "faction": "Oistarian Empire", "description": "Fast attack vessel with plasma cannons" },
	{ "name": "Fortune's Edge", "type": "Cargo Hauler", "faction": "Free Traders Alliance", "description": "Modified freighter with hidden weapons" },
	{ "name": "Nebula Runner", "type": "Fast Transport", "faction": "Free Traders Alliance", "description": "High-speed courier and smuggling vessel" },
	{ "name": "Crimson Talon", "type": "Hunter-Killer", "faction": "Void Hunters", "description": "Specialized bounty hunting vessel" },
	{ "name": "Silent Strike", "type": "Infiltrator", "faction": "Shadow Collective", "description": "Experimental stealth assault craft" },
	{ "name": "Data Nexus", "type": "Research Vessel", "faction": "Quantum Seekers", "description": "Mobile laboratory and data collection ship" },
	{ "name": "Black Market", "type": "Mobile Base", "faction": "The Syndicate", "description": "Converted station serving as criminal hub" }
]

var character = {}

# --- UTILS ---
func _get_random(arr):
	return arr[randi() % arr.size()]

func _generate_character():
	var gender = _get_random(["male", "female", "neutral"])
	var first_name = _get_random(NAMES[gender])
	var last_name = _get_random(SURNAMES)
	var selected_class = _get_random(CLASSES)
	var selected_faction = _get_random(FACTIONS)
	var available_ships = SHIPS.filter(func(ship): return ship.faction == selected_faction.name)
	var selected_ship = available_ships.size() > 0 ? _get_random(available_ships) : _get_random(SHIPS)

	return {
		"name": "%s %s" % [first_name, last_name],
		"race": _get_random(RACES),
		"class": selected_class,
		"faction": selected_faction,
		"ship": selected_ship,
		"background": _get_random(BACKGROUNDS),
		"special_ability": _get_random(SPECIAL_ABILITIES),
		"primary_equipment": _get_random(EQUIPMENT),
		"secondary_equipment": _get_random(EQUIPMENT),
		"motivation": _get_random(MOTIVATIONS),
		"flaw": _get_random(FLAWS),
		"stats": {
			"combat": randi() % 5 + 3,
			"tactics": randi() % 5 + 3,
			"tech": randi() % 5 + 3,
			"stealth": randi() % 5 + 3,
			"leadership": randi() % 5 + 3
		}
	}

# --- UI LOGIC ---
@onready var btn_generate = $GenerateButton
@onready var profile_container = $ProfileContainer
@onready var loading_label = $LoadingLabel

func _ready():
	randomize()
	btn_generate.pressed.connect(_on_generate_pressed)
	profile_container.visible = false
	loading_label.visible = false

func _on_generate_pressed():
	btn_generate.disabled = true
	loading_label.visible = true
	profile_container.visible = false
	
	# Simulate loading
	await get_tree().create_timer(1.0).timeout
	
	character = _generate_character()
	_show_character(character)
	btn_generate.disabled = false
	loading_label.visible = false
	profile_container.visible = true

func _show_character(c):
	# Set all UI values, example:
	$ProfileContainer/NameLabel.text = c.name
	$ProfileContainer/RaceLabel.text = "Race: %s" % c.race
	$ProfileContainer/ClassLabel.text = "Class: %s" % c.class.name
	$ProfileContainer/ClassDescLabel.text = c.class.description
	$ProfileContainer/FactionLabel.text = "Faction: %s (%s)" % [c.faction.name, c.faction.reputation]
	$ProfileContainer/FactionDescLabel.text = c.faction.description
	$ProfileContainer/ShipLabel.text = "Ship: %s (%s)" % [c.ship.name, c.ship.type]
	$ProfileContainer/ShipDescLabel.text = c.ship.description
	$ProfileContainer/AbilityLabel.text = "Special Ability: %s" % c.special_ability
	$ProfileContainer/BackgroundLabel.text = "Background: %s" % c.background
	$ProfileContainer/EquipmentLabel.text = "Equipment:\n- %s\n- %s" % [c.primary_equipment, c.secondary_equipment]
	$ProfileContainer/MotivationLabel.text = "Motivation: %s" % c.motivation
	$ProfileContainer/FlawLabel.text = "Flaw: %s" % c.flaw
	
	# Stats
	$ProfileContainer/CombatStat.value = c.stats.combat
	$ProfileContainer/TacticsStat.value = c.stats.tactics
	$ProfileContainer/TechStat.value = c.stats.tech
	$ProfileContainer/StealthStat.value = c.stats.stealth
	$ProfileContainer/LeadershipStat.value = c.stats.leadership

# --- Example Scene Structure ---
# CharacterGenerator (Control)
# ├─ GenerateButton (Button)
# ├─ LoadingLabel (Label)
# ├─ ProfileContainer (VBoxContainer)
# │   ├─ NameLabel (Label)
# │   ├─ RaceLabel (Label)
# │   ├─ ClassLabel (Label)
# │   ├─ ClassDescLabel (Label)
# │   ├─ FactionLabel (Label)
# │   ├─ FactionDescLabel (Label)
# │   ├─ ShipLabel (Label)
# │   ├─ ShipDescLabel (Label)
# │   ├─ AbilityLabel (Label)
# │   ├─ BackgroundLabel (Label)
# │   ├─ EquipmentLabel (Label)
# │   ├─ MotivationLabel (Label)
# │   ├─ FlawLabel (Label)
# │   ├─ CombatStat (ProgressBar)
# │   ├─ TacticsStat (ProgressBar)
# │   ├─ TechStat (ProgressBar)
# │   ├─ StealthStat (ProgressBar)
# │   ├─ LeadershipStat (ProgressBar)


public class SquadMember
{
    public string callSign;
    public string name;
    public string origin;
    public string specialty;
    public int morale;
    public string status;

    public SquadMember(string callSign, string name, string origin, string specialty, int morale, string status)
    {
        this.callSign = callSign;
        this.name = name;
        this.origin = origin;
        this.specialty = specialty;
        this.morale = morale;
        this.status = status;
    }

using System.Collections.Generic;
using UnityEngine;

public class SquadManager : MonoBehaviour
{
    public List<SquadMember> squad = new List<SquadMember>();

    void Start()
    {
        InitializeSquad();
        DisplaySquad();
    }

    void InitializeSquad()
    {
        squad.Add(new SquadMember("Echo-27", "John Smith", "Oistarian Vanguard", "Tactical Recall, Vault Phase", 78, "Active"));
        squad.Add(new SquadMember("Gunwafa", "Gunwafa El-Rami", "IDF", "Urban Siege, Adaptive Combat", 82, "Active"));
        squad.Add(new SquadMember("Nyla Sera", "Nyla Sera", "Vaultborn", "Recon, Memory Echo", 65, "Active"));
        squad.Add(new SquadMember("Korr Vex", "Korr Vex", "Synth Ascendancy (Defector)", "Heavy Weapons, Terrain Manipulation", 58, "Active"));
        squad.Add(new SquadMember("Oistarian", "Unknown", "Eden Core", "Psychic Shield, Relic Interface", 70, "Active"));
    }

    void DisplaySquad()
    {
        foreach (var member in squad)
        {
            Debug.Log($"{member.callSign} - {member.name} ({member.origin}) | Specialty: {member.specialty} | Morale: {member.morale} | Status: {member.status}");
        }
    }
}

using UnityEngine;
using System.Collections.Generic;

public class MissionBriefing : MonoBehaviour
{
    public string missionID = "EDN-V7-0425";
    public string commander = "Echo-27";
    public string location = "Eden Vault Sector 9 – The Hollow Grid";
    public string time = "0400 Vault Standard Time";
    public string tier = "Omega";

    public List<string> objectives = new List<string>
    {
        "Infiltrate Hollow Grid Vault",
        "Secure Relic Node",
        "Activate Eden Pulse Beacon",
        "Extract with Vault Surge Protocol"
    };

    public List<string> threats = new List<string>
    {
        "Synth Ascendancy Patrols",
        "Vaultborn Sentinels",
        "Environmental Hazards"
    };

    void Start()
    {
        DisplayBriefing();
    }

    void DisplayBriefing()
    {
        Debug.Log($"Mission ID: {missionID}");
        Debug.Log($"Commander: {commander}");
        Debug.Log($"Location: {location}");
        Debug.Log($"Time: {time}");
        Debug.Log($"Tier: {tier}");

        Debug.Log("Objectives:");
        foreach (var obj in objectives)
            Debug.Log($"- {obj}");

        Debug.Log("Known Threats:");
        foreach (var threat in threats)
            Debug.Log($"- {threat}");

        Debug.Log("Comms Protocol:");
        Debug.Log("Alpha: Echo-27");
        Debug.Log("Delta: Gunwafa");
        Debug.Log("Theta: Nyla Sera");
        Debug.Log("Omega: Oistarian");
    }
}

public static class TacticalAbility
{
    public static void ActivateAbility(SquadMember member)
    {
        if (member.callSign == "Gunwafa")
        {
            Debug.Log($"{member.name} executes Urban Siege Protocol: breach efficiency +40%.");
        }
        else if (member.callSign == "Echo-27")
        {
            Debug.Log($"{member.name} deploys Tactical Recall: squad reposition enabled.");
        }
    }
}

