// ===== CONFIGURATION =====
const CONFIG = {
  // Sample Data
  inputText: "Mike is quick,",
  outputTokens: ["he", "moves", "quickly", "."],
  
  // Layout & Spacing
  elementGap: 20,           // Gap between all elements
  outerPadding: 100,        // Padding from screen edges
  
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

function draw() {
  background(245);
  
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

function drawInputText() {
  fill(50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(CONFIG.fonts.inputOutput);
  
  let displayText = getCurrentInputText();
  text(displayText, inputX + inputShift, inputY);
}

// ===== HELPER FUNCTIONS =====
function calculateArrowLength() {
  let arrowStartX = inputX + textWidth(CONFIG.inputText) + CONFIG.elementGap;
  let arrowEndX = llmX - CONFIG.llmSize/2 - CONFIG.elementGap;
  return arrowEndX - arrowStartX;
}

function getOutputTokenPosition() {
  let arrowLength = calculateArrowLength();
  let rightArrowEndX = llmX + CONFIG.llmSize/2 + CONFIG.elementGap + arrowLength;
  return rightArrowEndX + CONFIG.elementGap;
}

function getCurrentInputText() {
  // During reverse animation, hide the token that's moving
  if (isAnimating && (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8)) {
    if (currentState === 2) {
      return CONFIG.inputText; // Hide first token during reverse
    } else if (currentState === 4) {
      return CONFIG.inputText + " " + CONFIG.outputTokens[0]; // Hide second token during reverse
    } else if (currentState === 6) {
      return CONFIG.inputText + " " + CONFIG.outputTokens[0] + " " + CONFIG.outputTokens[1]; // Hide third token during reverse
    } else if (currentState === 8) {
      return CONFIG.inputText + " " + CONFIG.outputTokens[0] + " " + CONFIG.outputTokens[1] + " " + CONFIG.outputTokens[2]; // Hide fourth token during reverse
    }
  }
  
  // Normal display
  if (currentState >= 8) {
    return CONFIG.inputText + " " + CONFIG.outputTokens[0] + " " + CONFIG.outputTokens[1] + " " + CONFIG.outputTokens[2] + CONFIG.outputTokens[3];
  } else if (currentState >= 6) {
    return CONFIG.inputText + " " + CONFIG.outputTokens[0] + " " + CONFIG.outputTokens[1] + " " + CONFIG.outputTokens[2];
  } else if (currentState >= 4) {
    return CONFIG.inputText + " " + CONFIG.outputTokens[0] + " " + CONFIG.outputTokens[1];
  } else if (currentState >= 2) {
    return CONFIG.inputText + " " + CONFIG.outputTokens[0];
  }
  return CONFIG.inputText;
}

function drawLLMBox() {
  // Calculate pulse effect
  let pulseSize = CONFIG.llmSize + (llmPulse * 10);
  
  // Box styling
  if (llmHighlight) {
    fill(...CONFIG.llmColors.highlight.fill);
    stroke(...CONFIG.llmColors.highlight.stroke);
  } else {
    fill(...CONFIG.llmColors.normal.fill);
    stroke(...CONFIG.llmColors.normal.stroke);
  }
  strokeWeight(2);
  
  // Draw box
  rectMode(CENTER);
  rect(llmX, llmY, pulseSize, pulseSize);
  
  // Draw text
  fill(50);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(CONFIG.fonts.llm);
  text("LLM", llmX, llmY);
  textSize(CONFIG.fonts.inputOutput); // Reset to normal text size
}

function drawOutputToken() {
  let dynamicOutputX = getOutputTokenPosition();
  
  // Show static token when generated but not animating
  if ((currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) && !isAnimating) {
    fill(50);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(CONFIG.fonts.inputOutput);
    let token = CONFIG.outputTokens[Math.floor(currentState / 2)];
    text(token, dynamicOutputX, outputY);
  }
  
  // Draw animating token during integration (forward)
  if (isAnimating && (currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7)) {
    drawAnimatingToken(false); // forward animation
  }
  
  // Draw animating token during reverse (backward) - token disappears from input, only shows arc
  if (isAnimating && (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8)) {
    drawAnimatingToken(true); // reverse animation
  }
}

function drawAnimatingToken(isReverse = false) {
  let tokenIndex = isReverse ? Math.floor((currentState - 2) / 2) : Math.floor(currentState / 2);
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

function drawArrows() {
  stroke(100);
  strokeWeight(3);
  
  // Input arrow - use helper function
  let arrowY = inputY;
  let arrowStartX = inputX + textWidth(CONFIG.inputText) + CONFIG.elementGap;
  let arrowEndX = llmX - CONFIG.llmSize/2 - CONFIG.elementGap;
  let actualArrowLength = calculateArrowLength();
  
  line(arrowStartX, arrowY, arrowEndX, arrowY);
  drawArrowHead(arrowEndX, arrowY, 0);
  
  // Output arrow - use same actual length as left arrow
  if (((currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) && !isAnimating) || 
      (isAnimating && (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8))) {
    let outArrowStartX = llmX + CONFIG.llmSize/2 + CONFIG.elementGap;
    let outArrowEndX = outArrowStartX + actualArrowLength;
    
    line(outArrowStartX, arrowY, outArrowEndX, arrowY);
    drawArrowHead(outArrowEndX, arrowY, 0);
  }
}

function drawArrowHead(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  noFill();
  line(-8, -4, 0, 0);
  line(-8, 4, 0, 0);
  pop();
}



function keyPressed() {
  if (isAnimating) return;
  
  let maxStates = CONFIG.outputTokens.length * 2; // 2 states per token
  
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

function advanceState() {
  if (currentState === 0 || currentState === 2 || currentState === 4 || currentState === 6) {
    // Generate token
    llmHighlight = true;
    llmPulse = 1;
    setTimeout(() => { llmHighlight = false; }, 500);
    currentState++;
  } else if (currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) {
    // Animate token integration - shift input text left first
    let tokenIndex = Math.floor(currentState / 2);
    let tokenWidth = textWidth(" " + CONFIG.outputTokens[tokenIndex]);
    targetInputShift -= tokenWidth;
    
    isAnimating = true;
    animationProgress = 0;
  }
}

function reverseState() {
  if (currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) {
    // Remove token
    llmHighlight = false;
    currentState--;
  } else if (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8) {
    // Reverse animation - token moves from input back to output, then shift text right
    isAnimating = true;
    animationProgress = 0;
    // Note: currentState stays the same during animation, will be decremented in completeStateTransition
  }
}

function completeStateTransition() {
  if (currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) {
    // Forward animation complete - advance state and shift text
    currentState++;
  } else if (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8) {
    // Reverse animation complete - shift text back and decrement state
    let tokenIndex = Math.floor((currentState - 2) / 2);
    let tokenWidth = textWidth(" " + CONFIG.outputTokens[tokenIndex]);
    targetInputShift += tokenWidth;
    currentState--;
  }
}
