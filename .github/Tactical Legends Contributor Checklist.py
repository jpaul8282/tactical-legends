# Creating printable checklist PDF for Tactical Legends contributors

import os
from fpdf import FPDF

# Define checklist items with icons
checklist_items = [
    ("✅", "Discover the project on GitHub"),
    ("📖", "Read the README and contribution guidelines"),
    ("🛠️", "Set up the development environment (C++, SDL2, CMake)"),
    ("🔍", "Explore the codebase (AI modules, UI, campaign manager)"),
    ("🧩", "Pick an issue or feature to work on"),
    ("🍴", "Fork the repository and create a new branch"),
    ("💻", "Develop and test changes locally"),
    ("📬", "Submit a pull request"),
    ("🧪", "Participate in code review and make revisions"),
    ("🎉", "Merge and celebrate your contribution")
]

# Create PDF
pdf = FPDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.set_font("Arial", 'B', 16)
pdf.cell(0, 10, "Tactical Legends Contributor Checklist", ln=True, align='C')
pdf.ln(10)

pdf.set_font("Arial", '', 12)
for icon, text in checklist_items:
    pdf.cell(0, 10, f"[ ] {icon} {text}", ln=True)

# Save PDF
output_path = "/mnt/data/Tactical_Legends_Contributor_Checklist.pdf"
pdf.output(output_path)

print("Checklist PDF created:", output_path)
