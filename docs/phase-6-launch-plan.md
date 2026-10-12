# Phase 6 — Launch (Deploy, Content Finalization, Final QA)

> Handoff plan for another agent. Phases 1–5 are done (static site, 3D desk scene, scroll camera, mobile/a11y/perf).
> Goal of Phase 6: the site is live on a public URL, with real content and correct social previews.
> Keep changes minimal. Do not add features. Do not commit unless the user asks.

## 0. Pre-flight: working tree is dirty (DO FIRST)

`git status` shows uncommitted edits that **revert Phase 5** (HEAD = `9763ba6`):

- `src/components/canvas/Scene.jsx` — re-inlines `<Canvas>`, drops tier/poster/lazy `ThreeCanvas`
- `src/components/canvas/CameraRig.jsx`, `src/components/ui/Loader.jsx` — Phase 5 changes removed
- `src/hooks/useDeviceTier.js`, `scripts/test-keyboard-nav.mjs` — contents deleted (file now empty)

Phase 5 is what gave the Lighthouse results in `docs/lighthouse-phase5.md`, so these edits look accidental.

- [ ] Ask the user: "restore these 5 files to HEAD?" If yes: `git checkout -- <the 5 files>`. If no, stop and ask what the edits were for.
- [ ] After restore: `npm run build` and `npm run lint` pass.

## 1. Hosting config (GitHub Pages)

`index.html` already assumes `https://tamthong1115.github.io/portfolio/`, but `vite.config.js` has no `base`, so asset URLs (`/favicon.svg`, `/og.png`, `/models/desk.glb`, `/draco/`) will 404 under `/portfolio/`.

- [ ] `vite.config.js`: set `base: '/portfolio/'` (or `process.env.VITE_BASE ?? '/'` if a custom domain is planned — ask the user which).
- [ ] Grep for hard-coded root-absolute paths and make them base-aware (`import.meta.env.BASE_URL`):
  - `src/components/canvas/Desk.jsx` (GLB path, `useGLTF.setDecoderPath` for `/draco/`)
  - `src/components/canvas/ThreeCanvas.jsx`
  - `index.html` (`/favicon.svg`, `/apple-touch-icon.png`)
- [ ] Add `.github/workflows/deploy.yml`: on push to `main` → `npm ci` → `npm run build` → `actions/upload-pages-artifact` (`dist`) → `actions/deploy-pages`. Node 22.
- [ ] No SPA router is used (anchor sections only), so no 404.html fallback needed.

**Check:** `npm run build && npm run preview` → open `http://localhost:4173/portfolio/`; the 3D desk loads, no 404 in network tab, Draco decoder loads.

## 2. Social/SEO metadata

- [ ] `index.html`: `og:image` and `twitter:image` must be **absolute URLs** (`https://tamthong1115.github.io/portfolio/og.png`); relative `/og.png` will not work for scrapers.
- [ ] Add `<link rel="canonical" href="…">`.
- [ ] Replace placeholder `public/og.png` with a capture of the real scene (1200×630). `scripts/capture-poster.mjs` already drives puppeteer — reuse/adapt it (README "Assets Note" says this is pending).
- [ ] `public/robots.txt`: add `Sitemap:` line and add a one-page `public/sitemap.xml` (single URL).
- [ ] Optional, only if trivial: JSON-LD `Person` block in `index.html`.

## 3. Content finalization

- [ ] Review `src/data/profile.js` and `src/data/projects.js` with the user: bio, email (`email` field vs. the one the user actually wants public), links, project descriptions/tech tags.
- [ ] Every project has a working live/repo link or explicitly none; no `#` or `example.com` placeholders (`grep -rn "example.com\|href=\"#\"" src`).
- [ ] `src/assets/projects/ecommerce-platform.png` is tracked next to `.webp` — remove the `.png` if the code imports only `.webp`.
- [ ] Do not invent content. Anything missing → list it for the user, don't fabricate.

## 4. Repo hygiene

- [ ] Untracked root files `desk_test.glb`, `hacker_room_test.glb` are gitignored; confirm they are not referenced anywhere, tell the user they can be deleted (do not delete without asking).
- [ ] README: update "Planned Stack" → "Stack", add live URL, remove the "replace og.png" reminder once done.
- [ ] Add CC-BY 4.0 attribution for the desk model somewhere visible (footer or README) — the license requires it. Find the author/title in the original model source, ask the user if unknown.

## 5. Final QA (record results in `docs/launch-qa.md`)

Run against the **deployed** URL, not localhost:

- [ ] `node scripts/run-axe-audit.mjs` — 0 violations (desktop, mobile, drawer, `?tier=low`).
- [ ] `node scripts/test-keyboard-nav.mjs` — passes.
- [ ] Lighthouse mobile + desktop: keep Phase 5 budgets (A11y/SEO/BP ≥ 95, CLS < 0.05, low-tier Perf ≥ 70). Note any regression vs `docs/lighthouse-phase5.md`.
- [ ] Manual: Chrome, Firefox, Safari/iOS (WebGL context, Lenis scroll, camera stops); `prefers-reduced-motion`; `?tier=low|mid|high`.
- [ ] Social preview check: paste URL into a link-preview tool/Slack/Discord and confirm title, description, image.

## Definition of done

1. Site reachable at the public URL, 3D scene + poster fallback both work.
2. Link previews show the real OG image.
3. No placeholder content or dead links.
4. `docs/launch-qa.md` exists with audit numbers; build and lint green.

## Out of scope (do not do)

New 3D features, post-processing, CMS/blog, analytics, i18n, contact form backend. Propose them separately if wanted.
