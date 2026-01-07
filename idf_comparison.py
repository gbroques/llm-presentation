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
idf_log = np.log(N / df)
idf_no_log = N / df

# Create subplot
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6), facecolor='#191919')

# Plot with log
ax1.set_facecolor('#191919')
ax1.plot(df, idf_log, color=colors['blue'], linewidth=2)
ax1.set_xlabel('Document Frequency', color='white', fontsize=14, labelpad=10)
ax1.set_ylabel('IDF = log(N/df)', color='white', fontsize=14, labelpad=10)
ax1.set_title('With Log', color='white', fontsize=16)
ax1.tick_params(colors='white', labelsize=12)
ax1.spines['bottom'].set_color('white')
ax1.spines['left'].set_color('white')
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)

# Plot without log
ax2.set_facecolor('#191919')
ax2.plot(df, idf_no_log, color=colors['red'], linewidth=2)
ax2.set_xlabel('Document Frequency', color='white', fontsize=14, labelpad=10)
ax2.set_ylabel('IDF = N/df', color='white', fontsize=14, labelpad=10)
ax2.set_title('Without Log', color='white', fontsize=16)
ax2.tick_params(colors='white', labelsize=12)
ax2.spines['bottom'].set_color('white')
ax2.spines['left'].set_color('white')
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)

plt.tight_layout(pad=2.0)
plt.savefig('reveal.js/idf_comparison.png', 
            facecolor='#191919', dpi=150, bbox_inches='tight', pad_inches=0.3)
plt.show()
