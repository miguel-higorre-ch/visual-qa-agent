# Visual QA Agent — Quick Reference Card

## 🚀 Fast Commands Reference

### Demo App
```bash
cd demo-app
npm install
npm start
# Baseline: http://localhost:3000
# Buggy: http://localhost:3001
```

### Playwright Screenshots
```bash
cd playwright
npm install
npx playwright install
cp .env.example .env  # Configure AWS credentials
npm run capture       # Take screenshots
npm run upload        # Upload to S3
```

### Lambda Deployment
```bash
cd lambda
npm install
zip -r function.zip .
aws lambda update-function-code --function-name visual-qa-agent-analyzer --zip-file fileb://function.zip
```

### Dashboard
```bash
cd dashboard
npm install
cp .env.example .env  # Configure API URL
npm start             # Dev server: http://localhost:3000
npm run build         # Production build
```

---

## 📋 Environment Variables Checklist

### Playwright (.env)
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=visual-qa-agent-images
BASELINE_URL=http://localhost:3000
CURRENT_URL=http://localhost:3001
```

### Lambda (AWS Console → Environment Variables)
```bash
AWS_REGION=us-east-1
S3_BUCKET_NAME=visual-qa-agent-images
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

### Dashboard (.env)
```bash
REACT_APP_API_URL=https://your-api.execute-api.us-east-1.amazonaws.com/prod/analyze
```

---

## 🔍 Quick Debug Commands

### Test Playwright Capture
```bash
cd playwright
node capture.js --baseline  # Only baseline
node capture.js --current   # Only current
node capture.js            # Both
```

### Test S3 Upload
```bash
cd playwright
node upload-to-s3.js
```

### Test Lambda Locally
```bash
cd lambda
node -e "
const handler = require('./src/index').handler;
handler({
  body: JSON.stringify({
    baselineKey: 'baseline/test.png',
    currentKey: 'current/test.png'
  })
}).then(console.log);
"
```

### Test API Endpoint
```bash
curl -X POST https://your-api.execute-api.us-east-1.amazonaws.com/prod/analyze \
  -H "Content-Type: application/json" \
  -d '{"baselineKey":"baseline/login-page-desktop.png","currentKey":"current/login-page-desktop.png"}'
```

---

## 🏗️ AWS Infrastructure Quick Setup

### 1. Create S3 Bucket
```bash
aws s3 mb s3://visual-qa-agent-images-YOUR-UNIQUE-ID
```

### 2. Deploy Lambda
```bash
cd lambda && npm install && zip -r function.zip .
aws lambda create-function \
  --function-name visual-qa-agent-analyzer \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
  --handler src/index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512
```

### 3. Create API Gateway
See `docs/DEPLOYMENT_GUIDE.md` or `infra/manual-setup.md`

### 4. Deploy Dashboard
```bash
cd dashboard && npm run build
aws s3 sync build/ s3://visual-qa-dashboard-YOUR-UNIQUE-ID --acl public-read
```

---

## 🐛 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| `npm install` fails | Check Node.js version (need 18+) |
| AWS credentials error | Run `aws configure` |
| Bedrock access denied | Enable Claude in Bedrock console |
| CORS error in dashboard | Enable CORS in API Gateway |
| Lambda timeout | Increase timeout to 60s |
| Playwright install fails | Run `npx playwright install --with-deps` |
| Port 3000 in use | Change port or kill process |

---

## 📊 File Counts by Component

| Component | Files | Key Technologies |
|-----------|-------|------------------|
| Demo App | 2 HTML | HTML5, CSS3 |
| Playwright | 3 JS | Playwright, AWS SDK |
| Lambda | 5 JS | Node.js, Bedrock, S3 |
| Dashboard | 11 JSX/JS | React, Tailwind |
| Docs | 9 MD | Markdown |
| **Total** | **30+** | Full-stack AWS |

---

## ✅ Pre-Launch Checklist

### Development
- [ ] All dependencies installed (`npm install` in each folder)
- [ ] Environment files configured (`.env` copied and edited)
- [ ] AWS credentials configured (`aws configure`)
- [ ] Bedrock Claude access enabled
- [ ] Demo apps running locally
- [ ] Screenshots captured successfully
- [ ] Dashboard runs in dev mode

### AWS Infrastructure
- [ ] S3 bucket created
- [ ] Lambda function deployed
- [ ] Lambda IAM role has S3 + Bedrock permissions
- [ ] API Gateway created and deployed
- [ ] CORS enabled on API Gateway
- [ ] Lambda environment variables set
- [ ] Dashboard deployed to S3

### Testing
- [ ] End-to-end test completed
- [ ] All 3 bug severities detected
- [ ] Bounding boxes display correctly
- [ ] Dashboard shows results properly
- [ ] Error handling works

### Demo Preparation
- [ ] Demo script prepared (5 min max)
- [ ] Backup screenshots ready
- [ ] Public URL accessible
- [ ] Video recording setup tested
- [ ] No credentials visible on screen

---

## 🎬 Demo Flow Script

**[0:00-0:30] Problem Introduction**
- Show traditional pixel-diff with false positives
- Introduce Visual QA Agent promise

**[0:30-1:00] Architecture Overview**
- Quick diagram walkthrough
- Mention AWS services used

**[1:00-3:00] Live Demo**
1. Show baseline version (correct UI)
2. Show buggy version (with visual bugs)
3. Upload both to dashboard
4. Run analysis
5. Show results: critical, minor, cosmetic

**[3:00-4:00] Technical Highlights**
- Semantic reasoning vs pixel diff
- Show how cosmetic changes don't trigger false alarms
- Bounding box visualization

**[4:00-5:00] Closing**
- Impact: time saved in QA
- AWS stack: Bedrock, Lambda, S3
- GitHub repo link

---

## 📞 Support Resources

| Question Type | Resource |
|---------------|----------|
| General overview | `README.md` |
| Getting started | `QUICKSTART.md` |
| Project structure | `PROJECT_STRUCTURE.md` |
| Implementation details | `IMPLEMENTATION_SUMMARY.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| Deployment | `docs/DEPLOYMENT_GUIDE.md` or `infra/manual-setup.md` |
| Prompt engineering | `docs/BEDROCK_PROMPT.md` |
| Component-specific | Each folder's `README.md` |

---

## 🎯 Success Metrics

Your hackathon project is **READY** when:
- ✅ All 4 components run locally
- ✅ Screenshots upload to S3 successfully
- ✅ Lambda analyzes and returns valid JSON
- ✅ Dashboard displays results with bounding boxes
- ✅ Public deployment is accessible
- ✅ Demo video is recorded (≤5 min)
- ✅ GitHub repo has complete documentation

---

**🚀 You're ready to ship! Good luck with the hackathon!**
