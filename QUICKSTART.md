# Visual QA Agent — Quick Start Guide

**Welcome to the Visual QA Agent Hackathon Project!** 🚀

This guide will get you up and running in under 10 minutes.

## 🎯 What We're Building

An AI-powered visual regression testing tool that uses Amazon Bedrock (Claude) to intelligently detect and classify visual differences between screenshots, filtering out false positives that plague traditional pixel-diff tools.

## 📋 Prerequisites Checklist

Before you start, ensure you have:

- [ ] **Node.js 18+** installed → `node --version`
- [ ] **Git** installed → `git --version`
- [ ] **AWS Account** with Bedrock access
- [ ] **AWS CLI** configured → `aws configure`
- [ ] **GitHub account** with repo access
- [ ] **Code editor** (VS Code recommended)

## 🚀 5-Minute Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd visual-qa-agent

# Install dependencies for all components
npm install --prefix demo-app
npm install --prefix playwright
npm install --prefix lambda
npm install --prefix dashboard

# Install Playwright browsers
cd playwright
npx playwright install
cd ..
```

### 2. Configure Environment (2 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your AWS credentials
# Use your favorite editor: code .env / nano .env / vim .env
```

**Required variables:**
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
S3_BUCKET_NAME=visual-qa-agent-images-YOUR-UNIQUE-ID
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

### 3. Enable Bedrock Access (1 minute)

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock)
2. Click **Model access** → **Request access**
3. Select **Claude 3 Sonnet** → **Request**
4. Wait for approval (usually instant)

✅ **You're all set!** Now pick your role below.

---

## 👥 Team Role Assignments

### 🎨 **Frontend Developer** (Dashboard)

**Your mission:** Build the React dashboard for uploading images and viewing analysis results.

**Start here:**
```bash
cd dashboard
npm start
# Dashboard runs on http://localhost:3000
```

**Your tasks:**
1. Create `src/App.jsx` — main component
2. Create `src/components/ImageUploader.jsx` — file upload
3. Create `src/components/ComparisonView.jsx` — side-by-side images
4. Create `src/components/DiffList.jsx` — list of differences
5. Create `src/components/BoundingBox.jsx` — draw rectangles
6. Create `src/services/api.js` — API calls to Lambda

**Reference:** `dashboard/README.md`

---

### ⚙️ **Backend Developer** (Lambda)

**Your mission:** Build the Lambda function that orchestrates S3 → Bedrock → JSON response.

**Start here:**
```bash
cd lambda
```

**Your tasks:**
1. Create `src/index.js` — main Lambda handler
2. Create `src/bedrock-client.js` — call Bedrock API
3. Create `src/s3-client.js` — download images from S3
4. Create `src/prompt.js` — prompt engineering
5. Create `src/validator.js` — validate JSON response
6. Create `tests/index.test.js` — unit tests

**Reference:** `lambda/README.md`, `docs/BEDROCK_PROMPT.md`

---

### 🎭 **Demo App Developer**

**Your mission:** Create simple web pages with intentional visual bugs for testing.

**Start here:**
```bash
cd demo-app
npm start
# Baseline: http://localhost:3000
# Buggy: http://localhost:3001
```

**Your tasks:**
1. Create `baseline/index.html` — correct UI (login form or simple dashboard)
2. Create `current-with-bugs/index.html` — same UI with bugs:
   - **Critical:** Button displaced/hidden
   - **Minor:** Spacing inconsistency
   - **Cosmetic:** Color change

**Reference:** `demo-app/README.md`

---

### 🎬 **QA/Automation Engineer** (Playwright)

**Your mission:** Automate screenshot capture and upload to S3.

**Start here:**
```bash
cd playwright
```

**Your tasks:**
1. Create `capture.js` — Playwright script to capture screenshots
2. Create `upload-to-s3.js` — upload screenshots to S3
3. Test with demo app running locally

**Reference:** `playwright/README.md`

---

### ☁️ **DevOps/Infrastructure**

**Your mission:** Deploy AWS infrastructure (S3, Lambda, API Gateway).

**Start here:**
```bash
cd infra
```

**Choose one approach:**
- **Quick:** Follow `manual-setup.md` (AWS Console)
- **Pro:** Use SAM/Terraform/CDK templates

**Your tasks:**
1. Create S3 buckets (images + dashboard)
2. Deploy Lambda function
3. Setup API Gateway
4. Configure IAM roles
5. Deploy dashboard to S3

**Reference:** `infra/README.md`, `docs/DEPLOYMENT_GUIDE.md`

---

### 📹 **Documentation/Video Lead**

**Your mission:** Create README, record demo video.

**Your tasks:**
1. Expand README with project-specific details
2. Write deployment guide additions
3. Prepare demo script (5 min max)
4. Record and edit video
5. Capture screenshots for documentation

**Reference:** `VisualQA-Agent-Source-of-Truth.md` section 4 (Demo Flow)

---

## 🔄 Daily Workflow

### Morning (or start of work session)
1. Check [GitHub Projects board](../../projects)
2. Assign yourself to an issue
3. Move it to "In Progress"
4. Pull latest changes: `git pull origin main`

### During work
1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit frequently: `git commit -m "feat(component): description"`
3. Push to your branch: `git push origin feature/your-feature`

### When done
1. Create Pull Request
2. Request review from teammate
3. Move issue to "Review" column
4. After approval, merge and move to "Done"

## 🆘 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| `npm install` fails | Check Node.js version (needs 18+) |
| AWS credentials error | Run `aws configure` and verify keys |
| Bedrock access denied | Enable model access in Bedrock console |
| Port 3000 already in use | Kill process or use different port |
| Playwright install fails | Run `npx playwright install --with-deps` |

## 📚 Key Documentation

- **[Source of Truth](./VisualQA-Agent-Source-of-Truth.md)** — Project spec & requirements
- **[Project Structure](./PROJECT_STRUCTURE.md)** — Directory layout & status
- **[Contributing](./CONTRIBUTING.md)** — Team workflow & conventions
- **[Architecture](./docs/ARCHITECTURE.md)** — System design
- **[Bedrock Prompt](./docs/BEDROCK_PROMPT.md)** — Prompt engineering guide
- **[Deployment](./docs/DEPLOYMENT_GUIDE.md)** — AWS deployment steps

## 🎯 Success Criteria

By end of hackathon, we should have:

- [ ] Working demo app with 2-3 visual bugs
- [ ] Playwright script capturing screenshots
- [ ] Lambda function analyzing images via Bedrock
- [ ] Dashboard displaying results with bounding boxes
- [ ] Public deployment accessible via URL
- [ ] 5-minute demo video
- [ ] GitHub repo with complete README

## 💬 Team Communication

- **Standup:** Post daily in team chat
  - What did I do?
  - What will I do?
  - Any blockers?
- **Blockers:** Add `blocked` label to issue, tag relevant person
- **Questions:** Ask in team chat or GitHub issue comments
- **Decisions:** Update Source of Truth document

## 🎉 Let's Build!

**First task for everyone:**
1. Go to [GitHub Projects board](../../projects)
2. Find your first issue in "Backlog"
3. Assign it to yourself
4. Move to "In Progress"
5. Start coding! 🚀

---

**Need help?** Check the component-specific README in your folder or ask in team chat.

**Ready to deploy?** See `docs/DEPLOYMENT_GUIDE.md` or `infra/manual-setup.md`.

**Questions about architecture?** Read `docs/ARCHITECTURE.md`.

Let's ship this! 💪
