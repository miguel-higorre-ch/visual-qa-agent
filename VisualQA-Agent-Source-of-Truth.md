
# Visual QA Agent — Source of Truth Document
### Código Facilito × AWS × Kiro Hackathon — Challenge 4 (Developer Productivity Tools)

> **Purpose of this document:** align the team on vision, scope, architecture, and work plan. When in doubt or tempted to change direction during the hackathon, this document is the reference. Scope changes are only accepted if the entire team discusses and updates this file.

---

## 1. Product Vision

**Problem:** Development teams detect visual regressions (broken layouts, misaligned buttons, cut-off text, missing elements) manually or with pixel-diff tools that generate many false positives (any 1px change triggers an alert), forcing them to review dozens of irrelevant "diffs" to find the one that matters.

**For whom:** Development/QA teams running E2E test suites (Playwright/Cypress/Selenium) who need to validate that UI changes don't break anything, without wasting time reviewing visual noise.

**What the product does:** Visual QA Agent is an agent that compares a "baseline" screenshot against a "current" one of the same screen, and uses a multimodal LLM (Bedrock/Claude) to reason semantically about the differences — it not only detects that something changed at the pixel level, but interprets **what** changed, **where**, and **how severe it is** (critical / minor / cosmetic), filtering out irrelevant noise (antialiasing, fonts, shadows).

**Market differentiator:** Tools like Percy or Applitools are based on pixel-diff + manually configurable rules. Visual QA Agent uses LLM reasoning to classify severity and explain impact in natural language, without prior configuration of per-project rules.

---

## 2. User Stories

1. **As a QA/dev**, I upload (or my pipeline automatically uploads) a baseline and current screenshot of the same page, to know if something broke visually.
2. **As a QA/dev**, I receive a report listing each detected difference with its severity (critical/minor/cosmetic), to prioritize what to review first.
3. **As a QA/dev**, I see the image with highlighted change zones (bounding boxes), to visually locate the problem without comparing by eye.
4. **As a QA/dev**, I read a natural language description of each difference ("the 'Submit' button shifted 40px to the left and is partially hidden behind the menu"), to understand the impact without interpreting the diff myself.
5. **As a QA/dev**, I integrate the agent into my Playwright workflow (automatic capture after each test run), to avoid manually uploading images. *(optional/demo if time permits)*
6. **As a judge/demo user**, I enter a public link, upload two example images, and see the analysis working live.

---

## 3. Technical Architecture

```
[Playwright script]
   captures baseline + current screenshot of a demo app with injected visual bugs
        │
        ▼
[Amazon S3]
   stores both images (bucket with /baseline and /current prefixes)
        │
        ▼
[API Gateway] → [AWS Lambda]
   orchestrates: reads images from S3, builds prompt, calls Bedrock
        │
        ▼
[Amazon Bedrock — Claude multimodal model]
   receives both images + structured prompt
   returns JSON: { diffs: [{ description, severity, bbox }], summary }
        │
        ▼
[Lambda] → saves result (S3 or direct response)
        │
        ▼
[Web Dashboard] (hosted on AWS Amplify or S3 static website)
   shows images side by side, highlights bounding boxes, lists diffs with severity
```

**AWS Services Used (meets "AWS and Kiro Usage" criterion — 10%):**
- **Amazon S3** — image storage (baseline/current) and static hosting for dashboard.
- **AWS Lambda** — analysis orchestration (Bedrock call, JSON processing).
- **Amazon Bedrock** — multimodal model for semantic diff reasoning.
- **API Gateway** — exposes the endpoint that triggers analysis from dashboard or Playwright.
- *(Optional if time permits)* AWS Amplify for simplified frontend deployment.

**Code Components:**
| Component | Owner | Stack |
|---|---|---|
| Capture script (Playwright) | *(assign)* | Playwright + Node/TS |
| Demo app with injected bugs | *(assign)* | HTML/React simple, 2-3 versions with visual bugs |
| Orchestration Lambda | *(assign)* | Node.js or Python |
| Prompt + Bedrock response parsing | *(assign)* | Prompt engineering + JSON schema |
| Dashboard | *(assign)* | React/Tailwind simple |
| Deploy (S3/Amplify) | *(assign)* | AWS CLI/Console |
| Video + README | *(entire team)* | — |

---

## 4. Demo Flow (maximum 5 minutes)

1. **[0:00–0:45] Problem:** show the real pain on screen — a traditional pixel-diff marking dozens of irrelevant false positives, vs. the Visual QA Agent promise.
2. **[0:45–1:30] Architecture:** quick diagram (from section 3) explaining the S3 → Lambda → Bedrock → Dashboard flow.
3. **[1:30–3:30] Live Demo:**
   - Show the working demo app (baseline).
   - Show the version with injected bugs (current) — at least 2 cases: one critical (button disappeared/shifted breaking workflow) and one cosmetic (minor color change).
   - Run the analysis in the public dashboard.
   - Show the result: bounding boxes + description + severity for each case.
4. **[3:30–4:30] Technical Differentiator:** briefly explain why semantic reasoning (vs. pixel-diff) reduces noise, showing a case where a pixel change is NOT flagged as a problem (e.g., antialiasing) because the LLM understands it's not relevant.
5. **[4:30–5:00] Closing:** impact (time saved in QA), AWS stack used, and link to repo/demo.

**Recording Checklist:**
- [ ] Record in 1080p, clear audio.
- [ ] Have 2-3 bug cases prepared in advance (don't rely on generating bugs live).
- [ ] 1 final video per team, ≤5 min.
- [ ] Don't show credentials/API keys on screen.

---

## 5. Prioritized Backlog

### MVP (must be ready without fail)
- [ ] Simple demo app with at least 2 versions (baseline + current with bugs).
- [ ] Playwright script that captures both screenshots.
- [ ] Image upload to S3.
- [ ] Lambda that calls Bedrock with structured prompt and returns diff JSON.
- [ ] Response JSON parsing and validation.
- [ ] Minimal dashboard showing both images + diff list with severity.
- [ ] Working public deployment (accessible link).
- [ ] Public GitHub repo + README.
- [ ] Demo video recorded.

### Nice-to-have (only if MVP is solid and time remains)
- [ ] Bounding boxes visually drawn on the image (not just coordinates in text).
- [ ] Basic authentication in the dashboard.
- [ ] Automatic GitHub Actions integration (run analysis on each PR).
- [ ] Comparison history (persistence in DynamoDB/RDS).
- [ ] Support for more than 2 images (comparison across multiple viewports/breakpoints).

### Out of Scope (don't do, avoid distractions)
- Functional testing (clicks, forms) — this is *visual* QA, not complete E2E.
- Exhaustive multi-browser support.
- User/role/pricing plan system.

---

## 6. Agent Prompts and Responsibilities

**Agent Role (base system prompt for Bedrock):**

> You are an expert visual QA agent. You receive two images of the same web interface: one "baseline" (correct/approved version) and one "current" (version to validate). Your task is to identify relevant visual differences for a development team, ignoring irrelevant noise such as antialiasing, subpixel rendering, or image compression differences.
>
> For each relevant difference you detect, classify it by severity:
> - **critical**: breaks functionality or usability (interactive element hidden, displaced out of view, illegible).
> - **minor**: visible change but not blocking (slight misalignment, inconsistent spacing).
> - **cosmetic**: aesthetic change with no functional impact (color tone, shadow).
>
> Respond ONLY in valid JSON format, with no additional text, using this structure:
> ```json
> {
>   "summary": "general summary in one sentence",
>   "diffs": [
>     {
>       "description": "clear and specific description of the change",
>       "severity": "critical | minor | cosmetic",
>       "bbox": { "x": 0, "y": 0, "width": 0, "height": 0 }
>     }
>   ]
> }
> ```

**Responsibilities by Team Role:**
| Role | Responsibility |
|---|---|
| Prompt/Bedrock owner | Adjust and test prompt against real test cases, validate JSON is always parseable |
| Backend/Lambda owner | S3 ↔ Bedrock ↔ response orchestration, error handling |
| Frontend/Dashboard owner | Comparison UI, bounding box rendering, diff list |
| QA/Playwright owner | Capture script, test cases (injected bugs) |
| Documentation/Video owner | README, diagram, video script and editing |

*(Adjust real names according to team)*

---

## 7. Work Plan by Hours

### Day 1 — Functional Core
| Hours | Task |
|---|---|
| H0–H2 | Setup: repo, AWS accounts, Bedrock access, folder structure |
| H2–H4 | Demo app with 2-3 injected visual bugs (baseline + current version) |
| H2–H5 | Playwright screenshot capture script + S3 upload (in parallel) |
| H5–H8 | Lambda + Bedrock integration, initial prompt, first JSON tests |
| H8–H9 | Team checkpoint: does basic analysis work end-to-end? Adjust prompt if needed |

### Day 2 — Usable Product + Integration
| Hours | Task |
|---|---|
| H0–H3 | Dashboard: layout, image loading, endpoint call |
| H3–H5 | Bounding box rendering + diff list with severity |
| H5–H7 | API Gateway + backend deploy, frontend deploy (S3/Amplify) |
| H7–H8 | End-to-end testing with 2-3 real bug cases |
| H8–H9 | Checkpoint: validate public link works from scratch (clean browser) |

### Day 3 — Polish, README, Video
| Hours | Task |
|---|---|
| H0–H2 | Polish UI, fix bugs found in end-to-end testing |
| H2–H4 | Write README (vision, architecture, how to run, demo link) |
| H4–H5 | Prepare video script based on section 4 of this document |
| H5–H6.5 | Record demo and final video |
| H6.5–H7.5 | Video editing, final review |
| H7.5–H8 | Submit: public repo, demo link, video, buffer for unexpected issues |

---

## Final Notes
- Any functionality not listed in the MVP requires team consensus before implementation.
- Prioritize getting the end-to-end flow working early (even if ugly) over polishing an isolated part.
- This document can be copied almost verbatim as the base for the final README (mainly sections 1, 3, and 6).
