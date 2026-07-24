# AWS Free Tier Setup for Visual QA Agent

## 🎯 Goal: Use AWS Without Spending Money

Good news! You can run this entire project on AWS Free Tier for **< $3 total cost**.

## 📊 Cost Breakdown

| Service | Free Tier | Your Usage | Estimated Cost |
|---------|-----------|------------|----------------|
| **Lambda** | 1M requests/month | ~100 requests | **$0.00** |
| **S3** | 5GB + 20K requests | ~50 images (100MB) | **$0.00** |
| **API Gateway** | 1M requests/month | ~100 requests | **$0.00** |
| **Bedrock Claude** | No free tier | ~50 requests | **~$2.00** |
| **Data Transfer** | 100GB out/month | Minimal | **$0.00** |
| **TOTAL** | | | **~$2.00** |

## ✅ Step-by-Step Safe Setup

### 1. Create AWS Account (Requires Credit Card)

**Why credit card?** AWS needs it for verification, but you won't be charged if you stay within limits.

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **Create an AWS Account**
3. Fill in email, password, account name
4. Choose **Personal** account type
5. Enter credit card (will charge $1 for verification, then refund)
6. Verify phone number

### 2. Set Up Billing Alerts (CRITICAL!)

Protect yourself from unexpected charges:

1. Go to **Billing Dashboard**
2. Click **Billing preferences** (left menu)
3. Enable **Receive Free Tier Usage Alerts**
4. Enable **Receive Billing Alerts**
5. Enter your email
6. Save preferences

### 3. Create CloudWatch Billing Alarm

Set a $5 alarm to notify you:

1. Go to **CloudWatch** console
2. Click **Alarms** → **Billing** (switch to us-east-1 region)
3. Click **Create alarm**
4. Select metric: **Total Estimated Charge**
5. Set threshold: **$5 USD**
6. Create SNS topic with your email
7. Confirm email subscription
8. Create alarm

### 4. Enable Bedrock Access

1. Go to **Amazon Bedrock** console
2. Click **Model access** (left menu)
3. Click **Request access**
4. Select **Anthropic → Claude 3 Sonnet**
5. Click **Request model access**
6. Wait 1-2 minutes (usually instant)

### 5. Create IAM User (Best Practice)

Don't use root account credentials:

```bash
# Create IAM user via AWS CLI
aws iam create-user --user-name visual-qa-agent

# Attach policies
aws iam attach-user-policy --user-name visual-qa-agent --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-user-policy --user-name visual-qa-agent --policy-arn arn:aws:iam::aws:policy/AWSLambdaFullAccess

# Create custom policy for Bedrock
cat > bedrock-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:ListFoundationModels"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam put-user-policy --user-name visual-qa-agent --policy-name BedrockAccess --policy-document file://bedrock-policy.json

# Create access keys
aws iam create-access-key --user-name visual-qa-agent
```

### 6. Minimize Bedrock Costs

**Test with Mock Data First:**
The dashboard includes a mock mode that simulates analysis without calling Bedrock.

Edit `dashboard/src/services/api.js`:
```javascript
// Use mock for development
export { mockAnalyzeImages as analyzeImages };

// Switch to real API for final testing
// export { analyzeImages };
```

**Optimize Image Sizes:**
```bash
# Resize images before upload (reduces tokens)
# Install ImageMagick first
convert input.png -resize 1200x800 output.png
```

**Limit Test Runs:**
- Use mock mode for UI development
- Run real analysis only 10-20 times during development
- Use 1-2 test runs for demo preparation

## 🛡️ Cost Protection Strategies

### Strategy 1: Set Budget Limit
1. Go to **AWS Budgets**
2. Create budget: **$5 monthly**
3. Set alert at 80% ($4)
4. Set alert at 100% ($5)

### Strategy 2: Use Cost Explorer
1. Go to **Cost Explorer**
2. Enable Cost Explorer (free)
3. Check daily costs during development
4. Identify unexpected charges immediately

### Strategy 3: Delete Resources After Hackathon
```bash
# Delete Lambda function
aws lambda delete-function --function-name visual-qa-agent-analyzer

# Empty and delete S3 bucket
aws s3 rm s3://your-bucket-name --recursive
aws s3 rb s3://your-bucket-name

# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id YOUR_API_ID
```

## 📊 Real Usage Estimates

Based on typical hackathon development:

| Activity | Requests | Cost |
|----------|----------|------|
| Initial testing (mock mode) | 0 Bedrock | $0.00 |
| Development testing | 20 Bedrock | $0.40 |
| Integration testing | 10 Bedrock | $0.20 |
| Demo preparation | 5 Bedrock | $0.10 |
| Video recording (rehearsals) | 10 Bedrock | $0.20 |
| **Total** | **45 requests** | **$0.90** |

Add safety margin: **~$2-3 total**

## 🆓 Free Alternatives

If you absolutely cannot spend $2-3, use these options:

### Option 1: Anthropic Direct API
- Sign up at [console.anthropic.com](https://console.anthropic.com)
- Get $5 free credit (enough for 250+ requests)
- Modify Lambda to call Anthropic API directly
- No AWS Bedrock needed

### Option 2: OpenAI GPT-4 Vision
- Sign up at [platform.openai.com](https://platform.openai.com)
- Get $5 free credit
- Modify Lambda to call OpenAI API
- Similar quality to Claude

### Option 3: Full Mock Mode
- Use only mock responses (no AI)
- Hardcode expected results for demo
- Show architecture and code, explain it would use Bedrock in production

## ❓ FAQ

**Q: Will I be charged automatically?**
A: Only if you exceed free tier limits. With billing alarms, you'll be notified before charges.

**Q: Can I delete my account after the hackathon?**
A: Yes! Go to Account Settings → Close Account. Any charges will be final billed.

**Q: What if I accidentally exceed limits?**
A: Billing alarms will email you. Delete resources immediately to stop charges.

**Q: Is $2-3 worth it?**
A: For a hackathon with prizes? Absolutely. It shows you can work with real AWS services.

**Q: Can I use AWS Educate?**
A: Yes! If you're a student, AWS Educate gives free credits: [aws.amazon.com/education/awseducate](https://aws.amazon.com/education/awseducate)

## 🎓 Student Credits

**AWS Educate:** $100/year in credits (free for students)
**GitHub Student Pack:** Includes AWS credits
**AWS Academy:** Free courses + credits

Apply at: [aws.amazon.com/education](https://aws.amazon.com/education)

## 📞 Support

If you get unexpected charges:
1. Check **Billing Dashboard** → **Bills**
2. Identify which service caused charges
3. Delete those resources immediately
4. Contact AWS Support (Free Tier includes basic support)

## ✅ Final Checklist

- [ ] AWS account created
- [ ] Billing alerts configured ($5 threshold)
- [ ] CloudWatch alarm set up
- [ ] Bedrock access enabled
- [ ] IAM user created (not using root)
- [ ] Cost Explorer enabled
- [ ] Budget set ($5 monthly)
- [ ] Mock mode tested in dashboard
- [ ] Image sizes optimized (<1MB each)
- [ ] Plan to delete resources after hackathon

---

**Bottom line:** You can run this entire project for **$2-3** with proper cost controls. This is a worthwhile investment for a hackathon with potential prizes!
