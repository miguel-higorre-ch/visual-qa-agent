const { getImageFromS3 } = require('./s3-client');
const { analyzeImages } = require('./bedrock-client');
const { validateResponse } = require('./validator');

/**
 * Lambda handler for Visual QA Agent
 * @param {Object} event - API Gateway event
 * @returns {Object} API Gateway response
 */
exports.handler = async (event) => {
  console.log('Visual QA Agent - Analysis started');
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    // Parse request body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    const { baselineKey, currentKey } = body;

    // Validate input
    if (!baselineKey || !currentKey) {
      return createResponse(400, {
        error: 'Missing required parameters',
        message: 'Both baselineKey and currentKey are required'
      });
    }

    console.log(`Baseline image: ${baselineKey}`);
    console.log(`Current image: ${currentKey}`);

    // Download images from S3
    console.log('Downloading images from S3...');
    const [baselineImage, currentImage] = await Promise.all([
      getImageFromS3(baselineKey),
      getImageFromS3(currentKey)
    ]);

    console.log(`Baseline image size: ${baselineImage.length} bytes`);
    console.log(`Current image size: ${currentImage.length} bytes`);

    // Analyze images with Bedrock
    console.log('Analyzing images with Bedrock...');
    const analysisResult = await analyzeImages(baselineImage, currentImage);

    // Validate response structure
    console.log('Validating response...');
    const validation = validateResponse(analysisResult);
    
    if (!validation.valid) {
      console.error('Invalid response from Bedrock:', validation.errors);
      return createResponse(500, {
        error: 'Invalid analysis result',
        details: validation.errors
      });
    }

    console.log('Analysis complete');
    console.log(`Found ${analysisResult.diffs.length} differences`);

    // Return successful response
    return createResponse(200, {
      success: true,
      analysis: analysisResult,
      metadata: {
        baselineKey,
        currentKey,
        timestamp: new Date().toISOString(),
        diffsCount: analysisResult.diffs.length
      }
    });

  } catch (error) {
    console.error('Error in Lambda handler:', error);
    
    return createResponse(500, {
      error: 'Analysis failed',
      message: error.message,
      type: error.name
    });
  }
};

/**
 * Create standardized API Gateway response
 * @param {number} statusCode - HTTP status code
 * @param {Object} body - Response body
 * @returns {Object} API Gateway response object
 */
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}
