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

                                            
