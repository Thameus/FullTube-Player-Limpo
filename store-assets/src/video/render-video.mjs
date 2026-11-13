// Regenerates store-assets/video/*.mp4 and store-assets/demo*.gif from src/video/demo.html.
// Usage: node render-video.mjs [pt|en] [--keep]
// Needs: playwright-core, a Chromium and a full ffmpeg (override with env PW_CORE, CHROMIUM, FFMPEG).
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');           // store-assets
const PW = process.env.PW_CORE || 'C:/nvm4w/nodejs/node_modules/@playwright/cli/node_modules/playwright-core';
const CHROMIUM = process.env.CHROMIUM || 'C:/Users/mathe/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const FFMPEG = process.env.FFMPEG || 'D:/Dev/Projetos/Video-Automatico/tools/bin/ffmpeg.exe';
const { chromium } = createRequire(import.meta.url)(PW);
const FPS = 30, TOTAL = 25, N = FPS * TOTAL;
// GIF clips (seconds): scene 2 (click -> clean window) + scene 4 (theater mode)
const CLIPS = [[3.6, 9.6], [15.2, 20.8]];
const GIF_FPS = 15, GIF_W = 800;
const langs = process.argv.slice(2).filter(a => /^(pt|en)$/.test(a));
const keep = process.argv.includes('--keep');
const todo = langs.length ? langs : ['pt', 'en'];

const ff = (args) => { const r = spawnSync(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' }); if (r.status) throw new Error('ffmpeg failed: ' + args.join(' ')); };

mkdirSync(join(root, 'video'), { recursive: true });
const browser = await chromium.launch({ executablePath: CHROMIUM, headless: true });
for (const lang of todo) {
  const tmp = mkdtempSync(join(tmpdir(), 'fulltube-frames-'));
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(join(here, 'demo.html')).href + `?lang=${lang}&capture=1`);
    await page.evaluate(() => document.fonts.ready);
    console.log(`[${lang}] capturing ${N} frames...`);
    for (let i = 0; i < N; i++) {
      await page.evaluate(ms => window.seek(ms), (i / FPS) * 1000);
      await page.screenshot({ path: join(tmp, `f${String(i).padStart(4, '0')}.png`) });
    }
    await page.close();
    const inp = ['-framerate', String(FPS), '-i', join(tmp, 'f%04d.png')];
    // MP4
    ff([...inp, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS),
        '-movflags', '+faststart', '-an', join(root, 'video', `fulltube-demo-${lang}.mp4`)]);
    // GIF
    const parts = CLIPS.map(([a, b], i) => `[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,fps=${GIF_FPS}[c${i}]`).join(';');
    const cat = `${CLIPS.map((_, i) => `[c${i}]`).join('')}concat=n=${CLIPS.length}:v=1:a=0,scale=${GIF_W}:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
    ff([...inp, '-filter_complex', `${parts};${cat}`, '-loop', '0', join(root, lang === 'pt' ? 'demo.gif' : 'demo-en.gif')]);
    console.log(`[${lang}] done`);
  } finally {
    if (!keep) rmSync(tmp, { recursive: true, force: true }); else console.log('frames kept in', tmp);
  }
}
await browser.close();
