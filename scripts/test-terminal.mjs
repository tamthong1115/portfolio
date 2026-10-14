import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

async function testTerminal() {
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
      console.error('PAGE ERROR CAUGHT:', err.stack || err.message);
      errors.push(err.stack || err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('CONSOLE ERROR CAUGHT:', msg.text());
        errors.push(msg.text());
      }
    });

    console.log(`Navigating to ${baseUrl} ...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Dismiss loader if present
    const skipBtn = await page.$('div.absolute button');
    if (skipBtn) {
      await skipBtn.click();
      await new Promise((r) => setTimeout(r, 700));
    }

    // 1. Click CLI button in HUD
    console.log('1. Clicking CLI button in HUD...');
    const cliBtn = await page.$('button[aria-label="Open Retro Terminal CLI"]');
    if (!cliBtn) throw new Error('CLI button not found in HUD');
    await cliBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // 2. Check modal is open
    const dialog = await page.$('div[role="dialog"][aria-label="Retro CRT Terminal Emulator"]');
    if (!dialog) throw new Error('Terminal dialog not visible');
    console.log('✓ Retro Terminal dialog opened successfully!');

    // 3. Test running `help`
    console.log('2. Running `help` command...');
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 300));

    // 4. Test running `theme amber`
    console.log('3. Running `theme amber` command...');
    await page.keyboard.type('theme amber');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 300));

    // 5. Test running `neofetch`
    console.log('4. Running `neofetch` command...');
    await page.keyboard.type('neofetch');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 300));

    // 6. Test running `matrix`
    console.log('5. Running `matrix` command...');
    await page.keyboard.type('matrix');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 800));

    // Check canvas exists in matrix mode
    const matrixCanvas = await page.$('canvas');
    if (!matrixCanvas) throw new Error('Matrix canvas not found');
    console.log('✓ Matrix digital rain canvas running!');

    // 7. Exit matrix mode with 'q'
    console.log("6. Exiting Matrix mode with 'q'...");
    await page.keyboard.press('q');
    await new Promise((r) => setTimeout(r, 300));

    // 8. Close terminal with Escape
    console.log('7. Closing terminal with Escape...');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    const dialogAfterClose = await page.$('div[role="dialog"]');
    if (dialogAfterClose) throw new Error('Terminal dialog failed to close on Escape');
    console.log('✓ Terminal dialog closed cleanly with Escape!');

    console.log(`Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.error('Errors found:', errors);
      throw new Error('Console errors encountered');
    }

    console.log('✓ ALL TERMINAL FUNCTIONALITY TESTS PASSED WITH 0 ERRORS!');
  } finally {
    await browser.close();
  }
}

testTerminal().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
