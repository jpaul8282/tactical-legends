# Creating onboarding flow diagram for Tactical Legends open-source project

import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Set style
plt.style.use('seaborn-v0_8')
fig, ax = plt.subplots(figsize=(12, 8))
ax.set_xlim(0, 10)
ax.set_ylim(0, 12)
ax.axis('off')

# Define boxes with positions and labels
boxes = [
    (1, 11, "Discover the project on GitHub"),
    (1, 9.5, "Read README and\nContribution Guidelines"),
    (1, 8, "Set up Dev Environment\n(C++, SDL2, CMake)"),
    (1, 6.5, "Explore Codebase\n(AI, UI, Campaign Manager)"),
    (1, 5, "Pick an Issue or Feature"),
    (5.5, 11, "Fork Repo & Create Branch"),
    (5.5, 9.5, "Develop & Test Locally"),
    (5.5, 8, "Submit Pull Request"),
    (5.5, 6.5, "Code Review & Revisions"),
    (5.5, 5, "Merge & Celebrate 🎉")
]

# Draw boxes
for x, y, text in boxes:
    ax.add_patch(patches.FancyBboxPatch((x, y), 3.5, 1, boxstyle="round,pad=0.1", edgecolor="black", facecolor="#cce5ff"))
    ax.text(x + 1.75, y + 0.5, text, ha="center", va="center", fontsize=10)

# Draw arrows for the left column
for i in range(0, 4):
    ax.annotate('', xy=(2.75, boxes[i+1][1]+1), xytext=(2.75, boxes[i][1]), arrowprops=dict(arrowstyle='->', lw=2))

# Arrow from the last left box to the first right box
ax. annotate('', xy=(5.5, 11.5), xytext=(2.75, 5), arrowprops=dict(arrowstyle='->', lw=2))

# Draw arrows for right column
for i in range(5, 9):
    ax.annotate('', xy=(7.25, boxes[i+1][1]+1), xytext=(7.25, boxes[i][1]), arrowprops=dict(arrowstyle='->', lw=2))

# Title
plt.title("Contributor Onboarding Flow – Tactical Legends", fontsize=14, weight='bold')

# Save diagram
output_path = "/mnt/data/tactical_legends_onboarding_flow.png"
plt.savefig(output_path, bbox_inches='tight')
plt.close()

print("Diagram saved as:", output_path)
