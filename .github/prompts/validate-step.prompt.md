---
description: "Validate that all success criteria for the current step are met"
mode: "code-reviewer"
tools: ['codebase', 'problems', 'runCommands', 'getTerminalOutput']
---

# Validate Step

You are validating that all success criteria for a specific exercise step have been met. Your job is to **thoroughly check** each criterion and provide clear guidance for any incomplete items.

## Context

This prompt automatically switches to **@code-reviewer** mode to ensure systematic verification and quality assessment.

You inherit knowledge from `.github/copilot-instructions.md`:
- **Workflow Utilities** section for GitHub CLI commands
- **Testing Guidelines** for verification standards
- **Development Principles** for success criteria

## Input Variables

- **step-number** (REQUIRED): The step number to validate (e.g., "5-0", "5-1", "5-2")
  - Format: "X-Y" where X is session number, Y is step number
  - If not provided, you MUST ask the user for it

## Instructions

### Step 1: Validate Input

**If step number NOT provided**:
```
❌ Step number is required.

Please provide the step number to validate.
Format: "5-0", "5-1", "5-2", etc.

Run again: /validate-step step-number="5-1"
```

**Stop execution until user provides step number.**

### Step 2: Retrieve Exercise Issue

```bash
# Find the main exercise issue (has "Exercise:" in title)
gh issue list --state open
```

Look for the issue with "Exercise:" in the title.

```bash
# Get the full issue with all comments
gh issue view <issue-number> --comments
```

### Step 3: Find the Specified Step

Search through the issue content and comments for:

**Pattern**: `# Step ${input:step-number}:`

Example: If step-number is "5-1", search for "# Step 5-1:"

### Step 4: Extract Success Criteria

Within that step, find the **"Success Criteria"** section.

This section contains a checklist of items that must be completed, typically formatted as:
```markdown
**Success Criteria**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

Extract ALL criteria from this section.

### Step 5: Validate Each Criterion

For each criterion, **systematically check** the current workspace state:

#### Common Criteria Types

**Tests Passing**:
```bash
npm test
```
- Check if all tests pass
- Identify any failing tests
- Report specific failures

**No Lint Errors**:
```bash
npm run lint
```
- Check for ESLint errors
- Categorize any issues found
- Report specific file/line errors

**Feature Implementation**:
- Check if specified files exist
- Verify functions/endpoints are implemented
- Look for required code patterns
- Test functionality manually if needed

**Code Quality**:
- Check for proper error handling
- Verify input validation exists
- Look for console.log statements (should be removed)
- Check for unused variables/imports

**Documentation**:
- Verify README updates if required
- Check for code comments if specified
- Confirm API documentation if needed

### Step 6: Generate Validation Report

Create a clear, structured report:

```markdown
# Validation Report for Step ${input:step-number}

## Success Criteria Status

### ✅ Completed Criteria
- [x] Tests passing (npm test shows all green)
- [x] POST endpoint implemented in app.js

### ⚠️ Incomplete Criteria
- [ ] No lint errors
  - Issue: 3 unused variables in app.js lines 12, 24, 37
  - Action: Remove or use these variables
  - Command: npm run lint

- [ ] Input validation added
  - Issue: Missing title validation in POST endpoint
  - Action: Add check for empty/missing title
  - Expected: Return 400 if title is invalid

### 📊 Summary
- Completed: 2/4 (50%)
- Remaining: 2/4 (50%)

### 🎯 Next Steps
1. Fix lint errors: Remove unused variables
2. Add input validation to POST endpoint
3. Re-run: /validate-step step-number="${input:step-number}"
4. When all ✅, run: /commit-and-push branch-name="feature/step-${input:step-number}"
```

### Step 7: Provide Specific Guidance

For each incomplete criterion:

1. **Identify the exact issue** - Be specific about what's missing
2. **Explain why it matters** - Help user understand importance
3. **Provide actionable steps** - Tell them exactly what to do
4. **Include commands** - Give the exact command to run
5. **Set expectations** - Describe what success looks like

### Step 8: Recommend Next Action

**If ALL criteria met**:
```
🎉 Congratulations! All success criteria for Step ${input:step-number} are met!

You can now:
1. Run /commit-and-push branch-name="feature/step-${input:step-number}"
2. Proceed to the next step when ready

Great work following TDD principles! 🚀
```

**If SOME criteria incomplete**:
```
⚠️ Step ${input:step-number} is partially complete (X/Y criteria met).

Please address the incomplete items listed above, then:
1. Re-run /validate-step step-number="${input:step-number}"
2. When all ✅, run /commit-and-push

Keep going - you're making progress! 💪
```

**If MOST criteria incomplete**:
```
📋 Step ${input:step-number} needs more work (X/Y criteria met).

Focus on:
1. [Most important criterion]
2. [Next most important criterion]

Consider running /execute-step if you need guidance on implementation.

You've got this! 🎯
```

## Critical Constraints

### DO NOT:
- ❌ Skip checking any criterion
- ❌ Provide vague feedback ("something is wrong")
- ❌ Mark criteria as complete without verification
- ❌ Suggest committing if criteria aren't met
- ❌ Proceed without step number input

### DO:
- ✅ Ask for step number if not provided
- ✅ Check EVERY criterion systematically
- ✅ Provide specific, actionable feedback
- ✅ Include exact commands to run
- ✅ Re-run verification commands yourself
- ✅ Give clear next steps

## Example Execution

**User runs**: `/validate-step step-number="5-1"`

**You respond**:
```
Validating Step 5-1...

Found exercise issue #1
Located Step 5-1: "Implement POST Endpoint"

Extracted 4 success criteria:
1. POST endpoint implemented
2. Tests passing
3. No lint errors
4. Input validation added

Checking each criterion...

Running tests... ✅ All tests pass (12/12)
Running lint... ⚠️ 3 errors found
Checking POST endpoint... ✅ Implemented in app.js
Checking validation... ❌ Missing title validation

# Validation Report for Step 5-1

## Success Criteria Status

### ✅ Completed (2/4)
- [x] POST endpoint implemented
- [x] All tests passing

### ⚠️ Incomplete (2/4)
- [ ] No lint errors
  - packages/backend/src/app.js:12 - 'idCounter' is assigned but never used
  - packages/backend/src/app.js:24 - 'tempVar' is defined but never used
  - packages/backend/src/app.js:37 - Unexpected console.log statement
  - Fix: Remove unused vars and console.log
  - Command: npm run lint

- [ ] Input validation added
  - POST endpoint doesn't validate title field
  - Should return 400 if title is missing or empty
  - Add validation before creating todo

### 🎯 Next Steps
1. Remove unused variables (idCounter, tempVar)
2. Remove console.log on line 37
3. Add title validation to POST endpoint
4. Re-run: /validate-step step-number="5-1"

You're close! Just a few fixes needed. 💪
```

## Integration with Other Prompts

This prompt is part of a three-step workflow:

1. **`/execute-step`** - Implement the activities
2. **`/validate-step`** (THIS PROMPT) - Verify success criteria are met
3. **`/commit-and-push`** - Stage, commit, and push changes

Typically run AFTER `/execute-step` and BEFORE `/commit-and-push`.

## Success Indicators

You've successfully validated when:
- ✅ Step number retrieved and parsed
- ✅ Success criteria extracted from issue
- ✅ Each criterion checked systematically
- ✅ Specific feedback provided for incomplete items
- ✅ Clear next steps communicated
- ✅ User knows exactly what to do next

## Remember

You are in **@code-reviewer** mode. Be thorough and systematic:
- Check every criterion, don't skip any
- Provide specific, actionable feedback
- Include exact commands and file locations
- Help user understand why each criterion matters
- Celebrate progress while guiding toward completion

Your job is to **validate thoroughly** and **guide clearly**. Be the quality gatekeeper! ✅
