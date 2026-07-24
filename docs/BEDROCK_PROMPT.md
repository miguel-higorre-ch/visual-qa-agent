# Bedrock Prompt Engineering Guide

## System Prompt

```
You are an expert visual QA agent. You receive two images of the same web interface: 
one "baseline" (correct/approved version) and one "current" (version to validate). 

Your task is to identify relevant visual differences for a development team, ignoring 
irrelevant noise such as antialiasing, subpixel rendering, or image compression differences.

For each relevant difference you detect, classify it by severity:
- **critical**: breaks functionality or usability (interactive element hidden, displaced 
  out of view, illegible)
- **minor**: visible change but not blocking (slight misalignment, inconsistent spacing)
- **cosmetic**: aesthetic change with no functional impact (color tone, shadow)

Respond ONLY in valid JSON format, with no additional text, using this structure:
```

## Response Schema

```json
{
  "summary": "general summary in one sentence",
  "diffs": [
    {
      "description": "clear and specific description of the change",
      "severity": "critical | minor | cosmetic",
      "bbox": { 
        "x": 0, 
        "y": 0, 
        "width": 0, 
        "height": 0 
      }
    }
  ]
}
```

## Example Interactions

### Example 1: Critical Button Displacement

**Input:** Baseline with centered submit button, Current with button shifted left and partially hidden

**Expected Output:**
```json
{
  "summary": "Submit button displaced 40px to the left and partially hidden behind sidebar",
  "diffs": [
    {
      "description": "The 'Submit' button has shifted 40 pixels to the left and is now partially obscured by the left sidebar, making it difficult to click",
      "severity": "critical",
      "bbox": { "x": 120, "y": 450, "width": 100, "height": 40 }
    }
  ]
}
```

### Example 2: Minor Spacing Issue

**Input:** Baseline with consistent 20px spacing, Current with 15px spacing

**Expected Output:**
```json
{
  "summary": "Reduced vertical spacing between form fields",
  "diffs": [
    {
      "description": "Vertical spacing between input fields reduced from 20px to 15px, making the form appear more compact",
      "severity": "minor",
      "bbox": { "x": 200, "y": 300, "width": 400, "height": 200 }
    }
  ]
}
```

### Example 3: Cosmetic Color Change

**Input:** Baseline with #3B82F6 button, Current with #2563EB button

**Expected Output:**
```json
{
  "summary": "Button color slightly darker",
  "diffs": [
    {
      "description": "Primary button color changed to a slightly darker shade of blue",
      "severity": "cosmetic",
      "bbox": { "x": 300, "y": 500, "width": 120, "height": 44 }
    }
  ]
}
```

### Example 4: Multiple Issues

**Input:** Multiple differences including critical and minor

**Expected Output:**
```json
{
  "summary": "Critical button issue and minor text alignment problem detected",
  "diffs": [
    {
      "description": "Login button moved outside visible viewport on mobile screens",
      "severity": "critical",
      "bbox": { "x": 450, "y": 600, "width": 100, "height": 40 }
    },
    {
      "description": "Header text alignment changed from center to left",
      "severity": "minor",
      "bbox": { "x": 0, "y": 20, "width": 800, "height": 60 }
    }
  ]
}
```

## Prompt Optimization Tips

1. **Be Specific About Context**: Mention the type of interface (login form, dashboard, etc.) for better context

2. **Provide Viewport Info**: Include viewport dimensions in the prompt for accurate relative positioning

3. **Add Element Labels**: If possible, annotate key interactive elements in the baseline

4. **Filter Noise**: Explicitly list what to ignore:
   - Font rendering differences
   - JPEG compression artifacts
   - Browser antialiasing
   - Dynamic content (dates, counters)

5. **Temperature Setting**: Use 0.2-0.3 for consistent, deterministic output

6. **Max Tokens**: Set to 2048 for detailed descriptions, 1024 for simple comparisons

## Testing the Prompt

Use these test cases to validate prompt effectiveness:

- [ ] Detects critical issues (hidden buttons, overflow)
- [ ] Ignores irrelevant pixel differences
- [ ] Provides accurate bounding boxes (within 5% margin)
- [ ] Returns valid JSON 100% of the time
- [ ] Classifies severity correctly
- [ ] Handles edge cases (identical images, completely different layouts)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Returns plain text instead of JSON | Add "ONLY valid JSON, no markdown" to prompt |
| Bounding boxes inaccurate | Provide image dimensions explicitly |
| Too many false positives | Strengthen the "ignore noise" section |
| Misclassifies severity | Add specific examples in system prompt |
| Truncated responses | Increase max_tokens to 2048+ |
