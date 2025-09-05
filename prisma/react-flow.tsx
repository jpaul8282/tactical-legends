const getNodeStyle = (status: 'locked' | 'unlocked' | 'completed') => {
  switch (status) {
    case 'completed': return { background: '#4ade80' }; // green
    case 'unlocked': return { background: '#facc15' }; // yellow
    case 'locked': return { background: '#94a3b8' }; // gray
  }
};
const campaignProgress = {
  1: 'completed',
  2: 'unlocked',
  3: 'locked',
  4: 'locked',
  5: 'locked',
  6: 'locked'
};

nodes.map(node => ({
  id: node.id.toString(),
  data: { label: node.name },
  position: node.position,
  style: getNodeStyle(campaignProgress[node.id])
}));
function enemyDecision({ health, playerDistance, aggression }: EnemyState) {
  if (health < 30) return 'retreat';
  if (playerDistance < 5 && aggression > 7) return 'attack';
  if (playerDistance > 10) return 'advance';
  return 'hold';
}

const enemies = [
  { type: 'Sentinel', health: 100, aggression: 8 },
  { type: 'Stalker', health: 60, aggression: 10 },
  { type: 'Drone', health: 40, aggression: 5 }
];

SELECT characterClass, AVG(enemiesDefeated) AS avgKills
FROM Simulation
GROUP BY characterClass;

<Bar data={{
  labels: ['Warrior', 'Mage', 'Rogue'],
  datasets: [{
    label: 'Avg Enemies Defeated',
    data: [12.4, 9.8, 11.2],
    backgroundColor: ['#f87171', '#60a5fa', '#34d399']
  }]
}} />
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  progress  Json     // stores campaign node status
  simulations Simulation[]
}

const gearPool = ['Whisper & Roar', 'Titanium Aegis', 'NeuroPulse Arm'];
const droppedGear = gearPool[Math.floor(Math.random() * gearPool.length)];

const enemyTypes = ['Stalker', 'Drone', 'Sentinel'];
const generatedEnemies = Array.from({ length: 3 }, () => {
  const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  return { type, health: Math.floor(Math.random() * 100), aggression: Math.floor(Math.random() * 10) };
});

const result = {
  gearFound: droppedGear,
  enemies: generatedEnemies,
  outcome: calculateOutcome({ gearLoadout: [droppedGear], ... })
};

