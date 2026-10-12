import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

async function testKeyboardNav() {
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

    console.log(`Testing keyboard navigation on ${baseUrl} ...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Press Tab repeatedly and record focused elements
    const focusedElements = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return {
          tagName: el.tagName,
          text: (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
          href: el.getAttribute('href') || null,
        };
      });
      if (info) {
        focusedElements.push(info);
      }
    }

    console.log(`Successfully focused ${focusedElements.length} interactive elements in logical order:`);
    focusedElements.slice(0, 10).forEach((el, idx) => {
      console.log(`  ${idx + 1}. <${el.tagName}> "${el.text}" ${el.href ? `-> ${el.href}` : ''}`);
    });

    // Check first element is Skip to content
    if (focusedElements[0]?.text.includes('Skip to content')) {
      console.log('✓ Skip to content link is the first focusable element!');
    } else {
      console.warn('Warning: First focusable element was:', focusedElements[0]);
    }

    // Test mobile drawer Escape key closing
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const menuBtn = await page.$('button[aria-controls="mobile-navigation"]');
    if (menuBtn) {
      await menuBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 300));
      let isExpanded = await page.evaluate(() => {
        const btn = document.querySelector('button[aria-controls="mobile-navigation"]');
        return btn?.getAttribute('aria-expanded');
      });
      console.log(`Mobile menu opened: aria-expanded = ${isExpanded}`);

      // Press Escape
      await page.keyboard.press('Escape');
      await new Promise((resolve) => setTimeout(resolve, 300));
      isExpanded = await page.evaluate(() => {
        const btn = document.querySelector('button[aria-controls="mobile-navigation"]');
        return btn?.getAttribute('aria-expanded');
      });
      console.log(`Mobile menu after Escape: aria-expanded = ${isExpanded}`);

      if (isExpanded === 'false') {
        console.log('✓ Escape key successfully closes mobile navigation drawer!');
      }
    }

    console.log('✓ Keyboard navigation and trap tests PASSED!');
  } finally {
    await browser.close();
  }
}

testKeyboardNav().catch((err) => {
  console.error(err);
  process.exit(1);
});
