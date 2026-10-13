# Phase 7 — Post-Launch Verification & Hardening

> Handoff plan for another agent. Phases 1–6 are done (see `docs/phase-6-launch-plan.md`, `docs/launch-qa.md`).
> Goal: prove the **deployed** site matches what was verified on localhost, and close the gaps Phase 6 left open.
> Keep changes minimal. Do not add features. Do not commit unless the user asks. Do not invent content.

## 0. Pre-flight

- [ ] `git status` must be clean on `main`; if not, stop and ask the user.
- [ ] `npm ci && npm run build && npm run lint` pass.
- [ ] Confirm the deploy ran: `gh run list --workflow deploy.yml --limit 3`. If it failed or never ran, read the log (`gh run view --log-failed`), fix the root cause, and report. Also check Pages is set to "GitHub Actions" source (`gh api repos/tamthong1115/portfolio/pages`); if not, tell the user — do not change repo settings without asking.

## 1. Verify the live URL (Phase 6 only tested localhost)

Target: `https://tamthong1115.github.io/portfolio/`

- [ ] `curl -sI` the page, `/portfolio/og.png`, `/portfolio/favicon.svg`, `/portfolio/sitemap.xml`, `/portfolio/robots.txt`, `/portfolio/models/desk.glb`, one `/portfolio/draco/*` file → all 200 with sane content-type.
- [ ] Run `node scripts/run-axe-audit.mjs https://tamthong1115.github.io/portfolio/` → 0 violations in all 4 configs.
- [ ] Run `node scripts/test-keyboard-nav.mjs https://tamthong1115.github.io/portfolio/` → passes.
- [ ] Lighthouse **mobile and desktop** against the live URL. Phase 6 recorded mobile only. Budgets: A11y/SEO/BP ≥ 95, CLS < 0.05, Perf ≥ 70 (note low-tier separately with `?tier=low`).
- [ ] Console: no errors/warnings on load, no failed network requests (use puppeteer from `scripts/` as a template).

## 2. Social preview

- [ ] Fetch the live HTML and assert `og:title`, `og:description`, `og:image`, `twitter:card`, `canonical` are present and absolute.
- [ ] Download the live `og.png`, confirm 1200×630 and that it shows the real scene (not a placeholder).
- [ ] Tell the user to paste the URL into Slack/Discord/LinkedIn once (scrapers cache; you cannot verify this yourself — say so).

## 3. Cross-browser / device gaps

Phase 5/6 docs list manual Safari/iOS/Firefox checks as steps but record no results. Do not claim they passed.

- [ ] Run what is automatable (puppeteer Chromium + Firefox if `puppeteer` supports it; WebKit via Playwright only if already installed — do not add dependencies).
- [ ] For everything else, add a short checklist to `docs/post-launch-qa.md` under "Needs human": Safari desktop, iOS Safari (WebGL context, Lenis scroll, camera stops), Android Chrome, `prefers-reduced-motion`, `?tier=low|mid|high`.

## 4. Fix only what is found

- [ ] For each failure from §1–§3, fix the root cause with the smallest diff and re-run the check that failed.
- [ ] Mobile Perf was 89: only investigate if the live number is below the 70 budget or regressed >10 points vs `docs/launch-qa.md`.
- [ ] Anything that needs a content/design decision → list it for the user, do not guess.

## 5. Report

Write `docs/post-launch-qa.md` with: date, live URL, commit SHA deployed, a table of every check above (pass/fail/not run + number), a "Needs human" list, and a "Known issues" list.

## Definition of done

1. Every §1 check run against the live URL with results recorded.
2. Any regression fixed, build and lint green.
3. `docs/post-launch-qa.md` exists and honestly separates *verified* from *not verified*.

## Out of scope (do not do)

New 3D features, analytics, custom domain, blog/CMS, i18n, contact-form backend, redesign, dependency upgrades.
