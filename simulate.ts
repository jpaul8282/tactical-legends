import express from 'express';

const app = express();
app.use(express.json());

interface SimulationRequest {
  characterName: string;
  missionId: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  enableAI?: boolean;
  gearLoadout?: string[];
}

interface SimulationResponse {
  success: boolean;
  summary: string;
  stats: {
    enemiesDefeated: number;
    gearUsed: number;
    missionOutcome: string;
  };
}

app.post('/simulate', (req, res) => {
  const {
    characterName,
    missionId,
    difficulty = 'medium',
    enableAI = false,
    gearLoadout = []
  }: SimulationRequest = req.body;

  if (!characterName || typeof missionId !== 'number') {
    return res.status(400).json({ success: false, summary: 'Missing required fields.' });
  }

  // Simulate gameplay logic
  const baseEnemies = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 10;
  const aiBonus = enableAI ? 3 : 0;
  const enemiesDefeated = baseEnemies + aiBonus;

  const missionOutcome = enemiesDefeated > 10 ? 'Victory': 'Partial Success';

  const response: SimulationResponse = {
    success: true,
    summary: `Mission ${missionId} completed by ${characterName} at ${difficulty} difficulty.`,
    stats: {
      enemiesDefeated,
      gearUsed: gearLoadout.length,
      missionOutcome
    }
  };

  res.json(response);
});

app.listen(3000, () => {
  console.log('🚀 Tacticallegend API running on http://localhost:3000');
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// After generating response
await prisma.simulation.create({
  data: {
    characterName,
    missionId,
    difficulty,
    enemiesDefeated,
    gearUsed: gearLoadout.length,
    missionOutcome
  }
});

interface SimulationRequest {
  characterName: string;
  missionId: number;
  characterClass?: 'Warrior' | 'Mage' | 'Rogue';
  abilities?: string[]; // e.g. ["Shadow Strike", "Heal"]
}
const classBonus = {
  Warrior: 5,
  Mage: 3,
  Rogue: 4
};

const abilityBonus = abilities?.length || 0;
const enemiesDefeated = baseEnemies + aiBonus + (classBonus[characterClass] || 0) + abilityBonus;
<MissionCard
  character="Oistarian"
  outcome="Victory"
  enemiesDefeated={18}
  gearUsed={3}
/>

import jwt from 'jsonwebtoken';

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).send('Forbidden');
  }
}

