using UnityEngine;

public enum WeaponType { Rifle, Pistol, Sniper, SMG, Shotgun }

[System.Serializable]
public class Weapon
{
    public string Name;
    public WeaponType Type;
    public int Damage;
    public int AmmoCapacity;
    public float ReloadTime;
    public float Range;
}