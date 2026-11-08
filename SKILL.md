---
name: aaa-swarm
description: Implements or ports the multiplayer cursors 'Swarm Rebuild' guided tour effect (Dhvanil Patel style) to any web project. Features 13 authentic industry themes (software, construction, beehive, ant-colony, cyber-nanobots, couture atelier, warehouse, voxel-craft, bistro kitchen, street-art, vintage press-room, molecular science lab, and 16-bit pixel studio) with custom agent physics, blueprint backgrounds, wireframe pens, and media unpack animations.
---

# AAA Swarm — Multiplayer Rebuild Guided Tour

## Overview
`aaa-swarm` drops an interactive, high-impact multiplayer cursor rebuild experience into any website. A flock of labeled agent cursors collaborates to assemble the web page element by element before the visitor's eyes:
- **13 Industry Themes**: Authentic visual building mechanics for software, construction, eco-beehives, ant colonies, cyber nanobots, fashion ateliers, warehouse logistics, voxel craft, kitchens, street art, vintage press rooms, molecular science labs, and 16-bit pixel art studios.
- **Blueprint Grid**: Themed blueprint/matrix canvas sits behind the content (`z-index: 0`).
- **Autonomous Agent Flocking**: Multi-cursor physics with velocity smoothing, optional velocity-rotation (`rotateToVelocity`), collision separation, and tool states (`cross`, `pen`, `text`, `crate`).
- **Guided Scroll-Follow Tour**: Automatically smooth-scrolls the viewport down to each section as it begins construction, guaranteeing visitors never miss the animation offscreen.
- **Auto-Return to Top**: Once the entire site has been constructed, smoothly glides the viewport back to the top (`y = 0`) to begin regular browsing.
- **Instant Skip & Replay**: Floating pill toolbar with status, speed multiplier toggle (1× / 2× / 3×), theme selector, and instant **Skip** button (`Esc` key) to immediately unveil everything. Replay button (`Alt+Shift+S`) allows restarting the tour anytime.

---

## 13 Supported Themes & Industry Mapping

| Theme Key | Industry / Business Type | Agent Avatar & Physics | Physical Rebuild Dynamics |
|---|---|---|---|
| `default` | SaaS, Software, Designers, Startups | Pointer Cursors (`Designer`, `Dev`, `AAA`) | Wireframe blueprint drag (`px` badge), vector pen with corner crosshairs, blueprint grid fade, terminal caret typing, crop bounding box |
| `construction` | Architecture, Heavy Building, Hardware | Hardhats, Welder Torches, Crane Hooks | Rising scaffolding vertical poles & ledger beams, blowtorch arc welding sparks, hydraulic concrete pour, stenciled lettering, crane cargo crate drop & plank shatter |
| `beehive` | Eco, Honey, Agriculture, Biotech | Bumblebees with fluttering wings + pollen | Figure-8 wax drift bloom, propolis border with dripping honey beads, liquid honey crystallization, waggle dance typography, comb cell wax cap unseal |
| `ant-colony` | Logistics, Microservices, Databases | Forager Ants (rotate along velocity vector) | Subterranean trench haul along pheromone trail, marching ant mandible bridge border, leaf/sand mosaic packing, token letter carrying, 8-ant heavy cargo lift |
| `cyber-nanobots` | AI Startups, Cybersecurity, Cloud, Fintech | Quad-drones, Glowing Nanobot Orbs | Dual drone vertical laser scanbar, PCB copper trace routing with solder pads, matrix glitch voxel solidify, Matrix hex-decrypt text scrambler, 3D laser sinter sweep |
| `atelier` | Fashion, Luxury, Interior Design, Craft | Sewing needles with silk thread, scissors | Fabric bolt horizontal unroll with tailor tape ticks, needle running stitch bobbing vertically, textile swatch drape, monogram embroidery zig-zag, Polaroid brass pushpin |
| `warehouse` | E-Commerce, D2C Retail, Dropshipping | Top-down Forklifts (velocity rotated) | Kraft tape dispenser roll across carton, barcode scanner laser sweep + FRAGILE stamp slam, folding cardboard box flaps, thermal label printer, forklift pallet delivery |
| `voxel-craft` | Gaming, Web3, Indie Studios, EdTech | Pixel Pickaxes, 8-Bit Builders | 16x16 3D voxel pixel block snap with bounce, redstone wire perimeter flashing bright red, voxel stone/wood block stack, 8-bit RPG text ticker, treasure chest drop & lid open |
| `kitchen` | Food, Restaurant, Bakery, Bistro | Chef Knives, Whisks, Pastry Bags | Wooden rolling pin squashing dough circle into card rectangle, fluted pastry cream piping border, blowtorch caramelization wave, chocolate syrup drizzle, silver cloche dome steam lift |
| `street-art` | Creative Studio, Streetwear, Music | Aerosol Spray Cans (idle shake), Rollers | Paint roller diagonal wheatpaste strokes, fat-cap aerosol spray with vertical oozing paint drips, squeegee poster press, chisel-tip marker slashes, slap-sticker slam & squeegee |
| `press-room` | Finance, Legal, Publishing, Academia | Fountain Pens, Brayer Rollers, Wax Seals | Movable-type iron chase frame clamp `┼`, drafting pen ruling lines with crop-marks, ink brayer roller press, mechanical typewriter hammer strikes, CMYK 4-color halftone plate alignment |
| `science` | BioTech, Pharmaceuticals, Quantum, DeepTech | Erlenmeyer Flasks, Micropipettes, Atoms | Quantum particle collider discovery sweep beam, spinning electron orbital shells & molecular formula tags, exothermic effervescent titration reaction, genetic base-pair sequencer, cryo-stasis mist pod with reticle focus |
| `pixel` | Retro Gaming, Tetris Arcade, Chiptune, 8-Bit | Pixel Pencils, Paint Buckets, Tetrominoes | Authentic falling Tetris tetromino polyominoes (I, T, L, O, Z, S) dropping with gravity into rows, 4-line clear arcade white flash, floating +800 PTS score popup, 1-bit stepped border ┌ ┐ └ ┘, CRT raster beam & heavy block slam |

---

## Bundled Assets & Reference Files
Ready-to-use drop-in implementations are stored alongside this skill in `assets/`:
- **CSS Stylesheet**: `assets/swarm.css`
- **Engine Script**: `assets/swarm.js`

---

## Integration Guide

### Step 0: Mandatory Interactive User Confirmation (CRITICAL)
Before copying assets or writing integration code, the agent **MUST** confirm user requirements unless they were explicitly specified in the prompt:
1. **Theme Selection Mode**:
   - **Single Locked Theme** (Recommended for branded websites): e.g. `construction` for hardware/engineering, `cyber-nanobots` for AI/Cybersecurity/Cloud, `kitchen` for culinary, `atelier` for luxury/fashion. The bottom switcher dock and dropdown are hidden, keeping the brand experience clean.
   - **Multi-Theme Dock**: Multiple selectable themes (e.g. `themes: ["default", "cyber-nanobots", "voxel-craft"]`) with the floating bottom icon dock.
   - **Section-by-Section Theme**: Dynamic morphing across sections (`<section data-swarm-theme="cyber-nanobots">`).
2. **Trigger Mode & Session Caching**:
   - **Auto-run on every load** (`oncePerSession: false`) — Best for portfolios, landing pages, showcases.
   - **Run once per session** (`oncePerSession: true`) — Stores completion in `sessionStorage` so returning visitors browse without interruption.
   - **Manual trigger only** — Attached to a `"Rebuild Site"` button calling `Swarm.replay()` or `Swarm.play()`.
3. **HUD Visibility**:
   - `showToolbar: true` (default) — Floating speed, skip, replay, and status pill.
   - `showToolbar: false` — Completely hidden HUD for minimal aesthetic.
4. **Target Framework**:
   - Vanilla HTML, React / Next.js, Vue 3 / Nuxt 3, Svelte / SvelteKit, or Astro.

---

### Step 1: Copy Assets into Project
Copy the CSS and JS files from this skill's `assets/` folder into the target project's public or asset directories:
```powershell
# Windows PowerShell
Copy-Item "assets/swarm.css" "path/to/project/css/swarm.css"
Copy-Item "assets/swarm.js" "path/to/project/js/swarm.js"
```
```bash
# Bash / Linux / macOS
cp assets/swarm.css path/to/project/css/swarm.css
cp assets/swarm.js path/to/project/js/swarm.js
```

---

### Step 2: Framework Integration Recipes

#### A. Vanilla HTML
In `<head>`:
```html
<link rel="stylesheet" href="assets/css/swarm.css">
```
Before closing `</body>`:
```html
<script defer src="assets/js/swarm.js"></script>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    if (window.Swarm) {
      window.Swarm.init({
        root: "main",
        theme: "construction",
        // Single theme: omit themes or pass [theme]
        // Multi-theme: themes: ["construction", "cyber-nanobots", "default"],
        showDock: "auto",
        showToolbar: true,
        oncePerSession: false
      });
    }
  });
</script>
```

#### B. React / Next.js (App & Pages Router)
```tsx
"use client";

import { useEffect, useRef } from "react";
// import "./swarm.css";

export default function SwarmTour() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let tourInstance: { destroy: () => void } | null = null;

    // SSR-Safe Dynamic Import
    import("./swarm.js").then((mod) => {
      const Swarm = mod.default || window.Swarm;
      if (Swarm) {
        tourInstance = Swarm.init({
          root: rootRef.current || "main",
          theme: "cyber-nanobots",
          themes: ["cyber-nanobots"], // Single theme locks UI
          showToolbar: true,
          oncePerSession: true
        });
      }
    });

    return () => {
      if (tourInstance && typeof tourInstance.destroy === "function") {
        tourInstance.destroy();
      }
    };
  }, []);

  return null;
}
```

#### C. Vue 3 / Nuxt 3
```vue
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
// import "./swarm.css";

const mainRef = ref(null);
let tourInstance = null;

onMounted(async () => {
  const { default: Swarm } = await import("./swarm.js");
  if (Swarm) {
    tourInstance = Swarm.init({
      root: mainRef.value || "main",
      theme: "construction",
      showDock: false,
      oncePerSession: false
    });
  }
});

onUnmounted(() => {
  if (tourInstance) tourInstance.destroy();
});
</script>

<template>
  <main ref="mainRef">
    <!-- Content sections -->
  </main>
</template>
```

#### D. Svelte / SvelteKit
```svelte
<script>
  import { onMount, onDestroy } from "svelte";
  // import "./swarm.css";

  let mainEl;
  let tourInstance;

  onMount(async () => {
    const mod = await import("./swarm.js");
    const Swarm = mod.default || window.Swarm;
    if (Swarm) {
      tourInstance = Swarm.init({
        root: mainEl || "main",
        theme: "atelier",
        oncePerSession: true
      });
    }
  });

  onDestroy(() => {
    if (tourInstance) tourInstance.destroy();
  });
</script>

<main bind:this={mainEl}>
  <!-- Content sections -->
</main>
```

#### E. Astro
```astro
---
// SwarmTour.astro
---
<script>
  import Swarm from "../assets/swarm.js";
  import "../assets/swarm.css";

  document.addEventListener("DOMContentLoaded", () => {
    if (Swarm) {
      Swarm.init({
        root: "main",
        theme: "voxel-craft",
        showToolbar: true
      });
    }
  });
</script>
```

---

## Public API

The engine exposes `window.Swarm` (and UMD module exports):

| Method / Option | Type | Default | Description |
|---|---|---|---|
| `Swarm.init(opts)` | `Object` | `{}` | Initializes run, snapshots DOM, starts guided scroll tour. Returns `{ run, destroy }` |
| `opts.root` | `string \| HTMLElement` | `"main"` | Container selector or DOM node (supports React `useRef.current`) |
| `opts.theme` | `string` | `"default"` | Initial starting theme key (from 13 themes) |
| `opts.themes` | `Array<string>` | `null` (All) | Array of allowed theme keys. **If 1 theme, locks site and hides theme switcher UI!** |
| `opts.showDock` | `boolean \| "auto"` | `"auto"` | Floating bottom icon dock (`true`, `false`, or `"auto"`: on when >1 theme) |
| `opts.showToolbar` | `boolean` | `true` | Floating status / speed / skip pill |
| `opts.speed` | `1 \| 2 \| 3` | `1` | Initial speed multiplier |
| `opts.agents` | `number` | `8` (desk) / `4` (mob) | Concurrent worker agents (3–12) |
| `opts.oncePerSession` | `boolean` | `false` | When `true`, saves completion in `sessionStorage` and skips on subsequent visits |
| `opts.sectionSelector` | `string` | `"section, [data-swarm-section]"` | Selector for tour sections |
| `opts.onComplete` | `Function` | `null` | Callback fired when the camera returns to the top |
| `Swarm.destroy()` | `Function` | *None* | Immediately cleans up canvases, overlays, docks, toolbars, and event listeners |
| `Swarm.play(opts)` | `Function` | *None* | Alias for `init(opts)` |
| `Swarm.setTheme(name)` | `Function` | `themeName` | Switches active theme and restarts tour |
| `Swarm.getTheme()` | `Function` | *None* | Returns active theme identifier |
| `Swarm.getThemes()` | `Function` | *None* | Returns array of theme objects (`id`, `label`, `emoji`, `subtitle`) |
| `Swarm.skip()` | `Function` | *None* | Cancels tour, unveils all pending elements, restores regular browsing |
| `Swarm.replay(opts)` | `Function` | `opts` | Cleans up current run, scrolls to top, and runs fresh tour with options |
| `Swarm.triggerSectionById(id)` | `Function` | `sectionId` | Jumps tour directly to a specific section by element ID |
| `Swarm.isRunning()` | `Function` | *None* | Returns `true` if tour/rebuild is actively in progress |

### Keyboard Shortcuts
- **`Escape`**: Instantly skips animation and reveals all sections.
- **`Alt + Shift + S`**: Restarts the tour from top.

---

## Critical Architecture Guardrails

When modifying or customizing the swarm engine, adhere to these battle-tested rules:

1. **Exclude Layout Wrapper Containers from Snapshotting**:
   - In `snapshotSection()`, ignore structural layout classes such as `.container`, `.grid`, `.features-grid`, `.gallery-grid`, `.metrics-row`, `.hero-cta`, `.cards`, `.row`, `.col`.
   - *Why:* If a parent layout wrapper is counted as a card, agents draw a massive empty outline and block child cards from rendering until the parent finishes.

2. **Sequential Guided Scroll vs Blind Viewport Queueing**:
   - Use `runTour()` to sequentially scroll each `<section>` into view, wait for arrival (`~450ms`), then execute `buildSection()`.
   - Never use blind intersection observers with automatic background reveal timers.

3. **Background DOM Preservation**:
   - Section DOM structures stay rendered in place with original geometry (`boundingClientRect`), but hidden via `.swarm-pending` (`opacity: 0; pointer-events: none;`).

4. **Mobile & Viewport Adaptation**:
   - On screens `<= 640px`, swarm automatically scales down agent count to `4` (preventing label crowding) and clamps horizontal task offsets within visible viewport boundaries.
   - The floating controls toolbar `.swarm-toolbar` sits cleanly docked above bottom navigation (`bottom: 74px`), with reduced badge/tag scaling on mobile devices.

5. **Accessibility (`prefers-reduced-motion`)**:
   - `assets/swarm.css` includes automatic override: agents, ghost elements, and toolbars are hidden and `.swarm-pending` is forced to `opacity: 1 !important` when reduced motion is preferred.
