# Requirements Document

## Introduction

This feature covers the generation, maintenance, and validation of `AI_CODEBASE_REFERENCE.md` — a compact, AI-oriented codebase reference document for the KontraktorPro project. The document is not human documentation; it is a structured reference consumed by AI agents to reduce hallucination and provide accurate, source-verified context about the codebase. It must reflect only what is explicitly found in source code, flag planned integrations with `[PLANNED]` markers, and remain accurate as the codebase evolves.

The document already exists at the project root. This spec governs the rules for its initial generation, incremental update process, inclusion/exclusion criteria, and accuracy validation.

---

## Glossary

- **AI_CODEBASE_REFERENCE.md**: The AI-oriented codebase reference document located at the project root.
- **Reference Document**: Synonym for `AI_CODEBASE_REFERENCE.md`.
- **Source-verified**: A fact that is directly confirmed by reading source code files, not inferred or assumed.
- **[PLANNED] marker**: A text tag appended to any entry that describes a feature or integration that is designed but not yet implemented in source code.
- **Section anchor**: A markdown heading that produces a stable, parseable HTML anchor (e.g., `## 1. Project Overview` → `#1-project-overview`).
- **Incremental update**: A targeted revision of one or more sections of the Reference Document triggered by a specific codebase change.
- **Full regeneration**: A complete re-scan of the codebase to rebuild all sections of the Reference Document from scratch.
- **Stale entry**: Any entry in the Reference Document that no longer matches the current source code.
- **Mock-only**: A feature or data source that exists only as hardcoded or in-memory data with no real service or database backing.
- **IMPLEMENTATION_PLAN.md**: The project-level implementation plan at the project root that defines phases, entities, and service contracts.
- **Blueprint**: A markdown design file located in `design-reference/markdown/` describing a planned UI or feature.
- **Drizzle schema**: The database schema defined in `src/lib/db/schema.ts` using Drizzle ORM.
- **Service contract**: A TypeScript interface defined in `src/lib/services/contracts.ts` with no real implementation yet.

---

## Requirements

### Requirement 1 — Document Structure and Section Anchors

**User Story:** As an AI agent consuming the Reference Document, I want a consistent, parseable structure with stable section anchors, so that I can navigate directly to any section without scanning the full document.

#### Acceptance Criteria

1. THE Reference Document SHALL contain exactly the following ten top-level sections in order: `1. Project Overview`, `2. Feature Map`, `3. Route Map`, `4. Function Reference`, `5. API Flow Map`, `6. Dependency Map`, `7. Data Layer`, `8. Sensitive Areas`, `9. Unknown / Unclear Areas`, `10. Planned But Not Yet Built`.
2. THE Reference Document SHALL include a Table of Contents at the top with anchor links to each of the ten sections.
3. WHEN a section heading is written, THE Reference Document SHALL use the format `## N. Section Name` so that the generated HTML anchor is stable and predictable (e.g., `#1-project-overview`).
4. THE Reference Document SHALL begin with a machine-readable header block stating that it is an operational reference for AI agents only, that behavior must never be assumed, and that only source-verified facts are documented.

---

### Requirement 2 — Source-Only Content Rule

**User Story:** As an AI agent, I want every entry in the Reference Document to be source-verified, so that I do not act on hallucinated or assumed behavior.

#### Acceptance Criteria

1. THE Reference Document SHALL only document functions, routes, components, data flows, and dependencies that are explicitly present in source code files at the time of generation.
2. WHEN a feature, integration, or behavior is described in `IMPLEMENTATION_PLAN.md` or a Blueprint but has no corresponding source code, THE Reference Document SHALL mark that entry with `[PLANNED]` and place it in Section 10.
3. IF a source file is deleted or a function is removed, THEN THE Reference Document SHALL remove the corresponding entry from all sections during the next update.
4. THE Reference Document SHALL NOT contain inferred behavior, assumed logic, or descriptions of how a system "should" work unless that behavior is directly readable in source code.

---

### Requirement 3 — [PLANNED] Marker Usage

**User Story:** As an AI agent, I want planned integrations clearly distinguished from implemented ones, so that I do not treat unbuilt features as available.

#### Acceptance Criteria

1. WHEN an entry describes a feature or integration that is defined in `IMPLEMENTATION_PLAN.md` or a Blueprint but has no source implementation, THE Reference Document SHALL append `[PLANNED]` to that entry.
2. WHEN a `[PLANNED]` entry gains a source implementation, THE Reference Document SHALL remove the `[PLANNED]` marker and move the entry to the appropriate implemented section.
3. THE Reference Document SHALL NOT use `[PLANNED]` on entries that have any partial source implementation — partial implementations SHALL be documented as `BUILT — [description of partial state]`.
4. THE Reference Document SHALL cross-reference each `[PLANNED]` entry in Section 10 with its source Blueprint filename and `IMPLEMENTATION_PLAN.md` phase where both are known.

---

### Requirement 4 — Feature Map Accuracy

**User Story:** As an AI agent, I want an accurate Feature Map, so that I know which features exist, their route group, implementation status, and risk level.

#### Acceptance Criteria

1. THE Feature Map SHALL list every distinct user-facing feature as a row in a markdown table with columns: `Feature`, `Route Group`, `Status`, `Risk`.
2. WHEN a feature's status is `BUILT`, THE Feature Map SHALL qualify the status with a brief description of the current implementation state (e.g., `BUILT — static mock data`, `BUILT — Server Action + in-memory mock`).
3. WHEN a feature has no source implementation, THE Feature Map SHALL set its status to `NOT BUILT` and leave the Route Group column empty.
4. THE Feature Map SHALL assign a Risk value of `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` to each feature based on the sensitivity of the data or operations it handles.

---

### Requirement 5 — Route Map Accuracy

**User Story:** As an AI agent, I want an accurate Route Map, so that I can identify every page route, its auth guard type, and whether API routes exist.

#### Acceptance Criteria

1. THE Route Map SHALL list every Next.js App Router page route found in `src/app/` as a path string.
2. THE Route Map SHALL include a Route Groups table showing each route group, its path prefix, whether an auth guard is applied, and the guard type.
3. WHEN no `route.ts` files exist in `src/app/`, THE Route Map SHALL explicitly state "No API route handlers exist."
4. WHEN a new page file is added to `src/app/`, THE Route Map SHALL be updated to include the new route in the next incremental update.

---

### Requirement 6 — Function Reference Accuracy

**User Story:** As an AI agent, I want a Function Reference that lists all significant exported functions with their signatures and verified behavior, so that I can call or reason about them correctly.

#### Acceptance Criteria

1. THE Function Reference SHALL document every exported function in the following files: `src/lib/auth/session.ts`, `src/features/auth/actions.ts`, `src/features/auth/mock-auth-service.ts`, `src/lib/utils.ts`, and any file that exports shared utility or data-access functions used by more than one page.
2. WHEN a function's behavior is verified by reading its source implementation, THE Function Reference SHALL mark it `VERIFIED`.
3. WHEN a function's implementation is a mock or stub, THE Function Reference SHALL note the mock behavior explicitly (e.g., "linear scan of in-memory user map").
4. THE Function Reference SHALL NOT document internal helper functions that are not exported and not called across module boundaries.

---

### Requirement 7 — Dependency Map Accuracy

**User Story:** As an AI agent, I want an accurate Dependency Map, so that I know which packages are active, which are installed but unused, and what each one does.

#### Acceptance Criteria

1. THE Dependency Map SHALL list every production dependency from `package.json` with its pinned version, role, and a notes column.
2. WHEN a package is installed in `package.json` but has no import or usage found in source files, THE Dependency Map SHALL note it as "installed, not yet used" or "installed but NOT used."
3. THE Dependency Map SHALL list shared internal utility paths with the modules that consume them and their purpose.
4. THE Dependency Map SHALL list every Service Contract interface with its file path and the `[PLANNED]` real provider where known.

---

### Requirement 8 — Data Layer Accuracy

**User Story:** As an AI agent, I want an accurate Data Layer section, so that I know the database schema, enum definitions, and all mock data sources without conflating them.

#### Acceptance Criteria

1. THE Data Layer section SHALL document every table in the Drizzle schema with its primary key, notable columns, and any declared foreign key relationships.
2. WHEN no foreign key constraints are declared in the Drizzle schema, THE Data Layer section SHALL explicitly state this.
3. THE Data Layer section SHALL list every canonical enum from `src/lib/contracts/enums.ts` with all its values.
4. WHEN a parallel or conflicting type definition exists in a non-canonical file (e.g., a mock-data file using different string values for the same concept), THE Data Layer section SHALL document both and explicitly state they are not interchangeable.
5. THE Data Layer section SHALL list every mock data source file with the modules that consume it and a description of what it contains.

---

### Requirement 9 — Sensitive Areas Accuracy

**User Story:** As an AI agent, I want a Sensitive Areas section that flags security-critical code, so that I do not inadvertently weaken auth, RBAC, or data protection.

#### Acceptance Criteria

1. THE Sensitive Areas section SHALL list every file or pattern that handles authentication, session management, role-based access control, or secrets.
2. WHEN a security misconfiguration is present in source code (e.g., `secure: false` on cookies, plaintext passwords in mock store), THE Sensitive Areas section SHALL document it explicitly with a note that it must be corrected before production.
3. THE Sensitive Areas section SHALL assign a risk level of `CRITICAL`, `HIGH`, or `MEDIUM` to each entry.
4. THE Sensitive Areas section SHALL NOT document the values of secrets — it SHALL reference them by key name only (e.g., `DATABASE_URL` in `.env`).

---

### Requirement 10 — Unknown / Unclear Areas

**User Story:** As an AI agent, I want an Unknown / Unclear Areas section that flags ambiguities and inconsistencies in the codebase, so that I do not make incorrect assumptions about unresolved design decisions.

#### Acceptance Criteria

1. THE Unknown / Unclear Areas section SHALL list every case where an installed package has no usage, a route is referenced in navigation but does not exist as a page, or two conflicting implementations of the same concept exist.
2. WHEN a navigation file references a route that has no corresponding page file in `src/app/`, THE Unknown / Unclear Areas section SHALL document the discrepancy.
3. WHEN two files define the same utility function (e.g., `cn` in both `src/lib/utils.ts` and `src/lib/ui/cn.ts`), THE Unknown / Unclear Areas section SHALL document the duplication and note which is preferred.
4. THE Unknown / Unclear Areas section SHALL NOT speculate on the reason for an ambiguity — it SHALL only state what is observed.

---

### Requirement 11 — Incremental Update Process

**User Story:** As a developer, I want a defined incremental update process for the Reference Document, so that it stays accurate as the codebase evolves without requiring a full regeneration every time.

#### Acceptance Criteria

1. WHEN a source file is added, modified, or deleted, THE update process SHALL identify which sections of the Reference Document are affected and update only those sections.
2. THE update process SHALL re-scan the affected source files to verify current state before writing any update to the Reference Document.
3. WHEN a `[PLANNED]` feature gains a source implementation, THE update process SHALL move the entry from Section 10 to the appropriate section and remove the `[PLANNED]` marker.
4. WHEN a mock data source is replaced by a real service or database query, THE update process SHALL update the Feature Map status, API Flow Map, Data Layer, and Dependency Map entries for that feature in the same update pass.
5. THE update process SHALL preserve all sections not affected by the triggering change without modification.

---

### Requirement 12 — Full Regeneration Trigger

**User Story:** As a developer, I want a defined trigger for full regeneration of the Reference Document, so that accumulated drift is corrected periodically.

#### Acceptance Criteria

1. THE full regeneration process SHALL re-scan every source file in `src/`, `drizzle.config.ts`, `package.json`, `IMPLEMENTATION_PLAN.md`, and all Blueprint files in `design-reference/markdown/`.
2. WHEN a full regeneration is triggered, THE Reference Document SHALL be rebuilt from scratch using only source-verified facts from the current codebase state.
3. THE full regeneration process SHALL flag any entry from the previous version of the Reference Document that cannot be verified in the current source scan as a stale entry and remove it.
4. WHEN the full regeneration is complete, THE Reference Document SHALL reflect the exact current state of the codebase with no stale entries remaining.

---

### Requirement 13 — Inclusion and Exclusion Rules

**User Story:** As an AI agent generating or updating the Reference Document, I want explicit rules for what to include and exclude, so that the document stays compact and low-noise.

#### Acceptance Criteria

1. THE Reference Document SHALL include: exported functions used across module boundaries, all page routes, all route group auth guards, all production dependencies, all Drizzle schema tables, all canonical enums, all service contract interfaces, all mock data sources, and all security-sensitive files.
2. THE Reference Document SHALL NOT include: internal helper functions not exported across module boundaries, CSS class definitions, SVG or image asset contents, test files, generated files in `.next/`, or `node_modules/` contents.
3. THE Reference Document SHALL NOT include prose descriptions longer than two sentences per entry — all entries SHALL use tables, bullet lists, or code blocks.
4. WHEN a file contains only re-exports with no logic, THE Reference Document SHALL document the re-export target rather than the re-export file.

---

### Requirement 14 — Validation

**User Story:** As a developer, I want a validation step that confirms the Reference Document is accurate, so that I can trust it as a reliable source of truth for AI agents.

#### Acceptance Criteria

1. WHEN a validation pass is run, THE validation process SHALL check that every route listed in Section 3 corresponds to an existing page file in `src/app/`.
2. WHEN a validation pass is run, THE validation process SHALL check that every function listed in Section 4 corresponds to an exported function in the referenced source file.
3. WHEN a validation pass is run, THE validation process SHALL check that every dependency listed in Section 6 appears in `package.json`.
4. WHEN a validation pass is run, THE validation process SHALL check that every table listed in Section 7 corresponds to a table defined in `src/lib/db/schema.ts`.
5. IF any validation check fails, THEN THE validation process SHALL report the stale entry with the section number, entry name, and the reason it failed validation.
