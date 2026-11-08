# Agent Guidelines: AAA Swarm

`aaa-swarm` is a universal AI agent skill for implementing or porting the multiplayer cursors "Swarm Rebuild" guided tour effect (inspired by Dhvanil Patel) into web applications, featuring **11 authentic industry themes**.

## Compatibility
This skill adheres to the open **Agent Skills specification** and is compatible with:
- **Claude Code** (`~/.claude/skills/aaa-swarm` or `.claude/skills/aaa-swarm`)
- **OpenAI Codex** (`~/.codex/skills/aaa-swarm` or `.codex/skills/aaa-swarm`)
- **OpenCode & OpenHands** (`~/.agents/skills/aaa-swarm` or `.agents/skills/aaa-swarm`)
- **Google Antigravity / Gemini** (`~/.gemini/config/skills/aaa-swarm`)
- **Cursor & Windsurf** (`.cursorrules`, `.windsurfrules`, `.cursor/rules/`)

## Quick Execution Workflow for Agents
When an agent is asked to integrate `aaa-swarm` into a web project:

0. **Mandatory Step 0: User Confirmation (CRITICAL)**:
   Before editing files or injecting scripts, ask the user to confirm:
   - **Theme Choice**: Single locked theme (e.g. `cyber-nanobots` for AI, `construction` for hardware, `kitchen` for dining) vs. Multi-Theme Dock with floating bottom switcher vs. Mixed themes per section (`data-swarm-theme`).
   - **Trigger & Frequency**: Run automatically on load, run once per session (`oncePerSession: true`), or trigger on button click.
   - **Framework**: Vanilla HTML, React/Next.js, Vue/Nuxt, Svelte/SvelteKit, or Astro.

1. **Locate and Copy Assets**:
   - Locate `assets/swarm.css` and `assets/swarm.js` bundled with this skill.
   - Copy them into the project's static assets directory (e.g. `public/css/` & `public/js/` or `assets/`).

2. **Link in HTML / Framework Mount**:
   - Add `<link rel="stylesheet" href="assets/css/swarm.css">` inside `<head>`.
   - Add `<script defer src="assets/js/swarm.js"></script>` before closing `</body>`, or use dynamic `import("./assets/swarm.js")` in React/Vue/Svelte/Astro with SSR guards.

3. **Select Industry Theme**:
   Choose the theme matching the user's project niche (each theme runs fully unique physical construction choreographies):
   - `"default"`: Tech, SaaS, Software, Portfolios (Wireframe blueprint boxes, vector pen crosshairs, terminal caret)
   - `"construction"`: Architecture, Civil Engineering, Hardware (Rising scaffolding poles & ledgers, blowtorch arc welding sparks, concrete pour & crane wooden cargo crates)
   - `"beehive"`: Organic, Eco, Honey, Agriculture, Biotech (Bumblebee figure-8 wax drift, honey drip borders, waggle dance typography & wax seal uncap)
   - `"ant-colony"`: Logistics, Databases, DevOps, Microservices (Forager ants hauling trench along pheromone trails, mandible wall borders & 8-ant heavy cargo lift)
   - `"cyber-nanobots"`: AI, Cybersecurity, Web3, Cloud (Quadcopter laser scanbars, PCB copper routing with solder pads, Matrix hex decrypt & 3D laser sinter sweep)
   - `"atelier"`: Fashion, Luxury, Tailoring, Craft (Fabric bolt unrolls, running needle bob stitches with silk thread & Polaroid brass pushpins)
   - `"warehouse"`: E-Commerce, D2C Brands, Packaging (Cardboard folding flaps, kraft tape dispenser, barcode scanner sweeps & forklift pallet delivery)
   - `"voxel-craft"`: Gaming, 8-Bit, Indie Studios, EdTech (16x16 pixel blocks snapping with bounce, Redstone wire border glow & bouncing treasure chest)
   - `"kitchen"`: Restaurants, Bakeries, Food, Bistros (Wooden rolling pin dough flattening, pastry cream piping, blowtorch caramelize & silver cloche steam lift)
   - `"street-art"`: Creative Agencies, Streetwear, Music (Paint roller diagonal wheatpaste strokes, fat-cap aerosol spray with vertical paint runs & squeegeed slap-stickers)
   - `"press-room"`: Finance, Legal, News, Academia (Iron movable-type chase frame clamping ┼, ink brayer roller sweep, mechanical typewriter hammer strikes & CMYK halftone plate alignment)

4. **Initialize with Target Options**:
   - Verify page sections use `<section>` or `[data-swarm-section]` inside `<main>` or container root.
   - Single Locked Theme (no dock, no theme dropdown):
     ```javascript
     window.Swarm.init({ root: "main", theme: "cyber-nanobots", themes: ["cyber-nanobots"] });
     ```
   - Multi-Theme Mode (with floating bottom dock):
     ```javascript
     window.Swarm.init({ root: "main", themes: ["cyber-nanobots", "default", "construction"], showDock: true });
     ```
   - In React / Vue / Svelte: always store the returned instance and call `tour.destroy()` on unmount.

5. **Verify Architecture Guardrails**:
   - Do NOT snapshot parent wrapper containers (`.container`, `.row`, `.col`, `.grid`, `.features-grid`, `.gallery-grid`).
   - Use sequential guided scroll (`runTour`) rather than blind intersection observers.
   - Keep background DOM geometry intact via `.swarm-pending`.
   - On mobile viewports (`<= 640px`), ensure floating docks remain accessible and agent count scales to `4`.
   - Respect `prefers-reduced-motion` accessibility standards.
