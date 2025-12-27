/**
 * @fileoverview Interactive LLM Next-Token Prediction Visualization
 * 
 * This p5.js sketch demonstrates how Large Language Models work as next-token predictors.
 * It shows the iterative process of token generation and sequence building through
 * interactive animations with smooth arc movements and visual feedback.
 * 
 * Key Features:
 * - Dynamic state management that works with any number of tokens
 * - Centralized configuration system for easy customization
 * - Smooth bidirectional animations with arc paths
 * - Responsive design that adapts to viewport size
 * - Pattern-based state logic (even = generation, odd = integration)
 * 
 * Usage:
 * - Right Arrow: Advance to next state (generate/integrate tokens)
 * - Left Arrow: Reverse to previous state (with reverse animations)
 * 
 * Configuration:
 * All customizable values are in the CONFIG object at the top of this file.
 * Change CONFIG.inputText and CONFIG.outputTokens to use different sample data.
 * 
 * @author Generated with assistance from Claude (Anthropic)
 * @version 1.0.0
 */

// ===== CONFIGURATION =====
const CONFIG = {
  // Sample Data - EASILY CHANGEABLE!
  inputText: "Mike is quick,",
  outputTokens: ["he", "moves", "quickly", "."],
  
  // Layout & Spacing
  elementGap: 20,           // Gap between all elements
  outerPadding: 250,        // Padding from screen edges (increased from 200)
  
  // LLM Box
  llmSize: 180,             // Increased from 160
  llmColors: {
    normal: { fill: [248, 249, 250], stroke: [108, 117, 125] },
    highlight: { fill: [150, 200, 255, 120], stroke: [100, 180, 255] }
  },
  
  // Typography
  fonts: {
    inputOutput: 42,        // Increased from 32
    llm: 40,                // Increased from 36
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

// ===== STATE VARIABLES =====
let currentState = 0;
let isAnimating = false;
let animationProgress = 0;
let llmPulse = 0;
let llmHighlight = false;
let inputShift = 0;
let targetInputShift = 0;

// ===== LAYOUT VARIABLES =====
let canvasWidth = 1400;
let canvasHeight = 600;
let inputX, inputY;
let llmX, llmY;
let outputX, outputY;

/**
 * p5.js setup function - initializes canvas and calculates element positions
 * Creates responsive canvas and positions LLM box at center with other elements relative to it
 */
function setup() {
  // Use full window dimensions
  canvasWidth = windowWidth;
  canvasHeight = windowHeight * CONFIG.canvas.heightRatio;
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  
  // Center LLM box on canvas, position other elements relative to it
  llmX = canvasWidth / 2;
  llmY = canvasHeight / 2;
  
  // Position input text to create desired arrow length
  let inputTextWidth = 250; // Estimated width for input text
  let desiredArrowLength = 80;
  
  inputX = llmX - CONFIG.llmSize/2 - CONFIG.elementGap - desiredArrowLength - CONFIG.elementGap - inputTextWidth;
  inputY = canvasHeight / 2;
  
  outputX = 0; // Will be calculated dynamically
  outputY = canvasHeight / 2;
  
  textAlign(CENTER, CENTER);
  textSize(CONFIG.fonts.inputOutput);
}

/**
 * p5.js draw function - main animation loop
 * Handles all animations: token arc movement, input text shifting, LLM pulse, and fade effects
 */
function draw() {
  background(255);
  
  // Update animations
  if (isAnimating) {
    animationProgress += CONFIG.animation.speed;
    if (animationProgress >= 1) {
      animationProgress = 0;
      isAnimating = false;
      completeStateTransition();
    }
  }
  
  // Update input shift animation
  inputShift = lerp(inputShift, targetInputShift, CONFIG.animation.textShiftSpeed);
  
  if (llmPulse > 0) {
    llmPulse -= CONFIG.animation.pulseDecay;
  }
  
  drawInputText();
  drawLLMBox();
  drawOutputToken();
  drawArrows();
}

/**
 * Draws the input text with proper positioning and shifting animation
 * Text shifts left as new tokens are integrated
 */
function drawInputText() {
  fill(50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(CONFIG.fonts.inputOutput);
  
  let displayText = getCurrentInputText();
  text(displayText, inputX + inputShift, inputY);
}

/**
 * Calculates the dynamic length of arrows based on available space
 * @returns {number} The calculated arrow length in pixels
 */
function calculateArrowLength() {
  let arrowStartX = inputX + textWidth(CONFIG.inputText) + CONFIG.elementGap;
  let arrowEndX = llmX - CONFIG.llmSize/2 - CONFIG.elementGap;
  return arrowEndX - arrowStartX;
}

/**
 * Calculates the dynamic position for output tokens based on arrow length
 * @returns {number} The x-coordinate where output tokens should be positioned
 */
function getOutputTokenPosition() {
  let arrowLength = calculateArrowLength();
  let rightArrowEndX = llmX + CONFIG.llmSize/2 + CONFIG.elementGap + arrowLength;
  return rightArrowEndX + CONFIG.elementGap;
}

/**
 * Gets the current token index based on the current state
 * @returns {number} Index of the current token in CONFIG.outputTokens array
 */
function getCurrentTokenIndex() {
  return Math.floor(currentState / 2);
}

/**
 * Checks if the current state is a token generation state (odd states)
 * @returns {boolean} True if in a token generation state
 */
function isTokenGenerationState() {
  return currentState % 2 === 1; // Odd states show tokens
}

/**
 * Checks if the current state is a token integration state (even states > 0)
 * @returns {boolean} True if in a token integration state
 */
function isTokenIntegrationState() {
  return currentState % 2 === 0 && currentState > 0; // Even states (except 0) integrate tokens
}

/**
 * Builds the current input text dynamically based on state and animations
 * Handles hiding tokens during reverse animations
 * @returns {string} The current input text to display
 */
function getCurrentInputText() {
  let tokensToShow = Math.floor(currentState / 2);
  
  // During reverse animation, hide the token that's moving
  if (isAnimating && isTokenIntegrationState()) {
    tokensToShow = Math.floor((currentState - 2) / 2);
  }
  
  let result = CONFIG.inputText;
  for (let i = 0; i < tokensToShow; i++) {
    result += " " + CONFIG.outputTokens[i];
  }
  return result;
}

/**
 * Draws the LLM box with pulse animation and highlight effects
 * Shows visual feedback during token generation with color changes and scaling
 */
function drawLLMBox() {
  // Calculate pulse effect
  let pulseSize = CONFIG.llmSize + (llmPulse * 10);
  
  // Interpolate colors based on pulse intensity
  let normalFill = CONFIG.llmColors.normal.fill;
  let highlightFill = CONFIG.llmColors.highlight.fill;
  let normalStroke = CONFIG.llmColors.normal.stroke;
  let highlightStroke = CONFIG.llmColors.highlight.stroke;
  
  // Use pulse value to interpolate between normal and highlight colors
  let t = llmPulse; // Use pulse value as interpolation factor
  let currentFill = [
    lerp(normalFill[0], highlightFill[0], t),
    lerp(normalFill[1], highlightFill[1], t),
    lerp(normalFill[2], highlightFill[2], t),
    255 // Always fully opaque
  ];
  let currentStroke = [
    lerp(normalStroke[0], highlightStroke[0], t),
    lerp(normalStroke[1], highlightStroke[1], t),
    lerp(normalStroke[2], highlightStroke[2], t)
  ];
  
  // Box styling
  fill(...currentFill);
  stroke(...currentStroke);
  strokeWeight(2);
  
  // Draw box
  rectMode(CENTER);
  rect(llmX, llmY, pulseSize, pulseSize);
  
  // Draw text with pulse scaling
  fill(50);
  noStroke();
  textAlign(CENTER, CENTER);
  let pulsedTextSize = CONFIG.fonts.llm + (llmPulse * 8); // Scale text with pulse
  textSize(pulsedTextSize);
  text("LLM", llmX, llmY);
  textSize(CONFIG.fonts.inputOutput); // Reset to normal text size
}

/**
 * Draws output tokens in their static position or during arc animations
 * Handles both forward (generation) and reverse (integration) animations
 */
function drawOutputToken() {
  let dynamicOutputX = getOutputTokenPosition();
  
  // Show static token when in generation state and not animating, or when pulse is active
  if ((isTokenGenerationState() && !isAnimating) || llmPulse > 0) {
    // Calculate alpha for fade in effect - fade in from start to peak of pulse
    let alpha = 255;
    if (llmPulse > 0) {
      // Fade in during first half of pulse: invisible at start (pulse=1), visible at peak (pulse=0.5)
      if (llmPulse > 0.5) {
        alpha = (1 - llmPulse) * 2 * 255; // Fade in from 1.0 to 0.5
      } else {
        alpha = 255; // Fully visible from peak onwards
      }
    }
    
    fill(50, 50, 50, alpha); // Dark gray with varying alpha
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(CONFIG.fonts.inputOutput);
    let token = CONFIG.outputTokens[getCurrentTokenIndex()];
    text(token, dynamicOutputX, outputY);
  }
  
  // Draw animating token during integration (forward)
  if (isAnimating && isTokenGenerationState()) {
    drawAnimatingToken(false); // forward animation
  }
  
  // Draw animating token during reverse (backward)
  if (isAnimating && isTokenIntegrationState()) {
    drawAnimatingToken(true); // reverse animation
  }
}

/**
 * Draws a token following a smooth arc animation path
 * Uses quadratic Bezier curve that passes below the LLM box
 * @param {boolean} isReverse - True for reverse animation (input to output), false for forward (output to input)
 */
function drawAnimatingToken(isReverse = false) {
  let tokenIndex = isReverse ? getCurrentTokenIndex() - 1 : getCurrentTokenIndex();
  let token = CONFIG.outputTokens[tokenIndex];
  
  let dynamicOutputX = getOutputTokenPosition();
  let startX, startY, endX, endY;
  
  if (isReverse) {
    // Reverse: from input text position back to output position
    let baseText = getCurrentInputText();
    startX = inputX + inputShift + textWidth(baseText) + textWidth(" ");
    startY = inputY;
    endX = dynamicOutputX;
    endY = outputY;
  } else {
    // Forward: from output position to input text
    startX = dynamicOutputX;
    startY = outputY;
    let baseText = getCurrentInputText();
    endX = inputX + inputShift + textWidth(baseText) + textWidth(" ");
    endY = inputY;
  }
  
  // Arc animation using quadratic bezier curve
  let t = animationProgress;
  let controlX = (startX + endX) / 2;
  let controlY = llmY + CONFIG.llmSize/2 + CONFIG.animation.arcDepth;
  
  // Quadratic bezier curve
  let x = (1-t)*(1-t)*startX + 2*(1-t)*t*controlX + t*t*endX;
  let y = (1-t)*(1-t)*startY + 2*(1-t)*t*controlY + t*t*endY;
  
  fill(50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(CONFIG.fonts.inputOutput);
  text(token, x, y);
}

/**
 * Draws both input and output arrows with equal lengths
 * Output arrow visibility depends on current state and animation status
 */
function drawArrows() {
  stroke(100);
  strokeWeight(3);
  
  // Input arrow - always show
  let arrowY = inputY;
  let arrowStartX = inputX + textWidth(CONFIG.inputText) + CONFIG.elementGap;
  let arrowEndX = llmX - CONFIG.llmSize/2 - CONFIG.elementGap;
  let actualArrowLength = calculateArrowLength();
  
  line(arrowStartX, arrowY, arrowEndX, arrowY);
  drawArrowHead(arrowEndX, arrowY, 0);
  
  // Output arrow - show when token is visible, during reverse animation, or when pulse is active
  if ((isTokenGenerationState() && !isAnimating) || (isAnimating && isTokenIntegrationState()) || llmPulse > 0) {
    let outArrowStartX = llmX + CONFIG.llmSize/2 + CONFIG.elementGap;
    let outArrowEndX = outArrowStartX + actualArrowLength;
    
    line(outArrowStartX, arrowY, outArrowEndX, arrowY);
    drawArrowHead(outArrowEndX, arrowY, 0);
  }
}

/**
 * Draws an arrow head at the specified position and angle
 * @param {number} x - X coordinate of arrow head tip
 * @param {number} y - Y coordinate of arrow head tip  
 * @param {number} angle - Rotation angle of arrow head in radians
 */
function drawArrowHead(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  noFill();
  line(-8, -4, 0, 0);
  line(-8, 4, 0, 0);
  pop();
}



/**
 * p5.js keyPressed function - handles user input for navigation
 * Right arrow advances states, left arrow reverses states
 * Prevents input during animations to avoid state corruption
 */
function keyPressed() {
  if (isAnimating) return;
  
  let maxStates = CONFIG.outputTokens.length * 2; // 2 states per token
  
  if (window.parent !== window) {
    // In reveal.js iframe - use D/A keys for demo control
    if (key === 'd' || key === 'D') {
      if (currentState < maxStates) {
        advanceState();
      } else {
        // Demo complete - signal parent to advance slide
        window.parent.postMessage('next-slide', '*');
      }
    } else if (key === 'a' || key === 'A') {
      if (currentState > 0) {
        reverseState();
      }
    }
  } else {
    // Standalone mode - use arrow keys
    if (keyCode === RIGHT_ARROW) {
      if (currentState < maxStates) {
        advanceState();
      }
    } else if (keyCode === LEFT_ARROW) {
      if (currentState > 0) {
        reverseState();
      }
    }
  }
}

// Global keydown listener to capture D/A keys even when iframe not focused
window.addEventListener('keydown', function(event) {
  if (window.parent !== window && (event.key === 'd' || event.key === 'D' || event.key === 'a' || event.key === 'A')) {
    event.preventDefault();
    keyPressed();
  }
}, true);

// Listen for direct demo commands from parent
window.addEventListener('message', function(event) {
  if (event.data === 'demo-advance') {
    if (isAnimating) return; // Prevent input during animations
    let maxStates = CONFIG.outputTokens.length * 2;
    if (currentState < maxStates) {
      advanceState();
    } else {
      window.parent.postMessage('next-slide', '*');
    }
  } else if (event.data === 'demo-reverse') {
    if (isAnimating) return; // Prevent input during animations
    if (currentState > 0) {
      reverseState();
    } else {
      // At first state, go to previous slide
      window.parent.postMessage('prev-slide', '*');
    }
  }
});

/**
 * Advances to the next state in the visualization
 * Even states trigger LLM processing and token generation
 * Odd states trigger token integration animations
 */
function advanceState() {
  if (currentState % 2 === 0) {
    // Even states: Generate token (LLM processing)
    llmHighlight = true;
    llmPulse = 1;
    setTimeout(() => { llmHighlight = false; }, 500);
    currentState++;
  } else {
    // Odd states: Animate token integration
    let tokenIndex = getCurrentTokenIndex();
    let tokenWidth = textWidth(" " + CONFIG.outputTokens[tokenIndex]);
    targetInputShift -= tokenWidth;
    
    isAnimating = true;
    animationProgress = 0;
  }
}

/**
 * Reverses to the previous state in the visualization
 * Handles both token removal and reverse arc animations
 */
function reverseState() {
  if (isTokenGenerationState()) {
    // Remove token (go back to previous even state)
    llmHighlight = false;
    currentState--;
  } else if (isTokenIntegrationState()) {
    // Reverse animation - token moves from input back to output
    isAnimating = true;
    animationProgress = 0;
    // Note: currentState stays the same during animation, will be decremented in completeStateTransition
  }
}

/**
 * Completes the current state transition after animations finish
 * Handles both forward progression and reverse cleanup
 */
function completeStateTransition() {
  if (isTokenGenerationState()) {
    // Forward animation complete - advance to next even state
    currentState++;
  } else if (isTokenIntegrationState()) {
    // Reverse animation complete - shift text back and decrement state
    let tokenIndex = getCurrentTokenIndex() - 1;
    let tokenWidth = textWidth(" " + CONFIG.outputTokens[tokenIndex]);
    targetInputShift += tokenWidth;
    currentState--;
  }
}
