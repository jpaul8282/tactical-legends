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

SkinParam BackgroundColor #white
SkinParam Shadowing false
SkinParam SequenceMessageAlign center
SkinParam DefaultFontName Arial
SkinParam DefaultFontStyle bold
SkinParam DefaultFontColor #333333

SkinParam NoteBackgroundColor #fbfb77
SkinParam NoteBorderColor #cbcb47

SkinParam NoteBackgroundColor #ffffcd
SkinParam NoteBorderColor #a9a980
SkinParam NoteFontColor #676735
SkinParam NoteFontStyle italic

SkinParam SequenceArrowColor #555555
SkinParam SequenceArrowFontColor #555555
SkinParam SequenceArrowFontStyle none

SkinParam SequenceBoxBackgroundColor #fafafa
SkinParam SequenceBoxBorderColor #eeeeee
SkinParam SequenceBoxFontColor #666666
SkinParam SequenceBoxFontSize 12
SkinParam SequenceBoxFontStyle italic

SkinParam ParticipantBackgroundColor #dde5ff
SkinParam ParticipantBorderColor #cccccc
SkinParam ParticipantFontColor #333333
SkinParam ParticipantFontStyle bold

SkinParam DatabaseBackgroundColor #df4646
SkinParam DatabaseFontColor #red
SkinParam DatabaseFontStyle bold

SkinParam EntityBackgroundColor #999999

SkinParam SequenceLifeLineBorderColor #bbbbbb
root {
  Shadowing 0.0
}
element {
  Shadowing 0.0
}
root {
  --common-background: #f1f1f1;
  --note-background: #FEFFDD;
  --grey-blue: #e2e2f0;

  FontName SansSerif
  HyperLinkColor blue
  HyperLinkUnderlineThickness 1
  FontColor black
  FontSize 14
  FontStyle plain
  HorizontalAlignment left
  RoundCorner 0
  DiagonalCorner 0
  LineThickness 1.0
  LineColor #181818
  BackGroundColor: var(--common-background);
  Shadowing: 0.0;
}

document {
  BackGroundColor white
  header {
    HorizontalAlignment right
    FontSize 10
    FontColor #8
    BackGroundColor transparent
    LineColor transparent
  }
  title {
    HorizontalAlignment center
    FontSize 14
    FontStyle bold
    Padding 5
    Margin 5
    LineColor transparent
    BackGroundColor transparent
  }
  footer {
    HorizontalAlignment center
    FontSize 10
    FontColor #8
    BackGroundColor transparent
    LineColor transparent
  }
  legend {
    LineColor black
    BackGroundColor #D
    FontSize 14
    RoundCorner 15
    Padding 5
    Margin 12
  }
  caption {
    HorizontalAlignment center
    FontSize 14
    Padding 0
    Margin 1
    LineColor transparent
    BackGroundColor transparent
  }
  frame {
    LineColor black
    LineThickness 1.5
  }
}


package {
  title {
    FontStyle bold
  }
}


stereotype {
  FontStyle italic
  HorizontalAlignment center
}


mainframe {
  Padding 1 5
  LineThickness 1.5
  Margin 10 5
}

element {
  Shadowing 0.0
  LineThickness 0.5
  composite,package {
    title {
      FontStyle bold
      HorizontalAlignment center
    }
  }
}

group {
  BackGroundColor transparent
  LineThickness 1.0
  package {
    LineThickness 1.5
    LineColor black
  }
  folder {
    LineThickness 1.5
    LineColor black
  }
}

sequenceDiagram {
	group {
	  LineColor black
	  LineThickness 1.5
	  FontSize 11
	  FontStyle bold
	}

	groupHeader {
	  LineThickness 1.5
	  BackGroundColor #e
	  LineColor black
	  FontSize 13
	  FontStyle bold
	}

	lifeLine {
	  LineStyle 5
	}

	activationBox {
	  BackGroundColor white
	}

  destroy {
    LineColor #A80036
    LineStyle 0
    LineThickness 2
  }

	reference {
	  FontSize 12
	  LineColor black
	  BackGroundColor transparent
	  LineThickness 1.5
	  HorizontalAlignment center
	}

	referenceHeader {
	  LineColor black
	  BackGroundColor #e
	  FontColor black
	  FontSize 13
	  FontStyle bold
	  LineThickness 2.0
	}

	box {
	  BackGroundColor #d

	  FontSize 13
	  FontStyle bold
	}

	separator {
	  LineColor black
	  LineThickness 2.0
	  BackGroundColor #e

	  FontSize 13
	  FontStyle bold
	}

  newpage {
    LineStyle 2
  }

	participant {
	  RoundCorner 5
	}

	participant,actor,boundary,control,entity,queue,database,collections {
	  BackgroundColor: var(--grey-blue);
	  HorizontalAlignment center
	}
}

classDiagram,componentDiagram,objectDiagram {
  element {
    RoundCorner 5
  }
  generic {
    BackgroundColor white
  }
}

visibilityIcon {
  public {
    LineColor #038048
    BackgroundColor #84BE84
  }
  private {
    LineColor #C82930
    BackgroundColor #F24D5C
  }
  protected {
    LineColor #B38D22
    BackgroundColor #FFFF44
  }
  package {
    LineColor #1963A0
    BackgroundColor #4177AF
  }
  IEMandatory {
    LineColor black
    BackgroundColor black
  }
}
// light theme
spot {
  spotAnnotation {
    BackgroundColor #E3664A
  }
  spotAbstractClass {
    BackgroundColor #A9DCDF
  }
  spotClass {
    BackgroundColor #ADD1B2
  }
  spotInterface {
    BackgroundColor #B4A7E5
  }
  spotEnum {
    BackgroundColor #EB937F
  }
  spotEntity {
    BackgroundColor #ADD1B2
  }
  spotException {
	BackgroundColor #D94321
  }
  spotMetaClass {
    BackgroundColor #CCCCCC
  }
  spotStereotype {
    BackgroundColor #FF77FF
  }
	spotDataClass {
		BackgroundColor #7E57C2
	}
	spotRecord {
		BackgroundColor #FF8F00
	}
}


stateDiagram {
  state {
    RoundCorner 25
  }
  stateBody {
    BackGroundColor transparent
  }
  element {
	title {
	  FontStyle plain
	}
  }
  group {
    LineThickness 0.5
  }
  header {
    FontSize 12
  }
  circle {
   start, stop, end {
      LineThickness 1
	    LineColor #2
	    BackgroundColor #2
    }
  }
}


delay {
  FontSize 11
  FontStyle plain
  HorizontalAlignment center
  LineStyle 1-4
}



swimlane {
  BackGroundColor transparent
  LineColor black
  LineThickness 1.5
  FontSize 18
}

arrow {
  FontSize 13
  LineThickness 1.0
  BackGroundColor black
}

note {
  FontSize 13
  BackGroundColor: var(--note-background);
  LineThickness 0.5
}

partition {
}

circle {
}

mindmapDiagram {
}

mindmapDiagram {
	node {
	    Padding 10
	    Margin 10
	    RoundCorner 25
	    LineThickness 1.5
	}
	arrow {
	    LineThickness 1.0
	}
}


wbsDiagram {
    Padding 10
    Margin 15
    RoundCorner 0
    LineThickness 1.5
    FontSize 12
}

activityDiagram {
	activity {
	    Padding 10
	    FontSize 12
	    RoundCorner 25
	}
	composite {
	    LineColor black
	    BackgroundColor transparent
	    LineThickness 1.5
	}
	diamond {
	    FontSize 11
	}
	arrow {
	    FontSize 11
	    LineThickness 1
	}
	circle {
	    start, stop, end {
        LineThickness 1
		    LineColor #2
		    BackgroundColor #2
	    }
      end {
        LineThickness 1.5
      }
	}
	activityBar {
	  BackgroundColor #5
	}
}


task {
    FontSize 11
}

milestone {
    FontSize 11
	BackGroundColor black
	LineColor black
}

ganttDiagram {
	arrow {
	  LineThickness 1.5
	}
	note {
	  FontSize 9
	}
	separator {
	  FontSize 11
	  FontStyle plain
	  BackGroundColor transparent
	  Margin 5
	  Padding 5
	}
	verticalSeparator {
	  LineThickness 2
	  LineStyle 2-2
	  LineColor black
	}
	timeline {
	    BackgroundColor transparent
	    LineColor #C0C0C0
	    FontSize 10
	    month {
	      FontSize 12
	    }
	    year {
	      FontSize 14
	    }
	}
	closed {
        BackGroundColor #F1E5E5
        FontColor #989898
    }
	task {
        BackGroundColor: var(--grey-blue);
		RoundCorner 0
        Margin 2 2 2 2
        Padding 0
	}
	undone {
        BackGroundColor white
	}
	milestone {
        Margin 2
        Padding 3
	}
}


usecase {
  HorizontalAlignment center
}

yamlDiagram,jsonDiagram {
  FontColor black
  LineColor black
  arrow {
    LineThickness 1
    LineStyle 3-3
  }
  node {
    LineThickness 1.5
  	RoundCorner 10
  	separator {
      LineThickness 1
  	}
  	header {
  	  FontStyle bold
  	}
    highlight {
	  BackGroundColor #ccff02
    }
  }
}


timingDiagram {
	LineColor #3
	FontColor #3
	FontStyle bold
    LineThickness 0.5
    timeline {
	  FontStyle plain
	  FontSize 11
      LineThickness 2
    }
    note {
      LineThickness 0.5
    }
	arrow {
	    FontName Serif
	    FontSize 14
	    FontStyle plain
	    FontColor darkblue
	    LineColor darkblue
	    LineThickness 1.5
	}
	constraintArrow {
	    FontSize 12
		FontStyle plain
	    FontColor darkred
	    LineColor darkred
	    LineThickness 1.5
	}
	clock {
	  LineColor darkgreen
      LineThickness 1.5
	}
	concise {
	  FontSize 12
	  LineColor darkgreen
	  BackgroundColor: var(--grey-blue);
      LineThickness 1.5
	}
	robust {
	  FontStyle plain
	  FontSize 12
	  LineColor darkgreen
      LineThickness 2
	  BackgroundColor: var(--grey-blue);
	}
	binary {
	  FontStyle plain
	  FontSize 12
	  LineColor darkgreen
      LineThickness 2
	}
	highlight {
	  BackgroundColor #e
	  LineThickness 2
	  LineStyle 4-4
	}
}

nwdiagDiagram {
	network {
	    BackgroundColor: var(--grey-blue);
		FontSize 12
	}
	server {
		FontSize 12
	}
	group {
		FontSize 12
		BackGroundColor #e7e7e7
		LineColor #e7e7e7
	}
	arrow {
		FontSize 11
	}
}

/*
 ____             _                            _
|  _ \  __ _ _ __| | __    _ __ ___   ___   __| | ___
| | | |/ _` | '__| |/ /   | '_ ` _ \ / _ \ / _` |/ _ \
| |_| | (_| | |  |   <    | | | | | | (_) | (_| |  __/
|____/ \__,_|_|  |_|\_\   |_| |_| |_|\___/ \__,_|\___|

*/
@media (prefers-color-scheme:dark) {
root {
  HyperLinkColor blue
  FontColor white
  LineColor #e7e7e7
  BackGroundColor #313139
}

document {
  BackGroundColor #1B1B1B
  header {
    FontColor #7
  }
  footer {
    FontColor #7
  }
  legend {
    LineColor white
    BackGroundColor #2
  }
  frame {
    LineColor white
  }
}

group {
  package {
    LineColor white
  }
  folder {
    LineColor white
  }
}

sequenceDiagram {
  group {
    LineColor white
  }

  groupHeader {
    BackGroundColor #5
    LineColor white
  }

  lifeLine {
    BackGroundColor black
  }
	reference {
	  LineColor #d
	}

	referenceHeader {
	  LineColor #d
	  FontColor white
	  BackGroundColor #4
	}

	box {
	  BackGroundColor #2
	}

	separator {
	  LineColor white
	  BackGroundColor #1
	}

	participant,actor,boundary,control,entity,queue,database,collections {
	  BackgroundColor: #2;
	  HorizontalAlignment center
	}

}

//dark theme
spot {
  spotAnnotation {
    BackgroundColor #4A0000
  }
  spotAbstractClass {
    BackgroundColor #2A5D60
  }
  spotClass {
    BackgroundColor #2E5233
  }
  spotInterface {
    BackgroundColor #352866
  }
  spotEnum {
    BackgroundColor #852D19
  }
  spotEntity {
    BackgroundColor #2E5233
  }
  spotException {
	BackgroundColor #7D0000
  }
  spotMetaClass {
    BackgroundColor #7C7C7C
  }
  spotStereotype {
    BackgroundColor #890089
  }
	spotDataClass {
		BackgroundColor #B39DDB
	}
	spotRecord {
		BackgroundColor #FFB74D
	}
}


swimlane {
  LineColor white
}

note {
  BackGroundColor #714137
}


activityDiagram {
	partition {
	    LineColor white
	}
	circle {
	    start, stop, end {
		    LineColor #d
		    BackgroundColor #d
	    }
	}
	activityBar {
	  BackgroundColor #a
	}
}

stateDiagram {
  circle {
    start, stop, end {
      LineColor #d
      BackgroundColor #d
    }
  }
}

milestone {
	BackGroundColor white
	LineColor white
}

timingDiagram {
	LineColor #d
	FontColor #d
	arrow {
	    LineColor lightblue
	}
	constraintArrow {
	    LineColor tomato
	    FontColor tomato
	}
	clock {
	  LineColor lightgreen
	}
	concise {
	  LineColor lightgreen
	  BackgroundColor #6
	}
	robust {
	  LineColor lightgreen
	  BackgroundColor #3
	}
	highlight {
	  BackgroundColor #1
	}
}



ganttDiagram {
	task {
	    BackGroundColor #555
	}
	timeline {
	    LineColor #3f3f3f
	}
	closed {
        BackGroundColor #1f1f1f
        FontColor #676767
    }
	undone {
        BackGroundColor black
	}
}


yamlDiagram,jsonDiagram {
  FontColor white
  LineColor white
  node {
    highlight {
	  BackGroundColor #ccff02
    }
  }
}

nwdiagDiagram {
	network {
	    BackGroundColor #555
	}
	group {
		BackGroundColor #2
	}
}

}
