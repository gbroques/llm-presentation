let currentState = 0;
let inputText = "Mike is quick,";
let outputTokens = ["he", "moves", "quickly", "."];
let isAnimating = false;
let animationProgress = 0;
let llmPulse = 0;
let llmHighlight = false;
let inputShift = 0;
let targetInputShift = 0;

// Positions
let inputX, inputY;
let llmX, llmY, llmSize;
let outputX, outputY;
let canvasWidth = 1400; // Will be updated in setup
let canvasHeight = 600; // Will be updated in setup

function setup() {
  // Use full window dimensions
  canvasWidth = windowWidth;
  canvasHeight = windowHeight * 0.7; // Use 70% of viewport height
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  
  // Center LLM box on canvas, position other elements relative to it
  llmX = canvasWidth / 2; // Center LLM box
  llmY = canvasHeight / 2;
  llmSize = 180;
  
  // Position input text closer to LLM box to make arrows shorter
  let inputTextWidth = 250; // Estimated width for "Mike is quick,"
  let shorterArrowLength = 80; // Desired shorter arrow length
  
  inputX = llmX - llmSize/2 - 20 - shorterArrowLength - 20 - inputTextWidth; // Work backwards from LLM
  inputY = canvasHeight / 2;
  
  outputX = 0; // Will be calculated dynamically
  outputY = canvasHeight / 2;
  
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background(245);
  
  // Update animations
  if (isAnimating) {
    animationProgress += 0.015; // Slower animation (was 0.02)
    if (animationProgress >= 1) {
      animationProgress = 0;
      isAnimating = false;
      completeStateTransition();
    }
  }
  
  // Update input shift animation
  inputShift = lerp(inputShift, targetInputShift, 0.1);
  
  if (llmPulse > 0) {
    llmPulse -= 0.05;
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
  textSize(32); // Larger input text
  
  let displayText = getCurrentInputText();
  text(displayText, inputX + inputShift, inputY);
}

function getCurrentInputText() {
  // During reverse animation, hide the token that's moving
  if (isAnimating && (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8)) {
    if (currentState === 2) {
      return inputText; // Hide "he" during reverse
    } else if (currentState === 4) {
      return inputText + " " + outputTokens[0]; // Hide "moves" during reverse
    } else if (currentState === 6) {
      return inputText + " " + outputTokens[0] + " " + outputTokens[1]; // Hide "quickly" during reverse
    } else if (currentState === 8) {
      return inputText + " " + outputTokens[0] + " " + outputTokens[1] + " " + outputTokens[2]; // Hide "." during reverse
    }
  }
  
  // Normal display
  if (currentState >= 8) {
    return inputText + " " + outputTokens[0] + " " + outputTokens[1] + " " + outputTokens[2] + outputTokens[3];
  } else if (currentState >= 6) {
    return inputText + " " + outputTokens[0] + " " + outputTokens[1] + " " + outputTokens[2];
  } else if (currentState >= 4) {
    return inputText + " " + outputTokens[0] + " " + outputTokens[1];
  } else if (currentState >= 2) {
    return inputText + " " + outputTokens[0];
  }
  return inputText;
}

function drawLLMBox() {
  // Calculate pulse effect
  let pulseSize = llmSize + (llmPulse * 10);
  
  // Box styling
  if (llmHighlight) {
    fill(150, 200, 255, 120); // Brighter, lighter blue
    stroke(100, 180, 255); // Brighter blue border
  } else {
    fill(255);
    stroke(150);
  }
  strokeWeight(2);
  
  // Draw box
  rectMode(CENTER);
  rect(llmX, llmY, pulseSize, pulseSize);
  
  // Draw text
  fill(50);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(42); // Much larger LLM text
  text("LLM", llmX, llmY);
  textSize(32); // Reset to normal text size
}

function drawOutputToken() {
  // Calculate arrow length same way as in drawArrows
  let arrowStartX = inputX + textWidth(inputText) + 20; // Same 20px gap
  let arrowEndX = llmX - llmSize/2 - 20;
  let actualArrowLength = arrowEndX - arrowStartX;
  
  let rightArrowEndX = llmX + llmSize/2 + 20 + actualArrowLength;
  let dynamicOutputX = rightArrowEndX + 20; // Same 20px gap after arrow
  
  // Show static token when generated but not animating
  if ((currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) && !isAnimating) {
    fill(50);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(32); // Larger output token text
    let token = outputTokens[Math.floor(currentState / 2)];
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
  let token = outputTokens[tokenIndex];
  
  // Calculate arrow length same way as in drawArrows
  let arrowStartX = inputX + textWidth(inputText) + 20; // Same 20px gap
  let arrowEndX = llmX - llmSize/2 - 20;
  let actualArrowLength = arrowEndX - arrowStartX;
  
  let rightArrowEndX = llmX + llmSize/2 + 20 + actualArrowLength;
  let dynamicOutputX = rightArrowEndX + 20;
  
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
  let controlY = llmY + llmSize/2 + 200; // Much further below LLM box
  
  // Quadratic bezier curve
  let x = (1-t)*(1-t)*startX + 2*(1-t)*t*controlX + t*t*endX;
  let y = (1-t)*(1-t)*startY + 2*(1-t)*t*controlY + t*t*endY;
  
  fill(50);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(32); // Larger animating token text
  text(token, x, y);
}

function drawArrows() {
  stroke(100);
  strokeWeight(3); // Thicker arrows
  
  // Input arrow - use same 20px gap as output side
  let arrowY = inputY;
  let arrowStartX = inputX + textWidth(inputText) + 20; // Same 20px gap as output side
  let arrowEndX = llmX - llmSize/2 - 20; // 20px gap from LLM box
  let actualArrowLength = arrowEndX - arrowStartX;
  
  line(arrowStartX, arrowY, arrowEndX, arrowY);
  drawArrowHead(arrowEndX, arrowY, 0);
  
  // Output arrow - use same actual length as left arrow
  if (((currentState === 1 || currentState === 3 || currentState === 5 || currentState === 7) && !isAnimating) || 
      (isAnimating && (currentState === 2 || currentState === 4 || currentState === 6 || currentState === 8))) {
    let outArrowStartX = llmX + llmSize/2 + 20; // 20px gap from LLM box
    let outArrowEndX = outArrowStartX + actualArrowLength; // Same length as left arrow
    
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
  
  if (keyCode === RIGHT_ARROW) {
    if (currentState < 8) { // Now goes up to state 8 for 4 tokens
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
    let tokenWidth = textWidth(" " + outputTokens[tokenIndex]);
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
    let tokenWidth = textWidth(" " + outputTokens[tokenIndex]);
    targetInputShift += tokenWidth;
    currentState--;
  }
}
