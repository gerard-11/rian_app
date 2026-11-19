// Genera los recursos de marca de la landing a partir del logo del CRM
// (src/assets/logo-rian.jpeg): logo con fondo transparente, versión para
// fondos oscuros, imagen para redes sociales (Open Graph) y favicon.
//
// Uso: pnpm brand-assets
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "src/assets/logo-rian.jpeg";
const OUT_DIR = "public/brand";

// Quita el fondo blanco ("color to alpha"): cada píxel se vuelve tan
// transparente como cerca esté del blanco, conservando su color real.
const toTransparent = (data, { lightInk = false } = {}) => {
  const out = Buffer.alloc((data.length / 3) * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = (255 - Math.min(r, g, b)) / 255;
    if (alpha < 0.04) continue;
    const unmix = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - alpha)) / alpha)));
    let [nr, ng, nb] = [unmix(r), unmix(g), unmix(b)];
    // Versión para fondo oscuro: el gris carbón del logo pasa a blanco.
    // El rojo se aclara para que tenga contraste sobre el fondo oscuro.
    if (lightInk) {
      if (Math.max(nr, ng, nb) - Math.min(nr, ng, nb) < 40) {
        [nr, ng, nb] = [255, 255, 255];
      } else {
        [nr, ng, nb] = [Math.min(255, Math.round(nr * 1.55)), Math.round(ng * 1.6), Math.round(nb * 1.6)];
      }
    }
    out[j] = nr;
    out[j + 1] = ng;
    out[j + 2] = nb;
    out[j + 3] = Math.round(alpha * 255);
  }
  return out;
};

const run = async () => {
  await mkdir(OUT_DIR, { recursive: true });
  const trimmed = await sharp(SOURCE).trim({ threshold: 20 }).toBuffer();
  const { data, info } = await sharp(trimmed)
    .resize({ width: 1200 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };

  const dark = sharp(toTransparent(data), raw);
  const light = sharp(toTransparent(data, { lightInk: true }), raw);

  await dark.clone().resize({ width: 480 }).webp({ quality: 88 }).toFile(`${OUT_DIR}/logo-rian.webp`);
  await dark.clone().resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(`${OUT_DIR}/logo-rian.png`);
  await light.clone().resize({ width: 480 }).webp({ quality: 88 }).toFile(`${OUT_DIR}/logo-rian-light.webp`);

  // Imagen para compartir en WhatsApp / Facebook (1200x630).
  const ogLogo = await dark.clone().resize({ width: 900 }).png().toBuffer();
  const ogBand = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#ffffff"/>
      <rect y="560" width="1200" height="70" fill="#2E302F"/>
      <rect y="552" width="1200" height="8" fill="#F20505"/>
      <text x="600" y="606" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff" text-anchor="middle">Llantas · Alineación y balanceo · Mecánica — San Matías Tlalancaleca, Puebla</text>
    </svg>`,
  );
  await sharp(ogBand)
    .composite([{ input: ogLogo, gravity: "center", top: 100, left: 150 }])
    .jpeg({ quality: 86 })
    .toFile(`${OUT_DIR}/og-image.jpg`);

  // Favicon: el ícono de la PWA ya trae la llanta del logo.
  await sharp("public/pwa-192.png").resize(48).png().toFile(`${OUT_DIR}/favicon-48.png`);

  console.log("Recursos de marca generados en", OUT_DIR);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
