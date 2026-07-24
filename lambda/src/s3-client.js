const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * Download image from S3 and return as base64
 * @param {string} key - S3 object key
 * @returns {Promise<string>} Base64 encoded image
 */
async function getImageFromS3(key) {
  if (!BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable not set');
  }

  try {
    console.log(`Fetching s3://${BUCKET_NAME}/${key}`);

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    const response = await s3Client.send(command);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Convert to base64
    const base64 = buffer.toString('base64');
    
    console.log(`Successfully fetched ${key} (${buffer.length} bytes)`);
    
    return base64;

  } catch (error) {
    console.error(`Error fetching ${key} from S3:`, error);
    
    if (error.name === 'NoSuchKey') {
      throw new Error(`Image not found in S3: ${key}`);
    }
    
    if (error.name === 'AccessDenied') {
      throw new Error(`Access denied to S3 object: ${key}`);
    }
    
    throw new Error(`Failed to fetch image from S3: ${error.message}`);
  }
}

/**
 * Check if an object exists in S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} True if object exists
 */
async function objectExists(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return false;
    }
    throw error;
  }
}

module.exports = {
  getImageFromS3,
  objectExists
};
