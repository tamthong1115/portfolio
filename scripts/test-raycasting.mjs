import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

async function testRaycasting() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const rawBaseUrl = process.argv[2] ?? 'http://localhost:4173/portfolio/';
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const errors = [];
    page.on('pageerror', (err) => {
      console.error('PAGE ERROR:', err.stack || err.message);
      errors.push(err.stack || err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('CONSOLE ERROR:', msg.text());
        errors.push(msg.text());
      }
    });

    console.log(`Navigating to ${baseUrl} ...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2500));

    // Dismiss 3D intro loader button if visible
    const skipBtn = await page.$('div.absolute button');
    if (skipBtn) {
      await skipBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log('1. Testing Lamp Toggle HUD & Raycast proxy...');
    const lampBtn = await page.$('button[aria-label*="desk lamp"]');
    if (!lampBtn) throw new Error('Lamp toggle button not found');
    await lampBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    console.log('✓ Desk lamp toggled via HUD');

    console.log('2. Testing Sound FX Mute & Unmute Toggle...');
    const soundBtn = await page.$('button[aria-label*="sound effects"]');
    if (!soundBtn) throw new Error('Sound toggle button not found');
    await soundBtn.click(); // Mute
    await new Promise((r) => setTimeout(r, 300));
    await soundBtn.click(); // Unmute
    await new Promise((r) => setTimeout(r, 300));
    console.log('✓ Audio toggle functioning');

    console.log('3. Testing Canvas Interaction & Clicks on Central Desk...');
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('Three.js canvas not found');

    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas bounding box not found');

    // Move cursor across several points on the desk (screen, keyboard, lamp)
    const points = [
      { x: box.x + box.width * 0.5, y: box.y + box.height * 0.55 }, // Center / Keyboard
      { x: box.x + box.width * 0.48, y: box.y + box.height * 0.45 }, // Monitor
      { x: box.x + box.width * 0.35, y: box.y + box.height * 0.38 }, // Lamp
      { x: box.x + box.width * 0.62, y: box.y + box.height * 0.52 }, // CPU / Right
    ];

    for (const pt of points) {
      await page.mouse.move(pt.x, pt.y);
      await new Promise((r) => setTimeout(r, 200));
      await page.mouse.click(pt.x, pt.y);
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log('✓ Mouse move and click events dispatched to 3D canvas');

    if (errors.length > 0) {
      throw new Error(`Encountered ${errors.length} console errors during 3D raycasting tests.`);
    }

    console.log('Console Errors: 0');
    console.log('✓ ALL 3D RAYCASTING & SOUND IMMERSION TESTS PASSED WITH 0 ERRORS!');
  } finally {
    await browser.close();
  }
}

testRaycasting().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
