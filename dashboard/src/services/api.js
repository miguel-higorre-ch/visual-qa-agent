import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/analyze';

/**
 * Analyze two images using the Visual QA Agent API
 * @param {Object} baselineImage - Baseline image object with file and preview
 * @param {Object} currentImage - Current image object with file and preview
 * @returns {Promise<Object>} Analysis result
 */
export async function analyzeImages(baselineImage, currentImage) {
  try {
    // Convert base64 images to files for upload
    const baselineBase64 = baselineImage.preview.split(',')[1];
    const currentBase64 = currentImage.preview.split(',')[1];

    const requestBody = {
      baseline: baselineBase64,
      current: currentBase64,
      baselineKey: `temp/${Date.now()}-baseline.png`,
      currentKey: `temp/${Date.now()}-current.png`
    };

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || 'Analysis failed');
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      throw new Error(
        error.response.data.message || 
        error.response.data.error || 
        `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection and API URL.');
    } else {
      // Error setting up request
      throw new Error(error.message || 'Failed to analyze images');
    }
  }
}

/**
 * Mock analysis for local testing without backend
 * @param {Object} baselineImage 
 * @param {Object} currentImage 
 * @returns {Promise<Object>}
 */
export async function mockAnalyzeImages(baselineImage, currentImage) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    analysis: {
      summary: "Submit button displaced 40px to the left and partially hidden behind sidebar",
      diffs: [
        {
          description: "The 'Sign In' button has shifted 50% to the left and is now partially cut off from the visible viewport, making it difficult or impossible to click",
          severity: "critical",
          bbox: { x: 120, y: 450, width: 180, height: 44 }
        },
        {
          description: "Vertical spacing between form fields reduced from 20px to 12px, making the form appear more compact",
          severity: "minor",
          bbox: { x: 40, y: 280, width: 340, height: 120 }
        },
        {
          description: "The 'Forgot password?' link color changed from blue (#667eea) to purple (#764ba2)",
          severity: "cosmetic",
          bbox: { x: 280, y: 340, width: 100, height: 16 }
        }
      ]
    },
    metadata: {
      baselineKey: 'baseline/test.png',
      currentKey: 'current/test.png',
      timestamp: new Date().toISOString(),
      diffsCount: 3
    }
  };
}

/**
 * Test API connectivity
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
