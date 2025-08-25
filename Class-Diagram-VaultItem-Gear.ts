VaultItem <|-- Gear
VaultItem <|-- Relic
VaultItem <|-- Consumable

SquadMember --> Loadout
Loadout --> Gear
Loadout --> Relic
Inventory --> VaultItem
public class VaultItem
{
    public string itemName;
    public string itemType; // Gear, Relic, Consumable
    public string rarity;   // Common, Rare, Legendary
    public string[] tags;   // e.g. ["Vaultborn", "Psychic", "Heavy"]

    public VaultItem(string name, string type, string rarity, string[] tags)
    {
        itemName = name;
        itemType = type;
        this.rarity = rarity;
        this.tags = tags;
    }
}

public class Gear : VaultItem
{
    public int defenseBoost;
    public int attackBoost;
    public string slot; // Head, Chest, Weapon

    public Gear(string name, string rarity, string[] tags, int def, int atk, string slot)
        : base(name, "Gear", rarity, tags)
    {
        defenseBoost = def;
        attackBoost = atk;
        this.slot = slot;
    }
}

Relic
public class Relic : VaultItem
{
    public string ability;
    public bool isActivated;

    public Relic(string name, string rarity, string[] tags, string ability)
        : base(name, "Relic", rarity, tags)
    {
        this.ability = ability;
        isActivated = false;
    }

    public void Activate()
    {
        isActivated = true;
        Debug.Log($"{itemName} activated: {ability}");
    }
}

Loadout
public class Loadout
{
    public Gear headGear;
    public Gear chestGear;
    public Gear weapon;
    public Relic equippedRelic;

    public Loadout(Gear head, Gear chest, Gear weapon, Relic relic)
    {
        headGear = head;
        chestGear = chest;
        this.weapon = weapon;
        equippedRelic = relic;
    }

    public void DisplayLoadout()
    {
        Debug.Log($"Head: {headGear.itemName}, Chest: {chestGear.itemName}, Weapon: {weapon.itemName}, Relic: {equippedRelic.itemName}");
    }
}

SquadMember
public class SquadMember
{
    public string callSign;
    public string name;
    public string faction;
    public int morale;
    public string status;
    public Loadout loadout;

    public SquadMember(string callSign, string name, string faction, int morale, string status, Loadout loadout)
    {
        this.callSign = callSign;
        this.name = name;
        this.faction = faction;
        this.morale = morale;
        this.status = status;
        this.loadout = loadout;
    }

    public void DisplayStatus()
    {
        Debug.Log($"{callSign} - {name} | Faction: {faction} | Morale: {morale} | Status: {status}");
        loadout.DisplayLoadout();
    }
}

Inventory
using System.Collections.Generic;

public class Inventory
{
    public List<VaultItem> items = new List<VaultItem>();

    public void AddItem(VaultItem item)
    {
        items.Add(item);
        Debug.Log($"Added {item.itemName} to inventory.");
    }

    public void ListItems()
    {
        foreach (var item in items)
        {
            Debug.Log($"{item.itemName} ({item.itemType}) - {item.rarity}");
        }
    }
}

void Start()
{
    Gear helmet = new Gear("Echo Visor", "Rare", new[] { "Oistarian" }, 10, 0, "Head");
    Gear armor = new Gear("Vaultborn Plate", "Legendary", new[] { "Vaultborn" }, 25, 5, "Chest");
    Gear weapon = new Gear("Neuro Dagger", "Epic", new[] { "Psychic" }, 0, 20, "Weapon");
    Relic relic = new Relic("Surge Beacon", "Legendary", new[] { "Eden Core" }, "Stabilize Echo Storm");

    Loadout echoLoadout = new Loadout(helmet, armor, weapon, relic);
    SquadMember echo27 = new SquadMember("Echo-27", "John Smith", "Oistarian Vanguard", 78, "Active", echoLoadout);

    echo27.DisplayStatus();
}

CraftingMaterial
public class CraftingMaterial
{
    public string materialName;
    public string rarity;
    public string originFaction;

    public CraftingMaterial(string name, string rarity, string originFaction)
    {
        materialName = name;
        this.rarity = rarity;
        this.originFaction = originFaction;
    }
}

using System.Collections.Generic;

public class CraftingRecipe
{
    public string resultItemName;
    public string resultType; // Gear, Relic, Consumable
    public List<string> requiredMaterials;

    public CraftingRecipe(string resultItemName, string resultType, List<string> requiredMaterials)
    {
        this.resultItemName = resultItemName;
        this.resultType = resultType;
        this.requiredMaterials = requiredMaterials;
    }

    public bool CanCraft(List<CraftingMaterial> inventoryMaterials)
    {
        var materialNames = inventoryMaterials.Select(m => m.materialName).ToList();
        return requiredMaterials.All(req => materialNames.Contains(req));
    }
}

CraftingManager
public class CraftingManager
{
    public List<CraftingRecipe> knownRecipes = new List<CraftingRecipe>();

    public VaultItem CraftItem(CraftingRecipe recipe, List<CraftingMaterial> materials)
    {
        if (!recipe.CanCraft(materials)) return null;

        // Example: crafting a Gear item
        if (recipe.resultType == "Gear")
        {
            return new Gear(recipe.resultItemName, "Crafted", new[] { "Custom" }, 10, 10, "Weapon");
        }

        // Extend for Relic, Consumable, etc.
        return null;
    }
}

GearFusionManager
public class GearFusionManager
{
    public Gear Fuse(Gear gearA, Gear gearB)
    {
        string fusedName = $"{gearA.itemName}-{gearB.itemName}";
        int fusedDefense = (gearA.defenseBoost + gearB.defenseBoost) / 2 + 5;
        int fusedAttack = (gearA.attackBoost + gearB.attackBoost) / 2 + 5;
        string fusedSlot = gearA.slot == gearB.slot ? gearA.slot: "Hybrid";

        string[] fusedTags = gearA.tags.Concat(gearB.tags).Distinct().ToArray();

        return new Gear(fusedName, "Fused", fusedTags, fusedDefense, fusedAttack, fusedSlot);
    }
}

FactionBonus
public class FactionBonus
{
    public string factionName;
    public int attackBoost;
    public int defenseBoost;
    public string specialTrait;

    public FactionBonus(string name, int atk, int def, string trait)
    {
        factionName = name;
        attackBoost = atk;
        defenseBoost = def;
        specialTrait = trait;
    }

    public void ApplyToGear(Gear gear)
    {
        gear.attackBoost += attackBoost;
        gear.defenseBoost += defenseBoost;
        gear.tags = gear.tags.Append(specialTrait).ToArray();
    }
}

FactionRegistry
public static class FactionRegistry
{
    public static Dictionary<string, FactionBonus> bonuses = new Dictionary<string, FactionBonus>
    {
        { "Vaultborn", new FactionBonus("Vaultborn", 5, 10, "EchoShield") },
        { "Oistarian", new FactionBonus("Oistarian", 10, 5, "NeuroStrike") },
        { "Eden Core", new FactionBonus("Eden Core", 7, 7, "StormSurge") }
    };
}

Gear blade = new Gear("Neuro Blade", "Rare", new[] { "Psychic" }, 15, 25, "Weapon");
Gear shield = new Gear("Echo Shield", "Rare", new[] { "Vaultborn" }, 30, 5, "Chest");

GearFusionManager fusionManager = new GearFusionManager();
Gear fusedGear = fusionManager.Fuse(blade, shield);

FactionBonus vaultbornBonus = FactionRegistry.bonuses["Vaultborn"];
vaultbornBonus.ApplyToGear(fusedGear);

Debug.Log($"Fused Gear: {fusedGear.itemName} | ATK: {fusedGear.attackBoost} | DEF: {fusedGear.defenseBoost}");

