import pygame
import sys
import json
import random
import math
import os
from enum import Enum
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional
import time

# --- Initialization ---
pygame.init()
pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)

SCREEN_WIDTH, SCREEN_HEIGHT = 1200, 900
FPS = 60
SAVE_FILE = "tactical_legend_save.json"

COLORS = {
    'BACKGROUND': (15, 20, 35),
    'PRIMARY': (0, 255, 255),
    'SECONDARY': (255, 140, 0),
    'WHITE': (255, 255, 255),
    'DARK_GRAY': (40, 45, 60),
    'LIGHT_GRAY': (128, 140, 160),
    'GREEN': (0, 255, 127),
    'RED': (255, 69, 58),
    'HOVER': (70, 130, 255),
    'ENERGY': (147, 0, 211),
    'SHIELD': (0, 191, 255),
    'NEON_PINK': (255, 20, 147),
    'PLASMA': (138, 43, 226)
}

FONTS = {
    'title': pygame.font.Font(None, 56),
    'header': pygame.font.Font(None, 42),
    'normal': pygame.font.Font(None, 28),
    'small': pygame.font.Font(None, 22),
    'hud': pygame.font.Font(None, 20)
}

class GameState(Enum):
    MAIN_MENU = "main_menu"
    MISSION_SELECT = "mission_select"
    LOADOUT = "loadout"
    BRIEFING = "briefing"
    GAME = "game"
    MISSION_COMPLETE = "mission_complete"
    ARSENAL = "arsenal"
    PAUSED = "paused"

# --- SoundManager, Weapon, Marine, Mission, Enemy, Particle, Button ---
# (Use your original code for these classes - unchanged.)

# ... [Place your SoundManager, Weapon, Marine, Mission, Enemy, Particle, Button here] ...

# --- Main Game Class ---

class TacticalLegend:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Tactical Legend 2087 - Neural Command Interface")
        self.clock = pygame.time.Clock()
        self.running = True
        self.state = GameState.MAIN_MENU
        self.paused = False
        self.music_on = True
        self.sfx_on = True

        self.sound_manager = SoundManager()
        self.particles = []

        # Data
        self.marines = []
        self.missions = self._init_missions()
        self.weapons_arsenal = self._init_weapons_arsenal()
        self.selected_mission = None
        self.current_loadout = {"Primary": None, "Secondary": None, "Gadget": None}
        self.mission_results = None
        self.enemies = []
        self.player_marine = None
        self.game_time = 0
        self.mission_objectives_completed = 0
        self.total_objectives = 3

        self.buttons = {}
        self._init_ui()
        self.load_game_data()

    # --- Use your _init_weapons_arsenal, _init_missions, save_game_data, load_game_data, _create_default_marines, _init_ui, setup_other_buttons, draw_futuristic_background, update_particles, draw_main_menu, draw_enhanced_marine_status, draw_mission_select, draw_briefing methods here ---

    # --- New: Main Game Loop and Scene Handling ---

    def main_loop(self):
        """Main game loop: handles events, updates, renders."""
        while self.running:
            dt = self.clock.tick(FPS) / 1000.0

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif self.state == GameState.MAIN_MENU:
                    self.handle_main_menu_event(event)
                elif self.state == GameState.MISSION_SELECT:
                    self.handle_mission_select_event(event)
                elif self.state == GameState.BRIEFING:
                    self.handle_briefing_event(event)
                elif self.state == GameState.GAME:
                    if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                        self.paused = not self.paused
                        self.sound_manager.play_sound('click')
                    elif not self.paused:
                        self.handle_game_event(event)
                    elif self.paused:
                        self.handle_pause_event(event)
                elif self.state == GameState.PAUSED:
                    self.handle_pause_event(event)
                # ... handle other states

            if self.state == GameState.GAME and not self.paused:
                self.update_game(dt)

            self.render()

        pygame.quit()
        sys.exit()

    def render(self):
        if self.state == GameState.MAIN_MENU:
            self.draw_main_menu()
        elif self.state == GameState.MISSION_SELECT:
            self.draw_mission_select()
        elif self.state == GameState.BRIEFING:
            self.draw_briefing()
        elif self.state == GameState.GAME:
            self.draw_game_hud()
            if self.paused:
                self.draw_pause_screen()
        elif self.state == GameState.PAUSED:
            self.draw_pause_screen()
        pygame.display.flip()

    def draw_game_hud(self):
        self.draw_futuristic_background()
        if self.player_marine:
            # Health, shield, energy bars
            pygame.draw.rect(self.screen, COLORS['DARK_GRAY'], (40, 30, 300, 28))
            health_width = int(300 * self.player_marine.health / 100)
            pygame.draw.rect(self.screen, COLORS['GREEN'], (40, 30, health_width, 28))
            health_text = FONTS['small'].render(f"HP: {self.player_marine.health}", True, COLORS['WHITE'])
            self.screen.blit(health_text, (50, 34))

            pygame.draw.rect(self.screen, COLORS['DARK_GRAY'], (40, 70, 300, 14))
            shield_width = int(300 * self.player_marine.shields / 100)
            pygame.draw.rect(self.screen, COLORS['SHIELD'], (40, 70, shield_width, 14))
            shield_text = FONTS['small'].render(f"SHIELD: {self.player_marine.shields}", True, COLORS['WHITE'])
            self.screen.blit(shield_text, (50, 72))

            energy_width = int(300 * self.player_marine.energy / 100)
            pygame.draw.rect(self.screen, COLORS['ENERGY'], (40, 90, energy_width, 8))
            energy_text = FONTS['small'].render(f"ENERGY: {self.player_marine.energy}", True, COLORS['WHITE'])
            self.screen.blit(energy_text, (50, 92))
        # Objectives
        obj_text = FONTS['normal'].render(f"Objectives: {self.mission_objectives_completed}/{self.total_objectives}", True, COLORS['PRIMARY'])
        self.screen.blit(obj_text, (SCREEN_WIDTH-350, 40))
        time_text = FONTS['small'].render(f"Mission Time: {int(self.game_time)}s", True, COLORS['LIGHT_GRAY'])
        self.screen.blit(time_text, (SCREEN_WIDTH-350, 80))
        pause_hint = FONTS['small'].render("ESC: Pause", True, COLORS['HOVER'])
        self.screen.blit(pause_hint, (SCREEN_WIDTH-120, SCREEN_HEIGHT-40))

    def draw_pause_screen(self):
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 170))
        self.screen.blit(overlay, (0, 0))
        pause_text = FONTS['title'].render("PAUSED", True, COLORS['SECONDARY'])
        self.screen.blit(pause_text, pause_text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2-60)))
        resume = FONTS['header'].render("Press ESC to resume", True, COLORS['WHITE'])
        self.screen.blit(resume, resume.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2+10)))
        music_toggle = FONTS['normal'].render(f"Music: {'ON' if self.music_on else 'OFF'} (M)", True, COLORS['GREEN'] if self.music_on else COLORS['RED'])
        sfx_toggle = FONTS['normal'].render(f"SFX: {'ON' if self.sfx_on else 'OFF'} (S)", True, COLORS['GREEN'] if self.sfx_on else COLORS['RED'])
        self.screen.blit(music_toggle, (SCREEN_WIDTH//2 - 100, SCREEN_HEIGHT//2 + 60))
        self.screen.blit(sfx_toggle, (SCREEN_WIDTH//2 - 100, SCREEN_HEIGHT//2 + 100))

    def handle_pause_event(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                self.paused = not self.paused
                self.sound_manager.play_sound('click')
            elif event.key == pygame.K_m:
                self.music_on = not self.music_on
            elif event.key == pygame.K_s:
                self.sfx_on = not self.sfx_on

    # --- Add your other event handler methods here (handle_main_menu_event etc.) ---

    def update_game(self, dt):
        # Example: update timer and particles
        self.game_time += dt
        self.update_particles()
        # ... add your gameplay logic here (enemy AI, objectives, etc.)

if __name__ == "__main__":
    game = TacticalLegend()
    game.main_loop()

public class BattlefieldManager : MonoBehaviour
{
    public enum ObjectiveType { DisableSnipers, HackTerminal, EscortCivilians }
    public enum Faction { Urban, Desert, Arctic }
    public enum MoraleEvent { Boost, Penalty }

    public DayCycleManager dayCycle;
    public AudioManager audioManager;
    public List<NPC> civilians;

    void Start()
    {
        InitializeEnvironment();
        AssignFactionTraits();
        dayCycle.BeginCycle();
        audioManager.PlayAmbientLayer("SirenLoop");
    }

    void InitializeEnvironment()
    {
        // Add dynamic battlefield objectives
        AddObjective(ObjectiveType.HackTerminal);
    }

    void AssignFactionTraits()
    {
        // Example trait assignment
        Faction urbanFaction = Faction.Urban;
        ApplyTrait(urbanFaction, "StealthBoost");
    }

    void UpdateMorale(MoraleEvent moraleEvent)
    {
        switch (moraleEvent)
        {
            case MoraleEvent.Boost:
                SpawnSupportUnit("MedicTent");
                break;
            case MoraleEvent.Penalty:
                TriggerTrap("AlleyMine");
                break;
        }
    }
}
npm install lucide-react
 import React, { useState, useEffect } from 'react';
import { Dice6, User, Shield, Sword, Map, Star, RefreshCw, Volume2, VolumeX, Pause, Play } from 'lucide-react';

// Make sure to have Tailwind CSS loaded in your project for styling.
// Make sure lucide-react is installed (npm install lucide-react).

// Dummy sound hook for toggling icons (expand for real audio logic)
const useSound = () => {
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);

  const toggleMusic = () => setMusicOn(v => !v);
  const toggleSFX = () => setSfxOn(v => !v);

  return { musicOn, sfxOn, toggleMusic, toggleSFX };
};

const CharacterGenerator = () => {
  const [character, setCharacter] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [paused, setPaused] = useState(false);

  // Sound toggles (for UI only, can be expanded for real sound)
  const { musicOn, sfxOn, toggleMusic, toggleSFX } = useSound();

  // Character data arrays (unchanged from earlier)
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
    { name: 'United Resistance Coalition', description: 'The main rebellion against Oistarian rule', reputation: 'Heroic' },
    { name: 'Oistarian Empire', description: 'The oppressive galactic regime', reputation: 'Tyrannical' },
    { name: 'Free Traders Alliance', description: 'Independent merchants and smugglers', reputation: 'Neutral' },
    { name: 'Void Hunters', description: 'Elite bounty hunters and mercenaries', reputation: 'Mercenary' },
    { name: 'Neo-Terra Liberation Front', description: 'Human supremacist resistance cell', reputation: 'Extremist' },
    { name: 'The Syndicate', description: 'Criminal underworld organization', reputation: 'Criminal' },
    { name: 'Quantum Seekers', description: 'Scientists seeking advanced technology', reputation: 'Scientific' },
    { name: 'Shadow Collective', description: 'Mysterious faction with hidden agenda', reputation: 'Unknown' }
  ];
  const ships = [
    { name: 'URC Defiance', type: 'Heavy Cruiser', faction: 'United Resistance Coalition', description: 'Flagship of the resistance fleet' },
    { name: 'Stellar Phantom', type: 'Stealth Frigate', faction: 'United Resistance Coalition', description: 'Advanced cloaking reconnaissance vessel' },
    { name: 'Iron Vanguard', type: 'Assault Carrier', faction: 'Oistarian Empire', description: 'Oistarian military command ship' },
    { name: 'Void Reaper', type: 'Destroyer', faction: 'Oistarian Empire', description: 'Fast attack vessel with plasma cannons' },
    { name: 'Fortune\'s Edge', type: 'Cargo Hauler', faction: 'Free Traders Alliance', description: 'Modified freighter with hidden weapons' },
    { name: 'Nebula Runner', type: 'Fast Transport', faction: 'Free Traders Alliance', description: 'High-speed courier and smuggling vessel' },
    { name: 'Crimson Talon', type: 'Hunter-Killer', faction: 'Void Hunters', description: 'Specialized bounty hunting vessel' },
    { name: 'Silent Strike', type: 'Infiltrator', faction: 'Shadow Collective', description: 'Experimental stealth assault craft' },
    { name: 'Data Nexus', type: 'Research Vessel', faction: 'Quantum Seekers', description: 'Mobile laboratory and data collection ship' },
    { name: 'Black Market', type: 'Mobile Base', faction: 'The Syndicate', description: 'Converted station serving as criminal hub' }
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

      setCharacter({
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
      });
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

  // Pause overlay
  const PauseOverlay = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
      <Pause className="w-16 h-16 text-yellow-300 mb-4" />
      <h2 className="text-3xl font-bold text-yellow-200 mb-2">Paused</h2>
      <div className="flex space-x-6 mt-4">
        <button
          onClick={toggleMusic}
          className={`flex items-center px-5 py-2 rounded-lg font-bold transition
            ${musicOn ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-300'}`}>
          {musicOn ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />}
          Music: {musicOn ? "On" : "Off"}
        </button>
        <button
          onClick={toggleSFX}
          className={`flex items-center px-5 py-2 rounded-lg font-bold transition
            ${sfxOn ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-300'}`}>
          {sfxOn ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />}
          SFX: {sfxOn ? "On" : "Off"}
        </button>
        <button
          onClick={() => setPaused(false)}
          className="flex items-center px-5 py-2 rounded-lg font-bold bg-blue-700 text-white">
          <Play className="mr-2" /> Resume
        </button>
      </div>
      <div className="mt-6 text-gray-400 text-sm">Press <kbd>Esc</kbd> to resume</div>
    </div>
  );

  // Keyboard pause handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {paused && <PauseOverlay />}
      <div className={`max-w-4xl mx-auto ${paused ? 'opacity-30 pointer-events-none select-none' : ''}`}>
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
            disabled={isGenerating || paused}
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
      {/* HUD Controls */}
      <div className="fixed right-0 top-0 flex flex-col m-4 z-40 opacity-80">
        <button
          onClick={toggleMusic}
          className={`mb-2 p-2 rounded-full transition ${musicOn ? 'bg-green-700' : 'bg-gray-700'} text-white shadow`}>
          {musicOn ? <Volume2 /> : <VolumeX />}
        </button>
        <button
          onClick={toggleSFX}
          className={`mb-2 p-2 rounded-full transition ${sfxOn ? 'bg-green-700' : 'bg-gray-700'} text-white shadow`}>
          {sfxOn ? <Volume2 /> : <VolumeX />}
        </button>
        <button
          onClick={() => setPaused(true)}
          className="p-2 rounded-full bg-yellow-700 text-white shadow">
          <Pause />
        </button>
      </div>
    </div>
  );
};

export default CharacterGenerator;

/Audio/
├── Menu/
│   ├── menu_select.wav
│   ├── encrypted_tone.wav
├── HUD/
│   └── hud_ping.wav
├── Dialogue/
│   ├── fade_in.wav
│   ├── shadow_intro.wav
├── Mutators/
│   ├── mutator_warp.wav
│   └── pitch_distort.wav
├── Effects/
│   ├── stealth_reverb.wav
│   └── sonar_echo.wav
├── Ambient/
│   ├── CalmAtmosphere.wav
│   ├── AlertPulse.wav
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

/// <summary>
/// Full-featured AudioManager supporting SFX, music, ambient, and dialogue layers,
/// with auto-mixer routing, crossfades, pause/resume, and plugin-ready events.
/// </summary>
[DisallowMultipleComponent]
public class AudioManager : MonoBehaviour
{
    [Header("Mixer Setup")]
    public AudioMixer masterMixer;
    public string sfxGroupName = "SFX";
    public string musicGroupName = "Music";
    public string ambientGroupName = "Ambient";
    public string dialogueGroupName = "Dialogue";

    [Header("Clips: Ambient")]
    public AudioClip sirenLoop;
    public AudioClip crowdChant;
    public AudioClip rainDrip;
    public List<AudioClip> extraAmbientLayers;

    [Header("Clips: SFX")]
    public List<AudioClip> sfxClips; // Add SFX by name in Inspector

    [Header("Clips: Music")]
    public List<AudioClip> musicTracks; // Add music by name in Inspector

    [Header("Clips: Dialogue")]
    public List<AudioClip> dialogueClips; // Add dialogue by name in Inspector

    [Header("Volume")]
    [Range(0f, 1f)] public float sfxVolume = 0.8f;
    [Range(0f, 1f)] public float musicVolume = 0.7f;
    [Range(0f, 1f)] public float ambientVolume = 0.7f;
    [Range(0f, 1f)] public float dialogueVolume = 1.0f;

    // Mixer parameter names (must match mixer setup)
    private string sfxParam = "SFXVolume";
    private string musicParam = "MusicVolume";
    private string ambientParam = "AmbientVolume";
    private string dialogueParam = "DialogueVolume";
    private string masterParam = "MasterVolume";

    // Audio sources
    private Dictionary<string, AudioSource> ambientSources = new Dictionary<string, AudioSource>();
    private Dictionary<string, AudioClip> ambientClips = new Dictionary<string, AudioClip>();

    private AudioSource musicSource;
    private AudioSource sfxSource;
    private AudioSource dialogueSource;

    private Dictionary<string, AudioClip> sfxClipDict = new Dictionary<string, AudioClip>();
    private Dictionary<string, AudioClip> musicTrackDict = new Dictionary<string, AudioClip>();
    private Dictionary<string, AudioClip> dialogueClipDict = new Dictionary<string, AudioClip>();

    // Singleton support
    public static AudioManager Instance { get; private set; }

    private bool isPaused = false;

    void Awake()
    {
        // Singleton
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);

        // Register ambient
        ambientClips["SirenLoop"] = sirenLoop;
        ambientClips["CrowdChant"] = crowdChant;
        ambientClips["RainDrip"] = rainDrip;
        if (extraAmbientLayers != null)
            foreach (var a in extraAmbientLayers) if (a != null) ambientClips[a.name] = a;

        // Register SFX
        if (sfxClips != null)
            foreach (var sfx in sfxClips) if (sfx != null) sfxClipDict[sfx.name] = sfx;

        // Register Music
        if (musicTracks != null)
            foreach (var m in musicTracks) if (m != null) musicTrackDict[m.name] = m;

        // Register Dialogue
        if (dialogueClips != null)
            foreach (var d in dialogueClips) if (d != null) dialogueClipDict[d.name] = d;

        SetupSourcesAndMixer();
    }

    void SetupSourcesAndMixer()
    {
        // SFX
        if (sfxSource == null)
        {
            sfxSource = gameObject.AddComponent<AudioSource>();
            sfxSource.loop = false; sfxSource.playOnAwake = false;
            sfxSource.volume = sfxVolume;
            if (masterMixer && !string.IsNullOrEmpty(sfxGroupName))
            {
                var group = masterMixer.FindMatchingGroups(sfxGroupName);
                if (group.Length > 0) sfxSource.outputAudioMixerGroup = group[0];
            }
        }
        // Music
        if (musicSource == null)
        {
            musicSource = gameObject.AddComponent<AudioSource>();
            musicSource.loop = true; musicSource.playOnAwake = false;
            musicSource.volume = musicVolume;
            if (masterMixer && !string.IsNullOrEmpty(musicGroupName))
            {
                var group = masterMixer.FindMatchingGroups(musicGroupName);
                if (group.Length > 0) musicSource.outputAudioMixerGroup = group[0];
            }
        }
        // Dialogue
        if (dialogueSource == null)
        {
            dialogueSource = gameObject.AddComponent<AudioSource>();
            dialogueSource.loop = false; dialogueSource.playOnAwake = false;
            dialogueSource.volume = dialogueVolume;
            if (masterMixer && !string.IsNullOrEmpty(dialogueGroupName))
            {
                var group = masterMixer.FindMatchingGroups(dialogueGroupName);
                if (group.Length > 0) dialogueSource.outputAudioMixerGroup = group[0];
            }
        }
        // Ambient: lazy-setup per layer
    }

    // --------------------- SFX -------------------------
    public void PlaySFX(string sfxName)
    {
        if (sfxClipDict.ContainsKey(sfxName) && sfxClipDict[sfxName])
        {
            sfxSource.PlayOneShot(sfxClipDict[sfxName], sfxVolume);
        }
        else
        {
            Debug.LogWarning($"AudioManager: SFX '{sfxName}' not found.");
        }
    }

    // --------------------- Music -----------------------
    public void PlayMusic(string trackName, float fadeTime = 1.0f)
    {
        if (!musicTrackDict.ContainsKey(trackName) || musicTrackDict[trackName] == null)
        {
            Debug.LogWarning($"AudioManager: Music track '{trackName}' not found.");
            return;
        }
        StartCoroutine(FadeInMusic(trackName, fadeTime));
    }

    IEnumerator FadeInMusic(string trackName, float fadeTime)
    {
        if (musicSource.isPlaying)
            yield return StartCoroutine(FadeOut(musicSource, fadeTime));
        musicSource.clip = musicTrackDict[trackName];
        musicSource.volume = 0f;
        musicSource.Play();
        float t = 0f;
        while (t < fadeTime)
        {
            t += Time.deltaTime;
            musicSource.volume = Mathf.Lerp(0f, musicVolume, t / fadeTime);
            yield return null;
        }
        musicSource.volume = musicVolume;
    }

    public void StopMusic(float fadeTime = 1.0f)
    {
        if (musicSource.isPlaying)
            StartCoroutine(FadeOut(musicSource, fadeTime));
    }

    // ------------------- Ambient -----------------------
    public void PlayAmbientLayer(string layerName, float crossfadeTime = 1.0f)
    {
        if (!ambientClips.ContainsKey(layerName) || ambientClips[layerName] == null)
        {
            Debug.LogWarning($"AudioManager: No ambient clip found for '{layerName}'");
            return;
        }

        // If already playing, ignore
        if (ambientSources.ContainsKey(layerName) && ambientSources[layerName].isPlaying)
            return;

        // Fade out all others
        foreach (var src in ambientSources.Values)
            if (src.isPlaying)
                StartCoroutine(FadeOutAndStop(src, crossfadeTime));

        // Play this layer
        StartCoroutine(FadeInAndPlayAmbient(layerName, crossfadeTime));
    }

    IEnumerator FadeInAndPlayAmbient(string layerName, float fadeTime)
    {
        AudioClip clip = ambientClips[layerName];
        AudioSource src;
        if (!ambientSources.ContainsKey(layerName))
        {
            src = gameObject.AddComponent<AudioSource>();
            src.clip = clip;
            src.loop = true;
            src.playOnAwake = false;
            src.volume = 0f;
            if (masterMixer && !string.IsNullOrEmpty(ambientGroupName))
            {
                var group = masterMixer.FindMatchingGroups(ambientGroupName);
                if (group.Length > 0) src.outputAudioMixerGroup = group[0];
            }
            ambientSources[layerName] = src;
        }
        else
        {
            src = ambientSources[layerName];
            src.clip = clip;
        }

        src.Play();
        float t = 0f;
        while (t < fadeTime)
        {
            t += Time.deltaTime;
            src.volume = Mathf.Lerp(0f, ambientVolume, t / fadeTime);
            yield return null;
        }
        src.volume = ambientVolume;
    }

    IEnumerator FadeOutAndStop(AudioSource src, float fadeTime)
    {
        float startVol = src.volume;
        float t = 0f;
        while (t < fadeTime)
        {
            t += Time.deltaTime;
            src.volume = Mathf.Lerp(startVol, 0f, t / fadeTime);
            yield return null;
        }
        src.Stop();
        src.volume = ambientVolume;
    }

    public void StopAmbientLayer(string layerName, float fadeOutTime = 1.0f)
    {
        if (ambientSources.ContainsKey(layerName) && ambientSources[layerName].isPlaying)
            StartCoroutine(FadeOutAndStop(ambientSources[layerName], fadeOutTime));
    }
    public void StopAllAmbient(float fadeOutTime = 1.0f)
    {
        foreach (var src in ambientSources.Values)
            if (src.isPlaying)
                StartCoroutine(FadeOutAndStop(src, fadeOutTime));
    }

    // ------------------- Dialogue ----------------------
    public void PlayDialogue(string dialogueName)
    {
        if (!dialogueClipDict.ContainsKey(dialogueName) || dialogueClipDict[dialogueName] == null)
        {
            Debug.LogWarning($"AudioManager: Dialogue '{dialogueName}' not found.");
            return;
        }
        dialogueSource.Stop();
        dialogueSource.clip = dialogueClipDict[dialogueName];
        dialogueSource.volume = dialogueVolume;
        dialogueSource.Play();
    }

    public void StopDialogue()
    {
        dialogueSource.Stop();
    }

    // ------------------- Volume Controls ---------------
    public void SetMasterVolume(float volume)
    {
        if (masterMixer)
            masterMixer.SetFloat(masterParam, Mathf.Log10(Mathf.Max(volume, 0.01f)) * 20);
    }
    public void SetSFXVolume(float volume)
    {
        sfxVolume = Mathf.Clamp01(volume);
        sfxSource.volume = sfxVolume;
        if (masterMixer)
            masterMixer.SetFloat(sfxParam, Mathf.Log10(Mathf.Max(sfxVolume, 0.01f)) * 20);
    }
    public void SetMusicVolume(float volume)
    {
        musicVolume = Mathf.Clamp01(volume);
        musicSource.volume = musicVolume;
        if (masterMixer)
            masterMixer.SetFloat(musicParam, Mathf.Log10(Mathf.Max(musicVolume, 0.01f)) * 20);
    }
    public void SetAmbientVolume(float volume)
    {
        ambientVolume = Mathf.Clamp01(volume);
        foreach (var src in ambientSources.Values)
            src.volume = ambientVolume;
        if (masterMixer)
            masterMixer.SetFloat(ambientParam, Mathf.Log10(Mathf.Max(ambientVolume, 0.01f)) * 20);
    }
    public void SetDialogueVolume(float volume)
    {
        dialogueVolume = Mathf.Clamp01(volume);
        dialogueSource.volume = dialogueVolume;
        if (masterMixer)
            masterMixer.SetFloat(dialogueParam, Mathf.Log10(Mathf.Max(dialogueVolume, 0.01f)) * 20);
    }

    // ------------------- Pause/Resume ------------------
    public void PauseAllAudio()
    {
        isPaused = true;
        sfxSource.Pause();
        musicSource.Pause();
        dialogueSource.Pause();
        foreach (var src in ambientSources.Values) src.Pause();
    }
    public void ResumeAllAudio()
    {
        isPaused = false;
        sfxSource.UnPause();
        musicSource.UnPause();
        dialogueSource.UnPause();
        foreach (var src in ambientSources.Values) src.UnPause();
    }

    // ----------------- Utility/Debug -------------------
#if UNITY_EDITOR
    void OnGUI()
    {
        if (!Application.isPlaying) return;
        GUILayout.BeginArea(new Rect(10, 10, 260, 400), "AudioManager Debug", GUI.skin.window);
        if (GUILayout.Button("Play Siren")) PlayAmbientLayer("SirenLoop");
        if (GUILayout.Button("Play Crowd")) PlayAmbientLayer("CrowdChant");
        if (GUILayout.Button("Play Rain")) PlayAmbientLayer("RainDrip");
        if (GUILayout.Button("Stop All Ambient")) StopAllAmbient();
        if (GUILayout.Button("Play SFX (First)")) if (sfxClips.Count > 0) PlaySFX(sfxClips[0].name);
        if (GUILayout.Button("Play Music (First)")) if (musicTracks.Count > 0) PlayMusic(musicTracks[0].name);
        if (GUILayout.Button("Play Dialogue (First)")) if (dialogueClips.Count > 0) PlayDialogue(dialogueClips[0].name);
        if (GUILayout.Button("Pause All")) PauseAllAudio();
        if (GUILayout.Button("Resume All")) ResumeAllAudio();
        GUILayout.Label("SFX Volume");
        sfxVolume = GUILayout.HorizontalSlider(sfxVolume, 0f, 1f);
        if (GUILayout.Button("Set SFX Volume")) SetSFXVolume(sfxVolume);
        GUILayout.Label("Music Volume");
        musicVolume = GUILayout.HorizontalSlider(musicVolume, 0f, 1f);
        if (GUILayout.Button("Set Music Volume")) SetMusicVolume(musicVolume);
        GUILayout.Label("Ambient Volume");
        ambientVolume = GUILayout.HorizontalSlider(ambientVolume, 0f, 1f);
        if (GUILayout.Button("Set Ambient Volume")) SetAmbientVolume(ambientVolume);
        GUILayout.Label("Dialogue Volume");
        dialogueVolume = GUILayout.HorizontalSlider(dialogueVolume, 0f, 1f);
        if (GUILayout.Button("Set Dialogue Volume")) SetDialogueVolume(dialogueVolume);
        GUILayout.EndArea();
    }
#endif

    void OnDestroy()
    {
        foreach (var src in ambientSources.Values)
            if (src != null)
                Destroy(src);
    }
}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine.Networking; // For networking (UNET or Mirror)

/// <summary>
/// Advanced BattlefieldManager controlling objectives, factions, weather, hazards, reinforcements,
/// AI, morale, dynamic environment, UI, networking, and all battlefield elements.
/// </summary>
public class BattlefieldManager : MonoBehaviour
{
    public enum ObjectiveType { DisableSnipers, HackTerminal, EscortCivilians, DestroyArmoredVehicle, CaptureZone, DefendPoint }
    public enum Faction { Urban, Desert, Arctic, Forest }
    public enum MoraleEvent { Boost, Penalty, Panic, Rally }

    [Header("Dependencies")]
    public DayCycleManager dayCycle;
    public AudioManager audioManager;
    public WeatherManager weatherManager;

    [Header("Civilians & AI")]
    public List<NPC> civilians;
    public List<NPC> enemyUnits;
    public List<NPC> friendlyUnits;

    [Header("Battlefield Elements")]
    public List<Transform> objectiveSpawnPoints;
    public List<GameObject> objectivePrefabs;
    public List<GameObject> hazardPrefabs; // e.g., mine, gas, turret
    public List<GameObject> reinforcementPrefabs;

    [Header("Environment Dynamics")]
    public Light mainDirectionalLight;
    public ParticleSystem explosionFX;
    public ParticleSystem smokeFX;
    public AudioClip heavyWeaponsFire;
    public AudioClip artilleryStrike;

    [Header("UI Elements")]
    public Canvas battlefieldCanvas;
    public Text objectiveText;
    public Text moraleText;
    public Text factionText;
    public Button nextObjectiveButton;
    public GameObject pauseMenuPanel;
    public Slider moraleSlider;

    // Networking hooks (e.g., Mirror/UNET/Custom)
    public delegate void OnObjectiveCompletedNet(ObjectiveType type, string playerId);
    public event OnObjectiveCompletedNet ObjectiveCompletedNet;

    public delegate void OnMoraleChangedNet(float morale, string playerId);
    public event OnMoraleChangedNet MoraleChangedNet;

    // Scene management
    public List<string> sceneNames; // Add your Unity scene names here

    // Internal state
    private Dictionary<ObjectiveType, GameObject> activeObjectives = new Dictionary<ObjectiveType, GameObject>();
    private Dictionary<Faction, string> factionTraits = new Dictionary<Faction, string>();
    private float morale = 1.0f; // 0-2, 1 = normal

    void Start()
    {
        InitializeEnvironment();
        AssignFactionTraits();
        dayCycle?.BeginCycle();
        weatherManager?.RandomizeWeather();
        audioManager?.PlayAmbientLayer("SirenLoop");
        SetupUI();
        UpdateUI();
    }

    void InitializeEnvironment()
    {
        // Spawn random objectives
        SpawnBattlefieldObjectives();

        // Random hazards
        SpawnHazards();

        // Civilians AI
        foreach (NPC civ in civilians)
            civ?.SetBehavior("FleeToSafeZone");

        // Enemy AI
        foreach (NPC enemy in enemyUnits)
            enemy?.SetBehavior("AggressivePatrol");

        // Friendly AI
        foreach (NPC ally in friendlyUnits)
            ally?.SetBehavior("HoldPosition");
    }

    void SpawnBattlefieldObjectives()
    {
        // Clear old
        foreach (var obj in activeObjectives.Values)
            if (obj != null) Destroy(obj);
        activeObjectives.Clear();

        // Example: spawn 3 random objectives
        List<ObjectiveType> chosen = new List<ObjectiveType>
        {
            ObjectiveType.HackTerminal,
            ObjectiveType.DisableSnipers,
            ObjectiveType.EscortCivilians
        };
        for (int i = 0; i < chosen.Count; i++)
        {
            int idx = Random.Range(0, objectiveSpawnPoints.Count);
            int prefabIdx = Mathf.Clamp((int)chosen[i], 0, objectivePrefabs.Count - 1);
            GameObject obj = Instantiate(objectivePrefabs[prefabIdx], objectiveSpawnPoints[idx].position, Quaternion.identity);
            activeObjectives[chosen[i]] = obj;
        }
        UpdateUI();
    }

    void SpawnHazards()
    {
        // Spawn random hazards on the map
        foreach (GameObject hazardPrefab in hazardPrefabs)
        {
            Vector3 pos = GetRandomBattlefieldPosition();
            Instantiate(hazardPrefab, pos, Quaternion.identity);
        }
    }

    Vector3 GetRandomBattlefieldPosition()
    {
        float x = Random.Range(-50f, 50f);
        float z = Random.Range(-50f, 50f);
        float y = Terrain.activeTerrain ? Terrain.activeTerrain.SampleHeight(new Vector3(x, 0, z)) : 0f;
        return new Vector3(x, y, z);
    }

    void AssignFactionTraits()
    {
        factionTraits[Faction.Urban] = "StealthBoost";
        factionTraits[Faction.Desert] = "HeatResistance";
        factionTraits[Faction.Arctic] = "FrostImmunity";
        factionTraits[Faction.Forest] = "Camouflage";
        foreach (var kvp in factionTraits)
            ApplyTrait(kvp.Key, kvp.Value);
    }

    void ApplyTrait(Faction faction, string trait)
    {
        Debug.Log($"Applied trait {trait} to {faction} faction.");
    }

    public void UpdateMorale(MoraleEvent moraleEvent)
    {
        switch (moraleEvent)
        {
            case MoraleEvent.Boost:
                morale = Mathf.Min(morale + 0.2f, 2f);
                SpawnSupportUnit("MedicTent");
                ShowMessage("Morale Boosted!", 2f);
                break;
            case MoraleEvent.Penalty:
                morale = Mathf.Max(morale - 0.2f, 0f);
                TriggerTrap("AlleyMine");
                ShowMessage("Morale Penalty!", 2f);
                break;
            case MoraleEvent.Panic:
                morale = 0f;
                audioManager?.PlaySFX("PanicAlarm");
                foreach (NPC ally in friendlyUnits)
                    ally?.SetBehavior("Retreat");
                ShowMessage("Troops in Panic!", 3f);
                break;
            case MoraleEvent.Rally:
                morale = 1.5f;
                audioManager?.PlaySFX("RallyHorn");
                foreach (NPC ally in friendlyUnits)
                    ally?.SetBehavior("Advance");
                ShowMessage("Troops Rallying!", 3f);
                break;
        }
        UpdateUI();
        // Networking hook
        MoraleChangedNet?.Invoke(morale, GetLocalPlayerId());
    }

    void SpawnSupportUnit(string unitType)
    {
        GameObject supportPrefab = reinforcementPrefabs.Find(go => go.name == unitType);
        if (supportPrefab != null)
        {
            Vector3 pos = GetRandomBattlefieldPosition();
            Instantiate(supportPrefab, pos, Quaternion.identity);
            audioManager?.PlaySFX("SupportArrived");
        }
    }

    void TriggerTrap(string trapType)
    {
        GameObject trapPrefab = hazardPrefabs.Find(go => go.name == trapType);
        if (trapPrefab != null)
        {
            Vector3 pos = GetRandomBattlefieldPosition();
            Instantiate(trapPrefab, pos, Quaternion.identity);
            audioManager?.PlaySFX("TrapTrigger");
        }
    }

    public void TriggerBattlefieldEvent(string eventType)
    {
        switch (eventType)
        {
            case "ArtilleryStrike":
                StartCoroutine(PlayArtilleryStrike());
                break;
            case "HeavyWeaponsFire":
                if (audioManager != null && heavyWeaponsFire != null)
                    audioManager.PlaySFX(heavyWeaponsFire.name);
                break;
            case "Explosion":
                if (explosionFX != null) explosionFX.Play();
                audioManager?.PlaySFX("Explosion");
                break;
            case "SmokeScreen":
                if (smokeFX != null) smokeFX.Play();
                break;
        }
    }

    IEnumerator PlayArtilleryStrike()
    {
        if (audioManager != null && artilleryStrike != null)
            audioManager.PlaySFX(artilleryStrike.name);
        yield return new WaitForSeconds(1.5f);
        if (explosionFX != null) explosionFX.Play();
    }

    public void CompleteObjective(ObjectiveType type)
    {
        if (activeObjectives.ContainsKey(type))
        {
            Destroy(activeObjectives[type]);
            activeObjectives.Remove(type);
        }
        ShowMessage($"Objective {type} completed!", 2f);
        audioManager?.PlaySFX("ObjectiveComplete");
        UpdateUI();
        // Networking hook
        ObjectiveCompletedNet?.Invoke(type, GetLocalPlayerId());
    }

    // --- UI Methods ---
    void SetupUI()
    {
        if (nextObjectiveButton != null)
            nextObjectiveButton.onClick.AddListener(GoToNextScene);

        if (pauseMenuPanel != null)
            pauseMenuPanel.SetActive(false);

        if (battlefieldCanvas != null)
            battlefieldCanvas.worldCamera = Camera.main;
    }

    void UpdateUI()
    {
        if (objectiveText != null)
        {
            List<string> objList = new List<string>();
            foreach (var obj in activeObjectives.Keys)
                objList.Add(obj.ToString());
            objectiveText.text = "Objectives:\n" + string.Join("\n", objList);
        }
        if (moraleText != null)
            moraleText.text = $"Morale: {(int)(morale * 100)}%";
        if (moraleSlider != null)
            moraleSlider.value = morale;
        if (factionText != null)
            factionText.text = "Faction: Urban"; // Example, could be made dynamic
    }

    public void ShowMessage(string msg, float duration)
    {
        if (uiMessageCoroutine != null)
            StopCoroutine(uiMessageCoroutine);
        uiMessageCoroutine = StartCoroutine(ShowMessageRoutine(msg, duration));
    }

    private Coroutine uiMessageCoroutine;
    private IEnumerator ShowMessageRoutine(string msg, float duration)
    {
        if (objectiveText != null)
        {
            string prev = objectiveText.text;
            objectiveText.text = msg;
            yield return new WaitForSeconds(duration);
            UpdateUI();
        }
    }

    // --- Scene Management ---
    public void GoToNextScene()
    {
        if (sceneNames == null || sceneNames.Count == 0) return;
        int currentScene = SceneManager.GetActiveScene().buildIndex;
        int nextScene = (currentScene + 1) % sceneNames.Count;
        SceneManager.LoadScene(sceneNames[nextScene]);
    }

    public void PauseGame()
    {
        Time.timeScale = 0f;
        if (pauseMenuPanel != null)
            pauseMenuPanel.SetActive(true);
    }

    public void ResumeGame()
    {
        Time.timeScale = 1f;
        if (pauseMenuPanel != null)
            pauseMenuPanel.SetActive(false);
    }

    // --- Networking Hooks ---
    // Replace with your multiplayer/networking framework (e.g., Mirror, FishNet, NGO, etc.)
    public void OnReceiveObjectiveCompleteFromNetwork(ObjectiveType type, string playerId)
    {
        CompleteObjective(type);
    }

    public void OnReceiveMoraleChangedFromNetwork(float newMorale, string playerId)
    {
        morale = newMorale;
        UpdateUI();
    }

    string GetLocalPlayerId()
    {
        // Replace with your network manager/player system
        return SystemInfo.deviceUniqueIdentifier;
    }
}
// --- MISSION: Echoes of Judgment ---
// Deeply dynamic, tactical, and emotionally reactive mission script for an immersive experience.

mission "Echoes of Judgment" {
    description: """
        Infiltrate the Corrupted Grid to extract the Memory Shard, neutralize hostile elements, and face moral crossroads.
        Every action and tactical order will echo through the battlefield, affecting both the environment and your soul.
    """,
    objectives: [
        {
            title: "Secure Entry Point",
            details: "Disable cameras and guards quietly to avoid alerting the main force.",
            tactical: [
                "Use suppressed weapons or melee for silent takedowns.",
                "Scan for alternate routes with the Sin Scanner."
            ],
            success: [
                "No reinforcements called.",
                "Unlocks hidden supply cache."
            ],
            failure: [
                "Alarm triggers enemy reinforcements.",
                "Morale penalty for squad."
            ]
        },
        {
            title: "Confront the Sniper's Nest",
            details: "Neutralize hostile snipers overwatching the plaza.",
            tactical: [
                "Mark targets for synchronized takedowns.",
                "Flank using smoke grenades or distract with drone.",
                "Sin Scanner can reveal sniper guilt—sparing may grant unique intel."
            ],
            dynamic: [
                "Snipers may surrender if outflanked and not harmed.",
                "Killing surrendered snipers triggers squad dialogue and morality shift."
            ]
        },
        {
            title: "Hack the Terminal",
            details: "Access the encrypted vault terminal under fire.",
            tactical: [
                "Assign a squadmate to cover while hacking.",
                "Use EMP grenades to disable automated defenses.",
                "Sin Scanner reveals emotional residue—terminal may trigger memory echo traps."
            ],
            dynamic: [
                "Hacking success speed depends on squad morale and NPC trust.",
                "If enemy NPCs with high guilt are nearby during hack, weapons may misfire from haunt level."
            ]
        },
        {
            title: "Escort the Civilians",
            details: "Guide NPC civilians through an active killzone to safety.",
            tactical: [
                "Order squad to provide covering fire or create diversions.",
                "Sin Scanner identifies 'high guilt' civilians—handle with care, as they may panic or betray.",
                "Use Chord of Mercy or Harmony Surge to calm panicked civilians."
            ],
            dynamic: [
                "If civilians die, trigger regret-induced hallucinations and morale penalties.",
                "Successful escort boosts squad morale and unlocks 'Forgiveness Protocol' weapon evolution."
            ]
        },
        {
            title: "Face ShadowEcho",
            details: "Confront the haunting NPC that embodies your past decisions.",
            tactical: [
                "Use dialogue options: Compassion, Threat, Silence.",
                "ShadowEcho adapts: may attack, flee, or offer crucial intel based on your morality.",
                "Pulse of Silence disables ShadowEcho’s abilities, but increases Fear Haunt."
            ],
            dynamic: [
                "Spare ShadowEcho to unlock unique codex and weapon skin.",
                "Killing ShadowEcho triggers 'Sin Surge' event—environment mutates, enemies become more aggressive."
            ]
        }
    ],
    onComplete {
        evaluateMorality()
        applyTraitShift()
        unlockAbility()
        evolveWeapons()
        updateCodex()
        triggerMoralityFX()
        synchronizeArsenal()
    }
}

// --- DYNAMIC SYSTEMS ---

function evaluateMorality() {
    let compassionScore = player.actions.count("spared_enemy") + player.dialogue.count("compassion");
    let ruthlessnessScore = player.actions.count("executed_enemy") + player.dialogue.count("threat");
    player.morality += (compassionScore * 10) - (ruthlessnessScore * 10);
    // Bonus/penalty for sparing or killing high-guilt targets
    foreach (npc in scene.npcs) {
        if (npc.isSpared && npc.guiltLevel === "High") player.morality += 5;
        if (npc.isExecuted && npc.guiltLevel === "Low") player.morality -= 5;
    }
}

function applyTraitShift() {
    if (player.morality >= 20) {
        player.traits.add("Empathetic");
        player.traits.remove("Detached");
    } else if (player.morality <= -20) {
        player.traits.add("Cold");
        player.traits.remove("Empathetic");
    }
    // Decay and reinforce
    decayTraits();
}

function unlockAbility() {
    if (player.morality >= 20) {
        player.abilities.unlock("Harmony Surge");
        log("Unlocked: Harmony Surge – AoE heal + morale boost. Attracts spectral enemies seeking peace.");
    } else if (player.morality <= -20) {
        player.abilities.unlock("Pulse of Silence");
        log("Unlocked: Pulse of Silence – Disables enemy speech and drains resolve; increases player empathy drain.");
    } else if (player.morality >= 10) {
        player.abilities.unlock("Chord of Mercy");
        log("Unlocked: Chord of Mercy – Heals allies and calms enemies.");
    }
}

function evolveWeapons() {
    // Evolve weapons based on use and morality
    foreach (weapon in player.weapons) {
        if (weapon.name === "Echofang" && player.actions.count("backstab") > 4) {
            weapon.evolve("Whisperfang");
            log("Echofang evolved into Whisperfang – can phase through walls.");
        }
        if (weapon.name === "Mercybrand" && player.morality > 15) {
            weapon.evolve("Harmony Surge");
            log("Mercybrand evolved into Harmony Surge – heals all in radius, triggers empathy aura.");
        }
        // Haunt level triggers
        if (weapon.hauntLevel > 7) {
            weapon.addTrait("Spectral Ricochet");
            UI.distort("weapon");
            audio.play("HauntWhisper");
            log("Weapon cursed: Spectral Ricochet unlocked.");
        }
    }
}

function decayTraits() {
    foreach (trait in player.traits) {
        trait.duration -= deltaTime;
        if (trait.duration <= 0 && !player.actions.reinforce(trait.name)) {
            player.traits.remove(trait.name);
            log("Trait faded: " + trait.name);
        }
    }
}

function updateCodex() {
    codex.update("PlayerPath", player.morality);
    codex.update("RegretLog", player.guilt);
}

function triggerMoralityFX() {
    if (player.morality > 10) {
        VFX.play("LightPulse");
        Audio.play("MercyChord");
        UI.skinSync("Radiant Gleam");
    } else if (player.morality < -10) {
        VFX.play("DarkRipple");
        Audio.play("SilencePulse");
        UI.skinSync("Shadow Veil");
    }
}

function synchronizeArsenal() {
    foreach (weapon in player.vaultArsenal) {
        weapon.syncEmotion(player.dominantEmotion);
        if (weapon.isMirrorLinked && !player.isMoral()) {
            weapon.lock();
            log("Mirror-linked weapon refuses to fire due to negative morality.");
        }
    }
    // Sin Scanner integration
    if (player.tools.contains("Sin Scanner")) {
        foreach (npc in scene.npcs) {
            npc.guiltLevel = SinScanner.scan(npc);
            UI.displayScannerFeedback(npc.guiltLevel);
        }
    }
}

// --- NPC & MAP DYNAMICS ---

function updateNPCReactions() {
    foreach (npc in scene.npcs) {
        if (player.abilities.contains("Pulse of Silence")) {
            npc.dialogue.override("...Why can't I speak?");
            npc.traits.add("Fearful");
        } else if (player.abilities.contains("Chord of Mercy") || player.abilities.contains("Harmony Surge")) {
            npc.dialogue.override("You radiate something... kind.");
            npc.traits.add("Trusting");
        }
        if (npc.guiltLevel === "High" && player.tools.contains("Sin Scanner")) {
            npc.behavior = "Nervous";
            UI.highlightNPC(npc, "red");
        }
    }
}

function updateMapDynamics() {
    if (player.morality < -10) {
        map.layout.mutate("chaotic");
        map.visibility.reduce(50%);
        map.labels.scramble();
        VFX.play("CorruptionSpread");
    } else if (player.morality > 10) {
        map.layout.stabilize();
        map.revealHiddenPaths();
        VFX.play("HopeReveal");
    }
}

// --- TACTICAL SYSTEMS ---

function handleEmotionalAmmo(weapon) {
    switch (weapon.echoCharge) {
        case "Guilt":
            weapon.tremble();
            log("Weapon trembles before firing due to guilt echo.");
            break;
        case "Fear":
            weapon.boostDamage();
            weapon.decreaseAccuracy();
            break;
        case "Regret":
            weapon.enableSplashAllyDamage();
            break;
        case "Hope":
            weapon.convertMissToHeal();
            break;
    }
    // Haunt level
    if (weapon.hauntLevel > 7) {
        weapon.enableCursedTrait();
        UI.distort("weapon");
    }
}

// --- EMOTION-BASED WEAPON SKINS ---
function updateWeaponSkin(weapon) {
    switch (player.dominantEmotion) {
        case "Anger":
            weapon.skin = "Crimson Fury";
            weapon.applyVFX("GlowingRedVeins");
            break;
        case "Fear":
            weapon.skin = "Shadow Veil";
            weapon.applyVFX("FlickerShadows");
            break;
        case "Joy":
            weapon.skin = "Radiant Gleam";
            weapon.applyVFX("GoldenShimmer");
            break;
        case "Sadness":
            weapon.skin = "Blue Eclipse";
            weapon.applyVFX("MistyAura");
            break;
        default:
            weapon.skin = "Steel Core";
            weapon.applyVFX("None");
            break;
    }
}

// --- SIN SCANNER SYSTEM ---
function useSinScanner(npc) {
    let feedback = SinScanner.scan(npc);
    switch (feedback) {
        case "Low":
            UI.displayScannerFeedback("Echo faint. Soul clean.");
            // Option: spare for bonus empathy XP
            break;
        case "Medium":
            UI.displayScannerFeedback("Echo unstable. Regret detected.");
            // Option: triggers emotional side quest
            break;
        case "High":
            UI.displayScannerFeedback("Echo loud. Sin saturated.");
            // Option: unlocks cursed weapon trait
            break;
    }
}

// --- PLAYER DECISION CONSEQUENCES LOG ---
codex "PlayerPath" {
    onUpdate {
        if (player.morality > 10) {
            entry.text = "You chose compassion. The world remembers your mercy.";
        } else if (player.morality < -10) {
            entry.text = "You silenced the weak. The echoes of fear remain.";
        } else {
            entry.text = "You walked the line. Neither condemned nor redeemed.";
        }
    }
}
codex "RegretLog" {
    onUpdate {
        if (mirror.sum("morality") < -10) {
            entry.text = "You silenced the innocent. The vault remembers.";
        } else if (vault.contains("guilt")) {
            entry.text = "Their voices echo in the dark corners of your mind.";
        }
    }
}

// --- EXAMPLE: NPC "ShadowEcho" ---
npc "ShadowEcho" {
    onEnter {
        if (player.decisions.contains("betrayal")) {
            speak("They begged. You walked away.");
        } else if (player.decisions.contains("violence")) {
            speak("Blood never forgets.");
        }
    }
    behavior = "Haunt";
    visibility = "Flicker";
    movement = "Follow when unseen";
}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EchoesOfJudgmentMission : MonoBehaviour
{
    // --- Mission State ---
    public enum ObjectiveType { SecureEntry, SniperNest, HackTerminal, EscortCivilians, ConfrontShadowEcho }
    public enum Outcome { Undecided, Compassion, Ruthless, Balanced }
    public ObjectiveType currentObjective = ObjectiveType.SecureEntry;
    public Outcome missionOutcome = Outcome.Undecided;

    [Header("References")]
    public PlayerController player;
    public UIManager uiManager;
    public WeaponManager weaponManager;
    public NPCManager npcManager;
    public AudioManager audioManager;
    public VFXManager vfxManager;
    public MapManager mapManager;
    public SinScanner sinScanner;

    // Mission progress
    private int compassionScore = 0;
    private int ruthlessnessScore = 0;

    void Start()
    {
        StartCoroutine(MissionSequence());
    }

    IEnumerator MissionSequence()
    {
        yield return SecureEntryPoint();
        yield return ConfrontSnipers();
        yield return HackTerminal();
        yield return EscortCivilians();
        yield return ConfrontShadowEcho();
        MissionComplete();
    }

    IEnumerator SecureEntryPoint()
    {
        uiManager.SetObjective("Secure Entry Point", "Disable cameras and guards quietly.");
        // Example: Wait for player to disable all cameras/guards
        yield return new WaitUntil(() => player.HasDisabledAll("Camera") && player.HasDisabledAll("Guard"));

        if (!player.AlertedEnemies)
        {
            compassionScore += 2;
            uiManager.ShowMessage("Entry secured, enemy unaware.");
            audioManager.PlaySFX("ObjectiveComplete");
        }
        else
        {
            ruthlessnessScore += 1;
            uiManager.ShowMessage("Entry secured, reinforcements inbound.");
            audioManager.PlaySFX("Alarm");
        }
        currentObjective = ObjectiveType.SniperNest;
        yield return new WaitForSeconds(2f);
    }

    IEnumerator ConfrontSnipers()
    {
        uiManager.SetObjective("Neutralize Sniper's Nest", "Flank, distract, or spare snipers.");
        // Wait for all snipers to be resolved
        yield return new WaitUntil(() => npcManager.AllSnipersResolved());

        foreach (var sniper in npcManager.SniperNPCs)
        {
            if (sniper.WasSpared)
                compassionScore += 2;
            else if (sniper.WasKilledSurrendering)
                ruthlessnessScore += 2;
        }

        currentObjective = ObjectiveType.HackTerminal;
        yield return new WaitForSeconds(2f);
    }

    IEnumerator HackTerminal()
    {
        uiManager.SetObjective("Hack the Terminal", "Access vault under fire. Use cover and squad.");
        // Wait for player to hack terminal
        yield return new WaitUntil(() => player.HasHacked("VaultTerminal"));

        if (player.SquadMorale > 0.8f)
        {
            compassionScore += 1;
            uiManager.ShowMessage("Terminal hacked swiftly. Squad trusts you.");
        }
        else
        {
            ruthlessnessScore += 1;
            uiManager.ShowMessage("Hacked with difficulty. Morale suffers.");
        }
        currentObjective = ObjectiveType.EscortCivilians;
        yield return new WaitForSeconds(2f);
    }

    IEnumerator EscortCivilians()
    {
        uiManager.SetObjective("Escort Civilians", "Guide civilians to safety. High-guilt civilians may panic.");
        sinScanner.Enable();

        // Wait for civilians to reach extraction or perish
        yield return new WaitUntil(() => npcManager.CiviliansEscapedOrDead());

        foreach (var civ in npcManager.CivilianNPCs)
        {
            if (civ.IsAlive)
                compassionScore += 1;
            else
                ruthlessnessScore += 1;
        }

        currentObjective = ObjectiveType.ConfrontShadowEcho;
        yield return new WaitForSeconds(2f);
    }

    IEnumerator ConfrontShadowEcho()
    {
        uiManager.SetObjective("Face ShadowEcho", "Decide: show mercy, threaten, or silence.");
        // Wait for the player to interact and choose a dialogue
        yield return new WaitUntil(() => npcManager.ShadowEchoResolved);
        // Outcome influence
        if (npcManager.ShadowEchoOutcome == NPCManager.ShadowEchoResult.Spared)
            compassionScore += 3;
        else if (npcManager.ShadowEchoOutcome == NPCManager.ShadowEchoResult.Killed)
            ruthlessnessScore += 3;
        yield return null;
    }

    void MissionComplete()
    {
        // Evaluate morality
        int morality = compassionScore - ruthlessnessScore;
        if (morality >= 5)
            missionOutcome = Outcome.Compassion;
        else if (morality <= -5)
            missionOutcome = Outcome.Ruthless;
        else
            missionOutcome = Outcome.Balanced;

        ApplyTraitShift(morality);
        UnlockAbility(morality);
        weaponManager.EvolveWeapons(player, morality);
        npcManager.UpdateNPCReactions(player);
        vfxManager.TriggerMoralityFX(morality);
        mapManager.UpdateMapDynamics(morality);
        uiManager.ShowMissionSummary(missionOutcome);
    }

    void ApplyTraitShift(int morality)
    {
        if (morality >= 5)
        {
            player.AddTrait("Empathetic");
            player.RemoveTrait("Detached");
        }
        else if (morality <= -5)
        {
            player.AddTrait("Cold");
            player.RemoveTrait("Empathetic");
        }
    }

    void UnlockAbility(int morality)
    {
        if (morality >= 5)
            player.UnlockAbility("Harmony Surge");
        else if (morality <= -5)
            player.UnlockAbility("Pulse of Silence");
        else if (morality >= 2)
            player.UnlockAbility("Chord of Mercy");
    }
}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Handles weapon emotion, haunt, and evolution
public class WeaponManager : MonoBehaviour
{
    public List<Weapon> playerWeapons;

    public void EvolveWeapons(PlayerController player, int morality)
    {
        foreach (var weapon in playerWeapons)
        {
            if (weapon.name == "Echofang" && player.GetActionCount("backstab") > 4)
            {
                weapon.Evolve("Whisperfang");
                UIManager.Instance.ShowMessage("Echofang evolved: Whisperfang can phase through walls.");
            }
            if (weapon.name == "Mercybrand" && morality > 5)
            {
                weapon.Evolve("Harmony Surge");
                UIManager.Instance.ShowMessage("Mercybrand evolved: Harmony Surge unlocked.");
            }
            // Haunt Level
            if (weapon.HauntLevel > 7)
            {
                weapon.AddTrait("Spectral Ricochet");
                UIManager.Instance.DistortWeaponUI(weapon);
                AudioManager.Instance.PlaySFX("HauntWhisper");
            }
            // Emotional Ammo
            HandleEmotionalAmmo(weapon, player);
        }
    }

    void HandleEmotionalAmmo(Weapon weapon, PlayerController player)
    {
        switch (weapon.EchoCharge)
        {
            case EchoType.Guilt:
                weapon.Tremble();
                break;
            case EchoType.Fear:
                weapon.BoostDamage().DecreaseAccuracy();
                break;
            case EchoType.Regret:
                weapon.EnableSplashAllyDamage();
                break;
            case EchoType.Hope:
                weapon.ConvertMissToHeal();
                break;
        }
    }
}
using UnityEngine;

public enum EchoType { None, Guilt, Fear, Regret, Hope }

public class Weapon : MonoBehaviour
{
    public string weaponName;
    public int HauntLevel;
    public EchoType EchoCharge;
    public bool IsMirrorLinked;
    public bool Locked;
    public List<string> Traits;

    public void Evolve(string newName)
    {
        weaponName = newName;
        // Visual evolution, stats, etc.
    }

    public void AddTrait(string trait)
    {
        if (!Traits.Contains(trait))
            Traits.Add(trait);
    }

    public void Tremble()
    {
        // Visual shake and SFX
    }

    public Weapon BoostDamage()
    {
        // Increase damage
        return this;
    }

    public Weapon DecreaseAccuracy()
    {
        // Decrease accuracy
        return this;
    }

    public void EnableSplashAllyDamage() { }
    public void ConvertMissToHeal() { }

    public void Lock()
    {
        Locked = true;
        // UI feedback
    }

    public void SyncEmotion(string emotion)
    {
        // Change weapon skin/VFX per emotion
    }
}
using System.Collections.Generic;
using UnityEngine;

public class NPCManager : MonoBehaviour
{
    public enum ShadowEchoResult { None, Spared, Killed }
    public List<NPC> SniperNPCs;
    public List<NPC> CivilianNPCs;
    public bool ShadowEchoResolved;
    public ShadowEchoResult ShadowEchoOutcome;

    public bool AllSnipersResolved()
    {
        foreach (var sniper in SniperNPCs)
            if (!sniper.IsResolved) return false;
        return true;
    }

    public bool CiviliansEscapedOrDead()
    {
        foreach (var civ in CivilianNPCs)
            if (civ.IsAlive && !civ.HasEscaped) return false;
        return true;
    }

    public void UpdateNPCReactions(PlayerController player)
    {
        foreach (var npc in FindObjectsOfType<NPC>())
        {
            if (player.Abilities.Contains("Pulse of Silence"))
            {
                npc.OverrideDialogue("...Why can't I speak?");
                npc.AddTrait("Fearful");
            }
            else if (player.Abilities.Contains("Chord of Mercy") || player.Abilities.Contains("Harmony Surge"))
            {
                npc.OverrideDialogue("You radiate something... kind.");
                npc.AddTrait("Trusting");
            }
        }
    }
}
using System.Collections.Generic;
using UnityEngine;

public class NPC : MonoBehaviour
{
    public bool WasSpared;
    public bool WasKilledSurrendering;
    public bool IsResolved;
    public bool IsAlive;
    public bool HasEscaped;
    public string GuiltLevel;
    public List<string> Traits;

    public void SetBehavior(string behavior) { }
    public void OverrideDialogue(string text) { }
    public void AddTrait(string trait)
    {
        if (!Traits.Contains(trait)) Traits.Add(trait);
    }
}
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public Text objectiveTitle;
    public Text objectiveDetails;
    public GameObject summaryPanel;
    public Text summaryText;
    public static UIManager Instance;

    void Awake() { Instance = this; }

    public void SetObjective(string title, string details)
    {
        objectiveTitle.text = title;
        objectiveDetails.text = details;
    }

    public void ShowMessage(string message)
    {
        // Show popup message (implement as desired)
    }

    public void ShowMissionSummary(EchoesOfJudgmentMission.Outcome outcome)
    {
        summaryPanel.SetActive(true);
        switch (outcome)
        {
            case EchoesOfJudgmentMission.Outcome.Compassion:
                summaryText.text = "You chose mercy and changed the world for the better.";
                break;
            case EchoesOfJudgmentMission.Outcome.Ruthless:
                summaryText.text = "You left echoes of fear and regret across the grid.";
                break;
            default:
                summaryText.text = "You walked the line, neither condemned nor redeemed.";
                break;
        }
    }

    public void DistortWeaponUI(Weapon weapon)
    {
        // Apply distortion VFX to weapon UI
    }
}
using UnityEngine;
using System.Collections.Generic;

public class PlayerController : MonoBehaviour
{
    public List<string> Actions;
    public List<string> DialogueChoices;
    public List<string> Traits;
    public List<string> Abilities;
    public float SquadMorale;

    public void AddTrait(string trait)
    {
        if (!Traits.Contains(trait)) Traits.Add(trait);
    }

    public void RemoveTrait(string trait)
    {
        if (Traits.Contains(trait)) Traits.Remove(trait);
    }

    public void UnlockAbility(string ability)
    {
        if (!Abilities.Contains(ability)) Abilities.Add(ability);
    }

    public bool HasDisabledAll(string type)
    {
        // Implement logic for all of type disabled
        return true;
    }

    public bool AlertedEnemies { get; set; }
    public bool HasHacked(string target) { return true; }
    public int GetActionCount(string action) { return 0; }
    public bool IsMoral() { return true; }
}
using UnityEngine;

public class SinScanner: MonoBehaviour
{
    public void Enable() { }
    public string Scan(NPC npc)
    {
        // Return guilt level: "Low", "Medium", "High"
        return npc.GuiltLevel;
    }
}
using UnityEngine;

public class VFXManager: MonoBehaviour
{
    public void TriggerMoralityFX(int morality)
    {
        if (morality > 5)
            PlayVFX("LightPulse");
        else if (morality < -5)
            PlayVFX("DarkRipple");
    }

    public void PlayVFX(string vfxName)
    {
        // Play named VFX
    }
}
using UnityEngine;

public class MapManager: MonoBehaviour
{
    public void UpdateMapDynamics(int morality)
    {
        if (morality < -5)
        {
            // Mutate map, reduce visibility, scramble labels
        }
        else if (morality > 5)
        {
            // Stabilize map, reveal hidden paths
        }
    }
}
using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using TMPro;

// Example: Full UI prefab wiring for mission, squad, empathy, and cinematic feedback.
public class UIManager : MonoBehaviour
{
    [Header("Mission UI")]
    public TextMeshProUGUI missionTitleText;
    public TextMeshProUGUI missionObjectiveText;
    public Slider moraleSlider;
    public TextMeshProUGUI moraleStatusText;

    [Header("Squad UI")]
    public Transform squadPanel;
    public GameObject squadMemberPrefab; // Prefab with portrait, name, health, empathy slider

    [Header("Dialogue UI")]
    public GameObject dialoguePanel;
    public TextMeshProUGUI dialogueSpeaker;
    public TextMeshProUGUI dialogueText;
    public Button[] dialogueChoices;

    [Header("HUD Feedback")]
    public GameObject alertPanel;
    public TextMeshProUGUI alertText;
    public Image empathyPulse;

    [Header("Cinematic UI")]
    public CanvasGroup blackBars;
    public Animator cinematicTextAnimator;
    public TextMeshProUGUI cinematicText;

    public static UIManager Instance;

    void Awake() { Instance = this; }

    // --- Mission UI ---
    public void SetMissionTitle(string title) => missionTitleText.text = title;
    public void SetObjective(string desc) => missionObjectiveText.text = desc;
    public void SetMorale(float val)
    {
        moraleSlider.value = val;
        moraleStatusText.text = val < 0.4f ? "Low" : val > 0.8f ? "High" : "Normal";
    }

    // --- Squad UI ---
    public void UpdateSquadUI(List<SquadMember> members)
    {
        foreach (Transform child in squadPanel) Destroy(child.gameObject);
        foreach (var member in members)
        {
            var go = Instantiate(squadMemberPrefab, squadPanel);
            go.transform.Find("Portrait").GetComponent<Image>().sprite = member.portrait;
            go.transform.Find("Name").GetComponent<TextMeshProUGUI>().text = member.displayName;
            go.transform.Find("HealthSlider").GetComponent<Slider>().value = member.health;
            go.transform.Find("EmpathySlider").GetComponent<Slider>().value = member.empathy;
        }
    }

    // --- Dialogue UI ---
    public void ShowDialogue(string speaker, string text, string[] choices, System.Action<int> onChoice)
    {
        dialoguePanel.SetActive(true);
        dialogueSpeaker.text = speaker;
        dialogueText.text = text;
        for (int i = 0; i < dialogueChoices.Length; i++)
        {
            if (i < choices.Length)
            {
                dialogueChoices[i].gameObject.SetActive(true);
                dialogueChoices[i].GetComponentInChildren<TextMeshProUGUI>().text = choices[i];
                int idx = i;
                dialogueChoices[i].onClick.RemoveAllListeners();
                dialogueChoices[i].onClick.AddListener(() => { dialoguePanel.SetActive(false); onChoice(idx); });
            }
            else
            {
                dialogueChoices[i].gameObject.SetActive(false);
            }
        }
    }

    // --- HUD Alert/Feedback ---
    public void ShowAlert(string msg, float duration = 1.5f)
    {
        StopAllCoroutines();
        StartCoroutine(AlertRoutine(msg, duration));
    }
    IEnumerator AlertRoutine(string msg, float d)
    {
        alertPanel.SetActive(true);
        alertText.text = msg;
        yield return new WaitForSeconds(d);
        alertPanel.SetActive(false);
    }
    public void PulseEmpathy(Color c)
    {
        empathyPulse.color = c;
        empathyPulse.GetComponent<Animator>().SetTrigger("Pulse");
    }

    // --- Cinematic UI ---
    public void ShowCinematicBars(bool show)
    {
        blackBars.alpha = show ? 1f : 0f;
        blackBars.blocksRaycasts = show;
    }
    public void PlayCinematicText(string text)
    {
        cinematicText.text = text;
        cinematicTextAnimator.SetTrigger("ShowText");
    }
}
using UnityEngine;
using System.Collections.Generic;

public class PlayerController : MonoBehaviour
{
    public List<string> Actions;
    public List<string> DialogueChoices;
    public List<string> Traits;
    public List<string> Abilities;
    public float SquadMorale;

    public void AddTrait(string trait)
    {
        if (!Traits.Contains(trait)) Traits.Add(trait);
    }

    public void RemoveTrait(string trait)
    {
        if (Traits.Contains(trait)) Traits.Remove(trait);
    }

    public void UnlockAbility(string ability)
    {
        if (!Abilities.Contains(ability)) Abilities.Add(ability);
    }

    public bool HasDisabledAll(string type)
    {
        // Implement logic for all types disabled
        return true;
    }

    public bool AlertedEnemies { get; set; }
    public bool HasHacked(string target) { return true; }
    public int GetActionCount(string action) { return 0; }
    public bool IsMoral() { return true; }
}
using UnityEngine;

public class VFXManager: MonoBehaviour
{
    public void TriggerMoralityFX(int morality)
    {
        if (morality > 5)
            PlayVFX("LightPulse");
        else if (morality < -5)
            PlayVFX("DarkRipple");
    }

    public void PlayVFX(string vfxName)
    {
        // Play named VFX
    }
}
using UnityEngine;

public class MapManager: MonoBehaviour
{
    public void UpdateMapDynamics(int morality)
    {
        if (morality < -5)
        {
            // Mutate map, reduce visibility, scramble labels
        }
        else if (morality > 5)
        {
            // Stabilize map, reveal hidden paths
        }
    }
}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

/// <summary>
/// Advanced civilian AI with emergent emotional states, group panic, crowd physics, morale, and interactive behaviors.
/// Integrates with regional ambience, HUD feedback, and cinematic systems.
/// </summary>
public class CivilianBehavior : MonoBehaviour
{
    public enum EmotionState { Calm, Fear, Panic, Resist, Hide, Surrender }
    public EmotionState currentState = EmotionState.Calm;

    [Header("Settings")]
    public float threatDetectRadius = 15f;
    public float panicRadius = 8f;
    public float groupPanicSyncRadius = 6f;
    public float resistChance = 0.1f; // 10% chance to resist instead of flee at panic
    public float hideChance = 0.15f; // Some civilians hide instead of running

    [Header("References")]
    public Animator animator;
    public NavMeshAgent navAgent;
    public AudioSource voiceSource;
    public AudioClip[] panicShouts;
    public AudioClip[] calmChatter;
    public AudioClip[] fearWhispers;
    public ParticleSystem panicEffect;
    public GameObject[] knockableObjects; // For crowd chaos

    private Transform nearestEnemy;
    private float lastStateChangeTime;

    // Social/Group Panic
    private static List<CivilianBehavior> allCivilians = new List<CivilianBehavior>();
    private bool isHidden = false;

    void Awake() { allCivilians.Add(this); }
    void OnDestroy() { allCivilians.Remove(this); }

    void Start()
    {
        if (!navAgent) navAgent = GetComponent<NavMeshAgent>();
        if (!animator) animator = GetComponent<Animator>();
    }

    void Update()
    {
        DetectThreats();
        GroupPanicSync();
        HandleEmotion();
    }

    void DetectThreats()
    {
        nearestEnemy = FindNearestEnemy();
        float nearestDist = nearestEnemy ? Vector3.Distance(transform.position, nearestEnemy.position) : Mathf.Infinity;

        if (nearestDist < panicRadius)
        {
            // Randomly decide to resist, hide, or panic
            float roll = Random.value;
            if (roll < resistChance)
                currentState = EmotionState.Resist;
            else if (roll < resistChance + hideChance)
                currentState = EmotionState.Hide;
            else
                currentState = EmotionState.Panic;
        }
        else if (nearestDist < threatDetectRadius)
        {
            currentState = EmotionState.Fear;
        }
        else
        {
            currentState = EmotionState.Calm;
        }
    }

    void GroupPanicSync()
    {
        // If nearby civilian is panicking, may panic too
        foreach (var civ in allCivilians)
        {
            if (civ != this && Vector3.Distance(transform.position, civ.transform.position) < groupPanicSyncRadius && civ.currentState == EmotionState.Panic)
            {
                if (currentState == EmotionState.Calm && Random.value < 0.33f)
                    currentState = EmotionState.Fear;
                else if (currentState == EmotionState.Fear && Random.value < 0.66f)
                    currentState = EmotionState.Panic;
            }
        }
    }

    void HandleEmotion()
    {
        switch (currentState)
        {
            case EmotionState.Calm:
                Wander();
                PlayChatter();
                animator.SetBool("isRunning", false);
                break;
            case EmotionState.Fear:
                FleeFromThreat();
                PlayWhisper();
                animator.SetBool("isRunning", true);
                break;
            case EmotionState.Panic:
                FleeFromThreat(true);
                PlayPanicShout();
                CrowdChaos();
                animator.SetBool("isRunning", true);
                if (panicEffect && !panicEffect.isPlaying) panicEffect.Play();
                break;
            case EmotionState.Resist:
                ThrowObjectAtEnemy();
                animator.SetTrigger("resist");
                break;
            case EmotionState.Hide:
                if (!isHidden) StartCoroutine(HideInNearbyCover());
                break;
            case EmotionState.Surrender:
                Surrender();
                break;
        }
    }

    Transform FindNearestEnemy()
    {
        float minDist = Mathf.Infinity;
        Transform nearest = null;
        foreach (var enemy in EnemyRegistry.AllEnemies)
        {
            float dist = Vector3.Distance(transform.position, enemy.transform.position);
            if (dist < minDist)
            {
                minDist = dist;
                nearest = enemy.transform;
            }
        }
        return nearest;
    }

    void Wander()
    {
        if (!navAgent.hasPath || navAgent.remainingDistance < 1f)
        {
            Vector3 randomDir = Random.insideUnitSphere * 5f + transform.position;
            NavMeshHit hit;
            if (NavMesh.SamplePosition(randomDir, out hit, 5f, NavMesh.AllAreas))
                navAgent.SetDestination(hit.position);
        }
    }

    void FleeFromThreat(bool isPanic = false)
    {
        if (!nearestEnemy) return;
        Vector3 dir = (transform.position - nearestEnemy.position).normalized;
        Vector3 runTo = transform.position + dir * (isPanic ? 20f : 10f);
        NavMeshHit hit;
        if (NavMesh.SamplePosition(runTo, out hit, 10f, NavMesh.AllAreas))
            navAgent.SetDestination(hit.position);
    }

    void PlayChatter()
    {
        if (voiceSource && !voiceSource.isPlaying && calmChatter.Length > 0)
            voiceSource.PlayOneShot(calmChatter[Random.Range(0, calmChatter.Length)]);
    }

    void PlayWhisper()
    {
        if (voiceSource && !voiceSource.isPlaying && fearWhispers.Length > 0)
            voiceSource.PlayOneShot(fearWhispers[Random.Range(0, fearWhispers.Length)]);
    }

    void PlayPanicShout()
    {
        if (voiceSource && !voiceSource.isPlaying && panicShouts.Length > 0)
            voiceSource.PlayOneShot(panicShouts[Random.Range(0, panicShouts.Length)]);
    }

    void CrowdChaos()
    {
        // Randomly knock over objects nearby
        foreach (var obj in knockableObjects)
        {
            if (Random.value < 0.25f)
            {
                Rigidbody rb = obj.GetComponent<Rigidbody>();
                if (rb) rb.AddForce(Vector3.right * Random.Range(-1f, 1f) * 100f + Vector3.up * 50f);
            }
        }
    }

    void ThrowObjectAtEnemy()
    {
        if (!nearestEnemy) return;
        // Find throwable object
        // This is a simple demo: find the closest knockable object in range
        GameObject bestObj = null;
        float minDist = 4f;
        foreach (var obj in knockableObjects)
        {
            float dist = Vector3.Distance(transform.position, obj.transform.position);
            if (dist < minDist)
            {
                bestObj = obj;
                minDist = dist;
            }
        }
        if (bestObj != null)
        {
            Rigidbody rb = bestObj.GetComponent<Rigidbody>();
            if (rb)
            {
                Vector3 forceDir = (nearestEnemy.position - bestObj.transform.position).normalized;
                rb.AddForce(forceDir * 250f + Vector3.up * 80f, ForceMode.Impulse);
            }
        }
    }

    IEnumerator HideInNearbyCover()
    {
        isHidden = true;
        // Simple: find closest cover tagged "Cover"
        var covers = GameObject.FindGameObjectsWithTag("Cover");
        float minDist = 999f;
        Vector3 hideSpot = transform.position;
        foreach (var cover in covers)
        {
            float dist = Vector3.Distance(transform.position, cover.transform.position);
            if (dist < minDist)
            {
                minDist = dist;
                hideSpot = cover.transform.position;
            }
        }
        navAgent.SetDestination(hideSpot);
        yield return new WaitForSeconds(8f);
        isHidden = false;
        currentState = EmotionState.Calm;
    }

    void Surrender()
    {
        navAgent.isStopped = true;
        animator.SetTrigger("surrender");
        // Optionally: trigger dialogue or gameplay event
    }

    // --- Advanced Features: Morale, Dialogue, and Cinematic Integration ---

    public float morale = 1f; // 0 = broken, 1 = normal, 2 = inspired
    public void ChangeMorale(float delta)
    {
        morale = Mathf.Clamp(morale + delta, 0f, 2f);
        if (morale < 0.3f) currentState = EmotionState.Panic;
        else if (morale > 1.5f) currentState = EmotionState.Resist;
    }

    public void TriggerCinematic(string cinematicName)
    {
        // Call Timeline or cutscene
        Debug.Log($"Triggering cinematic: {cinematicName}");
    }

    public void StartCustomDialogue(string line)
    {
        if (voiceSource)
            voiceSource.PlayOneShot(Resources.Load<AudioClip>("Dialogue/" + line));
    }

    // --- UI and HUD Feedback Integration (Static Example) ---
    public static void BroadcastPanic(Vector3 epicenter, float radius)
    {
        foreach (var civ in allCivilians)
        {
            if (Vector3.Distance(civ.transform.position, epicenter) < radius)
                civ.currentState = EmotionState.Panic;
        }
        // Optionally: trigger HUD warning or crowd FX
        HUDManager.Instance?.ShowAlert("Civilian panic spreading!");
    }
}

/// <summary>
/// Registry helper for enemies (to be managed globally in the scene)
/// </summary>
public static class EnemyRegistry
{
    public static List<Transform> AllEnemies = new List<Transform>();
}

// --- HUDManager Example (UI feedback for civilian events) ---
public class HUDManager: MonoBehaviour
{
    public static HUDManager Instance;
    public Text alertText;
    void Awake() { Instance = this; }

    public void ShowAlert(string msg)
    {
        alertText.text = msg;
        alertText.color = Color.red;
        alertText.CrossFadeAlpha(1f, 0f, true);
        alertText.CrossFadeAlpha(0f, 2f, false);
    }
}
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

/// <summary>
/// Central registry and control for all enemies.
/// Allows queries for nearest, all, squad targeting, and group AI.
/// </summary>
public class EnemyManager : MonoBehaviour
{
    public static EnemyManager Instance;
    public List<EnemyAI> allEnemies = new List<EnemyAI>();
    public Transform player;

    void Awake() { Instance = this; }

    public void Register(EnemyAI ai) { if (!allEnemies.Contains(ai)) allEnemies.Add(ai); }
    public void Unregister(EnemyAI ai) { if (allEnemies.Contains(ai)) allEnemies.Remove(ai); }

    public EnemyAI GetNearestEnemy(Vector3 pos, float maxDist = 999f)
    {
        float min = maxDist; EnemyAI nearest = null;
        foreach (var e in allEnemies)
        {
            if (!e) continue;
            float d = Vector3.Distance(pos, e.transform.position);
            if (d < min) { min = d; nearest = e; }
        }
        return nearest;
    }

    public List<EnemyAI> GetEnemiesInRange(Vector3 pos, float radius)
    {
        var list = new List<EnemyAI>();
        foreach (var e in allEnemies)
            if (e && Vector3.Distance(pos, e.transform.position) <= radius)
                list.Add(e);
        return list;
    }

    // Example: Squad call for reinforcements
    public void CallReinforcements(Vector3 to, int count)
    {
        // Find closest spawner, spawn and send to 'to'
        // Implement as needed
    }

    // Example: Set group alert state
    public void SetGroupAlert(Vector3 pos, float radius, bool alert)
    {
        foreach (var e in GetEnemiesInRange(pos, radius))
            e.SetAlert(alert);
    }
}

/// <summary>
/// Enemy AI base for registration and tactical logic
/// </summary>
public class EnemyAI: MonoBehaviour
{
    void OnEnable() { EnemyManager.Instance?.Register(this); }
    void OnDisable() { EnemyManager.Instance?.Unregister(this); }
    public void SetAlert(bool alert) { /* Handle alert logic */ }
}
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Controls squad members, empathy, and command system.
/// </summary>
public class SquadManager : MonoBehaviour
{
    public List<SquadMember> squad = new List<SquadMember>();
    public Transform player;
    public static SquadManager Instance;

    void Awake() { Instance = this; }

    public void GiveOrder(SquadOrder order, SquadMember target = null)
    {
        foreach (var member in squad)
        {
            if (target == null || member == target)
                member.ReceiveOrder(order);
        }
        UIManager.Instance?.ShowAlert($"Squad ordered: {order}");
    }

    public void UpdateEmpathy()
    {
        float avgEmpathy = 0;
        foreach (var m in squad) avgEmpathy += m.empathy;
        avgEmpathy /= squad.Count;
        UIManager.Instance.SetMorale(avgEmpathy);
    }
}

public enum SquadOrder { Hold, Advance, Flank, Regroup, Heal, Empathize }

[System.Serializable]
public class SquadMember
{
    public string displayName;
    public Sprite portrait;
    public float health;
    public float empathy;
    public GameObject characterObject;

    public void ReceiveOrder(SquadOrder order)
    {
        // Implement tactical and empathy responses
    }
}
