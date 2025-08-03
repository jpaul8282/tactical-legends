public class RankedManager : MonoBehaviour
{
    public enum DivisionRank { Recruit, Operative, Cipher, Infiltrator, Phantom, Eclipse }
    public DivisionRank currentRank;
    public int intelRating = 0;
    public int weeklyWins = 0;

    void StartMatch(string mapName)
    {
        LoadMission(mapName);
        CalculateIntelPoints();
    }

    void CalculateIntelPoints()
    {
        // Points based on stealth kills, no-alert wins, and intel capture
        int stealthScore = PlayerStats.stealthKills * 10;
        int alertBonus = PlayerStats.noAlertVictory ? 50 : 0;
        int codeSnatch = PlayerStats.dataCapsulesCollected * 20;

        intelRating += stealthScore + alertBonus + codeSnatch;
        UpdateRank();
    }

    void UpdateRank()
    {
        if (intelRating >= 1000) currentRank = DivisionRank.Infiltrator;
        if (intelRating >= 2000) currentRank = DivisionRank.Phantom;
        if (intelRating >= 3000) currentRank = DivisionRank.Eclipse;
    }
}

{
  "week_32": [
    "MarsVaultExtraction",
    "SubmarineSabotage",
    "ZeroGravityHack",
    "CraterOutpostInfiltration"
  ]
}

{
  "season_id": "S07_CosmicCipher",
  "rank_rewards": {
    "Recruit": "Encrypted Spray",
    "Cipher": "Animated Cloak Skin",
    "Eclipse": "Cosmic Camo & Dossier Unlock"
  }
}

public enum FactionPool { CryoSyndicate, SolarVultures, VoidParade, DuneScour }

public class FactionDraft : MonoBehaviour
{
    public FactionPool selectedFaction;

    public void DraftFaction(FactionPool faction)
    {
        selectedFaction = faction;
        ActivateFactionPerks(faction);
    }

    void ActivateFactionPerks(FactionPool faction)
    {
        // Assign custom perks per faction
        switch (faction)
        {
            case FactionPool.CryoSyndicate:
                PlayerStats.freezeResistance = 100;
                break;
            case FactionPool.SolarVultures:
                PlayerStats.glareVision = true;
                break;
        }
    }
}

public void TriggerWildcardEvent(string roundStage)
{
    if (roundStage == "QuarterFinals")
        SpawnMeteorStorm();
    else if (roundStage == "Semis")
        ActivateAIRebellion();
}

public class EchoCoopController : MonoBehaviour
{
    public float trustMeter = 50f;

    void SyncActions(Player one, Player two)
    {
        if (!AreCommandsSynchronized(one, two))
        {
            trustMeter -= 10;
            AdjustEndingPath();
        }
    }

    bool AreCommandsSynchronized(Player one, Player two)
    {
        return one.lastCommand == two.lastCommand;
    }

    void AdjustEndingPath()
    {
        if (trustMeter < 30)
            MissionManager.LoadEnding("BetrayalBranch");
        else
            MissionManager.LoadEnding("UnifiedEscape");
    }
}

public class MutatorController : MonoBehaviour
{
    public enum MutatorType { GravityReversal, InvisibleMovement, ShapeShiftAvatars, TimeDilation }

    public void ActivateMutator(MutatorType type)
    {
        switch (type)
        {
            case MutatorType.GravityReversal:
                Physics.gravity = new Vector3(0, 9.81f, 0);
                break;
            case MutatorType.InvisibleMovement:
                PlayerStats.isInvisibleWhileMoving = true;
                break;
        }
    }
}

{
  "week_33_mutators": ["TimeDilation", "ShapeShiftAvatars"]
}

