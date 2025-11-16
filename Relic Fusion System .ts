<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relic Fusion System Explorer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <!-- Chosen Palette: Warm Neutral with Teal accents -->
    <!-- Application Structure Plan: A two-panel layout. The left panel features an interactive diagram of the Relic Fusion system components. The right panel displays detailed information about the selected component or the current step in the simulated fusion process. A section below details the integration with the mission system. This structure was chosen to visually represent the system's architecture and provide a guided, interactive walkthrough of its processes, making the complex information from the report easier to understand than a static document. -->
    <!-- Visualization & Content Choices: System Components -> Goal: Organize/Inform -> Viz: Interactive HTML/CSS Diagram -> Interaction: Click to show details -> Justification: Visually represents the system structure and component relationships. Fusion Process -> Goal: Inform/Change -> Viz: Step-by-step list with a 'Next' button -> Interaction: Button click advances the process, highlighting the active step and the corresponding component in the diagram -> Justification: Turns a static list into an engaging, guided simulation. Integration Info -> Goal: Inform -> Viz: Formatted text block -> Interaction: None -> Justification: Presents contextual, non-procedural information clearly. All implemented with Vanilla JS and Tailwind. -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f5f5f4; /* Warm Neutral: Stone 100 */
            color: #292524; /* Warm Neutral: Stone 800 */
        }
        .component-box {
            transition: all 0.3s ease-in-out;
            border: 2px solid #a8a29e; /* Stone 400 */
        }
        .component-box:hover {
            border-color: #14b8a6; /* Teal 500 */
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .component-box.active {
            border-color: #0d9488; /* Teal 600 */
            background-color: #ccfbf1; /* Teal 100 */
            box-shadow: 0 0 15px rgba(20, 184, 166, 0.4);
        }
        .step-item.active {
            background-color: #f0fdfa; /* Teal 50 */
            border-left-color: #14b8a6; /* Teal 500 */
            color: #0f766e; /* Teal 700 */
        }
        .flow-line {
            position: absolute;
            background-color: #d6d3d1; /* Stone 300 */
            z-index: -1;
        }
    </style>
</head>
<body class="min-h-screen">
    <div class="container mx-auto p-4 sm:p-6 lg:p-8">
        <header class="text-center mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-stone-900">Relic Fusion System Explorer</h1>
            <p class="text-stone-600 mt-2">An interactive guide to the core crafting mechanics of Tactical Legends.</p>
        </header>

        <main class="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-stone-200">
            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Left Panel: Interactive Diagram -->
                <div>
                    <h2 class="text-2xl font-semibold mb-4 text-stone-800">System Architecture</h2>
                    <p class="text-stone-600 mb-6">Click on any component below to learn more about its role in the relic fusion process. This diagram illustrates how specialized modules collaborate to create unique items.</p>
                    <div id="system-diagram" class="relative bg-stone-50 rounded-lg p-6 min-h-[500px] flex items-center justify-center">
                        <!-- Components will be injected by JS -->
                    </div>
                </div>

                <!-- Right Panel: Information Display & Process Flow -->
                <div>
                    <div id="info-panel" class="sticky top-8 bg-stone-50 rounded-lg p-6 border border-stone-200 min-h-[500px]">
                        <div id="info-content">
                            <h3 id="info-title" class="text-2xl font-semibold text-teal-700 mb-3">Welcome</h3>
                            <p id="info-description" class="text-stone-700 leading-relaxed">Select a component from the diagram to see its details, or start the guided tour to understand the step-by-step fusion process.</p>
                        </div>
                        <div class="mt-6 border-t border-stone-200 pt-6">
                            <h3 class="text-xl font-semibold text-stone-800 mb-4">Fusion Process Flow</h3>
                            <ol id="process-steps" class="space-y-2">
                                <!-- Steps will be injected by JS -->
                            </ol>
                            <div class="mt-6 flex gap-4">
                               <button id="next-step-btn" class="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors shadow-md">Start Guided Tour</button>
                               <button id="reset-btn" class="w-full bg-stone-200 text-stone-700 font-bold py-3 px-6 rounded-lg hover:bg-stone-300 transition-colors">Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <!-- Integration Section -->
            <div class="mt-12 border-t border-stone-200 pt-8">
                <h2 class="text-2xl font-semibold text-center mb-6 text-stone-800">Integration with the Mission System</h2>
                <p class="text-center text-stone-600 max-w-3xl mx-auto mb-8">The Relic Fusion Engine is not a standalone feature; it is deeply intertwined with the core gameplay loop. This synergy creates a rewarding cycle of playing missions, acquiring resources, and crafting powerful gear.</p>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <div class="bg-stone-50 p-6 rounded-lg border border-stone-200">
                        <div class="text-3xl mb-3">➔</div>
                        <h3 class="font-semibold text-lg mb-2 text-stone-900">Resource Acquisition</h3>
                        <p class="text-stone-600 text-sm">Missions are the primary source of relics. Completing objectives and exploring environments rewards players with the components needed for fusion.</p>
                    </div>
                    <div class="bg-stone-50 p-6 rounded-lg border border-stone-200">
                        <div class="text-3xl mb-3">✚</div>
                        <h3 class="font-semibold text-lg mb-2 text-stone-900">Tactical Advantage</h3>
                        <p class="text-stone-600 text-sm">Fused relics provide tangible benefits in combat, enhancing squad member stats and unlocking new abilities to overcome challenges like the "Memory Wraith".</p>
                    </div>
                    <div class="bg-stone-50 p-6 rounded-lg border border-stone-200">
                        <div class="text-3xl mb-3">↔</div>
                        <h3 class="font-semibold text-lg mb-2 text-stone-900">Narrative Feedback</h3>
                        <p class="text-stone-600 text-sm">In-game choices, reflected by the `trustScore`, can influence fusion outcomes, potentially creating "compromised" relics or unlocking unique positive mutations.</p>
                    </div>
                     <div class="bg-stone-50 p-6 rounded-lg border border-stone-200">
                        <div class="text-3xl mb-3">consistent</div>
                        <h3 class="font-semibold text-lg mb-2 text-stone-900">UI Consistency</h3>
                        <p class="text-stone-600 text-sm">The visual language of fused relics, generated via glyphs, ensures a seamless and cohesive user experience between the crafting and mission interfaces.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>

<script>
const contentData = {
    "RelicFusionEngine": {
        title: "Relic Fusion Engine",
        description: "The primary controller. Its `initiateFusion` method triggers the entire sequence, managing calls to all other components to ensure a seamless and logical fusion outcome."
    },
    "SynergyCalculator": {
        title: "Synergy Calculator",
        description: "Evaluates the compatibility of two relics by comparing traits, elements, or factions. It generates a quantitative synergy score that can lead to better outcomes, such as more potent mutations or enhanced stats."
    },
    "FactionalModifier": {
        title: "Factional Modifier",
        description: "Adds a strategic layer by applying bonuses or penalties based on the relics' origins and the player's chosen faction, reinforcing the game's lore and encouraging tactical choices."
    },
    "MutationSelector": {
        title: "Mutation Selector",
        description: "Introduces a degree of randomness by selecting a unique mutation path and applying new, often surprising, effects to the fused item. This ensures that each fused relic feels distinct."
    },
    "GlyphGenerator": {
        title: "Glyph Generator",
        description: "Creates a unique visual representation that reflects the final relic's properties. It embeds the new item's stats and bonuses directly into this glyph, tying the crafting system to the game's UI."
    },
    "LoreComposer": {
        title: "Lore Composer",
        description: "A narrative component that gives each fused relic a unique identity. It generates a new backstory by weaving together the histories of the two source relics and linking them to key events or factions."
    },
    "AchievementTracker": {
        title: "Achievement Tracker",
        description: "Tracks the player's fusion progress, monitoring milestones such as fusing a certain number of relics or discovering rare mutations, and unlocks new rewards to celebrate the player's achievements."
    },
    "RelicCodex": {
        title: "Relic Codex",
        description: "A comprehensive database and inventory management system. It automatically updates to record the newly fused relic and archives the source relics, serving as a historical record of the player's journey."
    }
};

const processStepsData = [
    { text: "Player selects two relics to fuse.", component: null },
    { text: "Initiate Fusion method is called.", component: "RelicFusionEngine" },
    { text: "Validate relics for compatibility.", component: "RelicFusionEngine" },
    { text: "Determine the compatibility score.", component: "SynergyCalculator" },
    { text: "Adjust outcome based on factional alignment.", component: "FactionalModifier" },
    { text: "Choose and apply a unique mutation.", component: "MutationSelector" },
    { text: "Create a visual representation with stats.", component: "GlyphGenerator" },
    { text: "Generate a unique backstory.", component: "LoreComposer" },
    { text: "Update player's inventory and archive.", component: "RelicCodex" },
    { text: "Check for fusion-related achievements.", component: "AchievementTracker" }
];

document.addEventListener('DOMContentLoaded', () => {
    const diagramContainer = document.getElementById('system-diagram');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const processStepsList = document.getElementById('process-steps');
    const nextStepBtn = document.getElementById('next-step-btn');
    const resetBtn = document.getElementById('reset-btn');

    let currentStep = -1;

    function resetState() {
        currentStep = -1;
        document.querySelectorAll('.component-box.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.step-item.active').forEach(el => el.classList.remove('active'));
        infoTitle.textContent = "Welcome";
        infoDescription.textContent = "Select a component from the diagram to see its details, or start the guided tour to understand the step-by-step fusion process.";
        nextStepBtn.textContent = 'Start Guided Tour';
    }

    function updateInfoPanel(componentKey) {
        const data = contentData[componentKey];
        if (data) {
            infoTitle.textContent = data.title;
            infoDescription.textContent = data.description;
        }
    }
    
    function highlightComponent(componentKey) {
        document.querySelectorAll('.component-box').forEach(box => {
            box.classList.toggle('active', box.dataset.key === componentKey);
        });
    }

    function createDiagram() {
        const engine = document.createElement('div');
        engine.dataset.key = 'RelicFusionEngine';
        engine.className = 'component-box absolute bg-white p-4 rounded-lg shadow-lg cursor-pointer text-center w-48';
        engine.innerHTML = `<h4 class="font-bold">Relic Fusion Engine</h4>`;
        diagramContainer.appendChild(engine);

        const components = Object.keys(contentData).filter(k => k !== 'RelicFusionEngine');
        const angleStep = (2 * Math.PI) / components.length;
        const radius = 200;

        components.forEach((key, index) => {
            const angle = angleStep * index - (Math.PI / 2);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const componentEl = document.createElement('div');
            componentEl.dataset.key = key;
            componentEl.className = 'component-box absolute bg-white p-3 rounded-lg shadow-md cursor-pointer text-center w-36';
            componentEl.style.transform = `translate(${x}px, ${y}px)`;
            componentEl.innerHTML = `<h4 class="font-semibold text-sm">${contentData[key].title}</h4>`;
            diagramContainer.appendChild(componentEl);
        });

        diagramContainer.addEventListener('click', (e) => {
            const componentBox = e.target.closest('.component-box');
            if (componentBox) {
                const key = componentBox.dataset.key;
                highlightComponent(key);
                updateInfoPanel(key);
            }
        });
    }

    function populateProcessSteps() {
        processStepsData.forEach((step, index) => {
            const li = document.createElement('li');
            li.dataset.step = index;
            li.className = 'step-item border-l-4 border-stone-200 pl-4 py-2 transition-colors';
            li.textContent = `${index + 1}. ${step.text}`;
            processStepsList.appendChild(li);
        });
    }

    function advanceStep() {
        currentStep++;
        if (currentStep >= processStepsData.length) {
            currentStep = 0; 
        }

        nextStepBtn.textContent = 'Next Step';
        
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.step) === currentStep);
        });

        const stepData = processStepsData[currentStep];
        if (stepData.component) {
            highlightComponent(stepData.component);
            updateInfoPanel(stepData.component);
        } else {
             document.querySelectorAll('.component-box.active').forEach(el => el.classList.remove('active'));
             infoTitle.textContent = `Step ${currentStep + 1}: Player Action`;
             infoDescription.textContent = stepData.text;
        }
    }

    nextStepBtn.addEventListener('click', advanceStep);
    resetBtn.addEventListener('click', resetState);

    createDiagram();
    populateProcessSteps();
});
</script>
</body>
</html>

