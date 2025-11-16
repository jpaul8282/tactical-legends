using UnityEngine;
using System.Collections.Generic;

public static class MoraleManager
{
    public static void AdjustMorale(List<SquadMember> squad, int change)
    {
        foreach (var member in squad)
        {
            member.morale = Mathf.Clamp(member.morale + change, 0, 100);
        }
    }

    public static void CheckMorale(List<SquadMember> squad)
    {
        foreach (var member in squad)
        {
            string level = GetMoraleLevel(member.morale);
            Debug.Log($"{member.name} morale: {member.morale} ({level})");
        }
    }

    private static string GetMoraleLevel(int morale)
    {
        if (morale >= 80) return "High";
        if (morale >= 40) return "Neutral";
        if (morale > 0) return "Low";
        return "Broken";
    }
}

