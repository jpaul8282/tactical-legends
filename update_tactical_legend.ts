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
/// Controls squad members, empathy, and the command system.
/// </summary>
public class SquadManager: MonoBehaviour
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
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Handles direct empathy gain/loss events and UI feedback.
/// </summary>
public class EmpathySystem: MonoBehaviour
{
    public PlayerController player;
    public SquadManager squadMgr;
    public float empathy { get; private set; }

    public void GainEmpathy(float amt)
    {
        empathy += amt;
        UIManager.Instance.PulseEmpathy(Color.cyan);
        squadMgr.UpdateEmpathy();
    }

    public void LoseEmpathy(float amt)
    {
        empathy -= amt;
        UIManager.Instance.PulseEmpathy(Color.red);
        squadMgr.UpdateEmpathy();
    }

    public void OnSquadAction(SquadOrder order)
    {
        // Gain or lose empathy based on command
        switch (order)
        {
            case SquadOrder.Empathize: GainEmpathy(0.05f); break;
            case SquadOrder.Heal: GainEmpathy(0.02f); break;
            case SquadOrder.Advance: LoseEmpathy(0.01f); break;
        }
    }
}
using UnityEngine;
using UnityEngine.Playables;

/// <summary>
/// Triggers Timeline cutscenes with Cinemachine support and UI integration.
/// </summary>
public class TimelineCutsceneTrigger: MonoBehaviour
{
    public PlayableDirector director;
    public CanvasGroup cinematicUI;
    public string[] cinematicLines;
    public float cinematicTextDisplayTime = 3f;

    void Start()
    {
        if (director == null) director = GetComponent<PlayableDirector>();
    }

    public void PlayCutscene()
    {
        StartCoroutine(PlayCinematicSequence());
    }

    IEnumerator PlayCinematicSequence()
    {
        UIManager.Instance.ShowCinematicBars(true);
        director.Play();
        foreach (string line in cinematicLines)
        {
            UIManager.Instance.PlayCinematicText(line);
            yield return new WaitForSeconds(cinematicTextDisplayTime);
        }
        UIManager.Instance.ShowCinematicBars(false);
    }
}
using UnityEngine;
using UnityEngine.Playables;
using Cinemachine;

/// <summary>
/// Automatically binds Cinemachine and audio tracks on Timeline for cutscenes.
/// </summary>
public class PlayableDirectorAutoBinder: MonoBehaviour
{
    public PlayableDirector director;
    public CinemachineVirtualCamera cineCam;
    public AudioSource narratorAudioSource;

    void Awake()
    {
        if (director == null) director = GetComponent<PlayableDirector>();
        if (cineCam != null)
            director.SetGenericBinding("Cinemachine Track", cineCam);
        if (narratorAudioSource != null)
            director.SetGenericBinding("Audio Track", narratorAudioSource);
    }
}
using UnityEngine;

/// <summary>
/// Example controller for player-issued squad commands and empathy choices.
/// </summary>
public class SquadLeaderCommandIntegration: MonoBehaviour
{
    public SquadManager squadManager;
    public EmpathySystem empathySystem;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.H)) // Hold
            squadManager.GiveOrder(SquadOrder.Hold);
        if (Input.GetKeyDown(KeyCode.F)) // Flank
            squadManager.GiveOrder(SquadOrder.Flank);
        if (Input.GetKeyDown(KeyCode.E)) // Empathize
        {
            squadManager.GiveOrder(SquadOrder.Empathize);
            empathySystem.GainEmpathy(0.05f);
            UIManager.Instance.ShowAlert("You encouraged your squad. Empathy up!", 1.2f);
        }
    }
}
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Playables;
using UnityEngine.Timeline;

/// <summary>
/// Ultra-Realistic Campaign Branching Manager with animation triggers, slow-mo cam,
/// and per-kill bloody FX. Tracks morality, faction trust, squad traits, wounds, 
/// casualties, kill styles, and integrates with cinematic and FX systems.
/// </summary>
public class CampaignBranchingManager : MonoBehaviour
{
    public int globalMorality;
    public Dictionary<string, int> factionTrust = new();
    public Dictionary<string, TraitType> squadTraits = new();
    public Dictionary<string, int> squadWounds = new();
    public int totalCasualties = 0;
    public int brutalKills = 0;
    public int mercyEvents = 0;
    public List<string> fallenSquadMembers = new();
    public List<string> bloodiedMissionLogs = new();

    [Header("Blood/Gore FX")]
    public GameObject bloodSplatterPrefab;
    public GameObject limbPrefab;
    public AudioClip[] goreAudioClips;
    public ParticleSystem bloodMistFX;
    public Animator screenAnimator; // For screen blood/impact FX
    public RuntimeAnimatorController killAnimController;
    
    [Header("Slow-Mo & Cinematic")]
    public Camera mainCam;
    public float slowMoDuration = 1.25f;
    public float slowMoTimeScale = 0.18f;
    public PlayableDirector timelineDirector;
    public TimelineAsset killCamTimeline;

    [Header("UI")]
    public UIManager uiManager;

    // --- Record outcome with advanced realism ---
    public void RecordMissionOutcome(
        int moralityDelta, 
        Dictionary<string, TraitType> newTraits, 
        string faction, 
        int factionDelta,
        int casualties, 
        int brutalKillsDelta, 
        int mercyDelta, 
        List<string> deaths, 
        bool wasBloody = false)
    {
        globalMorality += moralityDelta;
        factionTrust[faction] = Mathf.Clamp(factionTrust.GetValueOrDefault(faction) + factionDelta, 0, 100);

        foreach (var trait in newTraits)
            squadTraits[trait.Key] = trait.Value;

        totalCasualties += Mathf.Max(0, casualties);
        brutalKills += Mathf.Max(0, brutalKillsDelta);
        mercyEvents += Mathf.Max(0, mercyDelta);

        foreach (var name in deaths)
        {
            if (!fallenSquadMembers.Contains(name))
                fallenSquadMembers.Add(name);
        }

        foreach (var trait in newTraits)
        {
            if (trait.Value == TraitType.Wounded)
                squadWounds[trait.Key] = squadWounds.GetValueOrDefault(trait.Key) + 1;
        }

        if (wasBloody)
        {
            var log = $"Mission ended in carnage. {brutalKillsDelta} brutal kills. {casualties} casualties.";
            bloodiedMissionLogs.Add(log);
            uiManager?.ShowBloodSplash();
            TriggerBloodyFX();
        }
    }

    public void UnlockNextMission()
    {
        if (globalMorality >= 80 && factionTrust.GetValueOrDefault("Echo Ascendants") > 80 && brutalKills == 0 && mercyEvents > 5)
        {
            MissionLoader.Load("Operation: Pax Virtus");
        }
        else if (globalMorality >= 50 && factionTrust.GetValueOrDefault("Echo Ascendants") > 60)
        {
            MissionLoader.Load("Operation: Dawn Accord");
        }
        else if (globalMorality <= -30 && brutalKills > 5)
        {
            MissionLoader.Load("Operation: Crimson Descent");
        }
        else if (globalMorality < 0)
        {
            MissionLoader.Load("Operation: Echo Collapse");
        }
        else
        {
            MissionLoader.Load("Operation: Grey Protocol");
        }
    }

    public void PlayEpilogueTheme()
    {
        if (globalMorality > 75 && brutalKills < 2)
            AudioManager.Play("theme_hope_rising");
        else if (globalMorality < -50 && brutalKills > 10)
            AudioManager.Play("theme_twilight_war_bloody");
        else if (totalCasualties > 10 || fallenSquadMembers.Count > 3)
            AudioManager.Play("theme_bittersweet_loss");
        else
            AudioManager.Play("theme_fragile_peace");
    }

    // --- Per-Kill Bloody FX and Animation Triggers ---
    public void OnKill(Vector3 killPosition, bool isBrutal, bool isMercy, Transform victim = null)
    {
        if (isBrutal)
        {
            brutalKills++;
            TriggerPerKillBloodyFX(killPosition, victim);
            TriggerSlowMoKillCam(killPosition, victim);
            if (screenAnimator) screenAnimator.SetTrigger("BloodSplash");
            if (timelineDirector && killCamTimeline)
            {
                timelineDirector.playableAsset = killCamTimeline;
                timelineDirector.Play();
            }
            uiManager?.ShowAlert("Brutal Execution!", 1.2f);
        }
        else if (isMercy)
        {
            mercyEvents++;
            uiManager?.PulseEmpathy(Color.cyan);
        }
        else
        {
            // Standard kill effect (optional)
            TriggerStandardBloodFX(killPosition);
        }
    }

    void TriggerPerKillBloodyFX(Vector3 pos, Transform victim)
    {
        // Blood splatter at kill position
        if (bloodSplatterPrefab)
        {
            var splat = Instantiate(bloodSplatterPrefab, pos, Quaternion.LookRotation(-mainCam.transform.forward));
            Destroy(splat, 4f);
        }
        // Play gore SFX
        if (goreAudioClips != null && goreAudioClips.Length > 0)
        {
            AudioSource.PlayClipAtPoint(goreAudioClips[Random.Range(0, goreAudioClips.Length)], pos);
        }
        // Limb fly-off for certain brutal kills
        if (limbPrefab && Random.value > 0.6f)
        {
            Vector3 spawnPos = pos + Vector3.up * 0.5f;
            var limb = Instantiate(limbPrefab, spawnPos, Random.rotation);
            Rigidbody rb = limb.GetComponent<Rigidbody>();
            if (rb) rb.AddForce((mainCam.transform.forward + Vector3.up * 0.7f) * Random.Range(6f, 12f), ForceMode.Impulse);
            Destroy(limb, 3.5f);
        }
        // Blood mist particle burst
        if (bloodMistFX)
        {
            bloodMistFX.transform.position = pos;
            bloodMistFX.Play();
        }
        // Animation trigger on victim (ragdoll, death anim)
        if (victim && killAnimController)
        {
            Animator victimAnim = victim.GetComponent<Animator>();
            if (victimAnim)
            {
                victimAnim.runtimeAnimatorController = killAnimController;
                victimAnim.SetTrigger("BrutalDeath");
            }
        }
    }

    void TriggerStandardBloodFX(Vector3 pos)
    {
        if (bloodMistFX)
        {
            bloodMistFX.transform.position = pos;
            bloodMistFX.Play();
        }
    }

    // --- Slow-Mo Kill Cam ---
    public void TriggerSlowMoKillCam(Vector3 focusPoint, Transform target = null)
    {
        StartCoroutine(SlowMoRoutine(focusPoint, target));
    }

    IEnumerator SlowMoRoutine(Vector3 focus, Transform target)
    {
        // Focus camera on kill point
        if (mainCam)
        {
            Vector3 camTarget = focus + Vector3.up * 1f;
            mainCam.transform.LookAt(camTarget);
        }
        float oldTimeScale = Time.timeScale;
        Time.timeScale = slowMoTimeScale;
        Time.fixedDeltaTime = 0.02f * Time.timeScale;
        yield return new WaitForSecondsRealtime(slowMoDuration);
        Time.timeScale = oldTimeScale;
        Time.fixedDeltaTime = 0.02f;
    }

    // --- Mission bloody/carnage FX for mission outcomes ---
    public void TriggerBloodyFX()
    {
        // Spawn blood splatter at random positions on UI/camera
        if (bloodSplatterPrefab != null)
        {
            for (int i = 0; i < Random.Range(3, 7); i++)
            {
                var pos = mainCam.transform.position + mainCam.transform.forward * 2f + Random.insideUnitSphere;
                Instantiate(bloodSplatterPrefab, pos, Quaternion.LookRotation(-mainCam.transform.forward));
            }
        }
        // Play gore SFX
        if (goreAudioClips != null && goreAudioClips.Length > 0)
        {
            var clip = goreAudioClips[Random.Range(0, goreAudioClips.Length)];
            AudioSource.PlayClipAtPoint(clip, mainCam.transform.position);
        }
        // Extra: limb for mission carnage
        if (limbPrefab != null && brutalKills > 0)
        {
            var pos = mainCam.transform.position + mainCam.transform.forward * 3f;
            var limb = Instantiate(limbPrefab, pos, Random.rotation);
            Rigidbody rb = limb.GetComponent<Rigidbody>();
            if (rb) rb.AddForce(Random.onUnitSphere * 7f, ForceMode.Impulse);
            Destroy(limb, 4f);
        }
        // Blood mist effect
        if (bloodMistFX != null)
        {
            bloodMistFX.transform.position = mainCam.transform.position + mainCam.transform.forward * 2f;
            bloodMistFX.Play();
        }
        // Extra: screen blood animation
        if (screenAnimator) screenAnimator.SetTrigger("BloodSplash");
    }

    // --- Squad trait and mission logs ---
    public string GetSquadTraitSummary()
    {
        List<string> summary = new();
        foreach (var trait in squadTraits)
        {
            summary.Add($"{trait.Key}: {trait.Value}" + 
                (squadWounds.ContainsKey(trait.Key) ? $" (Wounds: {squadWounds[trait.Key]})" : ""));
        }
        return string.Join("\n", summary);
    }

    public string GetBloodyMissionLog()
    {
        return string.Join("\n", bloodiedMissionLogs);
    }

    // --- UIManager hook for blood splash on screen ---
    public class UIManager : MonoBehaviour
    {
        public GameObject bloodOverlay;
        public void ShowBloodSplash()
        {
            if (bloodOverlay)
            {
                bloodOverlay.SetActive(true);
                StartCoroutine(FadeBlood());
            }
        }

        IEnumerator FadeBlood()
        {
            yield return new WaitForSeconds(1.5f);
            bloodOverlay.SetActive(false);
        }

        public void ShowAlert(string msg, float duration = 1.5f)
        {
            // Show pop-up or overlay alert
        }

        public void PulseEmpathy(Color c)
        {
            // HUD effect
        }
    }

    // Example trait type enum
    public enum TraitType { Brave, Cautious, Wounded, Ruthless, Compassionate, Hardened }
}
Particle System Asset Tips
A. Blood/Gore Particle System
Start with Unity’s built-in Particle System:
Shape: Use Cone for spray, Sphere for burst, or Mesh for custom splatter.
Start Color: Deep red (#6a0707) with alpha and randomization.
Start Size: 0.1–0.25 for mist, 0.3–0.7 for thick splats.
Start Speed: 4–12 for spurts, 1–3 for drips.
Gravity Modifier: 1.5–3 to get fast, heavy drops.
Collision: Enable and “Send Collision Messages” for splatter on surfaces.
Sub Emitters: On Collision, spawn secondary “splat” or “mist” systems.
Texture: Use a splatter sprite (Alpha blended or additive); try free assets like Kenney’s Blood Particle Pack.
Example:
Main system: Fast, short-lived red particles (spurts).
Sub-emitter: On collision, burst out flat, sticky blood splats (use “Trails” for drips).
B. Limb/Organ FX
Use ragdoll limbs with blood particle prefab attached.
Animate limb separation with physics force and a “blood spurter” ParticleSystem on the stump.
C. Screen Blood Overlays
Use a UI Canvas with an Image for splats.
Animate alpha/pulse/fade with Animator or scripts.
For pooling, use several overlays and cycle through on repeated impacts.
2. Animation Controller Setups
A. Victim Animations
Animator Parameters:

Trigger: "BrutalDeath", "MercyDeath", "StandardDeath"
Float: "DeathType" (0: Standard, 1: Brutal, 2: Mercy)
Animation Clips:

Standard Death: Collapse or ragdoll.
Brutal Death: Over-the-top reaction, body part detachment, extra force.
Mercy Death: Slow, peaceful collapse, eyes close.
Layered Animations:

Use an “UpperBody” layer for flailing, or “Facial” layer for pain expressions.
Ragdoll Blending:

Transition from death anim to ragdoll for realistic collapse.
Use Unity’s Ragdoll Utility or assets like PuppetMaster.
Animator Controller Example:

Any State → BrutalDeath (trigger) → RagdollBlend
Any State → MercyDeath (trigger)
Any State → StandardDeath (trigger)
3. Cinematic Refinements
A. Timeline (PlayableDirector)
Sequence brutal kills:

Timeline Track 1: Virtual Camera (Dolly or Aim at kill position)
Timeline Track 2: Animation Track (trigger “BrutalDeath” on victim)
Timeline Track 3: Particle Activation Track (blood FX prefab)
Timeline Track 4: Audio Track (gore SFX, heartbeat slow-down)
Timeline Track 5: Post-Processing (add blur, chromatic aberration, vignette)
Timeline Track 6: UI Activation (screen blood overlay, slow-mo text)
KillCam Slow-Mo:

Use Cinemachine for dynamic camera movement (e.g., bullet follow, orbit around victim, time dilation).
Keyframe Time.timeScale on Timeline for smooth slow-mo.
Signal Tracks:

Place Signal markers to call methods (e.g., OnBrutalKillStart, OnKillCamEnd).
B. Camera Tricks
Quick Cut: On impact, cut to a close-up camera on the wound.
Shake: Add CinemachineImpulseSource for camera shake on brutal hits.
Post-Process: Add extra bloom, red tint, lens distortion for disorientation.
C. UI/Cinematic Integration
Animate blood overlays, pulse vignette, and slow-down “BRUTAL KILL” text.
Use custom fonts and sound for kill confirmations.
4. Extra Tips & Asset Suggestions
Assets:

Blood Particle Pack (Kenney)
Stylized Blood FX (Asset Store)
Easy Decal for splat stickers.
Code: Animator Trigger Example

C#
// Trigger kill animation and ragdoll
victimAnimator.SetTrigger("BrutalDeath");
// After anim event:
victim.GetComponent<RagdollManager>().ActivateRagdoll();
Summary Checklist
 Particles: blood spurts, mist, splat, limb FX
 Animation: Death triggers, ragdoll, facial layers
 Timeline: Cinematic killcam, slow-mo, SFX, camera
 UI: Blood overlays, pulse, text, sound
 Camera: Shake, post-process, cut/orbit
 Asset ready: Blood sprites, gore sounds, limb models

 using UnityEngine;
using UnityEngine.Playables;
using UnityEngine.Timeline;
using UnityEngine.UI;
using Cinemachine;
using UnityEngine.Rendering.PostProcessing;

/// <summary>
/// CinematicManager: Enhanced gameplay-ready controller for cinematics, killcams, camera shake,
/// post-processing FX, advanced Cinemachine blending, Timeline signals, and UI overlays.
/// </summary>
public class CinematicManager : MonoBehaviour
{
    [Header("Timeline & Cinemachine")]
    public PlayableDirector director;
    public TimelineAsset[] cinematics; // Assign in Inspector
    public Camera mainCamera;
    public CinemachineVirtualCamera killCam;
    public CinemachineVirtualCamera defaultCam;
    public float killCamBlendTime = 0.7f;

    [Header("Cinemachine Camera Shake")]
    public CinemachineImpulseSource impulseSource; // Attach to killCam for shake

    [Header("Post-Processing")]
    public PostProcessVolume postProcessVolume;
    public float maxVignette = 0.55f;
    public float vignetteFadeTime = 0.5f;
    private Vignette vignette;

    [Header("UI Overlays")]
    public CanvasGroup cinematicBars;
    public Text cinematicSubtitle;
    public Image bloodOverlay;
    public Animator hudAnimator;

    [Header("Audio/FX")]
    public AudioSource cinematicAudioSource;
    public AudioClip[] cinematicAudioClips;
    public ParticleSystem cinematicVFX;
    public float slowMoTimeScale = 0.1f;
    public float slowMoDuration = 2.0f;

    // Animator for victim death poses
    [Header("Animators")]
    public RuntimeAnimatorController specialDeathController;

    public static CinematicManager Instance { get; private set; }
    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
        if (postProcessVolume)
            postProcessVolume.profile.TryGetSettings(out vignette);
    }

    public void PlayCinematic(string cinematicName, string subtitle = "", bool useSlowMo = false)
    {
        TimelineAsset timeline = GetCinematicByName(cinematicName);
        if (timeline == null)
        {
            Debug.LogWarning("Cinematic not found: " + cinematicName);
            return;
        }
        ShowCinematicBars(true);
        ShowSubtitle(subtitle);
        PlayCinematicAudio(cinematicName);
        PlayCinematicVFX();
        director.playableAsset = timeline;
        director.time = 0;
        director.Play();
        if (useSlowMo)
            StartCoroutine(SlowMoRoutine());
        if (hudAnimator) hudAnimator.SetTrigger("CinematicIn");
    }

    /// <summary>
    /// Plays an advanced kill cam sequence with shake, postFX, Cinemachine blend, Timeline signals, and special animations.
    /// </summary>
    public void PlayKillCam(Vector3 focusPoint, Transform victim = null, float duration = 1.5f)
    {
        ShowCinematicBars(true);
        PlayBloodOverlay();
        if (killCam && mainCamera)
        {
            killCam.transform.position = mainCamera.transform.position;
            killCam.transform.LookAt(focusPoint + Vector3.up * 0.9f);
            killCam.Priority = 20;
            defaultCam.Priority = 10;
        }
        StartCoroutine(KillCamBlendRoutine(duration, victim, focusPoint));
    }

    // --- Helper Methods ---

    TimelineAsset GetCinematicByName(string cinematicName)
    {
        foreach (var t in cinematics)
            if (t != null && t.name == cinematicName)
                return t;
        return null;
    }

    void ShowCinematicBars(bool show)
    {
        if (!cinematicBars) return;
        cinematicBars.alpha = show ? 1 : 0;
        cinematicBars.blocksRaycasts = show;
    }

    void ShowSubtitle(string text)
    {
        if (cinematicSubtitle)
        {
            cinematicSubtitle.gameObject.SetActive(!string.IsNullOrEmpty(text));
            cinematicSubtitle.text = text;
        }
    }

    void PlayCinematicAudio(string cinematicName)
    {
        if (!cinematicAudioSource || cinematicAudioClips == null) return;
        foreach (var clip in cinematicAudioClips)
        {
            if (clip != null && clip.name == cinematicName)
            {
                cinematicAudioSource.clip = clip;
                cinematicAudioSource.Play();
                break;
            }
        }
    }

    void PlayCinematicVFX()
    {
        if (cinematicVFX) cinematicVFX.Play();
    }

    IEnumerator SlowMoRoutine(float customDuration = -1f)
    {
        float oldTimeScale = Time.timeScale;
        float d = (customDuration > 0) ? customDuration : slowMoDuration;
        Time.timeScale = slowMoTimeScale;
        Time.fixedDeltaTime = 0.02f * Time.timeScale;
        yield return new WaitForSecondsRealtime(d);
        Time.timeScale = oldTimeScale;
        Time.fixedDeltaTime = 0.02f;
        ShowCinematicBars(false);
        FadeVignette(0f);
    }

    void PlayBloodOverlay()
    {
        if (bloodOverlay)
        {
            bloodOverlay.gameObject.SetActive(true);
            bloodOverlay.CrossFadeAlpha(1f, 0.1f, false);
            bloodOverlay.CrossFadeAlpha(0f, 1.2f, false);
        }
    }

    IEnumerator KillCamBlendRoutine(float duration, Transform victim, Vector3 focusPoint)
    {
        // Cinemachine blend: blend to killCam, then back to default after duration
        if (postProcessVolume && vignette != null) FadeVignette(maxVignette);
        if (impulseSource) impulseSource.GenerateImpulse(2.5f);

        // Special victim animation trigger for cinematic
        if (victim && specialDeathController)
        {
            Animator victimAnim = victim.GetComponent<Animator>();
            if (victimAnim)
            {
                victimAnim.runtimeAnimatorController = specialDeathController;
                victimAnim.SetTrigger("BrutalDeath");
            }
        }

        // Optionally, play a Timeline with signals (e.g., for extra FX or UI events)
        if (director && director.playableAsset is TimelineAsset timeline)
        {
            director.Play(timeline);
        }

        yield return StartCoroutine(SlowMoRoutine(duration));

        // Blend camera priorities back
        if (killCam) killCam.Priority = 10;
        if (defaultCam) defaultCam.Priority = 20;

        // Restore vignette
        FadeVignette(0f);
    }

    void FadeVignette(float target)
    {
        if (vignette == null) return;
        StopAllCoroutines();
        StartCoroutine(FadeVignetteRoutine(target));
    }

    IEnumerator FadeVignetteRoutine(float target)
    {
        float t = 0;
        float start = vignette.intensity.value;
        float duration = vignetteFadeTime;
        while (t < duration)
        {
            t += Time.unscaledDeltaTime;
            vignette.intensity.value = Mathf.Lerp(start, target, t / duration);
            yield return null;
        }
        vignette.intensity.value = target;
    }

    public void EndCinematic()
    {
        ShowCinematicBars(false);
        ShowSubtitle("");
        if (cinematicAudioSource && cinematicAudioSource.isPlaying)
            cinematicAudioSource.Stop();
        if (hudAnimator) hudAnimator.SetTrigger("CinematicOut");
        if (killCam) killCam.Priority = 10;
        if (defaultCam) defaultCam.Priority = 20;
        FadeVignette(0f);
    }
}
# Companion Timeline & Signal Setup for CinematicManager

## 1. Create Timeline Asset
- In Unity, create a Timeline Asset (e.g., `KillCamTimeline.playable`).
- Add tracks:
    - Cinemachine Track: Bind to `killCam` (showcases kill from dramatic angle).
    - Animation Track: Bind to victim's Animator. Trigger "BrutalDeath" or other custom poses.
    - Activation Track: For blood VFX, UI overlays, etc.
    - Audio Track: Gore SFX, slow-mo SFX.
    - Signal Track: For events (see below).
    - PostProcess Track: Animate vignette, chromatic aberration, etc.

## 2. Signal Setup
- Create Signal Assets for:
    - StartKillCam
    - PlayBloodFX
    - TriggerCameraShake
    - ShowKillText
    - EndCinematic

- Attach a `SignalReceiver` to an object in scene (e.g., CinematicManager).
- Hook methods (e.g., `PlayBloodOverlay`, `EndCinematic`) to the signal events.

## 3. UI Prefab Hierarchy
- Canvas (Screen Space Overlay)
    - CinematicBars (CanvasGroup)
        - TopBar (Image, black)
        - BottomBar (Image, black)
    - CinematicSubtitle (Text or TextMeshProUGUI)
    - BloodOverlay (Image, red splat, alpha 0 initially)
    - HUDAnimator (Animator for UI effects)
    - Any additional overlay for "BRUTAL KILL" text, pulse FX, etc.

## 4. Post-Processing
- Add PostProcessVolume to scene/camera.
- Add Vignette, Chromatic Aberration, Bloom for dramatic kills.
- Assign `postProcessVolume` in CinematicManager.

## 5. Cinemachine Setup
- Place two Virtual Cameras:
    - `defaultCam`: Normal gameplay.
    - `killCam`: Special killcam, higher priority during kill, animated in Timeline.
- Use Cinemachine Impulse Source for camera shake.
- Set priorities via code in CinematicManager.

## 6. Usage in Game
- Call `CinematicManager.Instance.PlayKillCam(focus, victim)` brutal kill event.
- Timeline will handle advanced camera, animation, FX, and UI via Signals.
- Call `CinematicManager.Instance.EndCinematic()` from Timeline signal or after cutscene.

using UnityEngine;
using System.Collections.Generic;

/// <summary>
/// ConflictEscalation: Dynamically escalates conflict in a level based on player and world actions,
/// with environmental, AI, audio, visual, and gameplay consequences for each phase.
/// </summary>
public class ConflictEscalation : MonoBehaviour
{
    public enum AlertPhase { Peaceful, Alert, Skirmish, Warzone, Catastrophe }

    [Header("Conflict State")]
    public AlertPhase alertLevel = AlertPhase.Peaceful;
    public int civilianCasualties = 0;
    public int militaryCasualties = 0;
    public string dominantFaction = "Neutral";
    public float escalationTimer = 0f;
    public float catastropheThreshold = 1200f; // 20 minutes for worst-case

    [Header("World References")]
    public AudioSource ambienceSource;
    public AudioClip[] escalationMusic; // Peaceful, Alert, Skirmish, Warzone, Catastrophe
    public GameObject checkpointPrefab;
    public GameObject eliteUnitPrefab;
    public Transform[] checkpointPositions;
    public Transform[] eliteSpawnPoints;
    public GameObject airStrikeVFX;
    public Camera mainCam;
    public ParticleSystem chaosParticles;

    [Header("UI & Feedback")]
    public CanvasGroup alertUI;
    public UnityEngine.UI.Text alertText;
    public Animator screenShakeAnimator;
    public GameObject crowdPanicVFX;
    public List<string> eventLog = new();

    private bool catastropheTriggered = false;

    void Update()
    {
        MonitorEvents();
        AdjustAlertLevel();
        escalationTimer += Time.deltaTime;
    }

    void MonitorEvents()
    {
        // Civilian deaths escalate conflict
        if (civilianCasualties > 3 && alertLevel < AlertPhase.Alert)
        {
            SetAlertLevel(AlertPhase.Alert, "Civilian casualties rising!");
        }
        if (militaryCasualties > 4 && alertLevel < AlertPhase.Skirmish)
        {
            SetAlertLevel(AlertPhase.Skirmish, "Military units lost. Skirmishes erupt!");
        }
        // Prolonged conflict or strong faction control
        if (escalationTimer > 600 && dominantFaction != "Neutral" && alertLevel < AlertPhase.Warzone)
        {
            SetAlertLevel(AlertPhase.Warzone, $"{dominantFaction} dominance! All-out war!");
        }
        // Catastrophe: max escalation, time or mass casualties
        if ((escalationTimer > catastropheThreshold || civilianCasualties > 12 || militaryCasualties > 8) 
            && !catastropheTriggered)
        {
            SetAlertLevel(AlertPhase.Catastrophe, "CATASTROPHE! City collapse imminent!");
            catastropheTriggered = true;
        }
    }

    void AdjustAlertLevel()
    {
        switch (alertLevel)
        {
            case AlertPhase.Peaceful:
                SetAmbience(0);
                HideAlertUI();
                break;
            case AlertPhase.Alert:
                SetAmbience(1);
                ShowAlertUI("Tension Rising", Color.yellow);
                TriggerEvent("FactionTensionRise");
                break;
            case AlertPhase.Skirmish:
                SetAmbience(2);
                ShowAlertUI("Skirmishes Breaking Out", Color.red);
                ActivateCheckpoints();
                CrowdPanic();
                break;
            case AlertPhase.Warzone:
                SetAmbience(3);
                ShowAlertUI("WARZONE!", Color.red);
                DeployEliteUnits();
                BroadcastWarning();
                CameraShake();
                break;
            case AlertPhase.Catastrophe:
                SetAmbience(4);
                ShowAlertUI("CATASTROPHE!", Color.magenta);
                TriggerCatastropheEvents();
                break;
        }
    }

    void SetAlertLevel(AlertPhase newLevel, string logMsg)
    {
        if (alertLevel != newLevel)
        {
            alertLevel = newLevel;
            eventLog.Add($"{Time.timeSinceLevelLoad:F1}s: {logMsg}");
            Debug.Log(logMsg);
        }
    }

    void SetAmbience(int musicIndex)
    {
        if (ambienceSource && escalationMusic != null && musicIndex < escalationMusic.Length)
        {
            if (ambienceSource.clip != escalationMusic[musicIndex])
            {
                ambienceSource.clip = escalationMusic[musicIndex];
                ambienceSource.Play();
            }
        }
    }

    void ActivateCheckpoints()
    {
        foreach (var pos in checkpointPositions)
        {
            if (checkpointPrefab)
                Instantiate(checkpointPrefab, pos.position, pos.rotation);
        }
        eventLog.Add("Checkpoints activated across the map.");
    }

    void DeployEliteUnits()
    {
        foreach (var spawn in eliteSpawnPoints)
        {
            if (eliteUnitPrefab)
                Instantiate(eliteUnitPrefab, spawn.position, spawn.rotation);
        }
        eventLog.Add("Elite units deployed!");
    }

    void BroadcastWarning()
    {
        ShowAlertUI("Evacuate Immediately!", Color.red);
        // Optionally play warning siren SFX
        eventLog.Add("Civilians warned. Evacuation broadcasted.");
    }

    void ShowAlertUI(string message, Color color)
    {
        if (alertUI && alertText)
        {
            alertUI.alpha = 1f;
            alertText.text = message;
            alertText.color = color;
        }
    }

    void HideAlertUI()
    {
        if (alertUI) alertUI.alpha = 0f;
    }

    void CrowdPanic()
    {
        if (crowdPanicVFX)
            crowdPanicVFX.SetActive(true);
        // Optionally: trigger panic in NPCs
        eventLog.Add("Crowd panic spreading!");
    }

    void CameraShake()
    {
        if (screenShakeAnimator)
            screenShakeAnimator.SetTrigger("Shake");
        if (chaosParticles)
        {
            chaosParticles.transform.position = mainCam.transform.position + mainCam.transform.forward * 3f;
            chaosParticles.Play();
        }
    }

    void TriggerEvent(string eventName)
    {
        // Integrate with game event system
        Debug.Log($"Triggered event: {eventName}");
        eventLog.Add($"Event: {eventName}");
    }

    void TriggerCatastropheEvents()
    {
        // Massive airstrike or map-wide chaos
        if (airStrikeVFX)
        {
            Instantiate(airStrikeVFX, mainCam.transform.position + Vector3.forward * 50, Quaternion.identity);
        }
        CameraShake();
        if (chaosParticles)
        {
            chaosParticles.transform.position = mainCam.transform.position + mainCam.transform.forward * 5f;
            chaosParticles.Play();
        }
        eventLog.Add("Catastrophe events triggered! City in chaos!");
    }

    // --- Public API for other scripts ---
    public void RegisterCivilianCasualty()
    {
        civilianCasualties++;
        eventLog.Add($"Civilian casualty. Total: {civilianCasualties}");
    }

    public void RegisterMilitaryCasualty()
    {
        militaryCasualties++;
        eventLog.Add($"Military casualty. Total: {militaryCasualties}");
    }

    public void SetDominantFaction(string faction)
    {
        dominantFaction = faction;
        eventLog.Add($"Dominant Faction changed to {faction}");
    }

    public void ResetConflict()
    {
        alertLevel = AlertPhase.Peaceful;
        civilianCasualties = 0;
        militaryCasualties = 0;
        escalationTimer = 0f;
        catastropheTriggered = false;
        HideAlertUI();
        eventLog.Clear();
        if (crowdPanicVFX) crowdPanicVFX.SetActive(false);
    }
}
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ConflictEscalation : MonoBehaviour
{
    [Header("Alert System")]
    [Range(0, 4)]
    public int alertLevel = 0; // 0 = Peaceful, 1 = Tension, 2 = Alert, 3 = Skirmish, 4 = Warzone
    public float alertDecayRate = 0.1f; // How fast alert level decreases over time
    public float alertDecayDelay = 30f; // Delay before starting to decay
    
    [Header("Escalation Factors")]
    public int civilianCasualties = 0;
    public int playerDetections = 0;
    public int explosionsCount = 0;
    public bool vipTargetEliminated = false;
    public string dominantFaction = "Neutral";
    
    [Header("Thresholds")]
    public int casualtyThreshold = 3;
    public int detectionThreshold = 2;
    public int explosionThreshold = 1;
    public float timeBasedEscalation = 600f; // 10 minutes
    
    [Header("Audio & Visual")]
    public AudioClip[] alertSounds;
    public Color[] alertColors = { Color.green, Color.yellow, Color.orange, Color.red, Color.black };
    
    private float lastEscalationTime;
    private bool[] levelTriggered = new bool[5];
    private Dictionary<string, int> factionInfluence = new Dictionary<string, int>();
    
    // Events for other systems to subscribe to
    public System.Action<int> OnAlertLevelChanged;
    public System.Action<string> OnEventTriggered;
    
    void Start()
    {
        InitializeFactions();
        lastEscalationTime = Time.time;
    }
    
    void Update()
    {
        MonitorEvents();
        ProcessAlertDecay();
        AdjustAlertLevel();
        UpdateEnvironmentalEffects();
    }
    
    void InitializeFactions()
    {
        factionInfluence["Military"] = 0;
        factionInfluence["Rebel"] = 0;
        factionInfluence["Civilian"] = 100;
    }
    
    void MonitorEvents()
    {
        // Civilian casualties escalation
        if (civilianCasualties >= casualtyThreshold && !levelTriggered[1])
        {
            EscalateAlert(1, "Civilian casualties reported");
        }
        
        // Player detection escalation
        if (playerDetections >= detectionThreshold && !levelTriggered[2])
        {
            EscalateAlert(1, "Hostile presence detected");
        }
        
        // Explosions cause immediate escalation
        if (explosionsCount >= explosionThreshold)
        {
            EscalateAlert(2, "Explosions detected");
            explosionsCount = 0; // Reset after handling
        }
        
        // VIP elimination causes major escalation
        if (vipTargetEliminated && !levelTriggered[3])
        {
            EscalateAlert(3, "High-value target eliminated");
            levelTriggered[3] = true;
        }
        
        // Time-based escalation
        if (Time.timeSinceLevelLoad > timeBasedEscalation && dominantFaction != "Neutral")
        {
            EscalateAlert(1, "Prolonged conflict detected");
        }
        
        // Faction dominance escalation
        CheckFactionDominance();
    }
    
    void CheckFactionDominance()
    {
        string newDominantFaction = "Neutral";
        int highestInfluence = 50; // Threshold for dominance
        
        foreach (var faction in factionInfluence)
        {
            if (faction.Value > highestInfluence)
            {
                highestInfluence = faction.Value;
                newDominantFaction = faction.Key;
            }
        }
        
        if (newDominantFaction != dominantFaction)
        {
            dominantFaction = newDominantFaction;
            EscalateAlert(1, $"{dominantFaction} gaining control");
        }
    }
    
    void EscalateAlert(int increase, string reason)
    {
        int previousLevel = alertLevel;
        alertLevel = Mathf.Clamp(alertLevel + increase, 0, 4);
        lastEscalationTime = Time.time;
        
        if (alertLevel != previousLevel)
        {
            Debug.Log($"Alert escalated to level {alertLevel}: {reason}");
            OnAlertLevelChanged?.Invoke(alertLevel);
            PlayAlertSound();
        }
    }
    
    void ProcessAlertDecay()
    {
        // Only decay if enough time has passed and no recent escalation
        if (Time.time - lastEscalationTime > alertDecayDelay && alertLevel > 0)
        {
            // Gradually reduce alert level
            if (Time.time % (1f / alertDecayRate) < Time.deltaTime)
            {
                alertLevel = Mathf.Max(0, alertLevel - 1);
                Debug.Log($"Alert level decayed to {alertLevel}");
                OnAlertLevelChanged?.Invoke(alertLevel);
                
                // Reset level triggers when decaying
                for (int i = alertLevel + 1; i < levelTriggered.Length; i++)
                {
                    levelTriggered[i] = false;
                }
            }
        }
    }
    
    void AdjustAlertLevel()
    {
        switch (alertLevel)
        {
            case 0: // Peaceful
                if (!levelTriggered[0])
                {
                    TriggerEvent("PeacefulState");
                    levelTriggered[0] = true;
                }
                break;
                
            case 1: // Tension
                if (!levelTriggered[1])
                {
                    TriggerEvent("FactionTensionRise");
                    IncreasePatrols(1.2f);
                    levelTriggered[1] = true;
                }
                break;
                
            case 2: // Alert
                if (!levelTriggered[2])
                {
                    TriggerEvent("AlertStatus");
                    ActivateCheckpoints();
                    IncreasePatrols(1.5f);
                    levelTriggered[2] = true;
                }
                break;
                
            case 3: // Skirmish
                if (!levelTriggered[3])
                {
                    TriggerEvent("SkirmishBegins");
                    DeployEliteUnits();
                    BroadcastWarning();
                    ActivateHeavyWeapons();
                    levelTriggered[3] = true;
                }
                break;
                
            case 4: // Warzone
                if (!levelTriggered[4])
                {
                    TriggerEvent("WarzoneStatus");
                    DeployAirSupport();
                    EvacuateCivilians();
                    lockdownProtocol();
                    levelTriggered[4] = true;
                }
                break;
        }
    }
    
    void UpdateEnvironmentalEffects()
    {
        // Update lighting based on alert level
        RenderSettings.ambientLight = Color.Lerp(RenderSettings.ambientLight, 
            alertColors[alertLevel], Time.deltaTime * 0.5f);
            
        // Add screen effects, particle systems, etc. based on alert level
        if (alertLevel >= 3)
        {
            // Add smoke, fire effects, debris
            CreateWarEffects();
        }
    }
    
    #region Event Handlers
    void TriggerEvent(string eventName)
    {
        Debug.Log($"Event Triggered: {eventName}");
        OnEventTriggered?.Invoke(eventName);
    }
    
    void ActivateCheckpoints()
    {
        // Find and activate checkpoint objects
        GameObject[] checkpoints = GameObject.FindGameObjectsWithTag("Checkpoint");
        foreach (GameObject checkpoint in checkpoints)
        {
            checkpoint.SetActive(true);
        }
    }
    
    void IncreasePatrols(float multiplier)
    {
        // Increase patrol frequency and routes
        PatrolManager[] patrols = FindObjectsOfType<PatrolManager>();
        foreach (PatrolManager patrol in patrols)
        {
            patrol.SetSpeedMultiplier(multiplier);
        }
    }
    
    void DeployEliteUnits()
    {
        // Spawn elite enemy units
        EnemySpawner[] spawners = FindObjectsOfType<EnemySpawner>();
        foreach (EnemySpawner spawner in spawners)
        {
            spawner.SpawnEliteUnit();
        }
    }
    
    void BroadcastWarning()
    {
        // Display warning UI and play announcement
        UIManager.Instance?.ShowWarning("CONFLICT ESCALATION DETECTED");
    }
    
    void ActivateHeavyWeapons()
    {
        // Enable heavy weapon spawns and mounted guns
        WeaponSpawner[] weaponSpawners = FindObjectsOfType<WeaponSpawner>();
        foreach (WeaponSpawner spawner in weaponSpawners)
        {
            spawner.EnableHeavyWeapons();
        }
    }
    
    void DeployAirSupport()
    {
        // Spawn helicopters, drones, air strikes
        AirSupportManager.Instance?.DeploySupport();
    }
    
    void EvacuateCivilians()
    {
        // Move civilians to safe zones
        CivilianManager[] civilians = FindObjectsOfType<CivilianManager>();
        foreach (CivilianManager civilian in civilians)
        {
            civilian.StartEvacuation();
        }
    }
    
    void lockdownProtocol()
    {
        // Close roads, activate barriers
        RoadBlock[] roadblocks = FindObjectsOfType<RoadBlock>();
        foreach (RoadBlock block in roadblocks)
        {
            block.Activate();
        }
    }
    
    void CreateWarEffects()
    {
        // Add visual and audio effects for warfare
        // Explosions in the distance, smoke, sirens, etc.
    }
    
    void PlayAlertSound()
    {
        if (alertSounds != null && alertSounds.Length > alertLevel)
        {
            AudioSource.PlayClipAtPoint(alertSounds[alertLevel], transform.position);
        }
    }
    #endregion
    
    #region Public Interface Methods
    public void AddCivilianCasualty()
    {
        civilianCasualties++;
        EscalateAlert(1, "Civilian casualty");
    }
    
    public void AddPlayerDetection()
    {
        playerDetections++;
    }
    
    public void AddExplosion()
    {
        explosionsCount++;
    }
    
    public void SetVIPEliminated()
    {
        vipTargetEliminated = true;
    }
    
    public void ModifyFactionInfluence(string faction, int change)
    {
        if (factionInfluence.ContainsKey(faction))
        {
            factionInfluence[faction] = Mathf.Clamp(factionInfluence[faction] + change, 0, 100);
        }
    }
    
    public int GetAlertLevel() => alertLevel;
    public string GetDominantFaction() => dominantFaction;
    #endregion
}

using UnityEngine;
using UnityEngine.Playables;
using UnityEngine.Timeline;
using System.Collections;
using System.Collections.Generic;

public class ManifestoCutsceneSystem : MonoBehaviour
{
    [Header("Core Resonance Engine")]
    public PlayableDirector director;
    public Camera mainCamera;
    public Transform[] keyPositions;
    
    [Header("Audio & Rhythm")]
    public AudioSource primaryAudio;
    public AudioSource ambientAudio;
    public AudioClip[] manifestoPhases;
    public BeatDetector beatDetector;
    public float beatSensitivity = 0.8f;
    
    [Header("Visual Effects")]
    public ParticleSystem[] phaseEffects;
    public Light[] dynamicLights;
    public PostProcessingController postProcessing;
    public Color[] resonanceColors;
    
    [Header("Multiplayer Sync")]
    public bool isMultiplayerEnabled = false;
    public NetworkCutsceneSync networkSync;
    
    private int currentPhase = 0;
    private bool cutsceneActive = false;
    private Dictionary<string, System.Action> rhythmActions;
    private Coroutine mainCutsceneCoroutine;
    
    // Core Resonance Engine Components
    private ImmersionController immersion;
    private AudioLogicProcessor audioLogic;
    private MultiplayerSyncManager multiplayer;
    
    void Awake()
    {
        InitializeResonanceEngine();
        SetupRhythmActions();
    }
    
    void InitializeResonanceEngine()
    {
        immersion = GetComponent<ImmersionController>() ?? gameObject.AddComponent<ImmersionController>();
        audioLogic = GetComponent<AudioLogicProcessor>() ?? gameObject.AddComponent<AudioLogicProcessor>();
        
        if (isMultiplayerEnabled)
            multiplayer = GetComponent<MultiplayerSyncManager>() ?? gameObject.AddComponent<MultiplayerSyncManager>();
    }
    
    void SetupRhythmActions()
    {
        rhythmActions = new Dictionary<string, System.Action>
        {
            ["SnareHigh"] = () => HandleSnareHigh(),
            ["BassDrop"] = () => HandleBassDrop(),
            ["Echo-L"] = () => HandleEchoLeft(),
            ["Echo-R"] = () => HandleEchoRight(),
            ["Crescendo"] = () => HandleCrescendo(),
            ["Silence"] = () => HandleSilence()
        };
    }
    
    public void StartManifestoCutscene()
    {
        if (cutsceneActive) return;
        
        cutsceneActive = true;
        mainCutsceneCoroutine = StartCoroutine(ExecuteManifestoCutscene());
    }
    
    IEnumerator ExecuteManifestoCutscene()
    {
        // Initialize cutscene environment
        yield return StartCoroutine(PrepareCutsceneEnvironment());
        
        // Load and prepare timeline
        var timelineAsset = Resources.Load<TimelineAsset>("SixPhaseManifesto");
        if (timelineAsset == null)
        {
            Debug.LogError("Timeline asset 'SixPhaseManifesto' not found!");
            yield break;
        }
        
        director.playableAsset = timelineAsset;
        
        // Sync multiplayer if enabled
        if (isMultiplayerEnabled && multiplayer != null)
        {
            yield return StartCoroutine(multiplayer.SyncCutsceneStart());
        }
        
        // Begin the six-phase manifesto
        for (int phase = 0; phase < 6; phase++)
        {
            currentPhase = phase;
            yield return StartCoroutine(ExecutePhase(phase));
        }
        
        // Cleanup and transition
        yield return StartCoroutine(ConcludeCutscene());
    }
    
    IEnumerator PrepareCutsceneEnvironment()
    {
        // Fade in atmospheric effects
        SoundManager.FadeInAmbient("battlefield_whispers", 2f);
        HUDManager.TriggerPulse("introRhythm");
        
        // Initialize weather and urban environment
        immersion.SetWeatherIntensity(0.3f);
        immersion.SetUrbanAmbience("conflict_zone");
        
        // Camera preparation
        CameraManager.SetCinematicMode(true);
        
        // Audio logic initialization
        audioLogic.Initialize(beatSensitivity);
        beatDetector.onBeatDetected += OnBeatDetected;
        
        yield return new WaitForSeconds(1f);
    }
    
    IEnumerator ExecutePhase(int phaseIndex)
    {
        Debug.Log($"Executing Manifesto Phase {phaseIndex + 1}");
        
        // Phase-specific setup
        SetupPhaseEnvironment(phaseIndex);
        
        // Play phase audio
        if (phaseIndex < manifestoPhases.Length)
        {
            primaryAudio.clip = manifestoPhases[phaseIndex];
            primaryAudio.Play();
        }
        
        // Start timeline for this phase
        director.time = phaseIndex * (director.duration / 6);
        director.Play();
        
        // Phase-specific effects and logic
        switch (phaseIndex)
        {
            case 0: yield return StartCoroutine(PhaseOne_Awakening()); break;
            case 1: yield return StartCoroutine(PhaseTwo_Recognition()); break;
            case 2: yield return StartCoroutine(PhaseThree_Conflict()); break;
            case 3: yield return StartCoroutine(PhaseFour_Revelation()); break;
            case 4: yield return StartCoroutine(PhaseFive_Transformation()); break;
            case 5: yield return StartCoroutine(PhaseSix_Resolution()); break;
        }
        
        yield return new WaitForSeconds(0.5f); // Brief pause between phases
    }
    
    void SetupPhaseEnvironment(int phase)
    {
        // Dynamic lighting
        if (phase < dynamicLights.Length)
        {
            for (int i = 0; i < dynamicLights.Length; i++)
            {
                dynamicLights[i].intensity = (i == phase) ? 1.5f : 0.3f;
                dynamicLights[i].color = resonanceColors[Mathf.Min(phase, resonanceColors.Length - 1)];
            }
        }
        
        // Particle effects
        if (phase < phaseEffects.Length && phaseEffects[phase] != null)
        {
            phaseEffects[phase].Play();
        }
        
        // Post-processing adjustments
        postProcessing?.SetProfile(phase);
    }
    
    #region Phase Implementations
    IEnumerator PhaseOne_Awakening()
    {
        HUDManager.ShowSubtitle("The battlefield whispers truths...", 3f);
        immersion.SetWeatherIntensity(0.1f);
        CameraManager.SmoothTransition(keyPositions[0], 2f);
        yield return new WaitForSeconds(8f);
    }
    
    IEnumerator PhaseTwo_Recognition()
    {
        HUDManager.ShowSubtitle("Recognition dawns in shadow...", 3f);
        audioLogic.EnableEchoMode(true);
        yield return new WaitForSeconds(6f);
    }
    
    IEnumerator PhaseThree_Conflict()
    {
        HUDManager.ShowSubtitle("Conflict shapes the soul...", 3f);
        immersion.SetUrbanAmbience("heavy_combat");
        StartCoroutine(RhythmicCameraShake());
        yield return new WaitForSeconds(10f);
    }
    
    IEnumerator PhaseFour_Revelation()
    {
        HUDManager.ShowSubtitle("Truth pierces the veil...", 3f);
        TriggerMajorVisualEffect("revelation_burst");
        yield return new WaitForSeconds(7f);
    }
    
    IEnumerator PhaseFive_Transformation()
    {
        HUDManager.ShowSubtitle("Transformation begins...", 3f);
        immersion.MorphEnvironment("storm_reveal");
        yield return new WaitForSeconds(9f);
    }
    
    IEnumerator PhaseSix_Resolution()
    {
        HUDManager.ShowSubtitle("The manifesto concludes...", 4f);
        audioLogic.BuildToCrescendo();
        yield return new WaitForSeconds(12f);
    }
    #endregion
    
    #region Beat Detection & Rhythm Response
    void OnBeatDetected(string beatType, float intensity)
    {
        if (rhythmActions.ContainsKey(beatType))
        {
            rhythmActions[beatType].Invoke();
        }
        
        // Sync multiplayer beat events
        if (isMultiplayerEnabled && multiplayer != null)
        {
            multiplayer.SyncBeatEvent(beatType, intensity);
        }
    }
    
    void HandleSnareHigh()
    {
        Agent.Trigger("ShieldBreak");
        FXEmitter.Emit("BossGlyphCrack");
        CameraManager.ImpactShake(0.3f);
        
        // HUD feedback
        HUDManager.FlashElement("combat_indicator", Color.red);
    }
    
    void HandleBassDrop()
    {
        immersion.TriggerEnvironmentalResponse("bass_resonance");
        postProcessing?.PulseEffect("chromatic_aberration", 0.5f);
        
        // Screen effects
        ScreenEffects.RadialBlur(0.2f, 1f);
    }
    
    void HandleEchoLeft()
    {
        audioLogic.ProcessEcho("left_channel");
        CameraManager.SubtleRotation(-2f, 0.5f);
    }
    
    void HandleEchoRight()
    {
        audioLogic.ProcessEcho("right_channel");
        CameraManager.SubtleRotation(2f, 0.5f);
        
        // Check for combo
        if (audioLogic.DetectCombo("Echo-L", "Echo-R", "BassDrop"))
        {
            ExecuteRhythmCombo();
        }
    }
    
    void HandleCrescendo()
    {
        for (int i = 0; i < phaseEffects.Length; i++)
        {
            if (phaseEffects[i] != null)
                phaseEffects[i].startLifetime *= 1.5f;
        }
    }
    
    void HandleSilence()
    {
        // Dramatic pause effect
        Time.timeScale = 0.1f;
        StartCoroutine(RestoreTimeScale());
    }
    
    void ExecuteRhythmCombo()
    {
        Vault.Unlock("SonarChamber");
        immersion.MorphEnvironment("StormReveal");
        
        // Special combo effects
        TriggerMajorVisualEffect("combo_explosion");
        HUDManager.ShowAchievement("Rhythm Master");
        
        Debug.Log("Rhythm combo executed!");
    }
    #endregion
    
    #region Utility Methods
    IEnumerator RhythmicCameraShake()
    {
        float duration = 8f;
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            if (beatDetector.IsBeatFrame())
            {
                CameraManager.RhythmicShake(0.2f);
            }
            elapsed += Time.deltaTime;
            yield return null;
        }
    }
    
    void TriggerMajorVisualEffect(string effectName)
    {
        // Implementation for major visual effects
        FXEmitter.EmitBurst(effectName, transform.position);
        postProcessing?.TriggerEffect(effectName);
    }
    
    IEnumerator RestoreTimeScale()
    {
        yield return new WaitForSecondsRealtime(0.5f);
        
        float duration = 1f;
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            Time.timeScale = Mathf.Lerp(0.1f, 1f, elapsed / duration);
            elapsed += Time.unscaledDeltaTime;
            yield return null;
        }
        
        Time.timeScale = 1f;
    }
    
    IEnumerator ConcludeCutscene()
    {
        // Fade out effects
        SoundManager.FadeOutAmbient(3f);
        
        // Restore normal game state
        CameraManager.SetCinematicMode(false);
        immersion.RestoreDefaultEnvironment();
        
        // Cleanup
        beatDetector.onBeatDetected -= OnBeatDetected;
        cutsceneActive = false;
        
        // Final multiplayer sync
        if (isMultiplayerEnabled && multiplayer != null)
        {
            yield return StartCoroutine(multiplayer.SyncCutsceneEnd());
        }
        
        // Trigger post-cutscene events
        GameEvents.TriggerEvent("ManifestoComplete");
        
        yield return new WaitForSeconds(2f);
        
        Debug.Log("Manifesto cutscene completed successfully");
    }
    
    public void SkipToPhase(int phaseIndex)
    {
        if (cutsceneActive && phaseIndex >= 0 && phaseIndex < 6)
        {
            StopCoroutine(mainCutsceneCoroutine);
            currentPhase = phaseIndex;
            mainCutsceneCoroutine = StartCoroutine(ExecutePhase(phaseIndex));
        }
    }
    
    public void StopCutscene()
    {
        if (cutsceneActive)
        {
            StopCoroutine(mainCutsceneCoroutine);
            StartCoroutine(ConcludeCutscene());
        }
    }
    #endregion
}

// Supporting component classes
public class BeatDetector: MonoBehaviour
{
    public System.Action<string, float> onBeatDetected;
    private float[] spectrum = new float[1024];
    
    public bool IsBeatFrame() 
    { 
        // Implementation for beat detection
        return Time.frameCount % 30 == 0; // Placeholder
    }
}

public static class Agent
{
    public static void Trigger(string action) => Debug.Log($"Agent triggered: {action}");
}

public static class FXEmitter
{
    public static void Emit(string effect) => Debug.Log($"FX emitted: {effect}");
    public static void EmitBurst(string effect, Vector3 position) => Debug.Log($"FX burst: {effect} at {position}");
}

public static class Vault
{
    public static void Unlock(string chamber) => Debug.Log($"Vault unlocked: {chamber}");
}

using UnityEngine;
using UnityEngine.Rendering;
using System.Collections;
using System.Collections.Generic;

[System.Serializable]
public class TimeOfDaySettings
{
    public string periodName;
    public float lightIntensity;
    public Color lightColor;
    public Color ambientColor;
    public Color fogColor;
    public float fogDensity;
    public float shadowStrength;
    public AudioClip ambientSound;
    public float temperature; // For gameplay effects
    public float visibility; // 0-1 visibility range
}

public class DayCycleManager : MonoBehaviour
{
    [Header("Core Lighting")]
    public Light directionalLight;
    public Light moonLight;
    public Transform sunTransform;
    public Transform moonTransform;
    
    [Header("Cycle Configuration")]
    [Range(60f, 3600f)]
    public float cycleDuration = 300f; // 5 minutes default
    public bool useRealTimeSync = false;
    public float timeMultiplier = 1f;
    public bool pauseAtNight = false;
    
    [Header("Time Periods")]
    public TimeOfDaySettings[] timePeriods = new TimeOfDaySettings[8];
    
    [Header("Weather Integration")]
    public ParticleSystem rainSystem;
    public ParticleSystem snowSystem;
    public ParticleSystem fogSystem;
    public AudioSource weatherAudioSource;
    
    [Header("Gameplay Integration")]
    public bool affectEnemyBehavior = true;
    public bool affectPlayerVisibility = true;
    public bool enableRandomEvents = true;
    public float eventChance = 0.3f;
    
    [Header("Visual Effects")]
    public Gradient skyboxTint;
    public AnimationCurve starVisibility;
    public GameObject[] streetLights;
    public GameObject[] windowLights;
    public Material skyboxMaterial;
    
    // Current state
    [SerializeField] private float currentTime = 0f; // 0-1 representing full day
    [SerializeField] private int currentPeriodIndex = 0;
    [SerializeField] private string currentPeriod = "Dawn";
    [SerializeField] private bool cycleActive = false;
    [SerializeField] private WeatherType currentWeather = WeatherType.Clear;
    
    // Events
    public System.Action<string> OnTimeOfDayChanged;
    public System.Action<float> OnTimeUpdated;
    public System.Action<WeatherType> OnWeatherChanged;
    
    // Private variables
    private Coroutine dayNightCoroutine;
    private Dictionary<string, System.Action> timeBasedEvents;
    private EnemyManager enemyManager;
    private PlayerController playerController;
    private AudioSource ambientAudioSource;
    private float lastEventTime;
    
    public enum WeatherType { Clear, Overcast, Rain, Storm, Fog, Snow }
    
    void Awake()
    {
        InitializeTimePeriods();
        SetupComponents();
        InitializeTimeBasedEvents();
    }
    
    void Start()
    {
        // Auto-start cycle
        BeginCycle();
    }
    
    void InitializeTimePeriods()
    {
        if (timePeriods.Length != 8)
            timePeriods = new TimeOfDaySettings[8];
            
        // Pre-populate with realistic settings if empty
        var defaultPeriods = new (string name, float intensity, Color light, Color ambient, float vis)[]
        {
            ("Dawn", 0.3f, new Color(1f, 0.8f, 0.6f), new Color(0.5f, 0.4f, 0.3f), 0.7f),
            ("Morning", 0.8f, new Color(1f, 0.95f, 0.8f), new Color(0.7f, 0.7f, 0.6f), 0.9f),
            ("Midday", 1.2f, new Color(1f, 1f, 0.9f), new Color(0.8f, 0.8f, 0.7f), 1.0f),
            ("Afternoon", 1f, new Color(1f, 0.9f, 0.7f), new Color(0.7f, 0.6f, 0.5f), 0.9f),
            ("Evening", 0.6f, new Color(1f, 0.7f, 0.4f), new Color(0.6f, 0.4f, 0.3f), 0.8f),
            ("Dusk", 0.2f, new Color(0.8f, 0.5f, 0.3f), new Color(0.3f, 0.2f, 0.2f), 0.5f),
            ("Night", 0.05f, new Color(0.4f, 0.4f, 0.8f), new Color(0.1f, 0.1f, 0.2f), 0.3f),
            ("Late Night", 0.02f, new Color(0.3f, 0.3f, 0.7f), new Color(0.05f, 0.05f, 0.15f), 0.2f)
        };
        
        for (int i = 0; i < timePeriods.Length; i++)
        {
            if (timePeriods[i] == null)
            {
                timePeriods[i] = new TimeOfDaySettings();
                var defaultPeriod = defaultPeriods[i];
                timePeriods[i].periodName = defaultPeriod.name;
                timePeriods[i].lightIntensity = defaultPeriod.intensity;
                timePeriods[i].lightColor = defaultPeriod.light;
                timePeriods[i].ambientColor = defaultPeriod.ambient;
                timePeriods[i].visibility = defaultPeriod.vis;
                timePeriods[i].fogDensity = 0.01f;
                timePeriods[i].shadowStrength = Mathf.Clamp01(defaultPeriod.intensity);
                timePeriods[i].temperature = 20f + (defaultPeriod.intensity * 10f);
            }
        }
    }
    
    void SetupComponents()
    {
        // Get or create components
        enemyManager = FindObjectOfType<EnemyManager>();
        playerController = FindObjectOfType<PlayerController>();
        
        ambientAudioSource = gameObject.GetComponent<AudioSource>();
        if (ambientAudioSource == null)
            ambientAudioSource = gameObject.AddComponent<AudioSource>();
            
        ambientAudioSource.loop = true;
        ambientAudioSource.playOnAwake = false;
        
        // Setup moon light if not assigned
        if (moonLight == null && moonTransform != null)
        {
            GameObject moonLightObj = new GameObject("Moon Light");
            moonLightObj.transform.SetParent(moonTransform);
            moonLight = moonLightObj.AddComponent<Light>();
            moonLight.type = LightType.Directional;
            moonLight.intensity = 0.1f;
            moonLight.color = new Color(0.6f, 0.6f, 1f);
        }
    }
    
    void InitializeTimeBasedEvents()
    {
        timeBasedEvents = new Dictionary<string, System.Action>
        {
            ["Dawn"] = () => HandleDawn(),
            ["Morning"] = () => HandleMorning(),
            ["Midday"] = () => HandleMidday(),
            ["Afternoon"] = () => HandleAfternoon(),
            ["Evening"] = () => HandleEvening(),
            ["Dusk"] = () => HandleDusk(),
            ["Night"] = () => HandleNight(),
            ["Late Night"] = () => HandleLateNight()
        };
    }
    
    public void BeginCycle()
    {
        if (cycleActive) return;
        
        cycleActive = true;
        dayNightCoroutine = StartCoroutine(DayNightRoutine());
        Debug.Log("Day cycle started with duration: " + cycleDuration + " seconds");
    }
    
    public void StopCycle()
    {
        if (dayNightCoroutine != null)
        {
            StopCoroutine(dayNightCoroutine);
            cycleActive = false;
        }
    }
    
    IEnumerator DayNightRoutine()
    {
        while (cycleActive)
        {
            float periodDuration = cycleDuration / timePeriods.Length;
            
            for (int i = 0; i < timePeriods.Length; i++)
            {
                currentPeriodIndex = i;
                currentPeriod = timePeriods[i].periodName;
                
                // Trigger period-specific events
                if (timeBasedEvents.ContainsKey(currentPeriod))
                {
                    timeBasedEvents[currentPeriod].Invoke();
                }
                
                OnTimeOfDayChanged?.Invoke(currentPeriod);
                
                // Smooth transition to new period
                yield return StartCoroutine(TransitionToPeriod(i, periodDuration));
                
                // Handle random events
                if (enableRandomEvents && Random.value < eventChance)
                {
                    HandleRandomEvent();
                }
                
                // Pause at night if enabled
                if (pauseAtNight && IsNightTime())
                {
                    yield return new WaitUntil(() => !pauseAtNight || Input.anyKeyDown);
                }
            }
        }
    }
    
    IEnumerator TransitionToPeriod(int periodIndex, float duration)
    {
        var targetSettings = timePeriods[periodIndex];
        var startSettings = GetCurrentLightingSettings();
        
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            float progress = elapsed / duration;
            currentTime = (periodIndex + progress) / timePeriods.Length;
            
            // Interpolate lighting
            InterpolateLighting(startSettings, targetSettings, progress);
            
            // Update sun/moon positions
            UpdateCelestialBodies();
            
            // Update environmental effects
            UpdateEnvironmentalEffects(progress);
            
            OnTimeUpdated?.Invoke(currentTime);
            
            elapsed += Time.deltaTime * timeMultiplier;
            yield return null;
        }
        
        // Ensure final values are set
        ApplyLightingSettings(targetSettings);
    }
    
    void InterpolateLighting(TimeOfDaySettings from, TimeOfDaySettings to, float t)
    {
        if (directionalLight != null)
        {
            directionalLight.intensity = Mathf.Lerp(from.lightIntensity, to.lightIntensity, t);
            directionalLight.color = Color.Lerp(from.lightColor, to.lightColor, t);
            directionalLight.shadowStrength = Mathf.Lerp(from.shadowStrength, to.shadowStrength, t);
        }
        
        // Ambient lighting
        RenderSettings.ambientLight = Color.Lerp(from.ambientColor, to.ambientColor, t);
        
        // Fog settings
        RenderSettings.fogColor = Color.Lerp(from.fogColor, to.fogColor, t);
        RenderSettings.fogDensity = Mathf.Lerp(from.fogDensity, to.fogDensity, t);
        
        // Moon light
        if (moonLight != null)
        {
            moonLight.intensity = IsNightTime() ? 0.1f * (1f - directionalLight.intensity) : 0f;
        }
    }
    
    void UpdateCelestialBodies()
    {
        if (sunTransform != null)
        {
            float sunAngle = (currentTime * 360f) - 90f; // Start at dawn
            sunTransform.rotation = Quaternion.Euler(sunAngle, 30f, 0f);
        }
        
        if (moonTransform != null)
        {
            float moonAngle = ((currentTime + 0.5f) % 1f * 360f) - 90f;
            moonTransform.rotation = Quaternion.Euler(moonAngle, 30f, 0f);
        }
    }
    
    void UpdateEnvironmentalEffects(float progress)
    {
        // Update skybox
        if (skyboxMaterial != null)
        {
            skyboxMaterial.SetColor("_Tint", skyboxTint.Evaluate(currentTime));
        }
        
        // Street lights
        bool shouldLightsBeOn = IsNightTime() || currentWeather == WeatherType.Storm;
        ToggleStreetLights(shouldLightsBeOn);
        
        // Window lights
        ToggleWindowLights(shouldLightsBeOn && Random.value > 0.3f);
        
        // Weather effects
        UpdateWeatherEffects();
    }
    
    void UpdateWeatherEffects()
    {
        switch (currentWeather)
        {
            case WeatherType.Rain:
                if (rainSystem != null) rainSystem.Play();
                break;
            case WeatherType.Snow:
                if (snowSystem != null) snowSystem.Play();
                break;
            case WeatherType.Fog:
                if (fogSystem != null) fogSystem.Play();
                RenderSettings.fogDensity *= 3f;
                break;
        }
    }
    
    #region Period Event Handlers
    void HandleDawn()
    {
        TriggerEvent("DawnBreak");
        ChangeWeather(WeatherType.Clear);
        if (enemyManager != null) enemyManager.SetAlertLevel(0.3f);
    }
    
    void HandleMorning()
    {
        TriggerEvent("MorningPatrol");
        if (enemyManager != null) enemyManager.IncreasePatrolFrequency(1.2f);
    }
    
    void HandleMidday()
    {
        TriggerEvent("MiddayActivity");
        // Peak activity period
        if (enemyManager != null) enemyManager.SetAlertLevel(0.8f);
    }
    
    void HandleAfternoon()
    {
        TriggerEvent("AfternoonWatch");
        // Consider random weather change
        if (Random.value < 0.2f) ChangeWeather(GetRandomWeather());
    }
    
    void HandleEvening()
    {
        TriggerEvent("EveningPrep");
        if (enemyManager != null) enemyManager.PrepareForNight();
    }
    
    void HandleDusk()
    {
        TriggerEvent("DuskSettles");
        // Transition to night activities
        if (playerController != null) playerController.EnableNightVision();
    }
    
    void HandleNight()
    {
        TriggerEvent("NightRaid");
        if (enemyManager != null) 
        {
            enemyManager.SetNightBehavior(true);
            enemyManager.SetAlertLevel(0.6f);
        }
    }
    
    void HandleLateNight()
    {
        TriggerEvent("LateNightOps");
        // Lowest enemy activity
        if (enemyManager != null) enemyManager.SetAlertLevel(0.2f);
    }
    #endregion
    
    void HandleRandomEvent()
    {
        if (Time.time - lastEventTime < 60f) return; // Cooldown
        
        string[] randomEvents = { "Blackout", "Patrol", "AirDrop", "Reinforcements", "WeatherChange" };
        string selectedEvent = randomEvents[Random.Range(0, randomEvents.Length)];
        
        switch (selectedEvent)
        {
            case "Blackout":
                StartCoroutine(TemporaryBlackout(30f));
                break;
            case "WeatherChange":
                ChangeWeather(GetRandomWeather());
                break;
            default:
                TriggerEvent(selectedEvent);
                break;
        }
        
        lastEventTime = Time.time;
    }
    
    IEnumerator TemporaryBlackout(float duration)
    {
        ToggleStreetLights(false);
        ToggleWindowLights(false);
        TriggerEvent("Blackout");
        
        yield return new WaitForSeconds(duration);
        
        ToggleStreetLights(IsNightTime());
        ToggleWindowLights(IsNightTime());
        TriggerEvent("PowerRestored");
    }
    
    #region Utility Methods
    TimeOfDaySettings GetCurrentLightingSettings()
    {
        return new TimeOfDaySettings
        {
            lightIntensity = directionalLight?.intensity ?? 1f,
            lightColor = directionalLight?.color ?? Color.white,
            ambientColor = RenderSettings.ambientLight,
            fogColor = RenderSettings.fogColor,
            fogDensity = RenderSettings.fogDensity,
            shadowStrength = directionalLight?.shadowStrength ?? 1f
        };
    }
    
    void ApplyLightingSettings(TimeOfDaySettings settings)
    {
        if (directionalLight != null)
        {
            directionalLight.intensity = settings.lightIntensity;
            directionalLight.color = settings.lightColor;
            directionalLight.shadowStrength = settings.shadowStrength;
        }
        
        RenderSettings.ambientLight = settings.ambientColor;
        RenderSettings.fogColor = settings.fogColor;
        RenderSettings.fogDensity = settings.fogDensity;
        
        // Update ambient audio
        if (settings.ambientSound != null && ambientAudioSource != null)
        {
            if (ambientAudioSource.clip != settings.ambientSound)
            {
                ambientAudioSource.clip = settings.ambientSound;
                ambientAudioSource.Play();
            }
        }
    }
    
    void ToggleStreetLights(bool state)
    {
        foreach (var light in streetLights)
        {
            if (light != null) light.SetActive(state);
        }
    }
    
    void ToggleWindowLights(bool state)
    {
        foreach (var light in windowLights)
        {
            if (light != null) light.SetActive(state && Random.value > 0.4f);
        }
    }
    
    void ChangeWeather(WeatherType newWeather)
    {
        if (currentWeather == newWeather) return;
        
        // Stop current weather effects
        StopWeatherEffects();
        
        currentWeather = newWeather;
        OnWeatherChanged?.Invoke(currentWeather);
        
        // Apply weather-specific modifications
        ApplyWeatherEffects();
    }
    
    void StopWeatherEffects()
    {
        if (rainSystem != null) rainSystem.Stop();
        if (snowSystem != null) snowSystem.Stop();
        if (fogSystem != null) fogSystem.Stop();
    }
    
    void ApplyWeatherEffects()
    {
        switch (currentWeather)
        {
            case WeatherType.Storm:
                if (directionalLight != null) directionalLight.intensity *= 0.5f;
                TriggerEvent("StormWeather");
                break;
            case WeatherType.Fog:
                if (playerController != null) playerController.ModifyVisibility(0.3f);
                TriggerEvent("FoggyWeather");
                break;
        }
    }
    
    WeatherType GetRandomWeather()
    {
        var weatherTypes = System.Enum.GetValues(typeof(WeatherType));
        return (WeatherType)weatherTypes.GetValue(Random.Range(0, weatherTypes.Length));
    }
    
    bool IsNightTime()
    {
        return currentPeriod == "Night" || currentPeriod == "Late Night" || currentPeriod == "Dusk";
    }
    
    void TriggerEvent(string eventName)
    {
        Debug.Log($"Day Cycle Event: {eventName} at {currentPeriod}");
        // Integration with other systems
        GameEventSystem.TriggerEvent(eventName, currentTime);
    }
    #endregion
    
    #region Public Interface
    public float GetCurrentTime() => currentTime;
    public string GetCurrentPeriod() => currentPeriod;
    public WeatherType GetCurrentWeather() => currentWeather;
    public bool IsDay() => !IsNightTime();
    public float GetVisibilityModifier() => timePeriods[currentPeriodIndex].visibility;
    public float GetTemperature() => timePeriods[currentPeriodIndex].temperature;
    
    public void SetTimeOfDay(float time)
    {
        currentTime = Mathf.Clamp01(time);
        currentPeriodIndex = Mathf.FloorToInt(currentTime * timePeriods.Length);
        currentPeriod = timePeriods[currentPeriodIndex].periodName;
        ApplyLightingSettings(timePeriods[currentPeriodIndex]);
    }
    
    public void SetWeather(WeatherType weather) => ChangeWeather(weather);
    public void SkipToNextPeriod() => SetTimeOfDay((currentPeriodIndex + 1f) / timePeriods.Length);
    #endregion
}

// Supporting classes
public static class GameEventSystem
{
    public static void TriggerEvent(string eventName, float timeContext) 
    {
        Debug.Log($"Game Event: {eventName} at time {timeContext:F2}");
    }
}

using UnityEngine;
using UnityEngine.AI;
using System.Collections;
using System.Collections.Generic;

public enum EnemyState 
{ 
    Patrol, Search, Alert, Attack, InvestigateNoise, Flee, TakeCover, 
    CallForHelp, Stunned, DeadBody, Flanking, Suppressing 
}

public enum EnemyType { Grunt, Elite, Sniper, Heavy, Scout, Commander }
public enum AlertLevel { Green, Yellow, Orange, Red }

[System.Serializable]
public class EnemyStats
{
    public int maxHealth = 100;
    public float moveSpeed = 3.5f;
    public float runSpeed = 6f;
    public float detectionRadius = 15f;
    public float hearingRadius = 20f;
    public float attackRange = 10f;
    public float accuracy = 0.7f;
    public float reactionTime = 0.5f;
    public float stealthSensitivity = 0.3f;
    public int reinforcementValue = 1; // How many allies this unit can call
}

[System.Serializable]
public class CombatBehavior
{
    public float coverSeekDistance = 8f;
    public float flankingChance = 0.3f;
    public float suppressionDuration = 3f;
    public bool canCallReinforcements = true;
    public float retreatHealthThreshold = 0.2f;
    public float aggressionLevel = 0.5f; // 0 = defensive, 1 = aggressive
}

public class EnemyAI : MonoBehaviour
{
    [Header("Core Components")]
    public NavMeshAgent agent;
    public Animator animator;
    public AudioSource audioSource;
    public Transform target;
    public Weapon weapon;
    public Transform eyePosition;
    
    [Header("Enemy Configuration")]
    public EnemyType enemyType = EnemyType.Grunt;
    public EnemyStats stats = new EnemyStats();
    public CombatBehavior combatBehavior = new CombatBehavior();
    
    [Header("Patrol System")]
    public Transform[] patrolPoints;
    public float patrolWaitTime = 2f;
    public bool randomPatrol = false;
    
    [Header("Detection System")]
    public LayerMask playerLayer = 1;
    public LayerMask obstacleLayer = 1;
    public float fieldOfView = 60f;
    public float suspicionDecayRate = 1f;
    
    [Header("Audio & Visual")]
    public AudioClip[] alertSounds;
    public AudioClip[] attackSounds;
    public AudioClip[] deathSounds;
    public GameObject muzzleFlash;
    public ParticleSystem bloodEffect;
    
    // Current state
    [SerializeField] private EnemyState currentState = EnemyState.Patrol;
    [SerializeField] private AlertLevel alertLevel = AlertLevel.Green;
    [SerializeField] private int currentHealth;
    [SerializeField] private float suspicionLevel = 0f;
    [SerializeField] private bool isDead = false;
    
    // AI Variables
    private Vector3 lastKnownPlayerPosition;
    private Vector3 investigationTarget;
    private Vector3 currentCoverPosition;
    private Transform currentPatrolTarget;
    private int currentPatrolIndex = 0;
    private float lastShotTime;
    private float stateTimer;
    private float lastPlayerSighting;
    private bool hasCalledForHelp = false;
    private List<Transform> nearbyAllies = new List<Transform>();
    private Coroutine currentBehaviorCoroutine;
    
    // Detection system
    private float detectionProgress = 0f;
    private bool playerInSight = false;
    private float noiseLevel = 0f;
    
    // Events
    public System.Action<EnemyAI> OnEnemyDeath;
    public System.Action<EnemyAI, Vector3> OnEnemyAlert;
    public System.Action<EnemyAI> OnPlayerSpotted;
    
    void Awake()
    {
        InitializeComponents();
        ApplyEnemyTypeModifications();
    }
    
    void Start()
    {
        currentHealth = stats.maxHealth;
        SetState(EnemyState.Patrol);
        FindNearbyAllies();
    }
    
    void Update()
    {
        if (isDead) return;
        
        UpdateDetectionSystem();
        UpdateSuspicion();
        ExecuteCurrentState();
        UpdateAnimator();
        
        stateTimer += Time.deltaTime;
    }
    
    void InitializeComponents()
    {
        if (agent == null) agent = GetComponent<NavMeshAgent>();
        if (animator == null) animator = GetComponent<Animator>();
        if (audioSource == null) audioSource = GetComponent<AudioSource>();
        if (eyePosition == null) eyePosition = transform;
        
        // Setup agent
        if (agent != null)
        {
            agent.speed = stats.moveSpeed;
            agent.stoppingDistance = stats.attackRange * 0.8f;
        }
    }
    
    void ApplyEnemyTypeModifications()
    {
        switch (enemyType)
        {
            case EnemyType.Elite:
                stats.accuracy *= 1.3f;
                stats.reactionTime *= 0.7f;
                stats.maxHealth = Mathf.RoundToInt(stats.maxHealth * 1.5f);
                combatBehavior.flankingChance = 0.5f;
                break;
                
            case EnemyType.Sniper:
                stats.detectionRadius *= 1.8f;
                stats.attackRange *= 2f;
                stats.accuracy = 0.95f;
                stats.moveSpeed *= 0.8f;
                combatBehavior.aggressionLevel = 0.2f;
                break;
                
            case EnemyType.Heavy:
                stats.maxHealth = Mathf.RoundToInt(stats.maxHealth * 2f);
                stats.moveSpeed *= 0.7f;
                combatBehavior.aggressionLevel = 0.8f;
                combatBehavior.retreatHealthThreshold = 0.1f;
                break;
                
            case EnemyType.Scout:
                stats.detectionRadius *= 1.2f;
                stats.moveSpeed *= 1.3f;
                stats.runSpeed *= 1.4f;
                combatBehavior.canCallReinforcements = true;
                stats.reinforcementValue = 2;
                break;
                
            case EnemyType.Commander:
                stats.reinforcementValue = 3;
                combatBehavior.canCallReinforcements = true;
                stats.maxHealth = Mathf.RoundToInt(stats.maxHealth * 1.3f);
                break;
        }
        
        currentHealth = stats.maxHealth;
    }
    
    #region State Management
    void SetState(EnemyState newState)
    {
        if (currentState == newState) return;
        
        // Exit current state
        ExitState(currentState);
        
        // Enter new state
        currentState = newState;
        stateTimer = 0f;
        EnterState(newState);
        
        if (animator != null)
            animator.SetInteger("State", (int)currentState);
    }
    
    void EnterState(EnemyState state)
    {
        if (currentBehaviorCoroutine != null)
            StopCoroutine(currentBehaviorCoroutine);
            
        switch (state)
        {
            case EnemyState.Patrol:
                agent.speed = stats.moveSpeed;
                currentBehaviorCoroutine = StartCoroutine(PatrolBehavior());
                break;
                
            case EnemyState.Search:
                agent.speed = stats.runSpeed;
                currentBehaviorCoroutine = StartCoroutine(SearchBehavior());
                break;
                
            case EnemyState.Alert:
                PlaySound(alertSounds);
                alertLevel = AlertLevel.Orange;
                if (!hasCalledForHelp && combatBehavior.canCallReinforcements)
                    currentBehaviorCoroutine = StartCoroutine(CallForHelpBehavior());
                break;
                
            case EnemyState.Attack:
                agent.speed = stats.moveSpeed;
                alertLevel = AlertLevel.Red;
                currentBehaviorCoroutine = StartCoroutine(CombatBehavior());
                break;
                
            case EnemyState.TakeCover:
                currentBehaviorCoroutine = StartCoroutine(TakeCoverBehavior());
                break;
                
            case EnemyState.Flee:
                agent.speed = stats.runSpeed;
                currentBehaviorCoroutine = StartCoroutine(FleeBehavior());
                break;
        }
    }
    
    void ExitState(EnemyState state)
    {
        // State-specific cleanup
        switch (state)
        {
            case EnemyState.Attack:
                if (muzzleFlash != null)
                    muzzleFlash.SetActive(false);
                break;
        }
    }
    
    void ExecuteCurrentState()
    {
        // Global state transitions
        if (currentHealth <= stats.maxHealth * combatBehavior.retreatHealthThreshold && 
            currentState != EnemyState.Flee && currentState != EnemyState.DeadBody)
        {
            SetState(EnemyState.Flee);
            return;
        }
        
        // Detection-based transitions
        if (playerInSight && detectionProgress >= 1f)
        {
            if (currentState != EnemyState.Attack && currentState != EnemyState.TakeCover)
            {
                lastKnownPlayerPosition = target.position;
                lastPlayerSighting = Time.time;
                OnPlayerSpotted?.Invoke(this);
                SetState(EnemyState.Attack);
            }
        }
        else if (suspicionLevel > 0.5f && currentState == EnemyState.Patrol)
        {
            SetState(EnemyState.Search);
        }
        else if (noiseLevel > 0.3f && 
                (currentState == EnemyState.Patrol || currentState == EnemyState.Search))
        {
            SetState(EnemyState.InvestigateNoise);
        }
    }
    #endregion
    
    #region Detection System
    void UpdateDetectionSystem()
    {
        if (target == null) return;
        
        float distance = Vector3.Distance(transform.position, target.position);
        playerInSight = false;
        
        if (distance <= stats.detectionRadius)
        {
            if (CanSeePlayer())
            {
                playerInSight = true;
                
                // Calculate detection factors
                float distanceFactor = 1f - (distance / stats.detectionRadius);
                float angleFactor = CalculateAngleFactor();
                float stealthFactor = GetPlayerStealthFactor();
                float lightFactor = GetLightingFactor();
                float movementFactor = GetPlayerMovementFactor();
                
                float detectionRate = distanceFactor * angleFactor * stealthFactor * 
                                    lightFactor * movementFactor * Time.deltaTime;
                
                detectionProgress = Mathf.Clamp01(detectionProgress + detectionRate);
                suspicionLevel = Mathf.Min(1f, suspicionLevel + detectionRate * 0.5f);
            }
            else
            {
                detectionProgress = Mathf.Max(0f, detectionProgress - Time.deltaTime * 0.3f);
            }
        }
        
        // Hearing detection
        UpdateHearingDetection();
    }
    
    bool CanSeePlayer()
    {
        Vector3 directionToPlayer = (target.position - eyePosition.position).normalized;
        float angleToPlayer = Vector3.Angle(transform.forward, directionToPlayer);
        
        if (angleToPlayer > fieldOfView * 0.5f)
            return false;
            
        RaycastHit hit;
        if (Physics.Raycast(eyePosition.position, directionToPlayer, out hit, 
                           stats.detectionRadius, playerLayer | obstacleLayer))
        {
            return hit.transform == target;
        }
        
        return false;
    }
    
    float CalculateAngleFactor()
    {
        Vector3 directionToPlayer = (target.position - transform.position).normalized;
        float angle = Vector3.Angle(transform.forward, directionToPlayer);
        return Mathf.Clamp01(1f - (angle / (fieldOfView * 0.5f)));
    }
    
    float GetPlayerStealthFactor()
    {
        var stealth = target.GetComponent<PlayerStealth>();
        if (stealth != null)
        {
            return Mathf.Clamp01(2f - stealth.CurrentStealth);
        }
        return 1f;
    }
    
    float GetLightingFactor()
    {
        // Integration with day/night cycle
        var dayManager = FindObjectOfType<DayCycleManager>();
        if (dayManager != null)
        {
            return dayManager.IsDay() ? 1f : 0.6f;
        }
        return 1f;
    }
    
    float GetPlayerMovementFactor()
    {
        var playerController = target.GetComponent<PlayerController>();
        if (playerController != null)
        {
            return playerController.IsRunning() ? 1.5f : 
                   playerController.IsCrouching() ? 0.3f : 1f;
        }
        return 1f;
    }
    
    void UpdateHearingDetection()
    {
        float hearingDistance = Vector3.Distance(transform.position, target.position);
        if (hearingDistance <= stats.hearingRadius)
        {
            var playerController = target.GetComponent<PlayerController>();
            if (playerController != null)
            {
                float playerNoise = playerController.GetNoiseLevel();
                float hearingFactor = 1f - (hearingDistance / stats.hearingRadius);
                noiseLevel = playerNoise * hearingFactor;
                
                if (noiseLevel > 0.7f)
                {
                    investigationTarget = target.position;
                    suspicionLevel = Mathf.Min(1f, suspicionLevel + noiseLevel * Time.deltaTime);
                }
            }
        }
        
        noiseLevel = Mathf.Max(0f, noiseLevel - Time.deltaTime * 2f);
    }
    
    void UpdateSuspicion()
    {
        if (!playerInSight && detectionProgress < 1f)
        {
            suspicionLevel = Mathf.Max(0f, suspicionLevel - suspicionDecayRate * Time.deltaTime);
            detectionProgress = Mathf.Max(0f, detectionProgress - Time.deltaTime * 0.5f);
        }
    }
    #endregion
    
    #region Behavior Coroutines
    IEnumerator PatrolBehavior()
    {
        while (currentState == EnemyState.Patrol)
        {
            if (patrolPoints.Length == 0)
            {
                // Random patrol
                Vector3 randomPoint = GetRandomNavMeshPoint(15f);
                agent.SetDestination(randomPoint);
            }
            else
            {
                // Waypoint patrol
                if (currentPatrolTarget == null || 
                    Vector3.Distance(transform.position, currentPatrolTarget.position) < 2f)
                {
                    if (randomPatrol)
                        currentPatrolIndex = Random.Range(0, patrolPoints.Length);
                    else
                        currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.Length;
                        
                    currentPatrolTarget = patrolPoints[currentPatrolIndex];
                    agent.SetDestination(currentPatrolTarget.position);
                    
                    yield return new WaitForSeconds(patrolWaitTime);
                }
            }
            
            yield return new WaitForSeconds(0.1f);
        }
    }
    
    IEnumerator SearchBehavior()
    {
        agent.SetDestination(lastKnownPlayerPosition);
        
        while (currentState == EnemyState.Search)
        {
            if (Vector3.Distance(transform.position, lastKnownPlayerPosition) < 3f)
            {
                // Search nearby area
                for (int i = 0; i < 3; i++)
                {
                    Vector3 searchPoint = lastKnownPlayerPosition + 
                                        Random.insideUnitSphere * 10f;
                    searchPoint.y = transform.position.y;
                    
                    agent.SetDestination(searchPoint);
                    yield return new WaitForSeconds(2f);
                }
                
                // Return to patrol if player not found
                SetState(EnemyState.Patrol);
            }
            
            yield return new WaitForSeconds(0.1f);
        }
    }
    
    IEnumerator CombatBehavior()
    {
        while (currentState == EnemyState.Attack)
        {
            if (target == null) break;
            
            float distanceToPlayer = Vector3.Distance(transform.position, target.position);
            
            // Decide combat behavior
            if (distanceToPlayer > stats.attackRange)
            {
                // Move closer
                agent.SetDestination(target.position);
            }
            else if (ShouldTakeCover())
            {
                SetState(EnemyState.TakeCover);
                break;
            }
            else if (ShouldFlank())
            {
                SetState(EnemyState.Flanking);
                break;
            }
            else
            {
                // Attack
                agent.SetDestination(transform.position); // Stop moving
                yield return StartCoroutine(AttackSequence());
            }
            
            yield return new WaitForSeconds(0.1f);
        }
    }
    
    IEnumerator AttackSequence()
    {
        // Aim at player
        Vector3 directionToPlayer = (target.position - transform.position).normalized;
        transform.rotation = Quaternion.LookRotation(directionToPlayer);
        
        yield return new WaitForSeconds(stats.reactionTime);
        
        // Fire weapon
        if (weapon != null && Time.time - lastShotTime > weapon.fireRate)
        {
            bool hit = Random.value < stats.accuracy;
            weapon.Fire(hit ? target : null);
            
            if (muzzleFlash != null)
            {
                muzzleFlash.SetActive(true);
                yield return new WaitForSeconds(0.1f);
                muzzleFlash.SetActive(false);
            }
            
            PlaySound(attackSounds);
            lastShotTime = Time.time;
        }
    }
    
    IEnumerator TakeCoverBehavior()
    {
        Vector3 coverPosition = FindNearestCover();
        if (coverPosition != Vector3.zero)
        {
            agent.SetDestination(coverPosition);
            currentCoverPosition = coverPosition;
            
            while (Vector3.Distance(transform.position, coverPosition) > 1f && 
                   currentState == EnemyState.TakeCover)
            {
                yield return new WaitForSeconds(0.1f);
            }
            
            // Stay in cover briefly, then return to combat
            yield return new WaitForSeconds(combatBehavior.suppressionDuration);
            SetState(EnemyState.Attack);
        }
        else
        {
            SetState(EnemyState.Attack);
        }
    }
    
    IEnumerator CallForHelpBehavior()
    {
        hasCalledForHelp = true;
        PlaySound(alertSounds);
        
        // Alert nearby allies
        OnEnemyAlert?.Invoke(this, lastKnownPlayerPosition);
        
        yield return new WaitForSeconds(1f);
        SetState(EnemyState.Search);
    }
    
    IEnumerator FleeBehavior()
    {
        Vector3 fleeDirection = (transform.position - target.position).normalized;
        Vector3 fleeTarget = transform.position + fleeDirection * 20f;
        
        agent.SetDestination(fleeTarget);
        
        while (currentState == EnemyState.Flee)
        {
            // Check if far enough away
            if (Vector3.Distance(transform.position, target.position) > stats.detectionRadius * 1.5f)
            {
                SetState(EnemyState.Patrol);
                break;
            }
            
            yield return new WaitForSeconds(0.5f);
        }
    }
    #endregion
    
    #region Combat Logic
    bool ShouldTakeCover()
    {
        return Random.value < (1f - combatBehavior.aggressionLevel) && 
               currentHealth < stats.maxHealth * 0.7f;
    }
    
    bool ShouldFlank()
    {
        return Random.value < combatBehavior.flankingChance && 
               nearbyAllies.Count > 0;
    }
    
    Vector3 FindNearestCover()
    {
        // Find cover objects tagged as "Cover"
        GameObject[] coverObjects = GameObject.FindGameObjectsWithTag("Cover");
        Vector3 bestCover = Vector3.zero;
        float closestDistance = Mathf.Infinity;
        
        foreach (var cover in coverObjects)
        {
            float distance = Vector3.Distance(transform.position, cover.transform.position);
            if (distance < closestDistance && distance < combatBehavior.coverSeekDistance)
            {
                closestDistance = distance;
                bestCover = cover.transform.position;
            }
        }
        
        return bestCover;
    }
    
    Vector3 GetRandomNavMeshPoint(float radius)
    {
        Vector3 randomDirection = Random.insideUnitSphere * radius;
        randomDirection += transform.position;
        
        NavMeshHit hit;
        if (NavMesh.SamplePosition(randomDirection, out hit, radius, 1))
        {
            return hit.position;
        }
        
        return transform.position;
    }
    
    void FindNearbyAllies()
    {
        nearbyAllies.Clear();
        EnemyAI[] allEnemies = FindObjectsOfType<EnemyAI>();
        
        foreach (var enemy in allEnemies)
        {
            if (enemy != this && 
                Vector3.Distance(transform.position, enemy.transform.position) < 30f)
            {
                nearbyAllies.Add(enemy.transform);
            }
        }
    }
    #endregion
    
    #region Health and Damage
    public void TakeDamage(int amount, Vector3 damageSource = default)
    {
        if (isDead) return;
        
        currentHealth -= amount;
        
        if (bloodEffect != null)
            bloodEffect.Play();
            
        // React to damage
        if (currentState == EnemyState.Patrol)
        {
            lastKnownPlayerPosition = damageSource != default ? damageSource : target.position;
            SetState(EnemyState.Alert);
        }
        
        if (currentHealth <= 0)
        {
            Die();
        }
        else if (currentHealth <= stats.maxHealth * combatBehavior.retreatHealthThreshold)
        {
            SetState(EnemyState.Flee);
        }
    }
    
    void Die()
    {
        isDead = true;
        SetState(EnemyState.DeadBody);
        
        PlaySound(deathSounds);
        
        if (agent != null)
            agent.enabled = false;
            
        if (animator != null)
            animator.SetTrigger("Die");
            
        OnEnemyDeath?.Invoke(this);
        
        // Disable collider and destroy after delay
        GetComponent<Collider>().enabled = false;
        Destroy(gameObject, 5f);
    }
    #endregion
    
    #region Utility Methods
    void PlaySound(AudioClip[] clips)
    {
        if (clips.Length > 0 && audioSource != null)
        {
            audioSource.clip = clips[Random.Range(0, clips.Length)];
            audioSource.Play();
        }
    }
    
    void UpdateAnimator()
    {
        if (animator == null) return;
        
        animator.SetFloat("Speed", agent.velocity.magnitude);
        animator.SetBool("InCombat", currentState == EnemyState.Attack);
        animator.SetFloat("Health", (float)currentHealth / stats.maxHealth);
        animator.SetFloat("AlertLevel", (int)alertLevel);
    }
    
    public void AlertToPosition(Vector3 position)
    {
        lastKnownPlayerPosition = position;
        suspicionLevel = 0.8f;
        
        if (currentState == EnemyState.Patrol)
            SetState(EnemyState.Search);
    }
    
    public EnemyState GetCurrentState() => currentState;
    public float GetHealthPercentage() => (float)currentHealth / stats.maxHealth;
    public bool IsAlerted() => alertLevel >= AlertLevel.Orange;
    public Vector3 GetLastKnownPlayerPosition() => lastKnownPlayerPosition;
    #endregion
    
    void OnDrawGizmosSelected()
    {
        // Detection radius
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireCircle(transform.position, stats.detectionRadius);
        
        // Hearing radius
        Gizmos.color = Color.blue;
        Gizmos.DrawWireCircle(transform.position, stats.hearingRadius);
        
        // Field of view
        Gizmos.color = Color.red;
        Vector3 leftBoundary = Quaternion.Euler(0, -fieldOfView * 0.5f, 0) * transform.forward * stats.detectionRadius;
        Vector3 rightBoundary = Quaternion.Euler(0, fieldOfView * 0.5f, 0) * transform.forward * stats.detectionRadius;
        
        Gizmos.DrawLine(transform.position, transform.position + leftBoundary);
        Gizmos.DrawLine(transform.position, transform.position + rightBoundary);
    }
}
const WeatherSystem = {
  currentCondition: null,
  temperature: null,
  visibility: null,
  effectsOnBattlefield: {},

  REGION_CONFIGS: {
    "Tel Aviv": {
      condition: "dry heat",
      temperature: 36,
      visibility: "moderate",
      urbanLayout: "civilian density",
      intelStrategy: "intel cover",
    },
    "Jerusalem": {
      condition: "desert wind",
      temperature: 40,
      visibility: "low",
      urbanLayout: "historic layout",
      intelStrategy: "limited sightlines",
    },
    "Golan Heights": {
      condition: "stormy front",
      temperature: 12,
      visibility: "foggy",
      urbanLayout: "open terrain",
      intelStrategy: "long-range combat",
    },
    "default": {
      condition: "clear",
      temperature: 25,
      visibility: "high",
    }
  },

  WEATHER_EFFECTS: {
    "dry heat": {
      staminaDrain: true,
      cooldownReduction: false,
      opticalMirage: true,
    },
    "desert wind": {
      rangedAccuracyPenalty: true,
      stealthBoost: false,
      visibilityObscured: true,
    },
    "stormy front": {
      movementSlowdown: true,
      coverAdvantage: true,
      moraleImpact: true,
    },
    "clear": {},
  },

  initialize(region) {
    const config = this.REGION_CONFIGS[region] || this.REGION_CONFIGS["default"];

    this.setCondition(config.condition, config.temperature, config.visibility);

    if (config.urbanLayout && config.intelStrategy) {
      this.setUrbanDynamics(config.urbanLayout, config.intelStrategy);
    }

    // Send results to Unity
    this.sendToUnity();
  },

  setCondition(condition, temperature, visibility) {
    this.currentCondition = condition;
    this.temperature = temperature;
    this.visibility = visibility;
    this.effectsOnBattlefield = { ...this.generateEffects(condition) };
  },

  setUrbanDynamics(layout, intel) {
    this.effectsOnBattlefield.urbanLayout = layout;
    this.effectsOnBattlefield.intelStrategy = intel;
  },

  generateEffects(condition) {
    return this.WEATHER_EFFECTS[condition] || {};
  },

  sendToUnity() {
    const payload = JSON.stringify({
      condition: this.currentCondition,
      temperature: this.temperature,
      visibility: this.visibility,
      effects: this.effectsOnBattlefield,
    });

    // Sends message to Unity GameObject named "WeatherManager"
    // which has a method "ApplyWeather" to receive the payload
    SendMessage("WeatherManager", "ApplyWeather", payload);
  }
};
using UnityEngine;

public class WeatherManager : MonoBehaviour
{
    [System.Serializable]
    public class WeatherData
    {
        public string condition;
        public float temperature;
        public string visibility;
        public WeatherEffects effects;
    }

    [System.Serializable]
    public class WeatherEffects
    {
        public bool staminaDrain;
        public bool cooldownReduction;
        public bool opticalMirage;
        public bool rangedAccuracyPenalty;
        public bool stealthBoost;
        public bool visibilityObscured;
        public bool movementSlowdown;
        public bool coverAdvantage;
        public bool moraleImpact;
        public string urbanLayout;
        public string intelStrategy;
    }

    public void ApplyWeather(string json)
    {
        WeatherData data = JsonUtility.FromJson<WeatherData>(json);
        Debug.Log("Weather received from JS: " + data.condition);

        // Apply effects in Unity (visuals, gameplay logic, etc.)
        // Example:
        // UpdateSkybox(data.condition);
        // SetTemperatureUI(data.temperature);
        // AdjustFogBasedOnVisibility(data.visibility);
        // ApplyCombatModifiers(data.effects);
    }
}
WeatherSystem.initialize("Jerusalem");
<button onclick="WeatherSystem.initialize('Golan Heights')">Load Golan Weather</button>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Unity Weather System</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #1e1e1e;
      color: #f0f0f0;
    }
    #unity-container {
      width: 960px;
      height: 600px;
      margin-top: 20px;
    }
    .buttons {
      margin-top: 20px;
    }
    button {
      margin: 5px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <h1>Unity Weather System Demo</h1>

  <div class="buttons">
    <button onclick="WeatherSystem.initialize('Tel Aviv')">Tel Aviv</button>
    <button onclick="WeatherSystem.initialize('Jerusalem')">Jerusalem</button>
    <button onclick="WeatherSystem.initialize('Golan Heights')">Golan Heights</button>
  </div>

  <div id="unity-container"></div>

  <!-- Unity WebGL Loader -->
  <script src="Build/Build.loader.js"></script>
  <script>
    let unityInstance = null;

    createUnityInstance(document.querySelector("#unity-container"), {
      dataUrl: "Build/Build.data",
      frameworkUrl: "Build/Build.framework.js",
      codeUrl: "Build/Build.wasm",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "MyCompany",
      productName: "WeatherSim",
      productVersion: "1.0",
    }).then(instance => {
      unityInstance = instance;
    }).catch(err => {
      console.error(err);
    });
  </script>

  <!-- Weather System Script -->
  <script>
    const WeatherSystem = {
      currentCondition: null,
      temperature: null,
      visibility: null,
      effectsOnBattlefield: {},

      REGION_CONFIGS: {
        "Tel Aviv": {
          condition: "dry heat",
          temperature: 36,
          visibility: "moderate",
          urbanLayout: "civilian density",
          intelStrategy: "intel cover",
        },
        "Jerusalem": {
          condition: "desert wind",
          temperature: 40,
          visibility: "low",
          urbanLayout: "historic layout",
          intelStrategy: "limited sightlines",
        },
        "Golan Heights": {
          condition: "stormy front",
          temperature: 12,
          visibility: "foggy",
          urbanLayout: "open terrain",
          intelStrategy: "long-range combat",
        },
        "default": {
          condition: "clear",
          temperature: 25,
          visibility: "high",
        }
      },

      WEATHER_EFFECTS: {
        "dry heat": {
          staminaDrain: true,
          cooldownReduction: false,
          opticalMirage: true,
        },
        "desert wind": {
          rangedAccuracyPenalty: true,
          stealthBoost: false,
          visibilityObscured: true,
        },
        "stormy front": {
          movementSlowdown: true,
          coverAdvantage: true,
          moraleImpact: true,
        },
        "clear": {},
      },

      initialize(region) {
        const config = this.REGION_CONFIGS[region] || this.REGION_CONFIGS["default"];

        this.setCondition(config.condition, config.temperature, config.visibility);

        if (config.urbanLayout && config.intelStrategy) {
          this.setUrbanDynamics(config.urbanLayout, config.intelStrategy);
        }

        this.sendToUnity();
      },

      setCondition(condition, temperature, visibility) {
        this.currentCondition = condition;
        this.temperature = temperature;
        this.visibility = visibility;
        this.effectsOnBattlefield = { ...this.generateEffects(condition) };
      },

      setUrbanDynamics(layout, intel) {
        this.effectsOnBattlefield.urbanLayout = layout;
        this.effectsOnBattlefield.intelStrategy = intel;
      },

      generateEffects(condition) {
        return this.WEATHER_EFFECTS[condition] || {};
      },

      sendToUnity() {
        const payload = JSON.stringify({
          condition: this.currentCondition,
          temperature: this.temperature,
          visibility: this.visibility,
          effects: this.effectsOnBattlefield,
        });

        // Call Unity GameObject method
        SendMessage("WeatherManager", "ApplyWeather", payload);
      }
    };
  </script>

</body>
</html>

{
  "faction": {
    "id": "shadow_seraphs",
    "name": "Shadow Seraphs",
    "region": "Ruined Metro Grid",
    "description": "Formed from the remnants of deep-city operatives, the Shadow Seraphs emerged to combat authoritarian sweeps under blackout conditions. Their whispers echo louder than enemy megaphones.",
    
    "attributes": {
      "traits": {
        "stealth": 90,
        "weatherResistance": 40,
        "moraleBonus": [
          "night_operations",
          "underdog_surge"
        ]
      },
      "quirks": {
        "preferredTime": "Night",
        "specialUnits": [
          "Echo Sniper",
          "Drone Whisperer"
        ]
      }
    }
  }
}
"faction": {
  ...
  "alliances": ["Iron Tide", "Crimson Mantle"],
  "enemies": ["Steel Regime"],
  "resources": {
    "credits": 1200,
    "techLevel": 4
  },
  "appearance": {
    "color": "#2a2a2a",
    "symbol": "seraph_wing_icon"
  }
}
let currentPlayer = 0;
const players = ["Player1", "Player2"];

function gameLoop() {
  console.log(`It's ${players[currentPlayer]}'s turn.`);
  // handle player input, actions, and end turn
  processTurn(players[currentPlayer]);
  checkGameOver();
  currentPlayer = (currentPlayer + 1) % players.length;
}

 Entity System
class Unit {
  constructor(name, health, attack, defense, abilities) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.abilities = abilities || [];
    this.position = { x: 0, y: 0 };
  }

  move(x, y) {
    this.position = { x, y };
    console.log(`${this.name} moves to (${x}, ${y})`);
  }

  isAlive() {
    return this.health > 0;
  }
}

Combat Logic
function calculateDamage(attacker, defender) {
  const baseDamage = attacker.attack - defender.defense;
  const damage = Math.max(baseDamage, 1); // minimum 1 damage
  defender.health -= damage;
  console.log(`${attacker.name} hits ${defender.name} for ${damage} damage!`);
  if (!defender.isAlive()) {
    console.log(`${defender.name} has fallen.`);
  }
}

function checkGameOver() {
  // simplistic condition: if all units of a player are dead
  const allUnitsDead = false; // implement based on your unit list
  if (allUnitsDead) {
    console.log("Game Over!");
  }
}

function getTerrainBonus(unit, terrainType) {
  switch (terrainType) {
    case "desert":
      return unit.type === "light" ? { movement: +1 } : { accuracy: -0.1 };
    case "dune":
      return unit.isStationary ? { defense: +0.2, movement: -1 } : {};
    case "ruins":
      return { defense: +0.3, projectileDeflectChance: 0.5 };
    case "oil":
      return { resourceBoost: +1, fireVulnerability: true };
    case "storm":
      return { visionReduction: 0.25, noAirTargeting: true };
    case "trench":
      return { defense: +0.5, movementLimit: 1 };
    case "minefield":
      return { hidden: true, damageOnStep: [30, 50] };
    default:
      return {};
  }
}

Terrain Golf of Kuwait

class Unit {
  constructor(name, type, health, attack, movementSpeed) {
    this.name = name;
    this.type = type;
    this.health = health;
    this.attack = attack;
    this.movementSpeed = movementSpeed;
    this.position = { x: 0, y: 0 };
  }

  move(x, y, terrain) {
    const bonus = getTerrainBonus(this.type, terrain);
    this.position = { x, y };
    console.log(`${this.name} moves to (${x}, ${y}) on ${terrain} terrain.`);
    if (bonus.movement) {
      console.log(`Movement bonus applied: +${bonus.movement}`);
    }
  }

  attackTarget(target, terrain) {
    const bonus = getTerrainBonus(this.type, terrain);
    let damage = this.attack;
    if (bonus.combat) {
      damage *= bonus.combat;
    }
    target.health -= damage;
    console.log(`${this.name} attacks ${target.name} for ${damage} damage.`);
  }
}

function getTerrainBonus(unitType, terrainType) {
  const terrainEffects = {
    desert: {
      desert_scout: { movement: 1.5, combat: 1.2 },
      demolition_expert: { movement: 1.0, combat: 1.0 },
      aerial_drone: { movement: 2.0, combat: 0.8 }
    },
    ruins: {
      desert_scout: { movement: 0.8, combat: 0.9 },
      demolition_expert: { movement: 1.2, combat: 1.5 },
      aerial_drone: { movement: 1.8, combat: 0.8 }
    },
    dunes: {
      desert_scout: { movement: 1.2, combat: 1.1 },
      demolition_expert: { movement: 0.9, combat: 1.0 },
      aerial_drone: { movement: 1.5, combat: 0.7 }
    }
    // Add more terrain types as needed
  };

  return terrainEffects[terrainType]?.[unitType] || {};
}

const scout = new Unit("Falcon", "desert_scout", 100, 20, 3);
const drone = new Unit("SkyEye", "aerial_drone", 80, 10, 5);
const demo = new Unit("Boomer", "demolition_expert", 120, 30, 2);

scout.move(2, 3, "desert");
drone.attackTarget(scout, "ruins");

Special Abilities Module

class SpecialAbility {
  constructor(name, cooldown, effect) {
    this.name = name;
    this.cooldown = cooldown;
    this.remainingCooldown = 0;
    this.effect = effect; // Function defining the ability's impact
  }

  useAbility(user, target, terrain) {
    if (this.remainingCooldown > 0) {
      console.log(`${this.name} is on cooldown for ${this.remainingCooldown} more turns.`);
      return;
    }
    this.effect(user, target, terrain);
    this.remainingCooldown = this.cooldown;
  }

  tickCooldown() {
    if (this.remainingCooldown > 0) this.remainingCooldown--;
  }
}

const sabotage = new SpecialAbility("Sabotage", 3, (user, target, terrain) => {
  const terrainBonus = terrain === "ruins" ? 1.5 : 1.0;
  const damage = 25 * terrainBonus;
  target.health -= damage;
  console.log(`${user.name} sabotages ${target.name} in ${terrain}, dealing ${damage} damage.`);
});

const recon = new SpecialAbility("Recon", 2, (user, _, terrain) => {
  const visibility = terrain === "desert" ? "wide scan" : "limited scan";
  console.log(`${user.name} performs recon in ${terrain}: ${visibility} activated.`);
});

const airstrike = new SpecialAbility("Airstrike", 4, (user, target, terrain) => {
  const terrainPenalty = terrain === "dunes" ? 0.8 : 1.0;
  const damage = 50 * terrainPenalty;
  target.health -= damage;
  console.log(`${user.name} calls airstrike on ${target.name} in ${terrain}, dealing ${damage} damage.`);
});

Integrate with Units
class AdvancedUnit extends Unit {
  constructor(name, type, health, attack, movementSpeed, abilities = []) {
    super(name, type, health, attack, movementSpeed);
    this.abilities = abilities;
  }

  useAbility(index, target, terrain) {
    if (this.abilities[index]) {
      this.abilities[index].useAbility(this, target, terrain);
    }
  }

  endTurn() {
    this.abilities.forEach(ability => ability.tickCooldown());
  }
}

const drone = new AdvancedUnit("SkyEye", "aerial_drone", 80, 10, 5, [recon, airstrike]);
const demo = new AdvancedUnit("Boomer", "demolition_expert", 120, 30, 2, [sabotage]);

drone.useAbility(0, null, "desert"); // Recon
demo.useAbility(0, drone, "ruins");  // Sabotage
drone.useAbility(1, demo, "dunes");  // Airstrike

Stealth Mechanics
class Stealth {
  constructor(duration, detectionRange) {
    this.duration = duration;
    this.remaining = duration;
    this.detectionRange = detectionRange;
    this.isHidden = true;
  }

  tick() {
    if (this.remaining > 0) this.remaining--;
    else this.isHidden = false;
  }

  detect(enemyPosition, selfPosition) {
    const dx = enemyPosition.x - selfPosition.x;
    const dy = enemyPosition.y - selfPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.detectionRange;
  }
}

Upgrade Trees

const upgradeTree = {
  desert_scout: {
    mobility: { level: 1, bonus: "+1 movement" },
    reconTech: { level: 1, bonus: "enhanced scan range" }
  },
  demolition_expert: {
    blastRadius: { level: 1, bonus: "+10% area damage" },
    armor: { level: 1, bonus: "+20 health" }
  },
  aerial_drone: {
    altitude: { level: 1, bonus: "evade ground attacks" },
    payload: { level: 1, bonus: "+15 airstrike damage" }
  }
};

Meet Oistarian, the Agent
A mysterious operative with hybrid capabilities:
• 	Type: Stealth Specialist
• 	Abilities:
• 	Ghostwalk: Enters stealth for 3 turns.
• 	Neural Hack: Disables enemy abilities for 1 turn.
• 	Echo Pulse: Reveals hidden units in a radius.
• 	Terrain Affinity: Excels in ruins and urban zones.
• 	Lore: Former intelligence operative turned rogue strategist. Known for vanishing mid-battle and reappearing behind enemy lines.

  Initialize PixiJS Engine
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1e1e1e
});
document.body.appendChild(app.view);

function createMovementTrail(x, y) {
  const trail = new PIXI.Graphics();
  trail.beginFill(0xffff00, 0.5);
  trail.drawCircle(x, y, 5);
  trail.endFill();
  app.stage.addChild(trail);

  // Fade out
  setTimeout(() => app.stage.removeChild(trail), 500);
}

Attack Animation
function createAttackFlash(x, y) {
  const flash = new PIXI.Graphics();
  flash.beginFill(0xff0000);
  flash.drawRect(x - 10, y - 10, 20, 20);
  flash.endFill();
  app.stage.addChild(flash);

  // Flash effect
  setTimeout(() => app.stage.removeChild(flash), 300);
}

Ability FX: Airstrike

function createAirstrikeEffect(x, y) {
  const explosion = new PIXI.Graphics();
  explosion.beginFill(0xffa500);
  explosion.drawCircle(x, y, 30);
  explosion.endFill();
  app.stage.addChild(explosion);

  // Shrink and fade
  let scale = 1;
  const ticker = new PIXI.Ticker();
  ticker.add(() => {
    scale -= 0.05;
    explosion.scale.set(scale);
    if (scale <= 0) {
      app.stage.removeChild(explosion);
      ticker.stop();
    }
  });
  ticker.start();
}

Oistarian’s Stealth Cloak (PixiJS)

function cloakEffect(unitSprite) {
  const cloak = new PIXI.Graphics();
  cloak.beginFill(0x00ffff, 0.3);
  cloak.drawCircle(unitSprite.x, unitSprite.y, 20);
  cloak.endFill();
  app.stage.addChild(cloak);

  // Fade out shimmer
  let alpha = 0.3;
  const ticker = new PIXI.Ticker();
  ticker.add(() => {
    alpha -= 0.01;
    cloak.alpha = alpha;
    if (alpha <= 0) {
      app.stage.removeChild(cloak);
      ticker.stop();
    }
  });
  ticker.start();
}

Radar Pulse for Recon (PixiJS)

function radarPulse(x, y) {
  const pulse = new PIXI.Graphics();
  pulse.lineStyle(2, 0x00ff00, 1);
  pulse.drawCircle(x, y, 10);
  app.stage.addChild(pulse);

  let radius = 10;
  const ticker = new PIXI.Ticker();
  ticker.add(() => {
    radius += 2;
    pulse.clear();
    pulse.lineStyle(2, 0x00ff00, 1 - radius / 100);
    pulse.drawCircle(x, y, radius);
    if (radius > 100) {
      app.stage.removeChild(pulse);
      ticker.stop();
    }
  });
  ticker.start();
}

Cinematic Terrain & Units (Three.js)

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

Add Terrain

const terrainGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887, wireframe: false });
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

Add Unit Model (Placeholder Cube)

const unitGeometry = new THREE.BoxGeometry(1, 1, 1);
const unitMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const unit = new THREE.Mesh(unitGeometry, unitMaterial);
unit.position.set(0, 0.5, 0);
scene.add(unit);

Lighting & Camera

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

Load Custom 3D Model for Oistaria

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('models/oistarian.glb', (gltf) => {
  const oistarian = gltf.scene;
  oistarian.scale.set(1, 1, 1);
  oistarian.position.set(0, 0, 0);
  scene.add(oistarian);
}, undefined, (error) => {
  console.error('Error loading Oistarian model:', error);
});

Add Sandstorm Weather Effects

const sandParticles = [];
const particleMaterial = new THREE.PointsMaterial({ color: 0xdeb887, size: 0.5 });

for (let i = 0; i < 1000; i++) {
  const particle = new THREE.Vector3(
    Math.random() * 100 - 50,
    Math.random() * 10,
    Math.random() * 100 - 50
  );
  sandParticles.push(particle);
}

const particleGeometry = new THREE.BufferGeometry().setFromPoints(sandParticles);
const sandstorm = new THREE.Points(particleGeometry, particleMaterial);
scene.add(sandstorm);

// Animate swirling effect
function animateSandstorm() {
  sandParticles.forEach(p => {
    p.x += Math.sin(p.y) * 0.1;
    p.z += Math.cos(p.x) * 0.1;
  });
  particleGeometry.setFromPoints(sandParticles);
}

Add Fog for Atmosphere

scene.fog = new THREE.FogExp2(0xc2b280, 0.02); // Desert haze

Oistarian’s Cloak Ripple Shader (GLSL)

// Vertex Shader
uniform float time;
uniform float windStrength;

void main() {
  vec3 pos = position;
  pos.y += sin(pos.x * 10.0 + time) * 0.1 * windStrength;
  pos.z += cos(pos.x * 5.0 + time) * 0.05 * windStrength;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

const cloakMaterial = new THREE.ShaderMaterial({
  vertexShader: cloakVertexShader,
  uniforms: {
    time: { value: 0 },
    windStrength: { value: 1.0 }
  }
});

Lightning Flashes

const lightning = new THREE.PointLight(0xffffff, 2, 100);
scene.add(lightning);

function flashLightning() {
  lightning.intensity = 5;
  setTimeout(() => lightning.intensity = 0.5, 100);
}

Heat Distortion (Post-Processing)

// Fragment Shader Snippet
vec2 distortedUV = uv + sin(uv.y * 10.0 + time) * 0.01;
vec4 color = texture2D(tDiffuse, distortedUV);

Sand-Blasted Terrain Deformation

terrain.geometry.vertices.forEach(v => {
  v.y += Math.random() * 0.2 - 0.1; // Subtle erosion
});
terrain.geometry.verticesNeedUpdate = true;

Set Up EffectComposer

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

Heat Distortion Shader

const HeatDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec2 distortedUv = vUv;
      distortedUv.x += sin(vUv.y * 10.0 + time) * 0.005;
      distortedUv.y += cos(vUv.x * 10.0 + time) * 0.005;
      gl_FragColor = texture2D(tDiffuse, distortedUv);
    }
  `
};

ShaderPass
const heatPass = new ShaderPass(HeatDistortionShader);
composer.addPass(heatPass);

Animate the Effect

function animate() {
  requestAnimationFrame(animate);
  heatPass.uniforms.time.value += 0.05;
  composer.render();
}
animate();

Oistarian’s Cloak Shimmer (Fragment Shader)

uniform float time;
uniform vec2 uv;
uniform float shimmerStrength;

void main() {
  vec2 shimmer = uv + vec2(sin(time + uv.y * 10.0), cos(time + uv.x * 5.0)) * 0.01 * shimmerStrength;
  vec4 cloakColor = texture2D(tDiffuse, shimmer);
  gl_FragColor = vec4(cloakColor.rgb, 0.7); // semi-transparent cloak
}

Stack Visual Layers with EffectComposer

Renderpass for base scene 
ShaderPass for heat distortion
FogPass for atmosphere 
Particlespass for swirling sand 

Lightning Flash + Dust Flicker

const flash = new THREE.PointLight(0xffeedd, 5, 200);
scene.add(flash);

function triggerLightning() {
  flash.intensity = 8;
  setTimeout(() => flash.intensity = 0.3, 100);

  // Optional: Add a screen-wide white flash via fullscreen quad
}

Evolving Sand Terrain

terrain.geometry.vertices.forEach(v => {
  v.y += Math.sin(v.x * 0.1 + time) * 0.001 * windStrength;
});
terrain.geometry.verticesNeedUpdate = true;

Weather-Based Procedural DisplacementMap

const displacementMap = new THREE.DataTexture(...); // fill with wind path data

function updateDisplacementMap(windPaths, playerMovement) {
  // Custom logic to adjust pixel data based on wind + movement patterns
  // Smooth interpolation creates natural erosion/deposition
  displacementMap.needsUpdate = true;
}
terrain.material.displacementMap = displacementMap;

Cinematic Intro Scene

Three.js Camera Paths: Use THREE.CurvePath() for sweeping camera motion
• 	Ambient Fade-in: Transition from dark to scene with layered fog and flickering particles
• 	Title Overlay Shader: Render intro text with distortion shader and animated alpha

camera.position.set(...);
new TWEEN.Tween(camera.position)
  .to({ ... }, 3000)
  .easing(TWEEN.Easing.Cubic.Out)
  .start();

Cue in Oistarian emerging from the sandstorm right at beat drop
 Reactive Soundtrack Layers
Build a multi-channel audio system:
• 	Ambient desert wind (constant, low)
• 	Battle pulse synth (intensity rises with combat or weather)
• 	Cloak shimmer tone (subtle harmonic layer during stealth)
Use THREE.AudioAnalyser to modulate particle intensity and color based on audio frequency data. Let the soundtrack conduct the visuals.

  Cloak Vanish with Electric Vapor Trails

float cloakProgress = smoothstep(startTime, endTime, time);
vec4 cloakColor = texture2D(tDiffuse, uv);
cloakColor.a *= 1.0 - cloakProgress; // dissolve out

vec3 vaporTrail = vec3(sin(uv.y * 50.0), cos(uv.x * 30.0), 1.0) * cloakProgress;
gl_FragColor = vec4(cloakColor.rgb + vaporTrail * 0.5, cloakColor.a);
Pair with particle bursts and a flash of blue plasma light when cloak activates. Think of it like a reverse thunderbolt.

  Voiceovers: Breathing Life into Characters

if (distanceToBoss < 50) {
  const voice = new Audio('oistarian-warning.mp3');
  voice.play();
}

Radio-style Narration: Add layered voice tracks via THREE.PositionalAudio to make it feel spatial
• 	Dynamic Echo Effect: In sandstorms or underground zones, modify playback for immersion

Boss Triggers: Waking the Desert Beasts
Turn up the tension:
• 	Environment Response: Lightning strikes, terrain shakes, and fog intensifies
• 	Cutscene Initiation Zone: Custom collision volume starts boss cinematic
• 	AI States:
• 	Idle → Aware → Aggro
• 	Wind effects surge as the boss awakens
Add sound cues like low-pitched pulses, whisper trails, or ancient chants to signal boss emergence.

  Mid-game Cutscenes: Seamless Storytelling
Use these techniques for fluid transitions:
• 	Timed Event System:
if (storyProgress === 'sandgateOpen') {
  playCutscene('desertCollapse');
}

Scene Graph Isolation: Fade main gameplay, load cutscene assets separately
• 	Camera Override: Animate camera for cinematic framing
• 	Shader Stylization: Use sepia or inverted color shaders for flashbacks or memory sequences

 Imagine this: The sands swirl violently. Oistarian’s cloak fizzles. A voice echoes—“The storm was only the beginning…” Lightning cracks as the ground shatters beneath—a colossal shadow rises. Cutscene fades in. Player tension hits max.

   Grizzled Veteran Voice Sample (Oistarian):
[Intro – cinematic cutscene over desert ruins]
"Back in '03, the sands sang a different tune. We held the line—shields cracked, sky burned... but we didn't fold."
[During stealth mode trigger]
"Wind’s changing. Feel it in your bones… they’re watching from beneath."
[Boss trigger warning]
"You hear that rumble? That ain’t thunder. That’s teeth grinding stone. Brace up."
[Flashback cutscene dialogue]
"I walked that canyon once. Left a piece of myself in the ash. Been chasing it ever since."
[Final rally line before major fight]
"Time to make these ghosts remember our name." 

Lore Scrolls: Relics of the Forgotten
Scatter ancient parchment fragments throughout the terrain:
Interactive Collectibles: Press E near scroll to reveal animated text overlay
• 	Dynamic Shader Unveil: Scroll text burns in slowly with heat-distorted shimmer
• 	Sample Scroll Entry:

Backstory Terminals: Echoes of a Lost Civilization
Create forgotten tech nodes with encrypted data logs:

Use THREE.mesh
styled as cracked obelisks, glowing softly with pulse shaders
• 	Unlock content via:
• 	Puzzle solve
• 	Boss defeat
• 	Environmental alignment (e.g. aligning stone circles to sun angle)

{
  "entry_id": "EX-D47",
  "timestamp": "01.07.2036",
  "voice_log": "Subject: Oistarian… Energy levels breached protocol. Failed to contain storm catalyst. Recommend immediate desert evacuation."
}

Secret Audio Logs: Whispers Beneath the Sand
Hide audio triggers in caves, cliffs, abandoned gear:
• 	Use directional sound zones via THREE.PositionalAudio
• 	Voice fades in with proximity, hinting at unseen events
• 	Add layered effects: static, echo, wind overlays
Audio Log Snippet (Grizzled Veteran)
"They built the storm thinking it’d shield them. It didn’t. It saw them."
"I left my brother in that crater. Every time the wind howls—I hear his name."

Scrolls & Logs That Shape the World
 Gameplay Impact
• 	Boss Behavior: Reading certain scrolls weakens or enrages bosses.
• 	Example: “Scroll of the Sand Pact” pacifies the Warden of Dunes unless burned.
• 	Alternate Paths: Logs reveal coordinates to hidden tomb portals or bypasses.
• 	Example: Audio log whispers: “The sun sets twice where the gate lies buried.”
• 	Soundtrack Layers: Each scroll or log unlocks ambient themes.
• 	Example: Collecting 3 relic logs triggers “Echoes of the Storm” music layer.

   Implementation

function onScrollRead(scrollId) {
  if (scrollId === 'sandPact') boss.aggressionLevel -= 1;
  if (scrollId === 'stormEcho') soundtrackLayer.activate('stormTheme');
  if (scrollId === 'tombHint') unlockPath('hiddenTomb');
}

Hidden Tomb Portals
 Discovery Mechanics
• 	Environmental Puzzle: Align ancient mirrors to reflect sunlight onto a buried glyph.
• 	Weather Trigger: Tomb only opens during sandstorm or eclipse.
• 	Lore Tie-In: Scrolls hint at activation rituals.
 Portal FX
• 	Swirling sand vortex with glowing runes
• 	Time slows as player approaches
• 	Whispered voices from the past echo

Time-Shifting Sand Temples
 Dual-State Temples
• 	Day State: Temple is a ruin with traps and puzzles.
• 	Night State: Temple reveals hidden chambers and spectral NPCs.
 Time Shift Triggers
• 	Use relic “Chrono Dust” at altar
• 	Defeat time-bound guardian
• 	Solve temporal riddle: “What walks forward but leaves its past behind? 
  Cursed Relic Questline
🗺 Quest Arc
1. 	Relic Discovery: Found in a tomb sealed by sandstorm.
2. 	Curse Activation: Player gains power but loses health over time.
3. 	Redemption Path: Must find 3 “Echo Shards” to cleanse the relic.
4. 	Final Trial: Face Oistarian’s shadow self in a mirrored desert.
 Gameplay Effects
• 	New abilities: “Dustwalk”, “Echo Pulse”, “Temporal Blink”
• 	Visual FX: Cloak flickers, terrain distorts, enemies whisper your name

Reactive Soundtrack System
| Trigger Event | Sound Layer Activated | 
| Scroll Read: Storm Echo | Ambient wind + low synth hum | 
| Boss Enraged | Percussion surge + vocal chant | 
| Tomb Portal Opened | Ethereal strings + sand chimes | 
| Time Shift Activated | Reverse melody + echo delay | 

  Final Confrontation: Oistarian’s Echo
🕳️ Setting
• 	Location: The Mirrored Expanse—a shifting desert where the sky reflects the past.
• 	Visuals: Glass-like dunes, spectral mirages of Oistarian’s former self, and a fractured moon overhead.
• 	Soundtrack: “Echoes of Betrayal”—a haunting blend of reversed chants and desert wind.
🧿 Boss Mechanics
• 	Phase 1: Oistarian uses “Memory Lash”—attacks based on player’s past choices.
• 	Phase 2: Summons “Echo Doubles”—ghostly versions of the player’s allies.
• 	Phase 3: Fuses with the desert itself, becoming a sandstorm avatar.
🧩 Puzzle Element
• 	Players must use scrolls collected earlier to counter specific attacks:
• 	Scroll of Regret nullifies “Memory Lash”
• 	Log of the Lost reveals Echo Doubles’ weaknesses

🔮 Relic: The Dune Rewriter
📖 Lore
Forged from the sands of forgotten battles, this relic bends reality to rewrite terrain and fate. It was once wielded by the desert’s first guardian, who vanished into time.
🧬 Gameplay Effects
• 	Terrain Shift: Transforms battlefield zones—sand becomes stone, ruins rise from beneath.
• 	Enemy Rewrite: Alters enemy types mid-fight (e.g., melee foes become ranged).
• 	Time Pulse: Rewinds 10 seconds of battle once per encounter.
💥 Visual FX
• 	When activated, the relic emits a ripple that distorts the horizon.
• 	Glyphs swirl around the player, and the ground reshapes with glowing fissures.

🎭 Narrative Twist
After defeating Oistarian, the player learns they were the desert’s chosen archivist all along—meant to preserve, not destroy. The relic offers a choice:
• 	Seal the desert’s memory forever
• 	Let it whisper to future wanderers

# Final Confrontation: Oistarian’s Echo

class MirroredExpanse:
    def __init__(self):
        self.visuals = ["Glass-like dunes", "Spectral mirages", "Fractured moon"]
        self.soundtrack = "Echoes of Betrayal"
        self.active = False

    def activate_scene(self):
        self.active = True
        play_soundtrack(self.soundtrack)
        render_environment(self.visuals)

class OistarianBoss:
    def __init__(self):
        self.phase = 1
        self.enraged = False

    def memory_lash(self, player_choices):
        return generate_attack_pattern(player_choices)

    def summon_echo_doubles(self, allies):
        return [create_ghost_clone(ally) for ally in allies]

    def desert_fusion(self):
        transform_to_sandstorm_avatar()
        self.enraged = True

    def next_phase(self):
        self.phase += 1

class PuzzleMechanics:
    def __init__(self, scrolls):
        self.scrolls = scrolls

    def counter_attack(self, attack_type):
        if attack_type == "Memory Lash" and "Scroll of Regret" in self.scrolls:
            return "Attack Nullified"
        elif attack_type == "Echo Doubles" and "Log of the Lost" in self.scrolls:
            return "Weakness Revealed"
        return "No Counter Available"

class DuneRewriterRelic:
    def __init__(self):
        self.cooldown = 1
        self.used = False

    def activate(self):
        if not self.used:
            terrain_shift()
            enemy_rewrite()
            time_pulse()
            visual_fx()
            self.used = True

def terrain_shift():
    modify_terrain("sand", "stone")
    raise_ruins()

def enemy_rewrite():
    change_enemy_type("melee", "ranged")

def time_pulse():
    rewind_time(seconds=10)

def visual_fx():
    emit_ripple_effect()
    swirl_glyphs()
    reshape_ground()

def narrative_twist(player):
    reveal_identity(player, "Desert Archivist")
    choice = present_choice(["Seal Memory", "Whisper to Wanderers"])
    return choice

# Game Flow
scene = MirroredExpanse()
scene.activate_scene()

boss = OistarianBoss()
player_scrolls = ["Scroll of Regret", "Log of the Lost"]
puzzle = PuzzleMechanics(player_scrolls)

# Boss Fight Sequence
boss.memory_lash(player_choices)
puzzle.counter_attack("Memory Lash")
boss.next_phase()
boss.summon_echo_doubles(player_allies)
puzzle.counter_attack("Echo Doubles")
boss.next_phase()
boss.desert_fusion()

# Relic Activation
relic = DuneRewriterRelic()
relic.activate()

# Ending
final_choice = narrative_twist(player)

Relic Origin Trial: The Rite of Rewriting
🏜️ Trial Setting
• 	Location: The Cradle of Dust—a buried amphitheater beneath shifting dunes.
• 	Challenge Format: Tactical arena with rotating terrain, elemental hazards, and memory-based puzzles.
🧩 Trial Phases
1. 	Echo Puzzle: Match ancient glyphs to player’s past decisions.
2. 	Terrain Tactics: Survive waves of enemies while terrain morphs every 30 seconds.
3. 	Guardian Duel: Face the First Archivist, who uses relic abilities against you.
🎮 Tactical Mechanics
• 	Scroll Synergy: Combine scrolls mid-battle for buffs (e.g., “Regret + Storm Echo” = AoE silence).
• 	Environmental Control: Use relic fragments to freeze, burn, or reshape zones.
• 	Memory Traps: Wrong choices summon illusions of past failures.
Multi-Ending Arc: The Archivist’s Choice
| Ending | Trigger Condition | Outcome | 
| 🕊️ Preservation | Spare Oistarian, seal relic | Desert becomes a sanctuary of memory; soundtrack shifts to “Whispers Eternal” | 
| 🔥 Reclamation | Destroy relic, defeat Oistarian | Desert resets; all scrolls lost, but player gains “Dustborn” title | 
| 🌫️ Echo Cycle | Use relic to rewrite time | Game loops with altered NPCs, new tombs, and hidden boss variants | 
| 🌀 Fragmented Truth | Fail origin trial | Relic shatters; player haunted by mirages, soundtrack distorts permanently | 

  Final Tactical Encounter: Oistarian’s Echo Redux
- Battlefield: Dynamic zones—glass dunes, rising ruins, collapsing memories.
- Boss Phases:
- Phase 1: Tactical mimicry—Oistarian copies player’s relic use.
- Phase 2: Memory Collapse—terrain shifts based on player’s scroll history.
- Phase 3: Archivist’s Reckoning—player must choose which memory to sacrifice for victory.
# Relic Origin Trial: The Rite of Rewriting

class CradleOfDustArena:
    def __init__(self):
        self.terrain_states = ["Sand Dunes", "Obsidian Ruins", "Glass Plains"]
        self.current_state = 0
        self.hazards = ["Heatwave", "Sandstorm", "Quicksand"]
        self.timer = 0

    def rotate_terrain(self):
        self.current_state = (self.current_state + 1) % len(self.terrain_states)
        apply_terrain(self.terrain_states[self.current_state])
        trigger_hazard(self.hazards[self.current_state])

class EchoPuzzle:
    def __init__(self, player_history):
        self.glyphs = generate_glyphs()
        self.history = player_history

    def match_glyphs(self):
        for glyph in self.glyphs:
            if glyph not in self.history:
                summon_memory_trap(glyph)
            else:
                unlock_buff(glyph)

class EnemyWaveManager:
    def __init__(self):
        self.wave_count = 0

    def spawn_wave(self, terrain_type):
        enemies = generate_enemies(terrain_type)
        deploy_enemies(enemies)

class FirstArchivistBoss:
    def __init__(self):
        self.relic_abilities = ["Terrain Shift", "Time Pulse", "Echo Pulse"]

    def use_ability(self, player_state):
        chosen = counter_player_strategy(player_state)
        activate_ability(chosen)

class ScrollSynergySystem:
    def __init__(self, active_scrolls):
        self.scrolls = active_scrolls

    def combine_scrolls(self):
        if "Regret" in self.scrolls and "Storm Echo" in self.scrolls:
            return apply_buff("AoE Silence")
        elif "Chrono Dust" in self.scrolls and "Lost Flame" in self.scrolls:
            return apply_buff("Time Freeze")
        return None

class EnvironmentalControl:
    def __init__(self, relic_fragments):
        self.fragments = relic_fragments

    def reshape_zone(self, effect):
        if effect == "Freeze":
            freeze_zone()
        elif effect == "Burn":
            ignite_zone()
        elif effect == "Reshape":
            morph_terrain()

class MemoryTrapSystem:
    def __init__(self):
        self.traps_triggered = []

    def summon_trap(self, failed_choice):
        illusion = create_failure_illusion(failed_choice)
        self.traps_triggered.append(illusion)
        deploy_illusion(illusion)

# Trial Flow
arena = CradleOfDustArena()
puzzle = EchoPuzzle(player_history)
waves = EnemyWaveManager()
boss = FirstArchivistBoss()
synergy = ScrollSynergySystem(active_scrolls)
env_control = EnvironmentalControl(relic_fragments)
memory_traps = MemoryTrapSystem()

# Trial Sequence
arena.rotate_terrain()
puzzle.match_glyphs()
waves.spawn_wave(arena.terrain_states[arena.current_state])
synergy.combine_scrolls()
env_control.reshape_zone("Reshape")
boss.use_ability(player_state)

Quest Chain: Echoes of the Archivist
1. Prologue: Whisper in the Wind
• 	Trigger: Player finds a buried scroll near a broken obelisk.
• 	Voiceover: “The desert remembers. But do you?”
• 	Objective: Decode glyphs to unlock the Cradle of Dust.
2. Trial of the First Archivist
• 	Location: Tactical arena with shifting terrain.
• 	Gameplay:
• 	Terrain rotates every 30 seconds.
• 	Scroll combos grant buffs (e.g., “Storm Echo + Regret” = AoE silence).
• 	Voiceover: “To rewrite fate, you must first survive it.”
3. The Dune Rewriter’s Awakening
• 	Objective: Reassemble relic fragments across 3 tombs.
• 	Puzzle: Each tomb has a time-shift mechanic and elemental hazard.
• 	Voiceover: “Stone remembers battle. Sand remembers blood.”
4. Confrontation: Oistarian’s Echo
• 	Phases:
• 	Memory Lash: Attacks based on player’s past scrolls.
• 	Echo Doubles: Ghostly allies turned foes.
• 	Sandstorm Avatar: Terrain becomes hostile.
• 	Voiceover: “You archived your victories. Now face your regrets.”
5. Archivist’s Reckoning
• 	Choice: Seal memory, rewrite time, or let the desert whisper.
• 	Voiceover Variants:
• 	Preservation: “Let silence be the final verse.”
• 	Reclamation: “Burn the past. Breathe anew.”
• 	Echo Cycle: “Time is a spiral. You are its center.”
• 	Fragmented Truth: “You were never meant to remember.”

Voiceover Trigger System
| Event | Voice Line | 
| Scroll Read | “A memory etched in dust.” | 
| Relic Activation | “Reality bends beneath your will.” | 
| Tomb Entry | “The dead speak in echoes.” | 
| Final Choice | Dynamic line based on player’s journey | 
Tactical Layer Integration
- Scroll Synergy Grid: Combine scrolls for tactical effects.
- Relic Terrain Rewrite: Shift zones mid-combat to gain advantage.
- Enemy Memory AI: Bosses adapt based on player’s scroll history.
# Relic Origin Trial: The Rite of Rewriting

class CradleOfDustArena:
    def __init__(self):
        self.terrain_states = ["Sand Dunes", "Obsidian Ruins", "Glass Plains"]
        self.current_state = 0
        self.hazards = ["Heatwave", "Sandstorm", "Quicksand"]
        self.timer = 0

    def rotate_terrain(self):
        self.current_state = (self.current_state + 1) % len(self.terrain_states)
        apply_terrain(self.terrain_states[self.current_state])
        trigger_hazard(self.hazards[self.current_state])

class EchoPuzzle:
    def __init__(self, player_history):
        self.glyphs = generate_glyphs()
        self.history = player_history

    def match_glyphs(self):
        for glyph in self.glyphs:
            if glyph not in self.history:
                summon_memory_trap(glyph)
            else:
                unlock_buff(glyph)

class EnemyWaveManager:
    def __init__(self):
        self.wave_count = 0

    def spawn_wave(self, terrain_type):
        enemies = generate_enemies(terrain_type)
        deploy_enemies(enemies)

class FirstArchivistBoss:
    def __init__(self):
        self.relic_abilities = ["Terrain Shift", "Time Pulse", "Echo Pulse"]

    def use_ability(self, player_state):
        chosen = counter_player_strategy(player_state)
        activate_ability(chosen)

class ScrollSynergySystem:
    def __init__(self, active_scrolls):
        self.scrolls = active_scrolls

    def combine_scrolls(self):
        if "Regret" in self.scrolls and "Storm Echo" in self.scrolls:
            return apply_buff("AoE Silence")
        elif "Chrono Dust" in self.scrolls and "Lost Flame" in self.scrolls:
            return apply_buff("Time Freeze")
        return None

class EnvironmentalControl:
    def __init__(self, relic_fragments):
        self.fragments = relic_fragments

    def reshape_zone(self, effect):
        if effect == "Freeze":
            freeze_zone()
        elif effect == "Burn":
            ignite_zone()
        elif effect == "Reshape":
            morph_terrain()

class MemoryTrapSystem:
    def __init__(self):
        self.traps_triggered = []

    def summon_trap(self, failed_choice):
        illusion = create_failure_illusion(failed_choice)
        self.traps_triggered.append(illusion)
        deploy_illusion(illusion)

# Trial Flow
arena = CradleOfDustArena()
puzzle = EchoPuzzle(player_history)
waves = EnemyWaveManager()
boss = FirstArchivistBoss()
synergy = ScrollSynergySystem(active_scrolls)
env_control = EnvironmentalControl(relic_fragments)
memory_traps = MemoryTrapSystem()

# Trial Sequence
arena.rotate_terrain()
puzzle.match_glyphs()
waves.spawn_wave(arena.terrain_states[arena.current_state])
synergy.combine_scrolls()
env_control.reshape_zone("Reshape")
boss.use_ability(player_state)
# Oistarian’s Echo: Full Quest Chain Script

class Quest:
    def __init__(self, id, name, description, voice_trigger, voice_line, objective, mechanics, branches):
        self.id = id
        self.name = name
        self.description = description
        self.voice_trigger = voice_trigger
        self.voice_line = voice_line
        self.objective = objective
        self.mechanics = mechanics
        self.branches = branches

class Branch:
    def __init__(self, choice, outcome, next_quest):
        self.choice = choice
        self.outcome = outcome
        self.next_quest = next_quest

# Define quests
quests = []

quests.append(Quest(
    id="q1",
    name="Echoes in the Wind",
    description="Investigate the strange resonance near the Whispering Cliffs.",
    voice_trigger="player_enters_cliffs",
    voice_line="Do you hear it? The wind carries more than whispers...",
    objective="Scan the cliffs for echo crystals",
    mechanics=["Environmental scanning", "Puzzle solving"],
    branches=[
        Branch("Touch the crystal", "Unlock memory fragment", "q2"),
        Branch("Leave it alone", "Lose opportunity to learn lore", "q3")
    ]
))

quests.append(Quest(
    id="q2",
    name="Memory of the First Seal",
    description="Decipher the memory fragment to locate the first seal.",
    voice_trigger="memory_fragment_unlocked",
    voice_line="The seal lies beneath the roots of the world...",
    objective="Travel to the Rootspire and defeat the guardian",
    mechanics=["Combat", "Lore deciphering"],
    branches=[
        Branch("Challenge the guardian", "Gain access to the seal", "q4"),
        Branch("Sneak past", "Risk unstable seal activation", "q5")
    ]
))

quests.append(Quest(
    id="q3",
    name="Echoes Unheard",
    description="Without the crystal's guidance, seek alternative clues in the ruins.",
    voice_trigger="player_enters_ruins",
    voice_line="The silence here is louder than screams...",
    objective="Search ruins for ancient texts",
    mechanics=["Exploration", "Lore gathering"],
    branches=[
        Branch("Translate the texts", "Partial understanding of the seals", "q5"),
        Branch("Ignore the texts", "Miss critical lore", "q6")
    ]
))

quests.append(Quest(
    id="q4",
    name="Seal of the Rootspire",
    description="Activate the seal and absorb its power.",
    voice_trigger="seal_activated",
    voice_line="One seal awakens. The echo grows stronger...",
    objective="Channel the seal’s energy",
    mechanics=["Energy channeling", "Skill upgrade"],
    branches=[
        Branch("Use power to locate next seal", "Advance to final quest", "q7")
    ]
))

quests.append(Quest(
    id="q5",
    name="Unstable Awakening",
    description="The seal activates erratically, threatening the region.",
    voice_trigger="seal_malfunction",
    voice_line="The echo screams in chaos...",
    objective="Stabilize the seal",
    mechanics=["Timed puzzle", "Combat"],
    branches=[
        Branch("Stabilize successfully", "Partial power gained", "q7"),
        Branch("Fail to stabilize", "Region damaged, echo fades", "q6")
    ]
))

quests.append(Quest(
    id="q6",
    name="Echo Lost",
    description="Without the seal’s power, the echo dims.",
    voice_trigger="quest_failed",
    voice_line="The silence returns... was it ever real?",
    objective="Reflect on the journey",
    mechanics=["Narrative closure"],
    branches=[]
))

quests.append(Quest(
    id="q7",
    name="Oistarian’s Return",
    description="With the seals awakened, confront the echo’s source.",
    voice_trigger="final_confrontation",
    voice_line="The echo is no longer a whisper. It is a roar.",
    objective="Defeat the Echo Entity",
    mechanics=["Boss battle", "Lore resolution"],
    branches=[
        Branch("Absorb the echo", "Become Echo Warden", None),
        Branch("Release the echo", "Restore balance to the world", None)
    ]
))

# Display quest chain
for quest in quests:
    print(f"\nQuest: {quest.name}")
    print(f"Description: {quest.description}")
    print(f"Voice Trigger: {quest.voice_trigger} → \"{quest.voice_line}\"")
    print(f"Objective: {quest.objective}")
    print(f"Mechanics: {', '.join(quest.mechanics)}")
    for branch in quest.branches:
        print(f"  → Choice: {branch.choice} → Outcome: {branch.outcome} → Next: {branch.next_quest}")

Companion Reactions System

Each companion has unique emotional and tactical responses based on player choices:
| Companion | Reaction Trigger | Response | 
| Kael the Sandblade | Player uses relic to rewrite terrain | “You bend the desert to your will… but will it bend back?” | 
| Nyra the Echo Seer | Player spares Oistarian | “Mercy echoes longer than vengeance.” | 
| Threx the Flamebound | Player fails the origin trial | “You were chosen. You were tested. You were found wanting.” | 


- 
- Gameplay Impact: Reactions affect combat synergy, dialogue options, and unlock hidden scrolls if trust is high.
Faction Reputation System
Three desert factions respond dynamically to your actions:
Each companion has unique emotional and tactical responses based on player choices:
| Companion | Reaction Trigger | Response | 
| Kael the Sandblade | Player uses relic to rewrite terrain | “You bend the desert to your will… but will it bend back?” | 
| Nyra the Echo Seer | Player spares Oistarian | “Mercy echoes longer than vengeance.” | 
| Threx the Flamebound | Player fails the origin trial | “You were chosen. You were tested. You were found wanting.” | 


- 
- Gameplay Impact: Reactions affect combat synergy, dialogue options, and unlock hidden scrolls if trust is high.
Faction Reputation System
Three desert factions respond dynamically to your actions:
| Faction | Reputation Trigger | Outcome | 
| The Duneborn | Preserve ancient scrolls | Offer rare relic fragments and lore | 
| The Glassbound | Rewrite terrain during battle | Grant access to mirrored sanctuaries | 
| The Eden Watchers | Discover the Vault of Eden tomb | Reveal forbidden knowledge and soundtrack layer “Vault Pulse” | 


- Reputation Levels: Neutral → Trusted → Revered → Chosen
- Faction Trials: Each level unlocks a unique tactical challenge or relic upgrade.

🎶 Dynamic Soundtrack Layering
Sound evolves based on quest outcomes and relic use:
| Event | Sound Layer | 
| Relic Activation | “Dust Ripple” – ambient distortion with echo pulses | 
| Companion Death | “Ashes Remember” – mournful strings and fading chants | 
| Vault of Eden Tomb Entry | “Vault Pulse” – low-frequency hum with ancient whispers | 
| Faction Betrayal | “Fractured Oath” – broken melodies and reversed percussion | 


- Layer Stacking: Multiple layers can blend based on emotional and tactical states.

🕳 Secret Tomb: Vault of Eden
 Location
- Beneath the shifting dunes near the Cradle of Dust, hidden by a mirage field.
- Only revealed when player aligns three “Sun Tears” relics at dusk.
 Tomb Mechanics
- Temporal Lock: Must solve a puzzle that spans past, present, and future glyphs.
- Echo Guardian: A spectral archivist who tests the player’s memory and morality.
- Vault Choice:
- Absorb Eden’s Echo: Gain ultimate relic power, lose companion trust.
- Seal the Vault: Preserve lore, gain faction reverence.

This expansion turns your desert epic into a living, breathing world of consequence and resonance. Want to script the Eden Guardian’s dialogue or design the Sun Tears puzzle sequence? The vault is waiting... 🌌📜⚔️
Three desert factions respond dynamically to your actions:
| Faction | Reputation Trigger | Outcome | 
| The Duneborn | Preserve ancient scrolls | Offer rare relic fragments and lore | 
| The Glassbound | Rewrite terrain during battle | Grant access to mirrored sanctuaries | 
| The Eden Watchers | Discover the Vault of Eden tomb | Reveal forbidden knowledge and soundtrack layer “Vault Pulse” | 


- 
- Reputation Levels: Neutral → Trusted → Revered → Chosen
- Faction Trials: Each level unlocks a unique tactical challenge or relic upgrade.
Dynamic Soundtrack Layering
Sound evolves based on quest outcomes and relic use:
| Event | Sound Layer | 
| Relic Activation | “Dust Ripple” – ambient distortion with echo pulses | 
| Companion Death | “Ashes Remember” – mournful strings and fading chants | 
| Vault of Eden Tomb Entry | “Vault Pulse” – low-frequency hum with ancient whispers | 
| Faction Betrayal | “Fractured Oath” – broken melodies and reversed percussion | 


- Layer Stacking: Multiple layers can blend based on emotional and tactical states.

🕳️ Secret Tomb: Vault of Eden
📍 Location
- Beneath the shifting dunes near the Cradle of Dust, hidden by a mirage field.
- Only revealed when player aligns three “Sun Tears” relics at dusk.
🧩 Tomb Mechanics
- Temporal Lock: Must solve a puzzle that spans past, present, and future glyphs.
- Echo Guardian: A spectral archivist who tests the player’s memory and morality.
- Vault Choice:
- Absorb Eden’s Echo: Gain ultimate relic power, lose companion trust.
- Seal the Vault: Preserve lore, gain faction reverence.

This expansion turns your desert epic into a living, breathing world of consequence and resonance. Want to script the Eden Guardian’s dialogue or design the Sun Tears puzzle sequence? The vault is waiting... 🌌📜⚔️
Sound evolves based on quest outcomes and relic use:
| Event | Sound Layer | 
| Relic Activation | “Dust Ripple” – ambient distortion with echo pulses | 
| Companion Death | “Ashes Remember” – mournful strings and fading chants | 
| Vault of Eden Tomb Entry | “Vault Pulse” – low-frequency hum with ancient whispers | 
| Faction Betrayal | “Fractured Oath” – broken melodies and reversed percussion | 


- 
- Layer Stacking: Multiple layers can blend based on emotional and tactical states.
Secret Tomb: Vault of Eden
 Location
- Beneath the shifting dunes near the Cradle of Dust, hidden by a mirage field.
- Only revealed when player aligns three “Sun Tears” relics at dusk.
 Tomb Mechanics
- Temporal Lock: Must solve a puzzle that spans past, present, and future glyphs.
- Echo Guardian: A spectral archivist who tests the player’s memory and morality.
- Vault Choice:
- Absorb Eden’s Echo: Gain ultimate relic power, lose companion trust.
- Seal the Vault: Preserve lore, gain faction reverence. 

   Eden Guardian Dialogue: The Archivist of Silence
The Eden Guardian is a spectral figure cloaked in shifting sand and light, speaking in riddles and echoes. Their voice is layered—part whisper, part thunder.
  Encounter Dialogue
[Upon Entry]
“You walk beneath the vault, but do you walk with purpose?”

[If player has high faction reputation]
“The Duneborn sing your name. The Glassbound reflect your truth. You are known.”

[If player failed the origin trial]
“You touched the echo and recoiled. Memory does not forgive.”

[During Battle]
“Your relic rewrites the sand—but can it rewrite regret?”

[Final Choice Prompt]
“The vault remembers all. Will you seal its silence, or let it speak again?”

Branching Outcomes
• 	Seal the Vault: Guardian bows. “Then let the desert sleep.”
• 	Release the Echo: Guardian dissolves into light. “So be it. Let memory walk again.”

Sun Tears Puzzle Sequence: The Vault Alignment Trial
 Puzzle Setup
• 	Objective: Align three ancient relics called Sun Tears at dusk to reveal the Vault.
• 	Location: Spread across three biomes—Glass Plains, Obsidian Ruins, and the Cradle of Dust.
Puzzle Mechanics
1. 	Sun Tear I – Glass Plains
• 	Challenge: Reflect sunlight through mirrored obelisks.
• 	Tactical Element: Must rotate terrain to expose correct angles.
• 	Lore Hint: “The first tear shines only when the sky weeps glass.”
2. 	Sun Tear II – Obsidian Ruins
• 	Challenge: Solve a glyph riddle based on player’s scroll history.
• 	Tactical Element: Wrong glyphs trigger memory traps.
• 	Lore Hint: “The second tear hides in the shadow of forgotten flame.”
3. 	Sun Tear III – Cradle of Dust
• 	Challenge: Survive a timed enemy wave while protecting the relic.
• 	Tactical Element: Use relic fragments to reshape terrain defensively.
• 	Lore Hint: “The final tear falls only when the dunes remember your name.”
 Vault Activation
• 	Once all three are placed at the Vault’s altar during dusk:
• 	The sky fractures.
• 	Soundtrack shifts to “Vault Pulse”—a low hum with ancient whispers.
• 	The Eden Guardian emerges. 

  Companion Reactions to Sun Tear Puzzles
 Sun Tear I – Glass Plains (Mirror Puzzle)
• 	Kael the Sandblade:
“Precision. Reflection. This puzzle’s a warrior’s meditation.”
Bonus: If Kael is present, mirrored obelisks rotate faster.
• 	Nyra the Echo Seer:
“The light bends truth. Be careful what you reflect.”
Bonus: Nyra reveals hidden glyphs if trust level is high.
• 	Threx the Flamebound:
“Mirrors? I prefer fire. Let me know when something needs breaking.”
Penalty: Threx may accidentally shatter a mirror if morale is low.
  Sun Tear II – Obsidian Ruins (Glyph Riddle)
• 	Kael:
“Glyphs are like blade marks—each tells a story.”
Bonus: Kael helps decipher combat-related glyphs.
• 	Nyra:
“These symbols echo choices you’ve buried. Listen.”
Bonus: Nyra unlocks a hidden glyph path if player spared Oistarian.
• 	Threx:
“I don’t read. I burn.”
Penalty: May trigger a memory trap if left unsupervised.
  Sun Tear III – Cradle of Dust (Defense Trial)
• 	Kael:
“Hold the line. Let the sand remember your stance.”
Bonus: Kael boosts defense of terrain zones.
• 	Nyra:
“The storm is watching. Let it see your resolve.”
Bonus: Nyra grants vision of incoming waves.
• 	Threx:
“Finally—something worth torching.”
Bonus: Threx adds fire traps to terrain.
Hidden Fourth Sun Tear – The Tear of Dusk
 Discovery
• 	Only revealed if:
• 	All companions are present.
• 	Player has read the “Scroll of Forgotten Light.”
• 	Puzzle glyphs were solved without triggering traps.
 Puzzle Challenge: Vault of Shadows
• 	Objective: Align moonlight reflections across obsidian shards during eclipse.
• 	Tactical Twist: Terrain shifts every 10 seconds; companions must hold positions to stabilize beams.
 Companion Roles
• 	Kael: Anchors shards with precision.
• 	Nyra: Times the eclipse window.
• 	Threx: Clears sandstorms that obscure the moon.
  Secret Ending: The Archivist’s Ascension
If the Tear of Dusk is placed at the Vault altar:
• 	Narrative Outcome:
The Eden Guardian kneels. “You did not rewrite the desert. You listened.”
The player becomes the Echo Archivist, able to revisit any memory, reshape any terrain, and unlock a new game mode: Chrono Echo.
• 	Soundtrack Shift:
“Dusk Eternal” — a blend of ambient wind, reversed chants, and harmonic pulses.

  Chrono Echo Mode – “Rewrite the Sands”
Gameplay Mechanics
• 	Memory Weaving: Players revisit key moments from the main story and alter choices, terrain, or companion fates.
• 	Echo Threads: Each change creates a ripple—new quests, altered puzzles, or companion dynamics.
• 	Temporal Anchors: Special obelisks allow players to lock in alternate timelines or revert to original paths.
 Strategic Depth
• 	Companion Echoes: Past versions of Kael, Nyra, and Threx appear with different personalities based on prior choices.
• 	Chrono Trials: Time-based challenges where players must solve puzzles before the memory collapses.
 Audio Signature
• 	Soundtrack evolves with each timeline—layered motifs from “Dusk Eternal” blend with reversed ambient cues. 
  
Post-Ending Epilogue – “Wanderer’s Legacy”
 Setting
• 	Decades after the Archivist’s Ascension, the desert has changed. New settlements rise, old ruins whisper.
• 	The player now guides young wanderers—each with unique traits and destinies.
 Gameplay Loop
• 	Mentorship System: Teach puzzle-solving, combat, and terrain shaping.
• 	Legacy Trials: Wanderers face echoes of past challenges, reshaped by the player’s previous decisions.
• 	Archivist’s Journal: A living codex that updates with each wanderer’s journey.
Narrative Arcs
• 	The Lost Cartographer: A wanderer seeks to map the entire desert, uncovering forgotten zones.
• 	The Flameborn Heir: Descendant of Threx, torn between destruction and renewal.
• 	The Echo Listener: Sensitive to memory fragments, can unlock hidden lore if guided well.
Challenges
• 	Moral Dilemmas: Should the player reveal painful truths or let wanderers discover them?
• 	Terrain Decay: Past reshaped zones begin to collapse—requiring intervention or sacrifice.
• 	Companion Legacy: Echoes of Kael, Nyra, and Threx may appear to challenge or support the player’s teachings. 

  

  











  







  
  



void Awake()
{
    if (Instance == null) Instance = this;
    else Destroy(gameObject);
    DontDestroyOnLoad(gameObject);
}

public void CompleteMission(Mission mission)
{
    mission.Status = MissionStatus.Completed;
    TotalRewards += mission.Reward;
    // Unlock the next mission or secret op
}

public Mission GetNextMission()
{
    foreach (var m in AllMissions)
        if (m.Status == MissionStatus.Unlocked)
            return m;
    return null;
}

// Example mission: "The Hunt for Hamas"
public void PopulateMissions()
{
    AllMissions = new List<Mission>
    {
        new Mission {
            Title = "Operation Desert Ghost",
            Description = "Infiltrate a fortified enemy compound to retrieve stolen intel.",
            MissionRegion = Region.MiddleEast,
            IsSecretOp = false,
            Status = MissionStatus.Unlocked,
            Reward = 1500,
            Objectives = new[] { "Infiltrate compound", "Retrieve intel", "Exfiltrate" }
        },
        new Mission {
            Title = "The Hunt for Hamas",
            Description = "Stealthily locate and neutralize Hamas leadership in a dense urban environment. Avoid civilian casualties.",
            MissionRegion = Region.Gaza,
            IsSecretOp = true,
            Status = MissionStatus.Locked,
            Reward = 4000,
            Objectives = new[] { "Locate cell leader", "Gather intel", "Neutralize target", "Escape undetected" }
        },
        // Add more missions as needed
    };
}
using UnityEngine;
using System.Collections.Generic;

public enum Region { MiddleEast, Europe, SouthAmerica, Israel, Gaza, Iran, Yemen, JudeaSamaria }
public enum MissionStatus { Locked, Unlocked, Completed }

[System.Serializable]
public class Mission
{
    public string Title;
    public string Description;
    public Region MissionRegion;
    public bool IsSecretOp;
    public MissionStatus Status;
    public int Reward;
    public string[] Objectives;
}

[System.Serializable]
public class Commander
{
    public string Name;
    public string Agency; // e.g. Mossad, Oistarian
    public string Role;
}

public class PlayerAgent
{
    public string Codename;
    public List<string> Specializations;
    public int Rank;
}

public class GameManager: MonoBehaviour
{
    public static GameManager Instance;

    public List<Mission> AllMissions;
    public List<Commander> Commanders;
    public PlayerAgent Player;
    public int TotalRewards = 0;

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);

        DontDestroyOnLoad(gameObject);
        PopulateCommanders();
        PopulateMissions();
    }

    public void CompleteMission(Mission mission)
    {
        if (mission.Status != MissionStatus.Completed)
        {
            mission.Status = MissionStatus.Completed;
            TotalRewards += mission.Reward;

            // Unlock next mission
            UnlockNextMission();
        }
    }

    private void UnlockNextMission()
    {
        foreach (var m in AllMissions)
        {
            if (m.Status == MissionStatus.Locked)
            {
                m.Status = MissionStatus.Unlocked;
                break;
            }
        }
    }

    public Mission GetNextMission()
    {
        foreach (var m in AllMissions)
            if (m.Status == MissionStatus.Unlocked)
                return m;
        return null;
    }

    private void PopulateCommanders()
    {
        Commanders = new List<Commander>
        {
            new Commander { Name = "Alon Regev", Agency = "Mossad", Role = "Intelligence Strategist" },
            new Commander { Name = "Lira Ostin", Agency = "Oistarian", Role = "Cyber Ops Lead" },
            new Commander { Name = "Col. Dov Amir", Agency = "IDF", Role = "Field Commander" },
        };
    }

    public void PopulateMissions()
    {
        AllMissions = new List<Mission>
        {
            new Mission {
                Title = "Operation Desert Ghost",
                Description = "Infiltrate a fortified enemy compound to retrieve stolen intel.",
                MissionRegion = Region.MiddleEast,
                IsSecretOp = false,
                Status = MissionStatus.Unlocked,
                Reward = 1500,
                Objectives = new[] { "Infiltrate compound", "Retrieve intel", "Exfiltrate" }
            },

            new Mission {
                Title = "The Hunt for Hamas",
                Description = "Locate and neutralize Hamas leadership in a dense urban setting. Minimize collateral damage.",
                MissionRegion = Region.Gaza,
                IsSecretOp = true,
                Status = MissionStatus.Locked,
                Reward = 4000,
                Objectives = new[] { "Locate cell leader", "Gather intel", "Neutralize target", "Escape undetected" }
            },

            new Mission {
                Title = "Rise of Israel’s Defense Center",
                Description = "Oversee the construction of Israel’s AI-integrated defense headquarters while protecting it from cyber threats.",
                MissionRegion = Region.Israel,
                IsSecretOp = false,
                Status = MissionStatus.Locked,
                Reward = 2500,
                Objectives = new[] { "Secure perimeter", "Deploy counter-cyber tools", "Supervise construction" }
            },

            new Mission {
                Title = "Shadow Over Tehran",
                Description = "Coordinate Mossad and Oistarian teams to intercept Iranian nuclear logistics.",
                MissionRegion = Region.Iran,
                IsSecretOp = true,
                Status = MissionStatus.Locked,
                Reward = 6000,
                Objectives = new[] { "Track uranium convoy", "Hack control systems", "Evade IRGC patrols", "Extract with intel" }
            },

            new Mission {
                Title = "Judea & Samaria Siege",
                Description = "Prevent a major insurgency operation by securing settlements and disabling weapons caches.",
                MissionRegion = Region.JudeaSamaria,
                IsSecretOp = false,
                Status = MissionStatus.Locked,
                Reward = 3200,
                Objectives = new[] { "Secure key settlements", "Disable rebel communications", "Capture ringleaders" }
            },

            new Mission {
                Title = "Drone Storm from Yemen",
                Description = "Intercept incoming Houthi drone strikes on southern Israel using radar jamming and Iron Dome support.",
                MissionRegion = Region.Yemen,
                IsSecretOp = false,
                Status = MissionStatus.Locked,
                Reward = 3000,
                Objectives = new[] { "Detect drone swarm", "Coordinate Iron Dome", "Neutralize hostiles" }
            },

            new Mission {
                Title = "UN War Crime Tribunal",
                Description = "Collect digital evidence from the battlefield, provide intelligence to ICC prosecutors for war crime investigations.",
                MissionRegion = Region.Europe,
                IsSecretOp = true,
                Status = MissionStatus.Locked,
                Reward = 5000,
                Objectives = new[] { "Extract video evidence", "Secure war logs", "Deliver encrypted package" }
            }
        };
    }
}





using UnityEngine;
using System.Collections.Generic;

public enum Region { MiddleEast, Europe, SouthAmerica, GenericZone1, GenericZone2 }
public enum MissionStatus { Locked, Unlocked, Completed }

[System.Serializable]
public class Mission
{
    public string Title;
    public string Description;
    public Region MissionRegion;
    public bool IsSecretOp;
    public MissionStatus Status;
    public int Reward;
    public string[] Objectives;
}

public class GameManager: MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public List<Mission> AllMissions = new();
    public PlayerAgent Player;
    public int TotalRewards { get; private set; }

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void CompleteMission(Mission mission)
    {
        if (mission == null || mission.Status == MissionStatus.Completed) return;

        mission.Status = MissionStatus.Completed;
        TotalRewards += mission.Reward;
        UnlockNextMission();
    }

    private void UnlockNextMission()
    {
        foreach (var m in AllMissions)
        {
            if (m.Status == MissionStatus.Locked)
            {
                m.Status = MissionStatus.Unlocked;
                break;
            }
        }
    }

    public Mission GetNextMission()
    {
        return AllMissions.Find(m => m.Status == MissionStatus.Unlocked);
    }

    public void PopulateMissions()
    {
        AllMissions = new List<Mission>
        {
            new Mission {
                Title = "Operation Desert Ghost",
                Description = "Infiltrate a fortified compound and retrieve stolen intel.",
                MissionRegion = Region.MiddleEast,
                IsSecretOp = false,
                Status = MissionStatus.Unlocked,
                Reward = 1500,
                Objectives = new[] { "Infiltrate compound", "Retrieve intel", "Exfiltrate" }
            },
            new Mission {
                Title = "Urban Phantom",
                Description = "Stealth operation to locate leadership in a dense zone. Avoid detection and collateral.",
                MissionRegion = Region.GenericZone2,
                IsSecretOp = true,
                Status = MissionStatus.Locked,
                Reward = 4000,
                Objectives = new[] { "Locate target", "Gather intel", "Neutralize", "Escape undetected" }
            },
        };
    }
}
public enum Difficulty { Easy, Medium, Hard }
TimeLimitSeconds = 1200f;
public Difficulty MissionDifficulty;
public float TimeLimitSeconds; // Time allowed to complete mission

// Set the time limit to 20 minutes (1200 seconds)
void SetTimeLimitToTwentyMinutes()
{
    TimeLimitSeconds = 1200f;
}
public class MissionSettings
{
    public Difficulty MissionDifficulty;
    public float TimeLimitSeconds; // Time allowed to complete mission

    // Constructor
    public MissionSettings()
    {
        // Set the time limit to 20 minutes (1200 seconds)
        TimeLimitSeconds = 1200f;
    }

    // Alternatively, if you have a Start or Init method
    public void Initialize()
    {
        TimeLimitSeconds = 1200f;
    }
}
public class MissionScript: MonoBehaviour
{
    public Difficulty MissionDifficulty;
    public float TimeLimitSeconds; // Time allowed to complete mission

    void Start()
    {
        // Set the time limit to 20 minutes (1200 seconds)
        TimeLimitSeconds = 1200f;
    }
}
public List<string> CombatFeedback = new List<string> {
    "Just green",
    "I can shoot!",
    "Yo, he's dead!"
};
using UnityEngine;

[CreateAssetMenu(fileName = "NewMissionData", menuName = "Mission/MissionData")]
public class MissionDataSO: ScriptableObject
{
    public string Title;
    public string Description;
    public Region MissionRegion;
    public bool IsSecretOp;
    public MissionStatus Status;
    public Difficulty MissionDifficulty;
    public int Reward;
    public string[] Objectives;
    public float TimeLimitSeconds;
}
public List<MissionDataSO> MissionAssets;

AllMissions = MissionAssets.Select(asset => new Mission {
    Title = asset.Title,
    Description = asset.Description,
    MissionRegion = asset.MissionRegion,
    IsSecretOp = asset.IsSecretOp,
    Status = asset.Status,
    MissionDifficulty = asset.MissionDifficulty,
    Reward = asset.Reward,
    Objectives = asset. Objectives,
    TimeLimitSeconds = asset.TimeLimitSeconds
}).ToList();

[System.Serializable]
public class SaveData {
    public List<Mission> SavedMissions;
    public int TotalRewards;
}

// Save
string data = JsonUtility.ToJson(new SaveData { SavedMissions = AllMissions, TotalRewards = TotalRewards });
PlayerPrefs.SetString("SaveSlot", data);

// Load
var loadedData = JsonUtility.FromJson<SaveData>(PlayerPrefs.GetString("SaveSlot"));
AllMissions = loadedData.SavedMissions;
TotalRewards = loadedData.TotalRewards;

using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections;

public class MissionUIManager: MonoBehaviour
{
    public TextMeshProUGUI missionTitleText;
    public TextMeshProUGUI timerText;
    public Transform objectivesContainer;
    public GameObject objectivePrefab;
    public AudioSource audioSource;

    public AudioClip justGreenClip;
    public AudioClip iCanShootClip;
    public AudioClip yoDeadClip;

    private Mission currentMission;
    private float remainingTime;

    void Start()
    {
        LoadMission(GameManager.Instance.GetNextMission());
    }

    void LoadMission(Mission mission)
    {
        if (mission == null) return;
        currentMission = mission;
        missionTitleText.text = mission.Title;
        remainingTime = mission.TimeLimitSeconds;

        // Populate objectives
        foreach (Transform child in objectivesContainer) Destroy(child.gameObject);
        foreach (var obj in mission.Objectives)
        {
            var objectiveGO = Instantiate(objectivePrefab, objectivesContainer);
            objectiveGO.GetComponentInChildren<TextMeshProUGUI>().text = obj;
        }

        StartCoroutine(TimerCountdown());
        TriggerCombatCue("JustGreen");
    }

    IEnumerator TimerCountdown()
    {
        while (remainingTime > 0)
        {
            timerText.text = $"Time Left: {Mathf.FloorToInt(remainingTime)}s";
            yield return new WaitForSeconds(1f);
            remainingTime--;

            if (remainingTime == 10) TriggerCombatCue("ICanShoot");
        }

        timerText.text = "Mission Failed!";
        TriggerCombatCue("YoDead");
    }

    void TriggerCombatCue(string cue)
    {
        switch (cue)
        {
            case "JustGreen":
                audioSource.PlayOneShot(justGreenClip);
                break;
            case "ICanShoot":
                audioSource.PlayOneShot(iCanShootClip);
                break;
            case "YoDead":
                audioSource.PlayOneShot(yoDeadClip);
                break;
        }
    }

    public void DebugCompleteObjective() // Hook this to a debug button
    {
        if (objectivesContainer.childCount > 0)
        {
            objectivesContainer.GetChild(0).GetComponent<Image>().color = Color.green;
            objectivesContainer.GetChild(0).GetComponentInChildren<TextMeshProUGUI>().text += " (Done)";
        }
    }
}


using UnityEngine;

[RequireComponent(typeof(SpriteRenderer))]
public class PhaseGlyph : MonoBehaviour
{
    public string phaseName;
    public Sprite glyphIcon;
    public Color glowColor = Color.cyan;
    public AudioSource audioSource;

    private float pulseIntensity = 0.0f;
    private Material glyphMaterial;

    void Start()
    {
        SpriteRenderer sr = GetComponent<SpriteRenderer>();
        glyphMaterial = sr.material;

        if (!glyphMaterial.HasProperty("_GlowColor"))
            Debug.LogWarning("Material does not support _GlowColor property.");
    }

    void Update()
    {
        pulseIntensity = Mathf.PingPong(Time.time * 2f, 1f);
        AnimateGlyph();
    }

    void AnimateGlyph()
    {
        transform.Rotate(Vector3.up * Time.deltaTime * 20f);

        float beatLevel = AudioManager.GetRhythmValue(audioSource);
        float intensity = Mathf.Lerp(0.2f, 1f, beatLevel);

        if (glyphMaterial != null)
            glyphMaterial.SetColor("_GlowColor", glowColor * intensity);

        transform.localScale = Vector3.one * (1f + intensity * 0.25f);
    }
}
using UnityEngine;
using UnityEngine.Events;

[System.Serializable]
public class MissionNode
{
    public string missionId;
    public string requiredBeatSequence;
    public bool isUnlocked = false;
    public MissionData missionData;
    public UnityEvent onUnlocked;
    public UnityEvent onLocked;

    public void UpdateLockState(string currentBeat)
    {
        bool previouslyUnlocked = isUnlocked;
        isUnlocked = (currentBeat == requiredBeatSequence);

        if (isUnlocked && !previouslyUnlocked)
            onUnlocked?.Invoke();
        else if (!isUnlocked && previouslyUnlocked)
            onLocked?.Invoke();

        AnimateLockUI();
    }

    void AnimateLockUI()
    {
        if (!isUnlocked)
        {
            VisualFX.Shimmer("SonicReverb");
        }
        else
        {
            UIManager.PulseHighlight(this);
        }
    }
}
using UnityEngine;
using System.Collections.Generic;

public class MissionSelector: MonoBehaviour
{
    [Header("Mission Control")]
    public List<MissionNode> missions;

    [Header("Audio & Rhythm")]
    public AudioClip soundtrack;
    public AudioReactiveUI beatGrid;
    public SkyboxPulseManager skyboxController;

    [Header("Visual & UI")]
    public GlyphRing phaseGlyphs;
    public FactionBannerController bannerAnimator;

    private void Start()
    {
        AudioManager.Play(track: soundtrack);

        bannerAnimator.AnimateFactions(new string[] { "Pulseborn", "Synthronauts", "Echo Clerics" });
        phaseGlyphs.InitializeGlyphRotation();
    }

    private void Update()
    {
        beatGrid.ListenForBeatTap();
        skyboxController.AnimateToMusicTempo();

        string currentBeat = AudioManager.CurrentRhythmPattern;

        foreach (var mission in missions)
            mission.UpdateLockState(currentBeat);
    }
}
using UnityEngine;

[CreateAssetMenu(fileName = "NewMission", menuName = "Mission/MissionData")]
public class MissionData: ScriptableObject
{
    public string Title;
    [TextArea] public string Description;
    public Sprite Icon;
    public MissionDifficulty Difficulty;
    public Region Region;
    public bool IsSecret;
    public int Reward;
    public string[] Objectives;
}

[CreateAssetMenu(menuName = "Mission/StyleProfile")]
public class StyleProfileSO: ScriptableObject
{
    public Color backgroundColor;
    public TMP_FontAsset missionFont;
    public Sprite iconFrame;
    public AudioClip backgroundTheme;
    public AnimatorOverrideController overrideAnimator;
}

public StyleProfileSO missionStyle;

public Image backgroundPanel;
public TextMeshProUGUI titleText;

void ApplyStyle(StyleProfileSO style)
{
    backgroundPanel.color = style.backgroundColor;
    titleText.font = style.missionFont;
    titleText.GetComponent<Animator>().runtimeAnimatorController = style.overrideAnimator;
    audioSource.clip = style.backgroundTheme;
    audioSource.Play();
}

const InteractiveObjects = {
  objects: [],

  initialize(map) {
    this.objects = [
      this.createTrap("Landmine", map.getRandomTile(), "explosive", { damage: 50, delay: 0 }),
      this.createTrap("Snare Wire", map.getTile("alley"), "entangle", { duration: 2 }),

      this.createCover("Wooden Crate", map.getTile("market"), "destructible", 30),
      this.createCover("Stone Wall", map.getTile("courtyard"), "semi-permanent", 100),

      this.createPowerUp("Medkit", map.getTile("rooftop"), "healing", { healAmount: 30 }),
      this.createPowerUp("Intel Drone", map.getTile("checkpoint"), "recon", { visionBoost: 5, duration: 3 })
    ];
  },

  createTrap(name, location, effectType, effectProps) {
    return {
      type: "trap",
      name,
      location,
      triggered: false,
      effect: { type: effectType, ...effectProps },
      onTrigger(unit) {
        if (!this.triggered) {
          this.triggered = true;
          console.log(`[TRAP] ${this.name} triggered by ${unit.name}`);
          unit.applyEffect(this.effect);
        }
      }
    };
  },

  createCover(name, location, durabilityType, hp) {
    return {
      type: "cover",
      name,
      location,
      durability: durabilityType,
      hp,
      takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        console.log(`[COVER] ${this.name} took ${amount} damage. Remaining HP: ${this.hp}`);
        if (this.hp === 0) console.log(`[COVER] ${this.name} destroyed!`);
      }
    };
  },

  createPowerUp(name, location, effectType, effectProps) {
    return {
      type: "power-up",
      name,
      location,
      collected: false,
      effect: { type: effectType, ...effectProps },
      onCollect(unit) {
        if (!this.collected) {
          this.collected = true;
          console.log(`[POWER-UP] ${unit.name} collected ${this.name}`);
          unit.applyEffect(this.effect);
        }
      }
    };
  }
};

class InteractiveObject {
  constructor(name, location) {
    this.name = name;
    this.location = location;
  }
}

class Trap extends InteractiveObject {
  constructor(name, location, effect) {
    super(name, location);
    this.type = "trap";
    this.triggered = false;
    this.effect = effect;
  }

  tryTrigger(unit) {
    if (!this.triggered && unit.state !== "stealthed") {
      this.triggered = true;
      console.log(`[TRAP] ${this.name} triggered by ${unit.name}`);
      unit.applyEffect(this.effect);
    }
  }
}

class Cover extends InteractiveObject {
  constructor(name, location, durabilityType, hp) {
    super(name, location);
    this.type = "cover";
    this.durability = durabilityType;
    this.hp = hp;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    console.log(`[COVER] ${this.name} took ${amount} damage. HP: ${this.hp}`);
    if (this.hp === 0) console.log(`[COVER] ${this.name} destroyed!`);
  }

  regenerate(amount) {
    if (this.durability === "regenerative") {
      this.hp += amount;
      console.log(`[COVER] ${this.name} regenerated to ${this.hp} HP`);
    }
  }
}

class PowerUp extends InteractiveObject {
  constructor(name, location, effect) {
    super(name, location);
    this.type = "power-up";
    this.collected = false;
    this.effect = effect;
  }

  tryCollect(unit) {
    if (!this.collected && unit.state !== "disabled") {
      this.collected = true;
      console.log(`[POWER-UP] ${unit.name} collected ${this.name}`);
      unit.applyEffect(this.effect);
    }
  }
}

const ObjectSpawner = {
  activeObjects: [],

  spawnTrap(map, type, location, effectProps) {
    const trap = new Trap(type, location, { type, ...effectProps });
    this.activeObjects.push(trap);
    console.log(`[SPAWNER] Trap ${trap.name} spawned at ${trap.location.id}`);
  },

  spawnCover(map, name, location, durabilityType, hp) {
    const cover = new Cover(name, location, durabilityType, hp);
    this.activeObjects.push(cover);
    console.log(`[SPAWNER] Cover ${cover.name} placed at ${cover.location.id}`);
  },

  spawnPowerUp(map, name, location, effectType, effectProps) {
    const powerUp = new PowerUp(name, location, { type: effectType, ...effectProps });
    this.activeObjects.push(powerUp);
    console.log(`[SPAWNER] Power-Up ${powerUp.name} spawned at ${powerUp.location.id}`);
  }
};

function checkTriggerConditions(unit, objectType) {
  switch (objectType) {
    case "trap": return unit.state !== "stealthed";
    case "power-up": return unit.state !== "disabled";
    default: return true;
  }
}

class MissionController {
  constructor(map) {
    this.map = map;
    this.spawner = new ObjectSpawner();
    this.events = new EventManager();
  }

  startMission() {
    // Initial objects
    this.spawner.spawnTrap(this.map, "landmine", this.map.getTile("bridge"), { damage: 40 });
    this.spawner.spawnCover(this.map, "Sandbags", this.map.getTile("checkpoint"), "regenerative", 60);

    this.events.emit("missionStarted", { time: Date.now() });
  }

  updateMissionState(unit) {
    this.spawner.activeObjects.forEach(obj => {
      if (obj instanceof Trap) obj.tryTrigger(unit);
      else if (obj instanceof PowerUp) obj.tryCollect(unit);
    });

    this.events.emit("unitMoved", { unit });
  }
}

class EventManager {
  constructor() {
    this.subscribers = {};
  }

  on(eventName, callback) {
    if (!this.subscribers[eventName]) this.subscribers[eventName] = [];
    this.subscribers[eventName].push(callback);
  }

  emit(eventName, data) {
    const listeners = this.subscribers[eventName] || [];
    listeners.forEach(cb => cb(data));
  }
}

class InteractionManager {
  constructor(unit) {
    this.unit = unit;
  }

  canTriggerTrap() {
    return !["stealthed", "hovering", "spectral"].includes(this.unit.state);
  }

  canCollectPowerUp() {
    return !["disabled", "overloaded"].includes(this.unit.state);
  }

  applyTo(object) {
    if (object instanceof Trap && this.canTriggerTrap()) {
      object.tryTrigger(this.unit);
    }

    if (object instanceof PowerUp && this.canCollectPowerUp()) {
      object.tryCollect(this.unit);
    }
  }
}
missionController.updateMissionState(playerUnit); // Handles object interactions

eventManager.on("missionStarted", () => {
  setTimeout(() => spawner.spawnTrap(map, "auto-turret", map.getTile("gate"), { damage: 100 }), 10000);
});

class ProximityZone {
  constructor(name, location, radius, effect, triggerOnce = true) {
    this.name = name;
    this.location = location;
    this.radius = radius;
    this.effect = effect;
    this.triggeredUnits = new Set();
    this.triggerOnce = triggerOnce;
  }

  check(unit) {
    const dist = this.location.distanceTo(unit.location);
    if (dist <= this.radius && (!this.triggeredUnits.has(unit) || !this.triggerOnce)) {
      this.triggeredUnits.add(unit);
      console.log(`[ZONE] ${unit.name} entered ${this.name} zone`);
      unit.applyEffect(this.effect);
    }
  }
}

class CountdownPhase {
  constructor(name, duration, effect) {
    this.name = name;
    this.duration = duration;
    this.effect = effect;
    this.active = false;
  }

  activate() {
    this.active = true;
    console.log(`[COUNTDOWN] ${this.name} begins! ${this.duration} seconds until impact...`);

    setTimeout(() => {
      console.log(`[COUNTDOWN] ${this.name} triggered`);
      this.applyGlobalEffect();
    }, this.duration * 1000);
  }

  applyGlobalEffect() {
    Game.getAllUnits().forEach(unit => unit.applyEffect(this.effect));
  }
}

class EnvironmentTriggerManager {
  constructor(map) {
    this.zones = [];
    this.countdowns = [];
  }

  addZone(name, location, radius, effect, once = true) {
    this.zones.push(new ProximityZone(name, location, radius, effect, once));
  }

  addCountdown(name, duration, effect) {
    const phase = new CountdownPhase(name, duration, effect);
    this.countdowns.push(phase);
    phase.activate();
  }

  update(unit) {
    this.zones.forEach(zone => zone.check(unit));
  }
}

triggerManager.update(currentUnit);

class WeatherSystem {
  constructor() {
    this.current = "clear";
  }

  setWeather(type) {
    this.current = type;
    console.log(`[WEATHER] Switched to: ${type}`);
    EnvironmentTriggerManager.applyWeatherEffect(type);
  }
}

class DestructibleZone {
  constructor(location, hp, debrisEffect) {
    this.location = location;
    this.hp = hp;
    this.debrisEffect = debrisEffect;
    this.destroyed = false;
  }

  applyDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0 && !this.destroyed) {
      this.destroyed = true;
      console.log(`[ZONE] ${this.location.name} destroyed!`);
      this.triggerDebris();
    }
  }

  triggerDebris() {
    Game.getUnitsNearby(this.location).forEach(unit => {
      unit.applyEffect(this.debrisEffect);
    });
  }
}

class MusicManager {
  constructor() {
    this.layers = {
      calm: "ambient_desert.wav",
      alert: "tension_build.wav",
      danger: "combat_intense.wav"
    };
    this.currentLayer = null;
  }

  updateThreat(threatLevel) {
    const newLayer = this.getLayer(threatLevel);
    if (newLayer !== this.currentLayer) {
      this.currentLayer = newLayer;
      this.playMusic(newLayer);
    }
  }

  getLayer(threatLevel) {
    if (threatLevel > 80) return this. layers.danger;
    if (threatLevel > 40) return this. layers.alert;
    return this .layers.calm;
  }

  playMusic(file) {
    console.log(`[MUSIC] Now playing: ${file}`);
    AudioSystem.play(file, { loop: true });
  }
}

class ChaosDirector {
  constructor() {
    this.sequence = [];
  }

  addEvent(delay, action) {
    this.sequence.push({ delay, action });
  }

  start() {
    let totalTime = 0;
    this.sequence.forEach(evt => {
      totalTime += evt. delay;
      setTimeout(evt.action, totalTime * 1000);
    });
  }
}

// Usage
const director = new ChaosDirector();
director.addEvent(0, () => AudioSystem.play("storm_rising.wav"));
director.addEvent(2, () => Camera.shake(0.5, 1));
director.addEvent(4, () => UI.showMessage("⚠️ Incoming artillery!"));
director.addEvent(6, () => ExplosionManager.trigger(map.getTile("sector45")));
director.addEvent(10, () => MusicManager.updateThreat(90));
director.start();

class TacticalOverlay {
  constructor(mapUI) {
    this.mapUI = mapUI;
    this.layers = {};
  }

  highlightZone(tile, type) {
    const color = {
      danger: "rgba(255,0,0,0.6)",
      storm: "rgba(255,165,0,0.4)",
      objective: "rgba(0,255,0,0.5)",
      destructible: "rgba(255,255,0,0.5)"
    };
    this.mapUI.drawOverlay(tile.position, color[type]);
  }

  updateObjectiveTimer(tile, secondsLeft) {
    const urgency = secondsLeft < 15 ? "🔥" : "⏳";
    this.mapUI.showText(tile.position, `${urgency} ${secondsLeft}s`);
  }
}

overlay.highlightZone(map.getTile("sector12"), "danger");
overlay.updateObjectiveTimer(map.getTile("comm_station"), 23);

class StormFront {
  constructor(startTile, direction, speed) {
    this.currentTile = startTile;
    this.direction = direction;
    this.speed = speed;
  }

  advance() {
    const nextTile = this.currentTile.getAdjacent(this.direction);
    if (nextTile) {
      this.currentTile = nextTile;
      TacticalOverlay.highlightZone(nextTile, "storm");
      WeatherSystem.setWeather("sandstorm");
      Game.getUnitsNearby(nextTile).forEach(u => u.applyEffect({ type: "visionDebuff", amount: -2 }));
    }
  }

  startSweep(intervalSeconds, steps) {
    for (let i = 1; i <= steps; i++) {
      setTimeout(() => this.advance(), i * intervalSeconds * 1000);
    }
  }
}

const storm = new StormFront(map.getTile("desert_entry"), "east", 1);
storm.startSweep(5, 8); // Pushes storm 8 tiles every 5 seconds








                                            
