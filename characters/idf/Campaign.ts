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

