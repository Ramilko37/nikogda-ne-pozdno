// Rebuild the exact social card from local fonts and the approved Earth image.
// Playwright is already a dev dependency. No external asset/font requests.
const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const data = (file, mime) =>
  `data:${mime};base64,${fs.readFileSync(path.join(root, file)).toString("base64")}`;
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    await page.setContent(`<!doctype html><html lang="ru"><meta charset="utf-8"><style>
      @font-face{font-family:Source;src:url('${data("node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-cyrillic-standard-normal.woff2", "font/woff2")}');font-weight:200 900}
      @font-face{font-family:Golos;src:url('${data("node_modules/@fontsource-variable/golos-text/files/golos-text-cyrillic-wght-normal.woff2", "font/woff2")}');font-weight:400 900}
      *{box-sizing:border-box}body{margin:0;background:#fafaf7;color:#253746;font-family:Golos,Arial,sans-serif;overflow:hidden}.earth{position:absolute;width:760px;height:760px;right:-160px;top:25px}.copy{position:relative;padding:58px 0 0 60px;width:650px}p{font-size:24px;margin:0 0 54px;color:#576976}h1{font:400 78px/1.05 Source,Georgia,serif;margin:0 0 32px}h1 span{display:block}h2{font:400 35px/1.3 Source,Georgia,serif;color:#456b84;margin:0 0 54px}.status{font-size:21px;margin:0}
    </style><img class="earth" src="${data("public/assets/earth-static.webp", "image/webp")}" alt=""><div class="copy"><p>Благотворительный фонд</p><h1>Никогда<span>не поздно</span></h1><h2>изменить жизнь.</h2><p class="status">Проект программы на 2027 год</p></div></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("img").evaluate((img) => img.decode());
    await page.screenshot({
      path: path.join(root, "public/assets/social-cover.png"),
    });
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
