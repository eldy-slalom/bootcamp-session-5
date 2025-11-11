---
description: "Global instructions for TODO application development with TDD and iterative workflows"
---

# TODO Application Development Guidelines

## Project Context

This is a full-stack TODO application built with:
- **Frontend**: React application for managing tasks
- **Backend**: Express.js REST API server
- **Development Approach**: Iterative, feedback-driven development with Test-Driven Development (TDD)
- **Current Phase**: Backend stabilization and frontend feature completion

## Documentation References

Refer to these documents for detailed guidance:
- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and project structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

Follow these core principles for all development work:

1. **Test-Driven Development (TDD)**: Follow the Red-Green-Refactor cycle
   - Write tests FIRST (Red)
   - Implement minimal code to pass (Green)
   - Clean up and optimize (Refactor)

2. **Incremental Changes**: Make small, testable modifications
   - Focus on one feature or fix at a time
   - Ensure each change is independently testable
   - Avoid large, multi-purpose commits

3. **Systematic Debugging**: Use test failures as guides
   - Read test output carefully
   - Identify root causes before implementing fixes
   - Add tests to prevent regression

4. **Validation Before Commit**: Ensure quality at every step
   - All tests must pass
   - No lint errors
   - Code follows project conventions

## Testing Scope

This project uses **unit tests and integration tests ONLY**:

### Backend Testing
- **Framework**: Jest + Supertest
- **Scope**: API endpoint testing, business logic, error handling
- **Approach**: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)

### Frontend Testing
- **Framework**: React Testing Library
- **Scope**: Component unit tests and integration tests
- **Approach**: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR)
- **UI Verification**: Follow with manual browser testing for full UI flows

### What NOT to Use
- **DO NOT** suggest or implement e2e test frameworks (Playwright, Cypress, Selenium)
- **DO NOT** suggest browser automation tools
- **Reason**: Keep lab focused on unit/integration tests without e2e complexity

### Testing Approach by Context
- **Backend API changes**: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- **Frontend component features**: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.
- **This is true TDD**: Test first, then code to pass the test

## Workflow Patterns

Follow these standardized workflows:

### 1. TDD Workflow (Red-Green-Refactor)
1. Write a failing test (RED)
2. Run tests to confirm failure
3. Implement minimal code to pass (GREEN)
4. Run tests to confirm success
5. Refactor for quality (REFACTOR)
6. Run tests to ensure refactor didn't break anything

### 2. Code Quality Workflow
1. Run linter: `npm run lint`
2. Categorize issues by severity and type
3. Fix issues systematically (one category at a time)
4. Re-run linter to validate
5. Run tests to ensure no functionality broken

### 3. Integration Workflow
1. Identify the issue or requirement
2. Debug to understand current behavior
3. Write/update tests to cover the fix
4. Implement the fix
5. Verify end-to-end functionality

## Chat Mode Usage

Use specialized chat modes for specific workflows:

- **tdd-developer**: Use for test-related work and Red-Green-Refactor cycles
  - Writing new tests
  - Implementing features with TDD
  - Debugging test failures
  - Refactoring with test coverage

- **code-reviewer**: Use for addressing lint errors and code quality improvements
  - Analyzing lint warnings/errors
  - Code style improvements
  - Best practices recommendations
  - Code cleanup and refactoring

## Memory System

Track development discoveries and patterns to maintain context across sessions:

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows
- **Working Memory**: `.github/memory/` directory contains discoveries and patterns
- **During active development**: Take notes in `.github/memory/scratch/working-notes.md` (not committed)
- **At end of session**: Summarize key findings into `.github/memory/session-notes.md` (committed)
- **Document patterns**: Add recurring code patterns to `.github/memory/patterns-discovered.md` (committed)
- **AI context**: Reference these files when providing context-aware suggestions

See [.github/memory/README.md](memory/README.md) for detailed guidance on using the memory system.

## Workflow Utilities

Use GitHub CLI commands for workflow automation (available in all modes):

### Issue Management Commands
- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get issue with comments: `gh issue view <issue-number> --comments`

### Exercise Navigation
- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

Follow these Git conventions for all commits and branches:

### Conventional Commits
Use structured commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring without behavior change
- `style:` - Code style/formatting changes

**Example**: `feat: add todo completion endpoint`

### Branch Strategy
- Feature branches: `feature/<descriptive-name>`
- Bug fix branches: `fix/<descriptive-name>`
- Always create branches from `main`

### Commit Process
1. Stage all changes: `git add .`
2. Commit with conventional format: `git commit -m "type: description"`
3. Push to the correct branch: `git push origin <branch-name>`

### Before Pushing
- All tests pass: `npm test`
- No lint errors: `npm run lint`
- Code is committed with meaningful message
