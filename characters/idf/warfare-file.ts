<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical Legends | Modern Warfare</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Montserrat:wght@400;600&display=swap');
        
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #0a0a0a;
            color: #e0e0e0;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }
        
        #gameCanvas {
            display: block;
            background-color: #111;
            margin: 0 auto;
            border: 2px solid #333;
        }
        
        .digital-font {
            font-family: 'Orbitron', sans-serif;
        }
        
        .weapon-selector {
            background: rgba(20, 20, 20, 0.7);
            border: 1px solid #444;
            border-radius: 4px;
        }
        
        .health-bar {
            background: linear-gradient(to right, #e74c3c, #f39c12);
            height: 100%;
            transition: width 0.3s;
        }
        
        .ammo-count {
            text-shadow: 0 0 5px #fff, 0 0 10px #fff;
        }
        
        .enemy {
            position: absolute;
            background-color: #c0392b;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .bullet {
            position: absolute;
            background-color: #f1c40f;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .explosion {
            position: absolute;
            background: radial-gradient(circle, #f39c12, #e74c3c, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: explode 0.5s forwards;
        }
        
        @keyframes explode {
            0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        
        .blood-splatter {
            position: absolute;
            background-color: rgba(231, 76, 60, 0.7);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: fadeOut 1s forwards;
        }
        
        @keyframes fadeOut {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
        
        .mission-briefing {
            background: rgba(10, 10, 10, 0.9);
            border: 2px solid #444;
            box-shadow: 0 0 20px rgba(0, 150, 255, 0.5);
        }
        
        .objective-item.completed {
            color: #2ecc71;
            text-decoration: line-through;
        }
        
        .hit-marker {
            position: absolute;
            width: 20px;
            height: 20px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"><path d="M12 2L4 12l8 10 8-10z"/></svg>');
            background-size: contain;
            opacity: 0;
            transform: translate(-50%, -50%);
        }
        
        .hit-animation {
            animation: hitMarker 0.3s forwards;
        }
        
        @keyframes hitMarker {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        
        .night-vision {
            filter: hue-rotate(90deg) contrast(2) brightness(0.7);
            box-shadow: 0 0 100px rgba(0, 255, 0, 0.3);
        }
        
        .night-vision-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, rgba(0,255,0,0.1) 0%, rgba(0,255,0,0.03) 50%, rgba(0,0,0,0.7) 100%);
            pointer-events: none;
            z-index: 100;
            display: none;
        }
        
        .scope-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 101;
            display: none;
        }
        
        .scope-reticle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background-color: rgba(255, 0, 0, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .scope-hairs {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .scope-hair {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .scope-hair.horizontal {
            width: 100%;
            height: 1px;
            top: 50%;
        }
        
        .scope-hair.vertical {
            width: 1px;
            height: 100%;
            left: 50%;
        }
    </style>
</head>
<body class="bg-black text-white">
    <!-- Night Vision Overlay -->
    <div id="nightVisionOverlay" class="night-vision-overlay"></div>
    
    <!-- Scope Overlay -->
    <div id="scopeOverlay" class="scope-overlay">
        <div class="scope-hairs">
            <div class="scope-hair horizontal"></div>
            <div class="scope-hair vertical"></div>
        </div>
        <div class="scope-reticle"></div>
    </div>
    
    <!-- Main Menu -->
    <div id="mainMenu" class="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 z-50">
        <h1 class="digital-font text-6xl md:text-8xl text-white mb-8 text-center">
            <span class="text-blue-400">TACTICAL</span> 
            <span class="text-red-500">LEGENDS</span>
        </h1>
        
        <div class="flex flex-col space-y-4 w-full max-w-md px-4">
            <button id="startGameBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-4 px-6 rounded-lg border border-gray-600 text-xl transition-all duration-300 hover:scale-105">
                OPERATION: IRON FIST
            </button>
            <button id="weaponsBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-4 px-6 rounded-lg border border-gray-600 text-xl transition-all duration-300 hover:scale-105">
                ARMORY
            </button>
            <button id="settingsBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-4 px-6 rounded-lg border border-gray-600 text-xl transition-all duration-300 hover:scale-105">
                TACTICAL SETTINGS
            </button>
            <button id="creditsBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-4 px-6 rounded-lg border border-gray-600 text-xl transition-all duration-300 hover:scale-105">
                CREDITS
            </button>
        </div>
        
        <div class="mt-12 text-gray-400 text-sm">
            <p>Use WASD to move | Mouse to aim | Left Click to fire | Space to jump</p>
            <p class="mt-2">Press ESC to pause | F to toggle night vision | R to reload</p>
        </div>
    </div>
    
    <!-- Mission Briefing -->
    <div id="missionBriefing" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center">
        <div class="mission-briefing p-8 max-w-3xl w-full mx-4 rounded-lg">
            <h2 class="digital-font text-3xl text-blue-400 mb-6">OPERATION: IRON FIST</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="text-yellow-400 digital-font mb-2">LOCATION</h3>
                    <p>Blacksite Facility, Eastern Europe</p>
                </div>
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="text-yellow-400 digital-font mb-2">TIME</h3>
                    <p>0300 Hours</p>
                </div>
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="text-yellow-400 digital-font mb-2">WEATHER</h3>
                    <p>Heavy Rain, Low Visibility</p>
                </div>
            </div>
            
            <h3 class="text-xl text-white mb-4">SITUATION</h3>
            <p class="text-gray-300 mb-6">
                Intelligence reports indicate hostile forces have taken control of a blacksite facility 
                containing experimental weapons technology. Your mission is to infiltrate the compound, 
                neutralize all hostiles, and secure the prototype device before it falls into enemy hands.
            </p>
            
            <h3 class="text-xl text-white mb-4">OBJECTIVES</h3>
            <ul id="missionObjectives" class="space-y-2 mb-8">
                <li class="objective-item flex items-start">
                    <span class="text-yellow-400 mr-2">■</span>
                    <span>Infiltrate the blacksite compound</span>
                </li>
                <li class="objective-item flex items-start">
                    <span class="text-yellow-400 mr-2">■</span>
                    <span>Neutralize all enemy combatants</span>
                </li>
                <li class="objective-item flex items-start">
                    <span class="text-yellow-400 mr-2">■</span>
                    <span>Secure the prototype weapon</span>
                </li>
                <li class="objective-item flex items-start">
                    <span class="text-yellow-400 mr-2">■</span>
                    <span>Exfiltrate to the LZ</span>
                </li>
            </ul>
            
            <div class="flex justify-between mt-8">
                <button id="backToMenuBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-3 px-6 rounded-lg border border-gray-600 transition-all duration-300">
                    BACK
                </button>
                <button id="startMissionBtn" class="bg-blue-600 hover:bg-blue-500 text-white digital-font py-3 px-8 rounded-lg border border-blue-400 transition-all duration-300 hover:scale-105">
                    DEPLOY
                </button>
            </div>
        </div>
    </div>
    
    <!-- Armory Screen -->
    <div id="armoryScreen" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center">
        <div class="w-full max-w-4xl p-6 bg-gray-900 rounded-lg">
            <h2 class="digital-font text-3xl text-blue-400 mb-8">ARMORY</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Primary Weapons -->
                <div class="weapon-selector p-4">
                    <h3 class="text-yellow-400 digital-font mb-4">PRIMARY</h3>
                    <div class="space-y-3">
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="m4a1">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">M4</div>
                            <div>
                                <h4 class="text-white">M4A1</h4>
                                <p class="text-gray-400 text-sm">Assault Rifle</p>
                            </div>
                        </div>
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="ak47">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">AK</div>
                            <div>
                                <h4 class="text-white">AK-47</h4>
                                <p class="text-gray-400 text-sm">Assault Rifle</p>
                            </div>
                        </div>
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="scar">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">SCAR</div>
                            <div>
                                <h4 class="text-white">SCAR-H</h4>
                                <p class="text-gray-400 text-sm">Battle Rifle</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Secondary Weapons -->
                <div class="weapon-selector p-4">
                    <h3 class="text-yellow-400 digital-font mb-4">SECONDARY</h3>
                    <div class="space-y-3">
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="glock">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">G17</div>
                            <div>
                                <h4 class="text-white">Glock 17</h4>
                                <p class="text-gray-400 text-sm">Pistol</p>
                            </div>
                        </div>
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="desertEagle">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">DE</div>
                            <div>
                                <h4 class="text-white">Desert Eagle</h4>
                                <p class="text-gray-400 text-sm">Pistol</p>
                            </div>
                        </div>
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="mp5">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">MP5</div>
                            <div>
                                <h4 class="text-white">MP5</h4>
                                <p class="text-gray-400 text-sm">SMG</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Equipment -->
                <div class="weapon-selector p-4">
                    <h3 class="text-yellow-400 digital-font mb-4">EQUIPMENT</h3>
                    <div class="space-y-3">
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="frag">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">FRAG</div>
                            <div>
                                <h4 class="text-white">Frag Grenade</h4>
                                <p class="text-gray-400 text-sm">Lethal</p>
                            </div>
                        </div>
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="flash">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">FLASH</div>
                            <div>
                                <h4 class="text-white">Flashbang</h4>
                                <p class="text-gray-400 text-sm">Tactical</p>
                            </div>
                        </div>
                        <div class="weapon-option flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-600" data-weapon="knife">
                            <div class="w-16 h-12 bg-gray-700 mr-3 flex items-center justify-center">KNIFE</div>
                            <div>
                                <h4 class="text-white">Combat Knife</h4>
                                <p class="text-gray-400 text-sm">Melee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 flex justify-end">
                <button id="backFromArmoryBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-3 px-6 rounded-lg border border-gray-600 transition-all duration-300">
                    BACK TO MENU
                </button>
            </div>
        </div>
    </div>
    
    <!-- Pause Menu -->
    <div id="pauseMenu" class="fixed inset-0 bg-black bg-opacity-80 z-50 hidden flex flex-col items-center justify-center">
        <h1 class="digital-font text-5xl text-red-500 mb-8">PAUSED</h1>
        
        <div class="flex flex-col space-y-4 w-full max-w-md px-4">
            <button id="resumeGameBtn" class="bg-blue-600 hover:bg-blue-500 text-white digital-font py-4 px-6 rounded-lg border border-blue-400 text-xl transition-all duration-300 hover:scale-105">
                RESUME MISSION
            </button>
            <button id="restartGameBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-4 px-6 rounded-lg border border-gray-600 text-xl transition-all duration-300 hover:scale-105">
                RESTART MISSION
            </button>
            <button id="quitToMenuBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-4 px-6 rounded-lg border border-gray-600 text-xl transition-all duration-300 hover:scale-105">
                QUIT TO MENU
            </button>
        </div>
    </div>
    
    <!-- Game Over Screen -->
    <div id="gameOverScreen" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex flex-col items-center justify-center">
        <h1 class="digital-font text-6xl text-red-500 mb-4">MISSION FAILED</h1>
        <p class="text-xl text-gray-300 mb-8">Operative down. Mission compromised.</p>
        
        <div class="stats bg-gray-900 p-6 rounded-lg mb-8 w-full max-w-md">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-400">ENEMIES ELIMINATED</p>
                    <p class="text-2xl text-white" id="killsStat">0</p>
                </div>
                <div>
                    <p class="text-gray-400">ACCURACY</p>
                    <p class="text-2xl text-white" id="accuracyStat">0%</p>
                </div>
                <div>
                    <p class="text-gray-400">OBJECTIVES</p>
                    <p class="text-2xl text-white" id="objectivesStat">0/4</p>
                </div>
                <div>
                    <p class="text-gray-400">TIME</p>
                    <p class="text-2xl text-white" id="timeStat">0:00</p>
                </div>
            </div>
        </div>
        
        <div class="flex space-x-4">
            <button id="restartAfterGameOverBtn" class="bg-blue-600 hover:bg-blue-500 text-white digital-font py-3 px-8 rounded-lg border border-blue-400 transition-all duration-300 hover:scale-105">
                RETRY
            </button>
            <button id="quitAfterGameOverBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-3 px-8 rounded-lg border border-gray-600 transition-all duration-300 hover:scale-105">
                MAIN MENU
            </button>
        </div>
    </div>
    
    <!-- Mission Complete Screen -->
    <div id="missionCompleteScreen" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex flex-col items-center justify-center">
        <h1 class="digital-font text-6xl text-green-500 mb-4">MISSION ACCOMPLISHED</h1>
        <p class="text-xl text-gray-300 mb-8">Objective secured. Good work, operative.</p>
        
        <div class="stats bg-gray-900 p-6 rounded-lg mb-8 w-full max-w-md">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-400">ENEMIES ELIMINATED</p>
                    <p class="text-2xl text-white" id="killsStatComplete">0</p>
                </div>
                <div>
                    <p class="text-gray-400">ACCURACY</p>
                    <p class="text-2xl text-white" id="accuracyStatComplete">0%</p>
                </div>
                <div>
                    <p class="text-gray-400">OBJECTIVES</p>
                    <p class="text-2xl text-white" id="objectivesStatComplete">4/4</p>
                </div>
                <div>
                    <p class="text-gray-400">TIME</p>
                    <p class="text-2xl text-white" id="timeStatComplete">0:00</p>
                </div>
            </div>
        </div>
        
        <div class="flex space-x-4">
            <button id="nextMissionBtn" class="bg-blue-600 hover:bg-blue-500 text-white digital-font py-3 px-8 rounded-lg border border-blue-400 transition-all duration-300 hover:scale-105">
                NEXT MISSION
            </button>
            <button id="quitAfterCompleteBtn" class="bg-gray-800 hover:bg-gray-700 text-white digital-font py-3 px-8 rounded-lg border border-gray-600 transition-all duration-300 hover:scale-105">
                MAIN MENU
            </button>
        </div>
    </div>
    
    <!-- Game UI -->
    <div id="gameContainer" class="relative hidden">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        
        <!-- HUD Elements -->
        <div class="absolute top-4 left-4">
            <div class="health-container bg-gray-900 bg-opacity-70 p-2 rounded-lg">
                <div class="flex items-center mb-1">
                    <div class="w-32 h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div id="healthBar" class="health-bar rounded-full" style="width: 100%"></div>
                    </div>
                    <span id="healthText" class="ml-2 digital-font text-white">100%</span>
                </div>
                <div class="text-xs text-gray-300">OPERATIVE STATUS</div>
            </div>
        </div>
        
        <div class="absolute top-4 right-4">
            <div class="ammo-container bg-gray-900 bg-opacity-70 p-2 rounded-lg text-right">
                <div id="ammoCount" class="ammo-count digital-font text-2xl text-white">30/90</div>
                <div class="text-xs text-gray-300">AMMUNITION</div>
            </div>
        </div>
        
        <div class="absolute bottom-4 left-4">
            <div class="weapon-info bg-gray-900 bg-opacity-70 p-3 rounded-lg flex items-center">
                <div class="w-12 h-12 bg-gray-800 mr-3 flex items-center justify-center">M4</div>
                <div>
                    <div id="weaponName" class="digital-font text-white">M4A1</div>
                    <div id="fireMode" class="text-xs text-gray-300">AUTO</div>
                </div>
            </div>
        </div>
        
        <div class="absolute bottom-4 right-4">
            <div class="objective-container bg-gray-900 bg-opacity-70 p-3 rounded-lg">
                <div class="text-xs text-gray-300 mb-1">CURRENT OBJECTIVE</div>
                <div id="currentObjective" class="text-sm text-white">Infiltrate the blacksite compound</div>
            </div>
        </div>
        
        <div id="hitMarker" class="hit-marker"></div>
        
        <!-- Kill Feed -->
        <div id="killFeed" class="absolute top-20 left-4 w-64 space-y-1"></div>
        
        <!-- Damage Indicator -->
        <div id="damageIndicator" class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"></div>
    </div>
    
    <script>
        // Game State
        const gameState = {
            player: {
                x: 400,
                y: 300,
                width: 30,
                height: 50,
                speed: 5,
                health: 100,
                maxHealth: 100,
                direction: 0, // angle in radians
                isMoving: false,
                isShooting: false,
                isReloading: false,
                lastShotTime: 0,
                kills: 0,
                shotsFired: 0,
                shotsHit: 0,
                startTime: 0,
                currentObjective: 0,
                objectivesCompleted: 0,
                nightVision: false,
                weapons: {
                    primary: {
                        name: "M4A1",
                        type: "assault",
                        damage: 25,
                        fireRate: 600, // rounds per minute
                        magSize: 30,
                        ammo: 90,
                        currentMag: 30,
                        reloadTime: 2000, // ms
                        spread: 0.05,
                        range: 500,
                        auto: true
                    },
                    secondary: {
                        name: "Glock 17",
                        type: "pistol",
                        damage: 20,
                        fireRate: 400,
                        magSize: 15,
                        ammo: 45,
                        currentMag: 15,
                        reloadTime: 1500,
                        spread: 0.08,
                        range: 300,
                        auto: false
                    },
                    equipment: {
                        name: "Frag Grenade",
                        type: "grenade",
                        damage: 100,
                        radius: 100,
                        count: 3
                    }
                },
                currentWeapon: "primary"
            },
            enemies: [],
            bullets: [],
            explosions: [],
            bloodSplatters: [],
            keys: {
                w: false,
                a: false,
                s: false,
                d: false,
                space: false
            },
            mouse: {
                x: 0,
                y: 0,
                isDown: false
            },
            gameTime: 0,
            gamePaused: false,
            gameOver: false,
            missionComplete: false,
            map: {
                width: 2000,
                height: 2000,
                obstacles: []
            }
        };
        
        // DOM Elements
        const gameCanvas = document.getElementById('gameCanvas');
        const ctx = gameCanvas.getContext('2d');
        const gameContainer = document.getElementById('gameContainer');
        const mainMenu = document.getElementById('mainMenu');
        const missionBriefing = document.getElementById('missionBriefing');
        const armoryScreen = document.getElementById('armoryScreen');
        const pauseMenu = document.getElementById('pauseMenu');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const missionCompleteScreen = document.getElementById('missionCompleteScreen');
        const healthBar = document.getElementById('healthBar');
        const healthText = document.getElementById('healthText');
        const ammoCount = document.getElementById('ammoCount');
        const weaponName = document.getElementById('weaponName');
        const fireMode = document.getElementById('fireMode');
        const currentObjective = document.getElementById('currentObjective');
        const hitMarker = document.getElementById('hitMarker');
        const killFeed = document.getElementById('killFeed');
        const damageIndicator = document.getElementById('damageIndicator');
        const nightVisionOverlay = document.getElementById('nightVisionOverlay');
        const scopeOverlay = document.getElementById('scopeOverlay');
        
        // Buttons
        const startGameBtn = document.getElementById('startGameBtn');
        const weaponsBtn = document.getElementById('weaponsBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const creditsBtn = document.getElementById('creditsBtn');
        const startMissionBtn = document.getElementById('startMissionBtn');
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        const backFromArmoryBtn = document.getElementById('backFromArmoryBtn');
        const resumeGameBtn = document.getElementById('resumeGameBtn');
        const restartGameBtn = document.getElementById('restartGameBtn');
        const quitToMenuBtn = document.getElementById('quitToMenuBtn');
        const restartAfterGameOverBtn = document.getElementById('restartAfterGameOverBtn');
        const quitAfterGameOverBtn = document.getElementById('quitAfterGameOverBtn');
        const nextMissionBtn = document.getElementById('nextMissionBtn');
        const quitAfterCompleteBtn = document.getElementById('quitAfterCompleteBtn');
        
        // Event Listeners
        startGameBtn.addEventListener('click', () => {
            mainMenu.classList.add('hidden');
            missionBriefing.classList.remove('hidden');
        });
        
        weaponsBtn.addEventListener('click', () => {
            mainMenu.classList.add('hidden');
            armoryScreen.classList.remove('hidden');
        });
        
        settingsBtn.addEventListener('click', () => {
            // In a full game, this would open settings
            alert('Settings would be configured here');
        });
        
        creditsBtn.addEventListener('click', () => {
            // In a full game, this would show credits
            alert('Game developed by Tactical Legends Team');
        });
        
        startMissionBtn.addEventListener('click', startGame);
        backToMenuBtn.addEventListener('click', () => {
            missionBriefing.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
        
        backFromArmoryBtn.addEventListener('click', () => {
            armoryScreen.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
        
        resumeGameBtn.addEventListener('click', () => {
            pauseMenu.classList.add('hidden');
            gameState.gamePaused = false;
        });
        
        restartGameBtn.addEventListener('click', () => {
            pauseMenu.classList.add('hidden');
            startGame();
        });
        
        quitToMenuBtn.addEventListener('click', () => {
            pauseMenu.classList.add('hidden');
            gameContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
        
        restartAfterGameOverBtn.addEventListener('click', () => {
            gameOverScreen.classList.add('hidden');
            startGame();
        });
        
        quitAfterGameOverBtn.addEventListener('click', () => {
            gameOverScreen.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
        
        nextMissionBtn.addEventListener('click', () => {
            missionCompleteScreen.classList.add('hidden');
            // In a full game, this would load the next mission
            alert('Next mission would load here');
            mainMenu.classList.remove('hidden');
        });
        
        quitAfterCompleteBtn.addEventListener('click', () => {
            missionCompleteScreen.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
        
        document.addEventListener('keydown', (e) => {
            if (gameState.gamePaused || gameState.gameOver || gameState.missionComplete) return;
            
            switch(e.key.toLowerCase()) {
                case 'w': gameState.keys.w = true; break;
                case 'a': gameState.keys.a = true; break;
                case 's': gameState.keys.s = true; break;
                case 'd': gameState.keys.d = true; break;
                case ' ': gameState.keys.space = true; break;
                case 'r': reloadWeapon(); break;
                case 'f': toggleNightVision(); break;
                case '1': switchWeapon('primary'); break;
                case '2': switchWeapon('secondary'); break;
                case '3': switchWeapon('equipment'); break;
                case 'escape': pauseGame(); break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': gameState.keys.w = false; break;
                case 'a': gameState.keys.a = false; break;
                case 's': gameState.keys.s = false; break;
                case 'd': gameState.keys.d = false; break;
                case ' ': gameState.keys.space = false; break;
            }
        });
        
        gameCanvas.addEventListener('mousemove', (e) => {
            if (gameState.gamePaused) return;
            
            const rect = gameCanvas.getBoundingClientRect();
            gameState.mouse.x = e.clientX - rect.left;
            gameState.mouse.y = e.clientY - rect.top;
            
            // Calculate player direction based on mouse position
            const dx = gameState.mouse.x - gameCanvas.width / 2;
            const dy = gameState.mouse.y - gameCanvas.height / 2;
            gameState.player.direction = Math.atan2(dy, dx);
        });
        
        gameCanvas.addEventListener('mousedown', (e) => {
            if (gameState.gamePaused || gameState.gameOver || gameState.missionComplete) return;
            
            gameState.mouse.isDown = true;
            if (e.button === 0) { // Left click
                gameState.player.isShooting = true;
                fireWeapon();
            }
        });
        
        gameCanvas.addEventListener('mouseup', (e) => {
            gameState.mouse.isDown = false;
            if (e.button === 0) {
                gameState.player.isShooting = false;
            }
        });
        
        gameCanvas.addEventListener('click', (e) => {
            if (gameState.gamePaused || gameState.gameOver || gameState.missionComplete) return;
            
            if (e.button === 0) {
                const weapon = gameState.player.weapons[gameState.player.currentWeapon];
                if (!weapon.auto) {
                    fireWeapon();
                }
            }
        });
        
        // Weapon selection in armory
        document.querySelectorAll('.weapon-option').forEach(option => {
            option.addEventListener('click', () => {
                const weaponType = option.parentElement.querySelector('h3').textContent;
                const weaponId = option.getAttribute('data-weapon');
                
                // In a full game, this would change the player's weapon loadout
                alert(`Selected ${weaponType}: ${weaponId}`);
            });
        });
        
        // Game Functions
        function startGame() {
            // Reset game state
            gameState.player = {
                ...gameState.player,
                x: 400,
                y: 300,
                health: 100,
                kills: 0,
                shotsFired: 0,
                shotsHit: 0,
                startTime: Date.now(),
                currentObjective: 0,
                objectivesCompleted: 0,
                weapons: {
                    primary: {
                        ...gameState.player.weapons.primary,
                        currentMag: 30,
                        ammo: 90
                    },
                    secondary: {
                        ...gameState.player.weapons.secondary,
                        currentMag: 15,
                        ammo: 45
                    },
                    equipment: {
                        ...gameState.player.weapons.equipment,
                        count: 3
                    }
                },
                currentWeapon: 'primary'
            };
            
            gameState.enemies = [];
            gameState.bullets = [];
            gameState.explosions = [];
            gameState.bloodSplatters = [];
            gameState.gameTime = 0;
            gameState.gamePaused = false;
            gameState.gameOver = false;
            gameState.missionComplete = false;
            
            // Generate enemies
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 300 + Math.random() * 500;
                gameState.enemies.push({
                    x: gameState.player.x + Math.cos(angle) * distance,
                    y: gameState.player.y + Math.sin(angle) * distance,
                    width: 25,
                    height: 40,
                    health: 100,
                    speed: 1 + Math.random() * 2,
                    lastShotTime: 0,
                    fireRate: 1000 + Math.random() * 2000,
                    damage: 10,
                    type: Math.random() > 0.8 ? 'heavy' : 'normal'
                });
            }
            
            // Generate obstacles
            gameState.map.obstacles = [];
            for (let i = 0; i < 30; i++) {
                gameState.map.obstacles.push({
                    x: Math.random() * gameState.map.width,
                    y: Math.random() * gameState.map.height,
                    width: 50 + Math.random() * 100,
                    height: 50 + Math.random() * 100
                });
            }
            
            // Update UI
            updateHealthUI();
            updateAmmoUI();
            updateWeaponUI();
            updateObjectiveUI();
            
            // Clear kill feed
            killFeed.innerHTML = '';
            
            // Show game
            mainMenu.classList.add('hidden');
            missionBriefing.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            // Start game loop
            requestAnimationFrame(gameLoop);
        }
        
        function gameLoop(timestamp) {
            if (gameState.gamePaused || gameState.gameOver || gameState.missionComplete) return;
            
            // Calculate delta time for smooth movement
            const deltaTime = timestamp - (gameState.lastFrameTime || timestamp);
            gameState.lastFrameTime = timestamp;
            gameState.gameTime = (Date.now() - gameState.player.startTime) / 1000;
            
            // Update game state
            updatePlayer(deltaTime);
            updateEnemies(deltaTime);
            updateBullets();
            updateExplosions();
            updateBloodSplatters();
            
            // Check for auto-fire weapons
            if (gameState.player.isShooting) {
                const weapon = gameState.player.weapons[gameState.player.currentWeapon];
                if (weapon.auto && Date.now() - gameState.player.lastShotTime > 60000 / weapon.fireRate) {
                    fireWeapon();
                }
            }
            
            // Check objectives
            checkObjectives();
            
            // Render game
            render();
            
            // Continue game loop
            requestAnimationFrame(gameLoop);
        }
        
        function updatePlayer(deltaTime) {
            // Movement
            let dx = 0;
            let dy = 0;
            
            if (gameState.keys.w) dy -= 1;
            if (gameState.keys.s) dy += 1;
            if (gameState.keys.a) dx -= 1;
            if (gameState.keys.d) dx += 1;
            
            // Normalize diagonal movement
            if (dx !== 0 && dy !== 0) {
                const invSqrt2 = 0.7071; // 1/sqrt(2)
                dx *= invSqrt2;
                dy *= invSqrt2;
            }
            
            // Apply movement
            const moveSpeed = gameState.player.speed * (deltaTime / 16); // Normalize to ~60fps
            gameState.player.x += dx * moveSpeed;
            gameState.player.y += dy * moveSpeed;
            
            // Boundary check
            gameState.player.x = Math.max(0, Math.min(gameState.map.width, gameState.player.x));
            gameState.player.y = Math.max(0, Math.min(gameState.map.height, gameState.player.y));
            
            // Check for jumping
            if (gameState.keys.space) {
                // In a more complete game, this would handle jumping physics
            }
            
            // Check for obstacle collisions
            gameState.map.obstacles.forEach(obstacle => {
                if (checkCollision(gameState.player, obstacle)) {
                    // Simple collision response - push player out
                    const playerCenter = {
                        x: gameState.player.x + gameState.player.width / 2,
                        y: gameState.player.y + gameState.player.height / 2
                    };
                    
                    const obstacleCenter = {
                        x: obstacle.x + obstacle.width / 2,
                        y: obstacle.y + obstacle.height / 2
                    };
                    
                    const dx = playerCenter.x - obstacleCenter.x;
                    const dy = playerCenter.y - obstacleCenter.y;
                    
                    if (Math.abs(dx) > Math.abs(dy)) {
                        gameState.player.x += dx > 0 ? 2 : -2;
                    } else {
                        gameState.player.y += dy > 0 ? 2 : -2;
                    }
                }
            });
        }
        
        function updateEnemies(deltaTime) {
            gameState.enemies.forEach((enemy, index) => {
                if (enemy.health <= 0) return;
                
                // Simple AI: move toward player and shoot
                const dx = gameState.player.x - enemy.x;
                const dy = gameState.player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Move toward player but maintain some distance
                if (distance > 200) {
                    const moveSpeed = enemy.speed * (deltaTime / 16);
                    enemy.x += (dx / distance) * moveSpeed;
                    enemy.y += (dy / distance) * moveSpeed;
                } else if (distance < 150) {
                    // Back away if too close
                    const moveSpeed = enemy.speed * (deltaTime / 16);
                    enemy.x -= (dx / distance) * moveSpeed;
                    enemy.y -= (dy / distance) * moveSpeed;
                }
                
                // Shoot at player
                if (Date.now() - enemy.lastShotTime > enemy.fireRate) {
                    enemy.lastShotTime = Date.now();
                    
                    // Calculate direction to player
                    const angle = Math.atan2(dy, dx);
                    
                    // Add some inaccuracy
                    const inaccuracy = Math.random() * 0.2 - 0.1;
                    const bulletAngle = angle + inaccuracy;
                    
                    // Create bullet
                    gameState.bullets.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        dx: Math.cos(bulletAngle) * 10,
                        dy: Math.sin(bulletAngle) * 10,
                        damage: enemy.damage,
                        isPlayer: false,
                        owner: index
                    });
                }
                
                // Check for obstacle collisions
                gameState.map.obstacles.forEach(obstacle => {
                    if (checkCollision(enemy, obstacle)) {
                        // Simple collision response - push enemy out
                        const enemyCenter = {
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height / 2
                        };
                        
                        const obstacleCenter = {
                            x: obstacle.x + obstacle.width / 2,
                            y: obstacle.y + obstacle.height / 2
                        };
                        
                        const dx = enemyCenter.x - obstacleCenter.x;
                        const dy = enemyCenter.y - obstacleCenter.y;
                        
                        if (Math.abs(dx) > Math.abs(dy)) {
                            enemy.x += dx > 0 ? 2 : -2;
                        } else {
                            enemy.y += dy > 0 ? 2 : -2;
                        }
                    }
                });
            });
        }
        
        function updateBullets() {
            for (let i = gameState.bullets.length - 1; i >= 0; i--) {
                const bullet = gameState.bullets[i];
                
                // Update position
                bullet.x += bullet.dx;
                bullet.y += bullet.dy;
                
                // Check for out of bounds
                if (bullet.x < 0 || bullet.x > gameState.map.width || 
                    bullet.y < 0 || bullet.y > gameState.map.height) {
                    gameState.bullets.splice(i, 1);
                    continue;
                }
                
                // Check for obstacle collisions
                let hitObstacle = false;
                gameState.map.obstacles.forEach(obstacle => {
                    if (pointInRect(bullet.x, bullet.y, obstacle)) {
                        hitObstacle = true;
                    }
                });
                
                if (hitObstacle) {
                    gameState.bullets.splice(i, 1);
                    continue;
                }
                
                // Check for player/enemy hits
                if (bullet.isPlayer) {
                    // Check enemy hits
                    for (let j = 0; j < gameState.enemies.length; j++) {
                        const enemy = gameState.enemies[j];
                        if (enemy.health <= 0) continue;
                        
                        if (pointInRect(bullet.x, bullet.y, enemy)) {
                            // Hit enemy
                            enemy.health -= bullet.damage;
                            gameState.bullets.splice(i, 1);
                            gameState.player.shotsHit++;
                            
                            // Show hit marker
                            showHitMarker();
                            
                            // Add blood splatter
                            gameState.bloodSplatters.push({
                                x: bullet.x,
                                y: bullet.y,
                                size: 10 + Math.random() * 20
                            });
                            
                            // Check if enemy died
                            if (enemy.health <= 0) {
                                gameState.player.kills++;
                                
                                // Add kill to feed
                                addKillFeedEntry('Enemy eliminated');
                                
                                // Add explosion
                                gameState.explosions.push({
                                    x: enemy.x + enemy.width / 2,
                                    y: enemy.y + enemy.height / 2,
                                    size: 30
                                });
                            }
                            break;
                        }
                    }
                } else {
                    // Check player hit
                    if (pointInRect(bullet.x, bullet.y, gameState.player)) {
                        // Hit player
                        gameState.player.health -= bullet.damage;
                        gameState.bullets.splice(i, 1);
                        
                        // Show damage indicator
                        showDamageIndicator(bullet.dx, bullet.dy);
                        
                        // Update health UI
                        updateHealthUI();
                        
                        // Check if player died
                        if (gameState.player.health <= 0) {
                            gameOver();
                        }
                    }
                }
            }
        }
        
        function updateExplosions() {
            // Explosions are handled by CSS animations
            // We just need to remove them after animation completes
            for (let i = gameState.explosions.length - 1; i >= 0; i--) {
                // In a more complete game, we'd track animation progress
                if (gameState.explosions[i].time > 500) {
                    gameState.explosions.splice(i, 1);
                } else {
                    gameState.explosions[i].time = (gameState.explosions[i].time || 0) + 16;
                }
            }
        }
        
        function updateBloodSplatters() {
            // Blood splatters fade out via CSS animations
            for (let i = gameState.bloodSplatters.length - 1; i >= 0; i--) {
                if (gameState.bloodSplatters[i].time > 1000) {
                    gameState.bloodSplatters.splice(i, 1);
                } else {
                    gameState.bloodSplatters[i].time = (gameState.bloodSplatters[i].time || 0) + 16;
                }
            }
        }
        
        function checkObjectives() {
            // Simple objective progression based on kills
            const totalEnemies = 20;
            const aliveEnemies = gameState.enemies.filter(e => e.health > 0).length;
            const killedEnemies = totalEnemies - aliveEnemies;
            
            // Objective 1: Infiltrate (starts complete)
            if (gameState.player.currentObjective === 0 && gameState.gameTime > 5) {
                completeObjective(0);
            }
            
            // Objective 2: Neutralize enemies (50%)
            if (gameState.player.currentObjective === 1 && killedEnemies >= 10) {
                completeObjective(1);
            }
            
            // Objective 3: Neutralize all enemies
            if (gameState.player.currentObjective === 2 && killedEnemies >= totalEnemies) {
                completeObjective(2);
            }
            
            // Objective 4: Exfiltrate (wait 5 seconds after last kill)
            if (gameState.player.currentObjective === 3 && killedEnemies >= totalEnemies && 
                gameState.gameTime - (gameState.lastKillTime || 0) > 5) {
                completeObjective(3);
                missionComplete();
            }
            
            // Track last kill time for exfiltration
            if (killedEnemies > (gameState.lastKillCount || 0)) {
                gameState.lastKillTime = gameState.gameTime;
                gameState.lastKillCount = killedEnemies;
            }
        }
        
        function completeObjective(index) {
            if (index > gameState.player.currentObjective) return;
            
            gameState.player.currentObjective = index + 1;
            gameState.player.objectivesCompleted++;
            
            // Update UI
            updateObjectiveUI();
            
            // Mark objective as completed in briefing
            const objectives = document.querySelectorAll('.objective-item');
            if (index < objectives.length) {
                objectives[index].classList.add('completed');
            }
            
            // Show notification
            addKillFeedEntry(`Objective ${index + 1} completed`);
        }
        
        function fireWeapon() {
            const weapon = gameState.player.weapons[gameState.player.currentWeapon];
            
            // Check if weapon can fire
            if (weapon.currentMag <= 0) {
                if (!gameState.player.isReloading) {
                    reloadWeapon();
                }
                return;
            }
            
            if (gameState.player.isReloading) return;
            
            // Fire weapon
            weapon.currentMag--;
            gameState.player.shotsFired++;
            gameState.player.lastShotTime = Date.now();
            
            // Update ammo UI
            updateAmmoUI();
            
            // Create bullet
            const spread = weapon.spread * (Math.random() * 2 - 1);
            const angle = gameState.player.direction + spread;
            
            gameState.bullets.push({
                x: gameState.player.x + gameState.player.width / 2,
                y: gameState.player.y + gameState.player.height / 2,
                dx: Math.cos(angle) * 15,
                dy: Math.sin(angle) * 15,
                damage: weapon.damage,
                isPlayer: true
            });
            
            // Recoil effect (simple version)
            const recoil = 0.05;
            gameState.player.direction += (Math.random() * 2 - 1) * recoil;
        }
        
        function reloadWeapon() {
            const weapon = gameState.player.weapons[gameState.player.currentWeapon];
            
            // Check if reload is needed
            if (weapon.currentMag === weapon.magSize || weapon.ammo <= 0) return;
            
            // Check if already reloading
            if (gameState.player.isReloading) return;
            
            gameState.player.isReloading = true;
            
            // Calculate ammo to reload
            const ammoNeeded = weapon.magSize - weapon.currentMag;
            const ammoAvailable = Math.min(ammoNeeded, weapon.ammo);
            
            // Set reload timeout
            setTimeout(() => {
                weapon.currentMag += ammoAvailable;
                weapon.ammo -= ammoAvailable;
                gameState.player.isReloading = false;
                
                // Update UI
                updateAmmoUI();
                
                // Show reload complete notification
                addKillFeedEntry('Reload complete');
            }, weapon.reloadTime);
            
            // Show reload notification
            addKillFeedEntry('Reloading...');
        }
        
        function switchWeapon(weaponType) {
            if (gameState.player.currentWeapon === weaponType || gameState.player.isReloading) return;
            
            gameState.player.currentWeapon = weaponType;
            updateWeaponUI();
            
            // Show weapon switch notification
            addKillFeedEntry(`Switched to ${gameState.player.weapons[weaponType].name}`);
        }
        
        function toggleNightVision() {
            gameState.player.nightVision = !gameState.player.nightVision;
            
            if (gameState.player.nightVision) {
                gameCanvas.classList.add('night-vision');
                nightVisionOverlay.style.display = 'block';
                addKillFeedEntry('Night vision activated');
            } else {
                gameCanvas.classList.remove('night-vision');
                nightVisionOverlay.style.display = 'none';
                addKillFeedEntry('Night vision deactivated');
            }
        }
        
        function pauseGame() {
            gameState.gamePaused = true;
            pauseMenu.classList.remove('hidden');
        }
        
        function gameOver() {
            gameState.gameOver = true;
            
            // Update stats
            document.getElementById('killsStat').textContent = gameState.player.kills;
            
            const accuracy = gameState.player.shotsFired > 0 
                ? Math.round((gameState.player.shotsHit / gameState.player.shotsFired) * 100)
                : 0;
            document.getElementById('accuracyStat').textContent = `${accuracy}%`;
            
            document.getElementById('objectivesStat').textContent = 
                `${gameState.player.objectivesCompleted}/4`;
            
            const minutes = Math.floor(gameState.gameTime / 60);
            const seconds = Math.floor(gameState.gameTime % 60);
            document.getElementById('timeStat').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Show game over screen
            gameOverScreen.classList.remove('hidden');
        }
        
        function missionComplete() {
            gameState.missionComplete = true;
            
            // Update stats
            document.getElementById('killsStatComplete').textContent = gameState.player.kills;
            
            const accuracy = gameState.player.shotsFired > 0 
                ? Math.round((gameState.player.shotsHit / gameState.player.shotsFired) * 100)
                : 0;
            document.getElementById('accuracyStatComplete').textContent = `${accuracy}%`;
            
            document.getElementById('objectivesStatComplete').textContent = '4/4';
            
            const minutes = Math.floor(gameState.gameTime / 60);
            const seconds = Math.floor(gameState.gameTime % 60);
            document.getElementById('timeStatComplete').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Show mission complete screen
            missionCompleteScreen.classList.remove('hidden');
        }
        
        // UI Functions
        function updateHealthUI() {
            const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
            healthBar.style.width = `${healthPercent}%`;
            healthText.textContent = `${Math.round(healthPercent)}%`;
            
            // Change color based on health
            if (healthPercent < 30) {
                healthBar.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
            } else if (healthPercent < 60) {
                healthBar.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
            } else {
                healthBar.style.background = 'linear-gradient(to right, #e74c3c, #f39c12)';
            }
        }
        
        function updateAmmoUI() {
            const weapon = gameState.player.weapons[gameState.player.currentWeapon];
            ammoCount.textContent = `${weapon.currentMag}/${weapon.ammo}`;
            
            // Flash red if low ammo
            if (weapon.currentMag === 0) {
                ammoCount.classList.add('text-red-500');
                ammoCount.classList.remove('text-white');
            } else if (weapon.currentMag <= weapon.magSize * 0.3) {
                ammoCount.classList.add('text-yellow-500');
                ammoCount.classList.remove('text-white');
            } else {
                ammoCount.classList.remove('text-red-500', 'text-yellow-500');
                ammoCount.classList.add('text-white');
            }
        }
        
        function updateWeaponUI() {
            const weapon = gameState.player.weapons[gameState.player.currentWeapon];
            weaponName.textContent = weapon.name;
            fireMode.textContent = weapon.auto ? 'AUTO' : 'SEMI';
        }
        
        function updateObjectiveUI() {
            const objectives = [
                'Infiltrate the blacksite compound',
                'Neutralize enemy combatants',
                'Eliminate all hostiles',
                'Exfiltrate to the LZ'
            ];
            
            if (gameState.player.currentObjective < objectives.length) {
                currentObjective.textContent = objectives[gameState.player.currentObjective];
            } else {
                currentObjective.textContent = 'Mission complete';
            }
        }
        
        function showHitMarker() {
            hitMarker.style.left = '50%';
            hitMarker.style.top = '50%';
            hitMarker.classList.add('hit-animation');
            
            setTimeout(() => {
                hitMarker.classList.remove('hit-animation');
            }, 300);
        }
        
        function showDamageIndicator(dx, dy) {
            // Calculate direction of damage
            const angle = Math.atan2(dy, dx);
            const degrees = angle * (180 / Math.PI);
            
            // Position damage indicator
            damageIndicator.style.background = `radial-gradient(circle at ${50 + Math.cos(angle) * 30}% ${50 + Math.sin(angle) * 30}%, rgba(255, 0, 0, 0.7), transparent 70%)`;
            damageIndicator.style.opacity = '0.7';
            
            // Fade out
            setTimeout(() => {
                damageIndicator.style.opacity = '0';
            }, 300);
        }
        
        function addKillFeedEntry(text) {
            const entry = document.createElement('div');
            entry.className = 'bg-black bg-opacity-70 p-2 text-sm text-white rounded';
            entry.textContent = text;
            
            killFeed.insertBefore(entry, killFeed.firstChild);
            
            // Limit to 5 entries
            if (killFeed.children.length > 5) {
                killFeed.removeChild(killFeed.lastChild);
            }
            
            // Fade out after 3 seconds
            setTimeout(() => {
                entry.style.opacity = '0';
                setTimeout(() => {
                    if (entry.parentNode) {
                        killFeed.removeChild(entry);
                    }
                }, 300);
            }, 3000);
        }
        
        // Utility Functions
        function checkCollision(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }
        
        function pointInRect(x, y, rect) {
            return x >= rect.x && x <= rect.x + rect.width &&
                   y >= rect.y && y <= rect.y + rect.height;
        }
        
        // Rendering
        function render() {
            // Clear canvas
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            // Draw background (simple grid for a tactical map)
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1;
            
            const gridSize = 50;
            const offsetX = -gameState.player.x % gridSize;
            const offsetY = -gameState.player.y % gridSize;
            
            for (let x = offsetX; x < gameCanvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, gameCanvas.height);
                ctx.stroke();
            }
            
            for (let y = offsetY; y < gameCanvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(gameCanvas.width, y);
                ctx.stroke();
            }
            
            // Calculate camera offset (center on player)
            const cameraX = gameCanvas.width / 2 - gameState.player.x;
            const cameraY = gameCanvas.height / 2 - gameState.player.y;
            
            // Save context for camera transform
            ctx.save();
            ctx.translate(cameraX, cameraY);
            
            // Draw obstacles
            ctx.fillStyle = '#333';
            gameState.map.obstacles.forEach(obstacle => {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.strokeStyle = '#444';
                ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
            
            // Draw enemies
            gameState.enemies.forEach(enemy => {
                if (enemy.health <= 0) return;
                
                // Draw enemy
                ctx.fillStyle = enemy.type === 'heavy' ? '#8B0000' : '#c0392b';
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Draw health bar
                const healthPercent = enemy.health / 100;
                ctx.fillStyle = '#555';
                ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
                ctx.fillStyle = healthPercent > 0.6 ? '#2ecc71' : 
                                healthPercent > 0.3 ? '#f39c12' : '#e74c3c';
                ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * healthPercent, 5);
                
                // Draw enemy type indicator
                if (enemy.type === 'heavy') {
                    ctx.fillStyle = '#f1c40f';
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText('HEAVY', enemy.x + 2, enemy.y - 15);
                }
            });
            
            // Draw player
            ctx.fillStyle = '#3498db';
            ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
            
            // Draw bullets
            ctx.fillStyle = '#f1c40f';
            gameState.bullets.forEach(bullet => {
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Restore context (remove camera transform)
            ctx.restore();
            
            // Draw explosions (handled by CSS)
            // Draw blood splatters (handled by CSS)
            
            // Draw crosshair
            const crosshairSize = 20;
            const crosshairGap = 5;
            const centerX = gameCanvas.width / 2;
            const centerY = gameCanvas.height / 2;
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            
            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(centerX - crosshairSize - crosshairGap, centerY);
            ctx.lineTo(centerX - crosshairGap, centerY);
            ctx.moveTo(centerX + crosshairGap, centerY);
            ctx.lineTo(centerX + crosshairSize + crosshairGap, centerY);
            ctx.stroke();
            
            // Vertical line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - crosshairSize - crosshairGap);
            ctx.lineTo(centerX, centerY - crosshairGap);
            ctx.moveTo(centerX, centerY + crosshairGap);
            ctx.lineTo(centerX, centerY + crosshairSize + crosshairGap);
            ctx.stroke();
            
            // Center dot
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw reload indicator
            if (gameState.player.isReloading) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(centerX - 50, centerY + 30, 100, 10);
                
                const weapon = gameState.player.weapons[gameState.player.currentWeapon];
                const reloadProgress = (Date.now() - gameState.player.lastShotTime) / weapon.reloadTime;
                
                ctx.fillStyle = '#f39c12';
                ctx.fillRect(centerX - 50, centerY + 30, 100 * Math.min(1, reloadProgress), 10);
                
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('RELOADING', centerX, centerY + 50);
            }
        }
        
        // Initialize game
        document.addEventListener('DOMContentLoaded', () => {
            // Set up weapon UI
            updateWeaponUI();
            
            // Create DOM elements for explosions and blood splatters
            const gameContainer = document.getElementById('gameContainer');
            
            // In a full game, we'd pre-create these elements for performance
        });
    </script>
</body>
</html>
