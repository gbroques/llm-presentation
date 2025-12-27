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

## Sample Data
- **Initial Input**: "Mike is quick,"
- **Output Tokens**: ["he", "moves", "quickly", "."]
- **Final Result**: "Mike is quick, he moves quickly."

## Layout Specifications

### Positioning
- **LLM Box**: Horizontally centered on canvas
- **Canvas**: Responsive width (full viewport), 70% viewport height
- **No scrollbars**: Overflow hidden, proper CSS box-sizing

### Spacing (All Equal 20px Gaps)
- Input text → Left arrow: 20px
- Left arrow → LLM box: 20px  
- LLM box → Right arrow: 20px
- Right arrow → Output token: 20px

### Element Sizes
- **LLM Box**: 180px × 180px square
- **Arrows**: Equal length (~80px), calculated dynamically
- **Font Sizes**: 
  - Input/Output text: 32px
  - LLM text: 42px
  - Instructions: 20px

## Animation States & Controls

### State Progression (8 total states for 4 tokens)
1. **State 0**: Initial - "Mike is quick,"
2. **State 1**: "he" appears on right with arrow
3. **State 2**: "he" arcs to join input → "Mike is quick, he"
4. **State 3**: "moves" appears on right with arrow
5. **State 4**: "moves" arcs to join → "Mike is quick, he moves"
6. **State 5**: "quickly" appears on right with arrow
7. **State 6**: "quickly" arcs to join → "Mike is quick, he moves quickly"
8. **State 7**: "." appears on right with arrow
9. **State 8**: "." arcs to join → "Mike is quick, he moves quickly."

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

## Technical Implementation

### Responsive Design
- Canvas width: `windowWidth` (full viewport)
- Canvas height: `windowHeight * 0.7` (70% of viewport)
- No horizontal/vertical scrollbars
- Instructions positioned at bottom 20% of viewport

### Font Consistency
- All text uses same styling (no stroke, consistent fill)
- Proper text alignment for visual balance

### State Management
- Prevents input during animations
- Proper state transitions with animation completion callbacks
- Reversible animations following exact same paths

## File Structure
```
index.html          # Main HTML with responsive CSS
sketch.js           # Complete p5.js implementation
```

## Key Features
- ✅ Fully responsive layout
- ✅ Smooth bidirectional animations
- ✅ Equal arrow lengths and spacing
- ✅ LLM box centered with visual feedback
- ✅ Clean, modern styling
- ✅ No scrollbars or layout issues
- ✅ Educational clarity showing LLM token prediction process
