import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5a3a22);
scene.fog = new THREE.FogExp2(0x5a3a22, 0.05);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x553333, 1.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffddaa, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Ground (desert cracked look)
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x7a5a36, roughness: 1 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Humanoid (cloaked figure placeholder)
const cloakGeo = new THREE.ConeGeometry(1.5, 4, 32);
const cloakMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const cloak = new THREE.Mesh(cloakGeo, cloakMat);
cloak.position.set(2, 2, 0);
scene.add(cloak);

// Glowing eyes
const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x4ac3ff, emissive: 0x4ac3ff });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(1.8, 2.5, 0.7);
rightEye.position.set(2.2, 2.5, 0.7);
scene.add(leftEye, rightEye);

// Robot 1 (damaged, on fire)
const robotBodyGeo = new THREE.BoxGeometry(2, 1.5, 1);
const robotMat = new THREE.MeshStandardMaterial({ color: 0x8b7e60 });
const robotBody = new THREE.Mesh(robotBodyGeo, robotMat);
robotBody.position.set(-2, 0.75, 0);
scene.add(robotBody);

const helmetGeo = new THREE.SphereGeometry(0.8, 32, 32);
const helmetMat = new THREE.MeshStandardMaterial({ color: 0xa09674, metalness: 0.5, roughness: 0.7 });
const helmet = new THREE.Mesh(helmetGeo, helmetMat);
helmet.position.set(-2, 1.8, 0);
scene.add(helmet);

// Fire effect (glowing sphere placeholder)
const fireGeo = new THREE.SphereGeometry(0.5, 16, 16);
const fireMat = new THREE.MeshBasicMaterial({ color: 0xff5c1a, transparent: true, opacity: 0.7 });
const fire = new THREE.Mesh(fireGeo, fireMat);
fire.position.set(-2, 1.5, 0.5);
scene.add(fire);

// Robot 2 (background)
const robot2Body = new THREE.Mesh(robotBodyGeo, robotMat);
robot2Body.scale.set(0.7, 0.7, 0.7);
robot2Body.position.set(-5, 0.5, -3);
scene.add(robot2Body);

const helmet2 = new THREE.Mesh(helmetGeo, helmetMat);
helmet2.scale.set(0.7, 0.7, 0.7);
helmet2.position.set(-5, 1.3, -3);
scene.add(helmet2);

// HUD radar effect (green circle)
const radarGeo = new THREE.RingGeometry(0.5, 0.6, 32);
const radarMat = new THREE.MeshBasicMaterial({ color: 0x48ff48, side: THREE.DoubleSide });
const radar = new THREE.Mesh(radarGeo, radarMat);
radar.rotation.x = -Math.PI / 2;
radar.position.set(-2, 0.01, 2);
scene.add(radar);

// Animate lightning
let lightningTimer = 0;
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Lightning flash effect
  lightningTimer++;
  if (lightningTimer % 200 === 0) {
    renderer.setClearColor(0xeeeeee);
  } else {
    renderer.setClearColor(0x5a3a22);
  }

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5a3a22);
scene.fog = new THREE.FogExp2(0x5a3a22, 0.05);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x553333, 1.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffddaa, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Ground (desert cracked look)
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x7a5a36, roughness: 1 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Humanoid (cloaked figure placeholder)
const cloakGeo = new THREE.ConeGeometry(1.5, 4, 32);
const cloakMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const cloak = new THREE.Mesh(cloakGeo, cloakMat);
cloak.position.set(2, 2, 0);
scene.add(cloak);

// Glowing eyes
const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x4ac3ff });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(1.8, 2.5, 0.7);
rightEye.position.set(2.2, 2.5, 0.7);
scene.add(leftEye, rightEye);

// Robot 1 (damaged, on fire)
const robotBodyGeo = new THREE.BoxGeometry(2, 1.5, 1);
const robotMat = new THREE.MeshStandardMaterial({ color: 0x8b7e60 });
const robotBody = new THREE.Mesh(robotBodyGeo, robotMat);
robotBody.position.set(-2, 0.75, 0);
scene.add(robotBody);

const helmetGeo = new THREE.SphereGeometry(0.8, 32, 32);
const helmetMat = new THREE.MeshStandardMaterial({ color: 0xa09674, metalness: 0.5, roughness: 0.7 });
const helmet = new THREE.Mesh(helmetGeo, helmetMat);
helmet.position.set(-2, 1.8, 0);
scene.add(helmet);

// Fire effect (glowing sphere placeholder)
const fireGeo = new THREE.SphereGeometry(0.5, 16, 16);
const fireMat = new THREE.MeshBasicMaterial({ color: 0xff5c1a, transparent: true, opacity: 0.7 });
const fire = new THREE.Mesh(fireGeo, fireMat);
fire.position.set(-2, 1.5, 0.5);
scene.add(fire);

// Robot 2 (background)
const robot2Body = new THREE.Mesh(robotBodyGeo, robotMat);
robot2Body.scale.set(0.7, 0.7, 0.7);
robot2Body.position.set(-5, 0.5, -3);
scene.add(robot2Body);

const helmet2 = new THREE.Mesh(helmetGeo, helmetMat);
helmet2.scale.set(0.7, 0.7, 0.7);
helmet2.position.set(-5, 1.3, -3);
scene.add(helmet2);

// HUD radar effect (green circle)
const radarGeo = new THREE.RingGeometry(0.5, 0.6, 32);
const radarMat = new THREE.MeshBasicMaterial({ color: 0x48ff48, side: THREE.DoubleSide });
const radar = new THREE.Mesh(radarGeo, radarMat);
radar.rotation.x = -Math.PI / 2;
radar.position.set(-2, 0.01, 2);
scene.add(radar);

// Dust storm particle system
const dustParticles = new THREE.Group();
const dustGeo = new THREE.SphereGeometry(0.05, 8, 8);
const dustMat = new THREE.MeshBasicMaterial({ color: 0x9c7b4f, transparent: true, opacity: 0.5 });

for (let i = 0; i < 800; i++) {
  const dust = new THREE.Mesh(dustGeo, dustMat);
  dust.position.set(
    (Math.random() - 0.5) * 50,
    Math.random() * 10,
    (Math.random() - 0.5) * 50
  );
  dustParticles.add(dust);
}
scene.add(dustParticles);

// Animate lightning + dust motion
let lightningTimer = 0;
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Lightning flash effect
  lightningTimer++;
  if (lightningTimer % 200 === 0) {
    renderer.setClearColor(0xeeeeee);
  } else {
    renderer.setClearColor(0x5a3a22);
  }

  // Dust swirling animation
  dustParticles.children.forEach(p => {
    p.position.x += (Math.random() - 0.5) * 0.05;
    p.position.y += (Math.random() - 0.5) * 0.02;
    p.position.z += (Math.random() - 0.5) * 0.05;
    if (p.position.y < 0) p.position.y = Math.random() * 10; // recycle particles
  });

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
radar.userData = { isTargeting: true };
radar.onClick = () => {
  console.log("Target locked on SKYEYE Unit 2.");
  // Trigger mission objective or animation
};

const fireSpread = new THREE.Mesh(
  new THREE.CircleGeometry(1.2, 32),
  new THREE.MeshBasicMaterial({ color: 0xff6b2d, transparent: true, opacity: 0.4 })
);
fireSpread.rotation.x = -Math.PI / 2;
fireSpread.position.set(-2, 0.02, 0);
scene.add(fireSpread);

const lightningBolt = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-10, 10, -10),
    new THREE.Vector3(-9.5, 5, -9.8),
    new THREE.Vector3(-9.8, 2, -9.5)
  ]),
  new THREE.LineBasicMaterial({ color: 0xe8e2d5 })
);
scene.add(lightningBolt);

<div id="mission-ui">
  <h2>Mission: Rise of Oistarian</h2>
  <ul>
    <li>☑ Recover SKYEYE Data Core</li>
    <li>☐ Extract Unit 3</li>
    <li>☐ Investigate Rift Signature</li>
  </ul>
</div>

const hazardZone = new THREE.Mesh(
  new THREE.CircleGeometry(3, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 })
);
hazardZone.rotation.x = -Math.PI / 2;
hazardZone.position.set(3, 0.01, -2);
scene.add(hazardZone);

