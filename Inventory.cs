using System.Collections.Generic;
using UnityEngine;

public class Inventory : MonoBehaviour
{
    public List<Weapon> Weapons = new List<Weapon>();
    public int Credits = 0;
    public List<string> RewardItems = new List<string>();

    public void AddWeapon(Weapon weapon)
    {
        Weapons.Add(weapon);
    }

    public void AddGadget(Weapon gadget)
    {
        if (gadget.IsGadget) Weapons.Add(gadget);
    }

    public void AddCredits(int amount)
    {
        Credits += amount;
    }

    public void AddRewardItem(string item)
    {
        RewardItems.Add(item);
    }
}