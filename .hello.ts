// hello.ts

// Simulate a Tactical Legends character
interface Character {
  codename: string;
  specialization: string;
  gear: string[];
}

// Create a sample character
const oistarian: Character = {
  codename: "OISTARIAN",
  specialization: "Emotional Recon Specialist",
  gear: ["Whisper & Roar", "NeuroPulse Arm Module"]
};

// Greet the character
function greet(character: Character): string {
  return `Hello, ${character.codename}! Ready for your mission as a ${character.specialization}?`;
}

// Display gear
function showGear(character: Character): void {
  console.log(`${character.codename}'s gear includes:`);
  character.gear.forEach(item => console.log(`- ${item}`));
}

// Run the demo
console.log(greet(oistarian));
showGear(oistarian);

