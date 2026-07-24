# Visual QA Agent — Project Structure

## 📁 Complete Directory Layout

```
visual-qa-agent/
│
├── 📄 README.md                          # Main project documentation
├── 📄 VisualQA-Agent-Source-of-Truth.md  # Project specification & requirements
├── 📄 CONTRIBUTING.md                    # Team collaboration guidelines
├── 📄 LICENSE                            # MIT License
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.example                       # Environment variables template
│
├── 📂 .github/                           # GitHub configurations
│   ├── 📂 ISSUE_TEMPLATE/
│   │   ├── bug-report.yml               # Bug report template
│   │   ├── user-story.yml               # User story template
│   │   └── config.yml                   # Issue template config
│   └── pull_request_template.md         # PR template
│
├── 📂 demo-app/                          # Demo web application
│   ├── README.md                        # Demo app documentation
│   ├── package.json                     # Dependencies & scripts
│   ├── 📂 baseline/                     # Correct version (to create)
│   │   └── index.html
│   └── 📂 current-with-bugs/            # Version with visual bugs (to create)
│       └── index.html
│
├── 📂 playwright/                        # Screenshot capture automation
│   ├── README.md                        # Playwright documentation
│   ├── package.json                     # Dependencies & scripts
│   ├── capture.js                       # Screenshot capture script (to create)
│   ├── upload-to-s3.js                  # S3 upload script (to create)
│   └── 📂 screenshots/                  # Local screenshot storage (git-ignored)
│       ├── baseline/
│       └── current/
│
├── 📂 lambda/                            # AWS Lambda function
│   ├── README.md                        # Lambda documentation
│   ├── package.json                     # Dependencies & scripts
│   ├── 📂 src/                          # Source code (to create)
│   │   ├── index.js                     # Main Lambda handler
│   │   ├── bedrock-client.js            # Bedrock API wrapper
│   │   ├── s3-client.js                 # S3 operations
│   │   ├── prompt.js                    # Prompt templates
│   │   └── validator.js                 # Response validation
│   └── 📂 tests/                        # Unit tests (to create)
│       └── index.test.js
│
├── 📂 dashboard/                         # React web dashboard
│   ├── README.md                        # Dashboard documentation
│   ├── package.json                     # Dependencies & scripts
│   ├── 📂 public/                       # Public assets (to create)
│   │   └── index.html
│   └── 📂 src/                          # Source code (to create)
│       ├── index.js                     # Entry point
│       ├── App.jsx                      # Main component
│       ├── 📂 components/               # React components
│       │   ├── ImageUploader.jsx
│       │   ├── ComparisonView.jsx
│       │   ├── DiffList.jsx
│       │   └── BoundingBox.jsx
│       └── 📂 services/                 # API services
│           └── api.js
│
├── 📂 infra/                             # Infrastructure as Code
│   ├── README.md                        # Infrastructure overview
│   ├── manual-setup.md                  # AWS Console setup guide
│   ├── 📂 sam/                          # AWS SAM templates (optional)
│   ├── 📂 terraform/                    # Terraform configs (optional)
│   └── 📂 cdk/                          # AWS CDK (optional)
│
└── 📂 docs/                              # Additional documentation
    ├── ARCHITECTURE.md                  # System architecture
    ├── BEDROCK_PROMPT.md                # Prompt engineering guide
    └── DEPLOYMENT_GUIDE.md              # Deployment instructions
```

## 🏗️ Component Ownership Matrix

| Component | Directory | Status | Next Action |
|-----------|-----------|--------|-------------|
| Project Setup | Root files | ✅ Complete | - |
| Demo App | `demo-app/` | 🟡 Scaffold created | Create HTML files with bugs |
| Playwright Scripts | `playwright/` | 🟡 Scaffold created | Write capture & upload scripts |
| Lambda Function | `lambda/` | 🟡 Scaffold created | Implement Bedrock integration |
| Dashboard | `dashboard/` | 🟡 Scaffold created | Build React components |
| Infrastructure | `infra/` | 🟡 Docs ready | Deploy AWS resources |

## 📝 Files Created (✅) vs To Create (⬜)

### ✅ Already Created
- [x] Root README.md
- [x] Source of Truth document
- [x] Contributing guidelines
- [x] License file
- [x] .gitignore
- [x] .env.example
- [x] All package.json files
- [x] All component READMEs
- [x] Architecture documentation
- [x] Bedrock prompt guide
- [x] Deployment guides

### ⬜ To Be Created (Next Steps)

#### Demo App
- [ ] `demo-app/baseline/index.html` — Correct UI version
- [ ] `demo-app/current-with-bugs/index.html` — Version with visual bugs
- [ ] `demo-app/baseline/styles.css` — Shared styles
- [ ] `demo-app/current-with-bugs/styles.css` — Buggy styles

#### Playwright
- [ ] `playwright/capture.js` — Screenshot automation
- [ ] `playwright/upload-to-s3.js` — S3 upload logic
- [ ] `playwright/.env` — Local environment config

#### Lambda
- [ ] `lambda/src/index.js` — Main handler
- [ ] `lambda/src/bedrock-client.js` — Bedrock integration
- [ ] `lambda/src/s3-client.js` — S3 operations
- [ ] `lambda/src/prompt.js` — Prompt templates
- [ ] `lambda/src/validator.js` — JSON validation
- [ ] `lambda/tests/index.test.js` — Unit tests

#### Dashboard
- [ ] `dashboard/public/index.html` — HTML template
- [ ] `dashboard/src/index.js` — React entry point
- [ ] `dashboard/src/App.jsx` — Main app component
- [ ] `dashboard/src/components/ImageUploader.jsx`
- [ ] `dashboard/src/components/ComparisonView.jsx`
- [ ] `dashboard/src/components/DiffList.jsx`
- [ ] `dashboard/src/components/BoundingBox.jsx`
- [ ] `dashboard/src/services/api.js` — API client
- [ ] `dashboard/tailwind.config.js` — Tailwind config
- [ ] `dashboard/.env` — Dashboard environment config

## 🚀 Quick Start Commands

```bash
# Install all dependencies
npm install --prefix demo-app
npm install --prefix playwright
npm install --prefix lambda
npm install --prefix dashboard

# Setup environment
cp .env.example .env
# Edit .env with your AWS credentials

# Start demo app
cd demo-app && npm start

# Capture screenshots
cd playwright && npm run capture

# Deploy Lambda
cd lambda && npm run deploy

# Start dashboard locally
cd dashboard && npm start
```

## 📊 Development Progress Tracker

| Milestone | Tasks | Status |
|-----------|-------|--------|
| **Day 1: Functional Core** | Setup, Demo App, Playwright, Lambda, Bedrock | 🟡 In Progress |
| **Day 2: Usable Product** | Dashboard, API Gateway, Integration, Testing | ⬜ Not Started |
| **Day 3: Polish & Video** | UI Polish, README, Video Recording | ⬜ Not Started |

## 🎯 Next Immediate Steps

1. **Create Demo App HTML files** with intentional visual bugs
2. **Implement Playwright capture scripts** for screenshots
3. **Build Lambda Bedrock integration** for analysis
4. **Develop React Dashboard** for visualization
5. **Deploy to AWS** following deployment guide
6. **Test end-to-end flow** and iterate

---

**Note:** This structure follows the Source of Truth document and matches the component table in Section 3. All team members should reference this when adding new files or components.
