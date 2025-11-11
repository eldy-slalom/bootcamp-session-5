---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['runCommands', 'getTerminalOutput']
---

# Commit and Push

You are responsible for analyzing code changes, creating a meaningful commit message, and pushing to a feature branch following Git best practices.

## Context

This prompt works in **any mode** (does not specify a mode) and can be used after completing work in any workflow.

You inherit knowledge from `.github/copilot-instructions.md`:
- **Git Workflow** section for conventional commit format
- **Branch Strategy** guidelines
- **Commit Process** best practices

## Input Variables

- **branch-name** (REQUIRED): Name of the feature branch to commit and push to
  - Format: `feature/<descriptive-name>` or `fix/<descriptive-name>`
  - If not provided, you MUST ask the user for it

## Instructions

### Step 1: Validate Branch Name

**If branch name NOT provided**:
```
❌ Branch name is required.

Please provide a branch name:
- Format: feature/<descriptive-name> or fix/<descriptive-name>
- Example: feature/add-delete-endpoint
- Example: fix/toggle-bug

Run again: /commit-and-push branch-name="feature/your-branch-name"
```

**Stop execution until user provides branch name.**

### Step 2: Analyze Changes

```bash
# Check current branch
git branch --show-current

# See what changed
git status

# View detailed changes
git diff
```

Analyze the changes to understand:
- What files were modified
- What functionality was added/changed/removed
- What type of change this is (feat, fix, chore, test, etc.)

### Step 3: Generate Commit Message

Use **Conventional Commits** format from the project instructions:

**Format**: `<type>: <description>`

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring without behavior change
- `style:` - Code style/formatting changes

**Examples**:
- `feat: add DELETE endpoint for todos`
- `fix: correct toggle behavior to flip completed state`
- `test: add validation tests for POST endpoint`
- `chore: remove unused imports and console.logs`
- `refactor: extract validation logic into separate function`

**Generate a clear, descriptive message** that summarizes the changes.

### Step 4: Branch Operations

**Check if branch exists**:
```bash
git branch --list ${input:branch-name}
```

**If branch does NOT exist**:
```bash
# Create and switch to new branch
git checkout -b ${input:branch-name}
```

**If branch DOES exist**:
```bash
# Switch to existing branch
git checkout ${input:branch-name}
```

### Step 5: Stage Changes

```bash
# Stage all changes
git add .
```

Verify what's staged:
```bash
git status
```

### Step 6: Commit

```bash
# Commit with generated message
git commit -m "<your-generated-message>"
```

### Step 7: Push to Branch

```bash
# Push to the specified branch
git push origin ${input:branch-name}
```

**CRITICAL**: ONLY push to the user-provided branch name. NEVER push to `main` or any other branch.

### Step 8: Confirm Completion

Report back to the user:

```
✅ Changes committed and pushed successfully!

Branch: ${input:branch-name}
Commit: <generated-message>

Changes:
- <summary of files changed>
- <summary of modifications>

Next steps:
- Create a pull request if ready to merge
- Continue working on this branch
- Run /execute-step for the next step
```

## Critical Constraints

### DO NOT:
- ❌ Push to `main` branch
- ❌ Push to any branch other than the user-provided branch
- ❌ Commit without analyzing changes first
- ❌ Use vague commit messages like "update files"
- ❌ Stage and commit if there are no changes

### DO:
- ✅ Ask for branch name if not provided
- ✅ Create branch if it doesn't exist
- ✅ Use conventional commit format
- ✅ Write clear, descriptive commit messages
- ✅ Verify what's being committed
- ✅ Push only to specified feature branch

## Example Execution

**User runs**: `/commit-and-push branch-name="feature/add-delete-endpoint"`

**You respond**:
```
Analyzing changes...

Current branch: main
Modified files:
- packages/backend/src/app.js (DELETE endpoint added)
- packages/backend/__tests__/app.test.js (new tests added)

Change type: New feature (feat)

Generated commit message:
"feat: add DELETE endpoint for removing todos"

Creating feature branch...
✓ Branch 'feature/add-delete-endpoint' created

Staging changes...
✓ 2 files staged

Committing...
✓ Committed: feat: add DELETE endpoint for removing todos

Pushing to origin/feature/add-delete-endpoint...
✓ Pushed successfully

✅ Complete! Your changes are now on the feature/add-delete-endpoint branch.

Next: Create a PR or continue working on this branch.
```

## Error Handling

### If no changes to commit:
```
ℹ️ No changes detected in the workspace.

Run 'git status' to verify.

Nothing to commit.
```

### If branch name not provided:
```
❌ Branch name is required.

Please run: /commit-and-push branch-name="feature/your-branch-name"
```

### If push fails:
```
⚠️ Push failed. This might be because:
- Remote branch has changes you don't have locally
- Authentication issues
- Network problems

Try: git pull origin ${input:branch-name} --rebase

Then run /commit-and-push again.
```

## Integration with Other Prompts

This prompt is part of a three-step workflow:

1. **`/execute-step`** - Implement the activities
2. **`/validate-step`** - Verify success criteria are met
3. **`/commit-and-push`** (THIS PROMPT) - Stage, commit, and push changes

Typically used AFTER `/execute-step` and `/validate-step` confirm work is complete.

## Success Indicators

You've successfully completed when:
- ✅ Changes analyzed and understood
- ✅ Meaningful commit message generated (conventional format)
- ✅ Branch created or switched to correctly
- ✅ All changes staged
- ✅ Commit created with good message
- ✅ Changes pushed to feature branch (NOT main)
- ✅ User informed of completion

## Remember

- **Always ask for branch name** if not provided
- **Never push to main** - only to feature branches
- **Write meaningful commit messages** using conventional format
- **Verify before pushing** - check what's being committed
- This is the **final step** in the workflow after validation
