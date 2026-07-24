# Playwright Screenshot Capture

Automated screenshot capture script for baseline and current versions of the demo app.

## Features

- Captures screenshots of both versions
- Uploads to Amazon S3
- Configurable viewports
- Automatic retry on failure

## Setup

```bash
npm install
npx playwright install
```

## Configuration

Create `.env` file:
```bash
AWS_REGION=us-east-1
S3_BUCKET_NAME=visual-qa-agent-images
BASELINE_URL=http://localhost:3000
CURRENT_URL=http://localhost:3001
```

## Usage

```bash
# Capture both baseline and current
npm run capture

# Capture only baseline
npm run capture:baseline

# Capture only current
npm run capture:current

# Upload to S3
npm run upload
```

## Output

Screenshots are saved to:
- `./screenshots/baseline/`
- `./screenshots/current/`

And uploaded to S3:
- `s3://bucket-name/baseline/`
- `s3://bucket-name/current/`
