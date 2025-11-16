public class Main {
    public static void main(String[] args) {
        System.out.println("=======================================");
        System. out.println("  Welcome to Tactical Legends");
        System. out.println("     Rise of the Oistarian");
        System.out.println("=======================================");
        System .out.println("Prepare to command elite squads, forge relics, and shape the fate of Oistaria.");
        System.out.println();

        System .out.println("Initializing battlefield simulation...");
        for (int i = 1; i <= 5; ++i) {
            System. out.println("Loading unit " + i + "...");
            try {
                Thread.sleep(500); // Simulate loading delay
            } catch (InterruptedException e) {
                System .out.println("Initialization interrupted.");
            }
        }

        System.out.println("\nAll units deployed. Tactical systems online.");
        System. out.println("Let the legend begin...");
    }
}

