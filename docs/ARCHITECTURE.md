# Architecture Documentation

## System Overview

Visual QA Agent is a serverless application that uses multimodal AI to detect and classify visual differences between web interface screenshots.

## Component Diagram

```
┌─────────────────┐
│  Playwright     │
│  Script         │
└────────┬────────┘
         │ captures screenshots
         ▼
┌─────────────────┐
│  Amazon S3      │
│  Image Storage  │
└────────┬────────┘
         │
         │ trigger
         ▼
┌─────────────────┐      ┌──────────────────┐
│  API Gateway    │─────▶│  AWS Lambda      │
│  /analyze       │      │  Orchestrator    │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  │ API call
                                  ▼
                         ┌──────────────────┐
                         │ Amazon Bedrock   │
                         │ Claude 3 Sonnet  │
                         └────────┬─────────┘
                                  │
                                  │ JSON response
                                  ▼
                         ┌──────────────────┐
                         │  Lambda          │
                         │  Parse & Return  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Web Dashboard   │
                         │  (S3 + Amplify)  │
                         └──────────────────┘
```

## Data Flow

1. **Capture Phase**
   - Playwright opens baseline and current versions of demo app
   - Takes screenshots at specified viewport sizes
   - Uploads images to S3 with timestamped keys

2. **Analysis Phase**
   - Dashboard or API client sends POST request to API Gateway
   - Lambda function retrieves images from S3
   - Constructs multimodal prompt with both images
   - Calls Bedrock Claude model
   - Receives structured JSON with detected differences

3. **Display Phase**
   - Lambda validates and returns JSON to client
   - Dashboard renders images side-by-side
   - Draws bounding boxes over detected areas
   - Lists differences with severity badges

## Bedrock Prompt Structure

```json
{
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 2048,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "You are an expert visual QA agent..."
        },
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/png",
            "data": "<baseline_image_base64>"
          }
        },
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/png",
            "data": "<current_image_base64>"
          }
        }
      ]
    }
  ]
}
```

## Security

- **S3 Buckets**: Private with presigned URL access
- **Lambda**: Least-privilege IAM role (S3 read + Bedrock invoke)
- **API Gateway**: CORS enabled, rate limiting configured
- **Secrets**: Environment variables, no hardcoded credentials

## Performance

- **Lambda**: 512MB memory, 30s timeout
- **Bedrock**: ~3-5 seconds response time for typical screenshots
- **S3**: Standard storage class (can optimize to IA for old baselines)

## Scalability

- Lambda auto-scales to 1000 concurrent executions
- S3 handles unlimited requests
- Bedrock has default quotas (request increase if needed)

## Monitoring

- **CloudWatch Logs**: Lambda execution logs
- **CloudWatch Metrics**: Lambda invocations, errors, duration
- **X-Ray**: Request tracing (optional)

## Cost Optimization

- Use S3 lifecycle policies to archive old screenshots
- Set Lambda reserved concurrency to control costs
- Monitor Bedrock token usage
- Cache results in S3 for identical comparisons
