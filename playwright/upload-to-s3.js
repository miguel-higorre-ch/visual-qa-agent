const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_BASELINE_PREFIX = process.env.S3_BASELINE_PREFIX || 'baseline/';
const S3_CURRENT_PREFIX = process.env.S3_CURRENT_PREFIX || 'current/';

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASELINE_DIR = path.join(SCREENSHOTS_DIR, 'baseline');
const CURRENT_DIR = path.join(SCREENSHOTS_DIR, 'current');

/**
 * Validate required environment variables
 */
function validateConfig() {
  if (!S3_BUCKET_NAME) {
    console.error('❌ Error: S3_BUCKET_NAME not configured in .env file');
    console.log('\n💡 Please set S3_BUCKET_NAME in your .env file:');
    console.log('   S3_BUCKET_NAME=your-bucket-name');
    process.exit(1);
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ Error: AWS credentials not configured');
    console.log('\n💡 Please configure AWS credentials in .env:');
    console.log('   AWS_ACCESS_KEY_ID=your_key');
    console.log('   AWS_SECRET_ACCESS_KEY=your_secret');
    process.exit(1);
  }
}

/**
 * Initialize S3 client
 */
function createS3Client() {
  return new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
}

/**
 * Upload a single file to S3
 * @param {S3Client} s3Client - AWS S3 client
 * @param {string} filePath - Local file path
 * @param {string} s3Key - S3 object key
 */
async function uploadFile(s3Client, filePath, s3Key) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    console.log(`  ↑ Uploading ${fileName}...`);

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: fileStream,
        ContentType: 'image/png',
        Metadata: {
          'uploaded-by': 'visual-qa-agent',
          'upload-timestamp': new Date().toISOString()
        }
      }
    });

    await upload.done();
    
    console.log(`  ✓ Uploaded: s3://${S3_BUCKET_NAME}/${s3Key}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to upload ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Upload all screenshots from a directory
 * @param {S3Client} s3Client - AWS S3 client
 * @param {string} localDir - Local directory path
 * @param {string} s3Prefix - S3 prefix for uploaded files
 */
async function uploadDirectory(s3Client, localDir, s3Prefix, label) {
  if (!fs.existsSync(localDir)) {
    console.log(`⚠️  Directory not found: ${localDir}`);
    return 0;
  }

  const files = fs.readdirSync(localDir).filter(file => file.endsWith('.png'));
  
  if (files.length === 0) {
    console.log(`⚠️  No PNG files found in ${localDir}`);
    return 0;
  }

  console.log(`\n📤 Uploading ${files.length} ${label} screenshots...\n`);

  let uploadedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(localDir, file);
    const s3Key = `${s3Prefix}${file}`;
    
    const success = await uploadFile(s3Client, filePath, s3Key);
    if (success) uploadedCount++;
  }

  return uploadedCount;
}

/**
 * Main upload function
 */
async function uploadAll() {
  console.log('☁️  Visual QA Agent - S3 Upload\n');
  
  validateConfig();
  
  console.log(`Bucket: ${S3_BUCKET_NAME}`);
  console.log(`Region: ${AWS_REGION}\n`);

  const s3Client = createS3Client();

  try {
    let totalUploaded = 0;

    // Upload baseline screenshots
    const baselineCount = await uploadDirectory(
      s3Client, 
      BASELINE_DIR, 
      S3_BASELINE_PREFIX,
      'BASELINE'
    );
    totalUploaded += baselineCount;

    // Upload current screenshots
    const currentCount = await uploadDirectory(
      s3Client, 
      CURRENT_DIR, 
      S3_CURRENT_PREFIX,
      'CURRENT'
    );
    totalUploaded += currentCount;

    console.log(`\n🎉 Upload complete!`);
    console.log(`   Total files uploaded: ${totalUploaded}`);
    console.log(`   Baseline: ${baselineCount}`);
    console.log(`   Current: ${currentCount}`);
    
    if (totalUploaded > 0) {
      console.log(`\n📊 View in S3 Console:`);
      console.log(`   https://s3.console.aws.amazon.com/s3/buckets/${S3_BUCKET_NAME}`);
      console.log(`\n💡 Next step: Trigger analysis via dashboard or API`);
    }

  } catch (error) {
    console.error('\n❌ Upload failed:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
(async () => {
  try {
    await uploadAll();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();
