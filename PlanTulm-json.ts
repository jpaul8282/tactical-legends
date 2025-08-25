@startjson
{
  "callSign": "Echo-27",
  "fullName": {
    "first": "John",
    "last": "Smith"
  },
  "status": "Active",
  "age": 27,
  "faction": "Oistarian Vanguard",
  "rank": "Field Operative",
  "location": {
    "sector": "Eden-Prime",
    "coordinates": {
      "x": 21,
      "y": 2
    },
    "zone": "New York Outpost",
    "region": "Vault District"
  },
  "comms": [
    {
      "channel": "home",
      "frequency": "212-555-1234"
    },
    {
      "channel": "command",
      "frequency": "646-555-4567"
    }
  ],
  "abilities": [
    "Echo Pulse",
    "Vault Phase",
    "Tactical Recall"
  ],
  "morale": 78,
  "missionHistory": [
    {
      "title": "Surge Protocol Recovery",
      "outcome": "Success",
      "location": "Vault Corridor 3A"
    },
    {
      "title": "Oistarian Relic Defense",
      "outcome": "Partial",
      "location": "Shattered Spires"
    }
  ],
  "relations": {
    "spouse": null,
    "descendants": []
  }
}

@endjson


  @startjson
{
"Numeric": [1, 2, 3],
"String ": ["v1a", "v2b", "v3c"],
"Boolean": [true, false, true]
}
@endjson

  @startjson
[1, 2, 3]
@endjson

  @startjson
["1a", "2b", "3c"]
@endjson

  @startjson
[true, false, true]
@endjson

  @startjson
{
"DecimalNumber": [-1, 0, 1],
"DecimalNumber. Digits": [-1.1, 0.1, 1.1],
"DecimalNumber ExponentPart": [1E5]
}
@endjson
root {
  FontName SansSerif
  HyperLinkColor red
  FontColor green
  FontSize 19
  FontStyle plain
  HorizontalAlignment left
  RoundCorner 15
  DiagonalCorner 0
  LineColor #3600A8
  LineThickness 4
  BackGroundColor #AAA
  Shadowing 0.0
}

stereotype {
  FontColor blue
  FontSize 8
  FontStyle bold
}

title {
  HorizontalAlignment right
  FontSize 24
  FontColor blue
}

header {
  HorizontalAlignment center
  FontSize 26
  FontColor purple
}

footer {
  HorizontalAlignment left
  FontSize 28
  FontColor red
}

legend {
  FontSize 30
  BackGroundColor yellow
  Margin 30
  Padding 50
}

caption {
  FontSize 32
}


element {
  BackGroundColor #CEFEFE
}

sequenceDiagram {
}

classDiagram {
}

activityDiagram {
}


group {
  LineThickness 3.5
  BackGroundColor MistyRose
  LineColor DarkOrange
  
  FontSize 12
  FontStyle italic
  FontColor red
}

groupHeader {
  BackGroundColor tan
  LineThickness 0.5
  LineColor yellow

  FontSize 18
  FontStyle bold
  FontColor blue
}

lifeLine {
  BackGroundColor gold
}

destroy {
  LineColor red
}

reference {
  LineColor red
  FontSize 10
  FontStyle bold
  FontColor blue
  BackGroundColor gold
  HorizontalAlignment right
}

box {
  LineThickness 4
  LineColor FireBrick
  BackGroundColor PowderBlue

  FontSize 12
  FontStyle italic
  FontColor Maroon
}

separator {
  LineColor red
  BackGroundColor green
  
  FontSize 16
  FontStyle bold
  FontColor white
}

delay {
  FontSize 22
  FontStyle italic
}

newpage {
  Linecolor fuchsia
}

participant {
  LineThickness 4
}

actor {
  LineThickness 4
}

boundary {
  LineThickness 4
}

control {
  LineThickness 4
}

entity {
  LineThickness 4
}

queue {
  LineThickness 4
}

database {
  LineThickness 4
}

collections {
  LineThickness 4
}

arrow {
  FontSize 13
  LineColor Lime
}

note {
  BackGroundColor GoldenRod
}

diamond {
}

swimlane {
}

activity {
  BackgroundColor #33668E
  BorderColor #33668E
  FontColor #888
  FontName arial
}


activityDiagram {
	diamond {
	  BackgroundColor #dae4f1
	  BorderColor #33668E
	  FontColor red
	  FontName arial
	  FontSize 5
	}
	arrow {
	  FontColor gold
	  FontName arial
	  FontSize 15
	}
	partition {
	  LineColor red
	  FontColor green
	  RoundCorner 30
	  BackColor PeachPuff
	}
	note {
	  FontColor Blue
	  LineColor yellow
	}
}

circle {
  LineColor yellow
}

activityBar {
  LineColor lightGreen
}

mindmapDiagram {
    Padding 10
    Margin 10
}

node {
}
