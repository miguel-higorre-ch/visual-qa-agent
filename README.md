# Visual QA Agent
### Código Facilito × AWS × Kiro Hackathon — Challenge 4 (Developer Productivity Tools)

> **Intelligent visual regression testing powered by Amazon Bedrock and multimodal AI**

## 🎯 Problem

Development teams detect visual regressions manually or with pixel-diff tools that generate many false positives. Every 1px change triggers an alert, forcing teams to review dozens of irrelevant "diffs" to find the one that matters.

## 💡 Solution

Visual QA Agent uses Amazon Bedrock's Claude multimodal model to semantically understand visual differences between screenshots. Instead of flagging every pixel change, it:
- **Interprets** what changed and where
- **Classifies** severity: critical / minor / cosmetic
- **Filters** irrelevant noise (antialiasing, fonts, shadows)
- **Explains** impact in natural language

## 🏗️ Architecture

```
[Playwright Script]
   ↓ captures baseline + current screenshots
[Amazon S3]
   ↓ stores images
[API Gateway] → [AWS Lambda]
   ↓ orchestrates analysis
[Amazon Bedrock — Claude]
   ↓ semantic diff reasoning
[Web Dashboard]
   → displays results with bounding boxes
```

### AWS Services Used
- **Amazon S3** — Image storage and static website hosting
- **AWS Lambda** — Analysis orchestration
- **Amazon Bedrock** — Multimodal AI for semantic reasoning
- **API Gateway** — REST API endpoint
- **AWS Amplify** (optional) — Frontend deployment

## 📂 Project Structure

```
visual-qa-agent/
├── demo-app/          # Demo web application with visual bugs
├── playwright/        # Screenshot capture scripts
├── lambda/            # AWS Lambda function code
├── dashboard/         # React web dashboard
├── infra/             # Infrastructure as Code (Terraform/SAM)
└── docs/              # Additional documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS Account with Bedrock access
- Playwright installed
- AWS CLI configured

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd visual-qa-agent
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your AWS credentials
```

3. Install dependencies:
```bash
# Demo app
cd demo-app && npm install

# Playwright scripts
cd ../playwright && npm install

# Lambda
cd ../lambda && npm install

# Dashboard
cd ../dashboard && npm install
```

4. Deploy infrastructure (see `infra/README.md`)

5. Run the demo:
```bash
cd playwright
npm run capture
```

## 📖 Documentation

- [Source of Truth Document](./VisualQA-Agent-Source-of-Truth.md) — Complete project specification
- [Demo App README](./demo-app/README.md) — How to run the demo application
- [Playwright README](./playwright/README.md) — Screenshot capture guide
- [Lambda README](./lambda/README.md) — Backend deployment
- [Dashboard README](./dashboard/README.md) — Frontend setup
- [Infrastructure README](./infra/README.md) — AWS deployment guide

## 🎥 Demo Video

[Link to demo video - coming soon]

## 🔑 Key Features

- ✅ Semantic visual diff analysis
- ✅ Severity classification (critical/minor/cosmetic)
- ✅ Natural language explanations
- ✅ Bounding box highlighting
- ✅ Playwright integration
- ✅ False positive filtering

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS  
**Backend:** Node.js, AWS Lambda  
**AI:** Amazon Bedrock (Claude 3 Sonnet)  
**Testing:** Playwright  
**Infrastructure:** AWS (S3, Lambda, API Gateway, Bedrock)

## 📊 Project Status

See our [GitHub Projects board](../../projects) for current progress and task tracking.

## 🤝 Contributing

This is a hackathon project. For the team work plan, see the [Source of Truth document](./VisualQA-Agent-Source-of-Truth.md).

## 📝 License

MIT License - see LICENSE file for details

## 👥 Team

Código Facilito × AWS × Kiro Hackathon Team

---

**Built for:** Código Facilito Hackathon — Challenge 4 (Developer Productivity Tools)  
**Powered by:** Amazon Bedrock, AWS Lambda, Playwright
