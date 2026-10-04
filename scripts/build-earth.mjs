/** Prepare NASA surface and Solar System Scope cloud maps. Never generates the retired two-colour globe. */
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
const sources = {
  'surface-topo-21600': 'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x21600x10800.jpg',
  '8k_earth_clouds': 'https://www.solarsystemscope.com/textures/download/8k_earth_clouds.jpg',
};
await fs.mkdir('.earth-cache', { recursive: true });
await fs.mkdir('public/assets/earth', { recursive: true });
for (const [key, url] of Object.entries(sources)) {
  const path = `.earth-cache/${key}.jpg`;
  try { await fs.access(path); } catch { execFileSync('curl', ['-fLsS', '--max-time', '120', url, '-o', path]); }
  const metadata = await sharp(path).metadata();
  if (metadata.width / metadata.height !== 2) throw new Error(`${key}: expected 2:1 map`);
}
// Blue Marble's base map ocean is nearly black. Lift only deep ocean pixels
// towards a restrained natural blue; retain the photographed land detail.
const { data, info } = await sharp('.earth-cache/surface-topo-21600.jpg').resize(8192, 4096).removeAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 3) {
  const r=data[i], g=data[i+1], b=data[i+2];
  if (b > r * 1.4 && b > g * 1.3 && r < 18 && g < 25) {
    const mix = Math.max(0, 1 - Math.max(r / 18, g / 25));
    data[i] = Math.round(r*(1-mix)+31*mix);
    data[i+1] = Math.round(g*(1-mix)+75*mix);
    data[i+2] = Math.round(b*(1-mix)+103*mix);
  }
}
for (const width of [8192, 4096, 2048]) {
  await sharp(data,{raw:info}).resize(width,width/2).webp({quality:92, effort:5}).toFile(`public/assets/earth/surface-${width}.webp`);
}
for (const width of [4096, 2048]) {
  await sharp('.earth-cache/8k_earth_clouds.jpg').resize(width,width/2).grayscale().webp({quality:90, effort:5}).toFile(`public/assets/earth/clouds-${width}.webp`);
}
console.log('High-resolution surface and cloud maps prepared. Static WebP is retained; regenerate with npm run assets:render against the running app.');
