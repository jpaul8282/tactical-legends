public class Main {
    public static void main(String[] args) {
        System.out.println("=======================================");
        System. out.println("  Welcome to Tactical Legends");
        System. out.println("     Rise of the Oistarian");
        System.out.println("=======================================");
        System .out.println("Prepare to command elite squads, forge relics, and shape the fate of Oistaria.");
        System.out.println();

        System. out.println("Initializing battlefield simulation...");
        for (int i = 1; i <= 5; ++i) {
            System. out.println("Loading unit " + i + "...");
            try {
                Thread.sleep(500); // Simulate loading delay
            } catch (InterruptedException e) {
                System. out.println("Initialization interrupted.");
            }
        }

        System.out.println("\nAll units deployed. Tactical systems online.");
        System. out.println("Let the legend begin...");
    }
}
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("=======================================");
        System.out.println("  Welcome to Tactical Legends");
        System.out.println("     Rise of the Oistarian");
        System.out.println("=======================================");
        System.out.println("Prepare to command elite squads, forge relics, and shape the fate of Oistaria.\n");

        System.out.println("Initializing battlefield simulation...");
        for (int i = 1; i <= 5; ++i) {
            System.out.println("Loading unit " + i + "...");
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                System.out.println("Initialization interrupted.");
            }
        }

        System.out.println("\nAll units deployed. Tactical systems online.\n");

        // Squad selection
        System.out.println("Choose your squad:");
        System.out.println("1. Sand Reapers – Stealth and sabotage");
        System.out.println("2. Stormfront Directive – Heavy armor and brute force");
        System.out.println("3. EchoCore Vanguard – Balanced tactics and relic fusion");

        System.out.print("Enter squad number (1-3): ");
        int squadChoice = input.nextInt();
        input.nextLine(); // consume newline

        String squadName = switch (squadChoice) {
            case 1 -> "Sand Reapers";
            case 2 -> "Stormfront Directive";
            case 3 -> "EchoCore Vanguard";
            default -> "Unknown Operatives";
        };

        System.out.println("\nYou have selected: " + squadName);

        // Mission briefing
        System.out.println("\nMission Briefing:");
        System.out.println("Operation: Sand Echo");
        System.out.println("Objective: Recover the Surge Beacon relic and neutralize hostile patrols.");
        System.out.println("Conditions: Nightfall, low visibility, enemy reinforcements expected.\n");

        // Relic crafting
        System. out.println("Relic Crafting Console:");
        System .out.println("Available components: EchoCore, Eden Alloy");
        System .out.print("Combine two components to forge a relic (e.g., EchoCore + Eden Alloy): ");
        String recipe = input.nextLine();

        if (recipe.toLowerCase().contains("echocore") && recipe.toLowerCase().contains("eden alloy")) {
            System. out.println("Relic forged: Surge Beacon – Grants tactical vision and morale boost.");
        } else {
            System .out.println("Invalid combination. No relic forged.");
        }

        // Codex entry
        System.out.println("\nCodex Entry: Surge Beacon");
        System. out.println("An ancient tactical relic used by the Vanguard to illuminate enemy positions and inspire allied forces.");
        System. out.println("Recovered from the ruins of Oistaria during Operation Sand Echo.\n");

        System. out.println("Good luck, Commander. The legend begins now...");
        input.close();
    }
}
import java.util.Random;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        Random rng = new Random();

        System.out.println("=======================================");
        System.out.println("  Welcome to Tactical Legends");
        System.out.println("     Rise of the Oistarian");
        System.out.println("=======================================");
        System.out.println("Prepare to command elite squads, forge relics, and shape the fate of Oistaria.\n");

        // Squad selection
        System.out.println("Choose your squad:");
        System.out.println("1. Sand Reapers – Stealth and sabotage");
        System.out.println("2. Stormfront Directive – Heavy armor and brute force");
        System.out.println("3. EchoCore Vanguard – Balanced tactics and relic fusion");
        System.out.print("Enter squad number (1-3): ");
        int squadChoice = input.nextInt();
        input.nextLine(); // consume newline

        String squadName = switch (squadChoice) {
            case 1 -> "Sand Reapers";
            case 2 -> "Stormfront Directive";
            case 3 -> "EchoCore Vanguard";
            default -> "Unknown Operatives";
        };

        System.out.println("\nYou have selected: " + squadName);
        System.out.println("Mission: Recover the Surge Beacon relic from hostile territory.\n");

        // Battle setup
        int playerHP = 100;
        int enemyHP = 100;
        System. out.println("Battle begins! Your squad vs. Enemy Patrol\n");

        while (playerHP > 0 && enemyHP > 0) {
            System .out.println("Your HP: " + playerHP + " | Enemy HP: " + enemyHP);
            System .out.println("Choose your action:");
            System.out.println("1. Attack");
            System.out.println("2. Defend");
            System.out.println("3. Use Relic (Surge Beacon)");

            int action = input.nextInt();
            int damageToEnemy = 0;
            int damageToPlayer = rng.nextInt(15) + 5;

            switch (action) {
                case 1 -> {
                    damageToEnemy = rng.nextInt(20) + 10;
                    System.out.println("You strike the enemy for " + damageToEnemy + " damage!");
                }
                case 2 -> {
                    damageToPlayer /= 2;
                    System. out.println("You brace for impact. Incoming damage reduced.");
                }
                case 3 -> {
                    damageToEnemy = 30;
                    System. out.println("You activate the Surge Beacon! Tactical strike deals " + damageToEnemy + " damage.");
                }
                default -> System. out.println("Invalid action. You hesitate...");
            }

            enemyHP -= damageToEnemy;
            playerHP -= damageToPlayer;
            System.out.println("Enemy retaliates for " + damageToPlayer + " damage.\n");
        }

        if (playerHP > 0) {
            System. out.println("Victory! The Surge Beacon is secured. Oistaria rises again.");
        } else {
            System .out.println("Defeat... Your squad has fallen. The legend ends here.");
        }

        input.close();
    }
}
import java.util.Random;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        Random rng = new Random();

        // Squad setup
        String squadName = "EchoCore Vanguard";
        int squadLevel = 1;
        int squadXP = 0;
        int playerHP = 100;
        int enemyHP = 100;

        System.out.println("Welcome back, Commander.");
        System.out.println("Squad: " + squadName + " | Level: " + squadLevel + " | XP: " + squadXP);
        System.out.println("Mission: Defend the Surge Beacon relic.\n");

        // Battle loop
        while (playerHP > 0 && enemyHP > 0) {
            System.out.println("Your HP: " + playerHP + " | Enemy HP: " + enemyHP);
            System.out.println("Choose your action:");
            System.out.println("1. Tactical Strike");
            System.out.println("2. Defensive Maneuver");
            System.out.println("3. Use Relic");

            int action = input.nextInt();
            int damageToEnemy = 0;
            int damageToPlayer = rng.nextInt(15) + 5;

            switch (action) {
                case 1 -> {
                    damageToEnemy = rng.nextInt(20) + 10;
                    System. out.println("You strike for " + damageToEnemy + " damage!");
                }
                case 2 -> {
                    damageToPlayer /= 2;
                    System .out.println("You defend. Incoming damage reduced.");
                }
                case 3 -> {
                    damageToEnemy = 30;
                    System .out.println("Surge Beacon activated! Enemy takes " + damageToEnemy + " damage.");
                }
                default -> System. out.println("Invalid action. You hesitate...");
            }

            enemyHP -= damageToEnemy;
            playerHP -= damageToPlayer;
            System.out.println("Enemy retaliates for " + damageToPlayer + " damage.\n");
        }

        // Outcome
        if (playerHP > 0) {
            System. out.println("Victory! Surge Beacon secured.");
            int earnedXP = rng.nextInt(50) + 50;
            squadXP += earnedXP;
            System .out.println("XP earned: " + earnedXP);
            if (squadXP >= 100) {
                squadLevel++;
                squadXP -= 100;
                System .out.println("Level up! Your squad is now Level " + squadLevel);
            }
        } else {
            System. out.println("Defeat... The relic is lost.");
        }

        // Save simulation
        System.out.println("\nSaving progress...");
        System. out.println("Squad: " + squadName);
        System. out.println("Level: " + squadLevel);
        System .out.println("XP: " + squadXP);
        System. out.println("Progress saved. See you next mission, Commander.");

        input.close();
    }
}
import java.util.*;

class SquadMember {
    String name;
    int hp;
    int level;
    List<String> gear;

    public SquadMember(String name, int level) {
        this.name = name;
        this.level = level;
        this.hp = 100 + (level * 10);
        this.gear = new ArrayList<>();
    }

    public void addGear(String item) {
        gear.add(item);
    }

    public void displayStatus() {
        System.out.println(name + " | HP: " + hp + " | Level: " + level);
        System.out.println("Gear: " + (gear.isEmpty() ? "None" : String.join(", ", gear)));
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("Welcome to Tactical Legends: Rise of the Oistarian\n");

        // Create squad roster
        List<SquadMember> squad = new ArrayList<>();
        squad.add(new SquadMember("Commander Arin", 3));
        squad.add(new SquadMember("Scout Nyra", 2));
        squad.add(new SquadMember("Heavy Drax", 4));

        // Gear inventory
        Map<String, String> gearOptions = new HashMap<>();
        gearOptions.put("1", "EchoCore Blade");
        gearOptions.put("2", "Eden Alloy Shield");
        gearOptions.put("3", "Surge Beacon Relic");

        System. out.println("Assign gear to your squad:");
        for (SquadMember member: squad) {
            member.displayStatus();
            System. out.println("Choose gear for " + member.name + ":");
            for (Map.Entry<String, String> entry : gearOptions.entrySet()) {
                System.out.println(entry.getKey() + ". " + entry.getValue());
            }
            System.out.print("Enter gear number: ");
            String choice = input.nextLine();
            String selectedGear = gearOptions.getOrDefault(choice, "Basic Armor");
            member.addGear(selectedGear);
            System.out.println(member.name + " equipped with " + selectedGear + "\n");
        }

        // Display full squad
        System. out.println("Final Squad Loadout:");
        for (SquadMember member: squad) {
            member.displayStatus();
            System.out.println();
        }

        System. out.println("Mission ready. Launching Operation Sand Echo...");
        input.close();
    }
}
