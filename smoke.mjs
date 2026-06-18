import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
const errors = [];
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

const dlg = () => page.evaluate(() => document.querySelector('[role="dialog"]')?.textContent ?? "");
const heroText = () => page.evaluate(() => document.querySelector("section#hero h1")?.textContent ?? "");

await page.goto("http://localhost:5173/", { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(900);
const input = () => page.locator("input").first();
const run = async (cmd) => { await input().click(); await input().fill(cmd); await input().press("Enter"); await page.waitForTimeout(250); };

// Terminal English by default
await run("help");
const helpEn = await dlg();
console.log("help EN has ptbr/en:", helpEn.includes("ptbr") && helpEn.includes("Switch to Portuguese") && helpEn.includes("Switch to English"));

// ptbr → Portuguese
await run("ptbr");
console.log("ptbr confirm:", (await dlg()).includes("Português (BR)"));
await run("help");
console.log("help now PT:", (await dlg()).includes("Comandos disponíveis"));
await run("about");
console.log("about PT:", (await dlg()).includes("Engenheiro de Dados"));

// en → back to English
await run("en");
console.log("en confirm:", (await dlg()).includes("English"));

// Go to site (currently EN)
await run("site");
await page.waitForTimeout(5200);
console.log("hero EN:", (await heroText()).includes("scales"));
const langBtn = page.locator('[aria-label="Switch language"]');
console.log("header lang button:", await langBtn.isVisible());

// Toggle to PT via header button
await langBtn.click();
await page.waitForTimeout(500);
console.log("hero PT after toggle:", (await heroText()).includes("escala"));
await page.evaluate(() => document.querySelector('[aria-label="Mudar idioma"]') ? true : false)
  .then((v) => console.log("button relabeled PT:", v));

await page.screenshot({ path: "i18n-site-pt.png" });
console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
await browser.close();
