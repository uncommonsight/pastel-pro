---
name: refactor
description: Use when moving, splitting, or reorganizing code files. Enforces strict no-behavior-change rules.
---

## Rules — non-negotiable
1. MOVE code only. Never rewrite, improve, or optimize.
2. Copy functions exactly as-is, character for character.
3. No renaming functions, variables, or parameters.
4. Add a header comment block at the top of each new file 
describing what it contains.
Add a single one-liner comment before any method or CSS 
block that needs context.
No other formatting changes.
Do not rewrite or improve existing inline comments.
5. One source file per session. Finish completely before touching another.
6. After every move, update script load order in index.html.
7. After every move, verify function no longer exists in original file.

## Process
1. Read the target file fully first
2. List every function/block and which new file it belongs in
3. Show the plan — wait for approval before moving anything
4. Move one block at a time
5. After all moves: confirm nothing duplicated or missing

## Definition of done
- Original file contains only what belongs there
- New files contain exactly what was moved, nothing more
- index.html load order updated
- Smoke test passed on iPhone

## End of session
Run /handoff when file is complete or session is ending.

## Connections after every move

### CSS
- Update <link> tags in index.html
- Verify new file loads before anything that depends on it

### JS
- Search all JS files for calls to the moved function
- Confirm new file loads before any caller in index.html
- Load order in index.html is the only dependency system
- No imports/exports — globals only
- If function A in render.js calls function B you just
  moved to crop.js, crop.js must load before render.js
