<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical Legends: Missions</title>
    <!-- Tailwind CSS CDN for easy styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0d1117;
            color: #c9d1d9;
        }
    </style>
</head>
<body class="p-4 md:p-8 min-h-screen flex items-center justify-center">

    <div class="bg-gray-800 p-6 md:p-10 rounded-2xl shadow-lg border border-gray-700 w-full max-w-4xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center text-teal-400">Tactical Legends</h1>
        <p class="text-center text-sm mb-8 text-gray-400">A demonstration of mission logic and triggers.</p>

        <!-- Current Mission Display -->
        <div id="mission-display" class="bg-gray-700 p-6 rounded-xl mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-white">Current Mission: <span id="mission-title"></span></h2>
            <div class="space-y-4">
                <div>
                    <h3 class="font-bold text-gray-300">Objectives</h3>
                    <ul id="mission-objectives" class="list-disc list-inside ml-4 text-gray-400"></ul>
                </div>
                <div>
                    <h3 class="font-bold text-gray-300">Environment</h3>
                    <p id="mission-environment" class="text-gray-400"></p>
                </div>
                <div>
                    <h3 class="font-bold text-gray-300">Enemies</h3>
                    <p id="mission-enemies" class="text-gray-400"></p>
                </div>
            </div>
        </div>

        <!-- Game State Display -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-gray-700 p-6 rounded-xl">
                <h2 class="text-2xl font-semibold mb-4 text-white">Game State</h2>
                <div class="space-y-2 text-lg">
                    <p>Trust Score: <span id="trust-score" class="font-bold text-teal-300"></span></p>
                    <p>Morality Score: <span id="morality-score" class="font-bold text-teal-300"></span></p>
                </div>
            </div>
            <div class="bg-gray-700 p-6 rounded-xl">
                <h2 class="text-2xl font-semibold mb-4 text-white">Squad Status</h2>
                <div id="squad-status" class="space-y-2"></div>
            </div>
        </div>

        <!-- Interactive Controls -->
        <div class="bg-gray-700 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div class="flex-grow">
                <p class="text-lg text-gray-300 mb-2">Simulate an event to change trust:</p>
                <div class="flex items-center space-x-2">
                    <button id="increase-trust" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors">Increase Trust (+10)</button>
                    <button id="decrease-trust" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors">Decrease Trust (-15)</button>
                </div>
            </div>
            <button id="check-triggers" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors w-full md:w-auto">Check for Triggers</button>
        </div>

        <!-- Status Message Box -->
        <div id="message-box" class="mt-8 p-4 bg-yellow-900 border border-yellow-800 text-yellow-300 rounded-lg text-center font-semibold hidden"></div>
    </div>

    <script>
        // Data and Logic
        // The following code is a JavaScript version of the TypeScript interfaces and data provided.
        // Types are converted to comments for clarity.
        
        // type MoraleLevel = "High" | "Neutral" | "Low" | "Broken";
        // interface VoiceLine { speaker: string; line: string; trigger?: string; }
        // interface Mission { id: string; title: string; objectives: string[]; environment: string; enemies: string[]; voiceLines: VoiceLine[]; triggers: Record<string, Trigger>; }
        // interface Trigger { condition: (state: GameState) => boolean; effect: (state: GameState) => void; }
        // interface SquadMember { name: string; morale: number; status: "Active" | "Wounded" | "Compromised"; }
        // interface GameState { trustScore: number; moralityScore: number; squad: SquadMember[]; currentMission: string; }

        // The mission data, adapted from your provided code.
        const missions = [
            {
                id: "echoes_dust",
                title: "Echoes in the Dust",
                objectives: ["Locate Eden Vault entrance", "Survive Memory Wraith ambush"],
                environment: "Ruins of Oistaria Prime",
                enemies: ["Memory Wraith"],
                voiceLines: [
                    { speaker: "Echo Vanguard", line: "This silence isn’t empty. It’s waiting." },
                    { speaker: "Oistarian", line: "I buried my childhood here. Now it claws back." }
                ],
                triggers: {}
            },
            {
                id: "vault_breathes",
                title: "The Vault Breathes",
                objectives: ["Navigate corridors", "Disable AI sentinels"],
                environment: "Pulse-reactive corridors",
                enemies: ["AI Sentinel", "Memory Wraith"],
                voiceLines: [
                    { speaker: "Echo Vanguard", line: "The walls remember us. That’s not good." },
                    { speaker: "Oistarian", line: "I see her. My sister. She’s part of the vault now." }
                ],
                triggers: {
                    betrayal: {
                        condition: (state) => state.trustScore < 60,
                        effect: (state) => {
                            const echo = state.squad.find(m => m.name === "Echo Vanguard");
                            if (echo) {
                                echo.status = "Compromised";
                                showMessage("The 'betrayal' trigger has activated! Echo Vanguard is now Compromised.");
                            }
                        }
                    }
                }
            }
        ];

        // The core game state object.
        let gameState = {
            trustScore: 100,
            moralityScore: 50,
            squad: [
                { name: "Echo Vanguard", morale: 85, status: "Active" },
                { name: "Oistarian", morale: 90, status: "Active" }
            ],
            currentMission: "vault_breathes"
        };

        // DOM Elements
        const missionTitleEl = document.getElementById("mission-title");
        const missionObjectivesEl = document.getElementById("mission-objectives");
        const missionEnvironmentEl = document.getElementById("mission-environment");
        const missionEnemiesEl = document.getElementById("mission-enemies");
        const trustScoreEl = document.getElementById("trust-score");
        const moralityScoreEl = document.getElementById("morality-score");
        const squadStatusEl = document.getElementById("squad-status");
        const messageBoxEl = document.getElementById("message-box");
        const increaseTrustBtn = document.getElementById("increase-trust");
        const decreaseTrustBtn = document.getElementById("decrease-trust");
        const checkTriggersBtn = document.getElementById("check-triggers");

        // Function to update the UI based on the current game state.
        function renderState() {
            const currentMission = missions.find(m => m.id === gameState.currentMission);
            if (!currentMission) return;

            // Update mission details
            missionTitleEl.textContent = currentMission.title;
            missionEnvironmentEl.textContent = currentMission.environment;
            missionEnemiesEl.textContent = currentMission.enemies.join(", ");
            missionObjectivesEl.innerHTML = "";
            currentMission.objectives.forEach(obj => {
                const li = document.createElement("li");
                li.textContent = obj;
                missionObjectivesEl.appendChild(li);
            });

            // Update game scores
            trustScoreEl.textContent = gameState.trustScore;
            moralityScoreEl.textContent = gameState.moralityScore;

            // Update squad status
            squadStatusEl.innerHTML = "";
            gameState.squad.forEach(member => {
                const p = document.createElement("p");
                p.className = "flex justify-between items-center";
                p.innerHTML = `<span class="font-semibold">${member.name}</span><span class="${getStatusColor(member.status)}">${member.status}</span>`;
                squadStatusEl.appendChild(p);
            });
        }

        // Helper function to get status color
        function getStatusColor(status) {
            switch(status) {
                case "Active": return "text-green-400";
                case "Wounded": return "text-yellow-400";
                case "Compromised": return "text-red-400";
                default: return "text-gray-400";
            }
        }

        // Function to run a check on all mission triggers.
        function checkTriggers() {
            const currentMission = missions.find(m => m.id === gameState.currentMission);
            if (!currentMission || !currentMission.triggers) return;

            let triggerFound = false;
            for (const key in currentMission.triggers) {
                const trigger = currentMission.triggers[key];
                try {
                    if (trigger.condition(gameState)) {
                        trigger.effect(gameState);
                        triggerFound = true;
                    }
                } catch(e) {
                    console.error(`Error checking trigger '${key}':`, e);
                }
            }
            if (!triggerFound) {
                showMessage("No new triggers found at this time.", "bg-gray-700 border-gray-600 text-gray-300");
            }
            renderState(); // Re-render the UI after checking triggers
        }

        // Simple message box display function.
        function showMessage(message, classes = "bg-yellow-900 border-yellow-800 text-yellow-300") {
            messageBoxEl.textContent = message;
            messageBoxEl.className = `mt-8 p-4 rounded-lg text-center font-semibold ${classes}`;
            messageBoxEl.style.display = 'block';
            setTimeout(() => {
                messageBoxEl.style.display = 'none';
            }, 5000); // Hide after 5 seconds
        }

        // Event listeners for UI interaction
        increaseTrustBtn.addEventListener("click", () => {
            gameState.trustScore = Math.min(100, gameState.trustScore + 10);
            renderState();
        });

        decreaseTrustBtn.addEventListener("click", () => {
            gameState.trustScore = Math.max(0, gameState.trustScore - 15);
            renderState();
        });

        checkTriggersBtn.addEventListener("click", () => {
            checkTriggers();
        });

        // Initial render on page load
        document.addEventListener("DOMContentLoaded", () => {
            renderState();
        });

    </script>
</body>
</html>

// Types
type MoraleLevel = "High" | "Neutral" | "Low" | "Broken";

interface VoiceLine {
  speaker: string;
  line: string;
  trigger?: string;
}

interface Mission {
  id: string;
  title: string;
  objectives: string[];
  environment: string;
  enemies: string[];
  voiceLines: VoiceLine[];
  triggers: Record<string, Trigger>;
}

interface Trigger {
  condition: (state: GameState) => boolean;
  effect: (state: GameState) => void;
}

interface SquadMember {
  name: string;
  morale: number;
  status: "Active" | "Wounded" | "Compromised";
}

interface GameState {
  trustScore: number;
  moralityScore: number;
  squad: SquadMember[];
  currentMission: string;
}

// Sample Missions
export const missions: Mission[] = [
  {
    id: "echoes_dust",
    title: "Echoes in the Dust",
    objectives: ["Locate Eden Vault entrance", "Survive Memory Wraith ambush"],
    environment: "Ruins of Oistaria Prime",
    enemies: ["Memory Wraith"],
    voiceLines: [
      { speaker: "Echo Vanguard", line: "This silence isn’t empty. It’s waiting." },
      { speaker: "Oistarian", line: "I buried my childhood here. Now it claws back." }
    ],
    triggers: {}
  },
  {
    id: "vault_breathes",
    title: "The Vault Breathes",
    objectives: ["Navigate corridors", "Disable AI sentinels"],
    environment: "Pulse-reactive corridors",
    enemies: ["AI Sentinel", "Memory Wraith"],
    voiceLines: [
      { speaker: "Echo Vanguard", line: "The walls remember us. That’s not good." },
      { speaker: "Oistarian", line: "I see her. My sister. She’s part of the vault now." }
    ],
    triggers: {
      betrayal: {
        condition: (state) => state.trustScore < 60,
        effect: (state) => {
          const echo = state.squad.find(m => m.name === "Echo Vanguard");
          if (echo) echo.status = "Compromised";
        }
      }
    }
  }
];

