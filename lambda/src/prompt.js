/**
 * System prompt for Bedrock Claude
 * Defines the agent's role and response format
 */
const SYSTEM_PROMPT = `You are an expert visual QA agent specialized in detecting meaningful visual differences in web interfaces.

Your task is to compare two screenshots of the same web page: a "baseline" (correct/approved version) and a "current" (version to validate).

IMPORTANT INSTRUCTIONS:
1. Identify ONLY relevant visual differences that matter to developers and QA teams
2. IGNORE irrelevant differences such as:
   - Antialiasing and subpixel rendering variations
   - JPEG/PNG compression artifacts
   - Browser font rendering differences
   - Minimal color variations due to color profiles
   - Dynamic content (timestamps, random IDs)
   
3. Classify each difference by severity:
   - "critical": Breaks functionality or usability (button hidden/displaced out of clickable area, text illegible, form fields missing, layout completely broken)
   - "minor": Visible change but not blocking (slight misalignment, spacing inconsistency, elements slightly shifted but still usable)
   - "cosmetic": Aesthetic change with no functional impact (color tone difference, shadow variation, font weight change)

4. For each difference, provide:
   - Clear description of WHAT changed
   - WHERE it changed (specific element)
   - Approximate bounding box coordinates (x, y, width, height in pixels from top-left)

5. Respond ONLY with valid JSON, no markdown formatting, no additional text.

RESPONSE FORMAT (strict JSON):
{
  "summary": "One sentence summarizing the most important findings",
  "diffs": [
    {
      "description": "Detailed description of the change",
      "severity": "critical | minor | cosmetic",
      "bbox": { "x": 0, "y": 0, "width": 0, "height": 0 }
    }
  ]
}

If the images are identical or have only irrelevant differences, return:
{
  "summary": "No significant visual differences detected",
  "diffs": []
}`;

/**
 * Create the analysis prompt for the user message
 * @returns {string} Analysis prompt
 */
function createAnalysisPrompt() {
  return `Compare these two screenshots and identify meaningful visual differences.

First image: Baseline version (correct/approved)
Second image: Current version (version to validate)

Analyze carefully and respond with JSON only.`;
}

/**
 * Create a prompt for specific viewport analysis
 * @param {string} viewportName - Name of viewport (e.g., "desktop", "mobile")
 * @param {number} width - Viewport width
 * @param {number} height - Viewport height
 * @returns {string} Viewport-specific analysis prompt
 */
function createViewportAnalysisPrompt(viewportName, width, height) {
  return `Compare these two screenshots taken at ${viewportName} viewport (${width}x${height}).

First image: Baseline version (correct/approved)
Second image: Current version (version to validate)

Pay special attention to:
- Responsive design issues
- Element overflow or clipping
- Layout shifts specific to this viewport
- Touch target sizes (for mobile viewports)

Analyze carefully and respond with JSON only.`;
}

/**
 * Create a focused prompt for specific element analysis
 * @param {string} elementDescription - Description of element to focus on
 * @returns {string} Element-focused analysis prompt
 */
function createFocusedAnalysisPrompt(elementDescription) {
  return `Compare these two screenshots, focusing specifically on: ${elementDescription}

First image: Baseline version (correct/approved)
Second image: Current version (version to validate)

Pay special attention to changes in the specified element and its immediate surroundings.

Analyze carefully and respond with JSON only.`;
}

module.exports = {
  SYSTEM_PROMPT,
  createAnalysisPrompt,
  createViewportAnalysisPrompt,
  createFocusedAnalysisPrompt
};
