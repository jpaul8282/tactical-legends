@startuml
title Tactical Legend: Interface Interaction Example

' Define interfaces
interface RelicFusionEngine
interface FactionalModifier

' Connect interfaces
RelicFusionEngine --> FactionalModifier: uses

' Add a label/comment
Note the right of RelicFusionEngine
  // Interface example for Tactical Legend //
end note

@enduml

