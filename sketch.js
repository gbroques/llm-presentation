// ===== CONFIGURATION =====
const CONFIG = {
  // Sample Data - EASILY CHANGEABLE!
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

function getCurrentTokenIndex() {
  return Math.floor(currentState / 2);
}

function isTokenGenerationState() {
  return currentState % 2 === 1; // Odd states show tokens
}

function isTokenIntegrationState() {
  return currentState % 2 === 0 && currentState > 0; // Even states (except 0) integrate tokens
}

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
  
  // Show static token when in generation state and not animating
  if (isTokenGenerationState() && !isAnimating) {
    fill(50);
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
  
  // Output arrow - show when token is visible or during reverse animation
  if ((isTokenGenerationState() && !isAnimating) || (isAnimating && isTokenIntegrationState())) {
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
