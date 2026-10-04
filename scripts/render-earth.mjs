/** Capture the actual paused 3D Earth, with the same camera, lights and materials. */
import { chromium } from 'playwright';
import sharp from 'sharp';
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const url = new URL(process.env.HERO_CAPTURE_URL || 'http://127.0.0.1:3000/');
  url.searchParams.set('earth-capture', '');
  await page.goto(url.href);
  await page.waitForSelector('[data-renderer="webgl"]', { timeout: 30000 });
  await page.addStyleTag({ content: '.earth-stage { width: 1200px !important; height: 1200px !important; }' });
  await page.waitForFunction(() => document.querySelector('canvas')?.width >= 1200);
  // Allow resize invalidation to paint into the preserved framebuffer.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const png = await page.locator('canvas').evaluate(canvas => canvas.toDataURL('image/png'));
  await sharp(Buffer.from(png.split(',')[1], 'base64')).resize(1200, 1200).webp({ quality: 88 }).toFile('public/assets/earth-static.webp');
  console.log('Saved static render from the production 3D scene: public/assets/earth-static.webp');
} finally { await browser.close(); }
