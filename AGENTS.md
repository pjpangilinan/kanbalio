# agents.md

> **Canonical reference for all agents operating in this project.**
> Read this file before starting any task.

## 1. Skill Usage

**Skills must be prioritized over general reasoning or guessing.**
Always check if a skill covers the task before proceeding independently.

### ⚠️ Mandatory First Step: caveman

**Always read and apply the `caveman` skill before anything else, on every task, no exceptions.**

- `caveman` is not optional and is not conditional — it applies universally.
- It minimizes token consumption and keeps all responses lean, direct, and consistent.
- Read it first. Apply it throughout. Do not substitute with general reasoning.

### Conditional Skills

After applying `caveman`, check whether any of the following skills are relevant to the current task. **Only read and apply a skill if it directly covers what you are doing.** Do not load skills speculatively.

### Rules

- **Read `caveman` first, always.** Then read any other `SKILL.md` files relevant to the task before writing code or producing any file.
- Multiple conditional skills may apply to one task — read all that are relevant.
- Skills encode environment-specific constraints (available libraries, rendering quirks, output paths) that are not in training data; skipping them lowers output quality.
- If a skill exists for the task, do not substitute with general knowledge.
- Record any important skill-derived constraints or findings in `WORKFLOW_STATE.md`.

---

## 2. Shared Handoff File

`WORKFLOW_STATE.md` is the **canonical workflow record** for this project. It is not optional.

### Core Rules

- **Read `WORKFLOW_STATE.md` before starting any work.**
- **Update `WORKFLOW_STATE.md` before finishing any work.**
- Never overwrite another agent's section unnecessarily.
- Preserve all decisions, assumptions, blockers, and next steps written by other agents.
- Do not rely on chat history as the source of truth — `WORKFLOW_STATE.md` is authoritative.

### Sections to Maintain

| Section | Owner | Notes |
|---|---|---|
| `## Status` | All agents | Current phase and active task |
| `## Decisions` | All agents | Architectural and design choices with rationale |
| `## Assumptions` | All agents | What was assumed when ground truth was unclear |
| `## Blockers` | All agents | Unresolved dependencies or problems |
| `## Open Questions` | All agents | Unresolved questions for humans or other agents |
| `## File Map` | All agents | Key file paths and what they do |
| `## Test Commands` | All agents | Exact commands and results |
| `## Handoff Notes` | All agents | Short note for the next agent |

### Update Protocol

1. Read the full file first.
2. Edit only sections relevant to your role and task.
3. Append to existing sections; do not replace unless content is outdated or incorrect.
4. Add a dated handoff note at the top of `## Handoff Notes` before finishing.

---

## 3. Writing Rules

These rules apply to all content written into `WORKFLOW_STATE.md`, comments, and inline documentation.

- **Keep entries short and structured.** One idea per bullet.
- **Prefer bullets over long paragraphs.** Paragraphs are for summaries only.
- **Record file paths when discussing code changes.**
  - ✅ `src/components/Button.tsx — updated variant prop`
  - ❌ "I updated the button component"
- **Record exact test commands and their results.**
  - ✅ `pnpm test --filter=auth → 12 passed, 0 failed`
  - ❌ "Tests pass"
- **Record unresolved questions under `## Open Questions`** with enough context for the next agent or a human to act on them.
- **Never use vague language** like "misc fixes", "minor changes", or "updated stuff".

---

## 4. Before & After Every Task

### Before Starting

1. Read `WORKFLOW_STATE.md` in full.
2. Identify the current status, active blockers, and open questions.
3. **Read `caveman` SKILL.md — mandatory, every task.**
4. Read any other `SKILL.md` files relevant to the specific task at hand.
5. Use Context7 if the task involves external libraries, frameworks, or APIs (see §5).
6. Use Serena if the task requires code navigation or understanding (see §6).

### After Finishing

1. Update only the sections of `WORKFLOW_STATE.md` relevant to your role.
2. Preserve existing content unless it is outdated or clearly incorrect — note why if removing.
3. Add a short handoff note for the next agent:
   - What you did
   - What state things are in
   - What needs to happen next
   - Any open questions or blockers you encountered
4. Record all relevant file paths, commands, and findings.

---

## 5. Context7 Usage Rules

Context7 provides up-to-date, accurate documentation for external libraries and frameworks. **Prefer it over guessing from memory.**

### When to Use Context7

| Situation | Action |
|---|---|
| Proposing a plan that uses an external library | Use Context7 before finalizing the plan |
| Implementing code that calls a third-party API | Use Context7 before writing the implementation |
| Reviewing code for correct API or framework usage | Use Context7 during review |
| Uncertain about library behavior, options, or version differences | Use Context7 immediately |

### Rules

- **Do not guess library behavior from memory.** Training data may reflect an outdated API version.
- Context7 findings that affect implementation decisions must be recorded in `WORKFLOW_STATE.md` under `## Decisions` or `## Assumptions`.
- If Context7 returns conflicting or ambiguous documentation, record it under `## Open Questions`.
- Applies to all external libraries, frameworks, and APIs — including but not limited to: React, Next.js, Tailwind, Vite, testing libraries, ORMs, and cloud SDKs.

---

## 6. Serena Usage Rules

Serena is the semantic code assistant for this project. It provides accurate, symbol-level understanding of the codebase.

### Prefer Serena Over Raw Tools

**Use Serena's MCP tools for:**

- Finding relevant files, modules, and symbols
- Understanding call graphs and data flow relationships
- Tracing where user input flows through the codebase
- Making structured, multi-file edits
- Identifying all usages of a function, type, or variable
- Understanding component hierarchies and dependencies

**Only fall back to raw `grep` / `edit` / `apply_patch` when:**

- Serena tools are clearly not applicable to the task
- The operation is purely textual with no semantic context needed

### Workflow

1. Before touching code, use Serena to understand the relevant modules and symbols.
2. Use Serena findings to inform your implementation plan before writing any code.
3. Record important Serena findings (call graphs, ownership, surprising relationships) in `WORKFLOW_STATE.md`.
4. After a Serena-guided refactor, note affected file paths in `WORKFLOW_STATE.md` under `## File Map`.

### Example Serena Use Cases

```
# Finding where a function is called
serena.find_usages("handleAuthRedirect")

# Understanding a module's exports
serena.get_module_symbols("src/lib/auth.ts")

# Tracing user input
serena.trace_data_flow(input="req.body.email", target="database.query")
```

---

## Quick Reference

```
Before any task:
  1. Read WORKFLOW_STATE.md
  2. Read caveman SKILL.md — ALWAYS, no exceptions
  3. Read other SKILL.md files only if relevant to the current task
  4. Use Context7 for external library questions
  5. Use Serena for code navigation

After any task:
  1. Update WORKFLOW_STATE.md (relevant sections only)
  2. Preserve other agents' content
  3. Write a handoff note
  4. Record file paths, commands, and findings

MCP key reminders:
  - opencode.json uses "mcp" (not "mcpServers")
  - All servers go inside one root JSON object
  - Local servers require "type": "local"
  - Serena requires uv installed; chrome-devtools requires a running browser
```