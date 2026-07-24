# Deployment Guide

## Prerequisites

- AWS Account with Bedrock access enabled in your region
- AWS CLI configured (`aws configure`)
- Node.js 18+ installed
- Git installed

## Step 1: Enable Amazon Bedrock Access

1. Go to AWS Console → Bedrock → Model access
2. Request access to **Claude 3 Sonnet**
3. Wait for approval (usually instant)

## Step 2: Create S3 Bucket

```bash
aws s3 mb s3://visual-qa-agent-images-YOUR-UNIQUE-ID
aws s3api put-bucket-versioning --bucket visual-qa-agent-images-YOUR-UNIQUE-ID --versioning-configuration Status=Enabled
```

## Step 3: Deploy Lambda Function

```bash
cd lambda
npm install
zip -r function.zip .

aws lambda create-function \
  --function-name visual-qa-agent-analyzer \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR-ACCOUNT:role/lambda-execution-role \
  --handler src/index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{S3_BUCKET_NAME=visual-qa-agent-images-YOUR-UNIQUE-ID,BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0}"
```

## Step 4: Create IAM Role for Lambda

```bash
# Create trust policy
cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role --role-name visual-qa-lambda-role --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy --role-name visual-qa-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create custom policy for S3 and Bedrock
cat > lambda-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::visual-qa-agent-images-YOUR-UNIQUE-ID/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
    }
  ]
}
EOF

aws iam put-role-policy --role-name visual-qa-lambda-role --policy-name VisualQAPolicy --policy-document file://lambda-policy.json
```

## Step 5: Create API Gateway

```bash
# Create REST API
aws apigateway create-rest-api --name visual-qa-api

# Get the API ID from the response, then create a resource
aws apigateway get-resources --rest-api-id YOUR-API-ID

# Create /analyze endpoint
aws apigateway create-resource --rest-api-id YOUR-API-ID --parent-id ROOT-ID --path-part analyze

# Create POST method
aws apigateway put-method --rest-api-id YOUR-API-ID --resource-id RESOURCE-ID --http-method POST --authorization-type NONE

# Integrate with Lambda
aws apigateway put-integration --rest-api-id YOUR-API-ID --resource-id RESOURCE-ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:REGION:ACCOUNT:function:visual-qa-agent-analyzer/invocations

# Deploy API
aws apigateway create-deployment --rest-api-id YOUR-API-ID --stage-name prod
```

## Step 6: Deploy Dashboard

```bash
cd dashboard
npm install
npm run build

# Create S3 bucket for static hosting
aws s3 mb s3://visual-qa-dashboard-YOUR-UNIQUE-ID

# Configure static website
aws s3 website s3://visual-qa-dashboard-YOUR-UNIQUE-ID --index-document index.html

# Upload build
aws s3 sync build/ s3://visual-qa-dashboard-YOUR-UNIQUE-ID --acl public-read

# Get website URL
echo "Dashboard: http://visual-qa-dashboard-YOUR-UNIQUE-ID.s3-website-REGION.amazonaws.com"
```

## Step 7: Test End-to-End

```bash
# Start demo apps
cd demo-app
npm install
npm start

# In another terminal, capture screenshots
cd playwright
npm install
npx playwright install
npm run capture
npm run upload

# Access dashboard and trigger analysis
```

## Troubleshooting

### Lambda Timeout
Increase timeout: `aws lambda update-function-configuration --function-name visual-qa-agent-analyzer --timeout 60`

### Bedrock Access Denied
Verify model access in Bedrock console and check IAM permissions

### CORS Errors
Enable CORS in API Gateway for OPTIONS method

### S3 Access Denied
Check bucket policy and Lambda IAM role permissions

## Clean Up

```bash
# Delete Lambda
aws lambda delete-function --function-name visual-qa-agent-analyzer

# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id YOUR-API-ID

# Delete S3 buckets
aws s3 rb s3://visual-qa-agent-images-YOUR-UNIQUE-ID --force
aws s3 rb s3://visual-qa-dashboard-YOUR-UNIQUE-ID --force

# Delete IAM role
aws iam delete-role --role-name visual-qa-lambda-role
```
