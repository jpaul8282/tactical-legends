@startuml
  title Tactical Legend Class Diagram: VaultItem Structure

class VaultItem {
  - fruit: String
  - size: String
  - color: List<String>
}

class Relic extends VaultItem {
  + activate()
  + syncWithVault()
}

class Gear extends VaultItem {
  + equip()
  + boostStats()
}

object SampleItem {
  fruit = "Apple"
  size = "Large"
  color = ["Red", "Green"]
}

VaultItem <|-- Relic
VaultItem <|-- Gear
SampleItem --> VaultItem: instance of

@endulm
