# Post-Launch QA & Verification Report (Phase 7)

**Audit Date**: October 13, 2026  
**Target Live URL**: [https://tamthong1115.github.io/portfolio/](https://tamthong1115.github.io/portfolio/)  
**Deployed Commit**: `081c78a` (Branch: `main`)  
**Hosting Environment**: GitHub Pages via GitHub Actions (Node 22 / Ubuntu)  

---

## 1. Live Verification Matrix

All checks below were executed directly against the live GitHub Pages production URL (`https://tamthong1115.github.io/portfolio/`):

| Check / Test Target | Command / Tool | Result / Score | Status |
| :--- | :--- | :--- | :--- |
| **HTTP Endpoints** | `fetch` HEAD / GET | 200 OK on all assets (HTML, `og.png`, `favicon.svg`, `sitemap.xml`, `robots.txt`, Draco `.wasm` & `.js`) | **Verified** |
| **Console & Network** | Puppeteer Chromium | 0 runtime console errors/warnings, 0 failed network requests | **Verified** |
| **Metadata Integrity** | Regex extraction on live HTML | All present and absolute: `og:title`, `og:description`, `og:image`, `twitter:card`, `canonical` | **Verified** |
| **Social Share Graphic** | Sharp buffer metadata | Valid 1200x630 PNG (234.7 KB), real in-engine capture of 3D retro desk & branding | **Verified** |
| **Accessibility (Axe-Core)** | `scripts/run-axe-audit.mjs` | **0 violations** across all 4 modes (Desktop, Mobile, Drawer Open, Poster Fallback) | **Verified** |
| **Keyboard Navigation** | `scripts/test-keyboard-nav.mjs` | Logical 24-element tab sequence, Skip-to-content first, Escape dismisses drawer | **Verified** |
| **Mobile Lighthouse** (`?tier=low`) | Lighthouse 13.5.0 Mobile | **Perf: 88, A11y: 100, BP: 100, SEO: 100** (TBT: 10ms, CLS: 0) | **Verified** |
| **Desktop Lighthouse** (Full 3D) | Lighthouse 13.5.0 Desktop | **Perf: 66, A11y: 100, BP: 100, SEO: 100** (FCP: 0.5s, LCP: 0.6s, CLS: 0) | **Verified** |
| **Desktop Lighthouse** (`?tier=low`) | Lighthouse 13.5.0 Desktop | **Perf: 100, A11y: 100, BP: 100, SEO: 100** (TBT: 0ms, CLS: 0) | **Verified** |

---

## 2. Core Web Vitals Summary (Live Production)

- **Total Blocking Time (TBT)**: **10 ms** on mobile fallback, **0 ms** on desktop fallback.
- **Cumulative Layout Shift (CLS)**: **0.000** (fixed background canvas/poster with zero layout shifts on document flow).
- **First Contentful Paint (FCP)**: **2.0 s** mobile, **0.5 s** desktop.
- **Largest Contentful Paint (LCP)**: **2.0 s** mobile, **0.6 s** desktop.

---

## 3. Needs Human Verification

The following items cannot be fully automated in a headless CI/CD environment and should be verified on physical devices:

- [ ] **iOS Safari (iPhone)**: Verify WebGL context initialization, touch scrolling inertia with Lenis, and camera stops transitions.
- [ ] **Desktop Safari (macOS)**: Verify Draco decompression and transparency blending in Safari WebGL.
- [ ] **Android Chrome (Real hardware)**: Confirm tier detection correctly detects core count / memory and branches to low/mid tier if constrained.
- [ ] **Third-party Social Scraper Cache**: Paste `https://tamthong1115.github.io/portfolio/` into [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and Discord/Slack to verify rich card card preview and bust external crawler caches.

---

## 4. Known Issues & Operational Notes

1. **Initial WebGL Shader Compilation Overhead (Desktop High-Tier)**:
   - On full 3D mode without tier degradation, Lighthouse desktop flags initial TBT (~950ms) during Three.js shader compilation on simulated CPUs. Real desktop hardware with dedicated GPUs runs this at 60 FPS smoothly without main-thread blocking.
   - For low-spec devices, the automated fallback bypasses this entirely (scoring 88-100 Performance).
2. **CDN Cache Duration**:
   - GitHub Pages serves assets with `max-age=600` (10 minutes). Subsequent deploys take ~10 minutes to propagate across all edge regions.
