# PlantUML Mindmap - Complete Syntax Guide

## 📋 Table of Contents
1. [Basic Syntax](#basic-syntax)
2. [Direction Control](#direction-control)
3. [Colors & Styling](#colors--styling)
4. [Box Types](#box-types)
5. [Multiple Roots](#multiple-roots)
6. [Advanced Styling](#advanced-styling)
7. [Text Formatting](#text-formatting)
8. [Best Practices](#best-practices)

---

## 1. Basic Syntax

### Simple Mindmap Structure
```plantuml
@startmindmap
* Root Node
** First Level
*** Second Level
**** Third Level
** Another First Level
@endmindmap
```

### Alternative Syntax (Plus/Minus)
```plantuml
@startmindmap
+ Root
++ Right Side Level 1
+++ Right Side Level 2
-- Left Side Level 1
--- Left Side Level 2
@endmindmap
```

**Key Points:**
- `*` creates nodes (more asterisks = deeper levels)
- `+` for right side, `-` for left side
- Indentation is optional but improves readability

---

## 2. Direction Control

### Default (Left to Right)
```plantuml
@startmindmap
* Root
** Child 1
** Child 2
@endmindmap
```

### Top to Bottom
```plantuml
@startmindmap
top to bottom direction
* Root
** Child 1
** Child 2
@endmindmap
```

### Right to Left
```plantuml
@startmindmap
right-to-left direction
* Root
** Child 1
** Child 2
@endmindmap
```

### Mixed Directions
```plantuml
@startmindmap
+ Root
++ Right Side
-- Left Side (use 'left side' keyword)

left side

-- Left Node 1
-- Left Node 2
@endmindmap
```

---

## 3. Colors & Styling

### Inline Color Syntax
```plantuml
@startmindmap
*[#Orange] Root
**[#lightgreen] Green Node
**[#FFBBCC] Pink Node
**[#lightblue] Blue Node
@endmindmap
```

### Using Style Classes
```plantuml
@startmindmap
<style>
mindmapDiagram {
  .success {
    BackgroundColor lightgreen
  }
  .warning {
    BackgroundColor #FFA500
  }
  .error {
    BackgroundColor #FF6B6B
  }
}
</style>

* Project Status
** Completed Tasks <<success>>
** Pending Tasks <<warning>>
** Failed Tasks <<error>>
@endmindmap
```

### Style Inheritance
```plantuml
@startmindmap
<style>
mindmapDiagram {
  .myStyle * {
    BackgroundColor lightgreen
  }
}
</style>

+ Root
++ Parent <<myStyle>>
+++ Child (inherits green)
+++ Another Child (inherits green)
@endmindmap
```

---

## 4. Box Types

### Boxless Nodes (Underscore Suffix)
```plantuml
@startmindmap
* Root
** Normal Node
**_ Boxless Node
***_ Boxless Child 1
***_ Boxless Child 2
@endmindmap
```

### Mixed Box Types
```plantuml
@startmindmap
*_ Boxless Root
**_ Boxless Level 1
*** Normal Level 2
***_ Boxless Level 2
** Normal Level 1
@endmindmap
```

---

## 5. Multiple Roots

```plantuml
@startmindmap
* Root 1
** Branch A
** Branch B

* Root 2
** Branch X
** Branch Y
@endmindmap
```

---

## 6. Advanced Styling

### Comprehensive Node Styling
```plantuml
@startmindmap
<style>
node {
    Padding 12
    Margin 5
    HorizontalAlignment center
    LineColor #0066CC
    LineThickness 2.0
    BackgroundColor #E8F4F8
    RoundCorner 20
    MaximumWidth 150
    FontSize 14
    FontColor #333333
}

rootNode {
    LineStyle 8.0;3.0
    LineColor #FF6B6B
    BackgroundColor #FFFFFF
    LineThickness 3.0
    RoundCorner 25
    Shadowing 2.0
    FontSize 18
    FontStyle bold
}

leafNode {
    LineColor #00CC88
    RoundCorner 10
    Padding 8
    BackgroundColor #F0FFF0
}

arrow {
    LineStyle 4
    LineThickness 1.5
    LineColor #666666
}
</style>

* Strategic Plan
** Goals
*** Revenue Growth
*** Market Expansion
** Resources
*** Budget
*** Team
@endmindmap
```

### Depth-Based Styling
```plantuml
@startmindmap
<style>
mindmapDiagram {
    node {
        BackgroundColor lightGreen
    }
    :depth(0) {
        BackgroundColor #FF6B6B
        FontColor white
        FontStyle bold
    }
    :depth(1) {
        BackgroundColor #FFA500
    }
    :depth(2) {
        BackgroundColor #FFD700
    }
}
</style>

* Level 0 (Root)
** Level 1
*** Level 2
**** Level 3
@endmindmap
```

---

## 7. Text Formatting

### Creole Markup
```plantuml
@startmindmap
* Text Formatting

left side

**:==Creole Syntax
**Bold Text**: This is **bold**
//Italic Text//: This is //italics//
"Monospaced": This is "monospaced"
--Strikethrough--: This is --stricken-out--
__Underlined__: This is __underlined__
~~Wavy~~: This is ~~wave-underlined~~
;

right side

**:==HTML Markup
<b>Bold</b>
<i>Italics</i>
<u>Underlined</u>
<s>Strikethrough</s>
<color:blue>Blue Text</color>
<back:yellow>Yellow Background</back>
<size:16>Large Text</size>
;
@endmindmap
```

### Lists in Nodes
```plantuml
@startmindmap
* Project Tasks

**:==Completed
* Database setup
* User authentication
* API endpoints
** POST /users
** GET /users
* Frontend design
;

**:==In Progress
# Code review
# Testing
## Unit tests
## Integration tests
# Documentation
;
@endmindmap
```

### Icons and Special Characters
```plantuml
@startmindmap
* <&flag> Project Dashboard
** <&globe> Global Reach
** <&people> Team Members
** <&star> Key Features
** <&code> Development
** <&pulse> Performance
@endmindmap
```

### Multiline Text
```plantuml
@startmindmap
**: Long Text Node
This is a node with
multiple lines of text
that wraps automatically
for better readability;

** Another approach\nusing explicit\nnewlines
@endmindmap
```

---

## 8. Best Practices

### Complete Example with Headers, Footers, and Legends
```plantuml
@startmindmap
title Software Development Lifecycle
caption Phase 1: Planning & Design

header
Project: Tactical Legends
Version: 1.0
endheader

center footer Generated: 2025-10-12

legend right
  Status Colors:
  * Green = Complete
  * Orange = In Progress
  * Red = Blocked
endlegend

<style>
mindmapDiagram {
  .complete {
    BackgroundColor #90EE90
  }
  .inprogress {
    BackgroundColor #FFA500
  }
  .blocked {
    BackgroundColor #FF6B6B
  }
}
</style>

* <&flag> SDLC
** <&code> Planning <<complete>>
*** Requirements Analysis
*** Resource Allocation
** <&gear> Design <<inprogress>>
*** Architecture
*** UI/UX Design
** <&cog> Development <<inprogress>>
*** Backend API
*** Frontend UI
** <&check> Testing <<blocked>>
*** Unit Tests
*** Integration Tests
@endmindmap
```

### Tactical Legends Game Architecture Example
```plantuml
@startmindmap
<style>
mindmapDiagram {
  .core {
    BackgroundColor #00FF88
    FontColor #000000
  }
  .feature {
    BackgroundColor #1A1A2E
    FontColor #00FF88
  }
  .system {
    BackgroundColor #FF6B6B
    FontColor #FFFFFF
  }
}
</style>

* <&star> Tactical Legends <<core>>

left side

** <&people> Characters <<feature>>
*** Character Builder
*** Stats System
*** Abilities

** <&shield> Combat <<system>>
*** Damage Calculation
*** Balance System
*** AI Behavior

right side

** <&wrench> Weapons <<feature>>
*** Weapon Generator
*** DPS Calculator
*** Rarity System

** <&map-marker> Missions <<feature>>
*** Mission Creator
*** Objective System
*** Reward Distribution
@endmindmap
```

---

## 🎯 Quick Reference

### Syntax Shortcuts
| Symbol | Purpose |
|--------|---------|
| `*` | Create node (increase for depth) |
| `+` | Right-side node |
| `-` | Left-side node |
| `_` suffix | Boxless node |
| `[#color]` | Inline color |
| `<<class>>` | Apply style class |
| `:text;` | Multiline node content |

### Common Colors
- `lightgreen`, `lightblue`, `lightgray`
- `#00FF88` (hex codes)
- `orange`, `red`, `gold`
- RGB: `rgb(255,100,100)`

### Useful Icons (OpenIconic)
- `<&flag>`, `<&star>`, `<&people>`
- `<&code>`, `<&cog>`, `<&shield>`
- `<&map-marker>`, `<&globe>`, `<&pulse>`

---

## 📝 Notes

1. **Performance**: Large mindmaps (100+ nodes) may render slowly
2. **Styling Priority**: Inline colors override style classes
3. **Text Width**: Use `MaximumWidth` to control node width
4. **Line Breaks**: Use `\n` or multiline syntax `:text;`
5. **Compatibility**: Some features require recent PlantUML versions

---

*Generated for Tactical Legends - Game Development Toolkit*
