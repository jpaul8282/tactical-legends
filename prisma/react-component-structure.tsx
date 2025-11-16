src/
├── components/
│   ├── Battlefield.tsx
│   ├── UnitCard.tsx
│   └── ActionPanel.tsx
├── hooks/
│   └── useBattleLogic.ts
export default function Battlefield({ units, gridSize }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
      {Array.from({ length: gridSize * gridSize }).map((_, i) => {
        const unit = units.find(u => u.position === i);
        return (
          <div key={i} className="border p-2 h-16 w-16 flex items-center justify-center">
            {unit? <UnitCard unit={unit} /> : null}
          </div>
        );
      })}
    </div>
  );
}
export function useBattleLogic(initialUnits) {
  const [units, setUnits] = useState(initialUnits);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');

  function performAction(unitId, action) {
    // Move, attack, etc.
    // Update unit state
    // Switch turn
    setTurn(prev => (prev === 'player' ? 'enemy': 'player'));
  }

  useEffect(() => {
    if (turn === 'enemy') {
      const enemyUnits = units.filter(u => u.faction === 'enemy');
      enemyUnits.forEach(enemy => {
        const decision = enemyAI(enemy, units);
        performAction(enemy.id, decision);
      });
    }
  }, [turn]);

  return { units, performAction, turn };
}

function enemyAI(enemy, units) {
  const target = units.find(u => u.faction === 'player');
  const distance = Math.abs(enemy.position - target.position);

  if (distance <= 1) return { type: 'attack', targetId: target.id };
  return { type: 'move', direction: enemy.position < target.position ? 'forward': 'back' };
}

interface CampaignState {
  userId: number;
  currentNodeId: number;
  completedNodes: number[];
  gearInventory: string[];
  characterStats: {
    name: string;
    class: string;
    level: number;
    abilities: string[];
  };
}
app.post('/api/save', async (req, res) => {
  const { userId, campaignState } = req.body;
  await prisma.campaignSave.upsert({
    where: { userId },
    update: { state: campaignState },
    create: { userId, state: campaignState }
  });
  res.send({ success: true });
});
app.get('/api/load/:userId', async (req, res) => {
  const save = await prisma.campaignSave.findUnique({ where: { userId: Number(req.params.userId) } });
  res.send(save?.state || {});
});
function getNextNodes(currentId, completedNodes) {
  const node = campaignTree[currentId];
  return node.next.filter(n => !completedNodes.includes(n));
}
