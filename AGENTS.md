# AGENTS

This file is for AI/code agents working in this repo. It is meant to capture the practical preferences and constraints of the current owner of the project.

## Context

- This project is currently used by one person and developed by one person.
- It is a real working internal tool, not a polished public product.
- The most important workflow is order tracking for Idaho high school state championship events.
- Other features include employee scheduling and event inventory tracking.

## Change scope

Agents may make small, local, low-risk changes without asking first.

Agents should ask before doing any of the following:

- broad refactors
- schema changes
- architectural changes
- wider cleanup beyond the immediate task
- changes to `BasicTableModel`

When in doubt, prefer the smaller and more targeted change.

## High-risk areas

Use extra caution in these parts of the codebase:

- `model/BasicTableModel.php`
- the order workflow
- `events.js` / event-page behavior
- database logic in general

`BasicTableModel` should be treated as high-risk because a lot of the app depends on it.

Database-related changes should be handled with medium caution:

- do not change database behavior unless the task requires it
- keep query/model changes narrow
- verify carefully when changing persistence logic

## Architecture direction

The project started with an MVC-style structure, but the long-term direction is different.

Preferred direction:

- pages should be rendered in JavaScript
- fetch calls should return data rather than HTML
- `view/` should be gradually migrated away from

If a task touches `view/`, prefer changes that move the app toward the JS-rendered/data-returning direction when practical. Do not force a large migration when a small fix is what is needed, but do avoid reinforcing the PHP view layer unnecessarily.

If a change would meaningfully affect architecture, stop and discuss first.

## Style preferences

Preserve the existing style unless there is a strong reason not to.

Preferred conventions:

- camelCase over snake_case or kebab-case
- abbreviated identifiers like `btn`, `evnt`, etc. are normal in this repo
- compound method names like `getAllFromDB()` are also fine

Do not rewrite or "improve" the owner's comments unless explicitly asked. Leave existing comments alone.

## Editing preferences

- prefer minimal targeted fixes over opportunistic cleanup
- do not broaden the scope of a task just because nearby code is messy
- if broader cleanup seems worthwhile, ask first

## Verification

Before saying work is done, perform the most relevant lightweight verification available for the change.

Examples:

- run a focused syntax check
- exercise the relevant local workflow
- verify the affected page behavior
- confirm that changed code paths still load correctly

Do not claim heavy verification if only a light check was performed. Be explicit about what was and was not verified.

## Local environment

Current known environment:

- XAMPP
- PHP `8.2.12`
- MariaDB
- local project path: `C:\xampp\htdocs\state`

There are no known local-only config files that agents must categorically avoid editing, but agents should still avoid incidental environment changes unless the task calls for them.

## Practical rule of thumb

Make the smallest useful change, protect the order workflow, be careful around shared database/model logic, and ask before making changes that ripple outward.
