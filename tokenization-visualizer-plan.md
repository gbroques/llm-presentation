# GPT-2 Tokenization Visualizer

## Overview
Minimal presentation-focused visualization showing GPT-2 tokenization with large, centered, colored tokens and hover tooltips displaying token IDs.

## Core Features

### 🎯 Primary Functionality
- **Static tokenization display** of sample text "Mike is quick,"
- **Large colored token boxes** (48px font) with unique colors per token ID
- **Hover tooltips** showing token IDs
- **Perfect centering** - vertically and horizontally centered for presentations

### 🎨 Visual Design
- **Ultra-minimal interface** - no UI clutter, just tokens
- **Clean white background** - professional presentation look
- **Large, readable tokens** - clearly visible from audience
- **Consistent color system** using golden angle distribution

## Technical Implementation

### 📚 Libraries & Dependencies
- **`gpt-tokenizer`** with `r50k_base` encoding (GPT-2 tokenizer)
- **Vanilla HTML/CSS/JS** - no framework dependencies
- **CDN delivery** via unpkg

### 🏗️ Architecture
```
tokenizer.html          # Single standalone HTML file
├── CSS (embedded)      # Minimal centering and token styling
├── JavaScript          # Simple tokenization logic
└── gpt-tokenizer CDN   # r50k_base encoding for GPT-2
```

### 🎨 Color System
- **Deterministic colors** - same token ID always gets same color
- **Golden angle distribution** - visually pleasing color spread
- **High contrast borders** - clear token boundaries

### 💡 Interaction Features
- **Hover tooltips** - show token ID on hover
- **Static display** - no editing, perfect for presentations
- **Easy text updates** - change one line of code for different examples

## File Structure
```
/next-token-prediction.html            # Interactive LLM next-token demo
/tokenization.html                     # Static tokenization visualization
/tokenization-visualizer-plan.md       # This planning document
```

## Implementation Completed
✅ Single HTML file with embedded CSS/JS
✅ gpt-tokenizer integration with r50k_base encoding
✅ Large font (48px) tokenization display
✅ Perfect viewport centering
✅ Hover tooltip functionality with token IDs
✅ Deterministic color generation
✅ Minimal presentation-focused design
✅ Easy text customization (single line change)

## Success Criteria
✅ Text tokenizes and displays in large, centered format
✅ Each token has unique, consistent coloring
✅ Hover shows token ID tooltip
✅ Clean, minimal aesthetic perfect for presentations
✅ Works across modern browsers
✅ Independent from existing next-token demo
✅ Zero cognitive load - pure focus on tokenization concept

## Usage
- Open `tokenization.html` in browser for full-screen presentation
- Hover over tokens to see IDs
- Change `const text = "Mike is quick,";` to show different examples
