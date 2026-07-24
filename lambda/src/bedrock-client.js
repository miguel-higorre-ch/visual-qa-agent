const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { SYSTEM_PROMPT, createAnalysisPrompt } = require('./prompt');

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1'
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';
const MAX_TOKENS = parseInt(process.env.BEDROCK_MAX_TOKENS || '2048');
const TEMPERATURE = parseFloat(process.env.BEDROCK_TEMPERATURE || '0.2');

/**
 * Analyze two images using Amazon Bedrock Claude
 * @param {string} baselineImageBase64 - Baseline image as base64
 * @param {string} currentImageBase64 - Current image as base64
 * @returns {Promise<Object>} Analysis result with diffs array
 */
async function analyzeImages(baselineImageBase64, currentImageBase64) {
  console.log('Preparing Bedrock request...');
  console.log(`Model: ${MODEL_ID}`);
  console.log(`Max tokens: ${MAX_TOKENS}`);
  console.log(`Temperature: ${TEMPERATURE}`);

  try {
    // Construct the multimodal prompt
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: createAnalysisPrompt()
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: baselineImageBase64
            }
          },
          {
            type: 'text',
            text: 'Current version (version to validate):'
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: currentImageBase64
            }
          }
        ]
      }
    ];

    // Prepare Bedrock request
    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: SYSTEM_PROMPT,
      messages: messages
    };

    console.log('Invoking Bedrock model...');

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    const response = await bedrockClient.send(command);

    // Parse response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('Bedrock response received');
    console.log('Stop reason:', responseBody.stop_reason);
    console.log('Input tokens:', responseBody.usage?.input_tokens);
    console.log('Output tokens:', responseBody.usage?.output_tokens);

    // Extract the text content
    const textContent = responseBody.content.find(c => c.type === 'text');
    if (!textContent) {
      throw new Error('No text content in Bedrock response');
    }

    let analysisText = textContent.text.trim();
    console.log('Raw response:', analysisText.substring(0, 200) + '...');

    // Clean up response - remove markdown code blocks if present
    analysisText = analysisText
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    // Parse JSON
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', analysisText);
      throw new Error(`Invalid JSON response from Bedrock: ${parseError.message}`);
    }

    console.log('Successfully parsed analysis result');
    
    return analysisResult;

  } catch (error) {
    console.error('Error calling Bedrock:', error);
    
    if (error.name === 'ValidationException') {
      throw new Error(`Bedrock validation error: ${error.message}`);
    }
    
    if (error.name === 'ThrottlingException') {
      throw new Error('Bedrock API rate limit exceeded. Please try again later.');
    }
    
    if (error.name === 'AccessDeniedException') {
      throw new Error('Access denied to Bedrock. Check IAM permissions and model access.');
    }
    
    throw error;
  }
}

/**
 * Test Bedrock connectivity
 * @returns {Promise<boolean>} True if connection successful
 */
async function testConnection() {
  try {
    const testPrompt = 'Respond with: OK';
    const messages = [
      {
        role: 'user',
        content: [{ type: 'text', text: testPrompt }]
      }
    ];

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 10,
        messages: messages
      })
    });

    await bedrockClient.send(command);
    return true;
  } catch (error) {
    console.error('Bedrock connection test failed:', error);
    return false;
  }
}

module.exports = {
  analyzeImages,
  testConnection
};
