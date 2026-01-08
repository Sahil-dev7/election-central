import fs from "fs";
import { chromium } from "playwright";

(async () => {
  const url = "https://sahil-dev7.github.io/election-central/";
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const logs = [];
  page.on("console", (msg) => {
    logs.push({ type: "console", level: msg.type(), text: msg.text() });
  });
  page.on("pageerror", (err) => {
    logs.push({ type: "pageerror", text: String(err) });
  });
  page.on("requestfailed", (req) => {
    logs.push({ type: "requestfailed", url: req.url(), failure: req.failure()?.errorText });
  });

  try {
    const resp = await page.goto(url, { waitUntil: "networkidle" , timeout: 30000});
    const status = resp?.status() ?? 0;
    const content = await page.content();
    await page.screenshot({ path: "/tmp/site-screenshot.png", fullPage: true });
    fs.writeFileSync("/tmp/site-content.html", content, "utf8");
    fs.writeFileSync("/tmp/site-logs.json", JSON.stringify({ status, logs }, null, 2), "utf8");
    console.log("STATUS:", status);
    console.log("WROTE:", "/tmp/site-screenshot.png", "/tmp/site-content.html", "/tmp/site-logs.json");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await browser.close();
  }
})();
