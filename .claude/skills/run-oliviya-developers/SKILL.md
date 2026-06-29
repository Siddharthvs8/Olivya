---
name: run-oliviya-developers
description: Build, run, and screenshot the Oliviya Developers site (Next.js 15). Use when asked to run/start/serve the dev server, drive the homepage, verify the scroll-driven build/home animations, or take screenshots of the site.
---

# Run Oliviya Developers

A Next.js 15 (App Router) marketing site — dark + gold luxury theme, Lenis
smooth scroll, framer-motion. The homepage's signature scroll effects are
**LogoForge** ([src/components/sections/LogoForge.tsx](../../../src/components/sections/LogoForge.tsx))
— the OLIVIYA wordmark bursts into golden grains that resolve into a home — and
**BuildJourney** ([src/components/sections/BuildJourney.tsx](../../../src/components/sections/BuildJourney.tsx)),
a pinned, scroll-scrubbed sequence where the camera follows an apartment rising
floor by floor through every construction stage (excavator, crane, mixer, pump).

The app is driven headlessly with **`driver.mjs`** — a `playwright-core` script
that launches the system Chrome (no bundled-browser download), scrolls the page
with real wheel events, and screenshots the animations at several depths. That
driver is the agent path; `npm run dev` is the human path.

> Paths below are relative to the repo root (the `<unit>`). The driver lives at
> `.claude/skills/run-oliviya-developers/driver.mjs`.

## Prerequisites

- **Node** (verified on v25, npm v11) and a **Chromium-family browser**. On this
  Windows host Chrome was at `C:/Program Files/Google/Chrome/Application/chrome.exe`
  (Edge is the fallback); the driver auto-detects both.
- **No database needed to run locally.** `src/lib/store.ts` falls back to a
  seeded local JSON file (`.data/`) when `DATABASE_URL` is unset, so the site
  serves real content out of the box. `.env.local` is already present.

## Build / setup

```bash
npm install
npm install -D playwright-core   # browser driver for the screenshot harness
```

## Run (agent path) — driver

Start the dev server (leave it running in the background), then drive it:

```bash
npm run dev          # serves on http://localhost:4000
```

```bash
node .claude/skills/run-oliviya-developers/driver.mjs
```

What it does, verified this session:
- launches `chrome.exe` headless, navigates to `http://localhost:4000/`
- asserts the BuildJourney construction scene is mounted (**98**
  `path[stroke="url(#bj-gold)"]` elements; it errors if `< 15`)
- wheels down to 0 / 25 / 50 / 75 / 100 % scroll, letting the framer spring
  settle, and writes 5 PNGs:

```
▶ Build Journey gold strokes in DOM: 98
▶ scrollable height: 15862 px
  📸 .../oliviya-shots/00-hero.png
  📸 .../oliviya-shots/01-scroll-28pct.png
  📸 .../oliviya-shots/02-scroll-50pct.png
  📸 .../oliviya-shots/03-scroll-76pct.png
  📸 .../oliviya-shots/04-scroll-100pct.png
✅ OK — screenshots in C:\Users\user\AppData\Local\Temp\oliviya-shots
```

Screenshots default to `<os-temp>/oliviya-shots`. Override the destination and
options with env vars:

```bash
OUT=./shots node .claude/skills/run-oliviya-developers/driver.mjs        # custom dir
HEADED=1 node .claude/skills/run-oliviya-developers/driver.mjs            # visible window
PATH_=projects node .claude/skills/run-oliviya-developers/driver.mjs      # drive /projects
```

The first positional arg overrides the base URL
(`node driver.mjs http://localhost:4000`). Pass `PATH_` **without** a leading
slash (`PATH_=projects`, not `/projects`) — Git Bash mangles `/foo` values into
Windows paths; the driver normalises the slash back in. The gold-stroke
assertion is skipped off the homepage, since BuildJourney only renders on `/`.

## Run (human path)

```bash
npm run dev
```

Open http://localhost:4000 and scroll the homepage slowly. Just past the hero,
LogoForge turns the wordmark into golden grains and a home; further down, the
pinned **The Build** section scrubs an apartment up through every construction
stage. Useless headless; use the driver for automated/visual checks.

## Gotchas (battle scars from this session)

- **Lenis hijacks the wheel — `window.scrollTo()` gets snapped back.** Smooth
  scroll is driven by Lenis ([src/components/providers/SmoothScroll.tsx](../../../src/components/providers/SmoothScroll.tsx)),
  whose rAF loop re-asserts its own target each frame. The driver scrolls with
  `page.mouse.wheel(0, 700)` (real wheel events Lenis consumes) and polls
  `window.scrollY`, not `scrollTo`. This is why captured depths land at ~33/51/82/100 %
  rather than exact quarters.
- **BuildJourney is a pinned, scroll-scrubbed section** (`h-[560vh]` with a
  sticky stage). Its progress is a framer spring over the section's own scroll,
  so it's most legible mid-section; the page is long (~16k px) because of it.
- **The scroll animations are homepage-only** — don't expect `bj-gold` strokes
  on `/about`, `/services`, etc.
- **Reduced motion shows finished states statically.** With
  `prefers-reduced-motion: reduce`, Lenis is disabled and BuildJourney renders
  the completed tower (lit) without the progressive draw or machines. Don't
  emulate reduced motion if you want to capture the construction sequence.
- **Port is 4000, not 3000** (`next dev -p 4000` in package.json).
- **`playwright-core` ships no browser** — it must launch a system Chrome/Edge
  via `executablePath`. `npx playwright install` is *not* required and won't help.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `No Chrome/Edge found` | Install Chrome or Edge, or add its path to `CANDIDATES` in `driver.mjs`. |
| `bad response: undefined` / ECONNREFUSED | Dev server isn't up. Run `npm run dev` first; confirm `curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/` prints `200`. |
| `expected >=15 gold strokes, got 0` | You pointed the driver at a non-homepage route, or the page didn't hydrate — check the dev-server log compiled `/` without errors. |
| `Cannot find package 'playwright-core'` | Run `npm install -D playwright-core`. |
| Screenshots look dark/empty between sections | Expected: the page is long; the build/grain animations sit mid-page. Inspect the mid-scroll shots (50–76 %), not the very top/bottom. |
```
