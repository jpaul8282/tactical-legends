import React, { useState } from 'react';
import { Dice6, User, Shield, Sword, Map, Star, RefreshCw } from 'lucide-react';

const CharacterGenerator = () => {
  const [character, setCharacter] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Character data arrays
  const names = {
    male: ['Kaelen', 'Theron', 'Vex', 'Zahn', 'Drex', 'Kors', 'Vahn', 'Rexus', 'Jaxon', 'Kyros'],
    female: ['Lyra', 'Zara', 'Kira', 'Vex', 'Nyx', 'Sera', 'Tara', 'Xara', 'Maya', 'Lux'],
    neutral: ['Ash', 'River', 'Storm', 'Echo', 'Sage', 'Nova', 'Vale', 'Raven', 'Phoenix', 'Zen']
  };

  const surnames = ['Voidborn', 'Starforge', 'Ironwill', 'Shadowbane', 'Crystalfall', 'Stormwind', 'Nightblade', 'Goldspear', 'Frostborn', 'Flameheart'];

  const races = ['Oistarian Elite', 'Neo-Human', 'Synthetic Android', 'Psionic Mutant', 'Cybernetic Augment', 'Quantum Entity'];

  const classes = [
    { name: 'Tactical Commander', description: 'Master of battlefield strategy and team coordination' },
    { name: 'Stealth Operative', description: 'Expert in infiltration and covert operations' },
    { name: 'Heavy Assault', description: 'Specialized in frontal combat and heavy weapons' },
    { name: 'Tech Specialist', description: 'Hacker and technology manipulator' },
    { name: 'Psionic Warrior', description: 'Wielder of mental powers and psychic abilities' },
    { name: 'Medic Support', description: 'Combat medic with advanced healing capabilities' }
  ];

  const backgrounds = [
    'Former Oistarian military deserter seeking redemption',
    'Resistance fighter from the outer colonies',
    'Corporate spy turned freedom fighter',
    'Survivor of the Great Purge of 2387',
    'Underground arena champion',
    'Refugee from a destroyed sector',
    'Ex-bounty hunter with a moral awakening',
    'Scientist who discovered Oistarian war crimes',
    'Child of two different warring factions',
    'Time-displaced warrior from the past'
  ];

  const specialAbilities = [
    'Battle Precognition - Can predict enemy movements',
    'Neural Override - Hack enemy cybernetics',
    'Phase Shift - Briefly become intangible',
    'Energy Manipulation - Control various energy forms',
    'Tactical Rally - Boost entire team\'s performance',
    'Stealth Field - Turn invisible for short periods',
    'Berserker Rage - Massive damage boost when injured',
    'Shield Projection - Create protective barriers',
    'Mind Link - Telepathic communication with allies',
    'Time Dilation - Slow down personal time perception'
  ];

  const equipment = [
    'Plasma Rifle with targeting AI',
    'Quantum Armor with adaptive camouflage',
    'Neural Interface Headset',
    'Molecular Blade that cuts through anything',
    'Portable Shield Generator',
    'Gravitic Boots for wall-walking',
    'Emergency Med-Kit with nano-healers',
    'Tactical Hologram Projector',
    'EMP Grenades',
    'Multi-Tool with 47 functions'
  ];

  const motivations = [
    'Overthrow the Oistarian regime',
    'Find their missing family',
    'Prevent an interdimensional war',
    'Discover the truth about their origins',
    'Protect the last free human colony',
    'Master an ancient fighting technique',
    'Avenge their mentor\'s death',
    'Stop a planet-destroying weapon',
    'Unite the scattered resistance cells',
    'Break free from mind control programming'
  ];

  const flaws = [
    'Haunted by nightmares of past battles',
    'Struggles with trust due to betrayal',
    'Addicted to combat stimulants',
    'Cybernetic implants are slowly failing',
    'Wanted by multiple criminal organizations',
    'Has gaps in memory from mind wipes',
    'Prone to berserker rages in combat',
    'Secretly fears they\'re becoming like the enemy',
    'Physical weakness due to old injuries',
    'Conflicted loyalty between old and new causes'
  ];

  const factions = [
    { 
      name: 'United Resistance Coalition', 
      description: 'The main rebellion against Oistarian rule',
      reputation: 'Heroic'
    },
    { 
      name: 'Oistarian Empire', 
      description: 'The oppressive galactic regime',
      reputation: 'Tyrannical'
    },
    { 
      name: 'Free Traders Alliance', 
      description: 'Independent merchants and smugglers',
      reputation: 'Neutral'
    },
    { 
      name: 'Void Hunters', 
      description: 'Elite bounty hunters and mercenaries',
      reputation: 'Mercenary'
    },
    { 
      name: 'Neo-Terra Liberation Front', 
      description: 'Human supremacist resistance cell',
      reputation: 'Extremist'
    },
    { 
      name: 'The Syndicate', 
      description: 'Criminal underworld organization',
      reputation: 'Criminal'
    },
    { 
      name: 'Quantum Seekers', 
      description: 'Scientists seeking advanced technology',
      reputation: 'Scientific'
    },
    { 
      name: 'Shadow Collective', 
      description: 'Mysterious faction with hidden agenda',
      reputation: 'Unknown'
    }
  ];

  const ships = [
    {
      name: 'URC Defiance',
      type: 'Heavy Cruiser',
      faction: 'United Resistance Coalition',
      description: 'Flagship of the resistance fleet'
    },
    {
      name: 'Stellar Phantom',
      type: 'Stealth Frigate',
      faction: 'United Resistance Coalition',
      description: 'Advanced cloaking reconnaissance vessel'
    },
    {
      name: 'Iron Vanguard',
      type: 'Assault Carrier',
      faction: 'Oistarian Empire',
      description: 'Oistarian military command ship'
    },
    {
      name: 'Void Reaper',
      type: 'Destroyer',
      faction: 'Oistarian Empire',
      description: 'Fast attack vessel with plasma cannons'
    },
    {
      name: 'Fortune\'s Edge',
      type: 'Cargo Hauler',
      faction: 'Free Traders Alliance',
      description: 'Modified freighter with hidden weapons'
    },
    {
      name: 'Nebula Runner',
      type: 'Fast Transport',
      faction: 'Free Traders Alliance',
      description: 'High-speed courier and smuggling vessel'
    },
    {
      name: 'Crimson Talon',
      type: 'Hunter-Killer',
      faction: 'Void Hunters',
      description: 'Specialized bounty hunting vessel'
    },
    {
      name: 'Silent Strike',
      type: 'Infiltrator',
      faction: 'Shadow Collective',
      description: 'Experimental stealth assault craft'
    },
    {
      name: 'Data Nexus',
      type: 'Research Vessel',
      faction: 'Quantum Seekers',
      description: 'Mobile laboratory and data collection ship'
    },
    {
      name: 'Black Market',
      type: 'Mobile Base',
      faction: 'The Syndicate',
      description: 'Converted station serving as criminal hub'
    }
  ];

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const generateCharacter = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const gender = getRandomItem(['male', 'female', 'neutral']);
      const firstName = getRandomItem(names[gender]);
      const lastName = getRandomItem(surnames);
      const selectedClass = getRandomItem(classes);
      const selectedFaction = getRandomItem(factions);
      const availableShips = ships.filter(ship => ship.faction === selectedFaction.name);
      const selectedShip = availableShips.length > 0 ? getRandomItem(availableShips) : getRandomItem(ships);
      
      const newCharacter = {
        name: `${firstName} ${lastName}`,
        race: getRandomItem(races),
        class: selectedClass,
        faction: selectedFaction,
        ship: selectedShip,
        background: getRandomItem(backgrounds),
        specialAbility: getRandomItem(specialAbilities),
        primaryEquipment: getRandomItem(equipment),
        secondaryEquipment: getRandomItem(equipment),
        motivation: getRandomItem(motivations),
        flaw: getRandomItem(flaws),
        stats: {
          combat: Math.floor(Math.random() * 5) + 3,
          tactics: Math.floor(Math.random() * 5) + 3,
          tech: Math.floor(Math.random() * 5) + 3,
          stealth: Math.floor(Math.random() * 5) + 3,
          leadership: Math.floor(Math.random() * 5) + 3
        }
      };
      
      setCharacter(newCharacter);
      setIsGenerating(false);
    }, 1000);
  };

  const StatBar = ({ label, value, icon: Icon }) => (
    <div className="flex items-center space-x-3 mb-2">
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="text-sm font-medium text-gray-300 w-20">{label}</span>
      <div className="flex-1 bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(value / 8) * 100}%` }}
        />
      </div>
      <span className="text-sm text-gray-400 w-8">{value}/8</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            TACTICAL LEGEND
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Rise of the Oistarian
          </h2>
          <p className="text-gray-400 text-lg">Character Profile Generator</p>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={generateCharacter}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                     disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-8 rounded-lg 
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 
                     disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Dice6 className="w-5 h-5" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate Character'}</span>
          </button>
        </div>

        {/* Character Profile */}
        {character && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">{character.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Race:</span>
                    <span className="text-white font-medium">{character.race}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Class:</span>
                    <span className="text-white font-medium">{character.class.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Faction:</span>
                    <span className={`font-medium ${
                      character.faction.reputation === 'Heroic' ? 'text-green-400' :
                      character.faction.reputation === 'Tyrannical' ? 'text-red-400' :
                      character.faction.reputation === 'Criminal' ? 'text-orange-400' :
                      character.faction.reputation === 'Extremist' ? 'text-red-300' :
                      character.faction.reputation === 'Unknown' ? 'text-purple-400' :
                      'text-blue-400'
                    }`}>
                      {character.faction.name}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Class Description</h4>
                  <p className="text-gray-300 text-sm">{character.class.description}</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">Special Ability</h4>
                  <p className="text-gray-300 text-sm">{character.specialAbility}</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-indigo-400 mb-2">Faction Allegiance</h4>
                  <p className="text-gray-300 text-sm mb-1">{character.faction.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    character.faction.reputation === 'Heroic' ? 'bg-green-900 text-green-300' :
                    character.faction.reputation === 'Tyrannical' ? 'bg-red-900 text-red-300' :
                    character.faction.reputation === 'Criminal' ? 'bg-orange-900 text-orange-300' :
                    character.faction.reputation === 'Extremist' ? 'bg-red-800 text-red-200' :
                    character.faction.reputation === 'Unknown' ? 'bg-purple-900 text-purple-300' :
                    'bg-blue-900 text-blue-300'
                  }`}>
                    {character.faction.reputation}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Combat Stats</h3>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <StatBar label="Combat" value={character.stats.combat} icon={Sword} />
                  <StatBar label="Tactics" value={character.stats.tactics} icon={Map} />
                  <StatBar label="Tech" value={character.stats.tech} icon={Dice6} />
                  <StatBar label="Stealth" value={character.stats.stealth} icon={User} />
                  <StatBar label="Leadership" value={character.stats.leadership} icon={Shield} />
                </div>

                <div className="bg-gray-700 rounded-lg p-4 mt-4">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-3">Ship Assignment</h4>
                  <div className="text-white font-medium text-lg mb-1">{character.ship.name}</div>
                  <div className="text-gray-400 text-sm mb-2">{character.ship.type}</div>
                  <p className="text-gray-300 text-sm">{character.ship.description}</p>
                </div>
              </div>
            </div>

            {/* Equipment & Background */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Equipment</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• {character.primaryEquipment}</li>
                    <li>• {character.secondaryEquipment}</li>
                  </ul>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-400 mb-2">Motivation</h4>
                  <p className="text-gray-300 text-sm">{character.motivation}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">Background</h4>
                  <p className="text-gray-300 text-sm">{character.background}</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-red-400 mb-2">Character Flaw</h4>
                  <p className="text-gray-300 text-sm">{character.flaw}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!character && (
          <div className="text-center text-gray-400 mt-12">
            <Dice6 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Generate your first Oistarian resistance fighter!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterGenerator;
