Mission: Rescue Civilians from Neutral Zone

Choice A: Stealth Extraction (low risk, high morality)
Choice B: Direct Fire w/ Collateral Risk (fast, low morality)

Outcome: Civilians die ➝ Morality –15 ➝ Faction “Echo Ascendants” revoke support ➝ AI traits evolve:
- Surviving units develop Paranoia
- Next encounter triggers Fear Meter early

public enum TraitType { Desensitized, Protective, Paranoid, Ruthless }

public class UnitAI : MonoBehaviour {
    public TraitType psychologyTrait;
    public bool isIsolated;
    public bool nearCivilians;
    public bool isSquadmate;
    public bool isCiviliansSaved;
    public string unitName;

    void UpdateBehavior() {
        switch (psychologyTrait) {
            case TraitType.Desensitized:
                if (isIsolated) TriggerFearWave();
                if (nearCivilians) EngageRelentlessly();
                break;
            case TraitType.Protective:
                if (nearCivilians) FormHumanShield();
                break;
            case TraitType.Paranoid:
                if (DetectStealth()) MisfireRandomly();
                break;
        }
    }

    void TriggerFearWave() { /* make unit erratic, panic, or retreat */ }
    void EngageRelentlessly() { /* ignore collateral damage */ }
    void FormHumanShield() { /* draw fire away from civilians */ }
    void MisfireRandomly() { /* friendly fire event */ }
    bool DetectStealth() => Random.value < 0.3f;  // Simulate paranoia trigger
}

public class Squadmate {
    public string name;
    public TraitType trait;
    public bool civiliansSaved;
    public bool squadmateDead;
    
    public void ReactToMissionOutcome() {
        if (name == "Vera" && !civiliansSaved) trait = TraitType.Paranoid;
        if (name == "Kane" && squadmateDead) trait = TraitType.Ruthless;
    }

    public string GetDialogue() {
        if (name == "Vera" && trait == TraitType.Protective) return "There are kids in that dome. I’ll die before I leave them.";
        if (name == "Kane" && trait == TraitType.Desensitized) return "This zone’s lost. We take the killshot and move.";
        return "…";
    }
}

public class MoralitySystem {
    public int MoralityScore = 0;
    public int BondingIndex = 0;

    public void CiviliansSaved(bool saved) {
        if (saved) {
            MoralityScore += 15;
            BondingIndex += 20;
        } else {
            MoralityScore -= 20;
        }
    }

    public void AdjustSquadmateLoyalty(string name, bool ignored) {
        if (name == "Kane" && ignored) {
            // Loyalty drop logic
        }
    }
}

void MissionOutcome(bool civiliansSaved, bool squadmateDead) {
    moralitySystem.CiviliansSaved(civiliansSaved);
    vera.civiliansSaved = civiliansSaved;
    kane.squadmateDead = squadmateDead;
    vera.ReactToMissionOutcome();
    kane.ReactToMissionOutcome();
    ShowDialogue(vera.GetDialogue());
    ShowDialogue(kane.GetDialogue());
}

public enum EndingType { Heroic, Pragmatic, Ruthless }

public class MissionEndingManager : MonoBehaviour {
    public int MoralityScore;
    public int CiviliansSaved;
    public int SquadmatesAlive;

    public EndingType DetermineEnding() {
        if (MoralityScore >= 50 && CiviliansSaved >= 10 && SquadmatesAlive >= 2)
            return EndingType.Heroic;
        else if (MoralityScore >= 0 && CiviliansSaved > 0)
            return EndingType.Pragmatic;
        else
            return EndingType.Ruthless;
    }

    public void TriggerEnding(EndingType ending) {
        switch (ending) {
            case EndingType.Heroic:
                ShowCinematic("Echo Ascendants salute your bravery. Refugees chant your name.");
                PlayAudio("heroic_theme");
                break;
            case EndingType.Pragmatic:
                ShowCinematic("The zone is quiet. You saved some. Others haunt the silence.");
                PlayAudio("pragmatic_theme");
                break;
            case EndingType.Ruthless:
                ShowCinematic("Iron Veil marches on ash. Vera's silence cuts deeper than Kane's rage.");
                PlayAudio("ruthless_theme");
                break;
        }
    }

    void ShowCinematic(string narrativeText) {
        UIManager.ShowText(narrativeText);
        CutsceneManager.PlayFinalScene();
    }

    void PlayAudio(string trackName) {
        AudioManager.Play(trackName);
    }
}

public void ApplyPsychologicalChanges(Squadmate vera, Squadmate kane, bool civiliansDied, bool squadmateLost) {
    if (civiliansDied) vera.trait = TraitType.Paranoid;
    if (squadmateLost) kane.trait = TraitType.Ruthless;

    // Log aftermath traits for future missions
    CampaignState.UpdateSquadTrait("Vera", vera.trait);
    CampaignState.UpdateSquadTrait("Kane", kane.trait);
}

