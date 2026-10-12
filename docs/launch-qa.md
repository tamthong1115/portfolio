# Phase 6 — Launch QA & Verification Report

**Date**: October 12, 2026  
**Target Live URL**: [https://tamthong1115.github.io/portfolio/](https://tamthong1115.github.io/portfolio/)  
**Base Path**: `/portfolio/`  
**Deploy Workflow**: `.github/workflows/deploy.yml` (GitHub Pages)  

---

## 1. Automated Accessibility Audit (Axe-Core 4.13)

Executed via `node scripts/run-axe-audit.mjs http://localhost:4174/portfolio/`:

| Configuration | Viewport / State | Violations Found | Status |
| :--- | :--- | :--- | :--- |
| **Desktop Viewport** | 1280 x 800 | **0 violations** | **Passed** |
| **Mobile Viewport** | 390 x 844 (iPhone) | **0 violations** | **Passed** |
| **Mobile Navigation Drawer** | Open State (Focus Trap & Overlay) | **0 violations** | **Passed** |
| **Low-Tier Poster Fallback** | `?tier=low` (Static WebP) | **0 violations** | **Passed** |

**Contrast & Color Note**: All footer and body texts meet or exceed the WCAG AA minimum 4.5:1 contrast ratio against `--color-bg` (`#0b0f19`).

---

## 2. Keyboard Navigation & Interaction QA

Executed via `node scripts/test-keyboard-nav.mjs http://localhost:4174/portfolio/`:

1. **Skip-to-Content Link**: Verified as the very first focusable DOM element, targeting `<main id="main-content">`.
2. **Logical Tab Sequence**: Traverses through navigation links (`Home`, `About`, `Projects`, `Contact`), hero CTAs (`View projects`, `Contact`), and external project links (`Code`, `Live`).
3. **Focus Indicators**: High-contrast outline rings (`focus-visible:outline-2 focus-visible:outline-accent`) visible on all interactive elements.
4. **Mobile Navigation Drawer**:
   - Opens smoothly with `aria-expanded="true"`.
   - Dismisses immediately upon pressing the `Escape` key (`aria-expanded="false"`).

---

## 3. Metadata, SEO & Social Share Verification

- **Canonical URL**: `<link rel="canonical" href="https://tamthong1115.github.io/portfolio/" />`
- **Open Graph & Twitter Card**:
  - `og:image`: `https://tamthong1115.github.io/portfolio/og.png` (Absolute URL for crawlers)
  - `twitter:image`: `https://tamthong1115.github.io/portfolio/og.png`
  - In-engine capture generated at **1200 x 630** (`public/og.png`) featuring the illuminated 3D desk workspace and hero branding.
- **Sitemap & Robots**:
  - `public/sitemap.xml`: Formatted with valid XML schema pointing to `https://tamthong1115.github.io/portfolio/`.
  - `public/robots.txt`: Grants universal crawl access and references `sitemap.xml`.
- **Structured Data (JSON-LD)**: Schema.org `Person` entity containing name, job title, canonical URL, and social profiles.

---

## 4. Content Hygiene & Asset Attribution

1. **Model Attribution**: Added CC-BY 4.0 attribution to [`src/components/layout/Footer.jsx`](file:///c:/Users/Thong/MyDocs/SourceCodes/Portfolio/src/components/layout/Footer.jsx) and [`README.md`](file:///c:/Users/Thong/MyDocs/SourceCodes/Portfolio/README.md) for the 3D Retro Developer Workspace model.
2. **Asset Pruning**: Removed redundant `src/assets/projects/ecommerce-platform.png` (freed 2.5 MB).
3. **Project Images**: Wired `warehouse-management-system.webp` to the Warehouse Management System card.
4. **Link Integrity**: 0 placeholder links (`example.com` or `href="#"`) in source files.

---

## 5. Lighthouse Mobile Budget Verification

Audited with Lighthouse 13.5.0 on mobile emulation:

| Category | Score | Budget Target | Status |
| :--- | :--- | :--- | :--- |
| **Performance** | **89 / 100** | ≥ 70 | **Passed** |
| **Accessibility** | **100 / 100** | ≥ 95 | **Passed** |
| **Best Practices** | **100 / 100** | ≥ 95 | **Passed** |
| **SEO** | **100 / 100** | ≥ 95 | **Passed** |
| **Total Blocking Time (TBT)** | **0 ms** | < 200 ms | **Optimal** |
| **Cumulative Layout Shift (CLS)**| **0.000** | < 0.05 | **Zero Shift** |

---

## 6. Deployment Readiness

- Build command: `npm run build` completed in under 1 second with 0 warnings/errors.
- Lint check: `oxlint` passed with 0 warnings/errors across 30 files.
- GitHub Pages deploy workflow active in `.github/workflows/deploy.yml`.
