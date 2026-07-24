# Contributing to Visual QA Agent

This is a hackathon project for Código Facilito × AWS × Kiro. Below are guidelines for team collaboration.

## Team Workflow

1. **Check the GitHub Projects board** before starting work
2. **Assign yourself** to an issue when you start working on it
3. **Move the issue** to "In Progress"
4. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Commit frequently** with descriptive messages
6. **Push to your branch** and create a PR when ready
7. **Request review** from at least one team member
8. **Move to "Review"** column
9. After approval, **merge** and **move to "Done"**

## Branch Naming

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation updates
- `refactor/` — Code refactoring

Examples:
- `feature/bedrock-integration`
- `fix/cors-dashboard`
- `docs/deployment-guide`

## Commit Messages

Use conventional commits format:

```
type(scope): description

[optional body]
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

Examples:
```
feat(lambda): add bedrock client integration
fix(dashboard): resolve CORS issue with API calls
docs(readme): update deployment instructions
```

## Code Style

### JavaScript/Node.js
- Use ES6+ syntax
- Use `const` by default, `let` when reassignment needed
- Use arrow functions for callbacks
- Use async/await instead of promises chains
- Add JSDoc comments for functions

### React
- Use functional components with hooks
- One component per file
- Use meaningful component names
- Extract reusable logic to custom hooks

## Testing

- Write unit tests for Lambda functions
- Test Playwright scripts locally before committing
- Verify dashboard works in Chrome, Firefox, Safari
- Test end-to-end flow before marking as Done

## Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console.log or debugging code
- [ ] Environment variables documented in .env.example

## Issue Labels

- `MVP` — Must be completed for minimum viable product
- `nice-to-have` — Optional enhancement
- `bug:critical` — Blocks core functionality
- `bug:minor` — Non-blocking issue
- `blocked` — Cannot proceed without dependency
- `day-1`, `day-2`, `day-3` — Milestone indicators

## Communication

- **Daily standup** (async): Post in team chat
  - What you did yesterday
  - What you'll do today
  - Any blockers
- **Slack/Discord** for quick questions
- **GitHub issues** for feature discussions
- **PR comments** for code review

## Priority Order

1. **MVP features** (Source of Truth section 5)
2. **Bug fixes** (critical first)
3. **Nice-to-have features**
4. **Documentation**
5. **Optimizations**

## Getting Help

If you're blocked:
1. Check the Source of Truth document
2. Ask in team chat
3. Tag relevant team member in issue
4. Add `blocked` label to issue

## Review Process

Reviewers should check:
- Code quality and readability
- Alignment with project architecture
- No hardcoded credentials
- Error handling present
- Follows security best practices

## Deployment

Only designated team members deploy to AWS:
- Coordinate in team chat before deploying
- Test locally first
- Document any infrastructure changes
- Update .env.example with new variables

## Demo Preparation

When preparing demo:
- Test complete flow multiple times
- Prepare backup screenshots
- Time the demo (≤5 minutes)
- Have fallback plan if live demo fails
- Don't show AWS credentials on screen
