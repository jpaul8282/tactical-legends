<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical Legends: Game Development Toolkit</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', sans-serif;
            background: #000;
            color: #00ff88;
            overflow-x: hidden;
            min-height: 100vh;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, #0a0a0a 0%, #1a1a2e 50%, #000000 100%);
            z-index: 0;
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
            z-index: 1;
        }

        .scanline {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to the bottom,
                transparent 50%,
                rgba(0, 255, 136, 0.02) 51%
            );
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 2;
            animation: scanline 8s linear infinite;
        }

        @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(100vh); }
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
            margin-bottom: 50px;
            padding-top: 30px;
        }
        
        .title {
            font-family: 'Orbitron', monospace;
            font-size: clamp(2.5rem, 6vw, 5rem);
            font-weight: 900;
            background: linear-gradient(45deg, #00ff88, #00ffff, #00ff88);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 30px rgba(0,255,136,0.5);
            margin-bottom: 15px;
            animation: title-gradient 4s ease infinite, title-pulse 3s ease-in-out infinite;
            letter-spacing: 5px;
        }

        @keyframes title-gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes title-pulse {
            0%, 100% { filter: drop-shadow(0 0 30px rgba(0,255,136,0.6)); }
            50% { filter: drop-shadow(0 0 60px rgba(0,255,136,0.9)); }
        }
        
        .subtitle {
            font-size: 1.5rem;
            color: #ff6b6b;
            font-weight: 400;
            letter-spacing: 5px;
            text-transform: uppercase;
            text-shadow: 0 0 20px rgba(255,107,107,0.5);
        }
        
        .dev-tabs {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 18px 30px;
            background: rgba(0,0,0,0.8);
            border: 2px solid #00ff88;
            border-radius: 30px;
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
        }

        .tab-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(0,255,136,0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .tab-btn:hover::before {
            width: 300px;
            height: 300px;
        }

        .tab-btn span {
            position: relative;
            z-index: 1;
        }
        
        .tab-btn.active {
            background: rgba(0,255,136,0.2);
            box-shadow: 0 0 30px rgba(0,255,136,0.5), inset 0 0 20px rgba(0,255,136,0.1);
            transform: scale(1.05);
        }
        
        .tab-btn:hover {
            background: rgba(0,255,136,0.15);
            transform: translateY(-3px);
            box-shadow: 0 5px 25px rgba(0,255,136,0.3);
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.6s ease;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .tool-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .tool-card {
            background: rgba(0,0,0,0.85);
            border: 2px solid rgba(0,255,136,0.3);
            border-radius: 20px;
            padding: 30px;
            transition: all 0.4s ease;
            position: relative;
            backdrop-filter: blur(10px);
        }

        .tool-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #00ff88, transparent);
            opacity: 0;
            transition: opacity 0.4s;
        }

        .tool-card:hover::before {
            opacity: 1;
        }

        .tool-card:hover {
            border-color: #00ff88;
            box-shadow: 0 0 40px rgba(0,255,136,0.3), inset 0 0 30px rgba(0,255,136,0.05);
            transform: translateY(-8px);
        }

        .tool-card h3 {
            font-family: 'Orbitron', monospace;
            color: #ff6b6b;
            margin-bottom: 20px;
            font-size: 1.6rem;
            text-shadow: 0 0 15px rgba(255,107,107,0.5);
            letter-spacing: 2px;
        }

        .input-group {
            margin-bottom: 18px;
        }

        .input-group label {
            display: block;
            margin-bottom: 8px;
            color: #00ff88;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
            width: 100%;
            padding: 12px 15px;
            background: rgba(0,0,0,0.6);
            border: 2px solid rgba(0,255,136,0.4);
            border-radius: 10px;
            color: #00ff88;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .input-group input: focus,
        .input-group select: focus,
        .input-group textarea: focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 20px rgba(0,255,136,0.3);
            background: rgba(0,0,0,0.8);
        }

        .input-group textarea {
            resize: vertical;
            min-height: 90px;
            font-family: 'Rajdhani', sans-serif;
        }

        .input-group input[type="range"] {
            -webkit-appearance: none;
            height: 8px;
            background: rgba(0,255,136,0.2);
            border-radius: 10px;
            outline: none;
        }

        .input-group input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #00ff88;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0,255,136,0.8);
            transition: all 0.3s;
        }

        .input-group input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(0,255,136,1);
        }

        .btn-generate {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #00ff88, #00cc6f);
            border: none;
            border-radius: 12px;
            color: #000;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            margin-top: 15px;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
        }

        .btn-generate::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }

        .btn-generate:hover::before {
            left: 100%;
        }

        .btn-generate:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 10px 40px rgba(0,255,136,0.6);
        }

        .btn-generate:active {
            transform: scale(0.98);
        }

        .output-box {
            margin-top: 25px;
            padding: 20px;
            background: rgba(0,0,0,0.7);
            border: 2px solid rgba(0,255,136,0.4);
            border-radius: 12px;
            min-height: 120px;
            max-height: 350px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.8;
            display: none;
            white-space: pre-wrap;
        }

        .output-box::-webkit-scrollbar {
            width: 8px;
        }

        .output-box::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.5);
            border-radius: 10px;
        }

        .output-box::-webkit-scrollbar-thumb {
            background: #00ff88;
            border-radius: 10px;
        }

        .output-box.visible {
            display: block;
            animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .stat-display {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            background: rgba(0,255,136,0.1);
            border-radius: 10px;
            margin-top: 12px;
            border-left: 4px solid #00ff88;
            transition: all 0.3s ease;
        }

        .stat-display:hover {
            background: rgba(0,255,136,0.15);
            transform: translateX(5px);
        }

        .stat-display span {
            font-weight: 600;
            font-size: 1.05rem;
        }

        .stat-display span:last-child {
            color: #00ffff;
            text-shadow: 0 0 10px rgba(0,255,255,0.5);
        }

        .color-preview {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            border: 3px solid #00ff88;
            margin-top: 12px;
            box-shadow: 0 0 20px rgba(0,255,136,0.3);
            transition: all 0.3s ease;
        }

        .color-preview:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(0,255,136,0.6);
        }

        .slider-value {
            min-width: 45px;
            text-align: right;
            font-weight: 700;
            color: #00ffff;
            font-size: 1.1rem;
        }

        @media (max-width: 768px) {
            .tool-grid {
                grid-template-columns: 1fr;
            }
            
            .dev-tabs {
                gap: 10px;
            }
            
            .tab-btn {
                padding: 12px 20px;
                font-size: 0.9rem;
            }
            
            .title {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="matrix-bg"></div>
    <div class="scanline"></div>
    
    <div class="container">
        <div class="header">
            <h1 class="title">TACTICAL LEGENDS</h1>
            <p class="subtitle">Game Development Toolkit</p>
        </div>

        <div class="dev-tabs">
            <button class="tab-btn active" onclick="switchTab('character')"><span>Character Builder</span></button>
            <button class="tab-btn" onclick="switchTab('weapon')"><span>Weapon Generator</span></button>
            <button class="tab-btn" onclick="switchTab('mission')"><span>Mission Creator</span></button>
            <button class="tab-btn" onclick="switchTab('balance')"><span>Balance Calculator</span></button>
        </div>

        <!-- Character Builder Tab -->
        <div id="character" class="tab-content active">
            <div class="tool-grid">
                <div class="tool-card">
                    <h3>⚔️ Character Stats</h3>
                    <div class="input-group">
                        <label>Character Name</label>
                        <input type="text" id="charName" placeholder="Enter character name">
                    </div>
                    <div class="input-group">
                        <label>Class</label>
                        <select id="charClass">
                            <option>Assault</option>
                            <option>Sniper</option>
                            <option>Tank</option>
                            <option>Medic</option>
                            <option>Engineer</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Health: <span class="slider-value" id="healthVal">100</span></label>
                        <input type="range" id="charHealth" min="50" max="200" value="100" oninput="updateSlider('health')">
                    </div>
                    <div class="input-group">
                        <label>Speed: <span class="slider-value" id="speedVal">10</span></label>
                        <input type="range" id="charSpeed" min="5" max="20" value="10" oninput="updateSlider('speed')">
                    </div>
                    <div class="input-group">
                        <label>Armor: <span class="slider-value" id="armorVal">50</span></label>
                        <input type="range" id="charArmor" min="0" max="100" value="50" oninput="updateSlider('armor')">
                    </div>
                    <button class="btn-generate" onclick="generateCharacter()">Generate Character</button>
                    <div id="charOutput" class="output-box"></div>
                </div>

                <div class="tool-card">
                    <h3>✨ Special Abilities</h3>
                    <div class="input-group">
                        <label>Ability Name</label>
                        <input type="text" id="abilityName" placeholder="Enter ability name">
                    </div>
                    <div class="input-group">
                        <label>Ability Type</label>
                        <select id="abilityType">
                            <option>Offensive</option>
                            <option>Defensive</option>
                            <option>Support</option>
                            <option>Utility</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Cooldown (seconds)</label>
                        <input type="number" id="abilityCooldown" value="30" min="5" max="120">
                    </div>
                    <div class="input-group">
                        <label>Description</label>
                        <textarea id="abilityDesc" placeholder="Describe the ability effect..."></textarea>
                    </div>
                    <button class="btn-generate" onclick="generateAbility()">Add Ability</button>
                    <div id="abilityOutput" class="output-box"></div>
                </div>
            </div>
        </div>

        <!-- Weapon Generator Tab -->
        <div id="weapon" class="tab-content">
            <div class="tool-grid">
                <div class="tool-card">
                    <h3>🔫 Weapon Properties</h3>
                    <div class="input-group">
                        <label>Weapon Name</label>
                        <input type="text" id="weaponName" placeholder="Enter weapon name">
                    </div>
                    <div class="input-group">
                        <label>Weapon Type</label>
                        <select id="weaponType">
                            <option>Assault Rifle</option>
                            <option>Sniper Rifle</option>
                            <option>Shotgun</option>
                            <option>SMG</option>
                            <option>Pistol</option>
                            <option>Melee</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Damage: <span class="slider-value" id="damageVal">50</span></label>
                        <input type="range" id="weaponDamage" min="10" max="150" value="50" oninput="updateSlider('damage')">
                    </div>
                    <div class="input-group">
                        <label>Fire Rate: <span class="slider-value" id="fireRateVal">10</span></label>
                        <input type="range" id="weaponFireRate" min="1" max="30" value="10" oninput="updateSlider('fireRate')">
                    </div>
                    <div class="input-group">
                        <label>Range: <span class="slider-value" id="rangeVal">50</span></label>
                        <input type="range" id="weaponRange" min="5" max="100" value="50" oninput="updateSlider('range')">
                    </div>
                    <div class="input-group">
                        <label>Magazine Size</label>
                        <input type="number" id="weaponMag" value="30" min="1" max="100">
                    </div>
                    <button class="btn-generate" onclick="generateWeapon()">Generate Weapon</button>
                    <div id="weaponOutput" class="output-box"></div>
                </div>

                <div class="tool-card">
                    <h3>📊 Weapon Stats Summary</h3>
                    <div class="stat-display">
                        <span>DPS:</span>
                        <span id="dpsDisplay">0</span>
                    </div>
                    <div class="stat-display">
                        <span>Effective Range:</span>
                        <span id="rangeDisplay">0m</span>
                    </div>
                    <div class="stat-display">
                        <span>Reload Time:</span>
                        <span id="reloadDisplay">2.5s</span>
                    </div>
                    <div class="stat-display">
                        <span>Ammo Capacity:</span>
                        <span id="ammoDisplay">0</span>
                    </div>
                    <div class="input-group">
                        <label>Rarity Color</label>
                        <input type="color" id="rarityColor" value="#00ff88" onchange="updateColorPreview()">
                        <div id="colorPreview" class="color-preview" style="background-color: #00ff88;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mission Creator Tab -->
        <div id="mission" class="tab-content">
            <div class="tool-grid">
                <div class="tool-card">
                    <h3>🎯 Mission Details</h3>
                    <div class="input-group">
                        <label>Mission Name</label>
                        <input type="text" id="missionName" placeholder="Enter mission name">
                    </div>
                    <div class="input-group">
                        <label>Mission Type</label>
                        <select id="missionType">
                            <option>Elimination</option>
                            <option>Extraction</option>
                            <option>Defense</option>
                            <option>Sabotage</option>
                            <option>Escort</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Difficulty</label>
                        <select id="missionDifficulty">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                            <option>Extreme</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Objective</label>
                        <textarea id="missionObjective" placeholder="Describe the mission objective..."></textarea>
                    </div>
                    <div class="input-group">
                        <label>Enemy Count</label>
                        <input type="number" id="enemyCount" value="10" min="1" max="100">
                    </div>
                    <button class="btn-generate" onclick="generateMission()">Create Mission</button>
                    <div id="missionOutput" class="output-box"></div>
                </div>

                <div class="tool-card">
                    <h3>🏆 Mission Rewards</h3>
                    <div class="input-group">
                        <label>XP Reward</label>
                        <input type="number" id="xpReward" value="1000" min="0" step="100">
                    </div>
                    <div class="input-group">
                        <label>Currency Reward</label>
                        <input type="number" id="currencyReward" value="500" min="0" step="50">
                    </div>
                    <div class="input-group">
                        <label>Loot Drops</label>
                        <select id="lootTier">
                            <option>Common</option>
                            <option>Uncommon</option>
                            <option>Rare</option>
                            <option>Epic</option>
                            <option>Legendary</option>
                        </select>
                    </div>
                    <div class="stat-display">
                        <span>Estimated Duration:</span>
                        <span id="durationDisplay">15 min</span>
                    </div>
                    <div class="stat-display">
                        <span>Recommended Level:</span>
                        <span id="levelDisplay">10</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Balance Calculator Tab -->
        <div id="balance" class="tab-content">
            <div class="tool-grid">
                <div class="tool-card">
                    <h3>⚖️ Combat Balance</h3>
                    <div class="input-group">
                        <label>Player DPS</label>
                        <input type="number" id="playerDPS" value="100" min="0" oninput="calculateBalance()">
                    </div>
                    <div class="input-group">
                        <label>Player Health</label>
                        <input type="number" id="playerHP" value="150" min="0" oninput="calculateBalance()">
                    </div>
                    <div class="input-group">
                        <label>Enemy DPS</label>
                        <input type="number" id="enemyDPS" value="80" min="0" oninput="calculateBalance()">
                    </div>
                    <div class="input-group">
                        <label>Enemy Health</label>
                        <input type="number" id="enemyHP" value="120" min="0" oninput="calculateBalance()">
                    </div>
                    <div class="stat-display">
                        <span>Time to Kill Enemy:</span>
                        <span id="ttkEnemy">0s</span>
                    </div>
                    <div class="stat-display">
                        <span>Time to Die:</span>
                        <span id="ttd">0s</span>
                    </div>
                    <div class="stat-display">
                        <span>Balance Ratio:</span>
                        <span id="balanceRatio">0</span>
                    </div>
                    <div id="balanceOutput" class="output-box visible">Configure values above to see balance analysis...</div>
                </div>

                <div class="tool-card">
                    <h3>💰 Economy Balance</h3>
                    <div class="input-group">
                        <label>Item Cost</label>
                        <input type="number" id="itemCost" value="1000" min="0" oninput="calculateEconomy()">
                    </div>
                    <div class="input-group">
                        <label>Mission Reward</label>
                        <input type="number" id="missionReward" value="500" min="0" oninput="calculateEconomy()">
                    </div>
                    <div class="input-group">
                        <label>Daily Login Bonus</label>
                        <input type="number" id="dailyBonus" value="100" min="0" oninput="calculateEconomy()">
                    </div>
                    <div class="stat-display">
                        <span>Missions Required:</span>
                        <span id="missionsNeeded">0</span>
                    </div>
                    <div class="stat-display">
                        <span>Days to Earn:</span>
                        <span id="daysNeeded">0</span>
                    </div>
                    <div id="economyOutput" class="output-box visible">Configure economy values to see projections...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.getElementById(tabName).classList.add('active');
            event.target.closest('.tab-btn').classList.add('active');
        }

        function updateSlider(type) {
            const sliders = {
                health: 'charHealth',
                speed: 'charSpeed',
                armor: 'charArmor',
                damage: 'weaponDamage',
                fireRate: 'weaponFireRate',
                range: 'weaponRange'
            };
            
            const value = document.getElementById(sliders[type]).value;
            document.getElementById(type + 'Val').textContent = value;

            if (type === 'damage' || type === 'fireRate' || type === 'range') {
                updateWeaponStats();
            }
        }

        function generateCharacter() {
            const name = document.getElementById('charName').value || 'Unnamed Hero';
            const charClass = document.getElementById('charClass').value;
            const health = document.getElementById('charHealth').value;
            const speed = document.getElementById('charSpeed').value;
            const armor = document.getElementById('charArmor').value;

            const output = `╔══════════════════════════════════╗
║   CHARACTER PROFILE GENERATED    ║
╚══════════════════════════════════╝

Name: ${name}
Class: ${charClass}
Health: ${health} HP
Speed: ${speed} m/s
Armor: ${armor}%

Power Rating: ${Math.round((parseInt(health) + parseInt(speed) * 5 + parseInt(armor)) / 3)}

Status: ✓ Ready for deployment.

            const outputBox = document.getElementById('charOutput');
            outputBox.textContent = output;
            outputBox.classList.add('visible');
        }

        function generateAbility() {
            const name = document.getElementById('abilityName').value || 'Unnamed Ability';
            const type = document.getElementById('abilityType').value;
            const cooldown = document.getElementById('abilityCooldown').value;
            const desc = document.getElementById('abilityDesc').value || 'No description provided';

            const output = `╔══════════════════════════════════╗
║   ABILITY CREATED                ║
╚══════════════════════════════════╝

Ability: ${name}
Type: ${type}
Cooldown: ${cooldown}s
Description: ${desc}

Status: ✓ Added to character loadout.

            const outputBox = document.getElementById('abilityOutput');
            outputBox.textContent = output;
            outputBox.classList.add('visible');
        }

        function generateWeapon() {
            const name = document.getElementById('weaponName').value || 'Unnamed Weapon';
            const type = document.getElementById('weaponType').value;
            const damage = document.getElementById('weaponDamage').value;
            const fireRate = document.getElementById('weaponFireRate').value;
            const range = document.getElementById('weaponRange').value;
            const mag = document.getElementById('weaponMag').value;

            const dps = Math.round(damage * fireRate / 10);

            const output = `╔══════════════════════════════════╗
║   WEAPON BLUEPRINT GENERATED     ║
╚══════════════════════════════════╝

Name: ${name}
Type: ${type}
Damage: ${damage}
Fire Rate: ${fireRate} RPM
Range: ${range}m
Magazine: ${mag} rounds

DPS: ${dps}
Effective Range: ${range}m
Reload Time: 2.5s

Status: ✓ Ready for armory.

            const outputBox = document.getElementById('weaponOutput');
            outputBox.textContent = output;
            outputBox.classList.add('visible');

            updateWeaponStats();
        }

        function updateWeaponStats() {
            const damage = document.getElementById('weaponDamage').value;
            const fireRate = document.getElementById('weaponFireRate').value;
            const range = document.getElementById('weaponRange').value;
            const mag = document.getElementById('weaponMag').value;

            const dps = Math.round(damage * fireRate / 10);
            
            document.getElementById('dpsDisplay').textContent = dps;
            document.getElementById('rangeDisplay').textContent = range + 'm';
            document.getElementById('ammoDisplay').textContent = mag + ' rounds';
        }

        function updateColorPreview() {
            const color = document.getElementById('rarityColor').value;
            document.getElementById('colorPreview').style.backgroundColor = color;
        }

        function generateMission() {
            const name = document.getElementById('missionName').value || 'Operation Unknown';
            const type = document.getElementById('missionType').value;
            const difficulty = document.getElementById('missionDifficulty').value;
            const objective = document.getElementById('missionObjective').value || 'Complete the mission';
            const enemies = document.getElementById('enemyCount').value;

            const xp = document.getElementById('xpReward').value;
            const currency = document.getElementById('currencyReward').value;

            const output = `╔══════════════════════════════════╗
║   MISSION BRIEFING               ║
╚══════════════════════════════════╝

Mission: ${name}
Type: ${type}
Difficulty: ${difficulty}

Objective:
${objective}

Enemy Forces: ${enemies} hostiles
Recommended Level: 10

Rewards:
• XP: ${xp}
• Currency: ${currency}
• Loot: ${document.getElementById('lootTier').value}

Status: ✓ Mission ready for deployment.

            const outputBox = document.getElementById('missionOutput');
            outputBox.textContent = output;
            outputBox.classList.add('visible');
        }

        function calculateBalance() {
            const playerDPS = parseFloat(document.getElementById('playerDPS').value) || 0;
            const playerHP = parseFloat(document.getElementById('playerHP').value) || 0;
            const enemyDPS = parseFloat(document.getElementById('enemyDPS').value) || 0;
            const enemyHP = parseFloat(document.getElementById('enemyHP').value) || 0;

            if (playerDPS === 0 || enemyDPS === 0) {
                document.getElementById('balanceOutput').textContent = 'Please enter valid DPS values (greater than 0)';
                return;
            }

            const ttkEnemy = enemyHP / playerDPS;
            const ttd = playerHP / enemyDPS;
            const ratio = (ttkEnemy / ttd).toFixed(2);

            document.getElementById('ttkEnemy').textContent = ttkEnemy.toFixed(2) + 's';
            document.getElementById('ttd').textContent = ttd.toFixed(2) + 's';
            document.getElementById('balanceRatio').textContent = ratio;

            let analysis = '';
            if (ratio < 0.8) {
                analysis = '⚠️ Player advantage is too high. Consider buffing enemies or reducing player damage.';
            } else if (ratio > 1.3) {
                analysis = '⚠️ Enemies are too strong. Consider reducing enemy damage or increasing player health.';
            } else {
                analysis = '✓ Combat balance is within acceptable range (0.8 - 1.3).';
            }

            document.getElementById('balanceOutput').textContent = `Balance Analysis:
${analysis}

Time to Kill Enemy: ${ttkEnemy.toFixed(2)}s
Time to Die: ${ttd.toFixed(2)}s
Balance Ratio: ${ratio}

Note: Ideal ratio is between 0.8 and 1.3 for fair gameplay.`;
        }

        function calculateEconomy() {
            const itemCost = parseFloat(document.getElementById('itemCost').value) || 0;
            const missionReward = parseFloat(document.getElementById('missionReward').value) || 0;
            const dailyBonus = parseFloat(document.getElementById('dailyBonus').value) || 0;

            if (missionReward === 0) {
                document.getElementById('economyOutput').textContent = 'Please enter a valid mission reward (greater than 0)';
                return;
            }

            const missionsNeeded = Math.ceil(itemCost / missionReward);
            const daysNeeded = Math.ceil(itemCost / (missionReward + dailyBonus));

            document.getElementById('missionsNeeded').textContent = missionsNeeded;
            document.getElementById('daysNeeded').textContent = daysNeeded;

            let analysis = '';
            if (missionsNeeded > 20) {
                analysis = '⚠️ Item may be too expensive. Players need ' + missionsNeeded + ' missions to afford it.';
            } else if (missionsNeeded < 3) {
                analysis = '⚠️ Item may be too cheap. Consider increasing cost or reducing rewards.';
            } else {
                analysis = '✓ Economy balance looks good. Item requires reasonable effort to obtain.';
            }

            document.getElementById('economyOutput').textContent = `Economy Analysis:
${analysis}

Missions Required: ${missionsNeeded}
Days with Daily Bonus: ${daysNeeded}
Total Earning Rate: ${missionReward + dailyBonus} per day

Recommendation: ${missionsNeeded <= 20 && missionsNeeded >= 3 ? 'Balanced economy': 'Consider adjustments'}`;
        }

        // Initialize balance calculators on load
        window.addEventListener('load', () => {
            calculateBalance();
            calculateEconomy();
            updateWeaponStats();
        });
    </script>
</body>
</html>
