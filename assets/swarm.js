/**
 * Swarm — Multiplayer Cursors & Builders "Rebuild the Page" Guided Tour Effect.
 *
 * 12 Full Industry Themes:
 *   - "science": Quantum Lab & BioTech (Erlenmeyer flasks, Micropipettes, Double-helix DNA rungs, Chemical titration wave, Cryo-stasis pod)
 *   - "default": Software/Design (Flocking Designer/Dev Cursors, Wireframes, Typing)
 *   - "construction": Heavy Builders (Hardhats, Blowtorches with sparks, Concrete pour, Crane Crate drop)
 *   - "beehive": Eco/Organic/Agri (Bumblebees, Figure-8 wax drift, Amber honey drip, Waggle pollen text, Wax uncap)
 *   - "ant-colony": Logistics/DevOps (Velocity-rotating Ants, Tunnel excavation, Ant-chain walls, Letter hauling, Heavy crate lift)
 *   - "cyber-nanobots": SaaS/AI/Security (Micro-drones, Dual laser scanline, PCB solder routing, Glitch-in, Matrix hex decryption, 3D laser printer)
 *   - "atelier": Fashion/Luxury/Craft (Sewing needles & thread, Tailor chalk cm/in, Running stitch, Fabric drape, Embroidery, Polaroid brass pin)
 *   - "warehouse": E-Commerce/D2C (Forklifts, Kraft tape unroll, Barcode laser scan + FRAGILE stamp, Flap folds, Thermal label, Pallet crate)
 *   - "voxel-craft": Gaming/Web3/Indie (Pixel pickaxes, Stepped voxel blocks, Redstone wire border, Lego brick stack, RPG ticker, Bouncing treasure chest)
 *   - "kitchen": Culinary/Hospitality (Chefs, Whisks, Rolling pin flour puff, Pastry piping border, Blowtorch caramelize, Syrup script, Silver cloche dome steam lift)
 *   - "street-art": Creative Studio/Music (Aerosol spray cans, Wheatpaste roller, Fat-cap drips, Squeegee poster, Chisel marker, Slap-sticker slam)
 *   - "press-room": Finance/Legal/Publishing (Fountain pens, Brayer rollers, Metal chase frame ┼, Ink ruling lines, Roller press, Typewriter ribbon strike, CMYK halftone resolve)
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Swarm = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  if (!isBrowser) {
    return {
      init: () => ({ destroy: () => {} }),
      play: () => ({ destroy: () => {} }),
      destroy: () => {},
      setTheme: () => {},
      getTheme: () => "default",
      getThemes: () => [],
      skip: () => {},
      replay: () => {},
      triggerSectionById: () => {},
      isRunning: () => false,
    };
  }

  const SPEEDS = [1, 2, 3];
  const CANCEL = Symbol("swarm-cancel");

  /* ------------------------------------------------------------------ */
  /* Tool & Theme SVGs                                                  */
  /* ------------------------------------------------------------------ */

  const ICONS = {
    cursor:
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
      '<path d="M3 2.5 20.5 10l-7.4 2.2L10 19.8Z" fill="currentColor" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',

    hardhat:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<path d="M4 17a9 9 0 0 1 18 0v1H4v-1Z" fill="currentColor" stroke="#000" stroke-width="1.5"/>' +
      '<path d="M2 18h22v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2Z" fill="#1e293b"/>' +
      '<rect x="11" y="8" width="4" height="9" rx="1" fill="#fff" opacity="0.9"/>' +
      '<circle cx="13" cy="13" r="1.5" fill="#f59e0b"/>' +
      '</svg>',

    torch:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<line x1="3" y1="23" x2="16" y2="10" stroke="#475569" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="18" cy="8" r="3.5" fill="#ea580c"/>' +
      '<polygon points="20,6 25,2 23,8" fill="#fef08a"/>' +
      '</svg>',

    craneHook:
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' +
      '<line x1="12" y1="0" x2="12" y2="10" stroke="#f59e0b" stroke-width="2.5"/>' +
      '<path d="M12 10 c0 5 -5 5 -5 9 a4 4 0 0 0 8 0 c0 -3 -2 -4 -4 -4" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>' +
      '</svg>',

    bee:
      '<svg viewBox="0 0 28 28" width="28" height="28" class="swarm-bee-svg" aria-hidden="true">' +
      '<ellipse cx="14" cy="14" rx="9" ry="6.5" fill="#f59e0b" stroke="#78350f" stroke-width="1.2"/>' +
      '<path d="M11 8v12M15 8v12M19 9v10" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/>' +
      '<ellipse cx="8" cy="14" rx="3.5" ry="3.5" fill="#1e293b"/>' +
      '<circle cx="7" cy="13" r="1" fill="#fff"/>' +
      '<path class="swarm-wing left" d="M11 8 C7 1 3 5 11 8 Z" fill="rgba(255,255,255,0.85)" stroke="#d97706"/>' +
      '<path class="swarm-wing right" d="M11 20 C7 27 3 23 11 20 Z" fill="rgba(255,255,255,0.85)" stroke="#d97706"/>' +
      '</svg>',

    ant:
      '<svg viewBox="0 0 26 26" width="26" height="26" class="swarm-ant-svg" aria-hidden="true">' +
      '<ellipse cx="18" cy="13" rx="5" ry="3.5" fill="#1e1b4b"/>' +
      '<ellipse cx="11" cy="13" rx="3" ry="2.5" fill="#312e81"/>' +
      '<circle cx="5" cy="13" r="2.8" fill="#1e1b4b"/>' +
      '<line x1="11" y1="13" x2="6" y2="6" stroke="#4338ca" stroke-width="1.5"/>' +
      '<line x1="11" y1="13" x2="6" y2="20" stroke="#4338ca" stroke-width="1.5"/>' +
      '<line x1="13" y1="13" x2="14" y2="5" stroke="#4338ca" stroke-width="1.5"/>' +
      '<line x1="13" y1="13" x2="14" y2="21" stroke="#4338ca" stroke-width="1.5"/>' +
      '<line x1="16" y1="13" x2="21" y2="6" stroke="#4338ca" stroke-width="1.5"/>' +
      '<line x1="16" y1="13" x2="21" y2="20" stroke="#4338ca" stroke-width="1.5"/>' +
      '</svg>',

    drone:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<circle cx="13" cy="13" r="5" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>' +
      '<circle cx="13" cy="13" r="2" fill="#fff"/>' +
      '<line x1="5" y1="5" x2="21" y2="21" stroke="#0891b2" stroke-width="2"/>' +
      '<line x1="21" y1="5" x2="5" y2="21" stroke="#0891b2" stroke-width="2"/>' +
      '<circle cx="5" cy="5" r="3" fill="#0e7490" opacity="0.9"/>' +
      '<circle cx="21" cy="5" r="3" fill="#0e7490" opacity="0.9"/>' +
      '<circle cx="5" cy="21" r="3" fill="#0e7490" opacity="0.9"/>' +
      '<circle cx="21" cy="21" r="3" fill="#0e7490" opacity="0.9"/>' +
      '</svg>',

    needle:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<line x1="3" y1="23" x2="21" y2="5" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>' +
      '<ellipse cx="20" cy="6" rx="2" ry="1" transform="rotate(-45 20 6)" fill="#475569"/>' +
      '<path d="M22 4 C25 2 26 7 21 8" stroke="#f43f5e" stroke-width="1.8" fill="none"/>' +
      '</svg>',

    forklift:
      '<svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">' +
      '<rect x="4" y="8" width="14" height="12" rx="2" fill="#eab308" stroke="#854d0e" stroke-width="1.5"/>' +
      '<rect x="8" y="10" width="6" height="8" rx="1" fill="#1e293b"/>' +
      '<line x1="18" y1="10" x2="25" y2="10" stroke="#64748b" stroke-width="2.5"/>' +
      '<line x1="18" y1="18" x2="25" y2="18" stroke="#64748b" stroke-width="2.5"/>' +
      '<circle cx="7" cy="6" r="2.5" fill="#000"/>' +
      '<circle cx="7" cy="22" r="2.5" fill="#000"/>' +
      '</svg>',

    pickaxe:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<line x1="6" y1="20" x2="17" y2="9" stroke="#78350f" stroke-width="3" stroke-linecap="square"/>' +
      '<path d="M13 5 C17 3 22 5 24 9 C22 10 19 9 17 9 C15 9 13 8 13 5 Z" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>' +
      '</svg>',

    whisk:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<line x1="4" y1="22" x2="12" y2="14" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M12 14 C15 7 21 7 23 10 C25 13 21 19 14 16" fill="none" stroke="#f59e0b" stroke-width="2"/>' +
      '<path d="M12 14 C13 9 18 9 20 12 C22 15 18 19 13 15" fill="none" stroke="#f59e0b" stroke-width="1.5"/>' +
      '</svg>',

    spraycan:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<rect x="7" y="10" width="12" height="14" rx="2" fill="#ec4899" stroke="#9d174d" stroke-width="1.5"/>' +
      '<rect x="10" y="6" width="6" height="4" fill="#64748b"/>' +
      '<circle cx="16" cy="4" r="1.5" fill="#06b6d4"/>' +
      '<line x1="16" y1="4" x2="23" y2="2" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="2 2"/>' +
      '</svg>',

    fountainPen:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<line x1="3" y1="23" x2="16" y2="10" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>' +
      '<polygon points="16,10 23,3 20,8 19,13" fill="#e2e8f0" stroke="#0f172a" stroke-width="1"/>' +
      '<circle cx="19" cy="7" r="1" fill="#0284c7"/>' +
      '</svg>',

    flask:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<path d="M11 3h4v4l5 11a2 2 0 0 1-1.8 2.8H7.8A2 2 0 0 1 6 18L11 7V3z" fill="#064e3b" stroke="#10b981" stroke-width="1.6"/>' +
      '<line x1="9.5" y1="3" x2="16.5" y2="3" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="13" cy="17" rx="4" ry="2" fill="#34d399"/>' +
      '<circle cx="11" cy="13" r="1" fill="#6ee7b7"/>' +
      '<circle cx="15" cy="11" r="1.3" fill="#a7f3d0"/>' +
      '</svg>',

    pipette:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<path d="M18 4l4 4-2 2-2-2-7 7v3l-4 4-1-1 4-4H7l7-7-2-2 2-2z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.4"/>' +
      '<circle cx="6" cy="20" r="1.5" fill="#38bdf8"/>' +
      '</svg>',

    atom:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<ellipse cx="13" cy="13" rx="10" ry="3.5" fill="none" stroke="#8b5cf6" stroke-width="1.4" transform="rotate(30 13 13)"/>' +
      '<ellipse cx="13" cy="13" rx="10" ry="3.5" fill="none" stroke="#06b6d4" stroke-width="1.4" transform="rotate(-30 13 13)"/>' +
      '<ellipse cx="13" cy="13" rx="10" ry="3.5" fill="none" stroke="#10b981" stroke-width="1.4" transform="rotate(90 13 13)"/>' +
      '<circle cx="13" cy="13" r="2.5" fill="#a7f3d0" stroke="#059669" stroke-width="1"/>' +
      '</svg>',

    pixelPencil:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<rect x="16" y="4" width="4" height="4" fill="#f43f5e"/>' +
      '<rect x="12" y="8" width="4" height="4" fill="#facc15"/>' +
      '<rect x="8" y="12" width="4" height="4" fill="#facc15"/>' +
      '<rect x="4" y="16" width="4" height="4" fill="#e2e8f0"/>' +
      '<rect x="2" y="20" width="3" height="3" fill="#0f172a"/>' +
      '</svg>',

    paintBucket:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<rect x="6" y="8" width="12" height="12" transform="rotate(-25 12 14)" fill="#a855f7" stroke="#e2e8f0" stroke-width="1.5"/>' +
      '<path d="M16 16 C20 18 22 22 23 25" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<circle cx="23" cy="25" r="1.5" fill="#f43f5e"/>' +
      '</svg>',

    pixelSprite:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<rect x="6" y="4" width="3" height="3" fill="#22d3ee"/>' +
      '<rect x="17" y="4" width="3" height="3" fill="#22d3ee"/>' +
      '<rect x="9" y="7" width="8" height="3" fill="#22d3ee"/>' +
      '<rect x="6" y="10" width="14" height="6" fill="#22d3ee"/>' +
      '<rect x="8" y="12" width="2" height="2" fill="#0c0714"/>' +
      '<rect x="16" y="12" width="2" height="2" fill="#0c0714"/>' +
      '<rect x="6" y="16" width="3" height="5" fill="#f43f5e"/>' +
      '<rect x="17" y="16" width="3" height="5" fill="#f43f5e"/>' +
      '<rect x="11" y="16" width="4" height="3" fill="#facc15"/>' +
      '</svg>',

    tetromino:
      '<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">' +
      '<rect x="3" y="6" width="6" height="6" fill="#f43f5e" stroke="#1c1427" stroke-width="1"/>' +
      '<rect x="9" y="6" width="6" height="6" fill="#06b6d4" stroke="#1c1427" stroke-width="1"/>' +
      '<rect x="15" y="6" width="6" height="6" fill="#facc15" stroke="#1c1427" stroke-width="1"/>' +
      '<rect x="9" y="12" width="6" height="6" fill="#a855f7" stroke="#1c1427" stroke-width="1"/>' +
      '</svg>',
  };

  /* ------------------------------------------------------------------ */
  /* Theme Registry Definition (13 Unique Industries)                  */
  /* ------------------------------------------------------------------ */

  const THEMES = {
    default: {
      id: "default",
      mechanics: {
        "layout": "Wireframe blueprint box stretch with px badge",
        "border": "Precision vector pen path with corner alignment crosshairs",
        "fill": "Blueprint grid fade to card background color",
        "text": "Terminal character typing with blinking cursor caret",
        "media": "Bounding crop frame with corner resize handles"
},
      label: "Multiplayer Cursors",
      emoji: "🖱️",
      subtitle: "Software, Design & Tech",
      names: ["Designer", "Dev", "AAA", "Artist", "XR", "QA", "Tech Art", "PM", "Frontend", "3D", "Audio", "Writer"],
      colors: ["#6d28d9", "#0891b2", "#e11d48", "#16a34a", "#f59e0b", "#2563eb", "#db2777", "#0d9488", "#7c3aed", "#0284c7", "#ea580c", "#059669"],
      renderIcon: () => ICONS.cursor,
      dimensionUnit: (w, h) => `${Math.round(w)} × ${Math.round(h)}`,
      statusPrefix: "Building",
      speedScale: 1.0,
      rotateToVelocity: false,
      boxClass: "is-wireframe",
      fillClass: "is-fade",
    },
    construction: {
      id: "construction",
      mechanics: {
        "layout": "Scaffolding vertical poles & ledger beams shoot upward",
        "border": "Arc welder blowtorch with orange spark showers",
        "fill": "Hydraulic wet concrete pour rising from bottom",
        "text": "Industrial stenciled paint lettering",
        "media": "Tower crane cable lowering cargo crate + plank shatter"
},
      label: "Heavy Construction",
      emoji: "🏗️",
      subtitle: "Architecture & Hardware",
      names: ["Foreman", "Crane-01", "Welder", "Surveyor", "Mason", "Rigger", "Engineer", "Riveter", "Inspector", "Operator", "Steelworker", "Scaffold"],
      colors: ["#f59e0b", "#eab308", "#ea580c", "#0284c7", "#d97706", "#65a30d", "#ef4444", "#3b82f6", "#b45309", "#0d9488", "#84cc16", "#c2410c"],
      renderIcon: (t) => (t === "pen" ? ICONS.torch : t === "crate" ? ICONS.craneHook : ICONS.hardhat),
      dimensionUnit: (w, h) => `📐 ${Math.round(w)}mm × ${Math.round(h)}mm [STRUCTURAL]`,
      statusPrefix: "Constructing",
      speedScale: 0.8,
      rotateToVelocity: false,
      boxClass: "is-scaffold",
      fillClass: "is-pouring",
    },
    beehive: {
      id: "beehive",
      mechanics: {
        "layout": "Worker bee figure-8 flight with blooming honeycomb wax grid",
        "border": "Propolis sealing with dripping amber honey droplets",
        "fill": "Golden liquid honey crystallizes into card background",
        "text": "Scout bee waggle dance depositing pollen dust letters",
        "media": "Comb cell wax cap unsealed with honey burst"
},
      label: "Honey Beehive",
      emoji: "🐝",
      subtitle: "Eco, Biotech & Agriculture",
      names: ["Queen", "Forager-1", "CombBuilder", "Scout", "Nectar-A", "Nurse", "WaxMaker", "Drone-07", "GuardBee", "Flora", "HiveMind", "HoneyFlow"],
      colors: ["#d97706", "#b45309", "#f59e0b", "#eab308", "#78350f", "#fcd34d", "#ca8a04", "#854d0e", "#fbbf24", "#d97706", "#92400e", "#fef08a"],
      renderIcon: () => ICONS.bee,
      dimensionUnit: (w, h) => `🍯 ${Math.round(w / 12)} × ${Math.round(h / 12)} [CELLS]`,
      statusPrefix: "Secreting",
      speedScale: 0.85,
      rotateToVelocity: true,
      boxClass: "is-wax",
      fillClass: "is-honey-fill",
    },
    "ant-colony": {
      id: "ant-colony",
      mechanics: {
        "layout": "Ant team hauls bounding trench along cyan pheromone trail",
        "border": "Marching ant head-to-tail living mandible wall",
        "fill": "Mosaic leaf tiles & sand soil grain packing",
        "text": "Forager ants carry letter tokens from screen margin",
        "media": "8-ant heavy-lift squad lowers cargo slab into place"
},
      label: "Forager Ant Colony",
      emoji: "🐜",
      subtitle: "Logistics, DevOps & Data",
      names: ["Scout-A", "Digger-1", "Carrier-4", "Soldier-X", "QueenGuard", "Pheromone", "Worker-42", "Tunnel-08", "LeafCarrier", "Formica", "BuilderAnt", "Colony"],
      colors: ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#818cf8", "#10b981", "#059669", "#047857", "#065f46", "#3b82f6", "#2563eb", "#1d4ed8"],
      renderIcon: () => ICONS.ant,
      dimensionUnit: (w, h) => `🐜 ${Math.round(w)} × ${Math.round(h)} [TUNNEL]`,
      statusPrefix: "Excavating",
      speedScale: 0.9,
      rotateToVelocity: true,
      boxClass: "is-tunnel",
      fillClass: "is-mosaic",
    },
    "cyber-nanobots": {
      id: "cyber-nanobots",
      mechanics: {
        "layout": "Dual drone vertical laser scanbar sweeps hologram frame",
        "border": "High-speed PCB copper trace routing with illuminated solder pads",
        "fill": "Matrix glitch voxel hologram materialization",
        "text": "Matrix hex-decrypt scrambler resolving characters",
        "media": "Laser 3D sinter print sweep scans image row by row"
},
      label: "Cyber Nanobots",
      emoji: "🤖",
      subtitle: "SaaS, AI & CyberSecurity",
      names: ["Core-01", "Synth-AI", "NetRunner", "Compiler", "CUDA-X", "VectorNode", "MicroBot", "HoloBeam", "ZeroDay", "Tensor", "Kernel-7", "Photon"],
      colors: ["#06b6d4", "#0891b2", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1", "#0284c7", "#a855f7", "#059669", "#22d3ee"],
      renderIcon: () => ICONS.drone,
      dimensionUnit: (w, h) => `⚡ 0x${Math.round(w).toString(16).toUpperCase()} × 0x${Math.round(h).toString(16).toUpperCase()}`,
      statusPrefix: "Synthesizing",
      speedScale: 0.85,
      rotateToVelocity: false,
      boxClass: "is-hologram",
      fillClass: "is-glitch-fill",
    },
    atelier: {
      id: "atelier",
      mechanics: {
        "layout": "Fabric bolt unrolls horizontally with tailor tape ticks",
        "border": "Needle running stitches bobbing vertically with silk thread",
        "fill": "Woven textile swatch drapes down over pattern frame",
        "text": "Monogram embroidery needle zig-zags into cloth",
        "media": "Polaroid moodboard photo pinned with brass pushpin"
},
      label: "Couture Atelier",
      emoji: "🪡",
      subtitle: "Fashion, Luxury & Interior",
      names: ["HeadTailor", "Weaver", "Cutter", "Draper", "Stylist", "SilkThread", "PatternMaker", "Embroider", "Loom-03", "Bespoke", "Artisan", "Needle"],
      colors: ["#f43f5e", "#e11d48", "#be123c", "#cbd5e1", "#64748b", "#fb7185", "#fda4af", "#94a3b8", "#f43f5e", "#e2e8f0", "#fda4af", "#475569"],
      renderIcon: () => ICONS.needle,
      dimensionUnit: (w, h) => `📏 ${(w / 10).toFixed(1)}cm × ${(h / 10).toFixed(1)}cm [CHALK]`,
      statusPrefix: "Stitching",
      speedScale: 0.8,
      rotateToVelocity: false,
      boxClass: "is-chalk",
      fillClass: "is-drape-fill",
    },
    warehouse: {
      id: "warehouse",
      mechanics: {
        "layout": "Kraft tape dispenser unrolls brown tape across carton",
        "border": "Barcode scanner laser sweep + FRAGILE stamp slam",
        "fill": "Cardboard flaps fold shut and tape seals center seam",
        "text": "Thermal shipping label feed with barcode header",
        "media": "Mini forklift pallet delivery + unstraps cargo"
},
      label: "Warehouse Depot",
      emoji: "📦",
      subtitle: "E-Commerce & Retail",
      names: ["Forklift-A", "Packer-1", "Scanner-09", "Dispatch", "Picker-3", "PalletBot", "CargoBay", "BarcodeScan", "Stocker", "AGV-Unit", "DockWorker", "Freight"],
      colors: ["#f59e0b", "#d97706", "#b45309", "#eab308", "#ca8a04", "#78350f", "#854d0e", "#f97316", "#c2410c", "#9a3412", "#ea580c", "#fb923c"],
      renderIcon: () => ICONS.forklift,
      dimensionUnit: (w, h) => `📦 ${Math.round(w)} × ${Math.round(h)} [KRAFT TAPE]`,
      statusPrefix: "Packing",
      speedScale: 0.85,
      rotateToVelocity: true,
      boxClass: "is-kraft-tape",
      fillClass: "is-flap-fill",
    },
    "voxel-craft": {
      id: "voxel-craft",
      mechanics: {
        "layout": "16x16 3D voxel pixel blocks snap in with bounce",
        "border": "Redstone wire perimeter laid and flashes bright red",
        "fill": "Voxel stone & wood tiles stack row by row",
        "text": "8-bit retro RPG speech ticker with pixel caret",
        "media": "Pixel treasure chest drops from sky and lid opens 90°"
},
      label: "Voxel Craft Studio",
      emoji: "⛏️",
      subtitle: "Gaming, Web3 & Kids",
      names: ["Player1", "BlockCrafter", "RedstoneEng", "VoxelBuilder", "PixelMage", "Modder", "MineBot", "BrickLayer", "8BitMaster", "LegoSnap", "Sprite", "BlockSmith"],
      colors: ["#10b981", "#059669", "#0284c7", "#0369a1", "#ef4444", "#dc2626", "#f59e0b", "#d97706", "#8b5cf6", "#7c3aed", "#14b8a6", "#0f766e"],
      renderIcon: () => ICONS.pickaxe,
      dimensionUnit: (w, h) => `🟩 ${Math.round(w / 16)} × ${Math.round(h / 16)} [VOXELS]`,
      statusPrefix: "Crafting",
      speedScale: 0.8,
      rotateToVelocity: false,
      boxClass: "is-voxel-box",
      fillClass: "is-brick-fill",
    },
    kitchen: {
      id: "kitchen",
      mechanics: {
        "layout": "Wooden rolling pin squashes dough circle into card rectangle",
        "border": "Pastry piping bag squeezes fluted cream dollops",
        "fill": "Blowtorch heat wave caramelizes surface into crust",
        "text": "Chocolate syrup drizzle writes cursive letters",
        "media": "Silver cloche dome lifts upward with rising steam puff"
},
      label: "Grand Bistro Kitchen",
      emoji: "🍳",
      subtitle: "Restaurants & Culinary",
      names: ["HeadChef", "SousChef", "Patissier", "Saucier", "Barista", "GardeManger", "Sommelier", "Rotisseur", "PastryArt", "Flambe", "Culinary", "Bistro"],
      colors: ["#ef4444", "#dc2626", "#b91c1c", "#f97316", "#ea580c", "#c2410c", "#f59e0b", "#d97706", "#e11d48", "#be123c", "#991b1b", "#fb7185"],
      renderIcon: () => ICONS.whisk,
      dimensionUnit: (w, h) => `🍽️ ${Math.round(w)}mm × ${Math.round(h)}mm [PLATING]`,
      statusPrefix: "Plating",
      speedScale: 0.8,
      rotateToVelocity: false,
      boxClass: "is-dough",
      fillClass: "is-torch-fill",
    },
    "street-art": {
      id: "street-art",
      mechanics: {
        "layout": "Paint roller slaps 3 wet diagonal wheatpaste strokes",
        "border": "Fat-cap aerosol spray with vertical paint runs & drips",
        "fill": "Wild-style poster paper smoothed down with squeegee",
        "text": "Chisel-tip marker tags street calligraphy slashes",
        "media": "Vinyl album / slap-sticker slammed and squeegeed flat"
},
      label: "Street Art Collective",
      emoji: "🎨",
      subtitle: "Agencies, Culture & Music",
      names: ["Banksy", "FatCap-01", "Wheatpaste", "TagMaster", "StencilCrew", "Aerosol", "RollerBoy", "SlapSticker", "WildStyle", "GraffitiArt", "NeonDrip", "CrewLeader"],
      colors: ["#ec4899", "#db2777", "#be185d", "#06b6d4", "#0891b2", "#84cc16", "#65a30d", "#facc15", "#eab308", "#a855f7", "#9333ea", "#f43f5e"],
      renderIcon: () => ICONS.spraycan,
      dimensionUnit: (w, h) => `🎨 ${Math.round(w)} × ${Math.round(h)} [WHEATPASTE]`,
      statusPrefix: "Tagging",
      speedScale: 0.85,
      rotateToVelocity: false,
      boxClass: "is-wheatpaste",
      fillClass: "is-squeegee-fill",
    },
    "press-room": {
      id: "press-room",
      mechanics: {
        "layout": "Iron movable-type chase frame bars slide in & clamp shut",
        "border": "Fountain pen ruling with corner crop-marks ┼",
        "fill": "Ink brayer roller sweeps across, pressing fresh newsprint",
        "text": "Mechanical typewriter hammer strikes ink ribbon",
        "media": "CMYK 4-color halftone plates slide into registration alignment"
},
      label: "Vintage Press Room",
      emoji: "📰",
      subtitle: "Finance, Legal & News",
      names: ["ChiefEditor", "Typesetter", "Clerk-1", "Archivist", "Pressman", "Proofreader", "LeadType", "InkMaster", "Registrar", "Auditor", "GuildMaster", "Monotype"],
      colors: ["#334155", "#1e293b", "#0f172a", "#0284c7", "#0369a1", "#475569", "#64748b", "#0d9488", "#0f766e", "#1e3a8a", "#1e40af", "#581c87"],
      renderIcon: () => ICONS.fountainPen,
      dimensionUnit: (w, h) => `📰 ${Math.round(w / 7.2)}pt × ${Math.round(h / 7.2)}pt ┼ [LEAD CHASE]`,
      statusPrefix: "Pressing",
      speedScale: 0.8,
      rotateToVelocity: false,
      boxClass: "is-chase",
      fillClass: "is-roller-fill",
    },
    science: {
      id: "science",
      mechanics: {
        "layout": "Quantum collider discovery beam sweeps across, generating molecular synthesis reaction",
        "border": "Spectrometer ion laser perimeter with snapping atomic orbital nodes",
        "fill": "Effervescent bubbling titration reaction discovering synthesized compound",
        "text": "Genetic base-pair (A-T-C-G) & isotopic formula sequencer decryption",
        "media": "Pressurized cryo-specimen containment pod with electron microscope reticle focus"
      },
      label: "Discovery Science Lab",
      emoji: "🧬",
      subtitle: "Creation, Discovery & Quantum Molecular Synthesis",
      names: ["Biochemist", "Quantum-01", "CRISPR-Cas9", "Spectrometer", "Pipette-A", "Geneticist", "Collider", "Synthesizer", "Microscope", "Catalyst", "Isotope", "LabTech"],
      colors: ["#10b981", "#06b6d4", "#8b5cf6", "#059669", "#0891b2", "#7c3aed", "#34d399", "#22d3ee", "#a78bfa", "#047857", "#0284c7", "#6d28d9"],
      renderIcon: (t) => (t === "pen" ? ICONS.pipette : t === "crate" ? ICONS.atom : ICONS.flask),
      dimensionUnit: (w, h) => `🔬 ${((w * h) / 1000).toFixed(1)}k Å [DISCOVERY YIELD]`,
      statusPrefix: "Discovering",
      speedScale: 0.85,
      rotateToVelocity: false,
      boxClass: "is-science-discovery",
      fillClass: "is-titration-fill",
    },
  };

  let activeTheme = (typeof localStorage !== "undefined" ? localStorage.getItem("swarmTheme") : null) || "default";
  if (!THEMES[activeTheme]) activeTheme = "default";

  /* ------------------------------------------------------------------ */
  /* Shared state                                                       */
  /* ------------------------------------------------------------------ */

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX + window.scrollX;
      mouse.y = e.clientY + window.scrollY;
    },
    { passive: true }
  );

  let activeRun = null;
  let speedIndex = Math.max(0, SPEEDS.indexOf(Number(localStorage.getItem("swarmSpeed")) || 1));
  const getSpeed = () => SPEEDS[speedIndex];

  /* ------------------------------------------------------------------ */
  /* Helpers & Math                                                     */
  /* ------------------------------------------------------------------ */

  const el = (tag, cls, parent) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  };

  const rand = (a, b) => a + Math.random() * (b - a);
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function alphaOf(color) {
    if (!color || color === "transparent") return 0;
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (!m) return 1;
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    return parts.length > 3 ? parseFloat(parts[3]) : 1;
  }

  function ownText(node) {
    for (const c of node.childNodes) {
      if (c.nodeType === 3 && c.textContent.trim()) return true;
    }
    return false;
  }

  function hasBox(cs) {
    const borderW =
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderRightWidth) +
      parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth);
    return (
      alphaOf(cs.backgroundColor) > 0.02 ||
      (cs.backgroundImage && cs.backgroundImage !== "none") ||
      (borderW > 0 && alphaOf(cs.borderTopColor) > 0.02) ||
      (cs.boxShadow && cs.boxShadow !== "none")
    );
  }

  function friendlyName(section) {
    const id = section.id || "";
    if (id === "home" || id === "hero") return "Hero Banner";
    if (id === "features") return "Core Features";
    if (id === "tools") return "Tools";
    if (id === "metrics" || id === "stats") return "Metrics & Benchmarks";
    if (id === "gallery" || id === "showcase") return "Media Showcase";
    if (id === "integration" || id === "code") return "Integration";
    if (id === "about") return "About";
    if (id === "technology") return "Tech Stack";
    if (id === "thanks") return "Closing";
    const aria = section.getAttribute("aria-label");
    if (aria) return aria;
    const heading = section.querySelector("h1, h2, h3");
    if (heading && heading.textContent.trim()) {
      return heading.textContent.trim().slice(0, 24);
    }
    return id ? id.charAt(0).toUpperCase() + id.slice(1) : "Section";
  }

  /* ------------------------------------------------------------------ */
  /* Particle System (Sparks, Pollen, Dirt, Steam, Spray, CMYK)         */
  /* ------------------------------------------------------------------ */

  function emitParticles(r, x, y, color) {
    const themeId = r.theme.id;
    let pClass = "swarm-spark";
    let count = 4;

    if (themeId === "beehive") {
      pClass = "swarm-pollen";
      count = 5;
    } else if (themeId === "ant-colony" || themeId === "voxel-craft") {
      pClass = "swarm-dirt";
      count = 5;
    } else if (themeId === "kitchen") {
      pClass = "swarm-steam";
      count = 4;
    } else if (themeId === "street-art") {
      pClass = "swarm-spray-dot";
      count = 6;
    }

    for (let i = 0; i < count; i++) {
      const p = el("span", pClass, r.layer);
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.setProperty("--c", color || "#f59e0b");
      p.style.setProperty("--dx", rand(-45, 45) + "px");
      p.style.setProperty("--dy", rand(-35, 45) + "px");
      setTimeout(() => p.remove(), 350);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Snapshot a Single Section                                          */
  /* ------------------------------------------------------------------ */

  function snapshotSection(sectionEl) {
    const sx = window.scrollX;
    const sy = window.scrollY;
    const tasks = [];
    const byEl = new Map();

    const walker = document.createTreeWalker(sectionEl, NodeFilter.SHOW_ELEMENT, {
      acceptNode(n) {
        if (n.closest("[aria-hidden='true']") || n.closest(".swarm-no-tour")) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|BR)$/i.test(n.tagName)) return NodeFilter.FILTER_REJECT;
        if (n.ownerSVGElement) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const consider = (node) => {
      if (!node || node === sectionEl) return;

      if (/^(MAIN|SECTION|BODY|HTML)$/i.test(node.tagName) || node.id === "dynamic-content") return;

      // Exclude structural layout wrappers so child cards aren't blocked
      if (
        node.classList.contains("container") ||
        node.classList.contains("grid") ||
        node.classList.contains("features-grid") ||
        node.classList.contains("gallery-grid") ||
        node.classList.contains("metrics-row") ||
        node.classList.contains("hero-cta") ||
        node.classList.contains("cards") ||
        node.classList.contains("hero-wrap") ||
        node.classList.contains("project-wrap") ||
        node.classList.contains("row") ||
        node.classList.contains("col") ||
        node.closest(".glow")
      ) {
        return;
      }

      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return;
      const rect = node.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;

      const isImg =
        /^(IMG|SVG|CANVAS|VIDEO|PICTURE)$/i.test(node.tagName) ||
        node.classList.contains("product-visual") ||
        node.classList.contains("media-art");

      const box = !isImg && hasBox(cs);
      const text = !isImg && ownText(node) ? node.innerText.trim().replace(/\s+/g, " ") : "";
      if (!isImg && !box && !text) return;

      let parent = null;
      for (let p = node.parentElement; p && p !== sectionEl; p = p.parentElement) {
        if (byEl.has(p)) {
          parent = byEl.get(p);
          break;
        }
      }

      const bw = (side) => parseFloat(cs["border" + side + "Width"]) || 0;
      const pad = (side) => parseFloat(cs["padding" + side]) || 0;
      const padLeft = bw("Left") + pad("Left");
      const padTop = bw("Top") + pad("Top");
      const padRight = bw("Right") + pad("Right");

      const task = {
        el: node,
        parent,
        isImg,
        box,
        text,
        cs,
        x: rect.left + sx,
        y: rect.top + sy,
        w: rect.width,
        h: rect.height,
        content: {
          x: rect.left + sx + padLeft,
          y: rect.top + sy + padTop,
          w: Math.max(10, rect.width - padLeft - padRight),
          padLeft,
          padTop,
          padRight,
        },
        border: bw("Top") > 0 && alphaOf(cs.borderTopColor) > 0.02,
        state: "pending",
      };
      byEl.set(node, task);
      tasks.push(task);
    };

    let n;
    while ((n = walker.nextNode())) {
      consider(n);
    }

    tasks.sort((a, b) => {
      if (a.parent === b) return 1;
      if (b.parent === a) return -1;
      return a.y - b.y;
    });

    return tasks;
  }

  /* ------------------------------------------------------------------ */
  /* Run Lifecycle                                                      */
  /* ------------------------------------------------------------------ */

  function createRun(root, themeKey, opts = {}) {
    let allowedThemes = null;
    if (Array.isArray(opts.themes) && opts.themes.length > 0) {
      const valid = opts.themes.filter((k) => THEMES[k]);
      if (valid.length > 0) allowedThemes = valid;
    }
    if (allowedThemes && allowedThemes.length > 0 && !allowedThemes.includes(themeKey)) {
      themeKey = allowedThemes[0];
    }
    const themeConfig = THEMES[themeKey] || THEMES.default;
    const r = {
      root,
      opts,
      allowedThemes,
      theme: themeConfig,
      cancelled: false,
      sections: [],
      buildingSection: null,
      agents: [],
      waiters: new Set(),
      signals: [],
      raf: 0,
      last: 0,
      layer: null,
      canvas: null,
      toolbar: null,
      dock: null,
      focus: {
        x: window.innerWidth / 2 + window.scrollX,
        y: window.scrollY + window.innerHeight / 2,
      },
    };

    r.guard = (executor) =>
      new Promise((resolve, reject) => {
        if (r.cancelled) return reject(CANCEL);
        const entry = { reject };
        r.waiters.add(entry);
        executor(
          (v) => {
            r.waiters.delete(entry);
            resolve(v);
          },
          (e) => {
            r.waiters.delete(entry);
            reject(e);
          },
          entry
        );
      });

    r.wait = (ms) =>
      r.guard((res, _rej, entry) => {
        const pace = getSpeed() * (r.theme.speedScale || 1);
        const id = setTimeout(res, Math.max(12, ms / pace));
        entry.cleanup = () => clearTimeout(id);
      });

    r.tween = (ms, fn) =>
      r.guard((res, _rej, entry) => {
        let elapsed = 0;
        let prev = performance.now();
        let id = 0;
        const pace = getSpeed() * (r.theme.speedScale || 1);
        const duration = Math.max(25, ms / pace);
        const step = (now) => {
          elapsed += now - prev;
          prev = now;
          const t = Math.min(1, elapsed / duration);
          fn(ease(t), t);
          if (t >= 1) return res();
          id = requestAnimationFrame(step);
        };
        id = requestAnimationFrame(step);
        entry.cleanup = () => cancelAnimationFrame(id);
      });

    r.nextSignal = () => r.guard((res) => r.signals.push(res));
    r.signal = () => {
      const s = r.signals.splice(0);
      s.forEach((fn) => fn());
    };

    r.cancel = () => {
      r.cancelled = true;
      r.waiters.forEach((w) => {
        if (w.cleanup) w.cleanup();
        w.reject(CANCEL);
      });
      r.waiters.clear();
    };

    return r;
  }

  /* ------------------------------------------------------------------ */
  /* Agent Setup & Physics Loop (With Velocity Rotation & Flocking)     */
  /* ------------------------------------------------------------------ */

  function createAgent(r, i, start) {
    const theme = r.theme;
    const color = theme.colors[i % theme.colors.length];
    const node = el("div", "swarm-agent", r.layer);
    node.style.color = color;
    node.setAttribute("data-theme", theme.id);

    const iconSpan = el("span", "swarm-icon", node);
    iconSpan.innerHTML = theme.renderIcon();

    const tag = el("span", "swarm-tag", node);
    tag.textContent = theme.names[i % theme.names.length];
    tag.style.background = color;

    const a = {
      i,
      color,
      node,
      iconSpan,
      x: start.x + rand(-60, 60),
      y: start.y + rand(-60, 60),
      vx: rand(-300, 300),
      vy: rand(-300, 300),
      tx: start.x,
      ty: start.y,
      pinned: false,
      arrive: null,
      busy: false,
      idleSeed: rand(0, Math.PI * 2),
      angle: 0,
    };

    a.goto = (x, y) =>
      r.guard((res) => {
        a.pinned = false;
        a.tx = x;
        a.ty = y;
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          a.arrive = null;
          res();
        };
        a.arrive = done;
        // Failsafe timeout guarantee so agents NEVER stall or get stuck in transit
        const timeoutMs = Math.max(80, 450 / (getSpeed() * (r.theme.speedScale || 1)));
        setTimeout(done, timeoutMs);
      });

    a.place = (x, y) => {
      a.pinned = true;
      a.x = a.tx = x;
      a.y = a.ty = y;
      a.vx = a.vy = 0;
    };

    a.setTool = (tool) => {
      node.setAttribute("data-tool", tool || "");
      if (theme.renderIcon) {
        iconSpan.innerHTML = theme.renderIcon(tool);
      }
    };
    return a;
  }

  function physics(r, now) {
    const dt = Math.min(0.04, (now - (r.last || now)) / 1000);
    r.last = now;
    const s = getSpeed() * (r.theme.speedScale || 1);
    const maxSpeed = 1900 * s;
    const agents = r.agents;

    for (const a of agents) {
      if (!a.pinned) {
        if (!a.busy && !a.arrive) {
          const t = now / 1000 + a.idleSeed;
          // Figure-8 drift for bees or orbital flocking for others
          if (r.theme.id === "beehive") {
            a.tx = r.focus.x + Math.sin(t * 2) * (90 + (a.i % 4) * 15);
            a.ty = r.focus.y + Math.sin(t * 4) * (40 + (a.i % 3) * 10);
          } else {
            a.tx = r.focus.x + Math.cos(t * 1.5 + a.i) * (80 + (a.i % 4) * 15);
            a.ty = r.focus.y + Math.sin(t * 1.8 + a.i * 2) * (50 + (a.i % 4) * 12);
          }
        }
        const dx = a.tx - a.x;
        const dy = a.ty - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const want = Math.min(maxSpeed, dist * 11 * s);
        let dvx = (dx / dist) * want;
        let dvy = (dy / dist) * want;

        for (const b of agents) {
          if (b === a || a.arrive) continue;
          const ox = a.x - b.x;
          const oy = a.y - b.y;
          const d = Math.hypot(ox, oy);
          if (d > 0 && d < 36) {
            const push = ((36 - d) / 36) * 320;
            dvx += (ox / d) * push;
            dvy += (oy / d) * push;
          }
        }

        const k = 1 - Math.exp(-dt * 14);
        a.vx += (dvx - a.vx) * k;
        a.vy += (dvy - a.vy) * k;
        a.x += a.vx * dt;
        a.y += a.vy * dt;

        if (r.theme.rotateToVelocity && (Math.abs(a.vx) > 10 || Math.abs(a.vy) > 10)) {
          const targetAngle = (Math.atan2(a.vy, a.vx) * 180) / Math.PI;
          a.angle = a.angle + (targetAngle - a.angle) * 0.15;
        }

        if (a.arrive && dist < 28) {
          const done = a.arrive;
          a.arrive = null;
          a.x = a.tx;
          a.y = a.ty;
          done();
        }
      }

      const rot = r.theme.rotateToVelocity ? ` rotate(${a.angle}deg)` : "";
      a.node.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)${rot}`;
    }
    r.raf = requestAnimationFrame((t) => physics(r, t));
  }

  /* ------------------------------------------------------------------ */
    /* ================================================================== */
  /* Build Operation 1: dragBox (Theme-Dispatched Physical Framing)      */
  /* ================================================================== */

  async function dragBox(r, a, t) {
    switch (r.theme.id) {
      case "construction": return dragBoxConstruction(r, a, t);
      case "beehive": return dragBoxBeehive(r, a, t);
      case "ant-colony": return dragBoxAntColony(r, a, t);
      case "cyber-nanobots": return dragBoxCyber(r, a, t);
      case "atelier": return dragBoxAtelier(r, a, t);
      case "warehouse": return dragBoxWarehouse(r, a, t);
      case "voxel-craft": return dragBoxVoxel(r, a, t);
      case "kitchen": return dragBoxKitchen(r, a, t);
      case "street-art": return dragBoxStreetArt(r, a, t);
      case "press-room": return dragBoxPressRoom(r, a, t);
      case "science": return dragBoxScience(r, a, t);
      default: return dragBoxDefault(r, a, t);
    }
  }

  // 1.1 Construction: Scaffolding Vertical Poles & Ledger Struts
  async function dragBoxConstruction(r, a, t) {
    const ghost = el("div", "swarm-ghost is-scaffold", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const poleL = el("div", "swarm-scaffold-pole is-left", ghost);
    const poleR = el("div", "swarm-scaffold-pole is-right", ghost);
    const ledgerT = el("div", "swarm-scaffold-ledger is-top", ghost);
    const ledgerB = el("div", "swarm-scaffold-ledger is-bottom", ghost);
    const brace = el("div", "swarm-scaffold-brace", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = a.color;
    t.ghost = ghost;

    a.setTool("hammer");
    await a.goto(t.x, t.y + t.h);

    const dur = Math.min(340, 160 + (t.w + t.h) * 0.08);
    await r.tween(dur, (p) => {
      poleL.style.height = (t.h * p) + "px";
      poleR.style.height = (t.h * p) + "px";
      ledgerT.style.width = (t.w * p) + "px";
      ledgerB.style.width = (t.w * p) + "px";
      brace.style.opacity = p > 0.5 ? (p - 0.5) * 2 : 0;
      badge.textContent = `🏗️ ${Math.round(t.w * p * 0.05)}m x ${Math.round(t.h * p * 0.05)}m`;
      if (p < 0.4) {
        a.place(t.x, t.y + t.h * (1 - p / 0.4));
      } else if (p < 0.7) {
        const lp = (p - 0.4) / 0.3;
        a.place(t.x + t.w * lp, t.y);
      } else {
        const rp = (p - 0.7) / 0.3;
        a.place(t.x + t.w, t.y + t.h * rp);
      }
      if (Math.random() < 0.25) emitParticles(r, a.x, a.y, "#f59e0b");
    });
    a.setTool("");
  }

  // 1.2 Beehive: Looping Figure-8 Wax Cell Bloom
  async function dragBoxBeehive(r, a, t) {
    const ghost = el("div", "swarm-ghost is-honeycomb-bloom", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const hexGrid = el("div", "swarm-hex-grid", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#d97706";
    t.ghost = ghost;

    a.setTool("honey");
    await a.goto(t.x + t.w / 2, t.y + t.h / 2);

    const dur = Math.min(340, 180 + (t.w + t.h) * 0.07);
    await r.tween(dur, (p) => {
      const angle = p * Math.PI * 4;
      const hx = t.x + t.w / 2 + Math.sin(angle) * (t.w * 0.44);
      const hy = t.y + t.h / 2 + Math.sin(angle * 0.5) * (t.h * 0.4);
      a.place(hx, hy);
      hexGrid.style.transform = `scale(${p})`;
      hexGrid.style.opacity = Math.min(1, p * 1.5);
      badge.textContent = `🍯 ${Math.max(6, Math.round(t.w * p * 0.1))} WAX CELLS`;
      if (Math.random() < 0.3) emitParticles(r, hx, hy, "#f59e0b");
    });
    hexGrid.style.transform = "scale(1)";
    hexGrid.style.opacity = "1";
    a.setTool("");
  }

  // 1.3 Ant Colony: Pheromone Haul from Offscreen
  async function dragBoxAntColony(r, a, t) {
    const ghost = el("div", "swarm-ghost is-ant-trench", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const pheroLine = el("div", "swarm-pheromone-line", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#15803d";
    t.ghost = ghost;

    a.setTool("leaf");
    const maxOffset = Math.min(140, Math.max(10, t.x - 10));
    const offset = Math.max(10, Math.min(maxOffset, window.innerWidth * 0.2));
    await a.goto(t.x - offset, t.y + t.h / 2);

    const dur = Math.min(340, 180 + (t.w + t.h) * 0.07);
    await r.tween(dur, (p) => {
      const curOff = offset * (1 - p);
      ghost.style.transform = `translateX(${-curOff}px) scale(${0.88 + 0.12 * p})`;
      ghost.style.opacity = Math.min(1, p * 1.6);
      const ax = t.x - curOff + t.w * (0.2 + 0.6 * p);
      const ay = t.y + t.h / 2 + (Math.sin(p * 14) * 6);
      a.place(ax, ay);
      badge.textContent = `🐜 ${Math.round(t.w * p * 0.25)}mg BIO-CARGO`;
      if (Math.random() < 0.25) emitParticles(r, ax, ay, "#22c55e");
    });
    ghost.style.transform = "translateX(0) scale(1)";
    ghost.style.opacity = "1";
    a.setTool("");
  }

  // 1.4 Cyber Nanobots: Dual Drone Vertical Laser Scanbar
  async function dragBoxCyber(r, a, t) {
    const ghost = el("div", "swarm-ghost is-cyber-hologram", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const laserBar = el("div", "swarm-laser-bar", ghost);
    const cyberGrid = el("div", "swarm-cyber-grid", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#06b6d4";
    t.ghost = ghost;

    a.setTool("laser");
    await a.goto(t.x + t.w / 2, t.y);

    const dur = Math.min(320, 160 + t.h * 0.15);
    await r.tween(dur, (p) => {
      const curY = t.h * p;
      laserBar.style.top = curY + "px";
      cyberGrid.style.clipPath = `inset(0 0 ${Math.max(0, t.h - curY)}px 0)`;
      a.place(t.x + (t.w * 0.5) + (Math.sin(p * 20) * (t.w * 0.35)), t.y + curY);
      badge.textContent = `⚡ [0x${Math.floor(t.w * p).toString(16).toUpperCase()} :: SCAN]`;
      if (Math.random() < 0.35) emitParticles(r, a.x, a.y, "#06b6d4");
    });
    cyberGrid.style.clipPath = "inset(0 0 0 0)";
    a.setTool("");
  }

  // 1.5 Atelier: Fabric Bolt Unroll
  async function dragBoxAtelier(r, a, t) {
    const ghost = el("div", "swarm-ghost is-fabric-roll", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const cloth = el("div", "swarm-fabric-cloth", ghost);
    const cylinder = el("div", "swarm-fabric-cylinder", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#e11d48";
    t.ghost = ghost;

    a.setTool("needle");
    await a.goto(t.x, t.y);

    const dur = Math.min(320, 160 + t.w * 0.14);
    await r.tween(dur, (p) => {
      const curW = t.w * p;
      cloth.style.width = curW + "px";
      cylinder.style.left = curW + "px";
      a.place(t.x + curW, t.y + (Math.sin(p * 18) * 8));
      badge.textContent = `✂️ ${Math.round(curW * 0.25)}cm / ${Math.round(curW * 0.1)}in`;
    });
    a.setTool("");
  }

  // 1.6 Warehouse: Kraft Tape Dispenser Roll
  async function dragBoxWarehouse(r, a, t) {
    const ghost = el("div", "swarm-ghost is-warehouse-box", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const boxCarton = el("div", "swarm-carton-body", ghost);
    const tape = el("div", "swarm-kraft-tape", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#ea580c";
    t.ghost = ghost;

    a.setTool("tape");
    await a.goto(t.x, t.y + t.h / 2);

    const dur = Math.min(320, 160 + t.w * 0.14);
    await r.tween(dur, (p) => {
      const curW = t.w * p;
      tape.style.width = curW + "px";
      boxCarton.style.opacity = Math.min(1, p * 1.5);
      a.place(t.x + curW, t.y + t.h / 2);
      badge.textContent = `📦 ISO-${Math.round(curW * 8)}`;
    });
    a.setTool("");
  }

  // 1.7 Voxel Craft: 8-Bit Pixel Blocks Snap In
  async function dragBoxVoxel(r, a, t) {
    const ghost = el("div", "swarm-ghost is-voxel-grid", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const voxelBed = el("div", "swarm-voxel-bed", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#16a34a";
    badge.style.fontFamily = "'Courier New', monospace";
    t.ghost = ghost;

    a.setTool("pickaxe");
    await a.goto(t.x, t.y);

    const dur = Math.min(340, 170 + (t.w + t.h) * 0.08);
    await r.tween(dur, (p) => {
      const scale = p < 0.8 ? p * 1.3 : 1 + (1 - p) * 0.2;
      voxelBed.style.transform = `scale(${Math.min(1, scale)})`;
      voxelBed.style.opacity = Math.min(1, p * 1.8);
      const vx = t.x + (t.w * p);
      const vy = t.y + (t.h * p) + (Math.sin(p * 22) * 6);
      a.place(vx, vy);
      badge.textContent = `⛏️ ${Math.round(t.w * p / 16)}x${Math.round(t.h * p / 16)} VOXELS`;
      if (Math.random() < 0.25) emitParticles(r, vx, vy, "#eab308");
    });
    voxelBed.style.transform = "scale(1)";
    a.setTool("");
  }

  // 1.8 Kitchen: Wooden Rolling Pin Dough Flattening
  async function dragBoxKitchen(r, a, t) {
    const ghost = el("div", "swarm-ghost is-dough-board", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const dough = el("div", "swarm-dough-blob", ghost);
    const pin = el("div", "swarm-rolling-pin", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#f43f5e";
    t.ghost = ghost;

    a.setTool("pin");
    await a.goto(t.x, t.y + t.h / 2);

    const dur = Math.min(340, 180 + t.w * 0.15);
    await r.tween(dur, (p) => {
      const curW = t.w * p;
      dough.style.width = curW + "px";
      dough.style.borderRadius = `${(1 - p) * 50}%`;
      dough.style.opacity = Math.min(1, 0.4 + p * 0.6);
      pin.style.left = curW + "px";
      a.place(t.x + curW, t.y + t.h / 2);
      badge.textContent = `🥐 ${Math.round(curW * 0.75)}g DOUGH`;
      if (Math.random() < 0.3) emitParticles(r, t.x + curW, t.y + t.h / 2, "#ffffff");
    });
    dough.style.width = "100%";
    dough.style.borderRadius = t.cs.borderRadius || "8px";
    pin.style.display = "none";
    a.setTool("");
  }

  // 1.9 Street Art: Diagonal Paint Roller Wheatpaste Slaps
  async function dragBoxStreetArt(r, a, t) {
    const ghost = el("div", "swarm-ghost is-wheatpaste-slab", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const stroke1 = el("div", "swarm-wheat-stroke stroke-1", ghost);
    const stroke2 = el("div", "swarm-wheat-stroke stroke-2", ghost);
    const stroke3 = el("div", "swarm-wheat-stroke stroke-3", ghost);
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#ec4899";
    t.ghost = ghost;

    a.setTool("roller");
    await a.goto(t.x, t.y);

    const dur = Math.min(340, 170 + (t.w + t.h) * 0.08);
    await r.tween(dur, (p) => {
      if (p < 0.35) {
        const p1 = p / 0.35;
        stroke1.style.opacity = p1;
        stroke1.style.transform = `scaleX(${p1})`;
        a.place(t.x + t.w * p1, t.y + t.h * p1);
      } else if (p < 0.7) {
        const p2 = (p - 0.35) / 0.35;
        stroke2.style.opacity = p2;
        stroke2.style.transform = `scaleX(${p2})`;
        a.place(t.x + t.w * (1 - p2), t.y + t.h * p2);
      } else {
        const p3 = (p - 0.7) / 0.3;
        stroke3.style.opacity = p3;
        stroke3.style.transform = `scaleX(${p3})`;
        a.place(t.x + t.w * p3, t.y + t.h * 0.5);
      }
      badge.textContent = `🎨 ${Math.round(p * 100)}% WHEATPASTE`;
      if (Math.random() < 0.3) emitParticles(r, a.x, a.y, "#ec4899");
    });
    a.setTool("");
  }

  // 1.10 Press Room: Movable-Type Iron Chase Frame Lock
  async function dragBoxPressRoom(r, a, t) {
    const ghost = el("div", "swarm-ghost is-press-chase", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:${a.color};`;
    const barT = el("div", "swarm-chase-bar is-top", ghost);
    const barB = el("div", "swarm-chase-bar is-bottom", ghost);
    const barL = el("div", "swarm-chase-bar is-left", ghost);
    const barR = el("div", "swarm-chase-bar is-right", ghost);
    const cropTL = el("div", "swarm-crop-mark is-tl", ghost);
    const cropTR = el("div", "swarm-crop-mark is-tr", ghost);
    const cropBL = el("div", "swarm-crop-mark is-bl", ghost);
    const cropBR = el("div", "swarm-crop-mark is-br", ghost);
    cropTL.textContent = "┼"; cropTR.textContent = "┼";
    cropBL.textContent = "┼"; cropBR.textContent = "┼";
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = "#475569";
    badge.style.fontFamily = "'Georgia', serif";
    t.ghost = ghost;

    a.setTool("press");
    await a.goto(t.x + t.w / 2, t.y);

    const dur = Math.min(320, 160 + (t.w + t.h) * 0.08);
    await r.tween(dur, (p) => {
      const inv = (1 - p) * 30;
      barT.style.transform = `translateY(${-inv}px)`;
      barB.style.transform = `translateY(${inv}px)`;
      barL.style.transform = `translateX(${-inv}px)`;
      barR.style.transform = `translateX(${inv}px)`;
      barT.style.opacity = p; barB.style.opacity = p; barL.style.opacity = p; barR.style.opacity = p;
      a.place(t.x + t.w / 2 + Math.sin(p * 12) * (t.w * 0.4), t.y + (p * t.h * 0.5));
      badge.textContent = `📰 CHASE #${Math.round(t.h / 8)} QUARTO`;
    });
    a.setTool("");
  }

  // 1.11 Science: Quantum Collider Discovery Beam & Molecular Synthesis Reaction
  async function dragBoxScience(r, a, t) {
    const ghost = el("div", "swarm-ghost is-science-discovery", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--c:#10b981;`;

    // Active molecular discovery chamber
    const chamber = el("div", "swarm-discovery-chamber", ghost);

    // Orbital electron shell
    const atom = el("div", "swarm-atom-orbital", chamber);
    el("div", "swarm-atom-nucleus", atom);
    el("div", "swarm-orbital-ring ring-1", atom);
    el("div", "swarm-orbital-ring ring-2", atom);
    el("div", "swarm-orbital-ring ring-3", atom);

    // Molecular discovery formula tags
    const formulas = ["[C₆H₁₂O₆]", "[ATP-SYNTH]", "[CRISPR-Cas9]", "[DNA-5']", "[H₂O-ION]"];
    const nodeCount = Math.max(2, Math.min(4, Math.floor(t.w / 110)));
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const node = el("div", "swarm-discovery-node", chamber);
      node.style.left = `${12 + (i * 72) / nodeCount}%`;
      node.style.top = `${28 + (i % 2 === 0 ? -12 : 18)}%`;
      node.textContent = formulas[i % formulas.length];
      nodes.push(node);
    }

    // High-energy quantum collider sweep beam
    const beam = el("div", "swarm-discovery-beam", ghost);

    const badge = el("span", "swarm-badge is-science-badge", ghost);
    badge.style.background = "#10b981";
    t.ghost = ghost;

    a.setTool("pen"); // holds pipette
    await a.goto(t.x, t.y + t.h / 2);

    const dur = Math.min(360, 160 + (t.w + t.h) * 0.08);
    await r.tween(dur, (p) => {
      const beamX = t.w * p;
      beam.style.left = `${beamX}px`;
      beam.style.opacity = p < 0.9 ? "1" : String((1 - p) * 10);

      // Chamber reveals as beam sweeps
      chamber.style.clipPath = `inset(0 ${Math.max(0, (1 - p) * 100)}% 0 0)`;
      chamber.style.opacity = String(Math.min(1, p * 1.5));

      nodes.forEach((n, idx) => {
        if (p >= (idx + 1) / (nodeCount + 1)) {
          n.classList.add("is-discovered");
        }
      });

      badge.textContent = p < 0.88
        ? `🔬 DISCOVERING: ${Math.round(p * 100)}% YIELD [Å]`
        : `⚛️ MOLECULAR BREAKTHROUGH!`;

      a.place(t.x + beamX, t.y + t.h / 2 + Math.sin(p * 14) * 16);
      if (Math.random() < 0.35) emitParticles(r, a.x, a.y, "#06b6d4");
    });
    a.setTool("");
  }

  // 1.12 Default: Precision Wireframe Drag
  async function dragBoxDefault(r, a, t) {
    const ghost = el("div", "swarm-ghost is-wireframe", r.layer);
    ghost.style.cssText = `left:${t.x}px;top:${t.y}px;width:0;height:0;--c:${a.color}`;
    const badge = el("span", "swarm-badge", ghost);
    badge.style.background = a.color;
    t.ghost = ghost;

    a.setTool("cross");
    await a.goto(t.x, t.y);

    const dur = Math.min(300, 120 + (t.w + t.h) * 0.08);
    await r.tween(dur, (p) => {
      const w = t.w * p;
      const h = t.h * p;
      ghost.style.width = w + "px";
      ghost.style.height = h + "px";
      badge.textContent = r.theme.dimensionUnit(w, h);
      a.place(t.x + w, t.y + h);
    });
    a.setTool("");
  }

  /* ================================================================== */
  /* Build Operation 2: traceBorder (Theme-Dispatched Perimeter Action)  */
  /* ================================================================== */

  function getPerimeterCoord(corners, per, p) {
    let d = p * per;
    for (let k = 0; k < 4; k++) {
      const [x1, y1] = corners[k];
      const [x2, y2] = corners[k + 1];
      const seg = Math.hypot(x2 - x1, y2 - y1);
      if (d <= seg || k === 3) {
        const f = seg ? Math.min(1, d / seg) : 0;
        return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f };
      }
      d -= seg;
    }
    return { x: corners[0][0], y: corners[0][1] };
  }

  function createSvgBorder(r, t, className, strokeColor) {
    const radius = Math.min(parseFloat(t.cs.borderTopLeftRadius) || 0, t.w / 2, t.h / 2);
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", `swarm-pen ${className}`);
    svg.setAttribute("width", t.w);
    svg.setAttribute("height", t.h);
    svg.style.cssText = `left:${t.x}px;top:${t.y}px`;

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", 0.75);
    rect.setAttribute("y", 0.75);
    rect.setAttribute("width", Math.max(0, t.w - 1.5));
    rect.setAttribute("height", Math.max(0, t.h - 1.5));
    rect.setAttribute("rx", radius);
    rect.setAttribute("stroke", strokeColor);
    svg.appendChild(rect);
    r.layer.appendChild(svg);
    t.pen = svg;

    const len = rect.getTotalLength ? rect.getTotalLength() : 2 * (t.w + t.h);
    rect.style.strokeDasharray = len;
    rect.style.strokeDashoffset = len;
    return { svg, rect, len };
  }

  async function traceBorder(r, a, t) {
    switch (r.theme.id) {
      case "construction": return traceBorderConstruction(r, a, t);
      case "beehive": return traceBorderBeehive(r, a, t);
      case "ant-colony": return traceBorderAntColony(r, a, t);
      case "cyber-nanobots": return traceBorderCyber(r, a, t);
      case "atelier": return traceBorderAtelier(r, a, t);
      case "warehouse": return traceBorderWarehouse(r, a, t);
      case "voxel-craft": return traceBorderVoxel(r, a, t);
      case "kitchen": return traceBorderKitchen(r, a, t);
      case "street-art": return traceBorderStreetArt(r, a, t);
      case "press-room": return traceBorderPressRoom(r, a, t);
      case "science": return traceBorderScience(r, a, t);
      default: return traceBorderDefault(r, a, t);
    }
  }

  // 2.1 Construction: Arc Welding Blowtorch Sparks
  async function traceBorderConstruction(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-welder", "#f59e0b");
    rect.style.strokeWidth = "2.5px";
    rect.style.filter = "drop-shadow(0 0 6px #f59e0b)";
    a.setTool("torch");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(340, 160 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.6) emitParticles(r, cur.x, cur.y, "#f59e0b");
    });
    a.setTool("");
  }

  // 2.2 Beehive: Honey Drips Sealing Perimeter
  async function traceBorderBeehive(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-honey", "#d97706");
    rect.style.strokeWidth = "3px";
    rect.style.strokeLinecap = "round";
    a.setTool("honey");

    const dripContainer = el("div", "swarm-honey-drips", t.ghost || r.layer);
    dripContainer.style.cssText = `position:absolute;left:0;top:${t.h}px;width:${t.w}px;height:24px;pointer-events:none;`;
    const numDrips = Math.max(2, Math.min(6, Math.floor(t.w / 60)));
    for (let i = 0; i < numDrips; i++) {
      const drop = el("span", "swarm-honey-drip", dripContainer);
      drop.style.left = `${(i + 0.5) * (100 / numDrips)}%`;
      drop.style.animationDelay = `${i * 0.1}s`;
    }

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(340, 170 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.35) emitParticles(r, cur.x, cur.y, "#d97706");
    });
    a.setTool("");
  }

  // 2.3 Ant Colony: Marching Ant Mandible Wall
  async function traceBorderAntColony(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-ants", "#15803d");
    rect.style.strokeWidth = "2px";
    rect.style.strokeDasharray = "6 6";
    a.setTool("leaf");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(320, 160 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.3) emitParticles(r, cur.x, cur.y, "#22c55e");
    });
    a.setTool("");
  }

  // 2.4 Cyber: High-Speed PCB Copper Trace Routing with Solder Pads
  async function traceBorderCyber(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-pcb", "#06b6d4");
    rect.style.strokeWidth = "2px";
    rect.style.filter = "drop-shadow(0 0 6px #06b6d4)";
    a.setTool("laser");

    const pads = [
      el("div", "swarm-solder-pad", t.ghost || r.layer),
      el("div", "swarm-solder-pad", t.ghost || r.layer),
      el("div", "swarm-solder-pad", t.ghost || r.layer),
      el("div", "swarm-solder-pad", t.ghost || r.layer)
    ];
    pads[0].style.cssText = "position:absolute;left:-3px;top:-3px;";
    pads[1].style.cssText = `position:absolute;left:${t.w - 5}px;top:-3px;`;
    pads[2].style.cssText = `position:absolute;left:${t.w - 5}px;top:${t.h - 5}px;`;
    pads[3].style.cssText = `position:absolute;left:-3px;top:${t.h - 5}px;`;

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(300, 140 + per * 0.06);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (p > 0.25) pads[1].classList.add("is-lit");
      if (p > 0.5) pads[2].classList.add("is-lit");
      if (p > 0.75) pads[3].classList.add("is-lit");
      if (p >= 0.98) pads[0].classList.add("is-lit");
      if (Math.random() < 0.4) emitParticles(r, cur.x, cur.y, "#06b6d4");
    });
    a.setTool("");
  }

  // 2.5 Atelier: Running Needle Bob Stitch
  async function traceBorderAtelier(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-stitch", "#e11d48");
    rect.style.strokeWidth = "2px";
    rect.style.strokeDasharray = "8 5";
    a.setTool("needle");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(340, 160 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      const bob = Math.sin(p * 36) * 5;
      a.place(cur.x, cur.y + bob);
    });
    a.setTool("");
  }

  // 2.6 Warehouse: Barcode Scanner Laser Sweep + Stamp
  async function traceBorderWarehouse(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-scanner", "#ea580c");
    rect.style.strokeWidth = "2.5px";
    a.setTool("scanner");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(300, 150 + per * 0.06);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.3) emitParticles(r, cur.x, cur.y, "#ea580c");
    });

    const stamp = el("div", "swarm-barcode-stamp", t.ghost || r.layer);
    stamp.textContent = "BARCODE // PASS";
    await r.wait(60);
    a.setTool("");
  }

  // 2.7 Voxel Craft: Redstone Wire Trail Glow
  async function traceBorderVoxel(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-redstone", "#dc2626");
    rect.style.strokeWidth = "3px";
    rect.style.strokeDasharray = "4 4";
    a.setTool("pickaxe");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(320, 160 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.3) emitParticles(r, cur.x, cur.y, "#ef4444");
    });
    rect.style.filter = "drop-shadow(0 0 8px #ef4444)";
    rect.style.stroke = "#ff4444";
    a.setTool("");
  }

  // 2.8 Kitchen: Piping Bag Cream Rosettes
  async function traceBorderKitchen(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-piping", "#ffffff");
    rect.style.strokeWidth = "3px";
    rect.style.strokeLinecap = "round";
    a.setTool("piping");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(340, 160 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.35) emitParticles(r, cur.x, cur.y, "#ffffff");
    });
    a.setTool("");
  }

  // 2.9 Street Art: Neon Aerosol Spray with Paint Drips
  async function traceBorderStreetArt(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-aerosol", "#ec4899");
    rect.style.strokeWidth = "3.5px";
    rect.style.filter = "drop-shadow(0 0 8px #ec4899)";
    a.setTool("can");

    const drips = el("div", "swarm-street-drips", t.ghost || r.layer);
    drips.style.cssText = `position:absolute;left:0;top:${t.h}px;width:${t.w}px;height:30px;pointer-events:none;`;
    const numDrips = Math.max(2, Math.min(5, Math.floor(t.w / 80)));
    for (let i = 0; i < numDrips; i++) {
      const d = el("span", "swarm-paint-drip", drips);
      d.style.left = `${(i + 0.3) * (100 / numDrips)}%`;
      d.style.height = `${16 + Math.random() * 16}px`;
    }

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(340, 160 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.5) emitParticles(r, cur.x, cur.y, "#ec4899");
    });
    a.setTool("");
  }

  // 2.10 Press Room: Fountain Pen Ruling with Corner Crop-Marks
  async function traceBorderPressRoom(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-ruling", "#334155");
    rect.style.strokeWidth = "1.5px";
    a.setTool("pen");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(300, 140 + per * 0.06);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
    });
    a.setTool("");
  }

  // 2.11 Science: Micropipette Reagent Drops & Covalent Bond Chain
  async function traceBorderScience(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-science", "#10b981");
    rect.style.strokeWidth = "2.5px";
    rect.style.filter = "drop-shadow(0 0 6px #10b981)";
    a.setTool("pen");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(320, 150 + per * 0.07);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.45) emitParticles(r, cur.x, cur.y, "#06b6d4");
    });
    a.setTool("");
  }

  // 2.12 Default: Standard Vector Pen
  async function traceBorderDefault(r, a, t) {
    const { rect, len } = createSvgBorder(r, t, "pen-default", a.color);
    a.setTool("pen");

    const corners = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h], [t.x, t.y]];
    const per = 2 * (t.w + t.h);
    const dur = Math.min(300, 140 + per * 0.06);

    await r.tween(dur, (p) => {
      rect.style.strokeDashoffset = len * (1 - p);
      const cur = getPerimeterCoord(corners, per, p);
      a.place(cur.x, cur.y);
      if (Math.random() < 0.3) emitParticles(r, cur.x, cur.y, a.color);
    });
    a.setTool("");
  }

  /* ================================================================== */
  /* Build Operation 3: fillBox (Theme-Dispatched Surface Solidify)      */
  /* ================================================================== */

  async function fillBox(r, t) {
    if (!t.ghost) return;
    const g = t.ghost;
    g.classList.add("is-filled");
    const themeId = r.theme.id;
    g.classList.add(`fill-${themeId}`);

    g.style.borderRadius = t.cs.borderRadius;
    g.style.backgroundColor = t.cs.backgroundColor;
    if (t.cs.backgroundImage !== "none") g.style.backgroundImage = t.cs.backgroundImage;
    if (t.cs.boxShadow !== "none") g.style.boxShadow = t.cs.boxShadow;

    if (themeId === "construction") {
      g.classList.add("swarm-concrete-pour");
      await r.wait(110);
    } else if (themeId === "cyber-nanobots") {
      g.classList.add("swarm-cyber-glitch-in");
      await r.wait(100);
    } else if (themeId === "kitchen") {
      g.classList.add("swarm-caramelize");
      await r.wait(110);
    } else if (themeId === "street-art") {
      g.classList.add("swarm-squeegee-press");
      await r.wait(100);
    } else if (themeId === "press-room") {
      g.classList.add("swarm-brayer-press");
      await r.wait(100);
    } else if (themeId === "science") {
      g.classList.add("swarm-titration-reaction");
      const bubbleCount = Math.max(3, Math.min(6, Math.floor(t.w / 55)));
      for (let i = 0; i < bubbleCount; i++) {
        const b = el("span", "swarm-bubble", g);
        b.style.left = `${12 + Math.random() * 76}%`;
        b.style.animationDelay = `${i * 0.08}s`;
      }
      await r.wait(130);
    } else {
      await r.wait(80);
    }
  }

  /* ================================================================== */
  /* Build Operation 4: typeText (Theme-Dispatched Letterform Inscription)*/
  /* ================================================================== */

  async function typeText(r, a, t) {
    const theme = r.theme;
    const cs = t.cs;
    const ghost = el("div", `swarm-text theme-${theme.id}`, r.layer);
    ghost.style.cssText =
      `left:${t.content.x}px;top:${t.content.y}px;width:${t.content.w + 2}px;` +
      `font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};` +
      `font-style:${cs.fontStyle};color:${cs.color};letter-spacing:${cs.letterSpacing};` +
      `text-transform:${cs.textTransform};text-align:${cs.textAlign};line-height:${cs.lineHeight};` +
      `--c:${a.color}`;
    const span = el("span", "", ghost);
    const caret = el("i", "swarm-caret", ghost);
    t.typed = ghost;

    const cr = () => caret.getBoundingClientRect();
    let c = cr();
    a.setTool("text");
    await a.goto(c.left + window.scrollX, c.bottom + window.scrollY);

    const chars = Array.from(t.text);
    const total = Math.min(320, 80 + chars.length * 5.2);
    const isMatrix = theme.id === "cyber-nanobots";
    const isBeehive = theme.id === "beehive";
    const isAtelier = theme.id === "atelier";
    const isPress = theme.id === "press-room";
    const isScience = theme.id === "science";
    const glyphs = "01#$@%&<>~*+=0x8F";
    const scienceGlyphs = ["H", "He", "Li", "C", "N", "O", "ΔG", "Ψ", "λ", "Ω", "μ"];

    let shown = 0;
    await r.tween(total, (_p, raw) => {
      const n = Math.round(raw * chars.length);
      if (n !== shown) {
        shown = n;
        if (isMatrix && n < chars.length) {
          const scramble = chars
            .slice(0, n)
            .concat(Array.from({ length: Math.min(3, chars.length - n) }, () => glyphs[Math.floor(Math.random() * glyphs.length)]))
            .join("");
          span.textContent = scramble;
        } else if (isScience && n < chars.length) {
          const scramble = chars
            .slice(0, n)
            .concat(Array.from({ length: Math.min(2, chars.length - n) }, () => scienceGlyphs[Math.floor(Math.random() * scienceGlyphs.length)]))
            .join("");
          span.textContent = scramble;
        } else {
          span.textContent = chars.slice(0, n).join("");
        }
        c = cr();
        let oy = 0;
        if (isBeehive) oy = Math.sin(raw * 24) * 6;
        if (isAtelier) oy = (n % 2 === 0 ? -4 : 4);
        if (isPress) ghost.classList.toggle("is-typewriter-strike", n % 3 === 0);
        a.place(c.left + window.scrollX + 2, c.bottom + window.scrollY + oy);
      }
    });
    span.textContent = t.text;
    a.setTool("");
  }

  /* ================================================================== */
  /* Build Operation 5: dropImage (All 12 Custom Media Unpackers)       */
  /* ================================================================== */

  async function dropImage(r, a, t) {
    const themeId = r.theme.id;
    a.setTool("crate");

    if (themeId === "construction") {
      // 1. Tower Crane Wooden Cargo Crate Drop + Planks Shatter
      const startY = t.y - 140;
      await a.goto(t.x + t.w / 2, startY);

      const crateWrap = el("div", "swarm-crate-wrap", r.layer);
      crateWrap.style.cssText = `left:${t.x}px;top:${startY}px;width:${t.w}px;height:${t.h}px;`;
      el("div", "swarm-crane-cable", crateWrap);
      const crate = el("div", "swarm-crate", crateWrap);
      crate.innerHTML = '<span class="swarm-crate-stamp">🏗️ CARGO CRATE</span>';
      t.ghost = crateWrap;

      await r.tween(380, (p) => {
        const curY = startY + (t.y - startY) * p;
        crateWrap.style.top = curY + "px";
        a.place(t.x + t.w / 2, curY - 14);
      });

      emitParticles(r, t.x + t.w / 2, t.y + t.h, "#f59e0b");
      crate.classList.add("is-shattering");
      await r.wait(140);
    } else if (themeId === "beehive") {
      // 2. Honeycomb Wax Cap Unseal
      await a.goto(t.x + t.w / 2, t.y + t.h / 2);
      const wax = el("div", "swarm-wax-cover", r.layer);
      wax.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      wax.innerHTML = '<span class="swarm-wax-seal">🍯 COMB CELL</span>';
      t.ghost = wax;
      await r.wait(160);
      emitParticles(r, t.x + t.w / 2, t.y + t.h / 2, "#f59e0b");
      wax.classList.add("is-uncapping");
      await r.wait(140);
    } else if (themeId === "ant-colony") {
      // 3. 8-Ant Heavy-Lift Slab Placement
      const maxOffset = Math.min(120, Math.max(10, t.x - 10));
      const offset = Math.max(10, Math.min(maxOffset, window.innerWidth * 0.18));
      await a.goto(t.x - offset, t.y + t.h / 2);
      const antSlab = el("div", "swarm-ant-heavy-slab", r.layer);
      antSlab.style.cssText = `left:${t.x - offset}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      antSlab.innerHTML = '<span class="swarm-ant-slab-label">🐜 BIO-CONTAINER</span>';
      t.ghost = antSlab;

      await r.tween(360, (p) => {
        const cx = t.x - offset * (1 - p);
        antSlab.style.left = cx + "px";
        a.place(cx + t.w / 2, t.y + t.h / 2);
        if (Math.random() < 0.3) emitParticles(r, cx + t.w / 2, t.y + t.h, "#22c55e");
      });
      antSlab.classList.add("is-unlatched");
      await r.wait(130);
    } else if (themeId === "cyber-nanobots") {
      // 4. Laser 3D Hologram Sinter Sweep
      await a.goto(t.x, t.y);
      const holoWrap = el("div", "swarm-laser-print-wrap", r.layer);
      holoWrap.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      const sweepLaser = el("div", "swarm-laser-print-bar", holoWrap);
      t.ghost = holoWrap;

      await r.tween(340, (p) => {
        const curX = t.w * p;
        sweepLaser.style.left = curX + "px";
        a.place(t.x + curX, t.y + (t.h * p));
        if (Math.random() < 0.4) emitParticles(r, t.x + curX, t.y + t.h * 0.5, "#06b6d4");
      });
      holoWrap.classList.add("is-printed");
      await r.wait(120);
    } else if (themeId === "atelier") {
      // 5. Polaroid Moodboard Photo + Brass Push-Pin
      await a.goto(t.x + t.w / 2, t.y - 40);
      const polaroid = el("div", "swarm-polaroid-frame", r.layer);
      polaroid.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      const pin = el("div", "swarm-brass-pin", polaroid);
      pin.textContent = "📌";
      t.ghost = polaroid;

      await r.tween(300, (p) => {
        const scale = p < 0.7 ? p * 1.2 : 1 + (1 - p) * 0.2;
        polaroid.style.transform = `scale(${Math.min(1.05, scale)}) rotate(${Math.sin(p * 8) * 3}deg)`;
        a.place(t.x + t.w / 2, t.y + 10);
      });
      polaroid.style.transform = "rotate(0deg) scale(1)";
      await r.wait(120);
    } else if (themeId === "warehouse") {
      // 6. Forklift Pallet Delivery
      const maxRight = Math.max(10, window.innerWidth - (t.x + t.w) - 10);
      const offset = Math.min(120, maxRight);
      await a.goto(t.x + offset, t.y + t.h / 2);
      const pallet = el("div", "swarm-pallet-delivery", r.layer);
      pallet.style.cssText = `left:${t.x + offset}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      pallet.innerHTML = '<span class="swarm-pallet-label">🚜 DISPATCH #419</span>';
      t.ghost = pallet;

      await r.tween(360, (p) => {
        const cx = t.x + offset * (1 - p);
        pallet.style.left = cx + "px";
        a.place(cx + t.w, t.y + t.h / 2);
      });
      pallet.classList.add("is-unstrapped");
      await r.wait(130);
    } else if (themeId === "voxel-craft") {
      // 7. Treasure Chest Drop & Open
      const startY = t.y - 120;
      await a.goto(t.x + t.w / 2, startY);
      const chest = el("div", "swarm-chest", r.layer);
      chest.style.cssText = `left:${t.x}px;top:${startY}px;width:${t.w}px;height:${t.h}px;`;
      chest.innerHTML = '<div class="chest-lid">⛏️ CHEST</div>';
      t.ghost = chest;

      await r.tween(340, (p) => {
        const curY = startY + (t.y - startY) * p;
        chest.style.top = curY + "px";
        a.place(t.x + t.w / 2, curY - 10);
      });

      emitParticles(r, t.x + t.w / 2, t.y + t.h / 2, "#facc15");
      chest.classList.add("is-opening");
      await r.wait(140);
    } else if (themeId === "kitchen") {
      // 8. Silver Cloche Dome Lift + Steam
      await a.goto(t.x + t.w / 2, t.y + t.h / 2);
      const cloche = el("div", "swarm-cloche", r.layer);
      cloche.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      cloche.innerHTML = '<div class="cloche-handle"></div><div class="cloche-dome">🍽️ PRESENTATION</div>';
      t.ghost = cloche;
      await r.wait(140);
      emitParticles(r, t.x + t.w / 2, t.y + t.h / 2, "#ffffff");
      cloche.classList.add("is-lifting");
      await r.wait(160);
    } else if (themeId === "street-art") {
      // 9. Slap-Sticker Slam & Squeegee
      await a.goto(t.x + t.w / 2, t.y + t.h / 2);
      const sticker = el("div", "swarm-sticker", r.layer);
      sticker.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      sticker.innerHTML = '<span class="sticker-tag">ART // SLAP</span>';
      t.ghost = sticker;
      emitParticles(r, t.x + t.w / 2, t.y + t.h / 2, "#ec4899");
      sticker.classList.add("is-slammed");
      await r.wait(150);
    } else if (themeId === "press-room") {
      // 10. CMYK 4-Color Halftone Plate Alignment
      await a.goto(t.x + t.w / 2, t.y + t.h / 2);
      const cmykWrap = el("div", "swarm-cmyk-wrap", r.layer);
      cmykWrap.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      const plateC = el("div", "swarm-cmyk-plate is-c", cmykWrap);
      const plateM = el("div", "swarm-cmyk-plate is-m", cmykWrap);
      const plateY = el("div", "swarm-cmyk-plate is-y", cmykWrap);
      const plateK = el("div", "swarm-cmyk-plate is-k", cmykWrap);
      t.ghost = cmykWrap;

      await r.tween(320, (p) => {
        const off = (1 - p) * 16;
        plateC.style.transform = `translate(${-off}px, ${-off}px)`;
        plateM.style.transform = `translate(${off}px, ${-off}px)`;
        plateY.style.transform = `translate(${-off}px, ${off}px)`;
        plateK.style.transform = `translate(${off}px, ${off}px)`;
        a.place(t.x + t.w / 2, t.y + t.h / 2);
      });
      cmykWrap.classList.add("is-registered");
      await r.wait(120);
    } else if (themeId === "science") {
      // 11. Cryo-Stasis Specimen Discovery Chamber Unseal
      await a.goto(t.x + t.w / 2, t.y + t.h / 2);
      const pod = el("div", "swarm-cryo-pod", r.layer);
      pod.style.cssText = `left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;`;
      pod.innerHTML =
        '<div class="cryo-header">🔬 SPECIMEN DISCOVERY CHAMBER</div>' +
        '<div class="cryo-reticle">⊕</div>' +
        '<div class="cryo-frost"></div>';
      t.ghost = pod;
      await r.wait(140);
      emitParticles(r, t.x + t.w / 2, t.y + t.h / 2, "#06b6d4");
      emitParticles(r, t.x + t.w / 2, t.y + t.h / 2, "#10b981");
      pod.classList.add("is-unsealed");
      await r.wait(180);
    } else {
      // 12. Default & Standard Image Reveal
      await dragBox(r, a, t);
      t.ghost.classList.add("is-image");
      await r.wait(70);
    }

    a.setTool("");
  }


function revealTask(t) {
    t.el.classList.remove("swarm-pending");
    t.el.classList.add("swarm-revealing");
    const leftovers = [t.ghost, t.pen, t.typed].filter(Boolean);
    leftovers.forEach((n) => n.classList.add("is-leaving"));
    setTimeout(() => leftovers.forEach((n) => n.remove()), 350);
  }

  async function performTask(r, a, t) {
    const liveRect = t.el.getBoundingClientRect();
    t.x = liveRect.left + window.scrollX;
    t.y = liveRect.top + window.scrollY;
    t.w = liveRect.width;
    t.h = liveRect.height;
    t.content.x = t.x + (t.content.padLeft || 0);
    t.content.y = t.y + (t.content.padTop || 0);
    t.content.w = Math.max(10, t.w - (t.content.padLeft || 0) - (t.content.padRight || 0));

    r.focus = { x: t.x + t.w / 2, y: t.y + t.h / 2 };

    if (t.isImg) {
      await dropImage(r, a, t);
    } else {
      if (t.box) {
        await dragBox(r, a, t);
        if (t.border && (t.w > 100 || t.h > 50)) {
          await traceBorder(r, a, t);
        }
        await fillBox(r, t);
      }
      if (t.text) await typeText(r, a, t);
    }
    revealTask(t);
    await r.wait(60);
  }

  /* ------------------------------------------------------------------ */
  /* Section Build Execution (Capped Concurrency for Visible Steps)     */
  /* ------------------------------------------------------------------ */

  function claimNextTask(tasks) {
    return tasks.find(
      (t) => t.state === "pending" && (!t.parent || t.parent.state === "done")
    );
  }

  async function buildSection(r, sec) {
    if (!sec || sec.state !== "pending") return;
    sec.state = "building";
    r.buildingSection = sec;

    // Dynamic per-section theme switching via data-swarm-theme
    const secThemeKey = sec.el.dataset.swarmTheme;
    if (secThemeKey && THEMES[secThemeKey] && secThemeKey !== r.theme.id) {
      const newTheme = THEMES[secThemeKey];
      r.theme = newTheme;
      document.body.setAttribute("data-swarm-theme", secThemeKey);
      if (r.canvas) r.canvas.setAttribute("data-theme", secThemeKey);
      r.agents.forEach((a, idx) => {
        const tool = newTheme.tools[idx % newTheme.tools.length];
        a.tool = tool;
        a.color = newTheme.colors[idx % newTheme.colors.length];
        a.name = newTheme.agentNames[idx % newTheme.agentNames.length];
        if (a.badge) a.badge.textContent = a.name;
        if (a.toolEl) a.toolEl.innerHTML = ICONS[tool.icon] || ICONS.cursor;
      });
    }

    const name = friendlyName(sec.el);
    setToolbarStatus(r, `${r.theme.statusPrefix} ${name}...`);

    const tasks = sec.tasks;
    if (tasks && tasks.length) {
      const firstTask = tasks[0];
      r.focus = { x: firstTask.x + firstTask.w / 2, y: firstTask.y + firstTask.h / 2 };

      // Limit concurrent builders to 4 so the user can clearly admire each construction phase
      const activeBuilders = Math.min(4, r.agents.length);
      const workerPromises = r.agents.map(async (a, idx) => {
        if (idx >= activeBuilders) {
          // Flocking support agents that follow along
          return;
        }

        await r.wait(a.i * 50);
        while (tasks.some((t) => t.state !== "done")) {
          if (r.cancelled) return;
          const t = claimNextTask(tasks);
          if (!t) {
            a.busy = false;
            a.arrive = null;
            await r.nextSignal();
            continue;
          }
          t.state = "active";
          a.busy = true;
          try {
            await performTask(r, a, t);
          } finally {
            t.state = "done";
            a.busy = false;
            r.signal();
          }
        }
      });

      await Promise.all(workerPromises);
    }

    sec.state = "done";
    sec.el.classList.remove("swarm-section-pending");
    r.buildingSection = null;
  }

  /* ------------------------------------------------------------------ */
  /* Guided Scroll-Follow Tour (Build -> Follow Scroll -> Return Top)  */
  /* ------------------------------------------------------------------ */

  async function runTour(r) {
    try {
      for (let i = 0; i < r.sections.length; i++) {
        if (r.cancelled) return;
        const sec = r.sections[i];

        if (i === 0) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          await r.wait(250);
        } else {
          sec.el.scrollIntoView({ behavior: "smooth", block: "start" });
          await r.wait(450);
        }

        if (r.cancelled) return;
        await buildSection(r, sec);
        await r.wait(250);
      }

      if (r.cancelled) return;

      window.scrollTo({ top: 0, behavior: "smooth" });
      await r.wait(600);

      finishFullRebuild(r);
    } catch (err) {
      if (err !== CANCEL) console.error("[Swarm Tour]", err);
    }
  }

  function finishFullRebuild(r) {
    if (r.opts && r.opts.oncePerSession) {
      try {
        sessionStorage.setItem("swarmCompleted", "true");
      } catch (e) {}
    }
    if (r.opts && typeof r.opts.onComplete === "function") {
      try {
        r.opts.onComplete();
      } catch (e) {
        console.error("[Swarm onComplete]", e);
      }
    }

    if (r.toolbar) {
      r.toolbar.classList.add("is-done");
      setToolbarStatus(r, `Rebuilt by ${r.theme.label}`);
      const skipBtn = r.toolbar.querySelector('[data-act="skip"]');
      const speedBtn = r.toolbar.querySelector('[data-act="speed"]');
      const replayBtn = r.toolbar.querySelector('[data-act="replay"]');
      const liveBtn = r.toolbar.querySelector('[data-act="live"]');
      if (skipBtn) skipBtn.hidden = true;
      if (speedBtn) speedBtn.hidden = true;
      if (replayBtn) replayBtn.hidden = false;
      if (liveBtn) liveBtn.hidden = false;
    }

    if (r.canvas) r.canvas.classList.add("is-leaving");
  }

  /* ------------------------------------------------------------------ */
  /* Dock & Toolbar                                                     */
  /* ------------------------------------------------------------------ */

  function buildDock(r) {
    if (r.opts.showDock === false) return;
    if (r.allowedThemes && r.allowedThemes.length <= 1) return;
    if (document.querySelector(".swarm-dock") || document.getElementById("themeStrip")) return;

    const dock = el("div", "swarm-dock swarm-no-tour", document.body);
    dock.setAttribute("role", "navigation");
    dock.setAttribute("aria-label", "Swarm theme switcher dock");

    const themesToShow = r.allowedThemes || Object.keys(THEMES);
    dock.innerHTML = themesToShow
      .map((k) => {
        const t = THEMES[k];
        const isActive = k === r.theme.id ? "active" : "";
        return (
          `<button type="button" class="swarm-dock-chip ${isActive}" data-theme="${k}" title="${t.label} — ${t.subtitle}" aria-label="${t.label}">` +
          `<span class="swarm-dock-icon">${t.emoji}</span>` +
          `<span class="swarm-dock-label">${t.label}</span>` +
          `</button>`
        );
      })
      .join("");

    dock.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-theme]");
      if (chip && chip.dataset.theme) {
        Swarm.setTheme(chip.dataset.theme);
      }
    });

    r.dock = dock;
  }

  function setToolbarStatus(r, text) {
    if (!r.toolbar) return;
    const st = r.toolbar.querySelector(".swarm-status");
    if (st) st.textContent = text;
  }

  function buildToolbar(r) {
    if (r.opts.showToolbar === false) return;

    const bar = el("div", "swarm-toolbar", document.body);
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "Swarm rebuild controls");

    let themeOptionsHtml = "";
    const themesToShow = r.allowedThemes || Object.keys(THEMES);
    const hasMultipleThemes = themesToShow.length > 1;

    if (hasMultipleThemes) {
      themesToShow.forEach((k) => {
        const isSel = k === r.theme.id ? "selected" : "";
        themeOptionsHtml += `<option value="${k}" ${isSel}>${THEMES[k].emoji} ${THEMES[k].label}</option>`;
      });
    }

    const selectHtml = hasMultipleThemes
      ? `<select class="swarm-theme-select" data-act="theme" title="Select Swarm Theme">${themeOptionsHtml}</select>`
      : "";

    bar.innerHTML =
      '<span class="swarm-dot" aria-hidden="true"></span>' +
      '<span class="swarm-status">Building page...</span>' +
      selectHtml +
      '<button type="button" data-act="speed" title="Change speed"></button>' +
      '<button type="button" data-act="skip" title="Skip animation (Esc)">Skip</button>' +
      '<button type="button" data-act="replay" hidden>Replay</button>' +
      '<button type="button" data-act="live" hidden>Go live</button>';

    const speedBtn = bar.querySelector('[data-act="speed"]');
    const paintSpeed = () => {
      if (speedBtn) speedBtn.textContent = getSpeed() + "×";
    };
    paintSpeed();

    bar.addEventListener("change", (e) => {
      if (e.target.dataset.act === "theme") {
        Swarm.setTheme(e.target.value);
      }
    });

    bar.addEventListener("click", (e) => {
      const act = e.target.closest("button")?.dataset.act;
      if (act === "speed") {
        speedIndex = (speedIndex + 1) % SPEEDS.length;
        try { localStorage.setItem("swarmSpeed", String(getSpeed())); } catch (e) {}
        paintSpeed();
      } else if (act === "skip" || act === "live") {
        Swarm.skip();
      } else if (act === "replay") {
        Swarm.replay();
      }
    });

    r.toolbar = bar;
    requestAnimationFrame(() => bar.classList.add("is-on"));
  }

  /* ------------------------------------------------------------------ */
  /* Teardown (Instant Skip / Completion)                                */
  /* ------------------------------------------------------------------ */

  function teardown(r, instant) {
    r.cancel();
    cancelAnimationFrame(r.raf);

    r.sections.forEach((sec) => {
      sec.el.classList.remove("swarm-section-pending");
      sec.tasks.forEach((t) => {
        t.el.classList.remove("swarm-pending");
        if (!instant) t.el.classList.add("swarm-revealing");
      });
    });

    document.querySelectorAll("[aria-hidden='true']").forEach((d) => {
      d.classList.remove("swarm-pending");
    });

    r.root.classList.remove("swarm-root");
    document.body.classList.remove("swarm-active");
    document.body.removeAttribute("data-swarm-theme");

    if (r.opts && r.opts.oncePerSession) {
      try {
        sessionStorage.setItem("swarmCompleted", "true");
      } catch (e) {}
    }

    const nodes = [r.layer, r.canvas, r.toolbar, r.dock].filter(Boolean);
    nodes.forEach((n) => n.classList.add("is-leaving"));
    setTimeout(() => {
      nodes.forEach((n) => n.remove());
      r.sections.forEach((sec) => {
        sec.tasks.forEach((t) => t.el.classList.remove("swarm-revealing"));
      });
    }, instant ? 0 : 300);

    if (activeRun === r) activeRun = null;
  }

  /* ------------------------------------------------------------------ */
  /* Swarm Initialization                                               */
  /* ------------------------------------------------------------------ */

  function init(opts = {}) {
    if (activeRun) teardown(activeRun, true);

    if (opts.oncePerSession) {
      try {
        if (sessionStorage.getItem("swarmCompleted") === "true") {
          return { destroy: () => {} };
        }
      } catch (e) {}
    }

    let root = null;
    if (typeof opts.root === "string") {
      root = document.querySelector(opts.root);
    } else if (opts.root && (opts.root.nodeType === 1 || opts.root instanceof Element)) {
      root = opts.root;
    } else {
      root = document.querySelector("main") || document.body;
    }
    if (!root) return { destroy: () => {} };

    if (opts.speed && SPEEDS.includes(Number(opts.speed))) {
      speedIndex = SPEEDS.indexOf(Number(opts.speed));
      try { localStorage.setItem("swarmSpeed", String(getSpeed())); } catch (e) {}
    }

    if (opts.theme && THEMES[opts.theme]) {
      activeTheme = opts.theme;
      try { localStorage.setItem("swarmTheme", activeTheme); } catch (e) {}
    }

    const themeKey = activeTheme;
    const small = window.innerWidth <= 640;
    const count = Math.max(3, Math.min(12, opts.agents || (small ? 4 : 8)));
    const r = createRun(root, themeKey, opts);
    activeRun = r;

    document.body.classList.add("swarm-active");
    document.body.setAttribute("data-swarm-theme", r.theme.id);
    root.classList.add("swarm-root");

    const secSelector = opts.sectionSelector || "section, [data-swarm-section]";
    const sectionElements = Array.from(root.querySelectorAll(secSelector)).filter(
      (el) => !el.classList.contains("swarm-no-tour")
    );
    if (!sectionElements.length) {
      teardown(r, true);
      return { destroy: () => {} };
    }

    r.canvas = el("div", "swarm-canvas", document.body);
    r.canvas.setAttribute("data-theme", r.theme.id);
    r.layer = el("div", "swarm-layer", document.body);

    buildToolbar(r);
    buildDock(r);

    const start = { x: mouse.x, y: mouse.y };
    for (let i = 0; i < count; i++) {
      r.agents.push(createAgent(r, i, start));
    }
    r.raf = requestAnimationFrame((t) => physics(r, t));

    r.sections = sectionElements.map((sec) => {
      const tasks = snapshotSection(sec);
      tasks.forEach((t) => t.el.classList.add("swarm-pending"));
      sec.classList.add("swarm-section-pending");
      return {
        el: sec,
        id: sec.id,
        state: "pending",
        tasks,
      };
    });

    runTour(r);

    return {
      run: r,
      destroy: () => Swarm.destroy(),
    };
  }

  /* ------------------------------------------------------------------ */
  /* Public Interface                                                   */
  /* ------------------------------------------------------------------ */

  const Swarm = {
    init,
    play: (opts) => init(opts),
    destroy() {
      if (activeRun) teardown(activeRun, true);
    },
    setTheme(themeName) {
      if (THEMES[themeName]) {
        activeTheme = themeName;
        try { localStorage.setItem("swarmTheme", themeName); } catch (e) {}
        document.querySelectorAll(".swarm-dock-chip, .theme-chip").forEach((btn) => {
          if (btn.dataset.theme === themeName) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
        document.querySelectorAll(".swarm-theme-select").forEach((sel) => {
          sel.value = themeName;
        });
        return Swarm.replay();
      }
    },
    getTheme: () => activeTheme,
    getThemes: () =>
      Object.keys(THEMES).map((k) => ({
        id: k,
        label: THEMES[k].label,
        emoji: THEMES[k].emoji,
        subtitle: THEMES[k].subtitle,
        mechanics: THEMES[k].mechanics,
      })),
    skip() {
      if (activeRun) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        teardown(activeRun, false);
      }
    },
    async replay(opts = {}) {
      if (activeRun) teardown(activeRun, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise((res) => setTimeout(res, 250));
      return init(opts);
    },
    triggerSectionById(id) {
      if (!activeRun) return;
      const sec = activeRun.sections.find((s) => s.id === id);
      if (sec && sec.state === "pending") {
        sec.el.scrollIntoView({ behavior: "smooth", block: "start" });
        buildSection(activeRun, sec);
      }
    },
    isRunning: () => !!activeRun,
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeRun) {
      e.preventDefault();
      Swarm.skip();
    }
    if (e.altKey && e.shiftKey && (e.key === "S" || e.key === "s" || e.code === "KeyS")) {
      e.preventDefault();
      Swarm.replay();
    }
  });

  if (typeof window !== "undefined") {
    window.Swarm = Swarm;
  }
  return Swarm;
});
