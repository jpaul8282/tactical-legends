import { createContext, useContext, useState } from "react";
import { missionPayload } from "./missionData";

const MissionContext = createContext(null);

export const MissionProvider = ({ children }) => {
  const [state, setState] = useState({
    turn: 0,
    player: missionPayload.playerUnit,
    enemies: missionPayload.enemyUnits,
    statusLog: [],
    outcome: null
  });

  return (
    <MissionContext.Provider value={{ state, setState }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => useContext(MissionContext);
import { useMission } from "./MissionContext";

export const useTurnEngine = () => {
  const { state, setState } = useMission();

  const resolveTurn = () => {
    const newLog = [...state.statusLog];
    const updatedEnemies = state.enemies.map(enemy => {
      if (enemy.health <= 0) return enemy;

      switch (enemy.aiBehavior) {
        case "flank":
          newLog.push(`${enemy.type} flanks the player!`);
          return { ...enemy, health: enemy.health - 10 };
        case "advance":
          newLog.push(`${enemy.type} advances aggressively.`);
          return { ...enemy, health: enemy.health - 5 };
        case "teleport + drain":
          newLog.push(`${enemy.type} teleports and drains life.`);
          return { ...enemy, health: enemy.health + 10 };
        default:
          return enemy;
      }
    });

    setState(prev => ({
      ...prev,
      turn: prev. turn + 1,
      enemies: updatedEnemies,
      statusLog: newLog
    }));
  };

  return { resolveTurn };
};
import { useMission } from "./MissionContext";

export const PlayerUnit = () => {
  const { state } = useMission();
  const { player } = state;

  return (
    <div className="unit-card">
      <h3>{player.name} ({player.class})</h3>
      <p>Level: {player.level}</p>
      <ul>
        {player.abilities.map(a => <li key={a}>{a}</li>)}
      </ul>
    </div>
  );
};
import { useMission } from "./MissionContext";

export const EnemyUnit = () => {
  const { state } = useMission();

  return (
    <div className="enemy-grid">
      {state.enemies.map((enemy, idx) => (
        <div key={idx} className="enemy-card">
          <h4>{enemy.type}</h4>
          <p>HP: {enemy.health}</p>
          <p>AI: {enemy.aiBehavior}</p>
        </div>
      ))}
    </div>
  );
};
export const useCampaign = () => {
  const saveOutcome = (outcome) => {
    localStorage.setItem("missionOutcome", JSON.stringify(outcome));
  };

  const loadOutcome = () => {
    return JSON.parse(localStorage.getItem("missionOutcome") || "{}");
  };

  return { saveOutcome, loadOutcome };
};
