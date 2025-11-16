// Super Action Skills Script: Skill Trees/Unit Progression
// Allows units or heroes to gain experience and unlock new skills or upgrades.

type Skill = {
  id: string;
  name: string;
  description: string;
  prerequisites: string[]; // Skill IDs
  levelRequired: number;
  unlocked: boolean;
};

type Unit = {
  id: string;
  name: string;
  experience: number;
  level: number;
  skillTree: Skill[];
  unlockedSkills: string[]; // Skill IDs
};

const EXP_PER_LEVEL = 1000;

// Calculate unit level from experience
function calculateLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

// Check if a skill is unlockable for a unit
function canUnlockSkill(unit: Unit, skill: Skill): boolean {
  if (skill.unlocked) return false;
  if (unit.level < skill.levelRequired) return false;
  // Check if all prerequisites are unlocked
  for (const pre of skill.prerequisites) {
    if (!unit.unlockedSkills.includes(pre)) return false;
  }
  return true;
}

// Unlock a skill for a unit
function unlockSkill(unit: Unit, skillId: string): boolean {
  const skill = unit.skillTree.find(s => s.id === skillId);
  if (!skill) return false;
  if (!canUnlockSkill(unit, skill)) return false;
  skill.unlocked = true;
  unit.unlockedSkills.push(skillId);
  return true;
}

// Add experience and handle level up
function addExperience(unit: Unit, amount: number): void {
  unit.experience += amount;
  const newLevel = calculateLevel(unit.experience);
  if (newLevel > unit.level) {
    unit.level = newLevel;
    // Trigger level-up effects here (e.g., stat increases)
  }
}

// Example usage
const skillTree: Skill[] = [
  { id: 'sword_mastery', name: 'Sword Mastery', description: 'Increase sword damage.', prerequisites: [], levelRequired: 1, unlocked: false },
  { id: 'blade_fury', name: 'Blade Fury', description: 'Special multi-hit attack.', prerequisites: ['sword_mastery'], levelRequired: 3, unlocked: false },
  { id: 'iron_will', name: 'Iron Will', description: 'Increase defense.', prerequisites: [], levelRequired: 2, unlocked: false },
];

const hero: Unit = {
  id: 'hero_001',
  name: 'Sir Gallant',
  experience: 0,
  level: 1,
  skillTree: JSON.parse(JSON.stringify(skillTree)),
  unlockedSkills: [],
};

// Simulate progression
addExperience(hero, 2100); // Level up to 3
unlockSkill(hero, 'sword_mastery'); // Unlock Sword Mastery
unlockSkill(hero, 'iron_will');     // Unlock Iron Will
unlockSkill(hero, 'blade_fury');    // Unlock Blade Fury (requires Sword Mastery and level 3)

console.log(hero);

export { Skill, Unit, addExperience, unlockSkill, canUnlockSkill, calculateLevel };
