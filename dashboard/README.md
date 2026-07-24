# Dashboard — Visual QA Agent

React web dashboard for uploading screenshots and viewing analysis results.

## Features

- Upload baseline and current screenshots
- Trigger analysis via API Gateway
- Display images side-by-side
- Render bounding boxes on detected differences
- List all diffs with severity badges
- Responsive design

## Tech Stack

- React 18
- Tailwind CSS
- Axios for API calls
- React Canvas for bounding boxes

## Setup

```bash
npm install
npm start
```

Development server: `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Output in `build/` directory ready for S3 deployment.

## Deployment to S3

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-dashboard-bucket --delete

# Enable static website hosting
aws s3 website s3://your-dashboard-bucket --index-document index.html
```

## Environment Variables

Create `.env`:
```
REACT_APP_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_S3_BUCKET=visual-qa-agent-images
```

## Structure

```
dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ImageUploader.jsx
│   │   ├── ComparisonView.jsx
│   │   ├── DiffList.jsx
│   │   └── BoundingBox.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```
