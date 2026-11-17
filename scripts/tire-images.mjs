#!/usr/bin/env node
// Descarga y optimiza las imágenes de los modelos de llanta Torque.
// Cada modelo puede tener varias imágenes (galería).
//
// Fuentes:
//   1. scripts/tire-images.sources.json -> { "tq021": ["https://...", "ruta/local.jpg"] }
//      (también acepta un string si solo hay una)
//   2. scripts/tire-images-raw/<modelo>.jpg, <modelo>@2.jpg, <modelo>@3.jpg... (fotos propias;
//      reemplazan a la imagen de la misma posición en sources.json)
//
// Salida:
//   public/tires/torque/<modelo>.webp, <modelo>-2.webp, ... (máx 800px, < 80 KB si se puede)
//   src/features/tires/tireImageManifest.json -> { "tq021": ["/tires/torque/tq021.webp", ...] }
//
// Uso:
//   pnpm tire-images            # genera solo las imágenes que faltan
//   pnpm tire-images --force    # vuelve a generar todas

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_FILE = path.join(ROOT, "scripts/tire-images.sources.json");
const RAW_DIR = path.join(ROOT, "scripts/tire-images-raw");
const OUT_DIR = path.join(ROOT, "public/tires/torque");
const PUBLIC_PREFIX = "/tires/torque";
const MANIFEST_FILE = path.join(ROOT, "src/features/tires/tireImageManifest.json");

const MAX_SIZE = 800;
const TARGET_BYTES = 80 * 1024;
const QUALITIES = [82, 74, 66, 58, 50];
const RAW_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const force = process.argv.includes("--force");

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const outputName = (model, index) => (index === 0 ? `${model}.webp` : `${model}-${index + 1}.webp`);

async function loadSource(source) {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source, {
      headers: { "User-Agent": "Mozilla/5.0 (tire-images script)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
  return readFile(path.resolve(ROOT, source));
}

// Redimensiona a WebP bajando la calidad hasta quedar bajo TARGET_BYTES.
// Si la imagen ya es un WebP chico, se deja tal cual para no recomprimirla.
async function optimize(input) {
  const meta = await sharp(input).metadata();
  const fits = (meta.width ?? 0) <= MAX_SIZE && (meta.height ?? 0) <= MAX_SIZE;
  if (meta.format === "webp" && fits && input.length <= TARGET_BYTES) return input;

  let output;
  for (const quality of QUALITIES) {
    output = await sharp(input)
      .rotate()
      .resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .webp({ quality, effort: 6 })
      .toBuffer();
    if (output.length <= TARGET_BYTES) break;
  }
  return output;
}

// { modelo: [fuente1, fuente2, ...] }
async function collectSources() {
  const sources = new Map();

  if (existsSync(SOURCES_FILE)) {
    const json = JSON.parse(await readFile(SOURCES_FILE, "utf8"));
    for (const [model, value] of Object.entries(json)) {
      const list = (Array.isArray(value) ? value : [value])
        .filter((source) => typeof source === "string" && source.trim())
        .map((source) => source.trim());
      sources.set(model.toLowerCase(), list);
    }
  }

  if (existsSync(RAW_DIR)) {
    for (const file of await readdir(RAW_DIR)) {
      const ext = path.extname(file).toLowerCase();
      if (!RAW_EXTENSIONS.has(ext)) continue;
      const [, model, position] = path.basename(file, ext).toLowerCase().match(/^(.+?)(?:@(\d+))?$/);
      const list = sources.get(model) ?? [];
      list[position ? Number(position) - 1 : 0] = path.join(RAW_DIR, file);
      sources.set(model, list);
    }
  }

  return sources;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const sources = await collectSources();
  const manifest = {};
  let failed = 0;

  for (const [model, list] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
    manifest[model] = [];

    for (const [index, source] of list.entries()) {
      if (!source) continue;
      const name = outputName(model, index);
      const target = path.join(OUT_DIR, name);

      if (force || !existsSync(target)) {
        try {
          const input = await loadSource(source);
          const output = await optimize(input);
          await writeFile(target, output);
          console.log(`✓ ${name}: ${kb(input.length)} -> ${kb(output.length)}`);
        } catch (error) {
          failed += 1;
          console.error(`✗ ${name}: ${error.message} (${source})`);
          continue;
        }
      }

      manifest[model].push(`${PUBLIC_PREFIX}/${name}`);
    }

    if (!manifest[model].length) {
      delete manifest[model];
      console.log(`· ${model}: sin imagen todavía`);
    }
  }

  await writeFile(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
  const total = Object.values(manifest).reduce((sum, images) => sum + images.length, 0);
  console.log(`\nManifest: ${Object.keys(manifest).length} modelos, ${total} imágenes`);
  if (failed) process.exitCode = 1;
}

main();
