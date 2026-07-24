# Manual AWS Setup Guide

Step-by-step instructions for setting up Visual QA Agent infrastructure via AWS Console.

## 1. Enable Bedrock Access

1. Open AWS Console
2. Navigate to **Amazon Bedrock**
3. Click **Model access** in left sidebar
4. Click **Request access**
5. Select **Claude 3 Sonnet**
6. Click **Request model access**
7. Wait for approval (usually instant)

## 2. Create S3 Bucket

1. Navigate to **S3**
2. Click **Create bucket**
3. Name: `visual-qa-agent-images-YOUR-NAME`
4. Region: Choose same as Bedrock
5. **Block all public access**: CHECKED
6. **Versioning**: Enable
7. Click **Create bucket**

## 3. Create IAM Role for Lambda

1. Navigate to **IAM** → **Roles**
2. Click **Create role**
3. Select **AWS service** → **Lambda**
4. Attach policies:
   - `AWSLambdaBasicExecutionRole`
5. Click **Next**
6. Role name: `visual-qa-lambda-role`
7. Click **Create role**
8. Click on the role → **Add permissions** → **Create inline policy**
9. JSON tab:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::visual-qa-agent-images-YOUR-NAME/*"
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
```

10. Name: `VisualQAPolicy`
11. Click **Create policy**

## 4. Create Lambda Function

1. Navigate to **Lambda**
2. Click **Create function**
3. **Author from scratch**
4. Function name: `visual-qa-agent-analyzer`
5. Runtime: **Node.js 18.x**
6. Architecture: **x86_64**
7. Execution role: **Use an existing role** → `visual-qa-lambda-role`
8. Click **Create function**
9. Configuration:
   - **Timeout**: 30 seconds
   - **Memory**: 512 MB
   - **Environment variables**:
     - `S3_BUCKET_NAME` = `visual-qa-agent-images-YOUR-NAME`
     - `BEDROCK_MODEL_ID` = `anthropic.claude-3-sonnet-20240229-v1:0`
     - `AWS_REGION` = `us-east-1` (or your region)

## 5. Upload Lambda Code

1. Locally, zip the lambda folder:
   ```bash
   cd lambda
   npm install --production
   zip -r function.zip .
   ```

2. In Lambda console, click **Upload from** → **.zip file**
3. Upload `function.zip`
4. Click **Save**

## 6. Create API Gateway

1. Navigate to **API Gateway**
2. Click **Create API**
3. Choose **REST API** → **Build**
4. API name: `visual-qa-api`
5. Click **Create API**
6. Click **Actions** → **Create Resource**
7. Resource name: `analyze`
8. Click **Create Resource**
9. Select `/analyze` → **Actions** → **Create Method** → **POST**
10. Integration type: **Lambda Function**
11. Lambda Function: `visual-qa-agent-analyzer`
12. Click **Save** → **OK**
13. Click **Actions** → **Enable CORS**
14. Click **Enable CORS and replace existing CORS headers**
15. Click **Actions** → **Deploy API**
16. Stage: **New Stage** → `prod`
17. Click **Deploy**
18. **Copy the Invoke URL** (you'll need this)

## 7. Deploy Dashboard to S3

1. Navigate to **S3**
2. Click **Create bucket**
3. Name: `visual-qa-dashboard-YOUR-NAME`
4. **Uncheck** Block all public access
5. Acknowledge the warning
6. Click **Create bucket**

7. Click on bucket → **Properties** → **Static website hosting**
8. **Enable**
9. Index document: `index.html`
10. Click **Save changes**

11. Click **Permissions** → **Bucket policy**
12. Add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::visual-qa-dashboard-YOUR-NAME/*"
    }
  ]
}
```

13. Locally, build the dashboard:
```bash
cd dashboard
npm install
npm run build
```

14. Upload `build/` contents to S3 bucket (via console or CLI)
15. Get website URL from **Properties** → **Static website hosting**

## 8. Test the Setup

1. Start demo apps locally
2. Capture screenshots with Playwright
3. Upload to S3:
   ```bash
   aws s3 cp screenshots/baseline/ s3://visual-qa-agent-images-YOUR-NAME/baseline/ --recursive
   aws s3 cp screenshots/current/ s3://visual-qa-agent-images-YOUR-NAME/current/ --recursive
   ```

4. Open dashboard URL
5. Test analysis

## Verification Checklist

- [ ] Bedrock Claude 3 Sonnet access approved
- [ ] S3 bucket for images created
- [ ] IAM role with S3 + Bedrock permissions created
- [ ] Lambda function deployed with code
- [ ] Lambda environment variables configured
- [ ] API Gateway created and deployed
- [ ] API Gateway CORS enabled
- [ ] Dashboard S3 bucket with static hosting enabled
- [ ] Dashboard uploaded and accessible
- [ ] End-to-end test successful

## Common Issues

**Lambda can't access S3:** Check IAM role has `s3:GetObject` permission for your bucket

**Bedrock access denied:** Verify model access is granted in Bedrock console

**CORS errors in dashboard:** Enable CORS on API Gateway and redeploy

**Dashboard not loading:** Check bucket policy allows public read access

**Lambda timeout:** Increase timeout to 60 seconds in Configuration
