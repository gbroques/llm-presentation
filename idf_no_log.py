import matplotlib.pyplot as plt
import numpy as np

# Set font
plt.rcParams['font.family'] = ['Source Sans 3', 'Source Sans Pro', 'Helvetica', 'sans-serif']

# Your color theme
colors = {
    'red': '#FF3A06',
    'blue': '#0CD4FF', 
    'green': '#8DFF0A'
}

# Data
df = np.arange(1, 101)
N = 100
idf_no_log = N / df

# Create plot
fig, ax = plt.subplots(figsize=(8, 6), facecolor='#191919')

# Plot without log
ax.set_facecolor('#191919')
ax.plot(df, idf_no_log, color=colors['red'], linewidth=2)
ax.set_xlabel('Document Frequency', color='white', fontsize=14, labelpad=10)
ax.set_ylabel('IDF = N/df', color='white', fontsize=14, labelpad=10)
ax.tick_params(colors='white', labelsize=12)
ax.spines['bottom'].set_color('white')
ax.spines['left'].set_color('white')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Add labels
ax.text(100, 5, 'common words', color='white', fontsize=12, ha='right')
ax.text(5, 100, 'rare words', color='white', fontsize=12, ha='left')

plt.tight_layout(pad=2.0)
plt.savefig('reveal.js/idf_no_log.png', 
            facecolor='#191919', dpi=150, bbox_inches='tight', pad_inches=0.3)
plt.show()
