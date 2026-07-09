import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = CANDIDATES.find((p) => existsSync(p));
const OUT = process.argv[2] || "./scratch-shots";

const browser = await chromium.launch({ executablePath, headless: true });

for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
  await page.goto("http://localhost:4000/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2600); // let entrance animation settle

  const info = await page.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim().slice(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
    };
    const header = document.querySelector("header");
    const logo = header?.querySelector("a[aria-label]");
    const eyebrow = document.querySelector("section .eyebrow");
    const h1 = document.querySelector("section h1");
    return {
      viewport: window.innerWidth,
      header: pick(header),
      logo: pick(logo),
      eyebrow: pick(eyebrow),
      h1: pick(h1),
    };
  });
  console.log(JSON.stringify(info, null, 2));

  await page.screenshot({ path: `${OUT}/hero-${w}.png` });
  console.log("  📸", `${OUT}/hero-${w}.png`);
  await page.close();
}

await browser.close();
