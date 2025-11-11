# Step 5-2: Lint and Compile Error Resolution

## Goal

Systematically resolve ESLint errors and warnings using your `code-reviewer` chat mode. Work through compilation/linting feedback loops, fixing issues one category at a time.

## Background

Now that your tests pass, it's time to ensure code quality. The codebase has ESLint configured with rules that catch common mistakes, unused code, and style violations. Your goal is to achieve zero lint errors across both frontend and backend.

> **Continuing from Step 5-1**: You're still on the `feature/agentic-workflow` branch. Let's use your `code-reviewer` chat mode to systematically clean up the code!

## Instructions

> 🔄 **Fresh Start**: Before beginning, **start a new chat** (click the **+** button in Copilot Chat panel). This gives you a clean context for this step while still leveraging your project instructions and chat modes.

### :keyboard: Activity: Fix All Lint Errors

> 💡 **How `/execute-step` works**: It reads the instructions from this GitHub Issue comment, auto-switches to `code-reviewer` mode, and executes the lint fixes autonomously. The Issue content tells it what to do!

Use `/execute-step` to autonomously resolve all ESLint errors:

1. **Run** `/execute-step` in Copilot Chat

2. **Watch the AI work!** It will:
   - Auto-switch to `code-reviewer` mode
   - Run lint on backend (`packages/backend`)
   - Fix errors systematically by category (unused variables → console statements → style issues)
   - Verify tests still pass after fixes
   - Run lint on frontend (`packages/frontend`)
   - Fix frontend errors (unused imports, useEffect dependencies, console statements)
   - Run full workspace lint validation
   - Continue until zero lint errors

3. **Review the changes** it made in both `packages/backend/src/app.js` and `packages/frontend/src/App.js`

> 💡 **What's happening?** The AI categorizes lint errors and fixes them systematically, verifying tests after each change to ensure nothing breaks. It automatically documents patterns to memory as it works!

### :keyboard: Activity: Validate and Progress

Now verify your work and push to trigger the next step:

1. **Validate completion** using `/validate-step`
   - Run: `/validate-step` in Copilot Chat
   - Provide step number: `5-2`
   - Checks that all lint errors are fixed
   - Verifies tests still pass

2. **Commit and push** using `/commit-and-push`
   - Run: `/commit-and-push` in Copilot Chat
   - Provide branch: `feature/agentic-workflow`
   - AI analyzes changes and creates commit message
   - Pushes to trigger Step 5-3 workflow automatically

## Success Criteria

To complete this exercise successfully:

- ✅ No ESLint errors in backend (`npm run lint` in packages/backend)
- ✅ No ESLint errors in frontend (`npm run lint` in packages/frontend)
- ✅ All tests still pass (`npm test` at root)
- ✅ Changes are committed and pushed to `feature/agentic-workflow` using `/commit-and-push`

## Key Workflow Patterns

✨ **Systematic Error Resolution**: Categorize and fix similar issues together for efficiency

✨ **Continuous Testing**: Verify tests still pass after each fix round

✨ **Code Quality Standards**: ESLint catches bugs and enforces consistent patterns

✨ **AI-Assisted Review**: Using `code-reviewer` mode to understand and systematically resolve quality issues

✨ **Workflow Automation**: Using `/validate-step` and `/commit-and-push` prompts to progress through steps

---

Wait for Step 5-3 instructions to appear in this issue...
