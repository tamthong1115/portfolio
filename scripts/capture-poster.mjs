import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

async function capturePoster() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Using browser: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

    console.log('Navigating to http://localhost:4173/?tier=high ...');
    await page.goto('http://localhost:4173/?tier=high', { waitUntil: 'networkidle2' });

    // Wait for the 3D scene and loader to settle
    console.log('Waiting for 3D model to load and render...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Hide any HTML overlays to capture only the pristine background canvas
    await page.evaluate(() => {
      const main = document.getElementById('main-content');
      if (main) main.style.opacity = '0';
      const header = document.querySelector('header');
      if (header) header.style.opacity = '0';
      const footer = document.querySelector('footer');
      if (footer) footer.style.opacity = '0';
      const loader = document.querySelector('[role="status"]');
      if (loader) loader.style.display = 'none';
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvasEl = await page.$('canvas');
    if (!canvasEl) {
      throw new Error('Canvas element not found on page');
    }

    const tempPng = path.resolve('temp-poster.png');
    await canvasEl.screenshot({ path: tempPng });
    console.log('✓ Captured canvas screenshot to temp-poster.png');

    const destWebp = path.resolve('src/assets/poster-desk.webp');
    await sharp(tempPng)
      .resize({ width: 1600, height: 1000, fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(destWebp);

    console.log(`✓ Saved optimized poster to ${destWebp}`);

    // Clean up temporary PNG
    if (fs.existsSync(tempPng)) {
      fs.unlinkSync(tempPng);
    }
  } finally {
    await browser.close();
  }
}

capturePoster().catch((err) => {
  console.error('Failed to capture poster:', err);
  process.exit(1);
});
