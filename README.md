# Techfest IIT Bombay – 30th Edition

> **"An Aetherial Renaissance"** — A cinematic, interactive 3D web experience celebrating three decades of pioneering science, engineering, and celestial curiosity at Asia's largest science and technology festival.

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169.x-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🏛️ Project Introduction

Techfest IIT Bombay reaches its landmark **30th Edition** under the thematic vision of **"An Aetherial Renaissance"**. 

This web application fuses classical Renaissance celestial architecture—armillary spheres, astrolabes, Romanesque columnades, and stone observatories—with futuristic cyan holographic interfaces and cosmic energy conduits. As visitors scroll, a synchronized camera navigates through five interconnected 3D realms staged along the depth axis ($Z$-axis), providing an immersive portal to the festival's competitions, workshops, accommodation, and campus ambassador program.

---

## ✨ Key Features

- **Immersive 3D Celestial Universe:**
  - Real-time 3D environments rendered via Three.js and React Three Fiber with zero DOM bloat.
  - Staged progression along the camera depth route:
    - **Hero & About ($Z = 0$):** Celestial Stone Observatory with rotating golden astrolabe gimbals.
    - **Competitions Arena ($Z = -14$):** Concentric hovering rune rings, energy pylons, and category sigils.
    - **Workshop Laboratory ($Z = -26.5$):** Holographic pedestals, technical grid planes, and orbiting data nodes.
    - **Accommodation Sanctuary ($Z = -34.5$):** Institute hostel blocks, illuminated windows, and golden walkway lanterns.
    - **Ambassador Orrery ($Z = -48$):** Grand celestial globe with 4 astronomical rings and 12 orbiting motes.
- **Cinematic Lighting & Atmospheric Fog:**
  - Dynamic zone lighting with golden directional key light, cool cyan fills, and localized spotlights that brighten as the camera enters their sphere.
  - Exponential atmospheric depth fog (`fogExp2` in navy blue `#060a16`) maintaining visual mystery while preserving readability.
- **Selective Post-Processing Bloom & Camera Effects:**
  - Tuned luminance threshold bloom that illuminates energy cores and holographic rings without blowing out UI text.
  - Cinematic vignette and micro-chromatic aberration in high-performance mode.
- **Dual-Layer Cosmic Particle System:**
  - GPU-accelerated `BufferGeometry` particle system with upward-drifting golden dust, energized cyan specks, and distant cosmic starfield.
- **GSAP & Lenis Smooth Camera Transitions:**
  - Single-source-of-truth scroll synchronization connecting Lenis smooth scrolling, GSAP ScrollTrigger, and quadratic Bezier camera arc paths.
- **Interactive Objects & Dynamic Inspection Panels:**
  - Raycasted 3D objects with pointer hover feedback, floating HTML hotspot markers, and click-to-inspect modal overlays.
- **Fault-Tolerant WebGL Architecture:**
  - Native `ErrorBoundary` wrapper preventing 3D context failures from breaking the webpage.
  - Automatic `webglcontextlost` and `webglcontextrestored` event handling ensuring festival schedules and registrations remain accessible even without WebGL.
- **Adaptive Performance Tiers (Immersive vs. Lite):**
  - Built-in hardware detection (`hardwareConcurrency`, `deviceMemory`, and `prefers-reduced-motion`) automatically selecting optimal quality.
  - Instant manual toggle via the navigation bar for user preference.
- **Accessibility & Mobile Touch Compatibility:**
  - Semantic HTML5 structure with skip-to-content bypass link, ARIA dialog roles, live announcer loading states, and visible focus rings (`focus:ring-2 focus:ring-gold-400`).
  - Full touch-target compliance on mobile devices with an animated sliding menu drawer.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | [React 18](https://react.dev/) | Component architecture & state synchronization |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety and maintainable codebase |
| **Bundler & Tooling** | [Vite 7](https://vitejs.dev/) | Instant HMR development and optimized production bundling |
| **3D Rendering** | [Three.js](https://threejs.org/) (r169) | Core 3D engine, geometries, shaders, and materials |
| **3D React Wrapper** | [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | Declarative Three.js scene orchestration |
| **3D Utilities** | [@react-three/drei](https://github.com/pmndrs/drei) | Floats, adaptive DPR, preloading, and HTML overlays |
| **Post-Processing** | [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | Selective Bloom, Vignette, and Chromatic Aberration |
| **Scroll Engine** | [Lenis 1.3](https://lenis.darkroom.engineering/) | Hardware-accelerated smooth scrolling |
| **Animation Engine** | [GSAP 3](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/) | Scroll-linked camera sweeps and text reveal timelines |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Dark navy glassmorphism and antique gold design tokens |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector UI icons |

---

## 📂 Project Structure

```text
Techfast-30th_3D/
├── index.html                      # HTML entry with font preconnects & metadata
├── package.json                    # Project dependencies and script declarations
├── postcss.config.js               # PostCSS plugin configurations
├── tailwind.config.js              # Custom Renaissance color palette & fonts
├── tsconfig.json                   # TypeScript project root configuration
├── tsconfig.app.json               # App-specific strict TypeScript compilation settings
├── tsconfig.node.json              # Node environment TypeScript configuration
├── vite.config.ts                  # Vite build and plugin configurations
├── src/
│   ├── main.tsx                    # React DOM root render
│   ├── App.tsx                     # Main layout, Lenis setup, and section routing
│   ├── index.css                   # Tailwind layers, glassmorphism, & keyframes
│   ├── components/
│   │   ├── Navbar.tsx              # Glassmorphic header with mode switch & navigation
│   │   ├── Hero.tsx                # Hero section with dual-tone title & explore action
│   │   ├── Sections.tsx            # About, Competitions, Workshops, Acco, & CA sections
│   │   ├── DetailPanel.tsx         # Accessible modal panel with Escape-key listener
│   │   ├── Footer.tsx              # Sanctuary coordinates, quick links, & back-to-top
│   │   ├── LoadingScreen.tsx       # Multi-ring orbital loader with progress counter
│   │   ├── ErrorBoundary.tsx       # React error boundary for 3D engine resilience
│   │   ├── ExperienceCanvas.tsx    # R3F Canvas with post-processing & adaptive DPR
│   │   └── three/
│   │       ├── Scene.tsx           # 3D staging root with fogExp2 & environment mounts
│   │       ├── CameraController.tsx# Quadratic Bezier scroll-damped camera interpolation
│   │       ├── Lighting.tsx        # Dynamic zone point lights & directional key light
│   │       ├── Particles.tsx       # 3-layer BufferGeometry cosmic dust & energy specks
│   │       ├── InteractiveObject.tsx# Reusable hover-glow & raycasted click wrapper
│   │       ├── Astrolabe.tsx       # Rotating multi-axis gimbal rings with glowing core
│   │       ├── Observatory.tsx     # Romanesque columns, stone base, and dome rays
│   │       ├── CompetitionArena.tsx# Floating rune rings, energy pylons, & sigils
│   │       ├── WorkshopLab.tsx     # Technical platform, scanning beam, & data cubes
│   │       ├── CampusEnvironment.tsx# Hostel structures with window illumination & path lights
│   │       ├── AmbassadorGlobe.tsx # 4-ring astronomical orrery globe with orbiting motes
│   │       ├── Holograms.tsx       # Emissive scanning planes & wireframe beacons
│   │       └── CelestialObjects.tsx# Orbiting planets and golden floating shards
│   ├── data/
│   │   ├── cameraStops.ts          # Spatial waypoints (position, lookAt, FOV, roll)
│   │   └── event.ts                # Structured event content, categories, & schedules
│   └── store/
│       ├── interaction.ts          # Central selected/hovered state store
│       ├── performanceMode.ts      # Immersive/Lite mode definitions and heuristics
│       └── scrollProgress.ts       # Global scroll progress signal for 3D camera
```

---

## 🚀 Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` (version `9.x` or higher) or equivalent package manager (`pnpm` / `yarn`)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Niteshkr-B07/Techfast-30th_3D.git
   cd Techfast-30th_3D
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **`dev`** | `npm run dev` | Starts Vite local development server with Hot Module Replacement |
| **`build`** | `npm run build` | Compiles TypeScript and packages optimized production assets to `dist/` |
| **`lint`** | `npm run lint` | Runs ESLint to verify code quality and style standards |
| **`typecheck`** | `npm run typecheck` | Executes TypeScript compiler check without emitting output files |
| **`preview`** | `npm run preview` | Spins up a local web server to preview production build artifacts |

---

## 🔒 Environment Variables

This frontend experience operates client-side with static and CDN asset resolution. No external private API keys or mandatory environment variables are required for standard local execution or deployment.

If integrating with external database or registration services, copy `.env.example` (if configured) to `.env`:

```env
# Optional External Service Integrations
VITE_APP_TITLE="Techfest 30th Edition — IIT Bombay"
```

> **Security Note:** Never commit `.env` files containing private credentials or secrets. `.env` is ignored by `.gitignore`.

---

## 📦 Build and Deployment

### Creating a Production Build
Compile and minify all code, styles, and assets:
```bash
npm run build
```
The output directory will be `dist/`, containing:
- `index.html`: Optimized HTML entry point
- `assets/index-[hash].css`: Purged Tailwind CSS bundle
- `assets/index-[hash].js`: Code-split, minified JavaScript bundle

### Deployment Platforms
The output in `dist/` is completely static and can be deployed to any modern hosting platform:
- **Vercel:** Auto-detects Vite; set Build Command to `npm run build` and Output Directory to `dist`.
- **Netlify:** Set Build command to `npm run build` and Publish directory to `dist`.
- **GitHub Pages:** Deploy the `dist` directory via GitHub Actions or the `gh-pages` branch.

---

## 📸 Screenshots

| Hero & Astrolabe | The Grand Arena |
| :---: | :---: |
| *[Screenshot: Celestial Astrolabe & Hero Landing]* | *[Screenshot: Competition Arena & Hovering Sigils]* |

| Workshop Laboratory | Ambassador Orrery |
| :---: | :---: |
| *[Screenshot: Technical Lab Pedestal & Data Nodes]* | *[Screenshot: Golden Celestial Globe & Astronomical Rings]* |

> *Screenshots can be placed in an `assets/screenshots/` directory and linked directly.*

---

## 🚦 Project Status

- **Status:** **Completed & Production Ready**
- **TypeScript Check:** ✅ 0 errors (`npm run typecheck`)
- **ESLint Validation:** ✅ 0 errors (`npm run lint`)
- **Production Build:** ✅ Successfully built with Vite 7 (`dist/`)
- **Browser Compatibility:** Tested on modern Chrome, Firefox, Safari, and Edge.

---

## 🤝 Contribution Guidelines

Contributions, improvements, and feedback are welcome!

1. **Fork the repository** to your own GitHub account.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/celestial-enhancement
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "feat: add orbital shader variation"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/celestial-enhancement
   ```
5. **Open a Pull Request** with a detailed description of your changes.

---

## 📄 License

Licensing terms have not yet been specified.  
All intellectual properties, festival theme trademarks, and symposium materials belong to **Techfest, Indian Institute of Technology Bombay**.

---

## 🌟 Acknowledgements

- **Techfest, IIT Bombay** — Asia's Largest Science & Technology Festival.
- **Three.js & Poimandres (pmndrs)** — For pioneering modern 3D WebGL tooling in React.
- **GreenSock (GSAP)** — For robust animation orchestration.
- **Darkroom Engineering** — For the Lenis smooth scroll library.
