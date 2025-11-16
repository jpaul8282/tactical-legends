public class CampaignBranchingManager {
    public int globalMorality;
    public Dictionary<string, int> factionTrust = new();
    public Dictionary<string, TraitType> squadTraits = new();

    public void RecordMissionOutcome(int moralityDelta, Dictionary<string, TraitType> newTraits, string faction, int factionDelta) {
        globalMorality += moralityDelta;
        factionTrust[faction] = Mathf.Clamp(factionTrust.GetValueOrDefault(faction) + factionDelta, 0, 100);

        foreach (var trait in newTraits)
            squadTraits[trait.Key] = trait.Value;
    }

    public void UnlockNextMission() {
        if (globalMorality >= 50 && factionTrust["Echo Ascendants"] > 60)
            MissionLoader.Load("Operation: Dawn Accord");
        else if (globalMorality < 0)
            MissionLoader.Load("Operation: Echo Collapse");
        else
            MissionLoader.Load("Operation: Grey Protocol");
    }
}

public void PlayEpilogueTheme() {
    if (globalMorality > 75)
        AudioManager.Play("theme_hope_rising");
    else if (globalMorality < -50)
        AudioManager.Play("theme_twilight_war");
    else
        AudioManager.Play("theme_fragile_peace");
}

