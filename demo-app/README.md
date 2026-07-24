# Demo Application

Simple web application with multiple versions to demonstrate visual regression detection.

## Versions

- **baseline/** — Correct, approved UI version
- **current-with-bugs/** — Version with intentional visual bugs for testing

## Visual Bugs Included

1. **Critical:** Submit button displaced/hidden (breaks workflow)
2. **Minor:** Inconsistent spacing/alignment
3. **Cosmetic:** Color tone changes

## Running the Demo App

```bash
npm install
npm start
```

The baseline version will run on `http://localhost:3000`  
The buggy version will run on `http://localhost:3001`

## Structure

```
demo-app/
├── baseline/           # Correct version
│   └── index.html
├── current-with-bugs/  # Version with bugs
│   └── index.html
├── package.json
└── README.md
```
