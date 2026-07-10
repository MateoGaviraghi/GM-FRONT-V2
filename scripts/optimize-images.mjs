/**
 * Optimización in-place de public/images — conserva nombres y rutas.
 * - JPG/WebP: resize a máx 1920px de ancho + re-encode (mozjpeg q78 / webp q80)
 * - PNG: resize + cuantización de paleta (q82) — respeta transparencia
 * - Renders del marquee del home ("LOGOS VEHICULOS HOME"): máx 800px
 * - Solo sobreescribe si el ahorro es >= 10%
 * Rollback: git checkout -- public/images
 */
import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "public/images";
const THRESHOLD = 200 * 1024; // procesar solo > 200KB
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const results = [];
let beforeTotal = 0;
let afterTotal = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;

  const { size } = await stat(file);
  if (size < THRESHOLD) continue;

  const maxW = file.includes("LOGOS VEHICULOS HOME") ? 800 : 1920;

  try {
    const input = await readFile(file);
    const meta = await sharp(input).metadata();

    let pipe = sharp(input).rotate();
    if ((meta.width ?? 0) > maxW) {
      pipe = pipe.resize({ width: maxW, withoutEnlargement: true });
    }

    if (ext === ".jpg" || ext === ".jpeg") {
      pipe = pipe.jpeg({ quality: 78, mozjpeg: true });
    } else if (ext === ".png") {
      pipe = pipe.png({ palette: true, quality: 82, compressionLevel: 9 });
    } else {
      pipe = pipe.webp({ quality: 80 });
    }

    const out = await pipe.toBuffer();

    if (out.length < size * 0.9) {
      await writeFile(file, out);
      beforeTotal += size;
      afterTotal += out.length;
      results.push({ file, before: size, after: out.length });
    }
  } catch (err) {
    console.error(`SKIP (error): ${file} — ${err.message}`);
  }
}

results.sort((a, b) => b.before - a.before);
const mb = (n) => (n / 1024 / 1024).toFixed(2);

for (const r of results.slice(0, 20)) {
  console.log(
    `${mb(r.before)}MB -> ${mb(r.after)}MB  ${path.relative(ROOT, r.file)}`
  );
}
console.log(`\nArchivos optimizados: ${results.length}`);
console.log(`TOTAL: ${mb(beforeTotal)}MB -> ${mb(afterTotal)}MB (ahorro ${mb(beforeTotal - afterTotal)}MB)`);
