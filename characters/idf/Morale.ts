export function getMoraleLevel(morale: number): MoraleLevel {
  if (morale >= 80) return "High";
  if (morale >= 40) return "Neutral";
  if (morale > 0) return "Low";
  return "Broken";
}

export function adjustMorale(member: SquadMember, change: number): void {
  member.morale = Math.max(0, Math.min(100, member.morale + change));
}

export function applyEventImpact(event: string, squad: SquadMember[]): void {
  switch (event) {
    case "mission_success":
      squad.forEach(m => adjustMorale(m, 15));
      break;
    case "ally_wounded":
      squad.forEach(m => adjustMorale(m, -20));
      break;
    case "emotional_trigger":
      squad.forEach(m => adjustMorale(m, -25));
      break;
    case "betrayal":
      squad.forEach(m => adjustMorale(m, -50));
      break;
    case "save_teammate":
      squad.forEach(m => adjustMorale(m, 25));
      break;
  }
}

