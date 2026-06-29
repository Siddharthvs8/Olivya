// Oliviya Developers — run/screenshot driver.
//
// Drives the running Next.js site with a real Chrome (via playwright-core,
// no bundled-browser download) and captures the scroll-driven build/home
// animations at several depths. Lenis hijacks the wheel, so we scroll with
// real wheel events (page.mouse.wheel) — window.scrollTo is snapped back.
//
// Usage:
//   node .claude/skills/run-oliviya-developers/driver.mjs [url]
// Env:
//   OUT=<dir>     where screenshots land (default: <os tmp>/oliviya-shots)
//   PATH_     route path to drive (default: "/")
//   HEADED=1      run headed (visible window) instead of headless

import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] || process.env.URL || "http://localhost:4000";
// Accept "projects" or "/projects". A leading "/" is normalised in — pass it
// WITHOUT the slash under Git Bash, which mangles "/foo" into a Windows path.
const ROUTE = "/" + (process.env.PATH_ || "").replace(/^\/+/, "");
const OUT = process.env.OUT || join(tmpdir(), "oliviya-shots");
const HEADED = process.env.HEADED === "1";

// Find a system Chromium-family browser (no Playwright browser download).
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];
const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome/Edge found. Install one or set a CANDIDATE path.");
  process.exit(2);
}

mkdirSync(OUT, { recursive: true });

const shot = async (page, name) => {
  const file = join(OUT, name);
  await page.screenshot({ path: file });
  console.log("  📸", file);
};

// Wheel down until window.scrollY reaches `target` px, or progress stalls.
async function wheelTo(page, target) {
  for (let i = 0; i < 60; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y >= target - 4) return y;
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(120);
    const y2 = await page.evaluate(() => window.scrollY);
    if (Math.abs(y2 - y) < 1 && y2 > 0) return y2; // stalled at bottom
  }
  return page.evaluate(() => window.scrollY);
}

const main = async () => {
  console.log(`▶ launching ${executablePath.split(/[\\/]/).pop()} (headless=${!HEADED})`);
  const browser = await chromium.launch({ executablePath, headless: !HEADED });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const url = BASE.replace(/\/$/, "") + ROUTE;
  console.log("▶ goto", url);
  const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  if (!resp || !resp.ok()) throw new Error(`bad response: ${resp && resp.status()}`);

  // Sanity: is the Build Journey construction scene in the DOM? (homepage only)
  await page.waitForTimeout(800);
  const goldStrokes = await page.evaluate(
    () => document.querySelectorAll('path[stroke="url(#bj-gold)"]').length,
  );
  console.log(`▶ Build Journey gold strokes in DOM: ${goldStrokes}`);
  if (ROUTE === "/" && goldStrokes < 15) {
    throw new Error(`expected >=15 gold strokes, got ${goldStrokes}`);
  }

  const maxScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  console.log("▶ scrollable height:", maxScroll, "px");

  // Capture the home/build animations at increasing scroll depth.
  await shot(page, "00-hero.png");
  for (const frac of [0.25, 0.5, 0.75, 1]) {
    const y = await wheelTo(page, Math.round(maxScroll * frac));
    await page.waitForTimeout(900); // let the framer spring settle
    const pct = Math.round((y / maxScroll) * 100);
    await shot(page, `0${[0.25, 0.5, 0.75, 1].indexOf(frac) + 1}-scroll-${pct}pct.png`);
  }

  await browser.close();
  console.log("\n✅ OK — screenshots in", OUT);
};

main().catch((e) => {
  console.error("\n❌ driver failed:", e.message);
  process.exit(1);
});
