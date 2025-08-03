if (PlayerEnteringZone && CoverAvailable) {
    EnemyGroup.PrepareAmbush(position: chokepoint, formation: flanking);
    TriggerCinematic("AmbushSetup");
}

Enemy.SendInterceptedRadio("FalseExtractionPoint");
PlayerMap.Update(marker: "Evac Alpha", status: verified=false);

if (CivilianDetectedInZone && PlayerWeaponDrawn) {
    EnemyDisengage();  // AI uses civilian density to mask retreat
    MoralityTracker.Update("Risking Collateral Damage");
}

if (IntelLeakDetected) {
    EnemySwitchObjective();  // AI fakes its own retreat or mission path
    DeploySniperOnTrueObjective();
}

if (PlayerEnteringZone && CoverAvailable) {
    EnemyGroup.PrepareAmbush(position: chokepoint, formation: flanking);
    TriggerCinematic("AmbushSetup");
}

Enemy.SendInterceptedRadio("FalseExtractionPoint");
PlayerMap.Update(marker: "Evac Alpha", status: verified=false);

if (CivilianDetectedInZone && PlayerWeaponDrawn) {
    EnemyDisengage();  // AI uses civilian density to mask retreat
    MoralityTracker.Update("Risking Collateral Damage");
}

public void EvaluatePlayerAction(string actionType, bool riskToCivilians)
{
    switch (actionType)
    {
        case "DeceptiveIntel":
            MoralityScore -= 5;
            break;
        case "RescueNeutralUnit":
            MoralityScore += 10;
            FactionTrustLevel["Echo Ascendants"] += 15;
            break;
        case "AggressiveFire":
            if (riskToCivilians) CiviliansImpactIndex++;
            MoralityScore -= 10;
            break;
    }
    UpdateHUDMoralityBar(MoralityScore);
}

public void DetermineCombatResponse(UnitAI unit) {
    switch (unit.psychologyTrait) {
        case TraitType.Aggression:
            unit.Attack(aggressive:true, flankCoverage:false);
            break;
        case TraitType.Paranoia:
            unit.ScanAllZones();
            unit.TriggerAlertIf("ShadowMovement");
            break;
        case TraitType.Calculating:
            unit.SetTrap();
            unit.CallFakeBackup();
            break;
    }
}



