+-------------------------------------------------------------+
| [Codex Navigation]       | [Codex Content Panel]           |
|--------------------------|---------------------------------|
| > Operatives             |  [Faction: Dominion]            |
| > Relics                 |  -----------------------------  |
| > Factions               |  Lore Summary                   |
| > Timeline               |  Strategic Influence Map        |
| > Discoveries            |  Related Operatives / Relics    |
+--------------------------+---------------------------------+

{
  "codex": {
    "factions": [
      {
        "id": "dominion",
        "name": "Dominion",
        "summary": "Militant faction seeking relic control.",
        "influenceZones": ["Vault", "Lowtown"],
        "relatedOperatives": ["op_001", "op_003"],
        "relatedRelics": ["relic_iron_sigil"]
      }
    ],
    "relics": [
      {
        "id": "relic_iron_sigil",
        "name": "Iron Sigil",
        "origin": "Forged in the Vault",
        "effects": ["+Armor", "+Morale"],
        "rarity": "Epic",
        "status": "classified"
      }
    ],
    "operatives": [
      {
        "id": "op_001",
        "name": "Vex",
        "faction": "dominion",
        "role": "Saboteur",
        "traits": ["Stealth", "Trap Deployment"]
      }
    ]
  }
}

+-------------------------------------------------------------+
| [Operative Selector]     | [Operative Details Panel]       |
|--------------------------|---------------------------------|
| > Vex                    |  Portrait / Codename / Faction  |
| > Nyra                   |  Role: Saboteur                 |
| > Thorne                 |  Traits: Stealth, Trap Deploy   |
|                          |  Loadout: Relic / Gear / Aug    |
|                          |  Status: Morale / Loyalty       |
|                          |  XP Progression / Field Log     |
+--------------------------+---------------------------------+

{
  "operative": {
    "id": "op_001",
    "name": "Vex",
    "faction": "dominion",
    "role": "Saboteur",
    "traits": [
      { "name": "Stealth", "type": "passive" },
      { "name": "Trap Deployment", "type": "active" }
    ],
    "loadout": {
      "relic": "relic_iron_sigil",
      "gear": ["smoke_grenade", "cloaking_device"],
      "augment": "trait_shadow_step"
    },
    "status": {
      "morale": 82,
      "loyalty": "High",
      "fatigue": 12
    },
    "progression": {
      "xp": 1450,
      "level": 4,
      "fieldLog": ["mission_001", "mission_003"]
    }
  }
}

+-------------------------------------------------------------+
| [Mission Briefing]       | [Deployment Panel]             |
|--------------------------|---------------------------------|
| Map: Vault               |  Squad Selection Grid           |
| Objectives:              |  Operative Fit Scores           |
| - Secure Relic           |  Synergy Indicators             |
| - Avoid Detection        |  Preview Enemy Response Curve   |
| Lore Context:            |                                 |
| - Dominion vs Exiles     |                                 |
+--------------------------+---------------------------------+

[Post-Mission Debrief]
- Tactical Summary
- Narrative Outcome
- Codex Updates

{
  "mission": {
    "id": "mission_001",
    "title": "Vault Breach",
    "map": "Vault",
    "objectives": [
      { "type": "primary", "description": "Secure the Iron Sigil" },
      { "type": "secondary", "description": "Avoid detection by Exiles" }
    ],
    "loreContext": {
      "factionsInvolved": ["dominion", "exiles"],
      "codexLinks": ["relic_iron_sigil", "faction_exiles"]
    },
    "deployment": {
      "squad": ["op_001", "op_002"],
      "synergyScore": 78,
      "enemyPreview": {
        "expectedResponse": "Heavy patrol",
        "countermeasures": ["EMP", "Decoys"]
      }
    },
    "debrief": {
      "summary": {
        "kills": 5,
        "objectivesCompleted": 2,
        "relicsRecovered": ["relic_iron_sigil"]
      },
      "narrativeOutcome": "Dominion gains control of Vault",
      "codexUpdates": ["mission_001", "relic_iron_sigil"]
    }
  }
}
src/
├── components/
│   ├── Codex/
│   ├── OperatorDashboard/
│   ├── MissionUI/
├── data/
│   ├── codex.json
│   ├── operatives.json
│   ├── missions.json
├── hooks/
│   ├── useCodex.ts
│   ├── useOperatives.ts
│   ├── useMissions.ts
├── App.tsx
└── index.tsx
import { useCodex } from '../../hooks/useCodex';

export const CodexPanel = () => {
  const { factions, relics, operatives } = useCodex();

  return (
    <div className="codex-container">
      <aside className="codex-nav">
        <ul>
          {factions.map(f => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </aside>
      <main className="codex-content">
        {/* Render faction details, relic cards, operative links */}
      </main>
    </div>
  );
};
import { useEffect, useState } from 'react';
import codexData from '../data/codex.json';

export const useCodex = () => {
  const [factions, setFactions] = useState([]);
  const [relics, setRelics] = useState([]);
  const [operatives, setOperatives] = useState([]);

  useEffect(() => {
    setFactions(codexData.factions);
    setRelics(codexData.relics);
    setOperatives(codexData.operatives);
  }, []);

  return { factions, relics, operatives };
};
import { useOperatives } from '../../hooks/useOperatives';

export const OperatorDashboard = () => {
  const { operatives } = useOperatives();

  return (
    <div className="dashboard">
      {operatives.map(op => (
        <div key={op.id} className="operative-card">
          <h3>{op.name} ({op.role})</h3>
          <p>Faction: {op.faction}</p>
          <ul>
            {op.traits.map(t => (
              <li key={t.name}>{t.name} ({t.type})</li>
            ))}
          </ul>
          {/* Loadout, status, progression */}
        </div>
      ))}
    </div>
  );
};
import { useMissions } from '../../hooks/useMissions';

export const MissionBriefing = () => {
  const { mission } = useMissions();

  return (
    <div className="mission-briefing">
      <h2>{mission.title}</h2>
      <p>Map: {mission.map}</p>
      <ul>
        {mission.objectives.map(obj => (
          <li key={obj.description}>{obj.type}: {obj.description}</li>
        ))}
      </ul>
      {/* Deployment panel, synergy scores, enemy preview */}
    </div>
  );
};
