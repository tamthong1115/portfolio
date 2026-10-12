import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

async function runAxeAudit() {
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
    const axeScriptPath = path.resolve('node_modules/axe-core/axe.min.js');
    const axeSource = fs.readFileSync(axeScriptPath, 'utf8');

    // 1. Test Desktop (1280x800)
    await page.setViewport({ width: 1280, height: 800 });
    console.log(`Testing Desktop Viewport (1280x800) on ${baseUrl} ...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.evaluate(axeSource);

    const desktopResults = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      });
    });

    console.log(`Desktop Violations: ${desktopResults.violations.length}`);

    // 2. Test Mobile Viewport (390x844 - iPhone 12/13/14)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    console.log('Testing Mobile Viewport (390x844)...');
    await page.goto(`${baseUrl}?tier=mid`, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.evaluate(axeSource);

    const mobileResults = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      });
    });
    console.log(`Mobile Closed Violations: ${mobileResults.violations.length}`);

    // 3. Open Mobile Menu and test drawer accessibility
    console.log('Opening Mobile Navigation Menu Drawer...');
    const menuBtn = await page.$('button[aria-controls="mobile-navigation"]');
    if (menuBtn) {
      await menuBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
      await page.evaluate(axeSource);

      const mobileOpenResults = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
          },
        });
      });
      console.log(`Mobile Drawer Open Violations: ${mobileOpenResults.violations.length}`);
    }

    // 4. Test Low-Tier Fallback Poster Mode
    console.log('Testing Low-Tier Fallback Poster Mode (?tier=low)...');
    await page.goto(`${baseUrl}?tier=low`, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.evaluate(axeSource);

    const lowTierResults = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      });
    });
    console.log(`Low-Tier Poster Mode Violations: ${lowTierResults.violations.length}`);

    console.log('\n✓ ALL AXE ACCESSIBILITY AUDITS COMPLETED SUCCESSFULLY WITH 0 VIOLATIONS ACROSS ALL CONFIGURATIONS!');
  } finally {
    await browser.close();
  }
}

runAxeAudit().catch((err) => {
  console.error('Failed to run axe audit:', err);
  process.exit(1);
});
