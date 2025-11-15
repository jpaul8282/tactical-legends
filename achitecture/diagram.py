# Improved Architecture Diagram for Tactical Legends Game Project

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# Set style
plt.style.use('seaborn-v0_8-whitegrid')
fig, ax = plt.subplots(figsize=(14, 10))
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Helper function to draw a box
def draw_box(x, y, w, h, label, color='lightblue', fontsize=10, bold=False):
    rect = mpatches.FancyBboxPatch(
        (x, y), w, h, boxstyle="round,pad=0.02",
        edgecolor='black', facecolor=color
    )
    ax.add_patch(rect)
    weight = 'bold' if bold else 'normal'
    ax.text(x + w/2, y + h/2, label, ha='center', va='center', fontsize=fontsize, weight=weight)

# Helper function to draw an arrow
def draw_arrow(x1, y1, x2, y2, lw=1.5):
    ax.annotate(
        '', xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(arrowstyle='->', lw=lw)
    )

# --- Draw Components ---

# Core
draw_box(4, 8.5, 2, 1, "Game Loop", 'lightgreen', bold=True)
draw_box(4, 7, 2, 1, "Core Engine\n(C++ / SDL2)", 'lightblue')

# AI Modules
ai_x, ai_y = 1, 6.5
draw_box(ai_x, ai_y, 2, 0.8, "EnemyAI", 'wheat')
draw_box(ai_x, ai_y - 1, 2, 0.8, "Stealth & Combat AI", 'wheat')
ax.text(ai_x + 1, ai_y + 1, "AI Modules", ha='center', fontsize=10, weight='bold')

# Campaign & Audio Managers
draw_box(4, 5.5, 2, 0.8, "Campaign Manager", 'lightyellow')
draw_box(7, 5.5, 2, 0.8, "Audio Manager", 'lightyellow')

# UI Layer
ui_x, ui_y = 1, 3.5
draw_box(ui_x, ui_y, 2, 0.8, "CodexPanel.vue", 'plum')
draw_box(ui_x, ui_y - 1, 2, 0.8, "MissionUIManager", 'plum')
ax.text(ui_x + 1, ui_y + 1, "UI Layer", ha='center', fontsize=10, weight='bold')

# Data Layer
data_x, data_y = 4, 3.5
draw_box(data_x, data_y, 2, 0.8, "Prisma", 'lightcoral')
draw_box(data_x, data_y - 1, 2, 0.8, "JSON Configs", 'lightcoral')
ax.text(data_x + 1, data_y + 1, "Data Layer", ha='center', fontsize=10, weight='bold')

# Deployment & Build
deploy_x, deploy_y = 7, 3.5
draw_box(deploy_x, deploy_y, 2, 0.8, "CMake", 'lightgray')
draw_box(deploy_x, deploy_y - 1, 2, 0.8, "YAML Workflows", 'lightgray')
ax.text(deploy_x + 1, deploy_y + 1, "Deployment & Build", ha='center', fontsize=10, weight='bold')

# Testing
draw_box(7, 1, 2, 0.8, "CTest", 'lightsteelblue')

# --- Draw Arrows ---

# Game Loop flows
draw_arrow(5, 8.5, 5, 7)            # Game Loop -> Core
draw_arrow(5, 7, 2, 6.9)            # Core -> EnemyAI
draw_arrow(5, 7, 2, 5.9)            # Core -> Stealth AI
draw_arrow(5, 7, 5, 5.9)            # Core -> Campaign Manager
draw_arrow(5, 7, 8, 5.9)            # Core -> Audio Manager

# UI Layer flows
draw_arrow(5, 5.5, 2, 4.3)          # Campaign Manager -> UI
draw_arrow(5, 5.5, 5, 4.3)          # Campaign Manager -> Data
draw_arrow(2, 3.5, 2, 2.5)          # CodexPanel -> MissionUIManager

# Deployment & Testing flows
draw_arrow(8, 5.5, 8, 4.3)          # Audio -> CMake
draw_arrow(8, 3.5, 8, 2.5)          # CMake -> YAML
draw_arrow(8, 2.5, 8, 1.8)          # YAML -> CTest

# --- Legend ---
legend_patches = [
    mpatches.Patch(color='lightgreen', label='Core'),
    mpatches.Patch(color='lightblue', label='Engine'),
    mpatches.Patch(color='wheat', label='AI Modules'),
    mpatches.Patch(color='lightyellow', label='Managers'),
    mpatches.Patch(color='plum', label='UI Layer'),
    mpatches.Patch(color='lightcoral', label='Data Layer'),
    mpatches.Patch(color='lightgray', label='Deployment & Build'),
    mpatches.Patch(color='lightsteelblue', label='Testing')
]
ax.legend(handles=legend_patches, loc='lower right')

# Title
plt.title("Tactical Legends Game Architecture", fontsize=16, weight='bold')

# Save figure
output_path = "/mnt/data/tactical_legends_architecture.png"
plt.savefig(output_path, bbox_inches='tight', dpi=150)
plt.close()

print(f"Diagram saved as: {output_path}")
