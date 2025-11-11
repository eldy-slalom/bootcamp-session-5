# Memory System for AI-Assisted Development

## Purpose

This memory system helps track patterns, decisions, and lessons learned during iterative development. It enables both human developers and AI assistants to maintain context across sessions and make better-informed decisions based on accumulated knowledge.

## Two Types of Memory

### Persistent Memory
- **Location**: `.github/copilot-instructions.md`
- **Purpose**: Foundational principles, workflows, and project-wide guidelines
- **Lifecycle**: Rarely changes; represents stable project conventions
- **Git Status**: Always committed

### Working Memory
- **Location**: `.github/memory/` directory
- **Purpose**: Track discoveries, patterns, and decisions during development
- **Lifecycle**: Grows and evolves as the project develops
- **Git Status**: Mixed (see below)

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical summaries of completed sessions (COMMITTED)
├── patterns-discovered.md       # Accumulated code patterns and learnings (COMMITTED)
└── scratch/
    ├── .gitignore               # Ignores all scratch files
    └── working-notes.md         # Active session notes (NOT COMMITTED)
```

### File Purposes

#### `session-notes.md` (Committed)
- **What**: Historical record of completed development sessions
- **When to Update**: At the end of each significant development session
- **Content**: Summary of what was accomplished, key findings, decisions made, and outcomes
- **Git Status**: Committed to repository as permanent record
- **Benefit**: Future developers (and AI) can understand the evolution of the codebase

#### `patterns-discovered.md` (Committed)
- **What**: Reusable code patterns identified during development
- **When to Update**: When you discover a recurring pattern, best practice, or anti-pattern
- **Content**: Pattern name, context, problem, solution, examples, and related files
- **Git Status**: Committed to repository as shared knowledge
- **Benefit**: Consistency across codebase; AI can apply patterns automatically

#### `scratch/working-notes.md` (Not Committed)
- **What**: Active session workspace for current task
- **When to Update**: Throughout your active development session
- **Content**: Current task, approach, findings, decisions, blockers, next steps
- **Git Status**: NOT committed (ignored by git)
- **Benefit**: Ephemeral workspace that doesn't clutter git history
- **Workflow**: At session end, distill key findings into `session-notes.md`, then clear or archive

## When to Use Each File

### During TDD Workflow

**Red Phase (Test Fails)**
- Document test failure in `scratch/working-notes.md` under "Key Findings"
- Note why the test fails and what's missing

**Green Phase (Implement)**
- Track implementation approach in "Approach" section
- Note any discoveries about how the code works

**Refactor Phase**
- If you discover a reusable pattern, add it to `patterns-discovered.md`
- Document the refactoring decision in "Decisions Made"

**Session End**
- Summarize the TDD cycle outcomes in `session-notes.md`

### During Linting Workflow

**Analysis Phase**
- List lint errors in `scratch/working-notes.md` under "Current Task"
- Categorize by type (unused vars, missing error handling, etc.)

**Fix Phase**
- Track systematic fixes in "Approach"
- Note any patterns (e.g., "All API routes missing try-catch")

**Discovery Phase**
- If a pattern emerges (e.g., "Always wrap Express routes in async error handler"), add to `patterns-discovered.md`

**Session End**
- Summarize lint categories fixed and patterns discovered in `session-notes.md`

### During Debugging Workflow

**Problem Identification**
- Document the bug in `scratch/working-notes.md` under "Current Task"
- Include error messages, stack traces, or unexpected behavior

**Investigation**
- Track hypotheses and tests in "Approach"
- Note findings (e.g., "Array initialized as null instead of []")

**Root Cause**
- Document the root cause in "Key Findings"
- If it's a common mistake, add to `patterns-discovered.md` as an anti-pattern

**Fix Implementation**
- Document the fix in "Decisions Made"
- Reference related test updates

**Session End**
- Summarize bug, root cause, and fix in `session-notes.md`

### During Integration Testing

**Issue Discovery**
- Document integration issues in `scratch/working-notes.md`
- Note which components don't work together and why

**End-to-End Validation**
- Track manual testing steps and results
- Document any UI/UX issues discovered

**Pattern Recognition**
- If you discover integration patterns (e.g., "Frontend always needs error boundaries for API calls"), add to `patterns-discovered.md`

## How AI Reads and Applies Memory

### At Start of Conversation
1. AI reads `.github/copilot-instructions.md` for foundational principles
2. AI reads `patterns-discovered.md` for project-specific patterns
3. AI reads `session-notes.md` for historical context
4. AI reads `scratch/working-notes.md` if it exists for current session context

### During Development
- When suggesting code, AI applies patterns from `patterns-discovered.md`
- When debugging, AI references similar issues from `session-notes.md`
- When making decisions, AI considers context from `scratch/working-notes.md`

### Pattern Application Example
If `patterns-discovered.md` contains:
```
Pattern: Initialize arrays as empty [] not null
Context: Service initialization
```

Then when you ask AI to create a new service, it will automatically initialize arrays as `[]` instead of `null`, without you having to specify this preference.

## Difference: Committed vs Ephemeral

### `session-notes.md` (Committed)
- **Purpose**: Permanent historical record
- **Audience**: Future developers, team members, AI in future sessions
- **Content**: Polished summaries of completed work
- **Frequency**: Updated at end of significant sessions
- **Example**: "Session 2024-01-15: Fixed toggle bug - discovered array mutation issue"

### `scratch/working-notes.md` (Not Committed)
- **Purpose**: Active thinking space for current session
- **Audience**: You and AI during active session only
- **Content**: Raw notes, thoughts, debugging steps, in-progress findings
- **Frequency**: Updated continuously during active work
- **Example**: "Trying fix #3: Change line 45 to toggle instead of set to true - TESTING NOW"

**Workflow**: Think of scratch notes as your whiteboard during the session, and session notes as the summary you'd write in a lab notebook at the end of the day.

## Best Practices

### Do ✅
- Write freely in `scratch/working-notes.md` during active work
- Distill key learnings into `session-notes.md` at session end
- Add patterns to `patterns-discovered.md` when you spot them
- Keep patterns concise and actionable
- Include code examples in patterns
- Reference these files when asking AI for help

### Don't ❌
- Don't commit scratch files (they're gitignored automatically)
- Don't duplicate information across files
- Don't write novels - keep entries concise
- Don't add patterns until you've seen them at least twice
- Don't forget to update session notes at end of work

## Example Workflow

1. **Start Session**: Review `session-notes.md` for context from last session
2. **Active Work**: Take notes in `scratch/working-notes.md` as you work
3. **Discovery**: When you spot a pattern, add it to `patterns-discovered.md`
4. **End Session**: Summarize key findings into `session-notes.md`
5. **Next Session**: AI reads committed files and continues with context

## Benefits

- **Continuity**: Pick up where you left off, even days later
- **Pattern Recognition**: Build a library of project-specific best practices
- **AI Context**: AI provides better suggestions based on your project's patterns
- **Team Knowledge**: Share discoveries with team members
- **Learning**: Track your own learning and decision-making process
- **Debugging**: Reference past issues and solutions
- **Onboarding**: New developers (or AI assistants) can quickly understand project conventions

## Getting Started

1. Read this README
2. Review the templates in `session-notes.md` and `patterns-discovered.md`
3. Start your next session by creating notes in `scratch/working-notes.md`
4. At the end, distill your findings into `session-notes.md`
5. Add any patterns you discovered to `patterns-discovered.md`

Remember: The goal is to capture knowledge, not create busywork. If an entry doesn't help future you or future AI, skip it.
