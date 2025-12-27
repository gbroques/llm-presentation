# LLM Next-Token Prediction Visualization - Requirements & Specifications

## Overview
Interactive web-based visualization demonstrating how Large Language Models work as next-token predictors, showing the iterative process of token generation and sequence building.

## Core Concept
Illustrate that LLMs generate text by:
1. Taking input text
2. Predicting the next token
3. Concatenating the predicted token to the input
4. Repeating the process with the new sequence

## Visual Layout
```
[Input Text] → [LLM] → [Output Token]
                ↓
         [Arc Animation Path]
```

## Sample Data - EASILY CONFIGURABLE!
- **Initial Input**: "Mike is quick,"
- **Output Tokens**: ["he", "moves", "quickly", "."]
- **Final Result**: "Mike is quick, he moves quickly."

**Note**: Sample data can be changed in CONFIG object without any code modifications!

## Layout Specifications

### Positioning
- **LLM Box**: Horizontally centered on canvas
- **Canvas**: Responsive width (full viewport), 70% viewport height
- **No scrollbars**: Overflow hidden, proper CSS box-sizing

### Spacing (All Equal 20px Gaps - Configurable)
- Input text → Left arrow: 20px
- Left arrow → LLM box: 20px  
- LLM box → Right arrow: 20px
- Right arrow → Output token: 20px

### Element Sizes (All Configurable)
- **LLM Box**: 180px × 180px square
- **Arrows**: Equal length (~80px), calculated dynamically
- **Font Sizes**: 
  - Input/Output text: 32px
  - LLM text: 42px
  - Instructions: 20px

## Dynamic State Management

### Pattern-Based States (Works with ANY number of tokens!)
- **Even states** (0, 2, 4, 6...): Token generation (LLM processing)
- **Odd states** (1, 3, 5, 7...): Token integration (arc animation)

### Automatic Scaling
- State count: `CONFIG.outputTokens.length * 2`
- Text building: Dynamic loop through tokens
- No hardcoded state checks - uses modular arithmetic

### Controls
- **Right Arrow Key**: Advance to next state
- **Left Arrow Key**: Reverse to previous state (with reverse animations)

## Animation Details

### LLM Box Feedback
- **Highlight**: Brief blue highlight when processing
- **Pulse**: Scale increase animation during token generation

### Token Arc Animation
- **Path**: Smooth quadratic Bezier curve below LLM box
- **Duration**: ~1 second with ease-in-out
- **Direction**: 
  - Forward: Output position → Input text end
  - Reverse: Input text end → Output position

### Text Shifting
- **Forward**: Input text shifts left to make room for new token
- **Reverse**: Input text shifts right as token is removed
- **Animation**: Smooth lerp transition

### Arrow Behavior
- **Forward**: Right arrow disappears when token starts animating
- **Reverse**: Right arrow appears immediately when reverse animation starts

### Token Visibility Rules
- **Static Display**: Only when not animating
- **During Animation**: Token only visible as moving arc (not in both positions)
- **Reverse**: Token disappears from input text immediately when reverse starts

## Configuration System

### Centralized CONFIG Object
All customizable values are in a single configuration object:

```javascript
const CONFIG = {
  // Sample Data - EASILY CHANGEABLE!
  inputText: "Mike is quick,",
  outputTokens: ["he", "moves", "quickly", "."],
  
  // Layout & Spacing
  elementGap: 20,           // Gap between all elements
  
  // LLM Box
  llmSize: 180,
  llmColors: {
    normal: { fill: [255], stroke: [150] },
    highlight: { fill: [150, 200, 255, 120], stroke: [100, 180, 255] }
  },
  
  // Typography
  fonts: {
    inputOutput: 32,
    llm: 42,
    instructions: 20
  },
  
  // Animation
  animation: {
    speed: 0.015,           // Animation progress per frame
    arcDepth: 200,          // Distance below LLM box for arc
    pulseDecay: 0.05,       // LLM pulse fade rate
    textShiftSpeed: 0.1     // Input text shift lerp speed
  },
  
  // Canvas
  canvas: {
    heightRatio: 0.7,       // Percentage of viewport height
    instructionsBottom: 20  // Percentage from bottom for instructions
  }
};
```

### Easy Customization Examples
```javascript
// Change to 3 tokens - works automatically!
CONFIG.inputText = "The cat";
CONFIG.outputTokens = ["sat", "down"];

// Change to 6 tokens - works automatically!
CONFIG.inputText = "I love";
CONFIG.outputTokens = ["to", "code", "in", "JavaScript", "daily"];

// Adjust spacing throughout
CONFIG.elementGap = 30; // Makes everything more spaced out

// Change animation speed
CONFIG.animation.speed = 0.01; // Slower animations
```

## Technical Implementation

### Helper Functions
- `getCurrentTokenIndex()` - Dynamic token index calculation
- `isTokenGenerationState()` - Pattern-based state checking
- `isTokenIntegrationState()` - Pattern-based state checking
- `calculateArrowLength()` - Centralized positioning logic
- `getOutputTokenPosition()` - Reusable positioning

### Responsive Design
- Canvas width: `windowWidth` (full viewport)
- Canvas height: `windowHeight * CONFIG.canvas.heightRatio`
- No horizontal/vertical scrollbars
- Instructions positioned at bottom of viewport

### Font Consistency
- All text uses same styling (no stroke, consistent fill)
- Proper text alignment for visual balance
- Configurable font sizes throughout

### Dynamic State Management Benefits
- **No hardcoded limits**: Works with any number of tokens
- **Pattern recognition**: Even/odd state logic
- **Maintainable**: Single place to change behavior
- **Scalable**: Add/remove tokens without code changes

## File Structure
```
reveal.js/next-token-prediction.html  # Main HTML with responsive CSS
reveal.js/sketch.js                   # Complete p5.js implementation with CONFIG system
llm-visualization-plan.md             # This documentation
```

## Key Features
- ✅ Fully responsive layout
- ✅ Smooth bidirectional animations
- ✅ Equal arrow lengths and spacing
- ✅ LLM box centered with visual feedback
- ✅ Clean, modern styling
- ✅ No scrollbars or layout issues
- ✅ **Centralized configuration system**
- ✅ **Dynamic state management for any token count**
- ✅ **Easy customization without code changes**
- ✅ Educational clarity showing LLM token prediction process
