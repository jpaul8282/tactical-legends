using UnityEngine;

public enum WeaponType { Rifle, Pistol, Sniper, SMG, Shotgun, RocketLauncher, Knife, Grenade, Drone, EMP, NightVision, Flashbang }

[System.Serializable]
public class Weapon
{
    public string Name;
    public WeaponType Type;
    public int Damage;
    public int AmmoCapacity;
    public float ReloadTime;
    public float Range;
    public bool IsGadget;
    public string GadgetEffect; // For gadgets: EMP disables electronics, NightVision gives vision, etc.
}