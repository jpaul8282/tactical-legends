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
