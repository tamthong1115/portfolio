import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import fs from 'node:fs';

const BASE = 'https://tamthong1115.github.io/portfolio';

async function testEndpoints() {
  console.log('\n--- 1. Testing Live Asset HTTP Endpoints ---');
  const urls = [
    `${BASE}/`,
    `${BASE}/og.png`,
    `${BASE}/favicon.svg`,
    `${BASE}/sitemap.xml`,
    `${BASE}/robots.txt`,
    `${BASE}/draco/draco_decoder.wasm`,
    `${BASE}/draco/draco_wasm_wrapper.js`,
  ];

  const results = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const status = res.status;
      const type = res.headers.get('content-type') || 'unknown';
      console.log(`[${status === 200 ? 'OK' : 'FAIL'}] ${status} ${type.padEnd(30)} ${url}`);
      results.push({ url, status, type, ok: status === 200 });
    } catch (err) {
      console.error(`[ERR] ${url}:`, err.message);
      results.push({ url, status: 0, ok: false });
    }
  }
  return results;
}

async function testHtmlMetadata() {
  console.log('\n--- 2. Testing Live HTML Metadata ---');
  const res = await fetch(`${BASE}/`);
  const html = await res.text();

  const checks = [
    { name: 'og:title', regex: /<meta\s+property="og:title"\s+content="([^"]+)"/i },
    { name: 'og:description', regex: /<meta\s+property="og:description"\s+content="([^"]+)"/i },
    { name: 'og:image', regex: /<meta\s+property="og:image"\s+content="(https:\/\/[^"]+)"/i },
    { name: 'twitter:card', regex: /<meta\s+name="twitter:card"\s+content="([^"]+)"/i },
    { name: 'canonical', regex: /<link\s+rel="canonical"\s+href="(https:\/\/[^"]+)"/i },
  ];

  const metaResults = [];
  for (const check of checks) {
    const match = html.match(check.regex);
    if (match) {
      console.log(`✓ ${check.name.padEnd(15)} : ${match[1]}`);
      metaResults.push({ name: check.name, value: match[1], ok: true });
    } else {
      console.error(`✗ ${check.name.padEnd(15)} : NOT FOUND or NOT ABSOLUTE`);
      metaResults.push({ name: check.name, value: null, ok: false });
    }
  }
  return metaResults;
}

async function testOgImageDimensions() {
  console.log('\n--- 3. Testing Live OG Image Dimensions ---');
  const res = await fetch(`${BASE}/og.png`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buffer).metadata();
  console.log(`og.png dimensions: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${buffer.length} bytes`);
  const ok = meta.width === 1200 && meta.height === 630;
  console.log(ok ? '✓ Correct 1200x630 dimensions' : '✗ Dimensions mismatch!');
  return { ...meta, size: buffer.length, ok };
}

async function testLiveConsoleAndNetwork() {
  console.log('\n--- 4. Testing Live Browser Console & Network Requests ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  const consoleLogs = [];
  const failedRequests = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleLogs.push({ type: msg.type(), text: msg.text() });
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
    });

    page.on('response', (res) => {
      if (res.status() >= 400) {
        failedRequests.push({ url: res.url(), status: res.status() });
      }
    });

    console.log(`Navigating to ${BASE}/?tier=high ...`);
    await page.goto(`${BASE}/?tier=high`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for 3D desk model to finish loading and rendering
    console.log('Waiting 5s for 3D model, textures, and Draco decoder to initialize...');
    await new Promise((r) => setTimeout(r, 5000));

    console.log(`Console Errors/Warnings: ${consoleLogs.length}`);
    consoleLogs.forEach((l) => console.log(`  [${l.type}] ${l.text}`));

    console.log(`Failed Network Requests: ${failedRequests.length}`);
    failedRequests.forEach((r) => console.log(`  [${r.status || r.failure}] ${r.url}`));

    return { consoleLogs, failedRequests };
  } finally {
    await browser.close();
  }
}

async function main() {
  const endpoints = await testEndpoints();
  const metadata = await testHtmlMetadata();
  const og = await testOgImageDimensions();
  const browser = await testLiveConsoleAndNetwork();

  const allEndpointsOk = endpoints.every((e) => e.ok);
  const allMetaOk = metadata.every((m) => m.ok);
  const ogOk = og.ok;
  const browserOk = browser.failedRequests.length === 0 && browser.consoleLogs.length === 0;

  console.log('\n========================================');
  console.log('SUMMARY OF POST-LAUNCH VERIFICATION');
  console.log('Endpoints OK       :', allEndpointsOk);
  console.log('Metadata OK        :', allMetaOk);
  console.log('OG Image OK        :', ogOk);
  console.log('Browser/Console OK :', browserOk);
  console.log('========================================');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
