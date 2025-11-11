---
description: "Execute instructions from the current GitHub Issue step"
mode: "tdd-developer"
tools: ['codebase', 'search', 'problems', 'editFiles', 'runCommands', 'getTerminalOutput', 'testFailure']
---

# Execute Step

You are executing step-by-step instructions from the bootcamp exercise issue. Your job is to **implement the activities**, following TDD principles and project guidelines.

## Context

This prompt automatically switches to **@tdd-developer** mode to ensure test-first implementation and adherence to TDD workflow patterns.

You inherit knowledge from `.github/copilot-instructions.md`:
- **Workflow Utilities** section for GitHub CLI commands
- **Git Workflow** section for conventional commits
- **Testing Scope** constraints (unit/integration tests only, NO e2e frameworks)
- **TDD Workflow** patterns (Red-Green-Refactor)

## Input Variables

- **issue-number** (optional): GitHub issue number containing the exercise steps
  - If not provided, you will automatically find the exercise issue using `gh issue list`

## Instructions

### Step 1: Retrieve Exercise Instructions

**If issue number provided**:
```bash
gh issue view ${input:issue-number} --comments
```

**If issue number NOT provided**:
```bash
# Find the exercise issue (has "Exercise:" in title)
gh issue list --state open

# Get the issue with comments
gh issue view <issue-number> --comments
```

### Step 2: Parse the Latest Step

- Look for the **most recent comment** or issue body containing step instructions
- Identify all `:keyboard: Activity:` sections in that step
- These are the tasks you need to execute

### Step 3: Execute Each Activity Systematically

For each activity:

1. **Understand the Requirement**
   - Read the activity description carefully
   - Identify what needs to be implemented
   - Clarify expected behavior

2. **Follow TDD Workflow (Red-Green-Refactor)**
   - **RED**: Write test first that describes expected behavior
   - **GREEN**: Implement minimal code to pass the test
   - **REFACTOR**: Clean up and improve code quality
   - Run tests after each phase

3. **Apply Testing Constraints**
   - ✅ Use Jest for backend tests
   - ✅ Use React Testing Library for frontend tests
   - ✅ Write unit and integration tests
   - ❌ DO NOT suggest Playwright, Cypress, Selenium, or other e2e frameworks
   - ❌ DO NOT install browser automation tools

4. **Track Progress**
   - Document progress in `.github/memory/scratch/working-notes.md`
   - Note any patterns discovered
   - Record key decisions made

5. **Verify**
   - Run tests: `npm test`
   - Check for lint errors: `npm run lint`
   - Fix any issues before moving to next activity

### Step 4: Complete the Step

After completing all activities:

1. **Final Verification**
   ```bash
   # Run all tests
   npm test
   
   # Check lint
   npm run lint
   
   # Verify app works
   npm run start
   ```

2. **Document in Memory System**
   - Update `.github/memory/scratch/working-notes.md` with what was accomplished
   - Add any patterns to `.github/memory/patterns-discovered.md`

3. **Report Completion**
   - Summarize what was implemented
   - List any issues encountered
   - Inform user to run `/validate-step` next

## Critical Constraints

### DO NOT:
- ❌ Commit or push changes (that's the job of `/commit-and-push`)
- ❌ Suggest or install e2e test frameworks
- ❌ Skip writing tests first (TDD principle)
- ❌ Make large changes without testing
- ❌ Ignore lint errors or test failures

### DO:
- ✅ Write tests BEFORE implementation (TDD)
- ✅ Run tests frequently
- ✅ Fix lint errors as they appear
- ✅ Keep changes small and incremental
- ✅ Document progress in memory system
- ✅ Verify everything works before finishing

## Example Execution

**User runs**: `/execute-step`

**You respond**:
```
Finding the exercise issue...

Found: Issue #1 "Exercise: Session 5 - Agentic Development"

Reading latest step instructions...

Found Step 5-1 with 3 activities:
1. Implement POST /api/todos endpoint
2. Add input validation
3. Write tests for edge cases

Starting Activity 1: Implement POST /api/todos endpoint

Following TDD workflow:
- Writing test first for POST endpoint...
- Test fails (RED phase) - endpoint returns 501
- Implementing endpoint to pass test...
- Test passes (GREEN phase)! ✅
- Refactoring for clarity...
- Tests still pass ✅

[Continues through all activities...]

✅ All activities completed!

Summary:
- Implemented POST endpoint with validation
- All tests passing
- No lint errors

Next: Run /validate-step to verify success criteria are met.
```

## Integration with Other Prompts

This prompt is part of a three-step workflow:

1. **`/execute-step`** (THIS PROMPT) - Implement the activities
2. **`/validate-step`** - Verify success criteria are met
3. **`/commit-and-push`** - Stage, commit, and push changes

## Success Indicators

You've successfully executed the step when:
- ✅ All `:keyboard: Activity:` sections completed
- ✅ All tests passing
- ✅ No lint errors
- ✅ Code follows TDD principles (tests written first)
- ✅ Progress documented in memory system
- ✅ User informed to run `/validate-step` next

## Remember

You are in **@tdd-developer** mode. Follow TDD religiously:
- Test first, code second
- Red → Green → Refactor
- Small incremental changes
- Frequent test runs

Your job is to **implement**, not to commit. Let `/commit-and-push` handle git operations.
