import fs from "node:fs/promises";
import { geoPath, geoEquirectangular, geoOrthographic } from "d3-geo";
import sharp from "sharp";
const land = JSON.parse(
  await fs.readFile("public/assets/land.geojson", "utf8"),
);
const texture = geoPath(
  geoEquirectangular()
    .scale(2048 / (2 * Math.PI))
    .translate([1024, 512]),
);
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024"><rect width="2048" height="1024" fill="#a7cad9"/><path d="${texture(land)}" fill="#c2cdb9" stroke="#d5dbca" stroke-width="1.5"/></svg>`,
  ),
)
  .png()
  .toFile("public/assets/earth-texture.png");
const projection = geoOrthographic()
  .rotate([-90, -55])
  .scale(355)
  .translate([400, 400]);
const path = geoPath(projection);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><radialGradient id="o" cx="35%" cy="25%" r="80%"><stop stop-color="#d4e7ee"/><stop offset=".65" stop-color="#a7cad9"/><stop offset="1" stop-color="#6e98af"/></radialGradient><radialGradient id="s" cx="30%" cy="20%" r="85%"><stop stop-color="#fff" stop-opacity=".3"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#264d67" stop-opacity=".38"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="9"/></filter></defs><circle cx="400" cy="400" r="359" fill="#baddeb" opacity=".8" filter="url(#glow)"/><circle cx="400" cy="400" r="355" fill="url(#o)"/><path d="${path(land)}" fill="#c2cdb9" stroke="#d5dbca" stroke-width=".6"/><circle cx="400" cy="400" r="355" fill="url(#s)"/></svg>`;
await sharp(Buffer.from(svg))
  .webp({ quality: 90 })
  .toFile("public/assets/earth-static.webp");
