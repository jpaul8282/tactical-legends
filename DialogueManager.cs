using UnityEngine;
using System.Collections.Generic;

public static class DialogueManager
{
    public static void PlayDialogue(List<SquadMember> squad)
    {
        foreach (var member in squad)
        {
            string line = GetDialogue(member);
            Debug.Log(line);
        }
    }

    private static string GetDialogue(SquadMember member)
    {
        if (member.morale >= 80)
            return $"{member.name}: “We finish this together.";
        else if (member.morale >= 40)
            return $"{member.name}: “I’m holding it together. For now.”
        else if (member.morale > 0)
            return $"{member.name}: “I’m not sure I can keep going.";
        else
            return $"{member.name}: “I’m done. Don’t count on me.";
    }
}

