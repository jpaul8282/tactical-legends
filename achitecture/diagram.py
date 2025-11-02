# Creating an architecture diagram for the Tactical Legends Game Project

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# Set style
plt.style.use('seaborn-v0_8-whitegrid')
fig, ax = plt.subplots(figsize=(14, 10))
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Helper function to draw a box
def draw_box(x, y, w, h, label, color='lightblue'):
    rect = mpatches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02", edgecolor='black', facecolor=color)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h/2, label, ha='center', va='center', fontsize=10)

# Draw components
draw_box(4, 8.5, 2, 1, "Game Loop", 'lightgreen')
draw_box(4, 7, 2, 1, "Core Engine\n(C++ / SDL2)", 'lightblue')

# AI Modules
draw_box(1, 6.5, 2, 0.8, "EnemyAI", 'wheat')
draw_box(1, 5.5, 2, 0.8, "Stealth & Combat AI", 'wheat')
ax.text(2, 7.5, "AI Modules", ha='center', fontsize=10, weight='bold')

# Campaign Manager
draw_box(4, 5.5, 2, 0.8, "Campaign Manager", 'lightyellow')

# Audio Manager
draw_box(7, 5.5, 2, 0.8, "Audio Manager", 'lightyellow')

# UI Layer
draw_box(1, 3.5, 2, 0.8, "CodexPanel.vue", 'plum')
draw_box(1, 2.5, 2, 0.8, "MissionUIManager", 'plum')
ax.text(2, 4.5, "UI Layer", ha='center', fontsize=10, weight='bold')

# Data Layer
draw_box(4, 3.5, 2, 0.8, "Prisma", 'lightcoral')
draw_box(4, 2.5, 2, 0.8, "JSON Configs", 'lightcoral')
ax.text(5, 4.5, "Data Layer", ha='center', fontsize=10, weight='bold')

# Deployment & Build
draw_box(7, 3.5, 2, 0.8, "CMake", 'lightgray')
draw_box(7, 2.5, 2, 0.8, "YAML Workflows", 'lightgray')
ax.text(8, 4.5, "Deployment & Build", ha='center', fontsize=10, weight='bold')

# Testing
draw_box(7, 1, 2, 0.8, "CTest", 'lightsteelblue')

# Arrows for data/control flow
def draw_arrow(x1, y1, x2, y2):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', lw=1.5))

# Arrows from Game Loop
draw_arrow(5, 8.5, 5, 7)
draw_arrow(5, 7, 2, 6.9)  # to EnemyAI
draw_arrow(5, 7, 2, 5.9)  # to Stealth AI
draw_arrow(5, 7, 5, 5.9)  # to Campaign Manager
draw_arrow(5, 7, 8, 5.9)  # to Audio Manager

# Arrows to UI Layer
draw_arrow(5, 5.5, 2, 4.3)  # Campaign Manager to UI
draw_arrow(5, 5.5, 5, 4.3)  # Campaign Manager to Data
draw_arrow(2, 3.5, 2, 2.5)  # CodexPanel to MissionUIManager

# Arrows to Deployment & Testing
draw_arrow(8, 5.5, 8, 4.3)  # Audio to Build
draw_arrow(8, 3.5, 8, 2.5)  # CMake to YAML
draw_arrow(8, 2.5, 8, 1.8)  # YAML to CTest

# Title
plt.title("Tactical Legends Game Architecture", fontsize=14, weight='bold')

# Save figure
output_path = "/mnt/data/tactical_legends_architecture.png"
plt.savefig(output_path, bbox_inches='tight')
plt.close()

print(f"Diagram saved as: {output_path}")
