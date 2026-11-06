---
name: aaa-swarm
description: Implements or ports the multiplayer cursors 'Swarm Rebuild' guided tour effect (Dhvanil Patel style) to any web project. Includes blueprint background, flocking cursor agents, border pens, typewriter typography, camera scroll-follow, top-return on completion, and instant skip controls.
---

# AAA Swarm — Multiplayer Rebuild Guided Tour

## Overview
`aaa-swarm` drops an interactive, high-impact multiplayer cursor rebuild experience into any website. A flock of labeled agent cursors (`Designer`, `Dev`, `AAA`, `Artist`, etc.) collaborates to assemble the web page element by element before the visitor's eyes:
- **Blueprint Grid**: Dark or light blueprint dot matrix canvas sits behind the content (`z-index: 0`).
- **Autonomous Agent Flocking**: Multi-cursor physics with velocity smoothing, collision separation, and tool states (`cross`, `pen`, `text`).
- **Guided Scroll-Follow Tour**: Automatically smooth-scrolls the viewport down to each section as it begins construction, guaranteeing visitors never miss the animation offscreen.
- **Auto-Return to Top**: Once the entire site has been constructed, smoothly glides the viewport back to the top (`y = 0`) to begin regular browsing.
- **Instant Skip & Replay**: Floating pill toolbar with status, speed multiplier toggle (1× / 2× / 3×), and instant **Skip** button (`Esc` key) to immediately unveil everything. Replay button (`Alt+Shift+S`) allows restarting the tour anytime.

---

## Bundled Assets & Reference Files
Ready-to-use drop-in implementations are stored alongside this skill:
- **CSS Stylesheet**: [`assets/swarm.css`](file:///C:/Users/AAA/.gemini/config/skills/aaa-swarm/assets/swarm.css)
- **Engine Script**: [`assets/swarm.js`](file:///C:/Users/AAA/.gemini/config/skills/aaa-swarm/assets/swarm.js)

---

## Integration Guide

### Step 1: Copy Assets into Project
Copy the CSS and JS files into the target project's public or asset directories:
```powershell
Copy-Item "C:\Users\AAA\.gemini\config\skills\aaa-swarm\assets\swarm.css" "path/to/project/assets/css/swarm.css"
Copy-Item "C:\Users\AAA\.gemini\config\skills\aaa-swarm\assets\swarm.js" "path/to/project/assets/js/swarm.js"
```

### Step 2: Link in HTML
In the site's HTML template or `<head>`:
```html
<link rel="stylesheet" href="assets/css/swarm.css">
```

Before the closing `</body>`:
```html
<script defer src="assets/js/swarm.js"></script>
```

### Step 3: Initialize on DOM Ready
Ensure the site has structured `<section>` elements within `<main>` or a container root.
```javascript
window.addEventListener("DOMContentLoaded", () => {
  if (window.Swarm) {
    window.Swarm.init({ root: "main" });
  }
});
```

*Note for SPAs (React, Vue, Svelte, Next.js):* Call `Swarm.init({ root: "main" })` inside `useEffect` or `onMounted` **after** dynamic components have rendered into the DOM.

### Step 4: Optional Replay Button
To give visitors a way to trigger the rebuild anytime (e.g., in a bottom navigation bar or header):
```html
<button type="button" class="rebuild-nav-btn" onclick="window.Swarm && window.Swarm.replay()" title="Rebuild page">
  Rebuild Tour
</button>
```

---

## Public API

The engine exposes `window.Swarm`:

| Method | Parameters | Description |
|---|---|---|
| `Swarm.init(opts)` | `{ root: "main", agents: 10 }` | Initializes run, snapshots DOM, starts guided scroll tour |
| `Swarm.play(opts)` | `{ root, agents }` | Alias for `init()` |
| `Swarm.skip()` | *None* | Cancels tour, unveils all pending elements, restores regular browsing |
| `Swarm.replay()` | *None* | Cleans up current run, scrolls to top, and runs fresh tour |
| `Swarm.triggerSectionById(id)` | `sectionId` | Jumps tour directly to a specific section by element ID |
| `Swarm.isRunning()` | *None* | Returns `true` if tour/rebuild is actively in progress |

### Keyboard Shortcuts
- **`Escape`**: Instantly skips animation and reveals all sections.
- **`Alt + Shift + S`**: Restarts the tour from top.

---

## Critical Architecture Guardrails

When modifying or customizing the swarm engine, adhere to these battle-tested rules:

1. **Exclude Layout Wrapper Containers from Snapshotting**:
   - In `snapshotSection()`, ignore structural layout classes such as `.container`, `.grid`, `.cards`, `.row`, `.col`, `.hero-wrap`.
   - *Why:* If a parent layout wrapper (e.g. `1100px × 600px`) is counted as a card, agents draw a massive empty outline and block child cards from rendering until the parent finishes.

2. **Sequential Guided Scroll vs Blind Viewport Queueing**:
   - Use `runTour()` to sequentially scroll each `<section>` into view, wait for arrival (`~400ms`), then execute `buildSection()`.
   - Never use blind intersection observers with automatic background reveal timers: tall screens (1080p/1440p) trigger lower sections prematurely before the user ever scrolls down.

3. **Background DOM Preservation**:
   - Section DOM structures stay rendered in place with original geometry (`boundingClientRect`), but hidden via `.swarm-pending` (`opacity: 0; pointer-events: none;`).
   - This ensures measurements are 100% pixel-accurate without causing reflow jumps.

4. **Speed & Pacing Tuning**:
   - Agent travel speed: `2200px/s * getSpeed()`.
   - Box drag duration: `90ms - 190ms`.
   - Border pen duration: `100ms - 210ms`.
   - Typewriter typing duration: `65ms - 250ms`.

5. **Accessibility (`prefers-reduced-motion`)**:
   - `assets/swarm.css` includes automatic override: agents, ghost elements, and toolbars are hidden and `.swarm-pending` is forced to `opacity: 1 !important` when reduced motion is preferred.

---

## Customization

### Changing Cursor Names & Colors
Modify the `NAMES` and `COLORS` arrays at top of `swarm.js`:
```javascript
const NAMES = ["Designer", "Dev", "AAA", "Artist", "XR", "PM"];
const COLORS = ["#6d28d9", "#0891b2", "#e11d48", "#16a34a", "#f59e0b"];
```

### Friendly Section Names
`friendlyName(section)` automatically checks `id`, `aria-label`, or the first `<h1>...<h3>` heading inside the section to display on the floating status pill (e.g., *"Building Tech Stack..."*).
