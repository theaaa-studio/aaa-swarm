# Agent Guidelines: AAA Swarm

`aaa-swarm` is a universal AI agent skill for implementing or porting the multiplayer cursors "Swarm Rebuild" guided tour effect (inspired by Dhvanil Patel) into web applications.

## Compatibility
This skill adheres to the open **Agent Skills specification** and is compatible with:
- **Claude Code** (`~/.claude/skills/aaa-swarm` or `.claude/skills/aaa-swarm`)
- **OpenAI Codex** (`~/.codex/skills/aaa-swarm` or `.codex/skills/aaa-swarm`)
- **OpenCode & OpenHands** (`~/.agents/skills/aaa-swarm` or `.agents/skills/aaa-swarm`)
- **Google Antigravity / Gemini** (`~/.gemini/config/skills/aaa-swarm`)
- **Cursor & Windsurf** (`.cursorrules`, `.windsurfrules`, `.cursor/rules/`)

## Quick Execution Workflow for Agents
When an agent is asked to integrate `aaa-swarm` into a web project:

1. **Locate and Copy Assets**:
   - Locate `assets/swarm.css` and `assets/swarm.js` bundled with this skill.
   - Copy them into the project's static assets directory (e.g. `public/css/` & `public/js/` or `assets/`).

2. **Link in HTML**:
   - Add `<link rel="stylesheet" href="assets/css/swarm.css">` inside `<head>`.
   - Add `<script defer src="assets/js/swarm.js"></script>` before closing `</body>`.

3. **Initialize on DOM Ready**:
   - Verify page sections use `<section>` elements with meaningful `id` or headings inside `<main>`.
   - Initialize with:
     ```javascript
     window.addEventListener("DOMContentLoaded", () => {
       if (window.Swarm) {
         window.Swarm.init({ root: "main" });
       }
     });
     ```

4. **Verify Architecture Guardrails**:
   - Do NOT snapshot parent wrapper containers (`.container`, `.row`, `.col`, `.grid`).
   - Use sequential guided scroll (`runTour`) rather than blind intersection observers.
   - Keep background DOM geometry intact via `.swarm-pending`.
   - Respect `prefers-reduced-motion` accessibility standards.
