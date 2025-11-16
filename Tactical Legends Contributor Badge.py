# Creating badge design for Tactical Legends Contributor

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.font_manager import FontProperties
import os

# Set style
plt.style.use('dark_background')

# Create figure and axis
fig, ax = plt.subplots(figsize=(6, 4))
ax.set_xlim(0, 6)
ax.set_ylim(0, 4)
ax.axis('off')

# Background color
fig. patch.set_facecolor('#0a0f2c')  # Dark blue

# Add shield icon (stylized polygon)
shield = patches.RegularPolygon((1, 2), numVertices=6, radius=0.8, orientation=0.5, color='silver', ec='neongreen', lw=2)
ax.add_patch(shield)

# Add grid lines inside shield
for i in range(3):
    ax.plot([0.5 + i*0.3, 1.5 - i*0.3], [1.5, 2.5], color='neongreen', lw=1)

# Title text
ax.text(2.2, 3.2, "Tactical Legends Contributor", fontsize=14, fontweight='bold', color='silver')

# Subtitle text
ax.text(2.2, 2.6, "Code. Strategy. Legacy.", fontsize=10, color='neongreen')

# Border rectangle
badge_border = patches.Rectangle((0.1, 0.1), 5.8, 3.8, linewidth=2, edgecolor='silver', facecolor='none')
ax.add_patch(badge_border)

# Save badge
output_path = "/mnt/data/tactical_legends_contributor_badge.png"
fig.savefig(output_path, dpi=300, bbox_inches='tight')
plt.close(fig)
