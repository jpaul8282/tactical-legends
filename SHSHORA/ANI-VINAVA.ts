<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rise of Oistarian - SHOSHORA ANI VINAVA</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #121212;
            color: #E0E0E0;
            margin: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #game-canvas {
            border: 2px solid #555;
            background-color: #222;
        }

        #ui-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2rem;
            box-sizing: border-box;
        }

        .ui-top {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .ui-bottom {
            display: flex;
            justify-content: center;
            width: 100%;
        }

        .hud-item {
            font-size: 1.5rem;
            background: rgba(0, 0, 0, 0.5);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: 1px solid #444;
        }

        #crosshair {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin-top: -10px;
            margin-left: -10px;
            border: 2px solid white;
            border-radius: 50%;
            transform: scale(0.5);
            pointer-events: none;
            transition: transform 0.1s ease-in-out;
            box-shadow: 0 0 5px #fff;
        }

        #message-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #fff;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            display: none;
            flex-direction: column;
            gap: 1rem;
            z-index: 100;
        }

        #message-box h1 {
            font-size: 2.5rem;
            color: #ff6347;
            text-shadow: 0 0 10px #ff6347;
        }

        #message-box p {
            font-size: 1.2rem;
        }

        #start-button, #restart-button {
            background-color: #007BFF;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.2rem;
            transition: background-color 0.3s;
        }

        #start-button:hover, #restart-button:hover {
            background-color: #0056b3;
        }

    </style>
</head>
<body>
    <canvas id="game-canvas"></canvas>
    <div id="ui-overlay">
        <div class="ui-top">
            <div class="hud-item">HP: <span id="health">100</span></div>
            <div class="hud-item">Score: <span id="score">0</span></div>
            <div class="hud-item">Ammo: <span id="ammo">30</span></div>
        </div>
        <div class="ui-bottom">
            <div class="hud-item">Rise of Oistarian</div>
        </div>
    </div>
    <div id="crosshair"></div>
    <div id="message-box">
        <h1 id="message-title"></h1>
        <p id="message-text"></p>
        <button id="restart-button">Restart</button>
    </div>

    <script>
        const canvas = document.getElementById('game-canvas');
        const healthEl = document.getElementById('health');
        const scoreEl = document.getElementById('score');
        const ammoEl = document.getElementById('ammo');
        const messageBox = document.getElementById('message-box');
        const messageTitle = document.getElementById('message-title');
        const messageText = document.getElementById('message-text');
        const restartButton = document.getElementById('restart-button');
        const crosshair = document.getElementById('crosshair');

        let isGameRunning = false;
        let isGameOver = false;
        let health = 100;
        let score = 0;
        let ammo = 30;
        let mouseX = 0;
        let mouseY = 0;
        let keyState = {};

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas });

        const enemies = [];
        const walls = [];

        function initializeGame() {
            isGameRunning = false;
            isGameOver = false;
            health = 100;
            score = 0;
            ammo = 30;
            keyState = {};
            mouseX = 0;
            mouseY = 0;
            
            // Clear existing objects
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            enemies.length = 0;
            walls.length = 0;

            setupScene();
            updateUI();
            
            messageTitle.textContent = "SHOSHORA ANI VINAVA";
            messageText.textContent = "Click to enter the battlefield. WASD to move, mouse to aim, left-click to shoot.";
            restartButton.style.display = 'none';
            messageBox.style.display = 'flex';
        }

        function setupScene() {
            // Renderer setup
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            
            // Camera setup
            camera.position.set(0, 1.7, 0);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // Ground
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, side: THREE.DoubleSide });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = Math.PI / 2;
            scene.add(ground);

            // Walls
            const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
            const wallGeometry = new THREE.BoxGeometry(100, 10, 1);
            
            const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
            wall1.position.set(0, 5, -50);
            scene.add(wall1);
            walls.push(wall1);

            const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
            wall2.position.set(0, 5, 50);
            scene.add(wall2);
            walls.push(wall2);

            const wall3 = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 100), wallMaterial);
            wall3.position.set(-50, 5, 0);
            scene.add(wall3);
            walls.push(wall3);
            
            const wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 100), wallMaterial);
            wall4.position.set(50, 5, 0);
            scene.add(wall4);
            walls.push(wall4);

            // Player representation (simple box)
            const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
            playerMesh.position.set(0, 0, -1);
            camera.add(playerMesh);

            // Enemies
            spawnEnemies(5);
        }

        function spawnEnemies(count) {
            const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
            const enemyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            for (let i = 0; i < count; i++) {
                const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
                enemy.position.set(
                    Math.random() * 80 - 40,
                    0.5,
                    Math.random() * 80 - 40
                );
                scene.add(enemy);
                enemies.push(enemy);
            }
        }

        function updateUI() {
            healthEl.textContent = Math.max(0, health);
            scoreEl.textContent = score;
            ammoEl.textContent = ammo;
        }
        
        function checkCollision(position) {
            for (const wall of walls) {
                const box = new THREE.Box3().setFromObject(wall);
                if (box.containsPoint(position)) {
                    return true;
                }
            }
            return false;
        }

        function gameLoop() {
            if (!isGameRunning || isGameOver) return;

            // Player Movement
            const moveSpeed = 0.1;
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            
            if (keyState['w']) {
                const newPos = camera.position.clone().add(direction.multiplyScalar(moveSpeed));
                newPos.y = 1.7;
                if (!checkCollision(newPos)) camera.position.copy(newPos);
            }
            if (keyState['s']) {
                const newPos = camera.position.clone().sub(direction.multiplyScalar(moveSpeed));
                newPos.y = 1.7;
                if (!checkCollision(newPos)) camera.position.copy(newPos);
            }
            if (keyState['a']) {
                const newPos = camera.position.clone().add(direction.cross(camera.up).normalize().multiplyScalar(moveSpeed));
                newPos.y = 1.7;
                if (!checkCollision(newPos)) camera.position.copy(newPos);
            }
            if (keyState['d']) {
                const newPos = camera.position.clone().sub(direction.cross(camera.up).normalize().multiplyScalar(moveSpeed));
                newPos.y = 1.7;
                if (!checkCollision(newPos)) camera.position.copy(newPos);
            }
            
            // Simple enemy logic (e.g., move towards the player)
            enemies.forEach(enemy => {
                const enemyDirection = new THREE.Vector3().subVectors(camera.position, enemy.position).normalize();
                enemy.position.add(enemyDirection.multiplyScalar(0.01));
            });

            // Update UI
            updateUI();

            // Check for game over
            if (health <= 0) {
                gameOver();
            }

            renderer.render(scene, camera);
            requestAnimationFrame(gameLoop);
        }

        function shoot() {
            if (ammo <= 0 || !isGameRunning) return;
            
            ammo--;
            updateUI();
            crosshair.style.transform = 'scale(1)';
            setTimeout(() => crosshair.style.transform = 'scale(0.5)', 100);

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(0, 0);
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(enemies);
            if (intersects.length > 0) {
                const hitEnemy = intersects[0].object;
                scene.remove(hitEnemy);
                enemies.splice(enemies.indexOf(hitEnemy), 1);
                score += 10;
                updateUI();

                if (enemies.length === 0) {
                    gameOver(true);
                }
            }
        }

        function gameOver(win = false) {
            isGameRunning = false;
            isGameOver = true;
            document.exitPointerLock();
            messageBox.style.display = 'flex';
            restartButton.style.display = 'block';

            if (win) {
                messageTitle.textContent = "Victory Achieved!";
                messageText.textContent = `All enemies eliminated. Your final score is: ${score}`;
            } else {
                messageTitle.textContent = "Defeated";
                messageText.textContent = `Your health reached zero. Final score: ${score}`;
            }
        }

        // Event Listeners
        document.addEventListener('keydown', (event) => {
            keyState[event.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (event) => {
            keyState[event.key.toLowerCase()] = false;
        });

        document.addEventListener('mousedown', (event) => {
            if (event.button === 0 && isGameRunning) {
                shoot();
            }
        });

        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === canvas) {
                const movementX = event.movementX || 0;
                const movementY = event.movementY || 0;
                
                mouseX += movementX * 0.002;
                mouseY += movementY * 0.002;

                camera.rotation.set(-mouseY, mouseX, 0, 'YXZ');
            }
        });

        canvas.addEventListener('click', () => {
            if (!isGameRunning && !isGameOver) {
                canvas.requestPointerLock();
                isGameRunning = true;
                messageBox.style.display = 'none';
                gameLoop();
            }
        });

        restartButton.addEventListener('click', () => {
            initializeGame();
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Initialize the game on load
        initializeGame();
    </script>
</body>
</html>
