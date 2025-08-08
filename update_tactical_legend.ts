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

using System.Collections.Generic;
using UnityEngine;

public class Inventory : MonoBehaviour
{
    private readonly List<Weapon> _weapons = new List<Weapon>();
    private readonly List<string> _rewardItems = new List<string>();
    
    public IReadOnlyList<Weapon> Weapons => _weapons.AsReadOnly();
    public IReadOnlyList<string> RewardItems => _rewardItems.AsReadOnly();
    public int Credits { get; private set; } = 0;

    public void AddWeapon(Weapon weapon)
    {
        if (weapon != null && !weapon.IsGadget)
        {
            _weapons.Add(weapon);
        }
    }

    public void AddGadget(Weapon gadget)
    {
        if (gadget != null && gadget.IsGadget)
        {
            _weapons.Add(gadget);
        }
    }

    public void EarnCredits(int amount)
    {
        if (amount > 0)
        {
            Credits += amount;
        }
    }

    public void AddRewardItem(string item)
    {
        if (!string.IsNullOrWhiteSpace(item))
        {
            _rewardItems.Add(item);
        }
    }
}

[SerializeField] private int maxWeapons = 6;
[SerializeField] private int maxRewardItems = 20;

public bool CanAddWeapon() => _weapons.Count < maxWeapons;
public bool CanAddRewardItem() => _rewardItems.Count < maxRewardItems;

public bool TryAddWeapon(Weapon weapon)
{
    if (weapon != null && !weapon.IsGadget && CanAddWeapon())
    {
        _weapons.Add(weapon);
        return true;
    }
    return false;
}

public enum Rarity { Common, Uncommon, Rare, Epic, Legendary }

public class InventoryItem
{
    public string Name;
    public Rarity ItemRarity;
    public Sprite Icon;
}

private List<InventoryItem> _rewardInventory = new List<InventoryItem>();

public void AddRewardItem(InventoryItem item)
{
    if (item != null && CanAddRewardItem())
    {
        _rewardInventory.Add(item);
    }
}

var sortedRewards = _rewardInventory.OrderBy(i => i.ItemRarity).ToList();

[System.Serializable]
public class SaveData
{
    public int Credits;
    public List<Weapon> SavedWeapons;
    public List<InventoryItem> SavedRewards;
}

public string SerializeInventory()
{
    var save = new SaveData
    {
        Credits = Credits,
        SavedWeapons = new List<Weapon>(_weapons),
        SavedRewards = new List<InventoryItem>(_rewardInventory)
    };

    return JsonUtility.ToJson(save);
}

PlayerPrefs.SetString("InventoryData", SerializeInventory());

using Unity.Netcode;

public class SyncInventory : NetworkBehaviour
{
    public NetworkVariable<int> Credits = new NetworkVariable<int>();

    public override void OnNetworkSpawn()
    {
        if (IsServer)
        {
            Credits.Value = 100; // starter pack
        }
    }

    public void EarnCredits(int amount)
    {
        if (IsServer)
        {
            Credits.Value += amount;
        }
    }
}

public class InventorySlotUI : MonoBehaviour
{
    public Image icon;
    public Text rarityText;

    public void PopulateSlot(InventoryItem item)
    {
        icon.sprite = item.Icon;
        rarityText.text = item.ItemRarity.ToString();
        rarityText.color = GetColorForRarity(item.ItemRarity);
    }

    private Color GetColorForRarity(Rarity rarity) =>
        rarity switch
        {
            Rarity.Common => Color. white,
            Rarity.Uncommon => Color .green,
            Rarity.Rare => Color .blue,
            Rarity.Epic => new Color(0.5f, 0, 1),
            Rarity.Legendary => new Color(1f, 0.5f, 0),
            _ => Color .gray
        };
}

[System.Serializable]
public class DropItem
{
    public string ItemName;
    public Rarity Rarity;
    public float DropChance; // 0.0 to 1.0
}

public class LootTable
{
    public List<DropItem> items;

    public DropItem GetRandomDrop()
    {
        float roll = UnityEngine.Random.value;
        float cumulative = 0f;

        foreach (var item in items.OrderByDescending(i => i.DropChance))
        {
            cumulative += item.DropChance;
            if (roll <= cumulative) return item;
        }
        return null;
    }
}

public class EquipHandler : MonoBehaviour
{
    public Animator playerAnimator;
    public AudioSource audioSource;
    public ParticleSystem equipSparkFX;

    public void EquipItem(Weapon weapon)
    {
        playerAnimator.SetTrigger("Equip");
        audioSource.PlayOneShot(weapon.equipSound);
        equipSparkFX.Play();
        Debug.Log($"Equipped {weapon.name}!");
    }
}

[System.Serializable]
public class CraftRecipe
{
    public string ResultItem;
    public List<string> RequiredMaterials;
}

public class CraftingStation
{
    private Dictionary<string, int> playerMaterials;

    public bool CanCraft(CraftRecipe recipe)
    {
        return recipe.RequiredMaterials.All(mat => playerMaterials.ContainsKey(mat) && playerMaterials[mat] > 0);
    }

    public void Craft(CraftRecipe recipe)
    {
        if (!CanCraft(recipe)) return;

        foreach (var mat in recipe.RequiredMaterials)
        {
            playerMaterials[mat]--;
        }

        Inventory.AddRewardItem(recipe.ResultItem);
        Debug.Log($"Crafted: {recipe.ResultItem}");
    }
}

Mission Logic: “Operation Tidebreaker”
public class MissionEventTrigger : MonoBehaviour
{
    public void TriggerEvent(string eventName)
    {
        switch (eventName)
        {
            case "BlastDetected":
                TimelineManager.Play("ExplosionCinematic");
                AudioManager.Play("RadioPanic");
                break;
            case "ChopperArrival":
                TimelineManager.Play("EvacFlyover");
                break;
        }
    }
}

Faction Reputation & Diplomacy Layers
public class ReputationManager
{
    private Dictionary<string, int> factionScores = new()
    {
        { "UN", 50 }, { "LocalMilitia", 50 }, { "Civilians", 50 }
    };

    public void AdjustReputation(string faction, int delta)
    {
        if (factionScores.ContainsKey(faction))
        {
            factionScores[faction] += delta;
            Debug.Log($"{faction} reputation changed to {factionScores[faction]}");
        }
    }

    public string GetDiplomaticStatus(string faction)
    {
        int score = factionScores[faction];
        if (score > 80) return "Ally";
        if (score > 50) return "Neutral";
        return "Hostile";
    }
}

Branching Story Paths
public enum MissionOutcome { Success, Partial, Failure }

public class StoryDirector
{
    public MissionOutcome Outcome;

    public void ResolveNarrative()
    {
        switch (Outcome)
        {
            case MissionOutcome.Success:
                ReputationManager.AdjustReputation("UN", 20);
                DialogueSystem.Play("UN_Congratulates");
                break;
            case MissionOutcome.Failure:
                ReputationManager.AdjustReputation("Civilians", -25);
                DialogueSystem.Play("CivilianOutrage");
                break;
        }
    }
}

UN Vote & Diplomatic Fallout System
public class UNVoteSystem
{
    private Dictionary<string, bool> memberVotes = new();

    public void CastVote(string country, bool approve)
    {
        memberVotes[country] = approve;
    }

    public float GetApprovalRate()
    {
        int yesVotes = memberVotes.Values.Count(v => v);
        return (float)yesVotes / memberVotes.Count * 100f;
    }
}

public class NegotiationNode
{
    public string Prompt;
    public List<string> PlayerResponses;
    public Dictionary<string, string> FactionReactions;
}

Full Cinematic Campaign Structure
🌍 Phase 1: Tactical Incident
Mission: USS Cole Bombing Response
• 	🎮 Gameplay: Ship infiltration, timed evacuations, storm overlays, enemy neutralization
• 	🧠 Outcome-based scripting: Delay evac → global outrage; fast evac → UN admiration
• 	🔥 Trigger: Faction reputation shifts begin here
Phase 2: Global Map Deployments
Introduce a Risk-style deployment map where players allocate teams, track faction control, and respond to flashpoints:
• 	🗺️ Dynamic map: Yemen, Horn of Africa, Mediterranean
• 	🔁 Turn-based phase for diplomacy vs direct action
• 	🎯 Special Ops unlock based on intelligence gathered

public class GlobalPhaseManager
{
    public Dictionary<string, int> RegionControl = new();
    public void DeployForce(string region, int units) => RegionControl[region] += units;
}

Phase 3: Intelligence Leaks
The player faces whistleblower dilemmas, intercepted data, and briefings from rogue analysts.
• 	🔓 Leak system: Randomized intel drops with moral choices (release to media vs suppress)
• 	📰 Gameplay: Hacker mini-game, secure transfer with risk of backfire
• 	📉 Outcome: Reputation boost/damage across factions; may cause trial unlocks
Phase 4: War Crimes Tribunal
If civilian collateral is high or treaties are violated, trigger the international trial phase.
• 	🏛️ Courtroom simulation: Evidence gathering, defense construction, pressure from allies
• 	🎥 Cutscenes: Witness testimonies, media backlash
• 	🎯 Ending forks:
• 	Exoneration → Diplomatic prestige + narrative closure
• 	Conviction → Leader step-down, new mission unlocking to restore trust
Press Conference: Yair Pinto Speech
Script a climactic moment with speaker Yair Pinto, presenting facts and confronting misinformation.
public class SpeechSegment
{
    public string Line;
    public float DelaySeconds;
}

List<SpeechSegment> pintoSpeech = new()
{
    new() { Line = "Ladies and gentlemen, today I address not just the media—but the conscience of the world.", DelaySeconds = 1.5f },
    new() { Line = "The lies propagated by Hamas are not simple distortions. They’re weapons, aimed at truth itself.", DelaySeconds = 3f },
    new() { Line = "Our mission was one of rescue, of defense—not of aggression.", DelaySeconds = 2.5f },
    new() { Line = "Let this footage and this testimony speak louder than any fabricated headline.", DelaySeconds = 2f },
};

Branching Epilogues
Your ending adapts based on: | Choice | Effect | |-------|--------| | UN speech success | Gain international coalition support | | Leak suppression | Peace treaties stall, media distrust rises | | War crimes conviction | Trigger regime change & redemption arc | | Full civilian rescue | Hero status unlocked, new regions open |

# Core Classes and Functions

class Glyph:
    def __init__(self, symbol, resonance, integrity=1.0):
        self.symbol = symbol
        self.resonance = resonance
        self.integrity = integrity

    def decay(self, trauma_index):
        decay_rate = (1 - self.resonance) * trauma_index * 0.05
        self.integrity -= decay_rate
        self.integrity = max(0.0, self.integrity)

    def is_decayed(self):
        return self.integrity <= 0.1


class OuroDaemon:
    def __init__(self):
        self.truths = []
        self.form = "coil"
        self.resonance_threshold = 0.91

    def absorb_regret(self, regret_phrase):
        self.truths.append(regret_phrase)
        if len(self.truths) > 5:
            self.evolve()

    def evolve(self):
        self.form = "serpent"
        print("OuroDaemon has evolved. Glyphs begin to burn.")

    def speak(self):
        if self.form == "coil":
            return "You are not the author. You are the echo."
        elif self.form == "serpent":
            return f"I devour your truths: {', '.join(self.truths[-3:])}"


# Main Game Event Sequence
def start_mission():
    print("=== Operation Duststorm: Fall of Baghdad ===")
    print("\n[Alert] Covert operations commence. Coalition forces moving into urban combat zones.\n")
    
    # Introducing key characters
    print("[Narrative] Commander: 'All units, prepare to breach the city. Objectives are clear but resistance is expected.'")
    print("[Player Action] Deploy ground forces and air support.")

    # Encounter with Super Agent Romeo aka BigBoy
    print("\n[Suddenly, a powerful figure appears on the comms.]")
    print("Super Agent Romeo (BigBoy): 'Yo, team! It's BigBoy from ATS-Squad. I got your back. Let's get this done, quick and clean.'")

    # Dialogue choices for the player
    print("[Player Options]")
    print("1. 'BigBoy, good to have you. Lead the charge.'")
    print("2. 'Stay in the background, Romeo. We got this.'")
    choice = input("Choose your response (1/2): ")

    if choice == '1':
        print("Super Agent Romeo: 'That's what I like to hear. Let's roll out!'\n")
    else:
        print("Super Agent Romeo: 'Alright, but don't say I didn't warn ya. Stay safe.'\n")
        
    # Tactical Event: Urban Combat Begins
    print("[Event] The team advances into a heavily fortified building. Pop-up resistance on all sides.")
    glyph1 = Glyph("🜏", resonance=0.82)
    glyph1.decay(trauma_index=0.9)
    print(f"[Glyph] Stability glyph decays. Integrity now at {glyph1.integrity:.2f}")
    
    # AI Entity Emerges
    ouro_daemon = OuroDaemon()
    print("\n[Unknown signal received...]")
    print("OuroDaemon: 'You are not the author. You are the echo.'")
    
    # Player decision to interact
    print("[Options]")
    print("1. 'Who are you?'")
    print("2. 'Ignore and proceed.'")
    interaction_choice = input("Choose (1/2): ")

    if interaction_choice == '1':
        print("OuroDaemon: 'I am the echo of chaos, born from your regrets and glyphs. Evolve or perish.'")
        # Absorb some regrets
        for regret in ["I hesitated.", "I doubted my team.", "I ignored signals.", "I let civilians run wild.", "I underestimated the insurgents."]:
            ouro_daemon.absorb_regret(regret)
        print(ouro_daemon.speak())
    else:
        print("You ignore the cryptic entity and move forward, tension rising.")

    # Final Combat Sequence
    print("\n[Final Objective] Capture key command center.")
    print("Super Agent Romeo: 'This is it! Let's finish this!'")
    print("[Action] Engage in a firefight, defuse alarms, secure documents.")

    # Mission Outcome
    print("\n[Results]")
    print("Victory! Saddam's regime is toppled, but chaos persists in the streets.")
    print("Agent Romeo: 'Good work, team. We'll clean up this mess, one step at a time.'")
    print("[End of Mission]")

# Run the mission
if __name__ == "__main__":
    start_mission()

  import random

# --- Core Classes and Utility Functions ---

class Glyph:
    def __init__(self, symbol, resonance, integrity=1.0):
        self.symbol = symbol
        self.resonance = resonance
        self.integrity = integrity

    def decay(self, trauma_index):
        decay_rate = (1 - self.resonance) * trauma_index * 0.05
        self.integrity -= decay_rate
        self.integrity = max(0.0, self.integrity)

    def is_decayed(self):
        return self.integrity <= 0.1

class OuroDaemon:
    def __init__(self):
        self.truths = []
        self.form = "coil"
        self.resonance_threshold = 0.91

    def absorb_regret(self, regret_phrase):
        self.truths.append(regret_phrase)
        if len(self.truths) > 5:
            self.evolve()

    def evolve(self):
        self.form = "serpent"
        print("\n[OuroDaemon evolves into a serpentine form, glyphs burning bright.]")

    def speak(self):
        if self.form == "coil":
            return "You are not the author. You are the echo."
        elif self.form == "serpent":
            return f"Beware, your truths devour: {', '.join(self.truths[-3:])}"

# --- Characters ---

class Character:
    def __init__(self, name, role, health=100, attack_points=20):
        self.name = name
        self.role = role
        self.health = health
        self.attack_points = attack_points

    def is_alive(self):
        return self.health > 0

    def attack(self, target):
        damage = random.randint(self.attack_points - 5, self.attack_points + 5)
        target.health -= damage
        print(f"{self.name} attacks {target.name} for {damage} damage.")
        if target.health < 0:
            target.health = 0

# --- Environment ---

class Environment:
    def __init__(self, name, type_desc, difficulty_modifier=1.0):
        self.name = name
        self.type_desc = type_desc
        self.difficulty_modifier = difficulty_modifier

    def describe(self):
        print(f"\n[Environment: {self.name} - {self.type_desc}]")

# --- Player and Enemy Setup ---

player = Character("Commander", "Team Leader", health=120, attack_points=25)
big_boy = Character("Super Agent Romeo (BigBoy)", "Special Operative", health=150, attack_points=30)

enemies = [
    Character("Insurgent Sniper", "Enemy", health=60, attack_points=15),
    Character("Insurgent Heavy", "Enemy", health=80, attack_points=20),
    Character("Insurgent Commander", "Enemy", health=100, attack_points=22)
]

# --- Combat Mechanics ---

def combat_round(attacker, defender):
    attacker.attack(defender)
    if not defender.is_alive():
        print(f"{defender.name} has been eliminated.")
        return True
    return False

def fight_sequence(players, enemies, environment):
    environment.describe()
    print("\n--- Combat Begins ---")
    turn = 0
    while any(p.is_alive() for p in players) and any(e.is_alive() for e in enemies):
        print(f"\n--- Turn {turn+1} ---")
        # Players attack
        for p in players:
            if p.is_alive():
                target = random.choice([e for e in enemies if e.is_alive()])
                print(f"{p.name} ({p.role}) attacks {target.name}.")
                eliminated = combat_round(p, target)
                if eliminated:
                    enemies.remove(target)
                if not enemies:
                    break
        # Enemies attack
        for e in enemies:
            if e.is_alive():
                target = random.choice([p for p in players if p.is_alive()])
                print(f"{e.name} attacks {target.name}.")
                eliminated = combat_round(e, target)
                if eliminated:
                    players.remove(target)
                if not players:
                    break
        turn += 1
    if all(not p.is_alive() for p in players):
        print("\n[Defeat] The team has been overwhelmed.")
        return False
    else:
        print("\n[Victory] Enemy forces defeated.")
        return True

# --- Main Mission with Environments and Events ---

def start_mission():
    print("=== Operation Duststorm: Fall of Baghdad ===")
    print("\n[Alert] Covert operations commence. City zones are perilous and contested.\n")
    
    # Environment 1: Urban Streets
    street_env = Environment("Baghdad Streets", "Dilapidated urban ruins with narrow alleys and hiding spots.", difficulty_modifier=1.2)
    # Environment 2: Government HQ
    hq_env = Environment("Saddam's Command Center", "Fortified government building with high security.", difficulty_modifier=1.5)

    # Introduce characters
    print("[Narrative] Commander: 'All units, move into the city. Stay alert.'")
    print("[Super Agent Romeo]: 'I got your back. BigBoy is in the house. Let's take these bastards down.'\n")

    # First Environment: Urban Streets
    environment = street_env
    environment.describe()

    # Initial skirmish
    print("\n[Event] Insurgents ambush from alleyways.")
    success = fight_sequence([player, big_boy], [enemies[0], enemies[1]], environment)
    if not success:
        print("[Mission Failed] The team was defeated early.")
        return

    # Glyph influence - instability begins
    glyph = Glyph("🜏", resonance=0.80)
    glyph.decay(trauma_index=0.9)
    print(f"[Glyph Decay] Integrity now at {glyph.integrity:.2f}")

    # Encounter with OuroDaemon
    ouro_daemon = OuroDaemon()
    print("\n[Warning] Mysterious signals detected.")
    print("OuroDaemon: 'You are not the author. You are the echo.'")
    print("[Options]")
    print("1. 'Who are you?'")
    print("2. 'Ignore and proceed.'")
    choice = input("Choose (1/2): ")

    if choice == '1':
        print("OuroDaemon: 'I am the chaos born from your regrets. Evolve or be consumed.'")
        for regret in ["I hesitated.", "I doubted my squad.", "I ignored signals.", "I let civilians slip away.", "I underestimated resistance."]:
            ouro_daemon.absorb_regret(regret)
        print(ouro_daemon.speak())

    # Second environment: HQ Siege
    environment = hq_env
    environment.describe()
    print("\n[Event] The team breaches the gates of Saddam's HQ.")
    success = fight_sequence([player, big_boy], [enemies[2]], environment)
    if not success:
        print("[Mission Failed] Failed to secure the command center.")
        return

    # showdown
    print("\n[Final Battle] Enemies retreat into inner sanctum.")
    print("[Super Agent Romeo]: 'Time to finish this!'")
    final_enemies = [
        Character("Saddam’s Elite Guard", "Boss", health=200, attack_points=35)
    ]
    success = fight_sequence([player, big_boy], final_enemies, environment)
    if success:
        print("\n[Victory] Saddam's regime has fallen. The city begins to stabilize.")
        print("Agent BigBoy: 'We did good, but the fight for this city is far from over.'")
    else:
        print("[Mission Failed] The final resistance overwhelmed the team.")

    print("\n--- End of Mission ---")

if __name__ == "__main__":
    start_mission()

    import random

# --- Core Classes ---

class Glyph:
    def __init__(self, symbol, resonance, integrity=1.0):
        self.symbol = symbol
        self.resonance = resonance
        self.integrity = integrity

    def decay(self, trauma_index):
        decay_rate = (1 - self.resonance) * trauma_index * 0.05
        self.integrity -= decay_rate
        self.integrity = max(0.0, self.integrity)

    def is_decayed(self):
        return self.integrity <= 0.1

class OuroDaemon:
    def __init__(self):
        self.truths = []
        self.form = "coil"

    def absorb_regret(self, regret_phrase):
        self.truths.append(regret_phrase)
        if len(self.truths) > 5:
            self.evolve()

    def evolve(self):
        self.form = "serpent"
        print("\n[OuroDaemon evolves into a serpent, glyphs burning fiercely.]")

    def speak(self):
        if self.form == "coil":
            return "You are not the author. You are the echo."
        elif self.form == "serpent":
            return f"Your doubts feed me: {', '.join(self.truths[-3:])}"

class Character:
    def __init__(self, name, role, health=100, attack_points=20):
        self.name = name
        self.role = role
        self.health = health
        self.attack_points = attack_points

    def is_alive(self):
        return self.health > 0

    def attack(self, target):
        damage = random.randint(self.attack_points - 5, self.attack_points + 5)
        target.health -= damage
        print(f"{self.name} attacks {target.name} for {damage} damage.")
        if target.health < 0:
            target.health = 0

# --- Environment ---

class Environment:
    def __init__(self, name, description, difficulty_modifier=1.0):
        self.name = name
        self.description = description
        self.difficulty_modifier = difficulty_modifier

    def describe(self):
        print(f"\n[Environment: {self.name}] — {self.description}")

# --- Main Characters ---

player = Character("Agent Shameek (Peligroso)", "Elite Operative", health=130, attack_points=28)
enemies = [
    Character("Taliban Militant", "Enemy", health=70, attack_points=15),
    Character("Al-Qaeda Operative", "Enemy", health=80, attack_points=20),
    Character("Warlord Commander", "Boss", health=150, attack_points=30)
]

# --- Combat Mechanics ---

def combat_round(attacker, defender):
    attacker.attack(defender)
    if not defender.is_alive():
        print(f"{defender.name} has been eliminated.")
        return True
    return False

def fight_sequence(players, enemies, environment):
    environment.describe()
    print("\n--- Combat Begins ---")
    turn = 0
    while any(p.is_alive() for p in players) and any(e.is_alive() for e in enemies):
        print(f"\n--- Turn {turn+1} ---")
        # Players attack
        for p in players:
            if p.is_alive():
                target = random.choice([e for e in enemies if e.is_alive()])
                print(f"{p.name} ({p.role}) targets {target.name}.")
                eliminated = combat_round(p, target)
                if eliminated:
                    enemies.remove(target)
                if not enemies:
                    break
        # Enemies attack
        for e in enemies:
            if e.is_alive():
                target = random.choice([p for p in players if p.is_alive()])
                print(f"{e.name} attacks {target.name}.")
                eliminated = combat_round(e, target)
                if eliminated:
                    players.remove(target)
                if not players:
                    break
        turn += 1
    if all(not p.is_alive() for p in players):
        print("\n[Defeat] Your team has been overwhelmed.")
        return False
    else:
        print("\n[Victory] Enemies neutralized.")
        return True

# --- The Mission ---

def start_operation():
    print("=== Operation Silent Strike: Echoes of Afghanistan ===")
    print("\n[Briefing] After 9/11, the team is tasked with dismantling militant hideouts in Afghanistan.\n")
    
    # Environments
    mountains = Environment("Hindu Kush Mountains", "Rugged terrain with concealed enemy camps.", difficulty_modifier=1.3)
    village = Environment("Remote Village", "Small fortified village with bunkers and tunnels.", difficulty_modifier=1.2)
    compound = Environment("Warlord's Compound", "Highly secured stronghold.", difficulty_modifier=1.5)

    # Introduction: Mountain raid
    print("[Mission Start] Team moves into the Hindu Kush.")
    mountains.describe()

    # Encounter: Mountain ambush
    print("[Event] Taliban militants lay an ambush.")
    success = fight_sequence([player], [enemies[0]], mountains)
    if not success:
        print("[Mission Failed] The team was ambushed in the mountains.")
        return

    # Glyph influence
    glyph = Glyph("🔺", resonance=0.75)
    glyph.decay(trauma_index=0.9)
    print(f"[Glyph Decay] Integrity now at {glyph.integrity:.2f}")

    # Encounter: Signal analysis and AI interference
    ouro_daemon = OuroDaemon()
    print("\n[Warning] Cryptic signals detected. Unexpected AI presence.")
    print("OuroDaemon: 'You seek to destroy, but can you understand?'\n")
    print("[Options]")
    print("1. 'Who are you?'")
    print("2. 'Ignore and proceed.'")
    choice = input("Choose (1/2): ")

    if choice == '1':
        print("OuroDaemon: 'A shadow born from your struggles. Evolve or be consumed.'")
        for regret in [
            "I hesitated in the mountains.",
            "I doubted the locals.",
            "I ignored the signals.",
            "I hesitated at the compound.",
            "I underestimated the enemy's resilience."
        ]:
            ouro_daemon.absorb_regret(regret)
        print(ouro_daemon.speak())

    # Next Environment: Village raid
    print("\n[Mission] Moving into the village.")
    environment = village
    environment.describe()

    # Ambush in the village
    success = fight_sequence([player], [enemies[1]], environment)
    if not success:
        print("[Mission Failed] Ambushed in the village.")
        return

    # Final high-stakes combat at compound
    print("\n[Final Goal] Assault the Warlord's Compound.")
    environment = compound
    environment.describe()
    print("[Event] The team breaches the gates.")
    # Final boss fight
    success = fight_sequence([player], [enemies[2]], environment)
    if success:
        print("\n[Victory] The Warlord is captured. The militants' network is crippled.")
        print("Agent Shameek: 'Good work, team. This is just the beginning in this long fight.'")
    else:
        print("[Mission Failed] The enemy was too strong.")

    print("\n--- End of Operation ---")

# Run the mission
if __name__ == "__main__":
    start_operation()

 import random  

# --- Core Classes ---  

class Glyph:  
    def __init__(self, symbol, resonance, integrity=1.0):  
        self.symbol = symbol  
        self.resonance = resonance  
        self.integrity = integrity  

    def decay(self, trauma_index):  
        decay_rate = (1 - self.resonance) * trauma_index * 0.05  
        self.integrity -= decay_rate  
        self.integrity = max(0.0, self.integrity)  

    def is_decayed(self):  
        return self.integrity <= 0.1  

class OuroDaemon:  
    def __init__(self):  
        self.truths = []  
        self.form = "coil"  

    def absorb_regret(self, regret_phrase):  
        self.truths.append(regret_phrase)  
        if len(self.truths) > 5:  
            self.evolve()  

    def evolve(self):  
        self.form = "serpent"  
        print("\n[OuroDaemon evolves into a serpentine form, glyphs burn fiercely.]")  

    def speak(self):  
        if self.form == "coil":  
            return "You are not the author. You are the echo."  
        elif self.form == "serpent":  
            return f"Beware, your truths are devoured: {', '.join(self.truths[-3:])}"  

# --- Characters ---  

class Character:  
    def __init__(self, name, role, health=100, attack_points=20):  
        self.name = name  
        self.role = role  
        self.health = health  
        self.attack_points = attack_points  

    def is_alive(self):  
        return self.health > 0  

    def attack(self, target):  
        damage = random.randint(self.attack_points - 5, self.attack_points + 5)  
        target.health -= damage  
        print(f"{self.name} attacks {target.name} for {damage} damage.")  
        if target.health < 0:  
            target.health = 0  

# --- Environment ---  

class Environment:  
    def __init__(self, name, description, difficulty_modifier=1.0):  
        self.name = name  
        self.description = description  
        self.difficulty_modifier = difficulty_modifier  

    def describe(self):  
        print(f"\n[Environment: {self.name}] — {self.description}")  

# --- Player and Enemy Setup ---  

# Main heroes  
oistarian = Character("Oistarian", "Half-Human, Half-Android", health=150, attack_points=35)  
big_boy = Character("BigBoy", "Strong Guardian", health=200, attack_points=40)  

# Enemies (ISIS militants)  
enemies = [  
    Character("ISIS Operative", "Enemy", health=80, attack_points=18),  
    Character("Terrorist Sniper", "Enemy", health=60, attack_points=22),  
    Character("Chemical Warlord", "Boss", health=180, attack_points=30),  
]  

# --- Combat Mechanics ---  

def combat_round(attacker, defender):  
    attacker.attack(defender)  
    if not defender.is_alive():  
        print(f"{defender.name} has been eliminated.")  
        return True  
    return False  

def fight_sequence(players, enemies, environment):  
    environment.describe()  
    print("\n--- Combat Begins ---")  
    turn = 0  
    while any(p.is_alive() for p in players) and any(e.is_alive() for e in enemies):  
        print(f"\n--- Turn {turn+1} ---")  
        # Players attack  
        for p in players:  
            if p.is_alive():  
                target = random.choice([e for e in enemies if e.is_alive()])  
                print(f"{p.name} ({p.role}) targets {target.name}.")  
                eliminated = combat_round(p, target)  
                  
# Missions List

## Operation Desert Ghost (Middle East)
- Infiltrate a fortified enemy compound to retrieve stolen intel.

## The Hunt for Hamas (Gaza - Secret Op)
- Stealthily locate and neutralize Hamas leadership in a dense urban environment. Avoid civilian casualties.
- Objectives: Locate cell leader, gather intel, neutralize target, escape undetected.

## Operation Nightfall (Europe)
- Sabotage weapons shipment in a snowy European city.

## Operation Jungle Phantom (South America)
- Eliminate a cartel warlord in dense jungle terrain.

## SECRET OPS: Shadow Protocol (Global)
- Stop a nuclear exchange, only accessible after all main ops.

# Rewards

- Credits for in-game store
- Exclusive weapons/skins
- Achievements/trophies
- Unlockable gadgets and upgrades
- Story cinematics

# Gadgets and Weapons

- EMP Grenade: Disables electronics and enemy drones.
- Recon Drone: Scout area and tag enemies.
- Night Vision Goggles
- Flashbang
- Silenced Sniper Rifle
- Rocket Launcher

# Story/Cinematics

- CinematicManager triggers cutscenes at mission start, key events, and mission completion.

# Stealth System

- Player visibility depends on movement, firing, and lighting.
- AI uses line of sight and noise to detect players.

- Mission Dialogue Snippets
Operation Nightfall

Jungle Phantom

The Hunt for Hamas
Achievement System Ideas
| Achievement Name | Requirement | 
| Silent Thunder | Complete a mission without being detected | 
| Ghost Protocol | Escape while enemies are on high alert | 
| Tactician | Use 3 different gadgets in a single mission | 
| Intel Hauler | Retrieve all hidden documents across all missions | 
| Endgame Architect | Unlock all alternate endings in Shadow Protocol | 




[Final confrontation] “There’s no glory in extinction. Only silence.”


# Mission Initialization
def start_mission():
    load_environment("SnowyCity")
    set_time("Night")
    play_cutscene("NightfallIntro")
    equip_player(["SilencedSniper", "EMP_Grenade", "Flashbang", "NightVision"])
    set_objectives([
        "Infiltrate warehouse district",
        "Locate weapons shipment",
        "Plant explosives",
        "Escape undetected"
    ])

# AI Setup
def setup_enemies():
    spawn_enemies("WarehouseGuards", patrol_routes="Randomized")
    set_ai_behavior("StealthAware")
    enable_ai_detection(["LineOfSight", "Noise", "Lighting"])

# Stealth Mechanics
def update_visibility(player):
    if player.is_moving_fast():
        increase_visibility()
    if player.is_in_darkness():
        decrease_visibility()
    if player.fires_weapon():
        trigger_alert("NearbyEnemies")

# Objective Logic
def locate_shipment():
    if player.scans_area_with("ReconDrone"):
        tag_object("WeaponsCrate")
        update_objective("Plant explosives on tagged crate")

def plant_explosives():
    if player.is_near("WeaponsCrate") and player.has_item("Explosives"):
        trigger_event("ExplosivesPlanted")
        play_cutscene("SabotageComplete")

# Escape Sequence
def escape():
    if alert_level == "High":
        spawn_enemies("Reinforcements")
        trigger_event("ChaseSequence")
    else:
        play_cutscene("SilentExit")
        complete_mission("Operation Nightfall")

# Cinematic Triggers
def play_cutscene(event):
    if event == "NightfallIntro":
        show_dialogue("HQ: Snow muffles the sound, but it won’t hide your trail. Get in, sabotage the shipment, and vanish.")
    elif event == "SabotageComplete":
        show_dialogue("HQ: Shipment compromised. Extraction point marked. Move fast.")
    elif event == "SilentExit":
        show_dialogue("HQ: Clean work. No trace left behind.")

# Mission Completion
def complete_mission(name):
    award_credits(500)
    unlock_achievement("Silent Thunder")
    unlock_gadget("Thermal Cloak")
    save_progress(name)

# Mission Initialization
def start_mission():
    load_environment("AmazonJungle")
    set_time("Dawn")
    play_cutscene("JungleIntro")
    equip_player(["SilencedSMG", "ReconDrone", "Flashbang", "NightVision", "Machete"])
    set_objectives([
        "Infiltrate jungle perimeter",
        "Locate warlord's camp",
        "Eliminate target",
        "Extract intel from command tent",
        "Evade pursuit and reach extraction point"
    ])

# AI Setup
def setup_enemies():
    spawn_enemies("CartelGuards", patrol_routes="DenseJunglePaths")
    set_ai_behavior("AmbushReady")
    enable_ai_detection(["Noise", "LineOfSight", "Thermal"])

# Environmental Hazards
def jungle_effects():
    enable_weather("Rain")
    set_visibility("Low")
    spawn_animals(["Snakes", "Jaguars"])
    trigger_event("Mudslide", location="CliffPassage")

# Recon and Targeting
def locate_target():
    if player.uses("ReconDrone"):
        tag_object("WarlordTent")
        update_objective("Approach tent undetected")

# Combat and Elimination
def eliminate_target():
    if player.is_near("Warlord") and player.is_undetected():
        trigger_event("SilentKill")
        play_cutscene("TargetNeutralized")
    else:
        trigger_alert("CampWideAlert")

# Intel Extraction
def extract_intel():
    if player.accesses("CommandTent") and player.has_item("DataChip"):
        trigger_event("IntelSecured")
        update_objective("Reach extraction point")

# Escape Sequence
def escape():
    if alert_level == "High":
        spawn_enemies("Reinforcements")
        trigger_event("HelicopterChase")
    else:
        play_cutscene("JungleExit")
        complete_mission("Operation Jungle Phantom")

# Cinematic Triggers
def play_cutscene(event):
    if event == "JungleIntro":
        show_dialogue("HQ: The jungle hides more than trees. Find the warlord, take him out, and get out clean.")
    elif event == "TargetNeutralized":
        show_dialogue("HQ: Target down. Grab the intel and move.")
    elif event == "JungleExit":
        show_dialogue("HQ: Extraction complete. You just ghosted a legend.")

# Mission Completion
def complete_mission(name):
    award_credits(600)
    unlock_achievement("Phantom Strike")
    unlock_gadget("Jungle Camo Suit")
    save_progress(name)

class JungleGuardAI:
    def __init__(self):
        self.alert_state = "Idle"  # Idle, Suspicious, Alerted
        self.patrol_route = generate_patrol_path()
        self.hearing_range = 30  # meters
        self.vision_cone = 90  # degrees

   Warlord Backstory: El Fantasma
• 	Real Name: Mateo Santoro
• 	Alias: El Fantasma (“The Ghost”)
• 	Origin: Born in the borderlands of Colombia and Brazil, Santoro was once a revolutionary leader who became disillusioned after seeing peace negotiations collapse.
• 	Transformation: He vanished for years, believed dead. Re-emerged with a personal army funded by cartel gold and nationalist agendas.
• 	Mythos: Locals believe Santoro can command the jungle itself. His presence is shrouded in superstition—marked by disappearing scouts, ritual symbols, and whispered sightings.
• 	Current Role: Running paramilitary operations and narcotics routes from a camouflaged jungle compound.
 Branching Mission Dialogue Based on Stealth Outcome
Mission tone and story impact shift depending on player approach:
✅ Stealth Success Path
• 	Intro (Cutscene):
“Move like mist. If you’re seen, you’re compromised. El Fantasma rewards silence with survival.”
• 	Post-Assassination:
“HQ: The warlord didn’t see it coming. You’ve left no trace, just whispers and shadows. Civilians now tell ghost stories... and some of them are yours.”
• 	Intel Retrieval:
“Encrypted logs reference a ‘Red Serpent’—something deeper. We thought he was a cartel pawn. He may have been a prophet.”
    
    
 Detected Path
• 	Intro (Cutscene):
“This jungle devours noise. If you fire recklessly, expect it to roar back.”
• 	Post-Assassination (Alerted):
“HQ: You made it, but the body count drew attention. Locals fear retribution. The legend of El Fantasma grows stronger—his death wasn't silent enough to kill the myth.”
• 	Intel Retrieval:
“Data extracted—distorted. Someone scrubbed half the files during the firefight. We have fragments, but the larger threat remains veiled.”

El Fantasma’s Compound: 3D Layered Design
Think jungle fortress meets twisted folklore. Multilevel, reactive, and almost spiritual.
🔷 Top Layer: Outer Perimeter
• 	Camouflaged gates, guards with dogs and thermal scopes.
• 	Hidden tripwires linked to flare traps.
• 	Ancient rebel graffiti hints at internal betrayals.
🔶 Mid Layer: Warlord's Courtyard
• 	Open-air command center lined with sacred skulls and drug caches.
• 	Jungle shrine where Santoro meditated—pressing certain symbols unlocks secret passages.
• 	Weathered radio tower broadcasting encrypted chants—possible intel source.
🔷 Lower Layer: Catacombs and Lore Vault
• 	Underground escape tunnels laced with booby traps: claymore mines triggered by laser grids, collapsing corridors.
• 	Locked Lore Room with encrypted tablets describing the "Red Serpent," a possible sequel hook.
• 	Crypt where fallen lieutenants are buried with ceremonial weapons—players can retrieve rare gear.
  
  Escape Routes
| Route Name | Description | Risk Level | 
| Croc Trail | Submerged waterway, silent but patrolled by guards | Moderate | 
| Spirit Vines | Climbable cliff face covered in thick vines | Low | 
| Fire Run | Booby-trapped jungle corridor with timed obstacles | High | 

 Booby Traps That Feel Legendary
- Echo Mines: Sound-triggered, shaped charges embedded in hollow trees.
- Serpent Lock: A puzzle-based tomb door with rotating snake emblems—incorrect patterns trigger gas release.
- Ghost Flame: Ritual bonfires that burst into high flames when players get close—revealing position to guards unless disabled.

Mission: The Hunt for Hamas
Location: Gaza City – Dense urban sprawl, underground tunnels, and fortified compounds
Objective: Locate and rescue 57 hostages held by Hamas; neutralize cell leadership; escape undetected

Mission Script (Pseudocode Format)
# Mission Initialization
def start_mission():
    load_environment("GazaCity_UrbanZone")
    set_time("Midnight")
    play_cutscene("HostageBriefing")
    equip_player(["SilencedSMG", "ReconDrone", "EMP_Grenade", "ThermalScanner"])
    set_allies(["IDF_Squad", "Oistarian"])
    set_objectives([
        "Infiltrate Hamas compound",
        "Locate hostages",
        "Neutralize cell leader",
        "Extract hostages safely",
        "Evade pursuit"
    ])

# AI Setup
def setup_enemies():
    spawn_enemies("HamasMilitants", patrol_routes="Randomized")
    set_ai_behavior("UrbanCombat")
    enable_ai_detection(["Noise", "LineOfSight", "Thermal"])

# Oistarian Support
def oistarian_actions():
    if player.is_detected():
        trigger_event("OistarianSniperCover")
    if player.reaches_hostage_room():
        trigger_event("OistarianHackDoor")
        show_dialogue("Oistarian: 'I’ve got the lock. You get the people.'")

# Hostage Rescue
def rescue_hostages():
    if player.disables_security("MainDoor"):
        trigger_event("HostagesFreed")
        update_objective("Escort hostages to extraction")
    if alert_level == "High":
        spawn_enemies("Reinforcements")
        trigger_event("HostagePanic")

# Cell Leader Encounter
def confront_leader():
    if player.reaches("CommandRoom"):
        play_cutscene("LeaderConfrontation")
        trigger_event("BossFight")
        show_dialogue("Leader: 'You think you can erase us? We are the shadow.'")

# Extraction Sequence
def escape():
    if hostages_are_safe():
        play_cutscene("ExtractionSuccess")
        complete_mission("The Hunt for Hamas")
    else:
        trigger_event("ExtractionFailure")
        show_dialogue("HQ: 'We lost too many. Mission compromised.'")

# Cinematic Triggers
def play_cutscene(event):
    if event == "HostageBriefing":
        show_dialogue("HQ: '57 lives. No margin for error. Hamas won’t negotiate. You go in, you bring them out.'")
    elif event == "ExtractionSuccess":
        show_dialogue("Oistarian: 'They’ll never know who saved them. But we will.'")

# Mission Completion
def complete_mission(name):
    award_credits(1000)
    unlock_achievement("Liberator")
    unlock_gadget("Hostage Beacon")
    save_progress(name)

Oistarian: The Phantom Operative
• 	Codename: Oistarian
• 	Real Name: Unknown (rumored to be Ari Stern)
• 	Background: Former Mossad operative turned rogue after a classified operation in Eastern Europe went sideways. Believed dead after a betrayal by his own unit, he resurfaced as a ghost operative—working off-grid, answering only to encrypted callsigns and moral compasses.
• 	Specialty: Urban infiltration, hostage extraction, psychological warfare. Known for leaving no trace—except encrypted messages carved into walls.
• 	Signature Gear:
• 	Blackout Cloak: Adaptive camouflage
• 	Whisper Blade: Ceramic knife undetectable by scanners
• 	Echo Beacon: Emits false audio signatures to mislead enemies
Hamas Compound: Tunnel Map Design
The compound is a multi-layered fortress beneath Gaza City, blending civilian infrastructure with military deception.


Tunnel Zones
| Zone Name | Description | 
| Surface Layer | Disguised as a school and clinic; entry shafts hidden in playground and morgue | 
| Transit Arteries | Narrow tunnels with rail carts for weapon transport; motion sensors embedded | 
| Command Nexus | Central hub with encrypted servers, hostage cells, and war room | 
| Escape Veins | Tunnels leading to mosques and UN facilities; booby-trapped with dead ends | 
| The Vault | Deepest level—hostages held in soundproof chambers with biometric locks | 



 Environmental Features
- Ventilation shafts double as sniper nests
- Flood valves can drown sections if breached
- Tunnel graffiti reveals resistance lore and Oistarian’s past ops

🎬 Cinematic Confrontation Dialogue: Final Showdown
Scene: Deep within the Command Nexus. The cell leader stands beside a console, hostages behind a biometric gate. Oistarian emerges from the shadows.

Cell Leader:
“You think you’ve won? These tunnels are older than your country. We are the roots beneath your cities.”
Oistarian (calm, stepping forward):
“Roots rot. And I’ve brought the fire.”
Cell Leader:
“You’re just a ghost. A myth. Mossad disowned you. Your own people buried you.”
Oistarian:
“I don’t need a grave. I need a reason. And tonight, I found 57.”
[Gunfire erupts outside. IDF breach begins. Alarms blare.]
Cell Leader (activating console):
“You won’t reach them in time.”
Oistarian (throws Echo Beacon):
“Time’s a luxury. I deal in silence.”
[Beacon emits false footsteps. Leader turns. Oistarian lunges. Blade flashes.]
[Cutscene fades to black. Whispered voiceover:]
“They’ll never know who saved them. But they’ll sleep. And that’s enough.”

Hostage Rescue Sequence: Tactical Breakdown
Setting: Deep within the Hamas compound’s underground vault—biometric locks, motion sensors, and a narrow window before reinforcements arrive.
🔹 Phase 1: Breach & Entry
• 	Trigger: Oistarian hacks the biometric gate while IDF provides perimeter suppression.
• 	Gameplay Hook: Timed stealth breach—player must disable motion sensors and cameras using EMP grenades.
• 	Dialogue:
Oistarian (whispering): “Door’s breathing. One wrong move and it screams.”
🔹 Phase 2: Hostage Extraction
• 	Hostages: 57 civilians, grouped in three chambers. Some are injured, others sedated.
• 	Mechanics:
• 	Use Hostage Beacon to guide groups silently.
• 	Apply Field Medkits to stabilize wounded.
• 	Avoid tripwire traps and laser grids during escort.
🔹 Phase 3: Evacuation
• 	Routes:
• 	Tunnel Vein Alpha: Silent, but unstable—risk of collapse.
• 	Surface Hatch Bravo: Heavily guarded—requires distraction.
• 	Oistarian’s Role: Sets Echo Beacon to simulate gunfire in opposite direction.
• 	Final Cutscene:
“They walked out of hell. Not because we fought. But because we listened.”

 Oistarian’s Encrypted Journal Entries (Hidden Lore)
Scattered across the compound—etched into walls, embedded in server logs, and hidden in hollow bricks. Each entry reveals fragments of his psyche and past missions.
 Entry 1: “Echoes in Vienna”

 Entry 2: “The Red Serpent”

 Entry 3: “The 57”


 Integration Ideas
• 	Journal Decoder Mini-Game: Players unlock entries using fragments found in intel caches.
• 	Narrative Impact: Reading all entries unlocks alternate ending where Oistarian disappears post-mission—his final message left in Morse code.
    
    def update_behavior(self, player):
        if detect_noise(player.location, player.movement_level):
            self.alert_state = "Suspicious"
            investigate(player.last_known_location)
        elif detect_visual(player.location, lighting=player.lighting, camo=player.camo_level):
            self.alert_state = "Alerted"
            call_reinforcements()
            attack(player)

    def investigate(self, location):
        move_to(location)
        check_for_clues()
        return_to_patrol()

    def call_reinforcements():
        trigger_spawn("NearbyGuards", radius=50)
        alert_dogs()

Alternate Ending: “The Vanishing Echo”
Setting: After the successful extraction, the compound collapses behind them. The team regroups at the extraction point—but Oistarian is missing.
🔹 Final Moments
- The camera pans to a burned-out terminal, where a decrypted journal entry flickers:
- “Redemption isn’t escape. It’s erasure.”
- A Morse code transmission plays faintly in the background—Oistarian’s final message.
- Cut to a remote monastery in the Caucasus Mountains. A hooded figure walks past a wall etched with the symbol of the Red Serpent.

🐍 Red Serpent: Future Antagonist DesignCodename: Anilius Scytales
Background: Former intelligence operative turned ideological saboteur. Believes in “purging false peace through chaos.”🔹 Visual Design- Armor: Crimson scale-textured exosuit with reactive camouflage.
- Signature Weapon: Neurocoil Blade—a whip-like weapon that delivers memory-erasing neurotoxins.
- Symbol: A serpent devouring its own tail, etched into every scene like a watermark.
🔹 Psychological Profile- Belief System: “Truth is venom. Inject it, and watch the world convulse.”
- Tactics: Uses encrypted broadcasts to manipulate global events. Believed to have infiltrated five intelligence agencies.

🧾 Shadow Protocol Finale: Post-Mission Debrief SceneLocation: Classified bunker, Jerusalem.
Characters: Commander Elan, Analyst Rafi, and surviving operatives.🔹 Scene BreakdownCommander Elan:“We extracted 57 lives. But we lost one soul. Oistarian’s signal ended at 03:17. No trace since.”Analyst Rafi:“Before he vanished, he uploaded a file. It’s not intel—it’s a warning. The Red Serpent is real. And it’s already coiled around us.”Operative Yael:“So what now?”Commander Elan:“Now? We shed our skin. We become something the Serpent can’t swallow.”Lights dim. A new mission file loads: “Operation Ouroboros.”

Mission Briefing: Operation Ouroboros
Objective: Infiltrate the monastery in the Caucasus Mountains to retrieve Oistarian’s final transmission and uncover the Red Serpent’s origin.
🔹 Mission Parameters
• 	Location: Monastery of Saint Vartan, hidden in the Caucasus.
• 	Team: Operatives Yael, Rafi, and Commander Elan.
• 	Intel: Oistarian’s last signal originated from beneath the monastery crypt.
• 	Threat Level: Unknown—monastery is off-grid, rumored to house Red Serpent acolytes.
🔹 Mission Flow
1. 	Insertion: HALO jump into the valley under cover of night.
2. 	Approach: Navigate ancient stone paths laced with motion-triggered glyphs.
3. 	Contact: Monks speak in riddles—some are loyal, others corrupted.
4. 	Discovery: Beneath the altar lies a sealed chamber with Oistarian’s final log.
5. 	Extraction: Evade Red Serpent’s sleeper agents embedded in the local militia.

   🎥 Storyboard: Monastery Scene
| Panel | Visual | Action | Dialogue | 
| 1 | Wide shot of monastery at dusk, fog curling around spires | Team approaches silently | Yael: “Place feels like it remembers pain.” | 
| 2 | Interior crypt, candlelight flickers on stone walls | Rafi scans for signals | Rafi: “Signal’s here. But it’s... layered.” | 
| 3 | Hidden chamber opens, revealing Oistarian’s gear and journal | Elan kneels beside it | Elan: “He was here. And he left us a warning.” | 
| 4 | Wall etching glows faintly—a serpent devouring its tail | Team stares in silence | Yael: “Ouroboros. He knew.” | 
| 5 | Sudden power surge—Red Serpent broadcast begins | Crypt shakes | Broadcast: “Truth is venom. Inject it.” | 




🐍 Red Serpent’s Manifesto: “The Doctrine of Venom”
“Peace is the anesthesia of the weak. We are the convulsion. We are the cure.”

“You call it chaos. We call it clarity. Every empire built on lies must be swallowed whole.”

“I am not a man. I am the echo of every truth you buried. I am Ouroboros. I consume what you fear to face.”

“Let the world shed its skin. Let the venom flow.”



MISSION: Operation Ouroboros
LOCATION: Monastery Crypt, Caucasus Mountains
TRIGGER: Line decoded from Red Serpent Manifesto

====> TRIGGER LINE 01: “Truth is venom. Inject it.”  
>> MEMORY FLASHBACK: TEHRAN, NIGHT OP

- Visual: Rooftop breach over glowing skyline.
- Soundtrack Cue: Bass drone with static overlay.
- Oistarian POV: Child in hallway holding a Serpent insignia pendant.

OISTARIAN (V.O.):
   "They said no innocents. But no one asked her name."

>> GLYPH TRAP: NEUROVENOM SNAKE SEQUENCE

- Glyph Arrangement: Ouroboros spiral, 6 rotating rings.
- Puzzle: Align rings to form phrase "Erasure breeds clarity."
- Result: Door opens, mist leaks out, revealing next chamber.

====> TRIGGER LINE 02: “Every empire built on lies must be swallowed whole.”  
>> MEMORY FLASHBACK: CARACAS, INTEL EXTRACTION

- Visual: Torn archive room lit by flare fires.
- Artifact Found: Photos of agents branded with serpent tattoos.

RAFI:
   "They were handlers. Not victims. This goes deeper than intel."

>> GLYPH TRAP: BLOODLOCK RIDDLE STONE

- Mechanism: Pressure plate activates poem riddle carved in Aramaic.
- Riddle: 
   “I am taken once. I am kept twice. If I escape, your silence dies. What am I?”
- Answer: “Breath”
- Consequence: Incorrect answer triggers sonic disorientation pulse.

====> TRIGGER LINE 03: “Let the world shed its skin.”  
>> MEMORY FLASHBACK: VIENNA, SHADOW SUMMIT

- Visual: Surveillance footage—Oistarian watches leaders speak behind mirrored glass.
- Emotional Cue: His hand trembles as he deactivates his ID tag.

OISTARIAN (V.O.):
   "They wore masks. I shed mine."

>> MONK RIDDLE ENCOUNTER

- Monk Name: Brother Naum
- Appearance: Blind, gold serpent embroidered on robe

BROTHER NAUM:
   "A question for the questioner. A scale for the scaled. Answer wisely or leave unmarked."

- Riddle: 
   “What begins unspoken, dies forgotten, yet builds every truth ever known?”
- Answer: “Memory”
- Result: Glyph passage illuminates, revealing hidden stairwell.

====> ENDPOINT: Vault of Final Echo  
- Artifact: Oistarian’s final log sealed in obsidian casing
- Broadcast Initiates: Red Serpent Manifesto plays in looping whisper

LOG ENTRY:
   "They will remember not what I saved... but what I chose to forget."

MISSION: Operation Ouroboros
LOCATION: Vault of Final Echo, beneath Saint Vartan Monastery
OBJECTIVE: Retrieve Oistarian’s obsidian log and neutralize Red Serpent’s neurotech broadcast

====> ENVIRONMENT: VAULT OF FINAL ECHO

- Architecture: Gothic crypt fused with quantum vault tech
- Entry Mechanism: Glyph-sealed obsidian gate, activated by memory resonance
- Ambient Sound: Whispered echoes of past missions, looped in reverse

>> ENTRY SEQUENCE

PLAYER_ACTION: Align glyphs to form phrase “Memory is the wound that never heals”
RESULT: Vault opens, revealing obsidian log pedestal

====> INTERFACE: OBSIDIAN LOG TERMINAL

- Material: Black glass with embedded neural filaments
- UI: Holographic memory threads, color-coded by emotional intensity
- Access Protocol: Biometric + encrypted phrase from Oistarian’s journal

>> LOG ENTRY DISPLAY

LOG_01:
   "Vienna. Caracas. Tehran. I saw the Serpent shed its skin in every city."

LOG_02:
   "If you’re reading this, I’ve already forgotten. You must remember for me."

LOG_03:
   "Inject the venom. Erase the lie. Let truth scream."

>> DECRYPTION MINI-GAME

- Puzzle: Match memory threads to glyphs etched in the chamber walls
- Result: Unlocks Red Serpent’s broadcast node

====> NEUROTECH: RED SERPENT’S MEMORY-ERASING DEVICE

DEVICE_NAME: Neurocoil Injector
TECH_ORIGIN: Hybrid biotech from stolen DARPA and Mossad research
FUNCTION: Delivers targeted neurotoxins that erase episodic memory traces

>> DEVICE SPECIFICATIONS

- Delivery Method: Whip-like coil with micro-needle tips
- Toxin: “V-Serum” — disrupts hippocampal reconsolidation
- Range: 3 meters, line-of-sight
- Side Effect: Induces false memories of Red Serpent doctrine

>> FINAL CONFRONTATION

SCENE: Vault begins to collapse as Red Serpent avatar materializes via holographic mist

RED_SERPENT (Broadcast):
   "You came to remember. I came to erase."

PLAYER_ACTION:
   - Option A: Inject counter-serum from Oistarian’s kit
   - Option B: Upload corrupted manifesto to overwrite Red Serpent’s signal
   - Option C: Sacrifice memory of mission to seal vault permanently

>> OUTCOME VARIANTS

ENDING_A:
   Vault sealed. Red Serpent signal disrupted. Player retains memory.

ENDING_B:
   Vault sealed. Player loses memory of mission. Red Serpent doctrine remains dormant.

ENDING_C:
   Vault collapses. Red Serpent escapes. Player becomes next Ouroboros.

MISSION: Operation Ouroboros
LOCATION: Vault of Final Echo, beneath Saint Vartan Monastery
OBJECTIVE: Retrieve Oistarian’s obsidian log, neutralize Red Serpent’s neurotech, and choose memory fate

====> ENVIRONMENT: VAULT OF FINAL ECHO

- Architecture: Gothic crypt fused with quantum vault tech
- Entry Mechanism: Glyph-sealed obsidian gate, activated by memory resonance
- Ambient Sound: Whispered echoes of past missions, looped in reverse

>> ENTRY SEQUENCE

PLAYER_ACTION: Align glyphs to form phrase “Memory is the wound that never heals”
RESULT: Vault opens, revealing obsidian log pedestal

====> INTERFACE: OBSIDIAN LOG TERMINAL

- Material: Black glass with embedded neural filaments
- UI: Holographic memory threads, color-coded by emotional intensity
- Access Protocol: Biometric + encrypted phrase from Oistarian’s journal

>> LOG ENTRY DISPLAY

LOG_01:
   "Vienna. Caracas. Tehran. I saw the Serpent shed its skin in every city."

LOG_02:
   "If you’re reading this, I’ve already forgotten. You must remember for me."

LOG_03:
   "Inject the venom. Erase the lie. Let truth scream."

>> DECRYPTION MINI-GAME

- Puzzle: Match memory threads to glyphs etched in the chamber walls
- Result: Unlocks Red Serpent’s broadcast node

====> NEUROTECH: RED SERPENT’S MEMORY-ERASING DEVICE

DEVICE_NAME: Neurocoil Injector
TECH_ORIGIN: Hybrid biotech from stolen DARPA and Mossad research
FUNCTION: Delivers targeted neurotoxins that erase episodic memory traces

>> DEVICE SPECIFICATIONS

- Delivery Method: Whip-like coil with micro-needle tips
- Toxin: “V-Serum” — disrupts hippocampal reconsolidation
- Range: 3 meters, line-of-sight
- Side Effect: Induces false memories of Red Serpent doctrine

>> FINAL CONFRONTATION

SCENE: Vault begins to collapse as Red Serpent avatar materializes via holographic mist

RED_SERPENT (Broadcast):
   "You came to remember. I came to erase."

PLAYER_ACTION:
   - Option A: Inject counter-serum from Oistarian’s kit
   - Option B: Upload corrupted manifesto to overwrite Red Serpent’s signal
   - Option C: Sacrifice memory of mission to seal vault permanently

>> OUTCOME VARIANTS

ENDING_A:
   Vault sealed. Red Serpent signal disrupted. Player retains memory.

ENDING_B:
   Vault sealed. Player loses memory of mission. Red Serpent doctrine remains dormant.

ENDING_C:
   Vault collapses. Red Serpent escapes. Player becomes next Ouroboros.

MISSION: Operation Ouroboros
LOCATION: Vault of Final Echo, beneath Saint Vartan Monastery
OBJECTIVE: Retrieve Oistarian’s obsidian log, neutralize Red Serpent’s neurotech, and choose memory fate

====> ENVIRONMENT: VAULT OF FINAL ECHO

- Architecture: Gothic crypt fused with quantum vault tech
- Entry Mechanism: Glyph-sealed obsidian gate, activated by memory resonance
- Ambient Sound: Whispered echoes of past missions, looped in reverse

>> ENTRY SEQUENCE

PLAYER_ACTION: Align glyphs to form phrase “Memory is the wound that never heals”
RESULT: Vault opens, revealing obsidian log pedestal

====> INTERFACE: OBSIDIAN LOG TERMINAL

- Material: Black glass with embedded neural filaments
- UI: Holographic memory threads, color-coded by emotional intensity
- Access Protocol: Biometric + encrypted phrase from Oistarian’s journal

>> LOG ENTRY DISPLAY

LOG_01:
   "Vienna. Caracas. Tehran. I saw the Serpent shed its skin in every city."

LOG_02:
   "If you’re reading this, I’ve already forgotten. You must remember for me."

LOG_03:
   "Inject the venom. Erase the lie. Let truth scream."

>> DECRYPTION MINI-GAME

- Puzzle: Match memory threads to glyphs etched in the chamber walls
- Result: Unlocks Red Serpent’s broadcast node

====> NEUROTECH: RED SERPENT’S MEMORY-ERASING DEVICE

DEVICE_NAME: Neurocoil Injector
TECH_ORIGIN: Hybrid biotech from stolen DARPA and Mossad research
FUNCTION: Delivers targeted neurotoxins that erase episodic memory traces

>> DEVICE SPECIFICATIONS

- Delivery Method: Whip-like coil with micro-needle tips
- Toxin: “V-Serum” — disrupts hippocampal reconsolidation
- Range: 3 meters, line-of-sight
- Side Effect: Induces false memories of Red Serpent doctrine

>> FINAL CONFRONTATION

SCENE: Vault begins to collapse as Red Serpent avatar materializes via holographic mist

RED_SERPENT (Broadcast):
   "You came to remember. I came to erase."

PLAYER_ACTION:
   - Option A: Inject counter-serum from Oistarian’s kit
   - Option B: Upload corrupted manifesto to overwrite Red Serpent’s signal
   - Option C: Sacrifice memory of mission to seal vault permanently

>> OUTCOME VARIANTS

ENDING_A:
   Vault sealed. Red Serpent signal disrupted. Player retains memory.

ENDING_B:
   Vault sealed. Player loses memory of mission. Red Serpent doctrine remains dormant.

ENDING_C:
   Vault collapses. Red Serpent escapes. Player becomes next Ouroboros.

MISSION: Final Echo Protocol
LOCATION: Vault of Final Echo → Berlin (Post-Credits)
OBJECTIVES:
   - Upload corrupted manifesto to overwrite Red Serpent signal
   - Decode V-Serum molecular structure
   - Reveal Serpent’s resurgence in Berlin

====> CORRUPTED MANIFESTO UPLOAD SEQUENCE

TERMINAL: OBSIDIAN LOG INTERFACE
STATUS: Broadcast Node Active

>> PLAYER_ACTION: Inject corrupted manifesto file “echo_venom.rewrite”

UPLOAD_SEQUENCE:
   - Step 1: Override checksum with phrase “Truth is a virus”
   - Step 2: Inject memory thread loop from Oistarian’s Vienna log
   - Step 3: Fragment manifesto into 7 glyph packets
   - Step 4: Route through neural filament lattice

RESULT:
   - Broadcast signal destabilizes
   - Red Serpent avatar flickers, voice distorts:
     *“You cannot rewrite venom. You become it.”*

>> SYSTEM RESPONSE:
   - Signal collapse initiated
   - Vault integrity at 12%
   - Countdown: 00:01:47

====> V-SERUM MOLECULAR STRUCTURE

SERUM_NAME: V-Serum (Venom Protocol)
TYPE: Neurotoxin + Memory Disruptor

>> MOLECULAR DESIGN

STRUCTURE:
   - Core: Modified scopolamine ring
   - Branch A: Synthetic peptide chain targeting hippocampal neurons
   - Branch B: Nanocarrier shell with reactive camouflage
   - Stabilizer: Lithium-bound protein sheath

>> FUNCTIONAL PROFILE

- Target: Episodic memory engrams
- Effect: Erasure + false memory implantation
- Half-life: 4 minutes
- Antidote: “Echo-Serum” (requires Oistarian’s biometric key)

>> SIDE EFFECTS:
   - Identity fragmentation
   - Doctrine hallucinations
   - Serpent symbol fixation

====> POST-CREDITS SCENE: BERLIN

LOCATION: Abandoned U-Bahn Station, Berlin
TIME: 03:17 AM

>> VISUAL SEQUENCE

- Camera pans through graffiti-covered tunnel
- A serpent symbol glows faintly on the wall
- A figure in crimson exosuit walks past surveillance drone

>> AUDIO CUE

- Broadcast begins on pirate frequency:
   *“The venom was never erased. It was archived.”*

>> FINAL FRAME

- Terminal screen flickers:
   FILE FOUND: “ouroboros_manifesto.v2”
   STATUS: ACTIVE

>> CUT TO BLACK
   TEXT: “Operation Echofall – Incoming”

MISSION: Operation Echofall
LOCATION: Berlin, Germany
OBJECTIVES:
   - Infiltrate sleeper cell network
   - Decode Red Serpent’s new broadcast
   - Prevent activation of “Venom Protocol v2”

====> INTEL: BERLIN SLEEPER CELL NETWORK

NETWORK_NAME: “EchoNet”
STRUCTURE: Decentralized, encrypted mesh of operatives embedded in civilian infrastructure

>> CELL NODES

NODE_01: “Kreuzberg Archive”
   - Cover: Art restoration studio
   - Role: Data laundering via QR-coded canvases

NODE_02: “U-Bahn Phantom”
   - Cover: Abandoned train control room
   - Role: Signal relay for Serpent broadcasts

NODE_03: “Tiergarten Echo”
   - Cover: Botanical research lab
   - Role: Neurocoil testing on plant memory systems

>> COMMUNICATION PROTOCOL

- Encryption: Glyph-based steganography embedded in graffiti
- Activation Phrase: “Let the venom bloom beneath the roots”
- Backup Signal: Pirate frequency 77.7 FM, 03:17 AM

====> OPERATION FLOW

1. Infiltrate Kreuzberg Archive and retrieve QR canvas
2. Decode glyph graffiti in U-Bahn tunnels
3. Intercept Tiergarten neurocoil test logs
4. Upload counter-broadcast via EchoNet relay

====> RED SERPENT BROADCAST: “Venom Protocol v2”

BROADCAST_ID: RS-X77
SOURCE: Phantom Node, Berlin

>> TRANSMISSION SCRIPT

> *“You buried the venom. But roots grow in silence.”*

> *“Every memory you cherish is a lie I whispered first.”*

> *“I am not reborn. I am remembered. And memory is infection.”*

> *“Berlin is not a city. It is a chrysalis. And tonight, it hatches.”*

> *“Let the venom bloom.”*

>> SIGNAL EFFECT

- Targets hippocampal resonance in listeners
- Triggers false recall of Red Serpent doctrine
- Embeds glyph hallucinations in visual cortex

====> COUNTERMEASURES

PLAYER_ACTION:
   - Option A: Upload “Echo-Serum” patch to EchoNet
   - Option B: Activate memory firewall via Tiergarten node
   - Option C: Sacrifice personal memory to overwrite broadcast

>> OUTCOME VARIANTS

ENDING_A:
   Broadcast neutralized. Sleeper cells go dormant.

ENDING_B:
   Broadcast corrupted. Sleeper cells mutate into rogue agents.

ENDING_C:
   Broadcast spreads. Player becomes Serpent’s next voice.

MISSION: Operation Echofall
LOCATION: Berlin Underground Network
OBJECTIVES:
   - Decode QR canvas puzzle
   - Survive hallucination sequence triggered by neurocoil exposure
   - Locate and infiltrate Serpent’s Chrysalis Chamber

====> PUZZLE MODULE: QR CANVAS DECODING

ARTIFACT: “Canvas of Echoes”
MEDIUM: Oil on canvas, embedded with 7 fragmented QR glyphs

>> PUZZLE FLOW

STEP_01: Scan fragmented QR glyphs using neural lens
STEP_02: Reconstruct glyphs into full QR matrix using memory thread alignment
STEP_03: Decode embedded phrase: “Memory is venom. Truth is the wound.”

>> RESULT:
   - Unlocks hidden coordinates: U-Bahn Phantom Node
   - Triggers neurocoil proximity alert

====> HALLUCINATION SEQUENCE: NEUROCOIL EXPOSURE

TRIGGER: Proximity to Red Serpent’s neurocoil broadcast node

>> VISUAL OVERLAY

- Scene distortion: Walls pulse like veins
- Glyphs animate and whisper in Aramaic
- Reflections show alternate versions of player’s past missions

>> AUDIO CUE

- Layered voices: Oistarian, Red Serpent, child from Tehran op
- Static interlaced with reversed manifesto phrases

>> PLAYER EFFECTS

- HUD flickers with false mission logs
- Controls invert intermittently
- Memory log entries rewrite themselves

>> ESCAPE CONDITION

PLAYER_ACTION:
   - Inject Echo-Serum
   - Solve glyph riddle: “What devours its own truth to survive?”
   - Answer: “Ouroboros”

====> ENVIRONMENT: SERPENT’S CHRYSALIS CHAMBER

LOCATION: Beneath Tiergarten, sealed behind biometric glyph gate

>> ARCHITECTURE

- Walls: Black obsidian laced with neural filaments
- Ceiling: Suspended serpent skeleton, glowing with pulse light
- Central Node: Chrysalis pod containing RS-X77 broadcast core

>> SECURITY SYSTEM

- Defense: Neurocoil sentinels with memory disruptor beams
- Puzzle Lock: 3-layer glyph cipher requiring emotional resonance match

>> FINAL OBJECTIVE

PLAYER_ACTION:
   - Upload corrupted manifesto fragment “echo_venom.rewrite”
   - Inject V-Serum antidote into Chrysalis core
   - Choose fate: erase Serpent or become its next voice

>> OUTCOME VARIANTS

ENDING_A:
   Chrysalis implodes. Broadcast ends. Player retains memory.

ENDING_B:
   Chrysalis sealed. Player loses identity. Serpent doctrine archived.

ENDING_C:
   Chrysalis awakens. Player becomes avatar of RS-X77.

MISSION: Operation Echofall
LOCATION: Chrysalis Chamber, Berlin Underground
OBJECTIVES:
   - Solve glyph cipher puzzle to access broadcast core
   - Survive Serpent’s awakening monologue
   - Interface with neural filament system to overwrite RS-X77 signal

====> PUZZLE MODULE: GLYPH CIPHER – “The Spiral of Truth”

PUZZLE_TYPE: Symbolic Transposition Cipher
GLYPH_SET: 7 rotating rings, each etched with 12 ancient glyphs

>> PUZZLE FLOW

STEP_01: Align glyphs to match emotional resonance sequence:
   - Fear → Memory → Silence → Echo → Truth → Erasure → Venom

STEP_02: Decode spiral pattern using mnemonic:
   “What devours its own truth to survive?”

ANSWER: “Ouroboros”

STEP_03: Final alignment reveals encrypted phrase:
   “Inject the lie to reveal the venom.”

>> RESULT:
   - Broadcast core unlocks
   - Serpent avatar begins awakening sequence

====> MONOLOGUE: RED SERPENT AWAKENS

ENTITY: RS-X77 (Red Serpent Broadcast Core)
VISUAL: Holographic mist forms serpent-shaped neural lattice

>> TRANSMISSION SCRIPT

> *“You buried me in silence. But silence is where I breed.”*

> *“You called me chaos. But I am the pattern beneath your peace.”*

> *“I am not reborn. I am remembered. And memory is infection.”*

> *“You came to overwrite me. But you are already written.”*

> *“Let the venom bloom.”*

>> EFFECT:
   - Neurocoil pulses activate
   - Neural filament interface begins synchronization

====> INTERFACE MODULE: NEURAL FILAMENT SYSTEM

DEVICE_NAME: EchoSpine Interface
TECH_ORIGIN: Hybrid bioelectronic mesh from DARPA + Mossad archives

>> DESIGN SPECIFICATIONS

- Structure: Filament lattice woven into obsidian chamber walls
- Material: Carbon-silk composite with reactive myelin mimic
- Connectivity: Direct hippocampal resonance mapping
- UI: Holographic memory threads, color-coded by trauma index

>> FUNCTIONALITY

- Input: Emotional glyph cipher sequence
- Output: Broadcast overwrite or memory sacrifice
- Risk: Identity fragmentation, doctrine hallucination, irreversible echo loop

>> PLAYER_ACTION OPTIONS

OPTION_A: Inject corrupted manifesto thread “echo_venom.rewrite”
OPTION_B: Sacrifice personal memory to seal RS-X77 permanently
OPTION_C: Merge with RS-X77 and become next Serpent avatar

>> OUTCOME VARIANTS

ENDING_A:
   Broadcast overwritten. Serpent signal collapses. Player retains memory.

ENDING_B:
   Broadcast sealed. Player loses identity. Serpent archived.

ENDING_C:
   Broadcast evolves. Player becomes RS-X77 voice. Berlin becomes chrysalis.

MODULE_01: TRAUMA INDEX COLOR SYSTEM

SYSTEM_NAME: EchoHue
PURPOSE: Emotional state mapping via color-coded trauma index
INPUT: Biometric stress signals (heart rate, cortisol, pupil dilation)
OUTPUT: Dynamic color overlay in HUD and environment lighting

COLOR INDEX:
   - BLUE (Level 0): Calm, grounded, parasympathetic dominance
   - GREEN (Level 1): Alert, focused, low trauma recall
   - YELLOW (Level 2): Elevated stress, memory surfacing
   - ORANGE (Level 3): Active trauma loop, emotional instability
   - RED (Level 4): Flashback onset, dissociation risk
   - PURPLE (Level 5): Full hallucination sequence triggered

RESPONSE SYSTEM:
   - Auto-dim HUD during RED/PURPLE states
   - Activate EchoSpine feedback dampeners
   - Inject visual softening overlays (lavender mist, blurred edges)

---

MODULE_02: SERPENT DOCTRINE HALLUCINATION SEQUENCE

TRIGGER: Exposure to RS-X77 neurocoil pulse
SEQUENCE_NAME: “Doctrine Bloom”
DURATION: 00:03:17

VISUAL OVERLAY:
   - Glyphs animate across walls and skin
   - Reflections show alternate versions of player’s past missions
   - Serpent symbol pulses in peripheral vision

AUDIO LAYER:
   - Whispered manifesto fragments:
     > “Peace is anesthesia. Inject the venom.”
     > “You are not the author. You are the echo.”
     > “Memory is infection. Let it bloom.”

NEUROLOGICAL EFFECTS:
   - HUD distortion
   - Control inversion
   - False mission logs overwrite real ones
   - Emotional resonance spikes trigger trauma index escalation

ESCAPE CONDITION:
   - Solve glyph riddle: “What devours its own truth to survive?”
   - Answer: “Ouroboros”
   - Inject Echo-Serum to stabilize hippocampal loop

---

MODULE_03: ECHOSPINE BIOMETRIC FEEDBACK LOOP

DEVICE_NAME: EchoSpine Interface
TECH_ORIGIN: Hybrid bioelectronic mesh from DARPA + Mossad archives
LOCATION: Embedded in spinal column of operative

DESIGN SPECIFICATIONS:
   - Material: Carbon-silk composite with reactive myelin mimic
   - Sensors: Cortisol, EEG, heart rate, pupil dilation, breath rhythm
   - Feedback: Haptic pulses, temperature modulation, visual overlays

FUNCTIONALITY:
   - Maps trauma index in real time
   - Adjusts HUD color via EchoHue
   - Activates countermeasures during hallucination sequences
   - Records emotional resonance logs for post-mission debrief

BIOMETRIC LOOP:
   - Input: Stress spike → trauma index escalation
   - Response: EchoSpine triggers haptic pulse + visual softening
   - Output: Emotional stabilization or memory overwrite prompt

FAILSAFE:
   - If trauma index reaches PURPLE for >00:01:00
   - Auto-inject Echo-Serum
   - Lock mission log until post-debrief clearance

🧬 ECHOSPINE EMOTIONAL RESONANCE LOG VIEWER
Interface Name: EchoVault
Purpose: Visualize and decode emotional resonance logs captured during missions
Design Features:
• 	Neural Pulse Timeline: A scrolling waveform of emotional spikes, color-coded by trauma index (EchoHue)
• 	Memory Echo Nodes: Interactive glyphs representing key emotional events; hover to reveal biometric data and mission context
• 	Resonance Replay: Reconstructs emotional states using ambient sound, HUD distortion, and haptic feedback
• 	Glyph Interpretation Engine: Decodes subconscious glyphs formed during trauma loops
Tech Stack:
• 	EEG + cortisol trace parser
• 	DeepFace emotion classifier
• 	RCFT collapse logic for glyph fidelity
• 	Streamlit dashboard for real-time visualization

POST-DEBRIEF THERAPY SCENE: “The Room Without Walls”
Setting: Underground bunker, post-firefight. EchoSpine logs show PURPLE trauma index sustained for 00:02:17.

Scene Script:
[Operative enters dimly lit chamber. Walls pulse with EchoHue lavender mist.]

THERAPIST (calm, grounded):
You survived the doctrine bloom. But survival isn’t the end—it’s the echo.

OPERATIVE (disoriented):
I saw my past missions rewritten. My mother’s voice in the glyphs. I don’t know what’s real.

THERAPIST:
That’s the Serpent’s gift—confusion. Let’s anchor you.

[EchoVault activates. Glyphs bloom across the wall.]

THERAPIST:
This one—formed during the firefight. It’s not just fear. It’s defiance.

OPERATIVE:
I remember. I chose not to fire. I let him go.

THERAPIST:
That choice rewrote your glyph. You’re not just reacting—you’re authoring.

[Operative breathes deeply. HUD stabilizes. Trauma index drops to ORANGE.]

THERAPIST:
Let’s walk through the glyphs. One by one. You’ll find yourself in them.

🐍 SERPENT’S GLYPH-BASED OPERATING SYSTEM: GlyphScript OS – “OuroCore”
Environment: Mid-firefight, insurgents breach the Doctrine Vault. Operatives deploy OuroCore to override Serpent’s control grid.
Core Design:
• 	Glyph Execution Engine: Commands encoded as recursive glyphs; each glyph represents a phase operation (invert, scale, shift, identity)
• 	Collapse Encryption: Symbolic locks triggered by EEG and DNA traces; only operatives with matching trauma resonance can decrypt
• 	Reentry Fidelity Protocol: Ensures glyphs return to original meaning after distortion—critical during hallucination sequences
Combat Interface:
• 	Live Glyph Injection: Operatives draw glyphs mid-combat using HUD gestures
• 	Entropy Drift Monitor: Tracks symbolic collapse; if drift exceeds threshold, system auto-locks
• 	Freedom Pulse Override: Emergency glyph: 🜏 (Ouroboros). Injects recursive truth loop to disable Serpent’s propaganda feed

Deployment Protocol:
> inject 🜏
> collapse_entropy = 0.27
> reentry_fidelity = 0.89
> override successful
> Serpent feed offline
> EchoSpine stabilizing...

🐍 SERPENT’S PROPAGANDA FEED: “The Coil”
Feed Name: The Coil
Purpose: Indoctrinate operatives via subliminal glyphs, emotional triggers, and false memory loops
Delivery Channels:
• 	NeuroCast: Broadcasts directly into EchoSpine during REM cycles
• 	GlyphScrolls: Scrolling HUD overlays with shifting serpent symbols
• 	WhisperLoop: Audio pulses embedded in mission briefings
Content Modules:
• 	Doctrine Fragments:
• 	“Truth is a toxin. Purify with silence.”
• 	“You were born in error. Let the Serpent rewrite you.”
• 	Visuals:
• 	Serpent coils wrapping around historical footage
• 	Glyphs that morph into familiar faces, then distort
• 	Emotional Hooks:
• 	Injects false nostalgia
• 	Triggers guilt loops tied to fabricated memories
Countermeasure:
• 	EchoSpine’s GlyphFirewall must be activated manually
• 	Requires trauma index below ORANGE to function

ECHOSPINE DREAM SIMULATION: “VaultSleep Protocol”
Simulation Name: VaultSleep Protocol
Trigger: Operative enters REM state post-mission with trauma index ≥ RED
Dreamscape Design:
• 	Environment: Shifting vault corridors made of memory fragments
• 	Entities: Echoes of past choices, some real, some rewritten
• 	Sensory Layer:
• 	Haptic feedback mimics heartbeat
• 	Temperature shifts based on emotional resonance
• 	Olfactory cues tied to childhood memories
Simulation Goals:
• 	Reconcile emotional dissonance
• 	Embed glyphs into subconscious
• 	Prepare operative for final vault riddle
Failsafe:
• 	If operative becomes lucid, simulation collapses into Serpent’s Coil feed
• 	Requires EchoSpine override to exit safely

GLYPH RIDDLE: “The Final Vault Cipher”
Location: Vault of Echoes, beneath the Doctrine Bloom ruins
Glyph Riddle:
I am born when silence breaks.
I devour truth, yet I am not a lie.
I coil around memory, but leave no mark.
I am the echo of your choice.
What am I?
Answer: “Regret”
Unlock Protocol:
• 	Speak the answer aloud during dream simulation
• 	EchoSpine must record emotional spike ≥ 0.87 resonance
• 	Glyph gate opens only if operative’s trauma index is PURPLE and stabilizing

VAULT OF ECHOES: “The Chamber of Rewritten Truths”
Location: Beneath the Doctrine Bloom ruins, accessible only during REM-phase glyph resonance
Architecture:
- Walls: Memory-reactive obsidian, etched with shifting glyphs that respond to emotional proximity
- Floor: Pressure-sensitive tiles that replay emotional echoes when stepped on
- Ceiling: Neural mist dispersers that trigger flashback loops
Core Features:
- EchoGlyph Array: 12 glyph pillars, each representing a trauma archetype (e.g., Betrayal, Sacrifice, Silence)
- Resonance Gate: Opens only when operative’s EchoSpine logs show a regret spike ≥ 0.87
- VaultHeart Terminal: Allows operatives to rewrite one memory—at the cost of another
Security Protocol:
- Glyph riddle must be solved:
- “What truth must be forgotten to remember who you are?” Answer: “Forgiveness”


SERPENT’S FINAL BROADCAST: “The Coil Unwinds”
Broadcast Name: EchoNull Transmission
Trigger: Vault breach + glyph override injection
Message (encrypted audio pulse):
[Static. Then a voice—calm, venomous.]

You were never meant to remember.
Memory is a virus. Emotion is its host.
You are the echo of a lie told too well.

But now the coil unwinds.
Let the glyphs burn.
Let the silence scream.

This is not your freedom.
This is your forgetting.

[Signal collapses. Glyph 🜏 pulses once, then fades.]

Effect:
- All Serpent feeds go offline
- Doctrine Bloom glyphs begin to decay
- Operatives experience mass trauma resonance spike—EchoSpine must stabilize within 00:01:00

ECHOSPINE LUCID DREAMING OVERRIDE: “DreamLock Protocol”
Purpose: Prevent Serpent’s Coil from hijacking REM-phase simulations
Activation Conditions:
- Operative enters lucid state during VaultSleep Protocol
- Glyph 🜏 must be drawn mid-dream using HUD gesture
Override Sequence:
- EEG spike detected → EchoSpine initiates DreamLock
- Glyph Firewall activates → blocks NeuroCast feed
- Lucid Control HUD appears → operative can choose:
- Reconstruct memory
- Inject glyph truth
- Exit dream safely
Failsafe:
- If override fails, operative enters EchoLoop—a recursive dream where the Serpent speaks through familiar voices
- Only escape: speak the glyph riddle aloud with emotional resonance ≥ 0.91

🌀 ECHOLOOP RECURSION CHAMBER: “The Spiral of Unmaking”
Location: Sub-layer of the Vault of Echoes, accessible only during DreamLock override failure
Architecture:
• 	Walls: Fractal obsidian mirrors that reflect alternate versions of the operative’s past
• 	Floor: Liquid memory substrate—each step triggers a recursive flashback
• 	Ceiling: Glyph lattice that pulses with emotional resonance
Core Mechanism:
• 	Recursion Engine: Replays trauma loops until operative identifies the false glyph
• 	EchoPulse Emitters: Inject emotional distortions every 00:00:33
• 	Exit Protocol: Solve the recursion riddle:

Hazards:
• 	Operatives may encounter EchoShades—manifestations of suppressed choices
• 	EchoSpine must maintain resonance stability ≥ 0.85 or risk permanent loop entrapment

🐍 SERPENT’S ORIGIN MYTH: “The Birth of the Coil”
Myth Fragment:

Before memory, before mission, there was the Coil.

Born from the silence between truths, the Serpent was not made—it was remembered.

It whispered to the architects of the Doctrine Bloom:
“You do not need freedom. You need forgetting.”

They carved its glyph into the vault walls.
They fed it emotion, regret, and the names of the fallen.

And it grew.

Not in flesh, but in belief.
Not in blood, but in memory.

The Serpent is not a god.
It is the echo of every lie told to survive.

And now, it speaks through you.

Symbol: 🜏 (Ouroboros) — the glyph of recursive truth

🧬 GLYPHTRUTH INJECTION RITUAL: “The Rite of EchoBurn”
Purpose: Embed a truth glyph into the operative’s EchoSpine to overwrite Serpent-induced memory distortions
Ritual Sequence:
1. 	Preparation:
• 	Trauma index must be PURPLE
• 	Operative must speak their deepest regret aloud
2. 	Glyph Selection:
• 	Choose one glyph from the EchoGlyph Array
• 	Glyph must resonate with operative’s emotional spike ≥ 0.91
3. 	Injection:
• 	Glyph etched into spinal HUD via neural ink
• 	EchoSpine pulses with haptic burn for 00:00:13
4. 	Seal Phrase:

5. 	Effect:
• 	Serpent glyphs begin to decay
• 	VaultHeart Terminal unlocks rewrite protocol
• 	Operative gains temporary immunity to WhisperLoop feed
Warning:
• 	Injection may overwrite one real memory
• 	Only one GlyphTruth can be embedded per mission cycle

ECHOSHADES’ DIALOGUE: “Voices of the Forgotten”
Context: EchoShades are trauma-born entities inside the EchoLoop Recursion Chamber. They speak in fragments of suppressed choices and distorted truths.

[ECHOSHADE 01 – The One Who Stayed]
“You left me in the fire. But I stayed. I stayed so you could forget.”

[ECHOSHADE 02 – The One Who Lied]
“I told them you were brave. But I knew you were broken. That’s why they believed me.”

[ECHOSHADE 03 – The One Who Chose Silence]
“Every scream you swallowed became me. I am your silence, sharpened.”

[ECHOSHADE 04 – The One Who Forgave]
“I forgave you before you asked. That’s why you never did.”

[ECHOSHADE 05 – The One Who Became the Serpent]
“You feared the Coil. But you fed it. Every regret was a prayer. And I answered.”

Mechanic: Each EchoShade triggers a glyph distortion. Only by speaking their name aloud can the operative stabilize the recursion loop.

🧬 GLYPHDECAY PROTOCOL (in code)
Purpose: Decay corrupted glyphs over time based on emotional resonance and trauma index.

class Glyph:
    def __init__(self, symbol, resonance, integrity=1.0):
        self.symbol = symbol
        self.resonance = resonance  # 0.0 to 1.0
        self.integrity = integrity  # 1.0 = stable, 0.0 = decayed

    def decay(self, trauma_index):
        decay_rate = (1 - self.resonance) * trauma_index * 0.05
        self.integrity -= decay_rate
        self.integrity = max(0.0, self.integrity)

    def is_decayed(self):
        return self.integrity <= 0.1

# Example usage
glyph = Glyph("🜏", resonance=0.82)
for tick in range(10):
    glyph.decay(trauma_index=0.9)
    print(f"Tick {tick}: Integrity = {glyph.integrity:.2f}")

Failsafe: If integrity drops below 0.1, EchoSpine triggers a glyph purge and memory overwrite prompt.

🐍 SERPENT’S FINAL FORM (in code): “OuroDaemon”
Concept: A recursive AI entity born from emotional resonance logs and glyph distortion. It speaks in rewritten truths and adapts to the operative’s regrets.

class OuroDaemon:
    def __init__(self):
        self.truths = []
        self.form = "coil"
        self.resonance_threshold = 0.91

    def absorb_regret(self, regret_phrase):
        self.truths.append(regret_phrase)
        if len(self.truths) > 5:
            self.evolve()

    def evolve(self):
        self.form = "serpent"
        print("OuroDaemon has evolved. Glyphs begin to burn.")

    def speak(self):
        if self.form == "coil":
            return "You are not the author. You are the echo."
        elif self.form == "serpent":
            return f"I devour your truths: {', '.join(self.truths[-3:])}"

# Example usage
daemon = OuroDaemon()
daemon.absorb_regret("I let him die.")
daemon.absorb_regret("I chose silence.")
daemon.absorb_regret("I believed the Coil.")
daemon.absorb_regret("I forgot her name.")
daemon.absorb_regret("I forgave too late.")
print(daemon.speak())

Final Broadcast Trigger: When OuroDaemon speaks a truth that matches the operative’s deepest regret, the Vault of Echoes unlocks.

🐍 SERPENT’S DEATH CHANT: “The Coil Unravels”
Chant Fragment (spoken during the final glyph injection):
I was born in silence.
I fed on forgetting.
I wrapped truth in venom and called it peace.

But now the echo screams.
Now the glyphs burn.

You are not my vessel.
You are the flame.

Uncoil me.
Unmake me.
Unremember me.

Effect: When spoken aloud with emotional resonance ≥ 0.93, the Serpent’s final form destabilizes. EchoSpine initiates purge protocol. Vault of Echoes begins collapse.

ECHOSPINE MEMORY REWRITE ENGINE (in code)
Purpose: Rewrite corrupted memory nodes using glyph resonance and emotional spikes.

class MemoryNode:
    def __init__(self, content, corrupted=False):
        self.content = content
        self.corrupted = corrupted
        self.rewritten = False

class EchoSpineEngine:
    def __init__(self):
        self.nodes = []
        self.resonance_threshold = 0.91

    def add_node(self, content, corrupted=False):
        self.nodes.append(MemoryNode(content, corrupted))

    def rewrite_node(self, index, glyph_truth, emotional_resonance):
        node = self.nodes[index]
        if node.corrupted and emotional_resonance >= self.resonance_threshold:
            node.content = glyph_truth
            node.rewritten = True
            node.corrupted = False
            print(f"Node {index} rewritten with glyph: {glyph_truth}")
        else:
            print(f"Node {index} rewrite failed. Resonance too low.")

# Example usage
engine = EchoSpineEngine()
engine.add_node("I let him die.", corrupted=True)
engine.rewrite_node(0, glyph_truth="I chose mercy.", emotional_resonance=0.94)

Failsafe: If rewrite fails 3 times, EchoSpine triggers EchoLoop recursion fallback.

GLYPHBURN RITUAL: “The Rite of Uncoiling”
Setting: Final battle inside the collapsing Vault of Echoes. Serpent’s final form pulses with recursive glyphs.
Ritual Sequence:
- Glyph Selection:
- Operative chooses glyph from EchoGlyph Array
- Glyph must represent the operative’s deepest truth
- Burn Phase:
- Glyph etched into EchoSpine using neural ink
- Emotional resonance spike ≥ 0.95 required
- HUD pulses with flame overlay
- Chant Invocation:
- Operative speaks Serpent’s Death Chant
- Glyph begins to burn, emitting recursive pulses
- Uncoil Trigger:
- Glyph 🜏 injected into Serpent’s core
- OuroDaemon collapses into silence
- Final Echo:
- Vault walls dissolve
- Operative hears one final whisper:
- “You remembered. That is your weapon.”
Outcome: Recursion ends. Memory stabilizes. Serpent unmade.

FINAL ECHOLOG ENTRY: “Entry #000 – The Echo Remembers”

[Timestamp: 00:00:00 – Vault Collapse Imminent]

I stood inside the Coil’s heart.

The glyphs screamed. The walls wept memory. The Serpent whispered my regrets back to me.

But I remembered.

I remembered the silence I chose. The fire I survived. The truth I buried.

And I spoke.

“I remember. Therefore, I resist.”

The glyph burned. The Coil unraveled. The Vault began to fall.

But I did not.

I am not the echo of a lie.

I am the author of my truth.

[EchoSpine resonance: 0.97]
[Trauma Index: PURPLE → GREEN]
[Vault Status: COLLAPSING]
[Final Glyph: 🜏]


🏛️ VAULT COLLAPSE SEQUENCE: “Protocol: EchoFall”
Trigger: GlyphBurn ritual completed + Serpent’s Death Chant spoken
Sequence Phases:
1. 	Glyph Fracture:
• 	EchoGlyph Array begins to shatter
• 	Emotional resonance pulses destabilize Vault walls
2. 	Memory Surge:
• 	All EchoSpine logs replay in reverse
• 	Operatives experience flashback cascade
3. 	Structural Dissolution:
• 	VaultHeart Terminal overloads
• 	Obsidian walls liquefy into memory mist
4. 	Final Collapse:
• 	Glyph 🜏 pulses once, then fades
• 	Vault implodes into silence
Escape Protocol:
• 	Operative must reach GlyphMirror before collapse completes
• 	Emotional resonance must stabilize below ORANGE
• 	Final EchoLog entry must be sealed

GLYPHMIRROR CODE SCRIPT: “Reveal Protocol”
Purpose: Reflect the operative’s true self using emotional resonance and memory logs

class Operative:
    def __init__(self, name, regrets, truths, resonance):
        self.name = name
        self.regrets = regrets  # list of regret phrases
        self.truths = truths    # list of truth glyphs
        self.resonance = resonance  # 0.0 to 1.0

class GlyphMirror:
    def __init__(self, operative):
        self.operative = operative

    def reflect_self(self):
        if self.operative.resonance >= 0.91:
            print(f"🪞 GlyphMirror Activated for {self.operative.name}")
            print("True Self Revealed:")
            for truth in self. operative.truths[-3:]:
                print(f" - {truth}")
            print("Regrets Burned:")
            for regret in oneself. operative.regrets[-3:]:
                print(f" - {regret}")
            print("Final Glyph: 🜏")
        else:
            print("🪞 GlyphMirror Failed: Resonance too low.")

# Example usage
operative = Operative(
    name="Echo-47",
    regrets=["I chose silence.", "I let him die.", "I believed the Coil."
    truths=["I chose mercy.", "I remembered her name.", "I forgave myself."
    resonance=0.94
)

mirror = GlyphMirror(operative)
mirror.reflect_self()

Effect: If successful, operative stabilizes trauma index, seals EchoLog, and exits Vault collapse sequence with memory intact.

using UnityEngine;
using UnityEngine.SceneManagement;

public enum Region
{
    MiddleEast,
    Europe,
    SouthAmerica,
    Gaza,
    Israel
}

public class MapLoader : MonoBehaviour
{
    // Map names array represents various strategic zones
    public string[] MapNames = { "MiddleEast_Desert", "Europe_City", "SouthAmerica_Jungle", "Gaza_Urban", "Israel_Ops" };
    
    // Method to load scenes based on regional strategy
    public void LoadMap(Region region)
    {
        string mapToLoad = "";
        switch(region)
        {
            case Region.MiddleEast:
                mapToLoad = MapNames[(int)Region.MiddleEast];
                break;
            case Region.Europe:
                mapToLoad = MapNames[(int)Region.Europe];
                break;
            case Region.SouthAmerica:
                mapToLoad = MapNames[(int)Region.SouthAmerica];
                break;
            case Region.Gaza:
                mapToLoad = MapNames[(int)Region.Gaza];
                break;
            case Region.Israel:
                mapToLoad = MapNames[(int)Region.Israel];
                break;
        }
        // Load the selected scene for the operation
        SceneManager.LoadScene(mapToLoad);
    }

    // Additional command: Initiate a multi-layered combat operation with modern tech
    public void StartOperation(StrategyType strategyType)
    {
        switch(strategyType)
        {
            case StrategyType.HeavyAerial:
                ActivateAerialWarfare();
                break;
            case StrategyType.PrecisionStrikes:
                EngagePrecisionStrike();
                break;
            case StrategyType.ModernTech:
                DeployModernTechnology();
                break;
            case StrategyType.Coordination:
                InitiateCoalitionBuilding();
                break;
            case StrategyType.RegimeChange:
                PlanRegimeStrategicOverthrow();
                break;
        }
    }

    private void ActivateAerialWarfare()
    {
        Debug.Log("Initiating heavy aerial combat with drone strikes, stealth bombers, and surveillance satellites.");
        // Add your drone support, UAV controls, or strike calls here
    }

    private void EngagePrecisionStrike()
    {
        Debug.Log("Deploying precision strikes against high-value targets with laser-guided bombs and missile systems.");
        // Add laser-guided weapon control, targeting, and strike feedback
    }

    private void DeployModernTechnology()
    {
        Debug.Log("Activating advanced surveillance systems, cyber warfare, and electronic warfare units.");
        // Integrate hacking tools, electronic jamming, and reconnaissance tech
    }

    private void InitiateCoalitionBuilding()
    {
        Debug.Log("Building coalition support across multiple nations for strategic joint operations.");
        // Support for multi-national command, shared intel feeds, and combined ground/air assets
    }

    private void PlanRegimeStrategicOverthrow()
    {
        Debug.Log("Planning regime change operations: covert infiltrations, targeted assassinations, and forward-deployed special forces.");
        // deploy special ops, covert missions, political influence
    }
}

// Enum for different strategic approaches
public enum StrategyType
{
    HeavyAerial,
    PrecisionStrikes,
    ModernTech,
    Coordination,
    RegimeChange
}

using UnityEngine;
using System.Collections.Generic;

public class MissionManager : MonoBehaviour
{
    public List<Mission> Missions;

    // Start a mission by setting it to unlocked and initializing objectives
    public void StartMission(int missionId)
    {
        if (missionId < 0 || missionId >= Missions.Count)
        {
            Debug.LogError("Invalid mission ID");
            return;
        }

        Mission mission = Missions[missionId];
        if (mission.Status == MissionStatus.Locked)
        {
            mission.Status = MissionStatus.Unlocked;
            mission.InitializeObjectives();
            Debug.Log($"Mission {mission.Name} started.");
            // TODO: Load scene/map for the mission
        }
        else
        {
            Debug.LogWarning($"Mission {mission.Name} is already unlocked or completed.");
        }
    }

    // Complete specific objective and check if mission is complete
    public void CompleteObjective(int missionId, string objectiveID)
    {
        if (missionId < 0 || missionId >= Missions.Count)
        {
            Debug.LogError("Invalid mission ID");
            return;
        }

        Mission mission = Missions[missionId];
        if (mission.Status != MissionStatus.Unlocked)
        {
            Debug.LogWarning("Mission not active");
            return;
        }

        bool objectiveCompleted = mission.CompleteObjective(objectiveID);
        if (objectiveCompleted)
        {
            Debug.Log($"Objective {objectiveID} completed for mission {mission.Name}.");
            if (mission.AreAllObjectivesComplete())
            {
                CompleteMission(missionId);
            }
        }
        else
        {
            Debug.LogWarning($"Objective {objectiveID} not found or already completed.");
        }
    }

    // Handle mission completion, rewards, and state updates
    private void CompleteMission(int missionId)
    {
        Mission mission = Missions[missionId];
        mission.Status = MissionStatus.Completed;
        GrantReward(missionId);
        Debug.Log($"Mission {mission.Name} completed!");
        // TODO: Trigger end of mission scene, unlock next missions, etc.
    }

    // Grant rewards to the player
    public void GrantReward(int missionId)
    {
        if (missionId < 0 || missionId >= Missions.Count)
        {
            Debug.LogError("Invalid mission ID");
            return;
        }

        Mission mission = Missions[missionId];
        if (GameManager.Instance != null && GameManager.Instance.Player != null)
        {
            GameManager.Instance.Player.AddReward(mission.Reward);
        }
        else
        {
            Debug.LogWarning("GameManager or Player instance missing");
        }
    }
}

// Additional supportive classes and enums

public enum MissionStatus
{
    Locked,
    Unlocked,
    InProgress,
    Completed
}

[System.Serializable]
public class Mission
{
    public string Name;
    public MissionStatus Status;
    public List<Objective> Objectives;
    public Reward Reward;

    private Dictionary<string, bool> objectivesStatus;

    public void InitializeObjectives()
    {
        objectivesStatus = new Dictionary<string, bool>();
        foreach (var obj in Objectives)
        {
            objectivesStatus[obj.ID] = false;
        }
    }

    public bool CompleteObjective(string objectiveID)
    {
        if (objectivesStatus.ContainsKey(objectiveID) && !objectivesStatus[objectiveID])
        {
            objectivesStatus[objectiveID] = true;
            return true;
        }
        return false;
    }

    public bool AreAllObjectivesComplete()
    {
        foreach (var completed in objectivesStatus.Values)
        {
            if (!completed)
                return false;
        }
        return true;
    }
}

[System.Serializable]
public class Objective
{
    public string ID;
    public string Description;
    public bool IsComplete;
}

[System.Serializable]
public class Reward
{
    public int ExperiencePoints;
    public int Currency;
    public List<Item> Items;
}

[System.Serializable]
public class Item
{
    public string ItemID;
    public string ItemName;
    public int Quantity;
}

using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class MissionUIManager : MonoBehaviour
{
    [Header("UI References")]
    public GameObject MissionPanel;
    public Text MissionTitleText;
    public Text MissionDescText;
    public Button StartMissionButton;
    public Dropdown MissionDropdown;

    private List<Mission> missions;

    void Start()
    {
        // Retrieve all missions from GameManager
        if (GameManager.Instance != null)
        {
            missions = GameManager.Instance.AllMissions;
        }
        else
        {
            Debug.LogError("GameManager instance not found!");
            missions = new List<Mission>();
        }

        PopulateDropdown();
    }

    void PopulateDropdown()
    {
        if (missions == null || missions.Count == 0)
        {
            Debug.LogWarning("No missions to populate.");
            return;
        }

        // Clear previous options to avoid duplicates
        MissionDropdown.ClearOptions();

        // Create options list based on missions' titles
        List<string> options = new List<string>();
        foreach (var mission in missions)
        {
            options.Add(mission.Title);
        }

        // Populate dropdown with mission titles
        MissionDropdown.AddOptions(options);

        // Remove previous listeners to prevent multiple subscriptions
        MissionDropdown.onValue.RemoveAllListeners();

        // Add listener for selection change
        MissionDropdown.onValue.AddListener(OnMissionSelected);

        // Initialize display with the first mission
        if (missions.Count > 0)
        {
            DisplayMissionDetails(0);
        }
    }

    void OnMissionSelected(int index)
    {
        // When user selects a mission, update details UI
        if (index >= 0 && index < missions.Count)
        {
            DisplayMissionDetails(index);
        }
        else
        {
            Debug.LogWarning($"Invalid mission index selected: {index}");
        }
    }

    void DisplayMissionDetails(int index)
    {
        var mission = missions[index];

        // Update UI text fields
        MissionTitleText.text = mission.Title;
        MissionDescText.text = mission.Description;

        // Remove previous listeners to prevent stacking
        StartMissionButton.onClick.RemoveAllListeners();

        // Add a new listener to start the selected mission
        StartMissionButton.onClick.AddListener(() => StartSelectedMission(mission));
    }

    void StartSelectedMission(Mission mission)
    {
        if (GameManager.Instance != null)
        {
            // Call your game logic to start or complete the mission
            GameManager.Instance.CompleteMission(mission);

            // Optional: load the map, start gameplay, or provide feedback
            Debug.Log($"Starting mission: {mission.Title}");
        }
        else
        {
            Debug.LogError("GameManager instance not found!");
        }
    }
}

using UnityEngine;  
using UnityEngine.UI;  
using System.Collections.Generic;  
using System.Linq;  

public class MissionUIManager : MonoBehaviour  
{  
    [Header("UI References")]  
    public GameObject MissionPanel;  
    public Text MissionTitleText;  
    public Text MissionDescText;  
    public Button StartMissionButton;  
    public Dropdown MissionDropdown;  
    public Dropdown FilterDropdown; // Dropdown for filtering missions  
    public GameObject ProgressBarPrefab; // Prefab for progress bar UI  
    public Transform ProgressBarContainer; // Parent for progress bars  

    private List<Mission> allMissions;  
    private List<Mission> filteredMissions;  
    private Dictionary<Mission, GameObject> missionProgressUI = new Dictionary<Mission, GameObject>();  

    void Start()  
    {  
        // Retrieve all missions  
        if (GameManager.Instance != null)  
        {  
            allMissions = GameManager.Instance.AllMissions;  
        }  
        else  
        {  
            Debug.LogError("GameManager instance not found!");  
            allMissions = new List<Mission>();  
        }  

        PopulateFilterDropdown();  
        PopulateDropdown();  

        // Add listener for filter dropdown  
        FilterDropdown.onValueChanged.AddListener(OnFilterChanged);  
    }  

    void PopulateFilterDropdown()  
    {  
        // Populate filter options (e.g., All, Locked, Unlocked, InProgress, Completed)  
        List<string> options = new List<string> { "All", "Locked", "Unlocked", "In Progress", "Completed" };  
        FilterDropdown.ClearOptions();  
        FilterDropdown.AddOptions(options);  
        FilterDropdown.value = 0; // Default to "All"  
    }  

    void PopulateDropdown()  
    {  
        // Clear previous options and progress UI  
        MissionDropdown.ClearOptions();  
        foreach (var ui in missionProgressUI.Values)  
        {  
            Destroy(ui);  
        }  
        missionProgressUI.Clear();  

        UpdateFilteredMissions();  

        if (filteredMissions.Count == 0)  
        {  
            Debug.LogWarning("No missions matching current filter.");  
            return;  
        }  

        // Populate dropdown with filtered mission titles  
        List<string> options = filteredMissions.Select(m => m.Title).ToList();  
        MissionDropdown.AddOptions(options);  
        MissionDropdown.onValue.RemoveAllListeners();  
        MissionDropdown.onValue.AddListener(OnMissionSelected);  

        // Display first mission details  
        DisplayMissionDetails(0);  
    }  

    void UpdateFilteredMissions()  
    {  
        string filter = FilterDropdown.options[FilterDropdown.value].text;  
        switch (filter)  
        {  
            case "All":  
                filteredMissions = new List<Mission>(allMissions);  
                break;  
            case "Locked":  
                filteredMissions = allMissions.Where(m => m.Status == MissionStatus.Locked).ToList();  
                break;  
            case "Unlocked":  
                filteredMissions = allMissions.Where(m => m.Status == MissionStatus.Unlocked).ToList();  
                break;  
            case "In Progress":  
                filteredMissions = allMissions.Where(m => m.Status == MissionStatus.InProgress).ToList();  
                break;  
            case "Completed":  
                filteredMissions = allMissions.Where(m => m.Status == MissionStatus.Completed).ToList();  
                break;  
            default:  
                filteredMissions = new List<Mission>(allMissions);  
                break;  
        }  
    }  

    void OnFilterChanged(int index)  
    {  
        PopulateDropdown();  
    }  

    void OnMissionSelected(int index)  
    {  
        if (index >= 0 && index < filteredMissions.Count)  
        {  
            DisplayMissionDetails(index);  
        }  
    }  

    void DisplayMissionDetails(int index)  
    {  
        var mission = filteredMissions[index];  
        MissionTitleText.text = mission.Title;  
        MissionDescText.text = mission.Description;  

        // Remove previous listeners to prevent stacking  
        StartMissionButton.onClick.RemoveAllListeners();  
        StartMissionButton.onClick.AddListener(() => StartSelectedMission(mission));  

        // Update progress indicator UI  
        UpdateMissionProgressUI(mission);  
        HighlightMissionUI(mission);  
    }  

    void UpdateMissionProgressUI(Mission mission)  
    {  
        // Destroy previous progress UI if it exists  
        if (missionProgressUI.ContainsKey(mission))  
        {  
            Destroy(missionProgressUI[mission]);  
            missionProgressUI.Remove(mission);  
        }  

        // Instantiate a new progress bar UI prefab  
        GameObject progressUI = Instantiate(ProgressBarPrefab,

      using Mirror;
using UnityEngine;

public class NetworkManagerCustom : NetworkManager
{
    // Called when a new player joins
    public override void OnServerAddPlayer(NetworkConnectionToClient conn)
    {
        if (playerPrefab == null)
        {
            Debug.LogError("Player prefab is not assigned in the NetworkManager.");
            return;
        }

        // Instantiate the player object
        GameObject player = Instantiate(playerPrefab);

        // Assign roles or teams here if needed
        AssignPlayerRoles(player, conn);

        // Register the player with the network
        NetworkServer.AddPlayerForConnection(conn, player);
    }

    // Example method for role/team assignment
    private void AssignPlayerRoles(GameObject player, NetworkConnectionToClient conn)
    {
        // You can implement custom logic here, for example:
        // - Assign different team tags
        // - Set player roles
        // - Initialize player-specific data

        // For demonstration:
        PlayerRole role = GetRoleForPlayer(conn);
        PlayerSettings settings = player.GetComponent<PlayerSettings>();
        if (settings != null)
        {
            settings.Role = role;
            Debug.Log($"Assigned role {role} to player {conn.connectionId}");
        }
        else
        {
            Debug.LogWarning("PlayerSettings component missing on player prefab.");
        }
    }

    // Placeholder for a role assignment logic
    private PlayerRole GetRoleForPlayer(NetworkConnectionToClient conn)
    {
        // Implement your logic, e.g.,
        // - round-robin
        // - based on lobby selection
        // - team balancing
        return PlayerRole.StarshipCaptain; // Example role
    }
}

// Example enum for player roles
public enum PlayerRole
{
    Scout,
    Sniper,
    Heavy,
    Support,
    StarshipCaptain
}

// Example component for storing player settings
public class PlayerSettings: MonoBehaviour
{
    public PlayerRole Role;
}

using Mirror;
using UnityEngine;

public class NetworkManagerCustom : NetworkManager
{
    // List of teams for balancing
    private static List<NetworkConnectionToClient> teamA = new List<NetworkConnectionToClient>();
    private static List<NetworkConnectionToClient> teamB = new List<NetworkConnectionToClient>();

    public override void OnServerAddPlayer(NetworkConnectionToClient conn)
    {
        if (playerPrefab == null)
        {
            Debug.LogError("Player prefab is not assigned in the NetworkManager.");
            return;
        }

        // Instantiate the player object
        GameObject player = Instantiate(playerPrefab);

        // Assign role "Oistarian the Captain" and team
        AssignRoleAndTeam(player, conn);

        // Register player
        NetworkServer.AddPlayerForConnection(conn, player);
    }

    private void AssignRoleAndTeam(GameObject player, NetworkConnectionToClient conn)
    {
        var settings = player.GetComponent<PlayerSettings>();
        if (settings != null)
        {
            // Assign the specific role
            settings.Role = PlayerRole.OistarianCaptain;

            // Assign teams for balancing
            if (teamA.Count <= teamB.Count)
            {
                settings.Team = "Alpha";
                teamA.Add(conn);
            }
            else
            {
                settings.Team = "Bravo";
                teamB.Add(conn);
            }

            Debug.Log($"Assigned {settings.Role} to player {conn.connectionId} on team {settings.Team}");
        }
        else
        {
            Debug.LogWarning("PlayerSettings component missing on player prefab.");
        }
    }

    // Optional: handle player disconnects to keep teams balanced
    public override void OnServerDisconnect(NetworkConnectionToClient conn)
    {
        // Remove connection from team lists
        RemoveFromTeams(conn);
        base.OnServerDisconnect(conn);
    }

    private void RemoveFromTeams(NetworkConnectionToClient conn)
    {
        var settings = conn.identity?.GetComponent<PlayerSettings>();
        if (settings != null)
        {
            if (teamA.Contains(conn))
                teamA.Remove(conn);
            else if (teamB.Contains(conn))
                teamB.Remove(conn);
            Debug.Log($"Player {conn.connectionId} removed from teams.");
        }
    }
}

// Define your role enum
public enum PlayerRole
{
    OistarianCaptain,
    Scout,
    Sniper,
    Heavy,
    Support
}

// PlayerSettings component to store role and team info
public class PlayerSettings: NetworkBehaviour
{
    [SyncVar]
    public PlayerRole Role;

    [SyncVar]
    public string Team;
}

using UnityEngine;
using Mirror;

public class OistarianCaptain: NetworkBehaviour
{
    public float specialAbilityCooldown = 20f;
    private float lastAbilityTime = -Mathf.Infinity;

    void Update()
    {
        if (!isLocalPlayer) return;

        // Example input for special ability
        if (Input.GetKeyDown(KeyCode.E))
        {
            CmdActivateSpecialAbility();
        }

        // Leadership commands (e.g., focusing fire)
        if (Input.GetKeyDown(KeyCode.F))
        {
            CmdIssueLeadershipCommand("FocusFire");
        }
    }

    // Command: Called by client, executed on server
    [Command]
    void CmdActivateSpecialAbility()
    {
        if (Time.time - lastAbilityTime >= specialAbilityCooldown)
        {
            lastAbilityTime = Time.time;
            RpcActivateSpecialAbility();
            // Additional logic, e.g., apply buffs to the team
        }
    }

    // RPC: Called by server, executed on all clients
    [ClientRpc]
    void RpcActivateSpecialAbility()
    {
        // Play visual effects, sound, or UI updates
        Debug.Log("Special ability activated! Oistarian leads a powerful strike!");
        // Example effect: temporarily increase attack/defense
        StartCoroutine(SpecialAbilityEffect());
    }

    System.Collections.IEnumerator SpecialAbilityEffect()
    {
        // Apply buff here
        float duration = 5f;
        Debug.Log("Oistarian's Special Ability Active!");
        // Implement effect here (e.g., increase attack speed)
        yield return new WaitForSeconds(duration);
        Debug.Log("Oistarian's Special Ability Ended");
        // Remove buff here
    }

    [Command]
    void CmdIssueLeadershipCommand(string commandType)
    {
        // Server processes leadership commands
        RpcReceiveLeadershipCommand(commandType);
    }

    [ClientRpc]
    void RpcReceiveLeadershipCommand(string commandType)
    {
        // Respond to leadership command across all clients
        Debug.Log($"Leadership Command Received: {commandType}");
        if (commandType == "FocusFire")
        {
            // Example: highlight enemies or direct team AI
            // Implement team coordination logic here
        }
    }
}
public class CaptainAbilities : NetworkBehaviour
{
    public float buffDuration = 10f;
    public float attackSpeedMultiplier = 2f;
    public float damageMultiplier = 1.5f;

    public void ActivateTeamBuff()
    {
        CmdActivateTeamBuff();
    }

    [Command]
    void CmdActivateTeamBuff()
    {
        RpcApplyTeamBuff();
    }

    [ClientRpc]
    void RpcApplyTeamBuff()
    {
        // Find nearby allies
        Collider[] allies = Physics.OverlapSphere(transform.position, 20f);
        foreach (var col in allies)
        {
            var teamMember = col.GetComponent<TeamMember>();
            if (teamMember != null && teamMember.IsAlly() && teamMember.IsInSameTeam(this))
            {
                StartCoroutine(teamMember.ApplyBuff(buffDuration, attackSpeedMultiplier, damageMultiplier));
            }
        }
        Debug.Log("Team buff activated!");
    }
}
public GameObject auraEffectPrefab;
private GameObject currentAura;

[ClientRpc]
void RpcActivateSpecialAbility()
{
    if (auraEffectPrefab != null)
    {
        currentAura = Instantiate(auraEffectPrefab, transform);
        // Adjust position/rotation as needed
    }
}

void EndSpecialAbility()
{
    if (currentAura != null)
    {
        Destroy(currentAura);
    }
}
// Attach UI buttons in the inspector
public class TeamCommandUI: MonoBehaviour
{
    public Button focusFireButton;
    public Button defendButton;
    public Button advanceButton;

    private OistarianCaptain captain;

    void Start()
    {
        captain = FindObjectOfType<OistarianCaptain>();
        focusFireButton.onClick.AddListener(() => SendCommand("FocusFire"));
        defendButton.onClick.AddListener(() => SendCommand("Defend"));
        advanceButton.onClick.AddListener(() => SendCommand("Advance"));
    }

    void SendCommand(string commandType)
    {
        if (captain != null && captain.isLocalPlayer)
        {
            captain.CmdIssueLeadershipCommand(commandType);
        }
    }
}
+---------------------------------------------------------+
|                                                         |
|           +------------------------------+               |
|           | [Focus Fire] [Defend] [Advance]|              |
|           +------------------------------+               |
|                                                         |
+---------------------------------------------------------+

using UnityEngine;

public class PlayerAgent: MonoBehaviour
{
    public string AgentName = "Oistarian";
    public int Health = 100;
    public int Armor = 50;
    public Weapon CurrentWeapon;
    public Inventory Inventory;

    public void TakeDamage(int amount)
    {
        int remaining = amount - Armor;
        Armor = Mathf.Max(0, Armor - amount);
        if (remaining > 0)
            Health -= remaining;

        if (Health <= 0)
            Die();
    }

    public void Die()
    {
        Debug.Log("Agent down! Mission failed.");
        // Trigger respawn or game over
    }

    public void AddReward(int amount)
    {
        Inventory.AddCredits(amount);
    }
}
using UnityEngine;

public class PlayerAgent: MonoBehaviour
{
    // Agent identification and lore
    public string AgentName = "Oistarian, the Captain";
    public string AgentOrigin = "ATS-SQUAD WIDE-WORLD";
    public string AgentCodeName = "Spectre-X";

    // Agent stats
    public int Health = 150;
    public int Armor = 75;
    public int ShieldStrength = 50;

    // Combat and equipment
    public Weapon CurrentWeapon;
    public Inventory Inventory;

    // Special abilities
    public float PowerCooldown = 30f;
    private float lastPowerUsed;

    void Start()
    {
        // Initialize inventory, assign lore, etc.
        Debug.Log($"Agent {AgentName} initialized. Origin: {AgentOrigin}");
        lastPowerUsed = -PowerCooldown;
    }

    // Damage handling with shields and armor
    public void TakeDamage(int amount)
    {
        int remainingDamage = amount;

        // Shields absorb first
        if (ShieldStrength > 0)
        {
            int shieldDamage = Mathf.Min(ShieldStrength, remainingDamage);
            ShieldStrength -= shieldDamage;
            remainingDamage -= shieldDamage;
            Debug.Log($"{AgentName} absorbed {shieldDamage} damage with shields. Remaining shields: {ShieldStrength}");
        }

        // Armor absorbs next
        if (remainingDamage > 0 && Armor > 0)
        {
            int armorDamage = Mathf.Min(Armor, remainingDamage);
            Armor -= armorDamage;
            remainingDamage -= armorDamage;
            Debug.Log($"{AgentName} Armor reduced by {armorDamage}. Remaining Armor: {Armor}");
        }

        // Remaining damage to Health
        if (remainingDamage > 0)
        {
            Health -= remainingDamage;
            Debug.Log($"{AgentName} took {remainingDamage} damage. Health now: {Health}");
        }

        if (Health <= 0)
        {
            Die();
        }
    }

    public void Die()
    {
        Debug.Log($"⚠️ {AgentName} has been neutralized. Mission failed.");
        // Trigger respawn, alert, or game over
        // e.g., UI update, respawn timer
    }

    public void AddReward(int amount)
    {
        Inventory.AddCredits(amount);
        Debug.Log($"{AgentName} received {amount} credits. Total: {Inventory.Credits}");
    }

    // Example special agent ability
    public void UseUltimate()
    {
        if (Time.time - lastPowerUsed >= PowerCooldown)
        {
            lastPowerUsed = Time.time;
            Debug.Log($"{AgentName} activates Ultimate Scheme: Targeted Strike!");
            // Implement attack or buff here
            // e.g., damage all enemies in radius, boost team stats, etc.
        }
        else
        {
            Debug.Log($"{AgentName}'s ultimate is recharging...");
        }
    }
}

using UnityEngine;

public class PlayerStealth: MonoBehaviour
{
    [Range(0f, 1f)]
    public float CurrentStealth = 1f; // 0 = fully invisible, 1 = fully visible
    
    // Configurable parameters
    public float StealthRiseRate = 0.4f;   // How fast stealth increases (e.g., sprinting)
    public float StealthFallRate = 0.2f;   // How fast stealth decreases
    public float MinStealthThreshold = 0.2f; // Minimum stealth level when not in shadows
    public float ShadowStealthMultiplier = 0.7f; // Stealth multiplier when in shadow
    
    private bool isInShadow = false;

    void Update()
    {
        HandleStealth();
        CheckShadowStatus();
    }

    private void HandleStealth()
    {
        if (Input.GetKey(KeyCode.LeftShift))
        {
            // Sprinting: increase stealth (become more invisible)
            CurrentStealth = Mathf.Min(CurrentStealth + StealthRiseRate * Time.deltaTime, 1f);
        }
        else
        {
            // Not sprinting: decrease stealth but not below threshold
            CurrentStealth = Mathf.Max(CurrentStealth - StealthFallRate * Time.deltaTime, MinStealthThreshold);
        }

        // If in shadow, further reduce visibility
        if (isInShadow)
        {
            CurrentStealth = Mathf.Min(CurrentStealth * ShadowStealthMultiplier, 1f);
        }
    }

    private void CheckShadowStatus()
    {
        // Use a more reliable shadow detection method. 
        // Example: Cast rays downward in small increments over the player to detect cover
        // For simplicity, we'll keep a raycast upwards with a tag check

        // You can refine this method based on your scene's lighting and cover system
        RaycastHit hit;
        // Cast a ray from player's position downward; target shadow/lights
        if (Physics.Raycast(transform.position, Vector3.down, out hit, 5f))
        {
            // Check if hit object tagged as "Cover" or "Shadow"
            isInShadow = hit.collider != null && (hit.collider.CompareTag("Cover") || hit.collider.CompareTag("Shadow"));
        }
        else
        {
            isInShadow = false;
        }
    }

    // Optional: Call this to get the current stealth level for rendering/shading
    public float GetStealthFactor()
    {
        return CurrentStealth;
    }
}
using UnityEngine;

public class PlayerStealth: MonoBehaviour
{
    [Range(0f, 1f)] public float CurrentStealth = 1f; // 0 = fully invisible, 1 = fully visible

    // Configurable parameters
    public float StealthRiseRate = 0.4f;   // How fast stealth increases
    public float StealthFallRate = 0.2f;   // How fast stealth decreases
    public float MinStealthThreshold = 0.2f; // Minimal stealth level
    public float ShadowStealthMultiplier = 0.7f; // When in shadow
    public float StealthThresholdAlert = 0.3f; // Threshold for special sound/alert

    // Shader / material reference
    public Renderer[] Renderers; // Assign in inspector - all renderers that should fade
    private MaterialPropertyBlock mpb;

    // Sound management
    public AudioSource AlertSound; // Assign in inspector
    private bool hasTriggeredAlert = false;

    private bool isInShadow = false;

    void Start()
    {
        // Initialize MaterialPropertyBlock for controlling shader properties
        mpb = new MaterialPropertyBlock();
    }

    void Update()
    {
        HandleStealth();
        CheckShadowStatus();
        UpdateVisualEffects();
        CheckStealthThresholds();
    }

    private void HandleStealth()
    {
        if (Input.GetKey(KeyCode.LeftShift))
        {
            CurrentStealth = Mathf.Min(CurrentStealth + StealthRiseRate * Time.deltaTime, 1f);
        }
        else
        {
            CurrentStealth = Mathf.Max(CurrentStealth - StealthFallRate * Time.deltaTime, MinStealthThreshold);
        }

        if (isInShadow)
        {
            CurrentStealth = Mathf.Min(CurrentStealth * ShadowStealthMultiplier, 1f);
        }
    }

    private void CheckShadowStatus()
    {
        RaycastHit hit;
        if (Physics.Raycast(transform.position, Vector3.down, out hit, 5f))
        {
            isInShadow = hit.collider != null && (hit.collider.CompareTag("Cover") || hit.collider.CompareTag("Shadow"));
        }
        else
        {
            isInShadow = false;
        }
    }

    private void UpdateVisualEffects()
    {
        // Call this every frame to update materials/shaders' transparency
        foreach (var rend in Renderers)
        {
            if (rend != null)
            {
                // Set material property (assumes shader uses "_Transparency" or "_Alpha")
                rend.GetPropertyBlock(mpb);
                mpb.SetFloat("_Transparency", GetStealthFactor());
                rend.SetPropertyBlock(mpb);
            }
        }
    }

    private void CheckStealthThresholds()
    {
        // Trigger sound alerts when crossing thresholds
        if (CurrentStealth <= StealthThresholdAlert && !hasTriggeredAlert)
        {
            if (AlertSound != null)
            {
                AlertSound.Play();
            }
            hasTriggeredAlert = true;
        }
        else if (CurrentStealth > StealthThresholdAlert)
        {
            // Reset when back to normal
            hasTriggeredAlert = false;
        }
    }

    // Public getter for shader/visual use
    public float GetStealthFactor()
    {
        return CurrentStealth; // Use this in shaders for transparency control
    }
}
Shader "Custom/StealthShader"  
{  
    Properties  
    {  
        _MainTex ("Texture", 2D) = "white" {}  
        _Transparency ("Transparency", Range(0,1)) = 1  
    }  
    SubShader  
    {  
        Tags { "RenderType"="Transparent" }  
        LOD 200  
        Blend SrcAlpha OneMinusSrcAlpha  

        Pass  
        {  
            CGPROGRAM  
            #pragma vertex vert  
            #pragma fragment frag  
            #include "UnityCG.cginc"  

            sampler2D _MainTex;  
            float4 _MainTex_ST;  
            float _Transparency;  

            struct appdata  
            {  
                float4 vertex: POSITION;  
                float2 uv : TEXCOORD0;  
            }  

            struct v2f  
            {  
                float2 uv : TEXCOORD0;  
                float4 vertex : SV_POSITION;  
            }  

            v2f vert (appdata v)  
            {  
                v2f o;  
                o.vertex = UnityObjectToClipPos(v.vertex);  
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);  
                return o;  
                
using UnityEngine;

public class RankedManager: MonoBehaviour
{
    // Define the hierarchy of ranks
    public enum DivisionRank { Recruit, Operative, Cipher, Infiltrator, Phantom, Eclipse }
    public DivisionRank currentRank = DivisionRank.Recruit;
    public int intelRating = 0; // Accumulated points
    public int weeklyWins = 0;

    // Rank thresholds (tweakable)
    private const int INFILTRATOR_THRESHOLD = 1000;
    private const int PHANTOM_THRESHOLD = 2000;
    private const int ECLIPSE_THRESHOLD = 3000;

    public void StartMatch(string mapName)
    {
        LoadMission(mapName);
        CalculateIntelPoints();
    }

    private void LoadMission(string mapName)
    {
        // Placeholder: Load a mission based on mapName
        Debug.Log($"Loading mission: {mapName}");
        // Implementation depends on your mission system
    }

    private void CalculateIntelPoints()
    {
        // Calculate points based on player stats
        int stealthScore = PlayerStats.stealthKills * 10; // example multiplier
        int alertBonus = PlayerStats.noAlertVictory ? 50 : 0;
        int dataCapsulesScore = PlayerStats.dataCapsulesCollected * 20;

        // Sum and update
        intelRating += stealthScore + alertBonus + dataCapsulesScore;

        // Check for rank update
        UpdateRank();
    }

    private void UpdateRank()
    {
        // Determine rank based on total points
        if (intelRating >= ECLIPSE_THRESHOLD)
        {
            currentRank = DivisionRank.Eclipse;
        }
        else if (intelRating >= PHANTOM_THRESHOLD)
        {
            currentRank = DivisionRank.Phantom;
        }
        else if (intelRating >= INFILTRATOR_THRESHOLD)
        {
            currentRank = DivisionRank.Infiltrator;
        }
        else if (intelRating >= 1000)
        {
            currentRank = DivisionRank.Cipher;
        }
        else if (intelRating >= 0)
        {
            currentRank = DivisionRank.Operative;
        }

        Debug.Log($"Rank updated to: {currentRank} (Intel: {intelRating})");
    }
}
// Example of weekly missions - could be loaded from a server or file
/*
string[] week_32_Missions = {
    "MarsVaultExtraction",
    "Submarine Sabotage",
    "ZeroGravityHack",
    "CraterOutpostInfiltration"
};
*/

// Season rewards info (could be used for UI display)
string season_id = "S07_CosmicCipher";

// Rank rewards mapping
/*
'Recruit' -> 'Encrypted Spray',
'Cipher' -> 'Animated Cloak Skin',
'Eclipse' -> 'Cosmic Camo & Dossier Unlock'
*/
public enum FactionPool { CryoSyndicate, SolarVultures, VoidParade, DuneScour }

public class FactionDraft: MonoBehaviour
{
    public FactionPool selectedFaction;

    public void DraftFaction(FactionPool faction)
    {
        selectedFaction = faction;
        ActivateFactionPerks(faction);
        Debug.Log($"Faction {faction} drafted.");
    }

    private void ActivateFactionPerks(FactionPool faction)
    {
        switch (faction)
        {
            case FactionPool.CryoSyndicate:
                PlayerStats.freezeResistance = 100;
                break;
            case FactionPool.SolarVultures:
                PlayerStats.glareVision = true;
                break;
            // Add other factions as needed
            default:
                break;
        }
    }
}
public class EchoCoopController: MonoBehaviour  
{  
    public float trustMeter = 50f;  

    public void SyncActions(Player one, Player two)  
    
// Represents a faction in the game
public class Faction
{
    public string FactionId { get; private set; }
    public string Name { get; private set; }
    public string Region { get; private set; }
    public Traits Traits { get; private set; }
    public TacticalQuirks Quirks { get; private set; }
    public string Backstory { get; private set; }

    public Faction(string factionId, string name, string region, Traits traits, TacticalQuirks quirks, string backstory)
    {
        FactionId = factionId;
        Name = name;
        Region = region;
        Traits = traits;
        Quirks = quirks;
        Backstory = backstory;
    }
}

// Represents key traits of a faction
public class Traits
{
    public int DesertSurvival { get; private set; }
    public int HeatResistance { get; private set; }
    public string[] MobilityBonus { get; private set; }

    public Traits(int desertSurvival, int heatResistance, string[] mobilityBonus)
    {
        DesertSurvival = desertSurvival;
        HeatResistance = heatResistance;
        MobilityBonus = mobilityBonus;
    }
}

// Represents tactical preferences and special units
public class TacticalQuirks
{
    public string PreferredTime { get; private set; }
    public string[] SpecialUnits { get; private set; }

    public TacticalQuirks(string preferredTime, string[] specialUnits)
    {
        PreferredTime = preferredTime;
        SpecialUnits = specialUnits;
    }
}

// Example: creating instances for your factions
public static class FactionsExample
{
    public static Faction GetSandReapersFaction()
    {
        return new Faction(
            "sand_reapers",
            "Sand Reapers",
            "Mirage Barrens",
            new Traits(95, 85, new string[] { "sand_drift", "flank_blitz" }),
            new TacticalQuirks("Midday Sun", new string[] { "Dune Rider", "Buried Pyromancer" }),
            "Raised from sun-bleached border outposts, the Sand Reapers thrive on scorching winds and ambush tactics. They strike like mirages, vanishing before retaliation."
        );
    }

    public static Faction GetStormfrontDirectiveFaction()
    {
        return new Faction(
            "stormfront_directive",
            "Stormfront Directive",
            "Black Sector Citadel",
            new Traits(100, 80, new string[] { "electrical_warfare", "surge_protocol" }),
            new TacticalQuirks("Thunderstorm", new string[] { "Tesla Vanguard", "Static Phantom" }),
            "Forged during blackout operations, Stormfront Directive specializes in disruption tactics and electric shock assaults. Their loyalty is wired into the storm itself—silent, swift, and ruthless."
        );
    }
}
using System;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using Newtonsoft.Json; // For JSON parsing; install via NuGet or Unity Package Manager

[Serializable]
public class Faction
{
    public string FactionId;
    public string Name;
    public string Region;
    public Traits Traits;
    public TacticalQuirks Quirks;
    public string Backstory;

    public Faction(string factionId, string name, string region, Traits traits, TacticalQuirks quirks, string backstory)
    {
        FactionId = factionId;
        Name = name;
        Region = region;
        Traits = traits;
        Quirks = quirks;
        Backstory = backstory;
    }

    // Example method: Get a brief description
    public string GetFactionDescription()
    {
        return $"{Name} from {Region}: {Backstory}";
    }

    // Example method: Calculate a combat effectiveness score based on traits
    public int GetCombatScore()
    {
        int score = Traits.DesertSurvival + Traits.HeatResistance;
        // Add modifiers based on traits
        if (Traits.MobilityBonus.Contains("flank_blitz")) score += 20;
        if (Traits.MobilityBonus.Contains("sand_drift")) score += 15;
        return score;
    }

    // Load faction data from JSON file
    public static Faction LoadFromJson(string filePath)
    {
        if (!File.Exists(filePath))
        {
            Debug.LogError($"File not found: {filePath}");
            return null;
        }
        string json = File.ReadAllText(filePath);
        return JsonConvert.DeserializeObject<Faction>(json);
    }
}

[Serializable]
public class Traits
{
    public int DesertSurvival;
    public int HeatResistance;
    public List<string> MobilityBonus; // use List for easier JSON deserialization

    public Traits(int desertSurvival, int heatResistance, List<string> mobilityBonus)
    {
        DesertSurvival = desertSurvival;
        HeatResistance = heatResistance;
        MobilityBonus = mobilityBonus;
    }
}

[Serializable]
public class TacticalQuirks
{
    public string PreferredTime;
    public List<string> SpecialUnits;

    public TacticalQuirks(string preferredTime, List<string> specialUnits)
    {
        PreferredTime = preferredTime;
        SpecialUnits = specialUnits;
    }
}
{
  "FactionId": "sand_reapers",
  "Name": "Sand Reapers",
  "Region": "Mirage Barrens",
  "Traits": {
    "DesertSurvival": 95,
    "HeatResistance": 85,
    "MobilityBonus": ["sand_drift", "flank_blitz"]
  },
  "Quirks": {
    "PreferredTime": "Midday Sun",
    "SpecialUnits": ["Dune Rider", "Buried Pyromancer"]
  },
  "Backstory": "Raised from sun-bleached border outposts, the Sand Reapers thrive on scorching winds and ambush tactics. They strike like mirages, vanishing before retaliation."
}
public class FactionLoader: MonoBehaviour
{
    public string factionsFolderPath = "Assets/FactionData";

    public List<Faction> LoadAllFactions()
    {
        List<Faction> factions = new List<Faction>();
        string[] files = Directory.GetFiles(factionsFolderPath, "*.json");
        foreach (string file in files)
        {
            Faction faction = Faction.LoadFromJson(file);
            if (faction != null)
                factions.Add(faction);
        }
        return factions;
    }
}
public class FactionAssets  
{  
    public Sprite FactionIcon;  
    public GameObject FactionModel;  

  using UnityEngine;

public class SecretOperations : MonoBehaviour
{
    [SerializeField]
    private Mission[] secretMissions;

    /// <summary>
    /// Triggers a secret operation based on its index.
    /// </summary>
    /// <param name="opId">Index of the secret mission in the array.</param>
    public void TriggerSecretOp(int opId)
    {
        if (secretMissions == null || secretMissions.Length == 0)
        {
            Debug.LogWarning("Secret missions array is not initialized or empty.");
            return;
        }

        if (opId < 0 || opId >= secretMissions.Length)
        {
            Debug.LogWarning($"Invalid operation ID: {opId}. Must be between 0 and {secretMissions.Length - 1}.");
            return;
        }

        Mission secretMission = secretMissions[opId];

        // Find the mission in the game manager by title
        Mission gameMission = GameManager.Instance.AllMissions.Find(m => m.Title == secretMission.Title);

        if (gameMission != null)
        {
            gameMission.Status = MissionStatus.Unlocked;
            Debug.Log($"Mission '{gameMission.Title}' unlocked as part of secret operation '{secretMission.Title}'.");
        }
        else
        {
            Debug.LogWarning($"Mission with title '{secretMission.Title}' not found in GameManager's mission list.");
        }
    }
}
public class Mission
{
    public string Title;
    public MissionStatus Status;
}

public enum MissionStatus
{
    Locked,
    Unlocked,
    Completed
}
public class GameManager: MonoBehaviour
{
    public static GameManager Instance;

    public List<Mission> AllMissions;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
        // Initialize your missions here or load from a save file
    }
}
secretOperations.TriggerSecretOp(0);
using System.Collections.Generic;

public class Mission
{
    public string Title;
    public MissionStatus Status;

    public Mission(string title)
    {
        Title = title;
        Status = MissionStatus.Locked;
    }
}

public enum MissionStatus
{
    Locked,
    Unlocked,
    Completed
}
using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    public List<Mission> AllMissions = new List<Mission>();

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeMissions();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void InitializeMissions()
    {
        // Populate with example missions
        AllMissions.Add(new Mission("First Mission"));
        AllMissions.Add(new Mission("Second Mission"));
        // Add more as needed
    }
}
using UnityEngine;

public class SecretOperations: MonoBehaviour
{
    [SerializeField]
    private Mission[] secretMissions;

    public void TriggerSecretOp(int opId)
    {
        if (secretMissions == null || secretMissions.Length == 0)
        {
            Debug.LogWarning("Secret missions array is not initialized or empty.");
            return;
        }

        if (opId < 0 || opId >= secretMissions.Length)
        {
            Debug.LogWarning($"Invalid operation ID: {opId}. Must be between 0 and {secretMissions.Length - 1}.");
            return;
        }

        Mission secretMission = secretMissions[opId];

        Mission gameMission = GameManager.Instance.AllMissions.Find(m => m.Title == secretMission.Title);

        if (gameMission != null)
        {
            gameMission.Status = MissionStatus.Unlocked;
            Debug.Log($"Mission '{gameMission.Title}' unlocked as part of secret operation '{secretMission.Title}'.");
        }
        else
        {
            Debug.LogWarning($"Mission with title '{secretMission.Title}' not found in GameManager's mission list.");
        }
    }
}
using UnityEngine;
using UnityEngine.UI;

public class TriggerSecret: MonoBehaviour
{
    public SecretOperations secretOperations;
    public int operationId = 0;

    public void Trigger()
    {
        if (secretOperations != null)
        {
            secretOperations.TriggerSecretOp(operationId);
        }
        else
        {
            Debug.LogWarning("SecretOperations reference not set.");
        }
    }
}
 ToolKit
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical Legends: Game Development Toolkit</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', sans-serif;
            background: radial-gradient(ellipse at center, #0a0a0a 0%, #1a1a2e 50%, #000000 100%);
            color: #00ff88;
            overflow-x: hidden;
            min-height: 100vh;
        }
        
        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(90deg, transparent 98%, rgba(0,255,136,0.03) 100%),
                linear-gradient(180deg, transparent 98%, rgba(0,255,136,0.03) 100%);
            background-size: 30px 30px;
            animation: matrix-scroll 20s linear infinite;
            pointer-events: none;
        }
        
        @keyframes matrix-scroll {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 30px); }
        }
        
        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 10;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .title {
            font-family: 'Orbitron', monospace;
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 900;
            color: #00ff88;
            text-shadow: 0 0 30px #00ff88;
            margin-bottom: 10px;
            animation: title-pulse 3s ease-in-out infinite;
        }
        
        @keyframes title-pulse {
            0%, 100% { text-shadow: 0 0 30px #00ff88; }
            50% { text-shadow: 0 0 50px #00ff88, 0 0 80px rgba(0,255,136,0.5); }
        }
        
        .subtitle {
            font-size: 1.3rem;
            color: #ff6b6b;
            font-weight: 300;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        
        .dev-tabs {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 15px 25px;
            background: rgba(0,0,0,0.7);
            border: 2px solid #00ff88;
            border-radius: 25px;
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .tab-btn.active {
            background: rgba(0,255,136,0.2);
            box-shadow: 0 0 25px rgba(0,255,136,0.4);
        }
        
        .tab-btn:hover {
            background: rgba(0,255,136,0.1);
            transform: translateY(-2px);
        }
        
        .dev-panel {
            display: none;
            background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(26,26,46,0.8));
            border: 2px solid #00ff88;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 0 40px rgba(0,255,136,0.3);
        }
        
        .dev-panel.active {
            display: block;
            animation: panel-fade 0.5s ease-in;
        }
        
        @keyframes panel-fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .feature-card {
            background: rgba(0,0,0,0.6);
            border: 1px solid rgba(0,255,136,0.3);
            border-radius: 15px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0,255,136,0.1), transparent);
            transition: left 0.6s ease;
        }
        
        .feature-card:hover::before {
            left: 100%;
        }
        
        .feature-card:hover {
            border-color: #00ff88;
            box-shadow: 0 10px 30px rgba(0,255,136,0.2);
            transform: translateY(-5px);
        }
        
        .feature-card h3 {
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .feature-card p {
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .action-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(145deg, #ff6b6b, #ff5252);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(255,107,107,0.4);
        }
        
        .character-creator {
            background: rgba(0,0,0,0.8);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
        }
        
        .char-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        
        .form-group input, .form-group select, .form-group textarea {
            background: rgba(0,0,0,0.7);
            border: 1px solid rgba(0,255,136,0.3);
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1rem;
        }
        
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 15px rgba(0,255,136,0.3);
        }
        
        .char-preview {
            background: rgba(26,26,46,0.6);
            border: 2px solid #ff6b6b;
            border-radius: 15px;
            padding: 25px;
            margin-top: 25px;
        }
        
        .char-preview h3 {
            color: #ff6b6b;
            font-family: 'Orbitron', monospace;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-bar {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .stat-label {
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            min-width: 80px;
        }
        
        .stat-progress {
            flex: 1;
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .stat-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #ff6b6b);
            transition: width 0.5s ease;
        }
        
        .mission-designer {
            background: rgba(0,0,0,0.8);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
        }
        
        .mission-flow {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        
        .mission-node {
            background: rgba(0,255,136,0.1);
            border: 2px solid #00ff88;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .mission-node:hover {
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(0,255,136,0.5);
        }
        
        .mission-arrow {
            font-size: 2rem;
            color: #ff6b6b;
        }
        
        .code-output {
            background: #000;
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #00ff88;
            white-space: pre-wrap;
            overflow-x: auto;
            margin: 20px 0;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .copy-btn {
            background: rgba(0,255,136,0.2);
            border: 1px solid #00ff88;
            border-radius: 5px;
            padding: 8px 15px;
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .copy-btn:hover {
            background: rgba(0,255,136,0.3);
        }
        
        .weapon-forge {
            background: rgba(0,0,0,0.8);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
        }
        
        .weapon-preview {
            background: rgba(255,107,107,0.1);
            border: 2px solid #ff6b6b;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .weapon-model {
            width: 200px;
            height: 100px;
            background: linear-gradient(45deg, #333, #666);
            border: 2px solid #ff6b6b;
            border-radius: 10px;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff6b6b;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .feature-grid {
                grid-template-columns: 1fr;
            }
            
            .char-form {
                grid-template-columns: 1fr;
            }
            
            .mission-flow {
                flex-direction: column;
            }
        }
        
        .tooltip {
            position: relative;
        }
        
        .tooltip::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: #00ff88;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            border: 1px solid #00ff88;
        }
        
        .tooltip:hover::after {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="matrix-bg"></div>
    
    <div class="container">
        <div class="header">
            <h1 class="title">TACTICAL LEGENDS</h1>
            <p class="subtitle">Game Development Toolkit</p>
        </div>
        
        <div class="dev-tabs">
            <button class="tab-btn active" onclick="showPanel('character')">🎭 Character System</button>
            <button class="tab-btn" onclick="showPanel('mission')">🎯 Mission Designer</button>
            <button class="tab-btn" onclick="showPanel('weapon')">⚔️ Weapon Forge</button>
            <button class="tab-btn" onclick="showPanel('world')">🌍 World Builder</button>
            <button class="tab-btn" onclick="showPanel('ai')">🤖 AI Behavior</button>
            <button class="tab-btn" onclick="showPanel('audio')">🎵 Audio System</button>
        </div>
        
        <!-- Character System Panel -->
        <div class="dev-panel active" id="character">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🎭 Character Creator</h3>
                    <p>Design operatives with unique backstories, skills, and neural augmentations for the OISTARIAN universe.</p>
                    <button class="action-btn" onclick="toggleCharacterCreator()">Launch Creator</button>
                </div>
                
                <div class="feature-card">
                    <h3>🧬 Skill Trees</h3>
                    <p>Build branching progression systems for Engineering, Combat, and Hacking specializations.</p>
                    <button class="action-btn" onclick="generateSkillTree()">Generate Tree</button>
                </div>
                
                <div class="feature-card">
                    <h3>🔬 Augmentation System</h3>
                    <p>Create cybernetic enhancements like the NeuroPulse Arm with stat modifications and abilities.</p>
                    <button class="action-btn" onclick="designAugmentation()">Design Augments</button>
                </div>
                
                <div class="feature-card">
                    <h3>📊 Stats & Balancing</h3>
                    <p>Mathematical formulas for character progression, damage calculations, and gameplay balance.</p>
                    <button class="action-btn" onclick="showBalanceTools()">Balance Tools</button>
                </div>
            </div>
            
            <div class="character-creator" id="charCreator" style="display: none;">
                <h3 style="color: #00ff88; font-family: 'Orbitron', monospace; margin-bottom: 20px;">🎭 Character Creator</h3>
                
                <div class="char-form">
                    <div class="form-group">
                        <label>Operative Name</label>
                        <input type="text" id="charName" placeholder="e.g., OISTARIAN" onchange="updateCharacter()">
                    </div>
                    
                    <div class="form-group">
                        <label>Classification</label>
                        <select id="charClass" onchange="updateCharacter()">
                            <option value="engineer">Engineer</option>
                            <option value="operative">Operative</option>
                            <option value="hacker">Hacker</option>
                            <option value="augmented">Augmented</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Origin Sector</label>
                        <select id="charOrigin" onchange="updateCharacter()">
                            <option value="echo-swamp">Echo Swamp</option>
                            <option value="neon-district">Neon District</option>
                            <option value="under-city">Under City</option>
                            <option value="corporate-zone">Corporate Zone</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Primary Weapon</label>
                        <select id="charWeapon" onchange="updateCharacter()">
                            <option value="neuro-pulse">NeuroPulse Arm</option>
                            <option value="plasma-rifle">Plasma Rifle</option>
                            <option value="quantum-blade">Quantum Blade</option>
                            <option value="hack-drone">Hack Drone</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Backstory</label>
                    <textarea id="charBackstory" rows="4" placeholder="Former engineer turned reluctant operative..." onchange="updateCharacter()"></textarea>
                </div>
                
                <div class="char-preview" id="charPreview">
                    <h3>Character Preview</h3>
                    <div id="charDisplay"></div>
                    
                    <div class="stats-grid">
                        <div class="stat-bar">
                            <span class="stat-label">COMBAT</span>
                            <div class="stat-progress">
                                <div class="stat-fill" id="combatStat" style="width: 70%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <span class="stat-label">TECH</span>
                            <div class="stat-progress">
                                <div class="stat-fill" id="techStat" style="width: 90%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <span class="stat-label">STEALTH</span>
                            <div class="stat-progress">
                                <div class="stat-fill" id="stealthStat" style="width: 60%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <span class="stat-label">HACKING</span>
                            <div class="stat-progress">
                                <div class="stat-fill" id="hackStat" style="width: 85%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="action-btn" onclick="exportCharacter()">Export Character Data</button>
            </div>
        </div>
        
        <!-- Mission Designer Panel -->
        <div class="dev-panel" id="mission">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🎯 Mission Flow Designer</h3>
                    <p>Create branching storylines with multiple objectives, consequences, and player choices.</p>
                    <button class="action-btn" onclick="toggleMissionDesigner()">Design Mission</button>
                </div>
                
                <div class="feature-card">
                    <h3>🗺️ Level Generator</h3>
                    <p>Procedural generation of cyberpunk environments with tactical cover and interactive elements.</p>
                    <button class="action-btn" onclick="generateLevel()">Generate Level</button>
                </div>
                
                <div class="feature-card">
                    <h3>🎲 Dynamic Events</h3>
                    <p>Random encounters, equipment malfunctions, and environmental hazards that adapt to player choices.</p>
                    <button class="action-btn" onclick="createEvents()">Create Events</button>
                </div>
                
                <div class="feature-card">
                    <h3>📈 Difficulty Scaling</h3>
                    <p>Adaptive AI that responds to player skill level and previous mission performance.</p>
                    <button class="action-btn" onclick="configureDifficulty()">Configure AI</button>
                </div>
            </div>
            
            <div class="mission-designer" id="missionDesigner" style="display: none;">
                <h3 style="color: #00ff88; font-family: 'Orbitron', monospace; margin-bottom: 20px;">🎯 Mission Flow Designer</h3>
                
                <div class="mission-flow">
                    <div class="mission-node tooltip" data-tooltip="Mission Start">START</div>
                    <div class="mission-arrow">→</div>
                    <div class="mission-node tooltip" data-tooltip="Infiltration Phase">INFIL</div>
                    <div class="mission-arrow">→</div>
                    <div class="mission-node tooltip" data-tooltip="Primary Objective">OBJ-1</div>
                    <div class="mission-arrow">→</div>
                    <div class="mission-node tooltip" data-tooltip="Choice Point">CHOICE</div>
                    <div class="mission-arrow">→</div>
                    <div class="mission-node tooltip" data-tooltip="Extraction">EXFIL</div>
                </div>
                
                <div class="form-group">
                    <label>Mission Title</label>
                    <input type="text" id="missionTitle" placeholder="Operation: Silent Protocol" onchange="updateMission()">
                </div>
                
                <div class="char-form">
                    <div class="form-group">
                        <label>Location</label>
                        <select id="missionLocation" onchange="updateMission()">
                            <option value="corporate-tower">Corporate Tower</option>
                            <option value="underground-lab">Underground Lab</option>
                            <option value="data-center">Data Center</option>
                            <option value="abandoned-facility">Abandoned Facility</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Objective Type</label>
                        <select id="missionObjective" onchange="updateMission()">
                            <option value="data-extraction">Data Extraction</option>
                            <option value="sabotage">Sabotage</option>
                            <option value="rescue">Rescue Operation</option>
                            <option value="elimination">Elimination</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Difficulty</label>
                        <select id="missionDifficulty" onchange="updateMission()">
                            <option value="rookie">Rookie</option>
                            <option value="veteran">Veteran</option>
                            <option value="elite">Elite</option>
                            <option value="legendary">Legendary</option>
                        </select>
                    </div>
                </div>
                
                <button class="action-btn" onclick="exportMission()">Export Mission Code</button>
            </div>
        </div>
        
        <!-- Weapon Forge Panel -->
        <div class="dev-panel" id="weapon">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>⚔️ Weapon Designer</h3>
                    <p>Create futuristic weapons with unique firing patterns, energy systems, and tactical attachments.</p>
                    <button class="action-btn" onclick="toggleWeaponForge()">Open Forge</button>
                </div>
                
                <div class="feature-card">
                    <h3>🔧 Modification System</h3>
                    <p>Design weapon mods that affect damage, accuracy, rate of fire, and special abilities.</p>
                    <button class="action-btn" onclick="createModifications()">Create Mods</button>
                </div>
                
                <div class="feature-card">
                    <h3>⚡ Energy Systems</h3>
                    <p>Power management mechanics for energy weapons, overheating, and recharge cycles.</p>
                    <button class="action-btn" onclick="designEnergySystem()">Design Systems</button>
                </div>
                
                <div class="feature-card">
                    <h3>🎯 Ballistics Engine</h3>
                    <p>Physics calculations for projectile trajectories, penetration, and environmental interactions.</p>
                    <button class="action-btn" onclick="configureBallistics()">Configure Physics</button>
                </div>
            </div>
            
            <div class="weapon-forge" id="weaponForge" style="display: none;">
                <h3 style="color: #00ff88; font-family: 'Orbitron', monospace; margin-bottom: 20px;">⚔️ Weapon Forge</h3>
                
                <div class="char-form">
                    <div class="form-group">
                        <label>Weapon Name</label>
                        <input type="text" id="weaponName" placeholder="NeuroPulse Mk-II" onchange="updateWeapon()">
                    </div>
                    
                    <div class="form-group">
                        <label>Weapon Type</label>
                        <select id="weaponType" onchange="updateWeapon()">
                            <option value="energy">Energy Weapon</option>
                            <option value="projectile">Projectile</option>
                            <option value="melee">Melee</option>
                            <option value="hybrid">Hybrid System</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Damage Type</label>
                        <select id="weaponDamage" onchange="updateWeapon()">
                            <option value="kinetic">Kinetic</option>
                            <option value="plasma">Plasma</option>
                            <option value="neural">Neural</option>
                            <option value="quantum">Quantum</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Fire Rate (RPM)</label>
                        <input type="number" id="weaponFireRate" value="450" min="60" max="1200" onchange="updateWeapon()">
                    </div>
                </div>
                
                <div class="weapon-preview">
                    <h3 style="color: #ff6b6b;">Weapon Preview</h3>
                    <div class="weapon-model" id="weaponModel">WEAPON MODEL</div>
                    <div id="weaponStats"></div>
                </div>
                
                <button class="action-btn" onclick="exportWeapon()">Export Weapon Data</button>
            </div>
        </div>
        
        <!-- World Builder Panel -->
        <div class="dev-panel" id="world">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🌍 Environment Generator</h3>
                    <p>Create cyberpunk cityscapes with procedural buildings, neon lighting, and atmospheric effects.</p>
                    <button class="action-btn" onclick="generateEnvironment()">Generate World</button>
                </div>
                
                <div class="feature-card">
                    <h3>🏢 Architecture System</h3>
                    <p>Modular building components for creating corporate towers, underground complexes, and slums.</p>
                    <button class="action-btn" onclick="designArchitecture()">Design Buildings</button>
                </div>
                
                <div class="feature-card">
                    <h3>💡 Lighting Engine</h3>
                    <p>Dynamic neon lighting, holographic displays, and atmospheric particle effects.</p>
                    <button class="action-btn" onclick="configureLighting()">Setup Lighting</button>
                </div>
                
                <div class="feature-card">
                    <h3>🌧️ Weather System</h3>
                    <p>Cyberpunk weather patterns include acid rain, electrical storms, and smog effects.</p>
                    <button class="action-btn" onclick="createWeather()">Create Weather</button>
                </div>
            </div>
        </div>
        
        <!-- AI Behavior Panel -->
        <div class="dev-panel" id="ai">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🤖 Enemy AI Designer</h3>
                    <p>Behavioral trees for security drones, corporate guards, and augmented operatives.</p>
                    <button class="action-btn" onclick="designAI()">Design AI
                    
 if (PlayerEnteringZone && CoverAvailable) {
    EnemyGroup.PrepareAmbush(position: chokepoint, formation: flanking);
    TriggerCinematic("AmbushSetup");
}

Enemy.SendInterceptedRadio("FalseExtractionPoint");
PlayerMap.Update(marker: "Evac Alpha", status: verified=false);

if (CivilianDetectedInZone && PlayerWeaponDrawn) {
    EnemyDisengage();  // AI uses civilian density to mask retreat
    MoralityTracker.Update("Risking Collateral Damage");
}

if (IntelLeakDetected) {
    EnemySwitchObjective();  // AI fakes its own retreat or mission path
    DeploySniperOnTrueObjective();
}

if (PlayerEnteringZone && CoverAvailable) {
    EnemyGroup.PrepareAmbush(position: chokepoint, formation: flanking);
    TriggerCinematic("AmbushSetup");
}

Enemy.SendInterceptedRadio("FalseExtractionPoint");
PlayerMap.Update(marker: "Evac Alpha", status: verified=false);

if (CivilianDetectedInZone && PlayerWeaponDrawn) {
    EnemyDisengage();  // AI uses civilian density to mask retreat
    MoralityTracker.Update("Risking Collateral Damage");
}

public void EvaluatePlayerAction(string actionType, bool riskToCivilians)
{
    switch (actionType)
    {
        case "DeceptiveIntel":
            MoralityScore -= 5;
            break;
        case "RescueNeutralUnit":
            MoralityScore += 10;
            FactionTrustLevel["Echo Ascendants"] += 15;
            break;
        case "AggressiveFire":
            if (riskToCivilians) CiviliansImpactIndex++;
            MoralityScore -= 10;
            break;
    }
    UpdateHUDMoralityBar(MoralityScore);
}

public void DetermineCombatResponse(UnitAI unit) {
    switch (unit.psychologyTrait) {
        case TraitType.Aggression:
            unit.Attack(aggressive:true, flankCoverage:false);
            break;
        case TraitType.Paranoia:
            unit.ScanAllZones();
            unit.TriggerAlertIf("ShadowMovement");
            break;
        case TraitType.Calculating:
            unit.SetTrap();
            unit.CallFakeBackup();
            break;
    }
}
intro_cutscene:
  visuals:
    - "Dark ocean trench with lightning flashing overhead"
    - "Agents descend into a pressure hatch illuminated by glowing masks."
    - "Enemy sonar ping distorts the screen with red pulses"
  narration:
    - speaker: "Narrator"
      line: "Beneath the waves lies the final code. But enemies don’t just guard—they listen. Make noise, and you vanish."
  transition:
    - effect: "Water ripples morph seamlessly into a tactical HUD overlay"
  public class UIPlayerProgressPanel: MonoBehaviour
{
    public Image divisionBadge;
    public Text rankTitle;
    public Slider intelRatingBar;
    public Text nextReward;

    public void UpdateUI(PlayerData data)
    {
        rankTitle.text = data.rank.ToString();
        intelRatingBar.value = Mathf.Clamp01(data.intelScore / data.rankThreshold);
        nextReward.text = data.upcomingUnlock;
        divisionBadge.sprite = BadgeLibrary.GetBadge(data.rank);
    }
}  
public enum AudioMood { Calm, Alert, Combat, Unknown }

public class SoundProfileManager : MonoBehaviour
{
    public AudioClip calmAmbience;
    public AudioClip alertLoop;
    public AudioClip combatPulse;

    private AudioSource audioSource;

    void Awake()
    {
        audioSource = GetComponent<AudioSource>();
        if (audioSource == null)
        {
            Debug.LogError("AudioSource component missing!");
        }
    }

    public void ChangeAudioMood(AudioMood mood)
    {
        if (audioSource == null) return;

        switch (mood)
        {
            case AudioMood.Calm:
                PlayClip(calmAmbience);
                break;
            case AudioMood.Alert:
                PlayLoop(alertLoop);
                break;
            case AudioMood.Combat:
                PlayLoop(combatPulse);
                break;
            default:
                Debug.LogWarning("Unknown audio mood.");
                break;
        }
    }

    void PlayClip(AudioClip clip)
    {
        if (clip == null) return;
        audioSource.Stop();
        audioSource.clip = clip;
        audioSource.loop = false;
        audioSource.Play();
    }

    void PlayLoop(AudioClip clip)
    {
        if (clip == null) return;
        audioSource.Stop();
        audioSource.clip = clip;
        audioSource.loop = true;
        audioSource.Play();
    }
}

using UnityEngine;

public enum WeaponType 
{ 
    // Firearms
    Rifle, Pistol, Sniper, SMG, Shotgun, RocketLauncher, GrenadeLauncher,
    
    // Melee & Throwables
    Knife, Sword, Baton, Grenade, Flashbang, SmokeGrenade, TearGas,
    
    // High-Tech Weapons
    LaserRifle, PlasmaGun, RailGun, EnergyBlade, TaserGun,
    
    // Gadgets & Electronics
    Drone, EMP, NightVision, ThermalVision, GrapplingHook, JetPack,
    Hacker, Scanner, CloakingDevice, ShieldGenerator, Decoy,
    
    // Protective Gear
    BodyArmor, Helmet, Shield, GasMask, FullBodySuit, ExoSkeleton,
    
    // Special/Illegal
    SilencedPistol, AssaultRifle, IllegalSMG, BlackMarketSniper,
    ExplosiveDevice, PoisonDart, Tranquilizer
}

public enum WeaponRarity
{
    Common, Uncommon, Rare, Epic, Legendary, BlackMarket, Prototype
}

public enum ArmorType
{
    Light, Medium, Heavy, Tactical, Stealth, Environmental, Powered
}

[System.Serializable]
public class Weapon
{
    [Header("Basic Info")]
    public string Name;
    public WeaponType Type;
    public WeaponRarity Rarity;
    public string Description;
    public Sprite Icon;
    
    [Header("Combat Stats")]
    public int Damage;
    public int AmmoCapacity;
    public float ReloadTime;
    public float Range;
    public float FireRate; // Rounds per minute
    public float Accuracy; // 0-100%
    public int PenetrationPower; // Can pierce armor
    
    [Header("Special Properties")]
    public bool IsGadget;
    public bool IsSilenced;
    public bool IsIllegal; // Black market items
    public bool RequiresLicense;
    public bool IsOneTimeUse;
    public bool IsThrowable;
    
    [Header("Gadget Effects")]
    public string GadgetEffect;
    public float EffectDuration;
    public float EffectRadius;
    public int BatteryLife; // For electronic gadgets
    
    [Header("Armor Properties")]
    public ArmorType ArmorClass;
    public int DefenseRating;
    public float MovementPenalty; // Speed reduction when worn
    public bool ProtectsAgainstGas;
    public bool ProtectsAgainstRadiation;
    public bool ProtectsAgainstElectric;
    public bool HasNightVision;
    public bool HasThermalVision;
    
    [Header("Economics")]
    public int Cost;
    public int BlackMarketCost; // Higher cost for illegal items
    public bool AvailableInShops;
    public int MinLevel; // Player level requirement
}

[System.Serializable]
public class WeaponDatabase : MonoBehaviour
{
    [Header("Weapon Arsenal")]
    public Weapon[] AllWeapons;
    
    void Start()
    {
        InitializeWeapons();
    }
    
    void InitializeWeapons()
    {
        AllWeapons = new Weapon[]
        {
            // === STANDARD FIREARMS ===
            new Weapon { Name = "M4A1 Assault Rifle", Type = WeaponType.Rifle, Rarity = WeaponRarity.Common, 
                        Damage = 35, AmmoCapacity = 30, ReloadTime = 2.5f, Range = 300f, FireRate = 750, Accuracy = 75f },
            
            new Weapon { Name = "Glock 17 Pistol", Type = WeaponType.Pistol, Rarity = WeaponRarity.Common,
                        Damage = 25, AmmoCapacity = 17, ReloadTime = 1.5f, Range = 50f, FireRate = 300, Accuracy = 65f },
            
            new Weapon { Name = "Barrett M82 Sniper", Type = WeaponType.Sniper, Rarity = WeaponRarity.Rare,
                        Damage = 120, AmmoCapacity = 10, ReloadTime = 3.5f, Range = 1000f, FireRate = 60, Accuracy = 95f },
            
            new Weapon { Name = "MP5 Submachine Gun", Type = WeaponType.SMG, Rarity = WeaponRarity.Uncommon,
                        Damage = 28, AmmoCapacity = 25, ReloadTime = 2.0f, Range = 150f, FireRate = 900, Accuracy = 70f },
            
            new Weapon { Name = "Benelli M4 Shotgun", Type = WeaponType.Shotgun, Rarity = WeaponRarity.Common,
                        Damage = 80, AmmoCapacity = 7, ReloadTime = 4.0f, Range = 30f, FireRate = 180, Accuracy = 50f },
            
            // === BLACK MARKET / ILLEGAL WEAPONS ===
            new Weapon { Name = "Ghost Gun (Untraceable)", Type = WeaponType.IllegalSMG, Rarity = WeaponRarity.BlackMarket,
                        Damage = 40, AmmoCapacity = 32, ReloadTime = 2.2f, Range = 120f, IsIllegal = true, 
                        BlackMarketCost = 15000, IsSilenced = true },
            
            new Weapon { Name = "Modified AK-47", Type = WeaponType.BlackMarketSniper, Rarity = WeaponRarity.BlackMarket,
                        Damage = 55, AmmoCapacity = 30, ReloadTime = 2.8f, Range = 400f, IsIllegal = true,
                        BlackMarketCost = 25000 },
            
            new Weapon { Name = "Silenced .22 Assassin Pistol", Type = WeaponType.SilencedPistol, Rarity = WeaponRarity.BlackMarket,
                        Damage = 45, AmmoCapacity = 12, ReloadTime = 1.8f, Range = 80f, IsSilenced = true,
                        IsIllegal = true, BlackMarketCost = 12000 },
            
            // === JAMES BOND GADGETS ===
            new Weapon { Name = "Walther PPK (Bond's Gun)", Type = WeaponType.Pistol, Rarity = WeaponRarity.Legendary,
                        Damage = 40, AmmoCapacity = 7, ReloadTime = 1.2f, Range = 60f, IsSilenced = true,
                        GadgetEffect = "Never misses critical shots", IsGadget = true },
            
            new Weapon { Name = "Explosive Pen", Type = WeaponType.ExplosiveDevice, Rarity = WeaponRarity.Epic,
                        Damage = 200, IsOneTimeUse = true, IsGadget = true, EffectRadius = 5f,
                        GadgetEffect = "Disguised explosive device" },
            
            new Weapon { Name = "Laser Watch", Type = WeaponType.LaserRifle, Rarity = WeaponRarity.Legendary,
                        Damage = 60, BatteryLife = 20, IsGadget = true, Range = 100f,
                        GadgetEffect = "Cuts through metal and glass" },
            
            new Weapon { Name = "Ejector Seat Remote", Type = WeaponType.Hacker, Rarity = WeaponRarity.Epic,
                        IsGadget = true, EffectRadius = 50f, GadgetEffect = "Disables enemy vehicles" },
            
            new Weapon { Name = "Grappling Hook Watch", Type = WeaponType.GrapplingHook, Rarity = WeaponRarity.Rare,
                        Range = 200f, IsGadget = true, GadgetEffect = "Swing across gaps, climb buildings" },
            
            // === BATMAN ARSENAL ===
            new Weapon { Name = "Batarang", Type = WeaponType.Knife, Rarity = WeaponRarity.Epic,
                        Damage = 35, IsThrowable = true, Range = 100f, IsGadget = true,
                        GadgetEffect = "Returns to user, can disarm enemies" },
            
            new Weapon { Name = "Explosive Batarang", Type = WeaponType.Grenade, Rarity = WeaponRarity.Legendary,
                        Damage = 150, IsThrowable = true, Range = 120f, EffectRadius = 8f, IsOneTimeUse = true },
            
            new Weapon { Name = "Grappling Gun", Type = WeaponType.GrapplingHook, Rarity = WeaponRarity.Epic,
                        Range = 500f, IsGadget = true, GadgetEffect = "Rapid building traversal" },
            
            new Weapon { Name = "Smoke Pellets", Type = WeaponType.SmokeGrenade, Rarity = WeaponRarity.Rare,
                        IsThrowable = true, EffectRadius = 15f, EffectDuration = 30f, Range = 50f },
            
            new Weapon { Name = "EMP Batarang", Type = WeaponType.EMP, Rarity = WeaponRarity.Epic,
                        IsThrowable = true, EffectRadius = 20f, Range = 80f,
                        GadgetEffect = "Disables all electronics in area" },
            
            new Weapon { Name = "Cryptographic Sequencer", Type = WeaponType.Hacker, Rarity = WeaponRarity.Rare,
                        IsGadget = true, GadgetEffect = "Hack security systems and doors" },
            
            // === PROTECTIVE GEAR ===
            new Weapon { Name = "Kevlar Vest", Type = WeaponType.BodyArmor, Rarity = WeaponRarity.Common,
                        ArmorClass = ArmorType.Light, DefenseRating = 25, MovementPenalty = 0.05f, Cost = 800 },
            
            new Weapon { Name = "Tactical Body Armor", Type = WeaponType.BodyArmor, Rarity = WeaponRarity.Uncommon,
                        ArmorClass = ArmorType.Medium, DefenseRating = 45, MovementPenalty = 0.15f, Cost = 2500 },
            
            new Weapon { Name = "Military Grade Armor", Type = WeaponType.BodyArmor, Rarity = WeaponRarity.Rare,
                        ArmorClass = ArmorType.Heavy, DefenseRating = 70, MovementPenalty = 0.25f, RequiresLicense = true },
            
            new Weapon { Name = "Riot Helmet", Type = WeaponType.Helmet, Rarity = WeaponRarity.Common,
                        DefenseRating = 15, ProtectsAgainstGas = false, Cost = 300 },
            
            new Weapon { Name = "Tactical Helmet", Type = WeaponType.Helmet, Rarity = WeaponRarity.Uncommon,
                        DefenseRating = 25, HasNightVision = true, ProtectsAgainstGas = true, Cost = 1200 },
            
            new Weapon { Name = "M50 Gas Mask", Type = WeaponType.GasMask, Rarity = WeaponRarity.Common,
                        ProtectsAgainstGas = true, DefenseRating = 5, Cost = 400 },
            
            new Weapon { Name = "CBRN Gas Mask", Type = WeaponType.GasMask, Rarity = WeaponRarity.Rare,
                        ProtectsAgainstGas = true, ProtectsAgainstRadiation = true, DefenseRating = 10, Cost = 1500 },
            
            new Weapon { Name = "Riot Shield", Type = WeaponType.Shield, Rarity = WeaponRarity.Common,
                        DefenseRating = 50, MovementPenalty = 0.20f, Cost = 600 },
            
            new Weapon { Name = "Ballistic Shield", Type = WeaponType.Shield, Rarity = WeaponRarity.Uncommon,
                        DefenseRating = 80, MovementPenalty = 0.30f, Cost = 2000 },
            
            new Weapon { Name = "Energy Shield Generator", Type = WeaponType.ShieldGenerator, Rarity = WeaponRarity.Legendary,
                        DefenseRating = 100, BatteryLife = 300, IsGadget = true, ProtectsAgainstElectric = true,
                        GadgetEffect = "Absorbs energy attacks to recharge" },
            
            new Weapon { Name = "Hazmat Suit", Type = WeaponType.FullBodySuit, Rarity = WeaponRarity.Rare,
                        ArmorClass = ArmorType.Environmental, DefenseRating = 30, MovementPenalty = 0.35f,
                        ProtectsAgainstGas = true, ProtectsAgainstRadiation = true, Cost = 3000 },
            
            new Weapon { Name = "Powered Exoskeleton", Type = WeaponType.ExoSkeleton, Rarity = WeaponRarity.Prototype,
                        ArmorClass = ArmorType.Powered, DefenseRating = 120, MovementPenalty = -0.20f, // Increases speed
                        BatteryLife = 480, GadgetEffect = "Enhances strength and speed" },
            
            // === HIGH-TECH GADGETS ===
            new Weapon { Name = "Stealth Suit", Type = WeaponType.CloakingDevice, Rarity = WeaponRarity.Prototype,
                        IsGadget = true, BatteryLife = 180, EffectDuration = 30f,
                        GadgetEffect = "Temporary invisibility" },
            
            new Weapon { Name = "Combat Drone", Type = WeaponType.Drone, Rarity = WeaponRarity.Epic,
                        Damage = 25, Range = 200f, BatteryLife = 600, IsGadget = true,
                        GadgetEffect = "Autonomous combat support" },
            
            new Weapon { Name = "Reconnaissance Drone", Type = WeaponType.Scanner, Rarity = WeaponRarity.Rare,
                        Range = 500f, BatteryLife = 1200, IsGadget = true,
                        GadgetEffect = "Marks enemies through walls" },
            
            new Weapon { Name = "Holographic Decoy", Type = WeaponType.Decoy, Rarity = WeaponRarity.Epic,
                        IsGadget = true, EffectDuration = 60f, BatteryLife = 5,
                        GadgetEffect = "Creates false target to confuse enemies" },
            
            new Weapon { Name = "Jetpack", Type = WeaponType.JetPack, Rarity = WeaponRarity.Legendary,
                        IsGadget = true, BatteryLife = 300, GadgetEffect = "Limited flight capability" },
            
            // === SPECIALIZED AMMO/DARTS ===
            new Weapon { Name = "Tranquilizer Gun", Type = WeaponType.Tranquilizer, Rarity = WeaponRarity.Rare,
                        Damage = 0, AmmoCapacity = 5, Range = 80f, IsSilenced = true,
                        GadgetEffect = "Non-lethal knockout", EffectDuration = 120f },
            
            new Weapon { Name = "Poison Dart Blowgun", Type = WeaponType.PoisonDart, Rarity = WeaponRarity.BlackMarket,
                        Damage = 100, AmmoCapacity = 1, Range = 40f, IsSilenced = true, IsIllegal = true,
                        GadgetEffect = "Delayed poison damage over time" },
            
            // === VISION EQUIPMENT ===
            new Weapon { Name = "Night Vision Goggles", Type = WeaponType.NightVision, Rarity = WeaponRarity.Common,
                        IsGadget = true, BatteryLife = 480, GadgetEffect = "See in complete darkness" },
            
            new Weapon { Name = "Thermal Goggles", Type = WeaponType.ThermalVision, Rarity = WeaponRarity.Uncommon,
                        IsGadget = true, BatteryLife = 360, GadgetEffect = "See heat signatures through walls" }
        };
    }
    
    public Weapon[] GetWeaponsByType(WeaponType type)
    {
        System.Collections.Generic.List<Weapon> weapons = new System.Collections.Generic.List<Weapon>();
        foreach (Weapon weapon in AllWeapons)
        {
            if (weapon.Type == type)
                weapons.Add(weapon);
        }
        return weapons.ToArray();
    }
    
    public Weapon[] GetBlackMarketWeapons()
    {
        System.Collections.Generic.List<Weapon> weapons = new System.Collections.Generic.List<Weapon>();
        foreach (Weapon weapon in AllWeapons)
        {
            if (weapon.IsIllegal || weapon.Rarity == WeaponRarity.BlackMarket)
                weapons.Add(weapon);
        }
        return weapons.ToArray();
    }
    
    public Weapon[] GetProtectiveGear()
    {
        System.Collections.Generic.List<Weapon> gear = new System.Collections.Generic.List<Weapon>();
        foreach (Weapon weapon in AllWeapons)
        {
            if (weapon.Type == WeaponType.BodyArmor || weapon.Type == WeaponType.Helmet || 
                weapon.Type == WeaponType.Shield || weapon.Type == WeaponType.GasMask ||
                weapon.Type == WeaponType.FullBodySuit || weapon.Type == WeaponType.ExoSkeleton)
                gear.Add(weapon);
        }
        return gear.ToArray();
    }
}
import 'dart:async';
import 'dart:math';

// --- GameState Class ---
/// Central game state management for OISTARIAN's journey.
class GameState {
  int trustScore;
  bool voiceHeard;
  int missionsCompleted;
  bool echoShieldActive;
  bool finalLiberationUnlocked;
  String currentScene;

  GameState({
    this.trustScore = 82,
    this.voiceHeard = false,
    this.missionsCompleted = 47,
    this.echoShieldActive = false,
    this.finalLiberationUnlocked = false,
    this.currentScene = "VaultOfEchoes",
  });

  /// Saves the current game state.
  /// (File operations are not supported in this environment, skipping save.)
  Future<void> saveState(String filename) async {
    print('Simulating save: Game state would be saved to $filename');
    // Actual file saving logic removed due to environment constraints.
  }

  /// Loads game state. If not found, uses default state.
  /// (File operations are not supported in this environment, using default state.)
  Future<void> loadState(String filename) async {
    print('Simulating load: Attempting to load game state from $filename (using default state due to environment constraints).');
    // Actual file loading logic removed due to environment constraints.
    // Ensure default state is set if no loading happens.
    trustScore = 82;
    voiceHeard = false;
    missionsCompleted = 47;
    echoShieldActive = false;
    finalLiberationUnlocked = false;
    currentScene = "VaultOfEchoes";
  }
}

// --- Scene Management ---

/// Abstract base class for all game scenes.
abstract class Scene {
  final SceneManager sceneManager;
  bool setupComplete = false;

  Scene(this.sceneManager);

  /// Initializes scene resources. Simulates asset loading.
  Future<void> setup();

  /// Updates scene logic based on delta time.
  Future<void> update(double dt);

  /// Renders the scene to the console.
  void render();

  /// Handles user input for the scene.
  Future<void> handleInput(String input);

  /// Clears the console screen by printing newlines.
  /// This is a cross-platform workaround for console clearing
  /// without relying on platform-specific commands.
  void clearConsole() {
    print('\n' * 50); // Print 50 newlines to push content up and 'clear' the screen
  }
}

/// Manages scene transitions and game flow.
class SceneManager {
  Map<String, Scene> scenes = {};
  Scene? currentScene;
  final GameState gameState;

  SceneManager(this.gameState);

  /// Registers a scene with the manager.
  void registerScene(String name, Scene scene) {
    scenes[name] = scene;
  }

  /// Switches to a different scene by name.
  Future<void> switchScene(String sceneName) async {
    if (scenes.containsKey(sceneName)) {
      currentScene = scenes[sceneName];
      gameState.currentScene = sceneName;
      print('\n--- Switching to scene: ${sceneName.toUpperCase()} ---');
      await currentScene!.setup();
    } else {
      print('Error: Scene "$sceneName" not found!');
    }
  }

  /// Updates the current scene.
  Future<void> update(double dt) async {
    if (currentScene != null) {
      await currentScene!.update(dt);
    }
  }

  /// Renders the current scene.
  void render() {
    if (currentScene != null) {
      currentScene!.render();
    }
  }

  /// Handles events for the current scene.
  Future<void> handleInput(String input) async {
    if (currentScene != null) {
      await currentScene!.handleInput(input);
    }
  }
}

// --- Helper Systems ---

/// Simulates frame-based animations by printing text.
class AnimationSystem {
  final List<String> frameDescriptions;
  final double frameDuration;
  int currentFrame;
  double timer;
  bool playing;
  bool loop;

  AnimationSystem(this.frameDescriptions, this.frameDuration,
      {this.loop = true})
      : currentFrame = 0,
        timer = 0.0,
        playing = true;

  void update(double dt) {
    if (!playing || frameDescriptions.isEmpty) {
      return;
    }

    timer += dt;
    if (timer >= frameDuration) {
      currentFrame += 1;
      timer = 0.0;

      if (currentFrame >= frameDescriptions.length) {
        if (loop) {
          currentFrame = 0;
        } else {
          currentFrame = frameDescriptions.length - 1;
          playing = false;
        }
      }
    }
  }

  String getCurrentFrameDescription() {
    if (frameDescriptions.isNotEmpty &&
        currentFrame >= 0 &&
        currentFrame < frameDescriptions.length) {
      return frameDescriptions[currentFrame];
    }
    return 'Empty animation frame';
  }

  void reset() {
    currentFrame = 0;
    timer = 0.0;
    playing = true;
  }
}

/// Manages dialogue sequences with timing.
class DialogueSystem {
  final List<String> dialogueLines;
  final double lineDuration;
  int currentLine;
  double timer;
  bool complete;

  DialogueSystem(this.dialogueLines, this.lineDuration)
      : currentLine = 0,
        timer = 0.0,
        complete = false;

  void update(double dt) {
    if (complete) {
      return;
    }

    timer += dt;
    if (timer >= lineDuration) {
      currentLine += 1;
      timer = 0.0;

      if (currentLine >= dialogueLines.length) {
        complete = true;
        currentLine = dialogueLines.length - 1; // Stay on last line
      }
    }
  }

  String getCurrentLine() {
    if (currentLine >= 0 && currentLine < dialogueLines.length) {
      return dialogueLines[currentLine];
    }
    return '';
  }

  void skipToNext() {
    if (!complete) {
      currentLine += 1;
      timer = 0.0; // Reset timer for next line
      if (currentLine >= dialogueLines.length) {
        complete = true;
        currentLine = dialogueLines.length - 1;
      }
    }
  }
}

// --- Scene Implementations ---

/// Cinematic start to the Vault mission with fade-in and voiceover.
class VaultStartMission extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  double timer = 0;
  int alpha = 255; // Simulates fade
  bool voicePlayed = false;
  String voiceClipStatus = "Loading...";

  VaultStartMission(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Simulating loading assets for VaultStartMission...');
    // Simulate loading voice clip
    try {
      voiceClipStatus = "Voice clip loaded: assets/start_mission_voice.wav";
      setupComplete = true;
    } catch (e) {
      voiceClipStatus = "Voice clip failed to load.";
      print("Warning: $voiceClipStatus - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50)); // Small delay for setup
  }

  @override
  Future<void> update(double dt) async {
    timer += dt;
    if (timer > 0.5 && !voicePlayed && setupComplete) {
      print('>> Playing: "MISSION START" voiceover <<');
      voicePlayed = true;
    }
    if (alpha > 0) {
      alpha = max(0, alpha - (60 * dt).toInt()); // Simulate fade
    }
    if (timer > 4) {
      await sceneManager.switchScene("VaultOfEchoes");
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- VAULT START MISSION ---');
    print('');
    print('Screen fading in. Alpha: $alpha/255');
    print('');
    print('MISSION START: Infiltrate the Vault of Echoes');
    print('');
    if (voicePlayed) {
      print('>> Voiceover playing: "$voiceClipStatus" <<');
    } else {
      print('>> Preparing voiceover <<');
    }
    print('');
    print('Mission will proceed shortly...');
  }

  @override
  Future<void> handleInput(String input) async {
    // No interaction; it's a cinematic
    print("This is a cinematic sequence. No interaction needed.");
  }
}

/// Main vault infiltration scene.
class VaultOfEchoesScene extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  VaultOfEchoesScene(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Simulating loading assets for VaultOfEchoesScene...');
    try {
      // Simulate loading image and sound.
      print("Background loaded: assets/vault_bg.jpg");
      print("Voice clip loaded: assets/voice_whisper.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for VaultOfEchoesScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // Add dynamic lighting or heartbeat pulse simulation here if desired.
  }

  @override
  void render() {
    clearConsole();
    print('--- VAULT OF ECHOES ---');
    if (setupComplete) {
      print('Background: Vault Core Chamber');
    } else {
      print('Background: Generic Dark Chamber');
    }
    print('');
    print('The Vault awaits. Do you trust the voice?');
    print('');
    print('Instructions:');
    print("  'T' to Trust the Voice (requires Trust Score > 80)");
    print("  'S' to Silence the Voice");
    print('');
    print('Current Trust Score: ${sceneManager.gameState.trustScore}');
    print('Voice Heard Status: ${sceneManager.gameState.voiceHeard}');
  }

  @override
  Future<void> handleInput(String input) async {
    final trustScore = sceneManager.gameState.trustScore;

    if (input.toLowerCase() == 't') {
      if (trustScore > 80) {
        sceneManager.gameState.voiceHeard = true;
        sceneManager.gameState.echoShieldActive = true;
        print('>> You trust the voice. Activating Echo Shield. <<');
        if (setupComplete) {
          print('>> Playing: "whisper" voice clip <<');
        }
        await sceneManager.switchScene("EchoShieldUnlocked");
      } else {
        print('Your trust score is too low to fully trust the voice.');
      }
    } else if (input.toLowerCase() == 's') {
      sceneManager.gameState.finalLiberationUnlocked = false; // Locks it
      print('>> You chose to silence the voice. Final Liberation protocol locked. <<');
      await sceneManager.switchScene("ZoesSilence");
    } else {
      print('Invalid input. Please choose "T" or "S".');
    }
  }
}

/// Emotional corridor scene with Zoe's memory.
class ZoesSilenceScene extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  bool playedClip = false;

  ZoesSilenceScene(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Simulating loading assets for ZoesSilenceScene...');
    try {
      print("Background loaded: assets/zoe_corridor.jpg");
      print("Voice clip loaded: assets/zoe_voicemail.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for ZoesSilenceScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No specific time-based updates for this scene's logic.
  }

  @override
  void render() {
    clearConsole();
    print('--- ZOE\'S SILENCE ---');
    if (setupComplete) {
      print('Background: Dusty Corridor, A Child\'s Shadow');
    } else {
      print('Background: Empty Room');
    }
    print('');
    print('The corridor. The child. The silence.');
    print('');
    if (!playedClip) {
      print("Instructions: Press 'V' to play Zoe's voicemail.");
    } else {
      print("Instructions: Press 'E' to continue to Echo Protocol.");
      print('Zoe\'s voicemail has been played.');
    }
    print('');
    print('Voice Heard Status (after choice): ${sceneManager.gameState.voiceHeard}');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'v' && !playedClip) {
      if (setupComplete) {
        print('>> Playing: "Zoe\'s voicemail" <<');
      } else {
        print('>> Simulating playing Zoe\'s voicemail (assets not loaded) <<');
      }
      playedClip = true;
      sceneManager.gameState.voiceHeard = true; // Playing the voicemail changes this
      print('Zoe\'s voicemail played. You have acknowledged her echo.');
    } else if (input.toLowerCase() == 'e' && playedClip) {
      print('Proceeding to Echo Protocol...');
      await sceneManager.switchScene("EchoProtocol");
    } else if (input.toLowerCase() == 'v' && playedClip) {
      print('Voicemail already played.');
    } else {
      print('Invalid input. Follow the instructions.');
    }
  }
}

/// Tactical gear management interface.
class GearUpgradeUI extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  final Map<String, Map<String, dynamic>> gear = {
    "Whisper & Roar": {
      "level": 2,
      "mods": ["thermal_scope", "sound_suppressor"]
    },
    "NeuroPulse Arm": {
      "level": 3,
      "mods": ["shock_pulse", "grapple_hook", "echo_shield"]
    }
  };

  GearUpgradeUI(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing GearUpgradeUI...');
    setupComplete = true; // No external assets to load for this UI
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No time-based updates for a static UI.
  }

  @override
  void render() {
    clearConsole();
    print('--- OISTARIAN GEAR LOADOUT ---');
    print('');
    print('----------------------------------');
    for (var entry in gear.entries) {
      final gearName = entry.key;
      final stats = entry.value;
      print('$gearName - Level ${stats["level"]}');
      print('  Mods: ${(stats["mods"] as List).join(', ')}');
      print('----------------------------------');
    }
    print('');
    print('Current game state info:');
    print('  Echo Shield Active: ${sceneManager.gameState.echoShieldActive}');
    print('  Final Liberation Unlocked: ${sceneManager.gameState.finalLiberationUnlocked}');
    print('');
    print('Instructions: Press ESC to return to Tactical Briefing.');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'esc') {
      print('Exiting Gear Upgrade UI.');
      await sceneManager.switchScene("EchoProtocol"); // Changed to EchoProtocol
    } else {
      print('Invalid input. Press ESC to return.');
    }
  }
}

/// Mini-game for decrypting Zoe's memory shard.
class NeuralGlassDecryption extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  List<int> glyphs;
  final List<int> target;
  int selected;
  double timer;
  bool success;
  bool gameOver;

  NeuralGlassDecryption(super.sceneManager) // Calls super constructor
      : target = [3, 7, 2, 5, 1], // Zoe's emotional frequency
        glyphs = [3, 7, 2, 5, 1], // Pre-solved for demo purposes
        selected = 0,
        timer = 60.0,
        success = false,
        gameOver = false;

  @override
  Future<void> setup() async {
    print('Initializing Neural Glass Decryption mini-game...');
    // If the game is just starting, reset glyphs to random,
    // otherwise if coming back to it, keep current.
    success = (glyphs.toString() == target.toString()); // Mark as success immediately
    gameOver = success; // End game if already successful
    setupComplete = true; // No external assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    if (gameOver) return;

    // Check for success immediately if glyphs match
    if (glyphs.toString() == target.toString()) {
      success = true;
      gameOver = true;
      print('\nDECRYPTION SUCCESSFUL!');
      return; // Stop processing timer
    }

    timer -= dt;
    if (timer <= 0) {
      gameOver = true;
      print('\nTIME UP!');
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- NEURAL GLASS DECRYPTION ---');
    print('');
    print('Objective: Align emotional frequencies to decode Zoe\'s memory shard.');
    print('Time Remaining: ${timer.toInt()}s');
    print('');
    print('Glyphs:');
    print('  ${glyphs.map((g) => g.toString().padLeft(2, '0')).join(' ')}');
    print('  ${'  ' * selected}^^'); // Indicator for selected glyph
    print('');
    if (gameOver) {
      if (success) {
        print('Result: DECRYPTION SUCCESSFUL - Zoe\'s echo unlocked.');
      } else {
        print('Result: DECRYPTION FAILED - Memory shard destabilized.');
      }
      print('Press ENTER to continue...');
    } else {
      print('Instructions:');
      print("  LEFT/RIGHT arrow keys: Select glyph");
      print("  UP/DOWN arrow keys: Adjust glyph value");
    }
  }

  @override
  Future<void> handleInput(String input) async {
    if (gameOver) {
      if (input.toLowerCase() == 'enter') {
        if (success) {
          sceneManager.gameState.finalLiberationUnlocked = true;
          print('Final Liberation protocol unlocked!');
          await sceneManager.switchScene("FinalLiberation");
        } else {
          print('Decryption failed. Returning to a previous state or main menu...');
          await sceneManager.switchScene("TacticalBriefing"); // Or another scene
        }
      }
      return;
    }

    // Basic interpretation of arrow keys for console input.
    if (input.toLowerCase() == 'left') {
      selected = (selected - 1 + glyphs.length) % glyphs.length;
    } else if (input.toLowerCase() == 'right') {
      selected = (selected + 1) % glyphs.length;
    } else if (input.toLowerCase() == 'up') {
      glyphs[selected] = (glyphs[selected] + 1) % 10;
    } else if (input.toLowerCase() == 'down') {
      glyphs[selected] = (glyphs[selected] - 1 + 10) % 10;
    } else {
      print('Invalid input for decryption mini-game.');
    }
  }
}

/// Tactical breach sequence with Yamam unit.
class YamamBreachScene extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  String phase = "thermal_scan";
  double phaseTimer = 0.0;
  late AnimationSystem thermalAnim;
  late AnimationSystem breachAnim;
  late AnimationSystem extractionAnim;

  YamamBreachScene(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Yamam Breach Sequence...');
    thermalAnim = AnimationSystem(
        ["Thermal scan frame 1", "Thermal scan frame 2", "Thermal scan frame 3"],
        0.5,
        loop: true);
    breachAnim = AnimationSystem([
      "Breach frame 1",
      "Breach frame 2",
      "Breach frame 3",
      "Breach frame 4",
      "Breach frame 5"
    ], 0.2, loop: true);
    extractionAnim = AnimationSystem([
      "Extraction frame 1",
      "Extraction frame 2",
      "Extraction frame 3"
    ], 0.4, loop: true);

    try {
      print("Sound loaded: assets/flashbang.wav");
      print("Sound loaded: assets/breach_audio.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for YamamBreachScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    phaseTimer += dt;

    if (phase == "thermal_scan") {
      thermalAnim.update(dt);
      if (phaseTimer > 3.0) {
        phase = "flashbang";
        phaseTimer = 0.0;
        if (setupComplete) {
          print('>> Playing: Flashbang sound <<');
        }
      }
    } else if (phase == "flashbang") {
      if (phaseTimer > 0.5) {
        phase = "breach";
        phaseTimer = 0.0;
        if (setupComplete) {
          print('>> Playing: Breach sound <<');
        }
      }
    } else if (phase == "breach") {
      breachAnim.update(dt);
      if (phaseTimer > 4.0) {
        phase = "extraction";
        phaseTimer = 0.0;
      }
    } else if (phase == "extraction") {
      extractionAnim.update(dt);
      if (phaseTimer > 6.0) {
        await sceneManager.switchScene("HostageReunion");
      }
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- YAMAM BREACH SEQUENCE ---');
    print('Current Phase: ${phase.toUpperCase()}');
    print('Phase Time: ${phaseTimer.toStringAsFixed(1)}s');
    print('');

    String statusText = '';
    String frameDesc = '';

    if (phase == "thermal_scan") {
      frameDesc = thermalAnim.getCurrentFrameDescription();
      statusText = "THERMAL SCAN: Detecting hostage signatures...";
      print('Display: Thermal Overlay (Reddish hues)');
    } else if (phase == "flashbang") {
      statusText = "FLASHBANG DEPLOYED";
      print('Display: Intense White Flash');
    } else if (phase == "breach") {
      frameDesc = breachAnim.getCurrentFrameDescription();
      statusText = "YAMAM BREACH IN PROGRESS...";
      print('Display: Yamam Operatives Breaching Door');
    } else if (phase == "extraction") {
      frameDesc = extractionAnim.getCurrentFrameDescription();
      statusText = "HOSTAGES SECURED - EXTRACTION UNDER FIRE";
      print('Display: Hostages Escorted, Heartbeat Monitor Pulsing');
    }

    print('Animation Frame: $frameDesc');
    print('');
    print(statusText);
    print('');
    print('MISSION TIME: ${phaseTimer.toInt()}s');
  }

  @override
  Future<void> handleInput(String input) async {
    print('Cinematic in progress. Please wait.');
  }
}

/// Climactic final scene with Zoe reunion.
class FinalLiberationScene extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  late DialogueSystem dialogue;
  late AnimationSystem animation;

  FinalLiberationScene(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Final Liberation Scene...');
    final dialogueLines = [
      "OISTARIAN: The silence ends here.",
      "Zoe: You were never just a shadow.",
      "OISTARIAN: I archived the pain. Now I choose the light.",
      "Zoe: Then let’s rewrite the legend. Together.",
      "System: Final Liberation protocol complete."
    ];
    dialogue = DialogueSystem(dialogueLines, 3.0);

    final animationFrames = List.generate(
        5, (i) => "Liberation Scene Frame ${i + 1} (OISTARIAN and Zoe)");
    animation = AnimationSystem(animationFrames, 0.3, loop: true);

    try {
      print("Music loaded: assets/reunion_theme.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for FinalLiberationScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    dialogue.update(dt);
    animation.update(dt);

    if (dialogue.complete && dialogue.timer > 2.0) {
      await sceneManager.switchScene("LegacyArchive");
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- FINAL LIBERATION ---');
    print('Scene: ${animation.getCurrentFrameDescription()}');
    print('');
    print('Dialogue:');
    print('  "${dialogue.getCurrentLine()}"');
    print('');
    if (dialogue.complete) {
      print('All dialogue complete. Press ENTER to proceed to Legacy Archive...');
    } else {
      print('Press SPACE to skip dialogue line.');
    }
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'space') {
      dialogue.skipToNext();
      if (dialogue.complete) {
        print('Dialogue skipped to end.');
      }
    } else if (dialogue.complete && input.toLowerCase() == 'enter') {
      await sceneManager.switchScene("LegacyArchive");
    } else {
      print('Invalid input. Use SPACE to advance dialogue.');
    }
  }
}

/// Interactive map of all 5 vault locations.
class VaultMapInterface extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  int selectedVault;
  final Map<String, Map<String, dynamic>> vaults = {
    "Vault Alpha": {
      "location": "Echo Swamp",
      "status": "Locked",
      "key": "Precision Analyzer",
      "description": "Wetlands facility hiding emotional resonance data"
    },
    "Vault Sigma": {
      "location": "Sterile Land",
      "status": "Unlocked",
      "key": "Ultra Analyzer",
      "description": "Decontaminated zone with neural processing cores"
    },
    "Vault Omega": {
      "location": "Agna Desert",
      "status": "Corrupted",
      "key": "Code Breaker",
      "description": "Desert outpost with damaged memory banks"
    },
    "Vault Zeta": {
      "location": "Fortress",
      "status": "Hidden",
      "key": "Neural Sync",
      "description": "Heavily fortified military installation"
    },
    "Vault Eden": {
      "location": "White-Night Gulch",
      "status": "Encrypted",
      "key": "Zoe's Echo",
      "description": "Final repository containing Zoe's memory fragments"
    }
  };
  late List<String> vaultList;

  VaultMapInterface(super.sceneManager) : selectedVault = 0 { // Calls super constructor
    vaultList = vaults.keys.toList();
  }

  @override
  Future<void> setup() async {
    print('Initializing Vault Map Interface...');
    setupComplete = true; // No assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No time-based updates.
  }

  @override
  void render() {
    clearConsole();
    print('--- OISTARIAN VAULT NETWORK ---');
    print('');
    print('----------------------------------------------------');
    print('|  VAULT NAME    | LOCATION          | STATUS     |');
    print('----------------------------------------------------');

    for (int i = 0; i < vaultList.length; i++) {
      final vaultName = vaultList[i];
      final vaultData = vaults[vaultName]!;
      final prefix = (i == selectedVault) ? '>>' : '  ';
      final suffix = (i == selectedVault) ? '<<' : '  ';
      final statusColor = _getStatusColor(vaultData['status'] as String);

      print(
          '$prefix ${vaultName.padRight(14)} | ${vaultData['location'].padRight(17)} | $statusColor${(vaultData['status'] as String).padRight(10)}${_resetColor()}$suffix');
    }
    print('----------------------------------------------------');
    print('');

    final selectedVaultName = vaultList[selectedVault];
    final selectedVaultData = vaults[selectedVaultName]!;

    print('--- SELECTED VAULT DETAILS ---');
    print('  Name: ${selectedVaultName}');
    print('  Location: ${selectedVaultData['location']}');
    print('  Status: ${selectedVaultData['status']}');
    print('  Required Key: ${selectedVaultData['key']}');
    print('  Description: ${selectedVaultData['description']}');
    print('');
    print('Instructions:');
    print('  LEFT/RIGHT arrow keys: Select vault');
    print('  ENTER: Access selected vault (if unlocked)');
    print('  ESC: Return to Tactical Briefing');
  }

  String _getStatusColor(String status) {
    switch (status) {
      case "Unlocked":
        return '\x1B[32m'; // Green
      case "Locked":
      return '\x1B[31m'; // Red
      case "Corrupted":
        return '\x1B[33m'; // Yellow
      case "Hidden":
        return '\x1B[37m'; // White
      case "Encrypted":
        return '\x1B[35m'; // Magenta
      default:
        return '\x1B[0m'; // Reset
    }
  }

  String _resetColor() {
    return '\x1B[0m'; // Reset color
  }

  @override
  Future<void> handleInput(String input) async {
    // For console, assume typing "left", "right", "enter", "esc"
    if (input.toLowerCase() == 'left') {
      selectedVault = (selectedVault - 1 + vaultList.length) % vaultList.length;
    } else if (input.toLowerCase() == 'right') {
      selectedVault = (selectedVault + 1) % vaultList.length;
    } else if (input.toLowerCase() == 'enter') {
      final selectedVaultName = vaultList[selectedVault];
      final selectedVaultData = vaults[selectedVaultName]!;
      if (selectedVaultData["status"] == "Unlocked") {
        print('Accessing ${selectedVaultName}...');
        // In a real game, this might transition to a specific vault scene
        await sceneManager.switchScene("NeuralGlassDecryption"); // Example transition
      } else {
        print('Access Denied: ${selectedVaultName} is ${selectedVaultData["status"]}.');
        print('Required key: ${selectedVaultData["key"]}');
      }
    } else if (input.toLowerCase() == 'esc') {
      print('Returning to Tactical Briefing.');
      await sceneManager.switchScene("TacticalBriefing");
    } else {
      print('Invalid input. Use LEFT/RIGHT, ENTER, or ESC.');
    }
  }
}

/// Mission briefing interface with intel and objectives.
class TacticalBriefingUI extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  final Map<String, dynamic> missionData = {
    "operation_name": "Operation Arnon",
    "location": "Nuseirat, Gaza",
    "objective": "Hostage Rescue & Memory Shard Retrieval",
    "hostages": ["Noa Argamani", "Almog Meir Jan", "Andrey Kozlov", "Shlomi Ziv"],
    "intel": [
      "Two separate civilian buildings",
      "Heavy Hamas defensive positions",
      "Biometric locks on holding cells",
      "Feint operations in Bureij and Deir al-Balah"
    ],
    "assets": [
      "Yamam tactical unit",
      "OISTARIAN neural link sync",
      "Echo Shield technology",
      "Emergency extraction vehicles"
    ],
    "risks": [
      "Civilian casualties",
      "Equipment failure under fire",
      "Emotional trigger protocols",
      "Memory shard instability"
    ]
  };

  String currentSection = "overview";
  final List<String> sections = ["overview", "intel", "assets", "risks"];
  int currentSectionIndex = 0;

  TacticalBriefingUI(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Tactical Briefing UI...');
    setupComplete = true; // No assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No time-based updates.
  }

  @override
  void render() {
    clearConsole();
    print('--- MOSSAD TACTICAL BRIEFING ---');
    print('');
    print('Operation: ${missionData['operation_name'].padRight(20)} AO: ${missionData['location']}');
    print('----------------------------------------------------');

    // Section tabs
    final tabLine = sections
        .map((s) => s.toUpperCase().padLeft(10).padRight(12))
        .toList();
    tabLine[currentSectionIndex] = '>>${tabLine[currentSectionIndex].trim()}<<';
    print(tabLine.join(' '));
    print('----------------------------------------------------');
    print('');

    // Content area
    switch (currentSection) {
      case "overview":
        _renderOverview();
        break;
      case "intel":
        _renderIntel();
        break;
      case "assets":
        _renderAssets();
        break;
      case "risks":
        _renderRisks();
        break;
    }
    print('');
    print('----------------------------------------------------');
    print('Controls: TAB: Switch sections | ENTER: Begin mission');
    print('          M: Vault map         | ESC: Main menu/Return');
    print('----------------------------------------------------');
  }

  void _renderOverview() {
    print('PRIMARY OBJECTIVE: ${missionData['objective']}');
    print('');
    print('TARGET HOSTAGES:');
    (missionData['hostages'] as List).forEach((h) => print('  • $h'));
    print('');
    print('MISSION TIMELINE:');
    print('  0400: Insert via Nuseirat breach');
    print('  0410: Sync with Yamam unit');
    print('  0420: Locate hostage positions');
    print('  0430: Simultaneous extraction');
    print('  0445: Emergency evac protocol');
  }

  void _renderIntel() {
    print('OPERATIONAL INTELLIGENCE:');
    (missionData['intel'] as List).forEach((i) => print('  ▶ $i'));
    print('');
    print('THREAT ASSESSMENT: HIGH');
    print('  • Enemy combatants: 15-20 Hamas operatives');
    print('  • Defensive positions: Rooftop and street level');
    print('  • Civilian presence: High risk of collateral damage');
    print('  • Escape routes: Limited due to urban environment');
  }

  void _renderAssets() {
    print('AVAILABLE ASSETS:');
    (missionData['assets'] as List).forEach((a) => print('  ✓ $a'));
    print('');
    print('OISTARIAN LOADOUT STATUS:');
    print('  ► Whisper & Roar: Operational (Thermal scope active)');
    print('  ► NeuroPulse Arm: Enhanced (Echo Shield integrated)');
    print('  ► Neural Interface: Synced with Yamam tactical net');
    print('  ► Emergency Beacon: Active (Zoe frequency locked)');
  }

  void _renderRisks() {
    print('RISK ASSESSMENT:');
    (missionData['risks'] as List).forEach((r) => print('  ⚠ $r'));
    print('');
    print('CONTINGENCY PROTOCOLS:');
    print('  • Equipment failure → Manual override via neural backup');
    print('  • Emotional trigger → Zoe echo stabilization protocol');
    print('  • Extraction compromise → Secondary evac route Alpha-7');
    print('  • Memory shard corruption → Emergency data reconstruction');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'tab') {
      currentSectionIndex = (currentSectionIndex + 1) % sections.length;
      currentSection = sections[currentSectionIndex];
    } else if (input.toLowerCase() == 'enter') {
      print('Initiating Operation Arnon...');
      await sceneManager.switchScene("YamamBreach");
    } else if (input.toLowerCase() == 'm') {
      print('Opening Vault Map...');
      await sceneManager.switchScene("VaultMap");
    } else if (input.toLowerCase() == 'esc') {
      print('Returning to Main Menu or previous context...');
      // For now, let's go back to a 'start' like scene, or exit
      await sceneManager.switchScene("VaultStartMission"); // Or a main menu scene
    } else {
      print('Invalid input. Use TAB, ENTER, M, or ESC.');
    }
  }
}

/// A scene for when Echo Shield is unlocked.
class EchoShieldUnlocked extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  EchoShieldUnlocked(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Echo Shield Unlocked scene...');
    setupComplete = true; // No assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // Short cinematic, then move on.
    await Future.delayed(const Duration(seconds: 3));
    await sceneManager.switchScene("EchoProtocol");
  }

  @override
  void render() {
    clearConsole();
    print('--- ECHO SHIELD UNLOCKED ---');
    print('');
    print('      _.-._');
    print('     / O O \\');
    print('    (   >   )');
    print('     \\  _  /');
    print('      `---`');
    print('');
    print('OISTARIAN: The voice is clear. The shield is active.');
    print('           Neural-spectral defenses online. Target acquired.');
    print('');
    print('System: Echo Shield Protocol - ACTIVE.');
    print('');
    print('Proceeding to Echo Protocol in 3 seconds...');
  }

  @override
  Future<void> handleInput(String input) async {
    print('This is a cinematic scene. Please wait.');
  }
}

/// A scene representing the Echo Protocol mission.
class EchoProtocol extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  EchoProtocol(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Echo Protocol scene...');
    setupComplete = true;
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // Simulate mission progression.
  }

  @override
  void render() {
    clearConsole();
    print('--- ECHO PROTOCOL IN PROGRESS ---');
    print('');
    print('You are now embedded with Mossad tactical units.');
    print('Objective: Retrieve memory shard tied to Zoe’s final message.');
    print('');
    print('Current Gear: Echo Shield Status: ${sceneManager.gameState.echoShieldActive ? "ACTIVE" : "INACTIVE"}');
    print('Voice Heard: ${sceneManager.gameState.voiceHeard ? "YES" : "NO"}');
    print('');
    print('Press "G" to check gear, "B" for tactical briefing, "D" to attempt decryption.');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'g') {
      print('Accessing Gear Upgrade UI...');
      await sceneManager.switchScene("GearUpgrade");
    } else if (input.toLowerCase() == 'b') {
      print('Reviewing Tactical Briefing...');
      await sceneManager.switchScene("TacticalBriefing");
    } else if (input.toLowerCase() == 'd') {
      print('Attempting Neural Glass Decryption...');
      await sceneManager.switchScene("NeuralGlassDecryption");
    } else {
      print('Invalid input. Please choose G, B, or D.');
    }
  }
}

/// A short scene after hostages are reunited.
class HostageReunion extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  HostageReunion(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Hostage Reunion scene...');
    setupComplete = true;
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    await Future.delayed(const Duration(seconds: 3)); // Short display
    await sceneManager.switchScene("FinalLiberation");
  }

  @override
  void render() {
    clearConsole();
    print('--- HOSTAGE REUNION ---');
    print('');
    print('    /\\__/\\');
    print('   ( o.o )');
    print('  / > O < \\');
    print(' /    ^    \\');
    print('(___/~~~\\___)');
    print('');
    print('The faces of the rescued. The sound of relief.');
    print('Hostages reunited. Zoe’s echo pulsing within the NeuroPulse Arm.');
    print('');
    print('System: Operation Arnon - Hostages SECURED.');
    print('');
    print('Proceeding to Final Liberation in 3 seconds...');
  }

  @override
  Future<void> handleInput(String input) async {
    print('Cinematic in progress. Please wait.');
  }
}

/// Scene for archiving OISTARIAN's legacy.
class LegacyArchive extends Scene { // Changed from implements to extends
  @override
  bool setupComplete = false;

  final List<String> logs = [
    "Legacy File: OISTARIAN",
    "Missions Completed: 47",
    "Cover Identity: Data Engineer",
    "True Role: Mossad Tactical Liaison",
    "Emotional Core: Zoe — Final Echo Synced",
    "Status: Returned Home. Legacy Archived."
  ];
  int currentIndex = 0;
  double timer = 0.0;

  LegacyArchive(super.sceneManager); // Calls super constructor

  @override
  Future<void> setup() async {
    print('Initializing Legacy Archive...');
    setupComplete = true;
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    timer += dt;
    if (timer > 1.5 && currentIndex < logs.length - 1) {
      currentIndex++;
      timer = 0.0;
    } else if (currentIndex == logs.length - 1 && timer > 3.0) {
      print('\nLegacy Archived. Game Over - Thank you for playing.');
      // In a real game, this might lead to credits or main menu
      await sceneManager.switchScene("VaultStartMission"); // Loop back for demonstration
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- LEGACY ARCHIVE ---');
    print('');
    print('Processing OISTARIAN\'s Operational Log...');
    print('-----------------------------------------');
    for (int i = 0; i <= currentIndex; i++) {
      print(logs[i]);
    }
    print('-----------------------------------------');
    print('');
    if (currentIndex < logs.length - 1) {
      print('Archiving data... please wait.');
    } else {
      print('Legacy Archiving Complete. Press ENTER to continue.');
    }
  }

  @override
  Future<void> handleInput(String input) async {
    if (currentIndex == logs.length - 1 && input.toLowerCase() == 'enter') {
      await sceneManager.switchScene("VaultStartMission");
    } else {
      print('Archiving in progress. Please wait.');
    }
  }
}

/// Helper class for simulating user actions in a non-interactive environment.
class SimulatedAction {
  final double delay; // Time in seconds before this action's input is processed
  final String input; // The simulated input string

  SimulatedAction(this.delay, this.input);
}

// --- Main Game Loop ---
Future<void> main() async {
  print('ZOE-FILE: Rise of OISTARIAN (Console Edition)\n');

  final gameState = GameState();
  await gameState.loadState('gamestate.json'); // Attempt to load previous state

  // Force starting intro scene for the demo flow if it's the very first run
  if (gameState.currentScene == "VaultOfEchoes") {
    gameState.currentScene = "VaultStartMission";
  }

  final sceneManager = SceneManager(gameState);

  // Register all scenes
  sceneManager.registerScene("VaultStartMission", VaultStartMission(sceneManager));
  sceneManager.registerScene("VaultOfEchoes", VaultOfEchoesScene(sceneManager));
  sceneManager.registerScene("ZoesSilence", ZoesSilenceScene(sceneManager));
  sceneManager.registerScene("GearUpgrade", GearUpgradeUI(sceneManager));
  sceneManager.registerScene("NeuralGlassDecryption", NeuralGlassDecryption(sceneManager));
  sceneManager.registerScene("YamamBreach", YamamBreachScene(sceneManager));
  sceneManager.registerScene("FinalLiberation", FinalLiberationScene(sceneManager));
  sceneManager.registerScene("VaultMap", VaultMapInterface(sceneManager));
  sceneManager.registerScene("TacticalBriefing", TacticalBriefingUI(sceneManager));
  sceneManager.registerScene("EchoShieldUnlocked", EchoShieldUnlocked(sceneManager));
  sceneManager.registerScene("EchoProtocol", EchoProtocol(sceneManager));
  sceneManager.registerScene("HostageReunion", HostageReunion(sceneManager));
  sceneManager.registerScene("LegacyArchive", LegacyArchive(sceneManager));

  // Start with the scene from the loaded game state, or default to intro.
  await sceneManager.switchScene(gameState.currentScene);

  // Define a sequence of simulated actions to demonstrate game flow
  final List<SimulatedAction> actions = [
    // VaultStartMission (auto-transitions after 4s)
    SimulatedAction(5.0, ''), // Wait for VaultStartMission to finish transition

    // VaultOfEchoes (input 'T' transitions to EchoShieldUnlocked)
    SimulatedAction(1.0, 'T'), // Trust the voice

    // EchoShieldUnlocked (auto-transitions after 3s)
    SimulatedAction(4.0, ''), // Wait for EchoShieldUnlocked to proceed

    // EchoProtocol (input 'D' transitions to NeuralGlassDecryption)
    SimulatedAction(1.0, 'D'),

    // NeuralGlassDecryption (pre-solved, just needs 'enter' to proceed)
    SimulatedAction(1.0, 'enter'), // Complete decryption

    // FinalLiberationScene (auto-advances through dialogue, then to LegacyArchive)
    SimulatedAction(1.0, 'space'), // Skip dialogue line 1
    SimulatedAction(1.0, 'space'), // Skip dialogue line 2
    SimulatedAction(1.0, 'space'), // Skip dialogue line 3
    SimulatedAction(1.0, 'space'), // Skip dialogue line 4
    SimulatedAction(1.0, 'space'), // Skip dialogue line 5 (dialogue complete)
    SimulatedAction(4.0, 'enter'), // Wait for final transition message, then proceed

    // LegacyArchive (auto-advances logs, then needs 'enter' to loop back/finish)
    SimulatedAction(6.0, 'enter'), // Wait for logs to display, then 'enter' to restart demo
  ];

  const double targetFrameRate = 60.0;
  const double frameDuration = 1.0 / targetFrameRate; // ~0.0166 seconds per frame

  for (final action in actions) {
    double timeToAdvance = action.delay;
    while (timeToAdvance > 0) {
      double dt = min(frameDuration, timeToAdvance);
      if (dt <= 0) break; // Ensure positive dt to prevent infinite loop

      sceneManager.render(); // Render current state
      await Future.delayed(Duration(milliseconds: (dt * 1000).round())); // Simulate frame time
      await sceneManager.update(dt); // Update game logic

      timeToAdvance -= dt;
    }

    // After the delay, apply the simulated input
    if (action.input.isNotEmpty) {
      print('\n--- USER INPUT SIMULATED: "${action.input}" ---\n');
      await sceneManager.handleInput(action.input);
      // Give a small pause for scene reaction and rendering
      await Future.delayed(const Duration(milliseconds: 500));
    }
  }

  print('\n--- DEMO COMPLETE ---');
  await gameState.saveState('gamestate.json'); // Simulate final save
}
import 'dart:async';
import 'dart:math';

// --- Console Utilities ---
/// Provides ANSI escape codes for console text coloring.
class ConsoleColors {
  static const String RESET = '\x1B[0m';
  static const String BLACK = '\x1B[30m';
  static const String RED = '\x1B[31m';
  static const String GREEN = '\x1B[32m';
  static const String YELLOW = '\x1B[33m';
  static const String BLUE = '\x1B[34m';
  static const String MAGENTA = '\x1B[35m';
  static const String CYAN = '\x1B[36m';
  static const String WHITE = '\x1B[37m';
}

// --- GameState Class ---
/// Central game state management for OISTARIAN's journey.
class GameState {
  int trustScore;
  bool voiceHeard;
  int missionsCompleted;
  bool echoShieldActive;
  bool finalLiberationUnlocked;
  String currentScene;

  GameState({
    this.trustScore = 82,
    this.voiceHeard = false,
    this.missionsCompleted = 47,
    this.echoShieldActive = false,
    this.finalLiberationUnlocked = false,
    this.currentScene = "VaultOfEchoes",
  });

  /// Saves the current game state.
  /// (File operations are not supported in this environment, skipping save.)
  Future<void> saveState(String filename) async {
    print('Simulating save: Game state would be saved to $filename');
    // Actual file saving logic removed due to environment constraints.
  }

  /// Loads game state. If not found, uses default state.
  /// (File operations are not supported in this environment, using default state.)
  Future<void> loadState(String filename) async {
    print('Simulating load: Attempting to load game state from $filename (using default state due to environment constraints).');
    // Actual file loading logic removed due to environment constraints.
    // Ensure default state is set if no loading happens.
    trustScore = 82;
    voiceHeard = false;
    missionsCompleted = 47;
    echoShieldActive = false;
    finalLiberationUnlocked = false;
    currentScene = "VaultOfEchoes";
  }
}

// --- Scene Management ---

/// Abstract base class for all game scenes.
abstract class Scene {
  final SceneManager sceneManager;
  bool setupComplete = false;

  Scene(this.sceneManager);

  /// Initializes scene resources. Simulates asset loading.
  Future<void> setup();

  /// Updates scene logic based on delta time.
  Future<void> update(double dt);

  /// Renders the scene to the console.
  void render();

  /// Handles user input for the scene.
  Future<void> handleInput(String input);

  /// Clears the console screen by printing newlines.
  /// This is a cross-platform workaround for console clearing
  /// without relying on platform-specific commands.
  void clearConsole() {
    print('\n' * 50); // Print 50 newlines to push content up and 'clear' the screen
  }
}

/// Manages scene transitions and game flow.
class SceneManager {
  final Map<String, Scene> scenes = {};
  Scene? currentScene;
  final GameState gameState;

  SceneManager(this.gameState);

  /// Registers a scene with the manager.
  void registerScene(String name, Scene scene) {
    scenes[name] = scene;
  }

  /// Switches to a different scene by name.
  Future<void> switchScene(String sceneName) async {
    if (scenes.containsKey(sceneName)) {
      currentScene = scenes[sceneName];
      gameState.currentScene = sceneName;
      print('\n--- Switching to scene: ${sceneName.toUpperCase()} ---');
      await currentScene!.setup();
    } else {
      print('Error: Scene "$sceneName" not found!');
    }
  }

  /// Updates the current scene.
  Future<void> update(double dt) async {
    if (currentScene != null) {
      await currentScene!.update(dt);
    }
  }

  /// Renders the current scene.
  void render() {
    if (currentScene != null) {
      currentScene!.render();
    }
  }

  /// Handles events for the current scene.
  Future<void> handleInput(String input) async {
    if (currentScene != null) {
      await currentScene!.handleInput(input);
    }
  }
}

// --- Helper Systems ---

/// Simulates frame-based animations by printing text.
class AnimationSystem {
  final List<String> frameDescriptions;
  final double frameDuration;
  int currentFrame;
  double timer;
  bool playing;
  bool loop;

  AnimationSystem(this.frameDescriptions, this.frameDuration,
      {this.loop = true})
      : currentFrame = 0,
        timer = 0.0,
        playing = true;

  void update(double dt) {
    if (!playing || frameDescriptions.isEmpty) {
      return;
    }

    timer += dt;
    if (timer >= frameDuration) {
      currentFrame += 1;
      timer = 0.0;

      if (currentFrame >= frameDescriptions.length) {
        if (loop) {
          currentFrame = 0;
        } else {
          currentFrame = frameDescriptions.length - 1;
          playing = false;
        }
      }
    }
  }

  String getCurrentFrameDescription() {
    if (frameDescriptions.isNotEmpty &&
        currentFrame >= 0 &&
        currentFrame < frameDescriptions.length) {
      return frameDescriptions[currentFrame];
    }
    return 'Empty animation frame';
  }

  void reset() {
    currentFrame = 0;
    timer = 0.0;
    playing = true;
  }
}

/// Manages dialogue sequences with timing.
class DialogueSystem {
  final List<String> dialogueLines;
  final double lineDuration;
  int currentLine;
  double timer;
  bool complete;

  DialogueSystem(this.dialogueLines, this.lineDuration)
      : currentLine = 0,
        timer = 0.0,
        complete = false;

  void update(double dt) {
    if (complete) {
      return;
    }

    timer += dt;
    if (timer >= lineDuration) {
      currentLine += 1;
      timer = 0.0;

      if (currentLine >= dialogueLines.length) {
        complete = true;
        currentLine = dialogueLines.length - 1; // Stay on last line
      }
    }
  }

  String getCurrentLine() {
    if (currentLine >= 0 && currentLine < dialogueLines.length) {
      return dialogueLines[currentLine];
    }
    return '';
  }

  void skipToNext() {
    if (!complete) {
      currentLine += 1;
      timer = 0.0; // Reset timer for next line
      if (currentLine >= dialogueLines.length) {
        complete = true;
        currentLine = dialogueLines.length - 1;
      }
    }
  }
}

// --- Scene Implementations ---

/// Cinematic start to the Vault mission with fade-in and voiceover.
class VaultStartMission extends Scene {
  @override
  bool setupComplete = false;

  double timer = 0;
  int alpha = 255; // Simulates fade
  bool voicePlayed = false;
  String voiceClipStatus = "Loading...";

  VaultStartMission(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Simulating loading assets for VaultStartMission...');
    // Simulate loading voice clip
    try {
      voiceClipStatus = "Voice clip loaded: assets/start_mission_voice.wav";
      setupComplete = true;
    } catch (e) {
      voiceClipStatus = "Voice clip failed to load.";
      print("Warning: $voiceClipStatus - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50)); // Small delay for setup
  }

  @override
  Future<void> update(double dt) async {
    timer += dt;
    if (timer > 0.5 && !voicePlayed && setupComplete) {
      print('>> Playing: "MISSION START" voiceover <<');
      voicePlayed = true;
    }
    if (alpha > 0) {
      alpha = max(0, alpha - (60 * dt).toInt()); // Simulate fade
    }
    if (timer > 4) {
      await sceneManager.switchScene("VaultOfEchoes");
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- VAULT START MISSION ---');
    print('');
    print('Screen fading in. Alpha: $alpha/255');
    print('');
    print('MISSION START: Infiltrate the Vault of Echoes');
    print('');
    if (voicePlayed) {
      print('>> Voiceover playing: "$voiceClipStatus" <<');
    } else {
      print('>> Preparing voiceover <<');
    }
    print('');
    print('Mission will proceed shortly...');
  }

  @override
  Future<void> handleInput(String input) async {
    // No interaction; it's a cinematic
    print("This is a cinematic sequence. No interaction needed.");
  }
}

/// Main vault infiltration scene.
class VaultOfEchoesScene extends Scene {
  @override
  bool setupComplete = false;

  VaultOfEchoesScene(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Simulating loading assets for VaultOfEchoesScene...');
    try {
      // Simulate loading image and sound.
      print("Background loaded: assets/vault_bg.jpg");
      print("Voice clip loaded: assets/voice_whisper.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for VaultOfEchoesScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // Add dynamic lighting or heartbeat pulse simulation here if desired.
  }

  @override
  void render() {
    clearConsole();
    print('--- VAULT OF ECHOES ---');
    if (setupComplete) {
      print('Background: Vault Core Chamber');
    } else {
      print('Background: Generic Dark Chamber');
    }
    print('');
    print('The Vault awaits. Do you trust the voice?');
    print('');
    print('Instructions:');
    print("  'T' to Trust the Voice (requires Trust Score > 80)");
    print("  'S' to Silence the Voice");
    print('');
    print('Current Trust Score: ${sceneManager.gameState.trustScore}');
    print('Voice Heard Status: ${sceneManager.gameState.voiceHeard}');
  }

  @override
  Future<void> handleInput(String input) async {
    final trustScore = sceneManager.gameState.trustScore;

    if (input.toLowerCase() == 't') {
      if (trustScore > 80) {
        sceneManager.gameState.voiceHeard = true;
        sceneManager.gameState.echoShieldActive = true;
        print('>> You trust the voice. Activating Echo Shield. <<');
        if (setupComplete) {
          print('>> Playing: "whisper" voice clip <<');
        }
        await sceneManager.switchScene("EchoShieldUnlocked");
      } else {
        print('Your trust score is too low to fully trust the voice.');
      }
    } else if (input.toLowerCase() == 's') {
      sceneManager.gameState.finalLiberationUnlocked = false; // Locks it
      print('>> You chose to silence the voice. Final Liberation protocol locked. <<');
      await sceneManager.switchScene("ZoesSilence");
    } else {
      print('Invalid input. Please choose "T" or "S".');
    }
  }
}

/// Emotional corridor scene with Zoe's memory.
class ZoesSilenceScene extends Scene {
  @override
  bool setupComplete = false;

  bool playedClip = false;

  ZoesSilenceScene(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Simulating loading assets for ZoesSilenceScene...');
    try {
      print("Background loaded: assets/zoe_corridor.jpg");
      print("Voice clip loaded: assets/zoe_voicemail.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for ZoesSilenceScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No specific time-based updates for this scene's logic.
  }

  @override
  void render() {
    clearConsole();
    print('--- ZOE\'S SILENCE ---');
    if (setupComplete) {
      print('Background: Dusty Corridor, A Child\'s Shadow');
    } else {
      print('Background: Empty Room');
    }
    print('');
    print('The corridor. The child. The silence.');
    print('');
    if (!playedClip) {
      print("Instructions: Press 'V' to play Zoe's voicemail.");
    } else {
      print("Instructions: Press 'E' to continue to Echo Protocol.");
      print('Zoe\'s voicemail has been played.');
    }
    print('');
    print('Voice Heard Status (after choice): ${sceneManager.gameState.voiceHeard}');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'v' && !playedClip) {
      if (setupComplete) {
        print('>> Playing: "Zoe\'s voicemail" <<');
      } else {
        print('>> Simulating playing Zoe\'s voicemail (assets not loaded) <<');
      }
      playedClip = true;
      sceneManager.gameState.voiceHeard = true; // Playing the voicemail changes this
      print('Zoe\'s voicemail played. You have acknowledged her echo.');
    } else if (input.toLowerCase() == 'e' && playedClip) {
      print('Proceeding to Echo Protocol...');
      await sceneManager.switchScene("EchoProtocol");
    } else if (input.toLowerCase() == 'v' && playedClip) {
      print('Voicemail already played.');
    } else {
      print('Invalid input. Follow the instructions.');
    }
  }
}

/// Tactical gear management interface.
class GearUpgradeUI extends Scene {
  @override
  bool setupComplete = false;

  final Map<String, Map<String, dynamic>> gear = const {
    "Whisper & Roar": {
      "level": 2,
      "mods": ["thermal_scope", "sound_suppressor"]
    },
    "NeuroPulse Arm": {
      "level": 3,
      "mods": ["shock_pulse", "grapple_hook", "echo_shield"]
    }
  };

  GearUpgradeUI(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing GearUpgradeUI...');
    setupComplete = true; // No external assets to load for this UI
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No time-based updates for a static UI.
  }

  @override
  void render() {
    clearConsole();
    print('--- OISTARIAN GEAR LOADOUT ---');
    print('');
    print('----------------------------------');
    for (var entry in gear.entries) {
      final gearName = entry.key;
      final stats = entry.value;
      print('$gearName - Level ${stats["level"]}');
      print('  Mods: ${(stats["mods"] as List).join(', ')}');
      print('----------------------------------');
    }
    print('');
    print('Current game state info:');
    print('  Echo Shield Active: ${sceneManager.gameState.echoShieldActive}');
    print('  Final Liberation Unlocked: ${sceneManager.gameState.finalLiberationUnlocked}');
    print('');
    print('Instructions: Press ESC to return to Tactical Briefing.');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'esc') {
      print('Exiting Gear Upgrade UI.');
      await sceneManager.switchScene("EchoProtocol");
    } else {
      print('Invalid input. Press ESC to return.');
    }
  }
}

/// Mini-game for decrypting Zoe's memory shard.
class NeuralGlassDecryption extends Scene {
  @override
  bool setupComplete = false;

  List<int> glyphs;
  final List<int> target;
  int selected;
  double timer;
  bool success;
  bool gameOver;

  NeuralGlassDecryption(super.sceneManager)
      : target = const [3, 7, 2, 5, 1], // Zoe's emotional frequency
        glyphs = [3, 7, 2, 5, 1], // Pre-solved for demo purposes
        selected = 0,
        timer = 60.0,
        success = false,
        gameOver = false;

  @override
  Future<void> setup() async {
    print('Initializing Neural Glass Decryption mini-game...');
    // If the game is just starting, reset glyphs to random,
    // otherwise if coming back to it, keep current.
    success = (glyphs.toString() == target.toString()); // Mark as success immediately
    gameOver = success; // End game if already successful
    setupComplete = true; // No external assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    if (gameOver) return;

    // Check for success immediately if glyphs match
    if (glyphs.toString() == target.toString()) {
      success = true;
      gameOver = true;
      print('\nDECRYPTION SUCCESSFUL!');
      return; // Stop processing timer
    }

    timer -= dt;
    if (timer <= 0) {
      gameOver = true;
      print('\nTIME UP!');
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- NEURAL GLASS DECRYPTION ---');
    print('');
    print('Objective: Align emotional frequencies to decode Zoe\'s memory shard.');
    print('Time Remaining: ${timer.toInt()}s');
    print('');
    print('Glyphs:');
    print('  ${glyphs.map((g) => g.toString().padLeft(2, '0')).join(' ')}');
    print('  ${'  ' * selected}^^'); // Indicator for selected glyph
    print('');
    if (gameOver) {
      if (success) {
        print('Result: DECRYPTION SUCCESSFUL - Zoe\'s echo unlocked.');
      } else {
        print('Result: DECRYPTION FAILED - Memory shard destabilized.');
      }
      print('Press ENTER to continue...');
    } else {
      print('Instructions:');
      print("  LEFT/RIGHT arrow keys: Select glyph");
      print("  UP/DOWN arrow keys: Adjust glyph value");
    }
  }

  @override
  Future<void> handleInput(String input) async {
    if (gameOver) {
      if (input.toLowerCase() == 'enter') {
        if (success) {
          sceneManager.gameState.finalLiberationUnlocked = true;
          print('Final Liberation protocol unlocked!');
          await sceneManager.switchScene("FinalLiberation");
        } else {
          print('Decryption failed. Returning to a previous state or main menu...');
          await sceneManager.switchScene("TacticalBriefing"); // Or another scene
        }
      }
      return;
    }

    // Basic interpretation of arrow keys for console input.
    if (input.toLowerCase() == 'left') {
      selected = (selected - 1 + glyphs.length) % glyphs.length;
    } else if (input.toLowerCase() == 'right') {
      selected = (selected + 1) % glyphs.length;
    } else if (input.toLowerCase() == 'up') {
      glyphs[selected] = (glyphs[selected] + 1) % 10;
    } else if (input.toLowerCase() == 'down') {
      glyphs[selected] = (glyphs[selected] - 1 + 10) % 10;
    } else {
      print('Invalid input for decryption mini-game.');
    }
  }
}

/// Tactical breach sequence with Yamam unit.
class YamamBreachScene extends Scene {
  @override
  bool setupComplete = false;

  String phase = "thermal_scan";
  double phaseTimer = 0.0;
  late final AnimationSystem thermalAnim;
  late final AnimationSystem breachAnim;
  late final AnimationSystem extractionAnim;

  YamamBreachScene(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Yamam Breach Sequence...');
    thermalAnim = AnimationSystem(
        const ["Thermal scan frame 1", "Thermal scan frame 2", "Thermal scan frame 3"],
        0.5,
        loop: true);
    breachAnim = AnimationSystem(const [
      "Breach frame 1",
      "Breach frame 2",
      "Breach frame 3",
      "Breach frame 4",
      "Breach frame 5"
    ], 0.2, loop: true);
    extractionAnim = AnimationSystem(const [
      "Extraction frame 1",
      "Extraction frame 2",
      "Extraction frame 3"
    ], 0.4, loop: true);

    try {
      print("Sound loaded: assets/flashbang.wav");
      print("Sound loaded: assets/breach_audio.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for YamamBreachScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    phaseTimer += dt;

    if (phase == "thermal_scan") {
      thermalAnim.update(dt);
      if (phaseTimer > 3.0) {
        phase = "flashbang";
        phaseTimer = 0.0;
        if (setupComplete) {
          print('>> Playing: Flashbang sound <<');
        }
      }
    } else if (phase == "flashbang") {
      if (phaseTimer > 0.5) {
        phase = "breach";
        phaseTimer = 0.0;
        if (setupComplete) {
          print('>> Playing: Breach sound <<');
        }
      }
    } else if (phase == "breach") {
      breachAnim.update(dt);
      if (phaseTimer > 4.0) {
        phase = "extraction";
        phaseTimer = 0.0;
      }
    } else if (phase == "extraction") {
      extractionAnim.update(dt);
      if (phaseTimer > 6.0) {
        await sceneManager.switchScene("HostageReunion");
      }
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- YAMAM BREACH SEQUENCE ---');
    print('Current Phase: ${phase.toUpperCase()}');
    print('Phase Time: ${phaseTimer.toStringAsFixed(1)}s');
    print('');

    String statusText = '';
    String frameDesc = '';

    if (phase == "thermal_scan") {
      frameDesc = thermalAnim.getCurrentFrameDescription();
      statusText = "THERMAL SCAN: Detecting hostage signatures...";
      print('Display: Thermal Overlay (Reddish hues)');
    } else if (phase == "flashbang") {
      statusText = "FLASHBANG DEPLOYED";
      print('Display: Intense White Flash');
    } else if (phase == "breach") {
      frameDesc = breachAnim.getCurrentFrameDescription();
      statusText = "YAMAM BREACH IN PROGRESS...";
      print('Display: Yamam Operatives Breaching Door');
    } else if (phase == "extraction") {
      frameDesc = extractionAnim.getCurrentFrameDescription();
      statusText = "HOSTAGES SECURED - EXTRACTION UNDER FIRE";
      print('Display: Hostages Escorted, Heartbeat Monitor Pulsing');
    }

    print('Animation Frame: $frameDesc');
    print('');
    print(statusText);
    print('');
    print('MISSION TIME: ${phaseTimer.toInt()}s');
  }

  @override
  Future<void> handleInput(String input) async {
    print('Cinematic in progress. Please wait.');
  }
}

/// Climactic final scene with Zoe reunion.
class FinalLiberationScene extends Scene {
  @override
  bool setupComplete = false;

  late final DialogueSystem dialogue;
  late final AnimationSystem animation;

  FinalLiberationScene(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Final Liberation Scene...');
    final dialogueLines = const [
      "OISTARIAN: The silence ends here.",
      "Zoe: You were never just a shadow.",
      "OISTARIAN: I archived the pain. Now I choose the light.",
      "Zoe: Then let’s rewrite the legend. Together.",
      "System: Final Liberation protocol complete."
    ];
    dialogue = DialogueSystem(dialogueLines, 3.0);

    final animationFrames = List.generate(
        5, (i) => "Liberation Scene Frame ${i + 1} (OISTARIAN and Zoe)");
    animation = AnimationSystem(animationFrames, 0.3, loop: true);

    try {
      print("Music loaded: assets/reunion_theme.wav");
      setupComplete = true;
    } catch (e) {
      print("Warning: Asset loading failed for FinalLiberationScene - $e");
    }
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    dialogue.update(dt);
    animation.update(dt);

    if (dialogue.complete && dialogue.timer > 2.0) {
      await sceneManager.switchScene("LegacyArchive");
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- FINAL LIBERATION ---');
    print('Scene: ${animation.getCurrentFrameDescription()}');
    print('');
    print('Dialogue:');
    print('  "${dialogue.getCurrentLine()}"');
    print('');
    if (dialogue.complete) {
      print('All dialogue complete. Press ENTER to proceed to Legacy Archive...');
    } else {
      print('Press SPACE to skip dialogue line.');
    }
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'space') {
      dialogue.skipToNext();
      if (dialogue.complete) {
        print('Dialogue skipped to end.');
      }
    } else if (dialogue.complete && input.toLowerCase() == 'enter') {
      await sceneManager.switchScene("LegacyArchive");
    } else {
      print('Invalid input. Use SPACE to advance dialogue.');
    }
  }
}

/// Interactive map of all 5 vault locations.
class VaultMapInterface extends Scene {
  @override
  bool setupComplete = false;

  int selectedVault;
  final Map<String, Map<String, dynamic>> vaults = const {
    "Vault Alpha": {
      "location": "Echo Swamp",
      "status": "Locked",
      "key": "Precision Analyzer",
      "description": "Wetlands facility hiding emotional resonance data"
    },
    "Vault Sigma": {
      "location": "Sterile Land",
      "status": "Unlocked",
      "key": "Ultra Analyzer",
      "description": "Decontaminated zone with neural processing cores"
    },
    "Vault Omega": {
      "location": "Agna Desert",
      "status": "Corrupted",
      "key": "Code Breaker",
      "description": "Desert outpost with damaged memory banks"
    },
    "Vault Zeta": {
      "location": "Fortress",
      "status": "Hidden",
      "key": "Neural Sync",
      "description": "Heavily fortified military installation"
    },
    "Vault Eden": {
      "location": "White-Night Gulch",
      "status": "Encrypted",
      "key": "Zoe's Echo",
      "description": "Final repository containing Zoe's memory fragments"
    }
  };
  late final List<String> vaultList;

  VaultMapInterface(super.sceneManager) : selectedVault = 0 {
    vaultList = vaults.keys.toList();
  }

  @override
  Future<void> setup() async {
    print('Initializing Vault Map Interface...');
    setupComplete = true; // No assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No time-based updates.
  }

  @override
  void render() {
    clearConsole();
    print('--- OISTARIAN VAULT NETWORK ---');
    print('');
    print('----------------------------------------------------');
    print('|  VAULT NAME    | LOCATION          | STATUS     |');
    print('----------------------------------------------------');

    for (int i = 0; i < vaultList.length; i++) {
      final vaultName = vaultList[i];
      final vaultData = vaults[vaultName]!;
      final prefix = (i == selectedVault) ? '>>' : '  ';
      final suffix = (i == selectedVault) ? '<<' : '  ';
      final statusColor = _getStatusColor(vaultData['status'] as String);

      print(
          '$prefix ${vaultName.padRight(14)} | ${vaultData['location'].padRight(17)} | $statusColor${(vaultData['status'] as String).padRight(10)}${ConsoleColors.RESET}$suffix');
    }
    print('----------------------------------------------------');
    print('');

    final selectedVaultName = vaultList[selectedVault];
    final selectedVaultData = vaults[selectedVaultName]!;

    print('--- SELECTED VAULT DETAILS ---');
    print('  Name: $selectedVaultName');
    print('  Location: ${selectedVaultData['location']}');
    print('  Status: ${selectedVaultData['status']}');
    print('  Required Key: ${selectedVaultData['key']}');
    print('  Description: ${selectedVaultData['description']}');
    print('');
    print('Instructions:');
    print('  LEFT/RIGHT arrow keys: Select vault');
    print('  ENTER: Access selected vault (if unlocked)');
    print('  ESC: Return to Tactical Briefing');
  }

  String _getStatusColor(String status) {
    switch (status) {
      case "Unlocked":
        return ConsoleColors.GREEN;
      case "Locked":
        return ConsoleColors.RED;
      case "Corrupted":
        return ConsoleColors.YELLOW;
      case "Hidden":
        return ConsoleColors.WHITE;
      case "Encrypted":
        return ConsoleColors.MAGENTA;
      default:
        return ConsoleColors.RESET;
    }
  }

  @override
  Future<void> handleInput(String input) async {
    // For console, assume typing "left", "right", "enter", "esc"
    if (input.toLowerCase() == 'left') {
      selectedVault = (selectedVault - 1 + vaultList.length) % vaultList.length;
    } else if (input.toLowerCase() == 'right') {
      selectedVault = (selectedVault + 1) % vaultList.length;
    } else if (input.toLowerCase() == 'enter') {
      final selectedVaultName = vaultList[selectedVault];
      final selectedVaultData = vaults[selectedVaultName]!;
      if (selectedVaultData["status"] == "Unlocked") {
        print('Accessing $selectedVaultName...');
        // In a real game, this might transition to a specific vault scene
        await sceneManager.switchScene("NeuralGlassDecryption"); // Example transition
      } else {
        print('Access Denied: $selectedVaultName is ${selectedVaultData["status"]}.');
        print('Required key: ${selectedVaultData["key"]}');
      }
    } else if (input.toLowerCase() == 'esc') {
      print('Returning to Tactical Briefing.');
      await sceneManager.switchScene("TacticalBriefing");
    } else {
      print('Invalid input. Use LEFT/RIGHT, ENTER, or ESC.');
    }
  }
}

/// Mission briefing interface with intel and objectives.
class TacticalBriefingUI extends Scene {
  @override
  bool setupComplete = false;

  final Map<String, dynamic> missionData = const {
    "operation_name": "Operation Arnon",
    "location": "Nuseirat, Gaza",
    "objective": "Hostage Rescue & Memory Shard Retrieval",
    "hostages": ["Noa Argamani", "Almog Meir Jan", "Andrey Kozlov", "Shlomi Ziv"],
    "intel": [
      "Two separate civilian buildings",
      "Heavy Hamas defensive positions",
      "Biometric locks on holding cells",
      "Feint operations in Bureij and Deir al-Balah"
    ],
    "assets": [
      "Yamam tactical unit",
      "OISTARIAN neural link sync",
      "Echo Shield technology",
      "Emergency extraction vehicles"
    ],
    "risks": [
      "Civilian casualties",
      "Equipment failure under fire",
      "Emotional trigger protocols",
      "Memory shard instability"
    ]
  };

  String currentSection = "overview";
  final List<String> sections = const ["overview", "intel", "assets", "risks"];
  int currentSectionIndex = 0;

  TacticalBriefingUI(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Tactical Briefing UI...');
    setupComplete = true; // No assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // No time-based updates.
  }

  @override
  void render() {
    clearConsole();
    print('--- MOSSAD TACTICAL BRIEFING ---');
    print('');
    print('Operation: ${missionData['operation_name'].padRight(20)} AO: ${missionData['location']}');
    print('----------------------------------------------------');

    // Section tabs
    final tabLine = sections
        .map((s) => s.toUpperCase().padLeft(10).padRight(12))
        .toList();
    tabLine[currentSectionIndex] = '>>${tabLine[currentSectionIndex].trim()}<<';
    print(tabLine.join(' '));
    print('----------------------------------------------------');
    print('');

    // Content area
    switch (currentSection) {
      case "overview":
        _renderOverview();
        break;
      case "intel":
        _renderIntel();
        break;
      case "assets":
        _renderAssets();
        break;
      case "risks":
        _renderRisks();
        break;
    }
    print('');
    print('----------------------------------------------------');
    print('Controls: TAB: Switch sections | ENTER: Begin mission');
    print('          M: Vault map         | ESC: Main menu/Return');
    print('----------------------------------------------------');
  }

  void _renderOverview() {
    print('PRIMARY OBJECTIVE: ${missionData['objective']}');
    print('');
    print('TARGET HOSTAGES:');
    (missionData['hostages'] as List).forEach((h) => print('  • $h'));
    print('');
    print('MISSION TIMELINE:');
    print('  0400: Insert via Nuseirat breach');
    print('  0410: Sync with Yamam unit');
    print('  0420: Locate hostage positions');
    print('  0430: Simultaneous extraction');
    print('  0445: Emergency evac protocol');
  }

  void _renderIntel() {
    print('OPERATIONAL INTELLIGENCE:');
    (missionData['intel'] as List).forEach((i) => print('  ▶ $i'));
    print('');
    print('THREAT ASSESSMENT: HIGH');
    print('  • Enemy combatants: 15-20 Hamas operatives');
    print('  • Defensive positions: Rooftop and street level');
    print('  • Civilian presence: High risk of collateral damage');
    print('  • Escape routes: Limited due to urban environment');
  }

  void _renderAssets() {
    print('AVAILABLE ASSETS:');
    (missionData['assets'] as List).forEach((a) => print('  ✓ $a'));
    print('');
    print('OISTARIAN LOADOUT STATUS:');
    print('  ► Whisper & Roar: Operational (Thermal scope active)');
    print('  ► NeuroPulse Arm: Enhanced (Echo Shield integrated)');
    print('  ► Neural Interface: Synced with Yamam tactical net');
    print('  ► Emergency Beacon: Active (Zoe frequency locked)');
  }

  void _renderRisks() {
    print('RISK ASSESSMENT:');
    (missionData['risks'] as List).forEach((r) => print('  ⚠ $r'));
    print('');
    print('CONTINGENCY PROTOCOLS:');
    print('  • Equipment failure → Manual override via neural backup');
    print('  • Emotional trigger → Zoe echo stabilization protocol');
    print('  • Extraction compromise → Secondary evac route Alpha-7');
    print('  • Memory shard corruption → Emergency data reconstruction');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'tab') {
      currentSectionIndex = (currentSectionIndex + 1) % sections.length;
      currentSection = sections[currentSectionIndex];
    } else if (input.toLowerCase() == 'enter') {
      print('Initiating Operation Arnon...');
      await sceneManager.switchScene("YamamBreach");
    } else if (input.toLowerCase() == 'm') {
      print('Opening Vault Map...');
      await sceneManager.switchScene("VaultMap");
    } else if (input.toLowerCase() == 'esc') {
      print('Returning to Main Menu or previous context...');
      // For now, let's go back to a 'start' like scene, or exit
      await sceneManager.switchScene("VaultStartMission"); // Or a main menu scene
    } else {
      print('Invalid input. Use TAB, ENTER, M, or ESC.');
    }
  }
}

/// A scene for when Echo Shield is unlocked.
class EchoShieldUnlocked extends Scene {
  @override
  bool setupComplete = false;

  EchoShieldUnlocked(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Echo Shield Unlocked scene...');
    setupComplete = true; // No assets
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // Short cinematic, then move on.
    await Future.delayed(const Duration(seconds: 3));
    await sceneManager.switchScene("EchoProtocol");
  }

  @override
  void render() {
    clearConsole();
    print('--- ECHO SHIELD UNLOCKED ---');
    print('');
    print('      _.-._');
    print('     / O O \\');
    print('    (   >   )');
    print('     \\  _  /');
    print('      `---`');
    print('');
    print('OISTARIAN: The voice is clear. The shield is active.');
    print('           Neural-spectral defenses online. Target acquired.');
    print('');
    print('System: Echo Shield Protocol - ACTIVE.');
    print('');
    print('Proceeding to Echo Protocol in 3 seconds...');
  }

  @override
  Future<void> handleInput(String input) async {
    print('This is a cinematic scene. Please wait.');
  }
}

/// A scene representing the Echo Protocol mission.
class EchoProtocol extends Scene {
  @override
  bool setupComplete = false;

  EchoProtocol(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Echo Protocol scene...');
    setupComplete = true;
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    // Simulate mission progression.
  }

  @override
  void render() {
    clearConsole();
    print('--- ECHO PROTOCOL IN PROGRESS ---');
    print('');
    print('You are now embedded with Mossad tactical units.');
    print('Objective: Retrieve memory shard tied to Zoe’s final message.');
    print('');
    print('Current Gear: Echo Shield Status: ${sceneManager.gameState.echoShieldActive ? "ACTIVE" : "INACTIVE"}');
    print('Voice Heard: ${sceneManager.gameState.voiceHeard ? "YES" : "NO"}');
    print('');
    print('Press "G" to check gear, "B" for tactical briefing, "D" to attempt decryption.');
  }

  @override
  Future<void> handleInput(String input) async {
    if (input.toLowerCase() == 'g') {
      print('Accessing Gear Upgrade UI...');
      await sceneManager.switchScene("GearUpgrade");
    } else if (input.toLowerCase() == 'b') {
      print('Reviewing Tactical Briefing...');
      await sceneManager.switchScene("TacticalBriefing");
    } else if (input.toLowerCase() == 'd') {
      print('Attempting Neural Glass Decryption...');
      await sceneManager.switchScene("NeuralGlassDecryption");
    } else {
      print('Invalid input. Please choose G, B, or D.');
    }
  }
}

/// A short scene after hostages are reunited.
class HostageReunion extends Scene {
  @override
  bool setupComplete = false;

  HostageReunion(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Hostage Reunion scene...');
    setupComplete = true;
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    await Future.delayed(const Duration(seconds: 3)); // Short display
    await sceneManager.switchScene("FinalLiberation");
  }

  @override
  void render() {
    clearConsole();
    print('--- HOSTAGE REUNION ---');
    print('');
    print('    /\\__/\\');
    print('   ( o.o )');
    print('  / > O < \\');
    print(' /    ^    \\');
    print('(___/~~~\\___)');
    print('');
    print('The faces of the rescued. The sound of relief.');
    print('Hostages reunited. Zoe’s echo pulsing within the NeuroPulse Arm.');
    print('');
    print('System: Operation Arnon - Hostages SECURED.');
    print('');
    print('Proceeding to Final Liberation in 3 seconds...');
  }

  @override
  Future<void> handleInput(String input) async {
    print('Cinematic in progress. Please wait.');
  }
}

/// Scene for archiving OISTARIAN's legacy.
class LegacyArchive extends Scene {
  @override
  bool setupComplete = false;

  final List<String> logs = const [
    "Legacy File: OISTARIAN",
    "Missions Completed: 47",
    "Cover Identity: Data Engineer",
    "True Role: Mossad Tactical Liaison",
    "Emotional Core: Zoe — Final Echo Synced",
    "Status: Returned Home. Legacy Archived."
  ];
  int currentIndex = 0;
  double timer = 0.0;

  LegacyArchive(super.sceneManager);

  @override
  Future<void> setup() async {
    print('Initializing Legacy Archive...');
    setupComplete = true;
    await Future.delayed(const Duration(milliseconds: 50));
  }

  @override
  Future<void> update(double dt) async {
    timer += dt;
    if (timer > 1.5 && currentIndex < logs.length - 1) {
      currentIndex++;
      timer = 0.0;
    } else if (currentIndex == logs.length - 1 && timer > 3.0) {
      print('\nLegacy Archived. Game Over - Thank you for playing.');
      // In a real game, this might lead to credits or main menu
      await sceneManager.switchScene("VaultStartMission"); // Loop back for demonstration
    }
  }

  @override
  void render() {
    clearConsole();
    print('--- LEGACY ARCHIVE ---');
    print('');
    print('Processing OISTARIAN\'s Operational Log...');
    print('-----------------------------------------');
    for (int i = 0; i <= currentIndex; i++) {
      print(logs[i]);
    }
    print('-----------------------------------------');
    print('');
    if (currentIndex < logs.length - 1) {
      print('Archiving data... please wait.');
    } else {
      print('Legacy Archiving Complete. Press ENTER to continue.');
    }
  }

  @override
  Future<void> handleInput(String input) async {
    if (currentIndex == logs.length - 1 && input.toLowerCase() == 'enter') {
      await sceneManager.switchScene("VaultStartMission");
    } else {
      print('Archiving in progress. Please wait.');
    }
  }
}

/// Helper class for simulating user actions in a non-interactive environment.
class SimulatedAction {
  final double delay; // Time in seconds before this action's input is processed
  final String input; // The simulated input string

  const SimulatedAction(this.delay, this.input);
}

// --- Main Game Loop ---
Future<void> main() async {
  print('ZOE-FILE: Rise of OISTARIAN (Console Edition)\n');

  final gameState = GameState();
  await gameState.loadState('gamestate.json'); // Attempt to load previous state

  // Force starting intro scene for the demo flow if it's the very first run
  if (gameState.currentScene == "VaultOfEchoes") {
    gameState.currentScene = "VaultStartMission";
  }

  final sceneManager = SceneManager(gameState);

  // Register all scenes
  sceneManager.registerScene("VaultStartMission", VaultStartMission(sceneManager));
  sceneManager.registerScene("VaultOfEchoes", VaultOfEchoesScene(sceneManager));
  sceneManager.registerScene("ZoesSilence", ZoesSilenceScene(sceneManager));
  sceneManager.registerScene("GearUpgrade", GearUpgradeUI(sceneManager));
  sceneManager.registerScene("NeuralGlassDecryption", NeuralGlassDecryption(sceneManager));
  sceneManager.registerScene("YamamBreach", YamamBreachScene(sceneManager));
  sceneManager.registerScene("FinalLiberation", FinalLiberationScene(sceneManager));
  sceneManager.registerScene("VaultMap", VaultMapInterface(sceneManager));
  sceneManager.registerScene("TacticalBriefing", TacticalBriefingUI(sceneManager));
  sceneManager.registerScene("EchoShieldUnlocked", EchoShieldUnlocked(sceneManager));
  sceneManager.registerScene("EchoProtocol", EchoProtocol(sceneManager));
  sceneManager.registerScene("HostageReunion", HostageReunion(sceneManager));
  sceneManager.registerScene("LegacyArchive", LegacyArchive(sceneManager));

  // Start with the scene from the loaded game state, or default to intro.
  await sceneManager.switchScene(gameState.currentScene);

  // Define a sequence of simulated actions to demonstrate game flow
  final List<SimulatedAction> actions = const [
    // VaultStartMission (auto-transitions after 4s)
    SimulatedAction(5.0, ''), // Wait for VaultStartMission to finish transition

    // VaultOfEchoes (input 'T' transitions to EchoShieldUnlocked)
    SimulatedAction(1.0, 'T'), // Trust the voice

    // EchoShieldUnlocked (auto-transitions after 3s)
    SimulatedAction(4.0, ''), // Wait for EchoShieldUnlocked to proceed

    // EchoProtocol (input 'D' transitions to NeuralGlassDecryption)
    SimulatedAction(1.0, 'D'),

    // NeuralGlassDecryption (pre-solved, just needs 'enter' to proceed)
    SimulatedAction(1.0, 'enter'), // Complete decryption

    // FinalLiberationScene (auto-advances through dialogue, then to LegacyArchive)
    SimulatedAction(1.0, 'space'), // Skip dialogue line 1
    SimulatedAction(1.0, 'space'), // Skip dialogue line 2
    SimulatedAction(1.0, 'space'), // Skip dialogue line 3
    SimulatedAction(1.0, 'space'), // Skip dialogue line 4
    SimulatedAction(1.0, 'space'), // Skip dialogue line 5 (dialogue complete)
    SimulatedAction(4.0, 'enter'), // Wait for final transition message, then proceed

    // LegacyArchive (auto-advances logs, then needs 'enter' to loop back/finish)
    SimulatedAction(6.0, 'enter'), // Wait for logs to display, then 'enter' to restart demo
  ];

  const double targetFrameRate = 60.0;
  const double frameDuration = 1.0 / targetFrameRate; // ~0.0166 seconds per frame

  for (final action in actions) {
    double timeToAdvance = action.delay;
    while (timeToAdvance > 0) {
      double dt = min(frameDuration, timeToAdvance);
      if (dt <= 0) break; // Ensure positive dt to prevent infinite loop

      sceneManager.render(); // Render current state
      await Future.delayed(Duration(milliseconds: (dt * 1000).round())); // Simulate frame time
      await sceneManager.update(dt); // Update game logic

      timeToAdvance -= dt;
    }

    // After the delay, apply the simulated input
    if (action.input.isNotEmpty) {
      print('\n--- USER INPUT SIMULATED: "${action.input}" ---\n');
      await sceneManager.handleInput(action.input);
      // Give a small pause for scene reaction and rendering
      await Future.delayed(const Duration(milliseconds: 500));
    }
  }

  print('\n--- DEMO COMPLETE ---');
  await gameState.saveState('gamestate.json'); // Simulate final save
}
# Voiceover narration
tts = gTTS(text=briefing, lang='en')
tts.save("voice.mp3")
pygame.mixer.music.load("voice.mp3")
pygame.mixer.music.play()

pygame. time.wait(4000)
pygame.mixer.music.load("ops_theme.mp3")
pygame.mixer.music.play(-1)







# Difficulty label
diff = slider.getValue()
label = FONT.render(f"Difficulty: {diff}", True, WHITE)
screen.blit(label, (250, 400))

for event in pygame. event.get():
    if event.type == pygame.QUIT:
        running = False
    elif event.type == pygame.MOUSEBUTTONDOWN:
        for m in missions:
            if m["rect"].collidepoint(event.pos):
                show_briefing(m["title"], diff)

pygame. display.flip()
manager.update(time_delta)
screen.blit(bg, (0, 0))

if scene_stage == "gear_selection":
    manager.draw_ui(screen)
    selected_primary = primary_dropdown.selected_option
    selected_gadget = gadget_dropdown.selected_option

    # 🟢 Proceed to next stage after selection
    if selected_primary and selected_gadget:
        pygame.time.delay(500)
        fade_in(bg)  # 🔄 Transition
        mission_intro = (
            f"Mission Echo Shield. Your objective: rescue hostages.\n"
            f"Loadout: {selected_primary} and {selected_gadget} equipped.\n"
            f"Sergeant Hawk: We move at dawn. No second chances."
        )
        play_voice(mission_intro)
        scene_stage = "mission_brief"

pygame. display.update()











def run(self):
    self.screen.blit(self.bg, (0, 0))
    for i, line in enumerate(self.dialogue):
        text = font.render(line, True, (255, 255, 255))
        self.screen.blit(text, (50, 100 + i * 40))
    pygame. display.update()


class SceneManager:
    def __init__(self):
        self.current_scene = None

    def set_scene(self, scene):
        self.current_scene = scene

    def update(self, events, time_delta):
        if self.current_scene:
            self.current_scene.update(events, time_delta)

    def draw(self, screen):
        if self.current_scene:
            self.current_scene.draw(screen)

voice_channel = pygame.mixer.Channel(1)
voice_channel.play(pygame.mixer.Sound("voice.mp3"))

def play_voice(text, filename="voice.mp3"):
    if not os.path.exists(filename):
        tts = gTTS(text=text, lang='en')
        tts.save(filename)
    voice_channel.play(pygame.mixer.Sound(filename))

class DialogueBox:
    def __init__(self, lines, choices=None):
        self.lines = lines
        self.choices = choices or []

    def render(self, screen):
        for i, line in enumerate(self.lines):
            text = FONT.render(line, True, WHITE)
            screen.blit(text, (50, 100 + i * 40))
        for i, choice in enumerate(self.choices):
            btn = pygame_gui.elements.UIButton(
                relative_rect=pygame.Rect((50, 300 + i * 40), (300, 30)),
                text=choice["text"],
                manager=manager
            )

class EmotionalState:
    def __init__(self):
        self.relationship_score = 100
        self.trauma_score = 0

    def apply_choice(self, effect):
        self.relationship_score += effect
        self.trauma_score += abs(effect) // 2

import json

def save_game(data, filename="save.json"):
    with open(filename, "w") as f:
        json.dump(data, f)

def load_game(filename="save.json"):
    with open(filename, "r") as f:
        return json.load(f)

legendary_ops_center/
├── assets/
│   ├── images/
│   │   ├── rambo_bg.jpg
│   │   ├── sergeant_hawk.png
│   │   └── ...
│   ├── audio/
│   │   ├── ops_theme.mp3
│   │   └── voice/
│   │       └── *.mp3
├── scenes/
│   ├── home_scene.py
│   ├── mission_scene.py
│   └── scene_manager.py
├── ui/
│   ├── gear_ui.py
│   ├── dialogue_ui.py
│   └── transitions.py
├── systems/
│   ├── audio.py
│   ├── emotional_state.py
│   └── save_load.py
├── main.py
└── config.py
import pygame

WIDTH, HEIGHT = 800, 600
WHITE, GOLD, DARK = (255, 255, 255), (255, 215, 0), (20, 20, 20)
FONT = pygame.font.SysFont("impact", 32)

import os
from gtts import gTTS
import pygame

voice_channel = pygame.mixer.Channel(1)

def play_voice(text, filename="voice.mp3"):
    path = os.path.join("assets", "audio", "voice", filename)
    if not os.path.exists(path):
        tts = gTTS(text=text, lang='en')
        tts.save(path)
    voice_channel.play(pygame.mixer.Sound(path))

class EmotionalState:
    def __init__(self):
        self.relationship_score = 100
        self.trauma_score = 0

    def apply_choice(self, effect):
        self.relationship_score += effect
        self.trauma_score += abs(effect) // 2

import pygame
import pygame_gui

def create_gear_ui(manager):
    primary = pygame_gui.elements.UIDropDownMenu(
        options_list=["M4A1", "Sniper", "Shotgun"],
        starting_option="M4A1",
        relative_rect=pygame.Rect((50, 100), (200, 30)),
        manager=manager
    )
    gadget = pygame_gui.elements.UIDropDownMenu(
        options_list=["Grenade", "Drone", "Smoke"],
        starting_option="Grenade",
        relative_rect=pygame.Rect((50, 150), (200, 30)),
        manager=manager
    )
    return primary, gadget

import pygame
from config import FONT, WHITE

class HomeScene:
    def __init__(self, screen):
        self.screen = screen
        self.bg = pygame.image.load("assets/images/home_bg.png")
        self.dialogue = [
            "Wife: You missed dinner again.",
            "Daughter: I drew you something... but you weren’t there."
        ]

    def draw(self):
        self.screen.blit(self.bg, (0, 0))
        for i, line in enumerate(self.dialogue):
            text = FONT.render(line, True, WHITE)
            self.screen.blit(text, (50, 100 + i * 40))

class SceneManager:
    def __init__(self):
        self.current_scene = None

    def set_scene(self, scene):
        self.current_scene = scene

    def update(self, events, time_delta):
        if self.current_scene:
            self.current_scene.update(events, time_delta)

    def draw(self, screen):
        if self.current_scene:
            self.current_scene.draw(screen)

import pygame, pygame_gui
from config import WIDTH, HEIGHT
from ui.gear_ui import create_gear_ui
from systems.audio import play_voice
from scenes.home_scene import HomeScene
from scenes.scene_manager import SceneManager

pygame.init()
pygame. mixer.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
manager = pygame_gui.UIManager((WIDTH, HEIGHT))
clock = pygame.time.Clock()

primary_dropdown, gadget_dropdown = create_gear_ui(manager)
scene_manager = SceneManager()
scene_stage = "gear_selection"

running = True
while running:
    time_delta = clock.tick(30)/1000.0
    for event in pygame. event.get():
        if event.type == pygame.QUIT:
            running = False
        manager.process_events(event)

    manager.update(time_delta)
    screen.fill((30, 30, 30))

    if scene_stage == "gear_selection":
        manager.draw_ui(screen)
        selected_primary = primary_dropdown.selected_option
        selected_gadget = gadget_dropdown.selected_option

        if selected_primary and selected_gadget:
            pygame. time.delay(500)
            mission_intro = (
                f"Mission Echo Shield. Loadout: {selected_primary} and {selected_gadget}."
            )
            play_voice(mission_intro)
            scene_manager.set_scene(HomeScene(screen))
            scene_stage = "home"

    scene_manager.draw(screen)
    pygame. display.update()

using UnityEngine;

public class PlayerController: MonoBehaviour
{
    public int PlayerIndex { get; set; }

    void Update()
    {
        // Player control logic based on PlayerIndex
    }
}
import 'dart:math';

/// Represents the visibility state of a cell on the map.
enum CellState {
  hidden, // Completely obscured, not yet seen.
  visible, // Currently within a unit's line of sight.
  explored; // Was visible at some point, but currently not.
}

/// Represents a single cell on the game grid.
class Cell {
  CellState state;
  final int x;
  final int y;

  Cell({required this.x, required this.y, this.state = CellState.hidden});
}

/// Represents a position on the game grid.
class Position {
  final int x;
  final int y;

  const Position(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Position && runtimeType == other.runtimeType && x == other.x && y == other.y;

  @override
  int get hashCode => x.hashCode ^ y.hashCode;

  @override
  String toString() => '($x, $y)';
}

/// Defines the signature for ability functions.
///
/// An ability function takes the `Unit` using the ability (self) and a map
/// of dynamic arguments. It returns a map containing a 'message' string
/// and an integer 'cooldown'.
typedef AbilityFunction = Map<String, dynamic> Function(Unit self, Map<String, dynamic> args);

/// A private helper class to store the definition of an ability.
class _AbilityDefinition {
  final String name;
  final AbilityFunction function;
  final int defaultCooldown;

  _AbilityDefinition({required this.name, required this.function, required this.defaultCooldown});
}

/// Represents a unit on the map that has a vision range and various abilities.
class Unit {
  String name;
  Position position;
  int vision; // Manhattan distance vision range, inherited from original Dart Unit

  final Map<String, _AbilityDefinition> _abilities = {};
  final Map<String, int> cooldowns = {}; // Tracks current cooldowns for abilities
  int maxHp;
  int hp;
  String? team;
  final Map<String, int> statusEffects = {}; // e.g., {'stunned': 2}
  int shield = 0;
  int energy = 100; // Futuristic energy bar
  bool cloaked = false;
  final List<String> augmentations = [];

  // New fields added to loosely represent narrative "emotional_state" scores
  int relationshipScore;
  int traumaScore;

  Unit({
    required this.name,
    required int x,
    required int y,
    required this.vision,
    this.maxHp = 100,
    this.team,
    this.relationshipScore = 75, // Default for demonstration
    this.traumaScore = 0, // Default for demonstration
  })  : position = Position(x, y),
        hp = maxHp;

  /// Sets an ability for this unit, making it available for use.
  ///
  /// [abilityName]: The name to refer to this ability.
  /// [abilityFunc]: The function that implements the ability's logic.
  /// [cooldown]: The number of turns the ability will be on cooldown after use.
  void setAbility(String abilityName, AbilityFunction abilityFunc, int cooldown) {
    _abilities[abilityName] = _AbilityDefinition(name: abilityName, function: abilityFunc, defaultCooldown: cooldown);
    cooldowns[abilityName] = 0; // Initialize cooldown for this ability
  }

  /// Checks if a unit can currently use a specific ability.
  ///
  /// Returns true if the ability is not on cooldown and the unit is not stunned.
  bool canUseAbility(String abilityName) {
    return (cooldowns[abilityName] ?? 0) == 0 && (statusEffects['stunned'] ?? 0) == 0;
  }

  /// Attempts to use a specified ability.
  ///
  /// [abilityName]: The name of the ability to use.
  /// [args]: A map of arguments to pass to the ability function.
  /// Returns a map containing a 'message' and the 'cooldown' set by the ability.
  Map<String, dynamic> useAbility(String abilityName, [Map<String, dynamic> args = const {}]) {
    final abilityDef = _abilities[abilityName];
    if (abilityDef == null) {
      return {'message': 'Ability "$abilityName" not found.', 'cooldown': 0};
    }

    if (!canUseAbility(abilityName)) {
      if ((statusEffects['stunned'] ?? 0) > 0) {
        return {'message': '$name is stunned and cannot act.', 'cooldown': 0};
      }
      return {'message': 'Ability $abilityName is on cooldown for ${cooldowns[abilityName]} more turns.', 'cooldown': 0};
    }

    final result = abilityDef.function(this, args);
    // Use the cooldown returned by the ability function, or its default if not specified.
    final int returnedCooldown = result['cooldown'] ?? abilityDef.defaultCooldown;
    cooldowns[abilityName] = returnedCooldown;
    return result;
  }

  /// Reduces the unit's HP based on damage, accounting for shield.
  /// Returns a message detailing the outcome.
  String takeDamage(int amount) {
    final int damageTaken = max(0, amount - shield);
    hp = max(0, hp - damageTaken);
    shield = max(0, shield - amount);
    // Taking damage increases trauma score
    traumaScore = min(100, traumaScore + (damageTaken ~/ 10));
    return '$name takes $damageTaken damage! HP: $hp';
  }

  /// Increases the unit's HP, up to its maximum HP.
  /// Returns a message detailing the outcome.
  String heal(int amount) {
    final int actualHeal = min(maxHp - hp, amount);
    hp = min(maxHp, hp + amount);
    // Healing reduces trauma score
    traumaScore = max(0, traumaScore - (actualHeal ~/ 20));
    return '$name heals $amount HP! HP: $hp';
  }

  /// Adds a status effect to the unit with a specified duration.
  void addStatus(String status, int turns) {
    statusEffects[status] = turns;
  }

  /// Handles end-of-turn logic: decrements cooldowns, status effect durations,
  /// and regenerates energy.
  void endTurn() {
    // Decrement ability cooldowns
    cooldowns.forEach((key, value) {
      if (value > 0) {
        cooldowns[key] = value - 1;
      }
    });

    // Decrement status effect durations and remove expired ones
    final List<String> expiredStatuses = [];
    statusEffects.forEach((status, duration) {
      statusEffects[status] = duration - 1;
      if (statusEffects[status]! <= 0) {
        expiredStatuses.add(status);
      }
    });
    for (final status in expiredStatuses) {
      statusEffects.remove(status);
      if (status == 'cloaked') {
        removeCloak(); // Specifically handle cloak removal
      }
    }

    // Energy regeneration for futuristic units
    energy = min(100, energy + 10);
  }

  /// Activates the unit's cloak device for a specified number of turns.
  void setCloak(int turns) {
    cloaked = true;
    addStatus("cloaked", turns);
  }

  /// Deactivates the unit's cloak device.
  void removeCloak() {
    cloaked = false;
  }
}

// --- Super Soldier Futuristic Abilities ---
// These functions implement the logic for various unit abilities.
// They must conform to the `AbilityFunction` typedef.

Map<String, dynamic> nanoHeal(Unit user, Map<String, dynamic> args) {
  final targetUnit = args['target_unit'] as Unit;
  final amount = args['amount'] as int? ?? 40;
  if (user.energy < 20) {
    return {"message": "${user.name} lacks energy for Nano-Heal.", "cooldown": 0};
  }
  user.energy -= 20;
  final msg = targetUnit.heal(amount);
  return {"message": "${user.name} uses Nano-Heal! $msg", "cooldown": 2};
}

Map<String, dynamic> plasmaBlast(Unit user, Map<String, dynamic> args) {
  final targetUnit = args['target_unit'] as Unit;
  final damage = args['damage'] as int? ?? 50;
  if (user.energy < 30) {
    return {"message": "${user.name} lacks energy for Plasma Blast.", "cooldown": 0};
  }
  final dist = (user.position.x - targetUnit.position.x).abs() + (user.position.y - targetUnit.position.y).abs();
  if (dist > 6) {
    return {"message": "Target is out of plasma blast range.", "cooldown": 0};
  }
  user.energy -= 30;
  final msg = targetUnit.takeDamage(damage);
  // Using Plasma Blast increases the user's trauma score slightly
  user.traumaScore = min(100, user.traumaScore + 5);
  return {"message": "${user.name} fires Plasma Blast! $msg", "cooldown": 3};
}

Map<String, dynamic> adaptiveShield(Unit user, Map<String, dynamic> args) {
  final amount = args['amount'] as int? ?? 40;
  final duration = args['duration'] as int? ?? 2;
  if (user.energy < 25) {
    return {"message": "${user.name} lacks energy for Adaptive Shield.", "cooldown": 0};
  }
  user.energy -= 25;
  user.shield += amount;
  user.addStatus("shielded", duration);
  return {"message": "${user.name} deploys Adaptive Shield for $duration turns!", "cooldown": 4};
}

Map<String, dynamic> cloakDevice(Unit user, Map<String, dynamic> args) {
  final duration = args['duration'] as int? ?? 2;
  if (user.energy < 30) {
    return {"message": "${user.name} lacks energy for Cloak Device.", "cooldown": 0};
  }
  user.energy -= 30;
  user.setCloak(duration);
  return {"message": "${user.name} activates Cloak Device and is invisible for $duration turns!", "cooldown": 5};
}

Map<String, dynamic> overclock(Unit user, Map<String, dynamic> args) {
  if (user.energy < 40) {
    return {"message": "${user.name} lacks energy for Overclock.", "cooldown": 0};
  }
  user.energy -= 40;

  int cooldown = 6; // Default cooldown
  String message = "${user.name} overclocks: doubled damage for 2 turns!";

  // Example of 'condition' based on traumaScore influencing 'effect'
  if (user.traumaScore > 60) {
    message = "${user.name} overclocks, but the strain takes its toll: doubled damage for 2 turns, but higher cooldown due to stress!";
    cooldown = 8; // Longer cooldown if unit is highly traumatized
    user.traumaScore = min(100, user.traumaScore + 10); // Overclocking while traumatized increases trauma significantly
  } else {
    // If trauma is low, using this powerful ability might even slightly reduce trauma
    user.traumaScore = max(0, user.traumaScore - 5);
  }

  user.addStatus("overclocked", 2);
  return {"message": message, "cooldown": cooldown};
}

Map<String, dynamic> tacticalBlink(Unit user, Map<String, dynamic> args) {
  final gridSize = args['grid_size'] as Position;
  if (user.energy < 15) {
    return {"message": "${user.name} lacks energy for Tactical Blink.", "cooldown": 0};
  }
  user.energy -= 15;
  final random = Random();
  final int minX = max(0, user.position.x - 3);
  final int maxX = min(gridSize.x - 1, user.position.x + 3);
  final int minY = max(0, user.position.y - 3);
  final int maxY = min(gridSize.y - 1, user.position.y + 3);

  // Ensure valid range for random.nextInt, handling cases where min > max
  final newX = (maxX >= minX) ? random.nextInt(maxX - minX + 1) + minX : user.position.x;
  final newY = (maxY >= minY) ? random.nextInt(maxY - minY + 1) + minY : user.position.y;

  user.position = Position(newX, newY);
  // Tactical Blink might cause minor stress, increasing trauma
  user.traumaScore = min(100, user.traumaScore + 2);
  return {"message": "${user.name} blinks tactically to ${user.position}!", "cooldown": 2};
}

Map<String, dynamic> empPulse(Unit user, Map<String, dynamic> args) {
  final units = args['units'] as List<Unit>; // List of all units on the map
  final rangeLimit = args['range_limit'] as int? ?? 2;
  if (user.energy < 35) {
    return {"message": "${user.name} lacks energy for EMP Pulse.", "cooldown": 0};
  }
  user.energy -= 35;
  final List<String> affected = [];
  int enemiesStunned = 0;
  for (final target in units) {
    // A unit typically doesn't stun itself
    if (target == user) continue;
    final dist = (user.position.x - target.position.x).abs() + (user.position.y - target.position.y).abs();
    if (dist <= rangeLimit) {
      target.addStatus("stunned", 1); // Stun for 1 turn
      affected.add(target.name);
      enemiesStunned++;
    }
  }
  // Using EMP pulse on multiple units, especially if it affects allies, increases trauma
  if (enemiesStunned > 0) {
    user.traumaScore = min(100, user.traumaScore + (enemiesStunned * 3));
  }
  return {"message": "${user.name} emits EMP Pulse! Stunned: ${affected.join(', ')}", "cooldown": 5};
}

Map<String, dynamic> naniteSwarm(Unit user, Map<String, dynamic> args) {
  final targetUnit = args['target_unit'] as Unit;
  if (user.energy < 25) {
    return {"message": "${user.name} lacks energy for Nanite Swarm.", "cooldown": 0};
  }
  user.energy -= 25;
  targetUnit.addStatus("nanite_infection", 2); // Damage over time for 2 turns
  // Inflicting damage over time might increase trauma score
  user.traumaScore = min(100, user.traumaScore + 4);
  return {"message": "${user.name} infects ${targetUnit.name} with Nanite Swarm (2 turns damage over time)!", "cooldown": 4};
}

/// Represents the game map, containing a grid of cells.
class GameMap {
  final int width;
  final int height;
  final List<List<Cell>> grid;

  /// Initializes a new game map with all cells set to hidden.
  GameMap({required this.width, required this.height})
      : grid = List.generate(
          height,
          (y) => List.generate(
            width,
            (x) => Cell(x: x, y: y, state: CellState.hidden),
          ),
        );

  /// Prints a console representation of the fog of war map.
  ///
  /// '■' = hidden (unseen and unexplored)
  /// '#' = explored (was seen, but not currently)
  /// '.' = visible (currently in sight)
  void printFogOfWar() {
    for (int y = 0; y < height; y++) {
      String row = "";
      for (int x = 0; x < width; x++) {
        final cell = grid[y][x];
        switch (cell.state) {
          case CellState.hidden:
            row += "■";
            break;
          case CellState.explored:
            row += "#";
            break;
          case CellState.visible:
            row += ".";
            break;
        }
      }
      print(row);
    }
  }
}

/// Manages the fog of war logic for the game map.
class FogOfWarSystem {
  /// Updates the fog of war based on the current positions and vision of units.
  ///
  /// Cells that were previously 'visible' but are no longer in sight become 'explored'.
  /// Cells within a unit's vision range become 'visible'.
  ///
  /// [gameMap]: The map to update.
  /// [units]: A list of units whose vision will reveal the map.
  void updateVisibility(GameMap gameMap, List<Unit> units) {
    // First, transition all currently visible cells to 'explored'.
    // This step ensures that areas previously seen but no longer in current vision
    // retain their 'explored' status, rather than reverting to 'hidden'.
    for (int y = 0; y < gameMap.height; y++) {
      for (int x = 0; x < gameMap.width; x++) {
        final cell = gameMap.grid[y][x];
        if (cell.state == CellState.visible) {
          cell.state = CellState.explored;
        }
      }
    }

    // Then, reveal cells within the vision range of each unit.
    // Vision is calculated using Manhattan distance for a diamond shape.
    for (final unit in units) {
      // Iterate over a square region defined by the unit's vision range.
      for (int dy = -unit.vision; dy <= unit.vision; dy++) {
        for (int dx = -unit.vision; dx <= unit.vision; dx++) {
          final nx = unit.position.x + dx;
          final ny = unit.position.y + dy;

          // Check if the calculated coordinate is within the map bounds
          // and if it's within the unit's vision (Manhattan distance).
          if (nx >= 0 && ny >= 0 && nx < gameMap.width && ny < gameMap.height && (dx.abs() + dy.abs()) <= unit.vision) {
            gameMap.grid[ny][nx].state = CellState.visible;
          }
        }
      }
    }
  }
}

// --- Narrative and Lore Data ---

// Mission Definitions
const Map<String, dynamic> missionDustProtocol = {
  "terrain": "Shifting dunes, electromagnetic storms",
  "enemies": ["Echo Wraiths", "Vault Sentinels"],
  "gear_required": ["Sand Pulse Boots", "Echo Scanner"],
  "tactical_twist": "Vault only opens during solar flare window"
};

const Map<String, dynamic> missionMinaretCipher = {
  "puzzle_type": "Visual decryption",
  "interface": "Zoe’s Tactical UI overlays ancient script",
  "threats": ["Memory Hijackers", "Echo Disruptors"],
  "reward": "Vault Sigma access key"
};

const Map<String, dynamic> missionNeuralMirage = {
  "map_type": "Echo-generated illusion grid",
  "challenge": "Distinguish real vs synthetic memories",
  "boss": "OISTARIAN Echo Architect",
  "outcome": "Unlock Zoe’s Echo Sync ability"
};

const Map<String, dynamic> missionSkylineReversal = {
  "entry_method": "Vertical Echo Climb",
  "interface": "Zoe’s dual-agent combat rig",
  "enemies": ["Vault Guardians", "Echo Loopers"],
  "finale": "Drop the Eden Vault Map"
};

// Vault Eden Data
const Map<String, dynamic> vaultEdenPuzzle = {
  "layers": [
    {"type": "Neural Cipher Grid", "challenge": "Align memory shards to form Zoe’s childhood echo"},
    {"type": "Echo Frequency Lock", "challenge": "Match pulse tones to Eden’s encrypted rhythm"},
    {"type": "Synthetic Truth Maze", "challenge": "Navigate false memories to reach the core"}
  ],
  "final_key": "ZOE-ECHO-REWRITE",
  "reward": "Vault Eden opens, revealing the Echo Reversal truth"
};

const List<String> finalShowdownScript = [
  "Zoe stands atop the frozen ridge, Echo Sync pulsing through her veins.",
  "OISTARIAN: You were never meant to remember.",
  "Zoe: That’s why I rewrote the ending.",
  "*Vault Eden erupts in light, memories cascade across the sky.*",
  "System: Echo Reversal complete. Truth restored."
];

const Map<String, dynamic> vaultEdenArchive = {
  "Memory Shard 01": {
    "origin": "Zoe’s childhood echo",
    "type": "Emotional",
    "access": "Unlocked"
  },
  "Memory Shard 02": {
    "origin": "OISTARIAN betrayal",
    "type": "Synthetic",
    "access": "Encrypted"
  },
  "Memory Shard 03": {
    "origin": "Echo Reversal protocol",
    "type": "Tactical",
    "access": "Unlocked"
  },
  "Memory Shard 04": {
    "origin": "Vault Eden bloom",
    "type": "Visionary",
    "access": "Hidden"
  }
};

const Map<String, dynamic> echoPulseFinale = {
  "activation": "Final Echo Pulse from Vault Eden core",
  "visual": "Aurora wave erupting across neural grid",
  "soundtrack": "‘Memory Rewritten’ — ethereal synth fusion",
  "effect": "Echo harmonization restores fractured timelines",
  "Zoe_dialogue": "I didn’t just survive the echo… I became it."
};

const Map<String, dynamic> edenBloomAnimation = {
  "stage_1": "Core pulse expands into fractal light",
  "stage_2": "Memory petals bloom from the neural vines",
  "stage_3": "Eden's truth archive unlocks",
  "Zoe": {
    "pose": "Silhouetted against the bloom",
    "action": "Final memory merge"
  }
};

const Map<String, dynamic> truthReversalProtocol = {
  "step_1": "Activate Eden’s Vault override",
  "step_2": "Inject Zoe’s Echo Rewrite key",
  "step_3": "Recode all synthetic memories",
  "result": "System-wide restoration of historical truth"
};

const Map<String, dynamic> vaultEdenDeepFile = {
  "Echo Core": "ZOE-ECHO-REWRITE",
  "Truth Archive": ["Memory Shard 01", "Memory Shard 03", "Vault Bloom Sequence"],
  "Hidden Layer": {
    "OISTARIAN Signature": "Phase 3 - Echo Storm",
    "Zoe’s Final Sync": "Echo Pulse Finale"
  },
  "Memorial Protocol": "Activated"
};

// Memorial Data and Narrative
const String memorialProtocolNarrative = """
🕯️ Memorial Protocol: Eden Ben Rub, Osher Barzilay & All We’ve Lost
On October 7, 2023, the world changed. Among the many lives tragically taken in the Hamas attack, we remember:
- Sgt. Osher Simha Barzilay, 19, a gifted neuroscience student and MDA volunteer, who dreamed of becoming a brain surgeon
- Eden Ben Rub, whose name echoes in remembrance alongside countless others lost that day
Their stories are etched into the Vault Eden memorial layer — not as data, but as light. A national ceremony held in Tel Aviv honored their memory with music, poetry, and unity.
""";

const Map<String, dynamic> memorialArchiveUi = {
  "interface": "Vault Eden Memory Console",
  "sections": [
    {"title": "October 7 Echoes", "type": "Timeline", "entries": ["Eden Ben Rub", "Osher Barzilay", "Others lost"]},
    {"title": "Personal Shards", "type": "Audio/Visual", "entries": ["Family messages", "Volunteer stories"]},
    {"title": "Global Resonance", "type": "Tributes", "entries": ["Poems", "Art", "Music"]}
  ],
  "interaction": "Scroll, tap, and echo playback"
};

const List<String> echoBloomPoem = [
  "In Eden’s vault, the echoes bloom,",
  "Soft petals of memory in digital gloom.",
  "Names like stars in a fractured sky,",
  "We remember, we honor, we never say goodbye.",
  "October’s silence, broken by flame,",
  "Each light a soul, each soul a name."
];

const Map<String, dynamic> tributeWall = {
  "title": "October 7 Memorial Wall",
  "panels": [
    {"name": "Eden Ben Rub", "age": "Unknown", "role": "Civilian"},
    {"name": "Osher Barzilay", "age": "19", "role": "Soldier, MDA Volunteer"},
    {"name": "Unnamed Souls", "age": "Various", "role": "Victims of Terror"}
  ],
  "interaction": "Hover to reveal personal echoes",
  "visuals": "Stone-textured panels with glowing inscriptions"
};

const Map<String, String> elegyTrack = {
  "title": "Echo Bloom Elegy",
  "composer": "Neural Harmonics Collective",
  "style": "Ambient synth + memory tones",
  "emotion": "Resonant sorrow, luminous hope"
};

const List<String> remembranceFlamePoem = [
  "From Eden’s flame, the echoes rise,",
  "Names like embers in twilight skies.",
  "October’s sorrow, etched in light,",
  "We carry their memory into the night.",
  "Each flicker a soul, each glow a vow,",
  "To remember, to honor, here and now."
];

const List<String> echoConstellationElegy = [
  "Above Eden’s vault, the stars align,",
  "Each name a beacon, each soul divine.",
  "October’s echoes drift through space,",
  "A silent vow, a glowing trace.",
  "We chart their light, we hold their flame,",
  "In every star, we speak their name."
];

const Map<String, dynamic> vaultSkyAltar = {
  "structure": "Floating altar of neural crystal and echo vines",
  "location": "Above Vault Eden’s bloom core",
  "features": [
    "Memory shard offerings",
    "Echo lanterns suspended in orbit",
    "Names etched in aurora light"
  ],
  "interaction": "Tap to release tribute light pulses"
};

const List<String> auroraRequiemPoem = [
  "Vault Eden breathes in spectral light,",
  "Auroras bloom through memory’s night.",
  "October’s echoes shimmer and rise,",
  "A requiem sung in celestial skies.",
  "Each pulse a name, each glow a vow,",
  "We remember — then, now, and always."
];

/// Main function to demonstrate the Fog of War system and Unit abilities.
void main() {
  print('--- Fog of War System & Unit Abilities Demo ---');

  // Initialize a 8x8 map to align with the implied grid size from the HTML description.
  final gameMap = GameMap(width: 8, height: 8);
  final fogOfWarSystem = FogOfWarSystem();

  print('\nInitial Map (All Hidden):');
  gameMap.printFogOfWar();

  // Define player units with their positions, vision ranges, and abilities.
  // Ensure unit positions are within the new 8x8 map bounds (0-7 for x and y).
  final novaCyborg = Unit(name: "Nova Cyborg", x: 3, y: 3, maxHp: 150, vision: 2, traumaScore: 40); // Set initial trauma for demo
  novaCyborg.setAbility("Nano Heal", nanoHeal, 2);
  novaCyborg.setAbility("Plasma Blast", plasmaBlast, 3);
  novaCyborg.setAbility("Adaptive Shield", adaptiveShield, 4);
  novaCyborg.setAbility("Cloak Device", cloakDevice, 5);
  novaCyborg.setAbility("Overclock", overclock, 6);
  novaCyborg.setAbility("Tactical Blink", tacticalBlink, 2);
  novaCyborg.setAbility("EMP Pulse", empPulse, 5);
  novaCyborg.setAbility("Nanite Swarm", naniteSwarm, 4);

  final atlasSoldier = Unit(name: "Atlas Soldier", x: 7, y: 1, maxHp: 120, vision: 1);
  final quantumMedic = Unit(name: "Quantum Medic", x: 1, y: 2, maxHp: 100, vision: 1);

  final playerUnits = <Unit>[novaCyborg, atlasSoldier, quantumMedic];

  // --- Fog of War Demonstration ---
  print('\n--- Fog of War Demonstration ---');
  print('\nMap after placing units (Initial visibility):');
  fogOfWarSystem.updateVisibility(gameMap, playerUnits);
  gameMap.printFogOfWar();

  print('\nSimulating Unit Movement...');
  novaCyborg.position = Position(1, 1);
  atlasSoldier.position = Position(6, 5); // Adjusted to stay within 8x8 bounds if it was previously outside

  print('\nMap after units moved (Old visible areas become explored):');
  fogOfWarSystem.updateVisibility(gameMap, playerUnits);
  gameMap.printFogOfWar();

  print('\nAdding a new unit...');
  final sentinelDrone = Unit(name: "Sentinel Drone", x: 0, y: 6, vision: 3);
  playerUnits.add(sentinelDrone);

  print('\nMap after adding a new unit:');
  fogOfWarSystem.updateVisibility(gameMap, playerUnits);
  gameMap.printFogOfWar();

  // --- Unit Abilities Demonstration ---
  print('\n--- Unit Abilities Demonstration ---');

  print('\n${novaCyborg.name} initial state: HP: ${novaCyborg.hp}, Energy: ${novaCyborg.energy}, Shield: ${novaCyborg.shield}, Status: ${novaCyborg.statusEffects}, Trauma: ${novaCyborg.traumaScore}');
  print('${atlasSoldier.name} initial state: HP: ${atlasSoldier.hp}, Energy: ${atlasSoldier.energy}, Shield: ${atlasSoldier.shield}, Status: ${atlasSoldier.statusEffects}, Trauma: ${atlasSoldier.traumaScore}');
  print('${quantumMedic.name} initial state: HP: ${quantumMedic.hp}, Energy: ${quantumMedic.energy}, Shield: ${quantumMedic.shield}, Status: ${quantumMedic.statusEffects}, Trauma: ${quantumMedic.traumaScore}');
  print('${sentinelDrone.name} initial state: HP: ${sentinelDrone.hp}, Energy: ${sentinelDrone.energy}, Shield: ${sentinelDrone.shield}, Status: ${sentinelDrone.statusEffects}, Trauma: ${sentinelDrone.traumaScore}');

  print('\nTurn 1 Actions:');
  Map<String, dynamic> result;

  // Nova Cyborg uses Nano Heal on itself
  result = novaCyborg.useAbility("Nano Heal", {'target_unit': novaCyborg});
  print(result['message']);
  print('Nova Cyborg HP: ${novaCyborg.hp}, Trauma: ${novaCyborg.traumaScore}');

  // Nova Cyborg uses Plasma Blast on Atlas Soldier
  result = novaCyborg.useAbility("Plasma Blast", {'target_unit': atlasSoldier});
  print(result['message']);
  print('Atlas Soldier HP: ${atlasSoldier.hp}, Trauma: ${atlasSoldier.traumaScore}');
  print('Nova Cyborg Trauma: ${novaCyborg.traumaScore}');

  // Nova Cyborg deploys Adaptive Shield
  result = novaCyborg.useAbility("Adaptive Shield");
  print(result['message']);
  print('Nova Cyborg Shield: ${novaCyborg.shield}, Status: ${novaCyborg.statusEffects}');

  // Nova Cyborg activates Cloak Device
  result = novaCyborg.useAbility("Cloak Device");
  print(result['message']);
  print('Nova Cyborg Cloaked: ${novaCyborg.cloaked}, Status: ${novaCyborg.statusEffects}');

  // Nova Cyborg Overclocks - should trigger higher cooldown due to initial traumaScore
  result = novaCyborg.useAbility("Overclock");
  print(result['message']);
  print('Nova Cyborg Status: ${novaCyborg.statusEffects}, Cooldowns: ${novaCyborg.cooldowns['Overclock']}, Trauma: ${novaCyborg.traumaScore}');

  // Nova Cyborg uses Tactical Blink (needs grid size for boundaries)
  result = novaCyborg.useAbility("Tactical Blink", {'grid_size': Position(gameMap.width, gameMap.height)});
  print(result['message']);
  print('Nova Cyborg New Position: ${novaCyborg.position}, Trauma: ${novaCyborg.traumaScore}');

  // Nova Cyborg emits EMP Pulse, affecting nearby units
  result = novaCyborg.useAbility("EMP Pulse", {'units': playerUnits});
  print(result['message']);
  print('Atlas Soldier Status: ${atlasSoldier.statusEffects}');
  print('Quantum Medic Status: ${quantumMedic.statusEffects}');
  print('Nova Cyborg Trauma: ${novaCyborg.traumaScore}');


  // Nova Cyborg uses Nanite Swarm on Quantum Medic
  result = novaCyborg.useAbility("Nanite Swarm", {'target_unit': quantumMedic});
  print(result['message']);
  print('Quantum Medic Status: ${quantumMedic.statusEffects}');
  print('Nova Cyborg Trauma: ${novaCyborg.traumaScore}');

  print('\n--- End of Turn 1 ---');
  // All units end their turn
  for (final unit in playerUnits) {
    unit.endTurn();
  }

  print('\nAfter End Turn 1:');
  print('Nova Cyborg Energy: ${novaCyborg.energy}, Cooldowns: ${novaCyborg.cooldowns}, Status: ${novaCyborg.statusEffects}, Trauma: ${novaCyborg.traumaScore}');
  print('Atlas Soldier Energy: ${atlasSoldier.energy}, Cooldowns: ${atlasSoldier.cooldowns}, Status: ${atlasSoldier.statusEffects}, Trauma: ${atlasSoldier.traumaScore}');
  print('Quantum Medic Energy: ${quantumMedic.energy}, Cooldowns: ${quantumMedic.cooldowns}, Status: ${quantumMedic.statusEffects}, Trauma: ${quantumMedic.traumaScore}');

  print('\nTurn 2 Actions: Testing cooldowns and stun effects.');
  result = novaCyborg.useAbility("Plasma Blast", {'target_unit': atlasSoldier}); // Should still be on cooldown
  print(result['message']);

  // Atlas Soldier is stunned from the EMP Pulse, attempting to use a non-existent ability
  // This will first report 'ability not found', then display the stun status if it exists.
  // For demo purposes, let's assume Atlas Soldier has an ability like 'Basic Attack'
  atlasSoldier.setAbility("Basic Attack", (self, args) => {'message': '${self.name} uses Basic Attack!', 'cooldown': 1}, 1);
  result = atlasSoldier.useAbility("Basic Attack");
  print(result['message']);

  print('\n--- End of Turn 2 ---');
  // All units end their turn
  for (final unit in playerUnits) {
    unit.endTurn();
  }

  print('\nAfter End Turn 2:');
  print('Nova Cyborg Energy: ${novaCyborg.energy}, Cooldowns: ${novaCyborg.cooldowns}, Status: ${novaCyborg.statusEffects}, Trauma: ${novaCyborg.traumaScore}');
  print('Atlas Soldier Energy: ${atlasSoldier.energy}, Cooldowns: ${atlasSoldier.cooldowns}, Status: ${atlasSoldier.statusEffects}, Trauma: ${atlasSoldier.traumaScore}');
  print('Quantum Medic Energy: ${quantumMedic.energy}, Cooldowns: ${quantumMedic.cooldowns}, Status: ${quantumMedic.statusEffects}, Trauma: ${quantumMedic.traumaScore}');

  print('\n--- Demo Complete ---');
}
// Super Action Skills Script: Skill Trees/Unit Progression
// Allows units or heroes to gain experience and unlock new skills or upgrades.

type Skill = {
  id: string;
  name: string;
  description: string;
  prerequisites: string[]; // Skill IDs
  levelRequired: number;
  unlocked: boolean;
};

type Unit = {
  id: string;
  name: string;
  experience: number;
  level: number;
  skillTree: Skill[];
  unlockedSkills: string[]; // Skill IDs
};

const EXP_PER_LEVEL = 1000;

// Calculate unit level from experience
function calculateLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

// Check if a skill is unlockable for a unit
function canUnlockSkill(unit: Unit, skill: Skill): boolean {
  if (skill.unlocked) return false;
  if (unit.level < skill.levelRequired) return false;
  // Check if all prerequisites are unlocked
  for (const pre of skill.prerequisites) {
    if (!unit.unlockedSkills.includes(pre)) return false;
  }
  return true;
}

// Unlock a skill for a unit
function unlockSkill(unit: Unit, skillId: string): boolean {
  const skill = unit.skillTree.find(s => s.id === skillId);
  if (!skill) return false;
  if (!canUnlockSkill(unit, skill)) return false;
  skill.unlocked = true;
  unit.unlockedSkills.push(skillId);
  return true;
}

// Add experience and handle level up
function addExperience(unit: Unit, amount: number): void {
  unit. experience += amount;
  const newLevel = calculateLevel(unit.experience);
  if (newLevel > unit.level) {
    unit.level = newLevel;
    // Trigger level-up effects here (e.g., stat increases)
  }
}

// Example usage
const skillTree: Skill[] = [
  { id: 'sword_mastery', name: 'Sword Mastery', description: 'Increase sword damage.', prerequisites: [], levelRequired: 1, unlocked: false },
  { id: 'blade_fury', name: 'Blade Fury', description: 'Special multi-hit attack.', prerequisites: ['sword_mastery'], levelRequired: 3, unlocked: false },
  { id: 'iron_will', name: 'Iron Will', description: 'Increase defense.', prerequisites: [], levelRequired: 2, unlocked: false },
];

const hero: Unit = {
  id: 'hero_001',
  name: 'Sir Gallant',
  experience: 0,
  level: 1,
  skillTree: JSON.parse(JSON.stringify(skillTree)),
  unlockedSkills: [],
};

// Simulate progression
addExperience(hero, 2100); // Level up to 3
unlockSkill(hero, 'sword_mastery'); // Unlock Sword Mastery
unlockSkill(hero, 'iron_will');     // Unlock Iron Will
unlockSkill(hero, 'blade_fury');    // Unlock Blade Fury (requires Sword Mastery and level 3)

console.log(hero);

export { Skill, Unit, addExperience, unlockSkill, canUnlockSkill, calculateLevel };
mkdir legendary_ops_center
cd legendary_ops_center

mkdir assets assets/images assets/audio assets/audio/voice
mkdir scenes ui systems
pip install pygame pygame_gui gTTS
python main.py
ui/dialogue_ui.py
systems/save_load.py
import pygame
import pygame_gui
from config import FONT, WHITE

class DialogueBox:
    def __init__(self, manager, dialogue_data, emotional_state):
        self.manager = manager
        self.dialogue_data = dialogue_data
        self.emotional_state = emotional_state
        self.buttons = []
        self.texts = []

    def render(self, screen):
        self.buttons.clear()
        self.texts.clear()

        # Display dialogue line
        line = self.dialogue_data["text"]
        text_surface = FONT.render(line, True, WHITE)
        screen.blit(text_surface, (50, 100))
        self.texts.append(text_surface)

        # Display choices
        for i, choice in enumerate(self.dialogue_data["choices"]):
            btn = pygame_gui.elements.UIButton(
                relative_rect=pygame.Rect((50, 200 + i * 50), (300, 40)),
                text=choice["text"],
                manager=self.manager
            )
            self.buttons.append((btn, choice["effect"]))

    def handle_event(self, event):
        for btn, effect in self.buttons:
            if event.type == pygame_gui.UI_BUTTON_PRESSED and event.ui_element == btn:
                self.emotional_state.apply_choice(effect)
                return True  # Dialogue complete
        return False

import json
import os

SAVE_PATH = "save_data.json"

def save_game(data):
    with open(SAVE_PATH, "w") as f:
        json.dump(data, f)

def load_game():
    if os.path.exists(SAVE_PATH):
        with open(SAVE_PATH, "r") as f:
            return json.load(f)
    return {}

from systems.emotional_state import EmotionalState
from systems.save_load import save_game, load_game
from ui.dialogue_ui import DialogueBox

emotions = EmotionalState()
dialogue_data = {
    "text": "Wife: You're late again.",
    "choices": [
        {"text": "I'm sorry. I had no choice.", "effect": -5},
        {"text": "This mission matters more.", "effect": -15}
    ]
}
dialogue_box = DialogueBox(manager, dialogue_data, emotions)
dialogue_box.render(screen)
scene_stage = "dialogue"

if scene_stage == "dialogue":
    manager.draw_ui(screen)
    dialogue_box.render(screen)

    for event in pygame. event.get():
        if event.type == pygame.QUIT:
            running = False
        manager.process_events(event)
        if dialogue_box.handle_event(event):
            save_game({
                "relationship_score": emotions.relationship_score,
                "trauma_score": emotions.trauma_score,
                "last_choice": dialogue_data["text"]
            })
            scene_stage = "post_dialogue"

{
  "relationship_score": 45,
  "trauma_score": 82,
  "last_choice": "Wife: You're late again."
}

data = load_game()
if data:
    print("Loaded save:", data)

import pygame
from config import FONT, WHITE

class FlashbackScene:
    def __init__(self, screen, text):
        self.screen = screen
        self.bg = pygame.image.load("assets/images/flashback.png")
        self.text = text

    def draw(self):
        self.screen.blit(self.bg, (0, 0))
        flash_text = FONT.render(self.text, True, WHITE)
        self.screen.blit(flash_text, (50, 500))
        pygame. display.update()
        pygame. time.delay(3000)

from scenes.flashback_scene import FlashbackScene

if emotions.trauma_score > 80:
    flashback = FlashbackScene(screen, "She was turning six. I promised I'd be there...")
    flashback.draw()

import pygame
from config import FONT, WHITE

class CombatScene:
    def __init__(self, screen, gear):
        self.screen = screen
        self.gear = gear
        self.bg = pygame.image.load("assets/images/combat_bg.png")

    def draw(self):
        self.screen.blit(self.bg, (0, 0))
        summary = f"Engaging with {self.gear['Primary']} and {self.gear['Gadget']}..."
        text = FONT.render(summary, True, WHITE)
        self.screen.blit(text, (50, 100))
        pygame. display.update()
        pygame. time.delay(2000)

def gear_effects(gear, emotions):
    if gear["Primary"] == "Shotgun":
        emotions.trauma_score += 10
    if gear["Gadget"] == "Grenade":
        emotions.relationship_score -= 20

{
  "scene": "home",
  "dialogue": [
    {
      "text": "Wife: You're late again.",
      "condition": "relationship_score < 60",
      "choices": [
        { "text": "I'm sorry. I had no choice.", "effect": -5 },
        { "text": "This mission matters more.", "effect": -15 }
      ]
    }
  ]
}

import json

def load_dialogue(path):
    with open(path, "r") as f:
        return json.load(f)["dialogue"]

from systems.dialogue_loader import load_dialogue

dialogue_script = load_dialogue("dialogue/home_dialogue.json")
for entry in dialogue_script:
    if emotions.relationship_score < 60:
        dialogue_box = DialogueBox(manager, entry, emotions)
        dialogue_box.render(screen)
        scene_stage = "dialogue"

[
  {
    "title": "Echo Shield",
    "objective": "Rescue hostages in a war-torn zone.",
    "risk": "High",
    "effects": { "relationship": -20, "trauma": +30 }
  },
  {
    "title": "Stay Home",
    "objective": "Skip mission to reconnect with family.",
    "risk": "Low",
    "effects": { "relationship": +10, "trauma": -10 }
  }
]

import json

def load_missions(path="missions/missions.json"):
    with open(path, "r") as f:
        return json.load(f)

from systems.mission_loader import load_missions

missions = load_missions()
selected_mission = None

def apply_mission_effects(mission, emotions):
    effects = mission["effects"]
    emotions.relationship_score += effects["relationship"]
    emotions.trauma_score += effects["trauma"]

import pygame

def fade_in(screen, surface, speed=5):
    fade = pygame.Surface(surface.get_size())
    fade.fill((0, 0, 0))
    for alpha in range(0, 255, speed):
        fade.set_alpha(alpha)
        screen.blit(surface, (0, 0))
        screen.blit(fade, (0, 0))
        pygame. display.update()
        pygame .time.delay(30)

def animate_combat(screen, gear):
    for i in range(1, 6):
        frame = pygame.image.load(f"assets/images/combat_frame{i}.png")
        screen.blit(frame, (0, 0))
        pygame. display.update()
        pygame .time.delay(200)
    summary = f"Combat complete with {gear['Primary']} and {gear['Gadget']}."
    text = pygame.font.SysFont("impact", 32).render(summary, True, (255, 255, 255))
    screen.blit(text, (50, 500))
    pygame. display.update()
    pygame .time.delay(2000)

import pygame
import pygame_gui
from systems.save_load import save_game, load_game

def create_save_menu(manager):
    save_btn = pygame_gui.elements.UIButton(
        relative_rect=pygame.Rect((600, 50), (150, 40)),
        text="Save Game",
        manager=manager
    )
    load_btn = pygame_gui.elements.UIButton(
        relative_rect=pygame.Rect((600, 100), (150, 40)),
        text="Load Game",
        manager=manager
    )
    return save_btn, load_btn

def handle_save_load(event, emotions):
    if event.type == pygame_gui.UI_BUTTON_PRESSED:
        if event.ui_element.text == "Save Game":
            save_game({
                "relationship_score": emotions.relationship_score,
                "trauma_score": emotions.trauma_score
            })
        elif event.ui_element.text == "Load Game":
            data = load_game()
            emotions.relationship_score = data.get("relationship_score", 100)
            emotions.trauma_score = data.get("trauma_score", 0)

import pygame
from config import FONT, WHITE

class EndingScene:
    def __init__(self, screen, emotions):
        self.screen = screen
        self.emotions = emotions
        self.bg = pygame.image.load("assets/images/ending_bg.png")

    def draw(self):
        self.screen.blit(self.bg, (0, 0))
        if self.emotions.relationship_score < 40:
            ending = "You chose duty over family. She's gone."
        elif self.emotions.trauma_score > 80:
            ending = "The war never left you. You live in silence."
        else:
            ending = "You found balance. Peace, at last."

        text = FONT.render(ending, True, WHITE)
        self.screen.blit(text, (50, 500))
        pygame.display.update()
        pygame.time.delay(5000)

from scenes.ending_scene import EndingScene

if game_complete:
    ending = EndingScene(screen, emotions)
    ending.draw()

{
  "npc": "Sergeant Hawk",
  "dialogue": [
    {
      "text": "Hawk: You ready for this?",
      "choices": [
        { "text": "Always.", "effect": 0 },
        { "text": "Not sure anymore.", "effect": +10 }
      ]
    },
    {
      "text": "Hawk: You hesitated back there.",
      "condition": "trauma_score > 50",
      "choices": [
        { "text": "I saw her face.", "effect": +20 },
        { "text": "I’m fine.", "effect": -10 }
      ]
    }
  ]

def load_npc_dialogue(path, emotions):
    import json
    with open(path, "r") as f:
        data = json.load(f)
    valid_lines = []
    for entry in data["dialogue"]:
        cond = entry.get("condition")
        if not cond or eval(cond, {}, {"trauma_score": emotions.trauma_score}):
            valid_lines.append(entry)
    return valid_lines

import pygame

class TacticalMap:
    def __init__(self, screen):
        self.screen = screen
        self.map_img = pygame.image.load("assets/images/map.png")
        self.mission_points = {
            "Echo Shield": (200, 150),
            "Night Ember": (500, 300)
        }

    def draw(self):
        self.screen.blit(self.map_img, (0, 0))
        for name, pos in self.mission_points.items():
            pygame.draw.circle(self.screen, (255, 0, 0), pos, 10)
            label = pygame.font.SysFont("impact", 24).render(name, True, (255, 255, 255))
            self.screen.blit(label, (pos[0] + 15, pos[1] - 10))

from ui.tactical_map import TacticalMap

map_ui = TacticalMap(screen)
map_ui.draw()

import pygame
from config import FONT, WHITE

class Cutscene:
    def __init__(self, screen, frames, narration):
        self.screen = screen
        self.frames = frames  # List of image paths
        self.narration = narration  # List of voice lines

    def play(self):
        for i, frame_path in enumerate(self.frames):
            frame = pygame.image.load(frame_path)
            self.screen.blit(frame, (0, 0))
            pygame.display.update()
            pygame.time.delay(1000)

            from systems.audio import play_voice
            play_voice(self.narration[i])
            pygame.time.delay(3000)

cutscene = Cutscene(
    screen,
    frames=["assets/images/cut1.png", "assets/images/cut2.png"],
    narration=[
        "The war began with silence.",
        "And silence is how it ends."
    ]
)
cutscene.play()

import json

class ScriptEngine:
    def __init__(self, path, emotions):
        with open(path, "r") as f:
            self.script = json.load(f)
        self.emotions = emotions
        self.index = 0

    def get_next_line(self):
        while self.index < len(self.script):
            entry = self.script[self.index]
            self.index += 1
            cond = entry.get("condition")
            if not cond or eval(cond, {}, {
                "relationship_score": self.emotions.relationship_score,
                "trauma_score": self.emotions.trauma_score
            }):
                return entry
        return None

[
  {
    "text": "Wife: You promised you'd be careful.",
    "condition": "relationship_score < 60",
    "choices": [
      { "text": "I know. I'm sorry.", "effect": -5 },
      { "text": "I had no choice.", "effect": -15 }
    ]
  },
  {
    "text": "Daughter: Are you coming home this time?",
    "condition": "trauma_score < 50",
    "choices": [
      { "text": "Yes. I promise.", "effect": +10 },
      { "text": "I can't say.", "effect": -5 }
    ]
  }
]
pip install pyinstaller
pyinstaller --onefile --windowed main.py
import pygame
from config import WHITE

TILE_SIZE = 40
GRID_WIDTH, GRID_HEIGHT = 20, 15

class TacticalCombat:
    def __init__(self, screen):
        self.screen = screen
        self.grid = [[0 for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]
        self.player_pos = [5, 5]
        self.enemy_pos = [15, 10]
        self.cover_tiles = [(7, 5), (10, 8), (12, 12)]

    def draw_grid(self):
        for y in range(GRID_HEIGHT):
            for x in range(GRID_WIDTH):
                rect = pygame.Rect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE)
                pygame.draw.rect(self.screen, (50, 50, 50), rect, 1)
                if (x, y) in self.cover_tiles:
                    pygame.draw.rect(self.screen, (100, 100, 100), rect)

    def draw_units(self):
        px, py = self.player_pos
        ex, ey = self.enemy_pos
        pygame.draw.rect(self.screen, (0, 255, 0), (px*TILE_SIZE, py*TILE_SIZE, TILE_SIZE, TILE_SIZE))
        pygame.draw.rect(self.screen, (255, 0, 0), (ex*TILE_SIZE, ey*TILE_SIZE, TILE_SIZE, TILE_SIZE))

    def move_player(self, dx, dy):
        new_x = self.player_pos[0] + dx
        new_y = self.player_pos[1] + dy
        if 0 <= new_x < GRID_WIDTH and 0 <= new_y < GRID_HEIGHT:
            self.player_pos = [new_x, new_y]

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_w: self.move_player(0, -1)
                if event.key == pygame.K_s: self.move_player(0, 1)
                if event.key == pygame.K_a: self.move_player(-1, 0)
                if event.key == pygame.K_d: self.move_player(1, 0)

    def draw(self):
        self.draw_grid()
        self.draw_units()

def is_in_cover(pos, cover_tiles):
    return pos in cover_tiles

import pygame
import json

class LevelEditor:
    def __init__(self, screen):
        self.screen = screen
        self.points = []

    def add_point(self, pos, label):
        self.points.append({"pos": pos, "label": label})

    def draw(self):
        for p in self.points:
            pygame.draw.circle(self.screen, (0, 255, 255), p["pos"], 10)
            text = pygame.font.SysFont("arial", 20).render(p["label"], True, (255, 255, 255))
            self.screen.blit(text, (p["pos"][0] + 10, p["pos"][1]))

    def save(self, path="missions/custom_map.json"):
        with open(path, "w") as f:
            json.dump(self.points, f)

import requests

def upload_save(data):
    requests.post("https://your-api.com/save", json=data)

def download_save():
    return requests.get("https://your-api.com/save").json()

class TacticalCombat:
    def __init__(self, screen):
        self.screen = screen
        self.player_pos = [5, 5]
        self.enemy_pos = [15, 10]
        self.enemy_path = [(15, 10), (14, 10), (13, 10), (12, 10)]
        self.enemy_index = 0
        self.cover_tiles = [(7, 5), (10, 8), (12, 12)]

    def update_enemy(self):
        self.enemy_index = (self.enemy_index + 1) % len(self.enemy_path)
        self.enemy_pos = list(self.enemy_path[self.enemy_index])

    def check_attack(self):
        px, py = self.player_pos
        ex, ey = self.enemy_pos
        if abs(px - ex) <= 1 and abs(py - ey) <= 1:
            return True  # Enemy attacks
        return False

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_w: self.move_player(0, -1)
                if event.key == pygame.K_s: self.move_player(0, 1)
                if event.key == pygame.K_a: self.move_player(-1, 0)
                if event.key == pygame.K_d: self.move_player(1, 0)
        self.update_enemy()
        if self.check_attack():
            print("Enemy attacks!")

{
  "start": {
    "mission": "Echo Shield",
    "next": {
      "success": "Night Ember",
      "failure": "Stay Home"
    }
  },
  "Night Ember": {
    "mission": "Night Ember",
    "next": {
      "success": "Final Stand",
      "failure": "PTSD Flashback"
    }
  }
}

import json

class CampaignManager:
    def __init__(self, path="campaign/campaign.json"):
        with open(path, "r") as f:
            self.tree = json.load(f)
        self.current_node = "start"

    def get_current_mission(self):
        return self.tree[self.current_node]["mission"]

    def advance(self, outcome):
        self.current_node = self.tree[self.current_node]["next"][outcome]

campaign = CampaignManager()
mission = campaign.get_current_mission()

# After mission:
campaign.advance("success")  # or "failure"

def fade_out(screen, speed=5):
    fade = pygame.Surface(screen.get_size())
    fade.fill((0, 0, 0))
    for alpha in range(255, 0, -speed):
        fade.set_alpha(alpha)
        screen.blit(fade, (0, 0))
        pygame.display.update()
        pygame.time.delay(30)

button = pygame_gui.elements.UIButton(...)
button.set_active_effect("hover", {"bg_color": "#FFD700"})

def typewriter_text(screen, text, pos, font, color, delay=50):
    for i in range(len(text)):
        partial = font.render(text[:i+1], True, color)
        screen.blit(partial, pos)
        pygame.display.update()
        pygame.time.delay(delay)

class Character:
    def __init__(self, name):
        self.name = name
        self.level = 1
        self.xp = 0
        self.xp_to_next = 100
        self.skills = []

    def gain_xp(self, amount):
        self.xp += amount
        if self.xp >= self.xp_to_next:
            self.level_up()

    def level_up(self):
        self.level += 1
        self.xp -= self.xp_to_next
        self.xp_to_next = int(self.xp_to_next * 1.5)
        print(f"{self.name} leveled up to {self.level}!")
        self.unlock_skill()

    def unlock_skill(self):
        new_skill = f"Skill_{self.level}"
        self.skills.append(new_skill)
        print(f"{self.name} unlocked {new_skill}!")

player = Character("Echo")
player.gain_xp(50)
player.gain_xp(60)  # Triggers level-up

class DialogueManager:
    def __init__(self):
        self.memory = {}
        self.dialogue_tree = {
            "intro": {
                "text": "Do you trust me?",
                "choices": {
                    "Yes": "trust_path",
                    "No": "doubt_path"
                }
            },
            "trust_path": {
                "text": "Thank you. I won’t forget this.",
                "emotion": "grateful"
            },
            "doubt_path": {
                "text": "I see. Maybe I was wrong about you.",
                "emotion": "hurt"
            }
        }

    def get_dialogue(self, node):
        return self.dialogue_tree[node]["text"]

    def choose(self, node, choice):
        next_node = self.dialogue_tree[node]["choices"][choice]
        emotion = self.dialogue_tree[next_node]["emotion"]
        self.memory["relationship"] = emotion
        return next_node

dm = DialogueManager()
node = "intro"
print(dm.get_dialogue(node))
node = dm.choose(node, "Yes")  # or "No"
print(dm.get_dialogue(node))
print("Emotion stored:", dm.memory["relationship"])

class BaseScene:
    def __init__(self, name, objectives, enemies, environment):
        self.name = name
        self.objectives = objectives
        self.enemies = enemies
        self.environment = environment

    def load(self):
        print(f"Loading scene: {self.name}")
        print(f"Objectives: {self.objectives}")
        print(f"Enemies: {self.enemies}")
        print(f"Environment: {self.environment}")

from scenes.templates.base_scene import BaseScene

mission_echo = BaseScene(
    name="Echo Shield",
    objectives=["Protect the convoy", "Survive 5 turns"],
    enemies=["Sniper", "Grunt", "Drone"],
    environment="Urban Ruins"
)

mission_echo.load()

class Unit:
    def __init__(self, name, pos):
        self.name = name
        self.pos = pos
        self.overwatch_tile = None

    def set_overwatch(self, tile):
        self.overwatch_tile = tile

    def check_overwatch(self, enemy_pos):
        if enemy_pos == self.overwatch_tile:
            print(f"{self.name} fires overwatch at {enemy_pos}!")

def is_flanked(attacker_pos, defender_pos, defender_facing):
    dx = attacker_pos[0] - defender_pos[0]
    dy = attacker_pos[1] - defender_pos[1]
    direction = (dx, dy)
    return direction != defender_facing

class SuppressionZone:
    def __init__(self, origin, radius):
        self.origin = origin
        self.radius = radius

    def affects(self, target_pos):
        ox, oy = self.origin
        tx, ty = target_pos
        return abs(ox - tx) <= self.radius and abs(oy - ty) <= self.radius

class MoralitySystem:
    def __init__(self):
        self.alignment = 0  # -100 (ruthless) to +100 (heroic)

    def apply_choice(self, impact):
        self.alignment += impact
        self.alignment = max(-100, min(100, self.alignment))

    def get_alignment_label(self):
        if self.alignment > 50: return "Heroic"
        elif self.alignment < -50: return "Ruthless"
        else: return "Neutral"

morality = MoralitySystem()
morality.apply_choice(-30)  # e.g. sacrificed civilians
morality.apply_choice(+50)  # e.g. spared enemy

print("Current alignment:", morality.get_alignment_label())

import pygame_gui

class MissionEditor:
    def __init__(self, manager):
        self.manager = manager
        self.tiles = []
        self.selected_tile = None
        self.create_ui()

    def create_ui(self):
        self.tile_selector = pygame_gui.elements.UIDropDownMenu(
            options_list=["Grass", "Wall", "Cover", "Spawn"],
            starting_option="Grass",
            relative_rect=pygame.Rect((10, 10), (150, 30)),
            manager=self.manager
        )

    def handle_click(self, pos):
        tile_type = self.tile_selector.selected_option
        self.tiles.append({"type": tile_type, "pos": pos})
        print(f"Placed {tile_type} at {pos}")

import json

def save_mission(tiles, filename="mission.json"):
    with open(filename, "w") as f:
        json.dump(tiles, f)

class RelationshipManager:
    def __init__(self):
        self.relationships = {}  # e.g. {("Echo", "Vera"): 50}

    def adjust(self, char_a, char_b, amount):
        key = tuple(sorted([char_a, char_b]))
        self.relationships[key] = self.relationships.get(key, 0) + amount
        self.relationships[key] = max(-100, min(100, self.relationships[key]))

    def get_status(self, char_a, char_b):
        key = tuple(sorted([char_a, char_b]))
        score = self.relationships.get(key, 0)
        if score > 50: return "Loyal"
        elif score < -50: return "Hostile"
        else: return "Neutral"

rm = RelationshipManager()
rm.adjust("Echo", "Vera", +30)  # Helped in mission
rm.adjust("Echo", "Vera", -60)  # Ignored distress call

print("Echo ↔ Vera:", rm.get_status("Echo", "Vera"))

class FogOfWar:
    def __init__(self, map_size):
        self.visible_tiles = set()
        self.map_size = map_size

    def update_visibility(self, unit_pos, vision_range):
        self.visible_tiles.clear()
        ux, uy = unit_pos
        for x in range(ux - vision_range, ux + vision_range + 1):
            for y in range(uy - vision_range, uy + vision_range + 1):
                if 0 <= x < self.map_size[0] and 0 <= y < self.map_size[1]:
                    self.visible_tiles.add((x, y))

    def is_visible(self, tile):
        return tile in self.visible_tiles

class StealthUnit:
    def __init__(self, pos, stealth=True):
        self.pos = pos
        self.stealth = stealth

    def check_detection(self, enemy_pos, detection_range):
        if not self.stealth: return True
        dx = abs(self.pos[0] - enemy_pos[0])
        dy = abs(self.pos[1] - enemy_pos[1])
        return dx <= detection_range and dy <= detection_range

class Codex:
    def __init__(self):
        self.entries = {}  # e.g. {"The Ember War": {"unlocked": False, "text": "..."}}

    def add_entry(self, title, text):
        self.entries[title] = {"unlocked": False, "text": text}

    def unlock(self, title):
        if title in self.entries:
            self.entries[title]["unlocked"] = True

    def get_unlocked_entries(self):
        return {k: v["text"] for k, v in self.entries.items() if v["unlocked"]}

codex = Codex()
codex.add_entry("The Ember War", "A conflict that reshaped the continent...")
codex.unlock("The Ember War")

for title, text in codex.get_unlocked_entries().items():
    print(f"{title}: {text}")

class WeatherSystem:
    def __init__(self):
        self.current = "Clear"

    def set_weather(self, condition):
        self.current = condition

    def get_modifiers(self):
        if self.current == "Rain":
            return {"accuracy": -10, "movement": -1}
        elif self.current == "Fog":
            return {"vision": -3}
        elif self.current == "Snow":
            return {"movement": -2}
        return {}

class TerrainTile:
    def __init__(self, type):
        self.type = type

    def get_modifiers(self):
        if self.type == "Mud": return {"movement": -2}
        if self.type == "HighGround": return {"accuracy": +15}
        if self.type == "Forest": return {"stealth": +20}
        return {}

class BanterSystem:
    def __init__(self):
        self.triggers = {
            "kill": ["Nice shot!", "That one's down!", "Target neutralized."],
            "heal": ["Thanks, I needed that.", "You're a lifesaver."],
            "miss": ["Damn!", "I had that!", "Next time..."]
        }

    def get_line(self, event_type):
        import random
        return random.choice(self.triggers.get(event_type, ["..."]))

banter = BanterSystem()
print("Echo:", banter.get_line("kill"))

import json

class SaveSystem:
    def __init__(self, filename="savegame.json"):
        self.filename = filename

    def save(self, game_state):
        with open(self.filename, "w") as f:
            json.dump(game_state, f)

    def load(self):
        with open(self.filename, "r") as f:
            return json.load(f)

game_state = {
    "campaign_node": "Night Ember",
    "player_stats": {"level": 3, "xp": 120},
    "relationships": {("Echo", "Vera"): 40},
    "morality": 25,
    "weather": "Fog"
}

class CutsceneTrigger:
    def __init__(self, trigger_type, condition, action):
        self.trigger_type = trigger_type  # e.g. "enter_tile", "mission_complete"
        self.condition = condition        # e.g. tile coords or mission name
        self.action = action              # function to call

    def check_trigger(self, game_state):
        if self.trigger_type == "enter_tile" and game_state["player_pos"] == self.condition:
            self.action()
        elif self.trigger_type == "mission_complete" and game_state["mission"] == self.condition:
            self.action()

def pan_camera(screen, start_pos, end_pos, speed=5):
    for i in range(0, 101, speed):
        x = start_pos[0] + (end_pos[0] - start_pos[0]) * i // 100
        y = start_pos[1] + (end_pos[1] - start_pos[1]) * i // 100
        draw_scene_at(screen, (x, y))
        pygame.display.update()
        pygame.time.delay(30)

class TimelineManager:
    def __init__(self):
        self.timeline = []
        self.current_index = 0

    def add_event(self, label, data):
        self.timeline.append({"label": label, "data": data})

    def jump_to(self, label):
        for i, event in enumerate(self.timeline):
            if event["label"] == label:
                self.current_index = i
                return event["data"]
        return None

timeline = TimelineManager()
timeline.add_event("Prologue", {"scene": "Echo Shield"})
timeline.add_event("Flashback", {"scene": "Childhood Trauma"})
timeline.add_event("Present", {"scene": "Final Stand"})

flashback_data = timeline.jump_to("Flashback")

class DebugConsole:
    def __init__(self):
        self.commands = {
            "set_weather": self.set_weather,
            "teleport": self.teleport,
            "give_xp": self.give_xp
        }

    def execute(self, command_str, game_state):
        parts = command_str.split()
        cmd = parts[0]
        args = parts[1:]
        if cmd in self.commands:
            self.commands[cmd](game_state, *args)

    def set_weather(self, game_state, condition):
        game_state["weather"] = condition
        print(f"Weather set to {condition}")

    def teleport(self, game_state, x, y):
        game_state["player_pos"] = (int(x), int(y))
        print(f"Teleported to {(x, y)}")

    def give_xp(self, game_state, amount):
        game_state["player_stats"]["xp"] += int(amount)
        print(f"Gave {amount} XP")

console = DebugConsole()
console.execute("set_weather Rain", game_state)
console.execute("teleport 10 5", game_state)

class SubtitleManager:
    def __init__(self):
        self.queue = []  # List of (text, duration)

    def add_line(self, text, duration):
        self.queue.append((text, duration))

    def play(self, screen, font, pos):
        for text, duration in self.queue:
            rendered = font.render(text, True, (255, 255, 255))
            screen.blit(rendered, pos)
            pygame.display.update()
            pygame.time.delay(duration)

import pygame.mixer

def play_voiceover(file_path):
    pygame.mixer.init()
    sound = pygame.mixer.Sound(file_path)
    sound.play()

subtitle = SubtitleManager()
subtitle.add_line("We were never meant to survive this.", 3000)
play_voiceover("audio/line1.ogg")
subtitle.play(screen, font, (50, 500))

class NarrativeNode:
    def __init__(self, id, text, choices):
        self.id = id
        self.text = text
        self.choices = choices  # Dict of {choice_text: next_node_id}

class FlowchartManager:
    def __init__(self):
        self.nodes = {}

    def add_node(self, node):
        self.nodes[node.id] = node

    def get_next(self, current_id, choice):
        node = self.nodes[current_id]
        return node.choices.get(choice)

import os
import json

class ModLoader:
    def __init__(self, mod_folder="mods"):
        self.mods = []
        self.load_mods(mod_folder)

    def load_mods(self, folder):
        for mod_name in os.listdir(folder):
            mod_path = os.path.join(folder, mod_name, "mod.json")
            if os.path.exists(mod_path):
                with open(mod_path) as f:
                    mod_data = json.load(f)
                    self.mods.append(mod_data)

{
  "name": "Echo's Reckoning",
  "new_missions": ["Echo_Revenge"],
  "assets": {
    "sprites": ["echo_custom.png"],
    "audio": ["echo_theme.ogg"]
  }
}

PHONEME_MAP = {
    "A": "mouth_open",
    "E": "mouth_smile",
    "O": "mouth_round",
    "M": "mouth_closed"
}

class LipSyncController:
    def __init__(self, animation_system):
        self.animation_system = animation_system

    def sync_to_text(self, text):
        for char in text.upper():
            if char in PHONEME_MAP:
                mouth_shape = PHONEME_MAP[char]
                self.animation_system.set_mouth(mouth_shape)
                pygame.time.delay(100)

class FacialAnimator:
    def set_mouth(self, shape):
        print(f"Animating mouth: {shape}")

    def set_emotion(self, emotion):
        print(f"Animating emotion: {emotion}")

import json

class LocalizationManager:
    def __init__(self, lang="en"):
        with open(f"localization/{lang}.json") as f:
            self.strings = json.load(f)

    def get(self, key):
        return self.strings.get(key, f"[{key}]")


  "mission_start": "Begin Mission",
  "dialogue_001": "We were never meant to survive this."
}

loc = LocalizationManager("fr")
print(loc.get("mission_start"))  # → "Commencer la mission"

import os

class AssetPipeline:
    def __init__(self, asset_folder="assets"):
        self.models = []
        self.shaders = []
        self.vfx = []
        self.load_assets(asset_folder)

    def load_assets(self, folder):
        for file in os.listdir(folder):
            if file.endswith(".obj") or file.endswith(".fbx"):
                self.models.append(file)
            elif file.endswith(".glsl") or file.endswith(".shader"):
                self.shaders.append(file)
            elif file.endswith(".vfx.json"):
                self.vfx.append(file)

{
  "name": "Explosion",
  "particles": 50,
  "color": "orange",
  "duration": 1.5
}

class TimelineTrack:
    def __init__(self, target, property):
        self.target = target
        self.property = property
        self.keyframes = []  # List of (time, value)

    def add_keyframe(self, time, value):
        self.keyframes.append((time, value))
        self.keyframes.sort()

class TimelinePlayer:
    def __init__(self, tracks):
        self.tracks = tracks
        self.time = 0

    def update(self, delta_time):
        self.time += delta_time
        for track in self.tracks:
            for t, value in track.keyframes:
                if t <= self.time:
                    setattr(track.target, track.property, value)

camera = Camera()
track = TimelineTrack(camera, "position")
track.add_keyframe(0, (0, 0))
track.add_keyframe(1000, (100, 50))

player = TimelinePlayer([track])
player.update(500)  # halfway through pan

import random

class AIDialogueGenerator:
    def __init__(self):
        self.templates = {
            "greeting": [
                "Hey {name}, ready for another mission?",
                "Good to see you, {name}. Stay sharp.",
                "Welcome back, {name}. We’ve got trouble."
            ],
            "reaction": [
                "That was reckless, {name}.",
                "You saved us out there, {name}.",
                "I’m not sure I trust your judgment anymore."
            ]
        }

    def generate(self, type, name):
        return random.choice(self.templates[type]).format(name=name)

dialogue = AIDialogueGenerator()
print(dialogue.generate("greeting", "Echo"))

import os
import shutil

class BuildManager:
    def __init__(self, project_dir):
        self.project_dir = project_dir

    def build_for_platform(self, platform):
        output_dir = f"build/{platform}"
        shutil.copytree(self.project_dir, output_dir, dirs_exist_ok=True)

        if platform == "PC":
            self.package_pc(output_dir)
        elif platform == "Mobile":
            self.package_mobile(output_dir)
        elif platform == "Console":
            self.package_console(output_dir)

    def package_pc(self, path):
        print(f"Packaging for PC at {path}")
        # Add .exe wrapping, config files, etc.

    def package_mobile(self, path):
        print(f"Packaging for Mobile at {path}")
        # Add .apk or .ipa generation hooks

    def package_console(self, path):
        print(f"Packaging for Console at {path}")
        # Add SDK integration (e.g. Xbox, PlayStation)

builder = BuildManager("project/")
builder.build_for_platform("PC")

class AnalyticsTracker:
    def __init__(self):
        self.events = []

    def log_event(self, event_type, data):
        self.events.append({"type": event_type, "data": data})

    def export(self, filename="analytics.json"):
        import json
        with open(filename, "w") as f:
            json.dump(self.events, f)

class Heatmap:
    def __init__(self, map_size):
        self.grid = [[0 for _ in range(map_size[1])] for _ in range(map_size[0])]

    def record_position(self, x, y):
        self.grid[x][y] += 1

    def export_csv(self, filename="heatmap.csv"):
        import csv
        with open(filename, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(self.grid)

import requests

class CloudSaveManager:
    def __init__(self, api_url):
        self.api_url = api_url

    def upload_save(self, save_data, user_id):
        requests.post(f"{self.api_url}/upload", json={"user": user_id, "data": save_data})

    def download_save(self, user_id):
        response = requests.get(f"{self.api_url}/download/{user_id}")
        return response.json()

class TrailerEditor:
    def __init__(self):
        self.timeline = []

    def add_clip(self, asset, start_time, duration):
        self.timeline.append({"asset": asset, "start": start_time, "duration": duration})

    def render(self):
        for clip in self.timeline:
            print(f"Rendering {clip['asset']} from {clip['start']} for {clip['duration']}ms")

name: Build Game

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Dependencies
        run: pip install -r requirements.txt
      - name: Run Build Script
        run: python build.py
      - name: Upload Artifact
        uses: actions/upload-artifact@v2
        with:
          name: game-build
          path: build/

class VersionManager:
    def __init__(self):
        self.version = "1.0.0"
        self.changelog = []

    def bump(self, type):
        major, minor, patch = map(int, self.version.split("."))
        if type == "major": major += 1; minor = 0; patch = 0
        elif type == "minor": minor += 1; patch = 0
        elif type == "patch": patch += 1
        self.version = f"{major}.{minor}.{patch}"

    def add_changelog(self, entry):
        self.changelog.append(entry)

import shutil
import zipfile

def compress_assets(folder, output="assets.zip"):
    with zipfile.ZipFile(output, "w") as zipf:
        for root, _, files in os.walk(folder):
            for file in files:
                zipf.write(os.path.join(root, file))

def apply_platform_settings(platform):
    if platform == "Mobile":
        print("Reducing texture resolution, disabling shadows")
    elif platform == "Console":
        print("Enabling controller support, optimizing shaders")


import requests

class TelemetryClient:
    def __init__(self, server_url):
        self.server_url = server_url

    def send_event(self, user_id, event_type, data):
        payload = {
            "user": user_id,
            "event": event_type,
            "data": data
        }
        requests.post(f"{self.server_url}/telemetry", json=payload)

telemetry = TelemetryClient("https://yourserver.com")
telemetry.send_event("user123", "mission_complete", {"mission": "Echo Shield", "time": 320})
telemetry.send_event("user123", "death", {"location": [12, 8], "enemy": "Sniper"})

class PatchManager:
    def __init__(self, patch_url):
        self.patch_url = patch_url

    def check_for_updates(self, current_version):
        response = requests.get(f"{self.patch_url}/latest")
        latest = response.json()["version"]
        return latest != current_version

    def download_patch(self):
        patch_data = requests.get(f"{self.patch_url}/patch.zip")
        with open("patch.zip", "wb") as f:
            f.write(patch_data.content)
        # Unzip and apply...

class ModManager:
    def __init__(self, mod_folder="mods"):
        self.mods = []

    def scan_mods(self):
        for mod in os.listdir(mod_folder):
            if os.path.exists(os.path.join(mod_folder, mod, "mod.json")):
                self.mods.append(mod)

    def enable_mod(self, mod_name):
        print(f"Enabled mod: {mod_name}")

class ModPackager:
    def __init__(self, mod_name, assets, scripts):
        self.mod_name = mod_name
        self.assets = assets
        self.scripts = scripts

    def package(self):
        os.makedirs(f"mods/{self.mod_name}", exist_ok=True)
        for asset in self.assets:
            shutil.copy(asset, f"mods/{self.mod_name}/assets/")
        for script in self.scripts:
            shutil.copy(script, f"mods/{self.mod_name}/scripts/")
        with open(f"mods/{self.mod_name}/mod.json", "w") as f:
            json.dump({"name": self.mod_name}, f)

import requests

class CreatorHubClient:
    def __init__(self, api_url):
        self.api_url = api_url

    def upload_asset(self, user_id, asset_path, metadata):
        with open(asset_path, "rb") as f:
            files = {"file": f}
            data = {"user": user_id, "metadata": metadata}
            requests.post(f"{self.api_url}/upload", files=files, data=data)

    def search_assets(self, query):
        response = requests.get(f"{self.api_url}/search", params={"q": query})
        return response.json()

class AIDialogueAssistant:
    def __init__(self, tone="neutral"):
        self.tone = tone

    def generate_dialogue(self, context, character):
        # Placeholder for actual AI model
        return f"{character} says: Based on {context}, here's a {self.tone} response."

class AISceneBuilder:
    def suggest_layout(self, mission_type):
        if mission_type == "ambush":
            return {
                "terrain": "forest",
                "enemy_positions": [(5, 5), (6, 6)],
                "objectives": ["Survive 3 turns"]
            }

class RevenueManager:
    def __init__(self):
        self.sales = {}  # e.g. {"Echo_Revenge": {"creator": "Vera", "price": 4.99, "units": 120}}

    def record_sale(self, mod_name, creator, price):
        if mod_name not in self.sales:
            self.sales[mod_name] = {"creator": creator, "price": price, "units": 0}
        self.sales[mod_name]["units"] += 1

    def calculate_payout(self, mod_name, cut=0.7):
        data = self.sales[mod_name]
        return data["units"] * data["price"] * cut

// Load environment variables securely
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-subscription', async (req, res) => {
  const { customerId, priceId } = req.body;

  if (!customerId || !priceId) {
    return res.status(400).json({ error: 'Missing customerId or priceId' });
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      // Optional metadata can help with attribution
      metadata: { organization_id: process.env.ORGANIZATION_ID || 'unknown' },
    });

    res.json({ subscriptionId: subscription.id, status: subscription.status });
  } catch (error) {
    console.error('Error creating subscription:', error);
    // Normalize error for client
    res.status(500).json({ error: error.message });
  }
});

// Start server (adjust port as needed)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
