# Lambda Function — Visual QA Analyzer

AWS Lambda function that orchestrates the visual comparison using Amazon Bedrock.

## Flow

1. Receives request with S3 image keys
2. Downloads baseline and current images from S3
3. Constructs structured prompt
4. Calls Amazon Bedrock (Claude multimodal)
5. Parses and validates JSON response
6. Returns structured diff data

## Structure

```
lambda/
├── src/
│   ├── index.js           # Main Lambda handler
│   ├── bedrock-client.js  # Bedrock API wrapper
│   ├── s3-client.js       # S3 operations
│   ├── prompt.js          # Prompt templates
│   └── validator.js       # Response validation
├── tests/                 # Unit tests
├── package.json
└── README.md
```

## Deployment

### Using AWS SAM
```bash
sam build
sam deploy --guided
```

### Using Serverless Framework
```bash
serverless deploy
```

### Manual Deployment
```bash
npm install
zip -r function.zip .
aws lambda update-function-code --function-name visual-qa-agent-analyzer --zip-file fileb://function.zip
```

## Environment Variables

```
AWS_REGION=us-east-1
S3_BUCKET_NAME=visual-qa-agent-images
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

## Request Format

```json
{
  "baselineKey": "baseline/screenshot-1.png",
  "currentKey": "current/screenshot-1.png"
}
```

## Response Format

```json
{
  "summary": "Submit button displaced 40px to the left",
  "diffs": [
    {
      "description": "Submit button shifted and partially hidden",
      "severity": "critical",
      "bbox": { "x": 100, "y": 200, "width": 120, "height": 40 }
    }
  ]
}
```

## Testing Locally

```bash
npm test
npm run test:integration
```
