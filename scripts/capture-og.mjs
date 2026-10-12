import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // Retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server did not start at ${url} within ${timeoutMs}ms`);
}

async function captureOg() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Starting preview server...`);
  const previewProcess = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    stdio: 'ignore',
    shell: true,
  });

  const previewUrl = 'http://localhost:4173/portfolio/';

  try {
    await waitForServer(previewUrl);
    console.log(`Preview server ready at ${previewUrl}`);

    console.log(`Launching browser: ${executablePath}`);
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
    });

    try {
      const page = await browser.newPage();
      // Set 1200x630 (Standard OG image aspect ratio)
      await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

      console.log(`Navigating to ${previewUrl}?tier=high ...`);
      await page.goto(`${previewUrl}?tier=high`, { waitUntil: 'networkidle2' });

      // Wait for 3D model and loader to finish and settle
      console.log('Waiting for 3D desk scene to render...');
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // Dismiss loader if still visible
      await page.evaluate(() => {
        const loader = document.querySelector('[role="status"]');
        if (loader) loader.style.display = 'none';
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const tempPng = path.resolve('temp-og.png');
      await page.screenshot({ path: tempPng });
      console.log('✓ Captured full-page screenshot');

      const destOg = path.resolve('public/og.png');
      await sharp(tempPng)
        .resize({ width: 1200, height: 630, fit: 'cover' })
        .png({ compressionLevel: 9 })
        .toFile(destOg);

      console.log(`✓ Saved optimized 1200x630 OG image to ${destOg}`);

      if (fs.existsSync(tempPng)) {
        fs.unlinkSync(tempPng);
      }
    } finally {
      await browser.close();
    }
  } finally {
    previewProcess.kill();
    // On Windows, kill tree
    try {
      spawn('taskkill', ['/pid', previewProcess.pid.toString(), '/f', '/t']);
    } catch {
      // ignore
    }
  }
}

captureOg().catch((err) => {
  console.error('Failed to capture OG image:', err);
  process.exit(1);
});
