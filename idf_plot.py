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
idf = np.log(N / df)

# Plot with your colors
plt.figure(figsize=(10, 6), facecolor='#191919')
ax = plt.gca()
ax.set_facecolor('#191919')

plt.plot(df, idf, color=colors['blue'], linewidth=2, label='IDF')
plt.xlabel('Document Frequency', color='white', fontsize=16, labelpad=15)
plt.ylabel('IDF = log(N/df)', color='white', fontsize=16, labelpad=15)
plt.tick_params(colors='white', labelsize=14)
ax.spines['bottom'].set_color('white')
ax.spines['left'].set_color('white')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout(pad=2.0)
plt.savefig('reveal.js/idf_plot.png', 
            facecolor='#191919', dpi=150, bbox_inches='tight', pad_inches=0.3)
plt.show()
