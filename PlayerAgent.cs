using UnityEngine;

public class PlayerAgent : MonoBehaviour
{
    public string AgentName = "Oistarian";
    public int Health = 100;
    public int Armor = 50;
    public Weapon CurrentWeapon;
    public Inventory Inventory;

    public void TakeDamage(int amount)
    {
        int remaining = amount - Armor;
        Armor = Mathf.Max(0, Armor - amount);
        if (remaining > 0)
            Health -= remaining;

        if (Health <= 0)
            Die();
    }

    public void Die()
    {
        Debug.Log("Agent down! Mission failed.");
        // Trigger respawn or game over
    }

    public void AddReward(int amount)
    {
        Inventory.AddCredits(amount);
    }
}