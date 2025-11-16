extends Resource

class_name IDFSoldier
var name: String
var role: String
var background: String
var expertise: Array

func _init(_name: String, _role: String, _background: String, _expertise: Array):
    name = _name
    role = _role
    background = _background
    expertise = _expertise

var idf_character_pack = [
    IDFSoldier.new("Lieutenant Maya Cohen", "Team Leader, Aquatic Operations", "Former Navy Diver, trained in underwater breaching and amphibious assault", [
        "Leadership under water", "Risk assessment", "Dive physics"
    ]),
    IDFSoldier.new("Sergeant Tomer Levi", "Breach and Clear Specialist", "Urban warfare veteran with special operations training", [
        "Fast-entry drills", "Close-quarters tactics", "Waterborne insertion"
    ]),
    IDFSoldier.new("Corporal Sara Ben-Ami", "Combat Medic", "Marines medical corps, underwater triage certifications", [
        "Rapid-water extraction", "Field medevac", "Improvised field clinics"
    ]),
    IDFSoldier.new("Corporal Ahmed Nasser", "Recon and Surveillance", "Multilingual linguist, cultural liaison, drone operator", [
        "Amphibious reconnaissance", "Stealth movement", "Comms jamming awareness"
    ]),
    IDFSoldier.new("Corporal Hannah Rosenfeld", "Sniper / Overwatch", "Marksman with mountain and waterborne ops", [
        "Waterline concealment", "Long-range optics", "Wind/boat dynamics"
    ]),
    IDFSoldier.new("Private Lior Katz", "New Recruit / Communications Operator", "Physics student turned trainee comms technician", [
        "Secure radios", "Field comms setup", "Signal integrity"
    ]),
    IDFSoldier.new("Corporal Noor Hadid", "Diver & EOD Technician", "Explosive ordnance disposal with underwater clearance", [
        "Underwater breaching", "Device neutralization", "Risk assessment"
    ]),
    IDFSoldier.new("Sergeant Yonatan Leviathan", "Team Leader / Logistics", "Specializes in mobility planning and morale systems", [
        "Rations optimization", "Transport cell coordination", "Swim logistics"
    ]),
    IDFSoldier.new("Private Yara Shalev", "Signals & Cyber Liaison", "Cyber defense student with field comms experience", [
        "Secure networks", "Electronic warfare awareness", "Field encryption"
    ]),
    IDFSoldier.new("Corporal Eliya Mor", "Medical Logistics", "Field medic with supply chain orientation", [
        "Medical stock", "Field triage routing", "Evacuation planning"
    ]),
    IDFSoldier.new("Private Kahlil Faris", "Navigator / Pathfinder", "Desert and coastal navigation expert", [
        "Land-water navigation", "Map-to-survey translation", "GPS-denied ops"
    ]),
    IDFSoldier.new("Sergeant Ayelet Brenner", "Demolitions Technician", "Explosives and demolition in urban-riverside settings", [
        "Underwater charges", "Breach sequencing", "Risk gating"
    ]),
    IDFSoldier.new("Corporal Omar Qadri", "RSO (Range Safety Officer) / Safety", "Former range master, calm under pressure", [
        "Safety protocols", "Tethered operations", "Training oversight"
    ]),
    IDFSoldier.new("Sergeant Miriam Volinsky", "Intelligence Analyst", "Signals intelligence and open-source analysis", [
        "Target profiling", "Pattern recognition", "Intel fusion"
    ]),
    IDFSoldier.new("Corporal Ben Avraham", "Diver / Underwater Engineer", "Maritime maintenance diver", [
        "Hull tech", "Salvage operations", "Submersible interface"
    ]),
    IDFSoldier.new("Private Dalia Katz", "Communications Tech", "Radio systems and encryption specialist", [
        "Field comms networks", "Antenna deployment", "Redundancy planning"
    ]),
    IDFSoldier.new("Sergeant Karim Soliman", "Cultural Liaison / Interpreter", "Multilingual, cross-cultural trainer", [
        "Language agility", "Negotiation under stress"
    ]),
    IDFSoldier.new("Corporal Ruth Friedman", "Medical Technician / Evac Lead", "Evacuation planning during coastal ops", [
        "Evac routes", "Triage under fire", "Field med kit optimization"
    ]),
    IDFSoldier.new("Private Sami Idris", "Heavy Weapons / Support", "Marine gunner with anti-armor capabilities", [
        "Waterborne weapon stabilization", "Suppressive fire", "Field logistics"
    ]),
    IDFSoldier.new("Lieutenant Nia Park", "Recon Specialist / UAS Pilot", "Cross-trained in drones and reconnaissance", [
        "Aerial recon over water", "Sensor interpretation"
    ]),
    IDFSoldier.new("Corporal Yonina Rubin", "EOD Specialist", "Explosive ordinance disposal with floodplain experience", [
        "Underwater explosives risk", "Remote detonation protocols"
    ]),
    IDFSoldier.new("Private Mateo Rossi", "Logistics Coord / Boat Master", "Maritime logistics and small-boat handling", [
        "Supply chain in coastal zones", "Rescue boat ops"
    ]),
    IDFSoldier.new("Corporal Leila Farouk", "Sniper/Spotter", "Precision shooter with camouflage specialties", [
        "Waterborne concealment", "Long-range metrics", "Rapid concealment"
    ]),
    IDFSoldier.new("Sergeant Zohar Kadosh", "Signals Intel Officer", "Cryptography and counterfeit detection", [
        "Secure comms", "Signal interception awareness"
    ]),
    IDFSoldier.new("Private Amina Suleiman", "Diver / Medical Support", "Dive medic, emphasizes rapid extraction", [
        "Underwater medical response", "Swimmer safety"
    ]),
    IDFSoldier.new("Corporal Eli Cohen", "Combat Engineer", "Field construction and fortification specialist", [
        "Underwater bridge work", "Coastal fortifications"
    ]),
    IDFSoldier.new("Private Farah Noor", "Communications NCO", "Tactical radio operation and morale support", [
        "Team comms discipline", "After-action reporting"
    ]),
    IDFSoldier.new("Sergeant Jonah Levi", "Intelligence Collector", "Field observer, multi-environment ops", [
        "Environmental scanning", "Ambush pattern recognition"
    ]),
    IDFSoldier.new("Corporal Raya Saban", "Diver Captain / Mobility Lead", "Experienced dive team lead", [
        "Dive planning", "Team safety protocols", "Surface-swim logistics"
    ]),
    IDFSoldier.new("Private Omar Yasin", "Field Medic / Logistical Runner", "Medical apprentice with physio focus", [
        "On-site triage", "Rapid supply run", "Hydration management"
    ])
]
