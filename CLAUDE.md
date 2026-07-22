# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static marketing site for Tuncerdesing (industrial kitchen equipment / restaurant setup company, Istanbul). No build system, no package manager, no bundler — plain HTML/CSS/JS served as-is (deployed via GitHub Pages, per `CNAME` pointing to `tuncerdesing.com`).

## Development

There is no build/lint/test tooling in this repo. To preview changes, open `index.html` directly in a browser or serve the directory with any static file server (e.g. `python -m http.server`). There are no automated tests.

## Architecture

- `index.html` — the entire site is a single page (all sections: hero, stats, services, process, about, CTA, FAQ, contact, footer are `<section>`s in this one file). Styling is Tailwind via CDN (`cdn.tailwindcss.com`) plus custom overrides in `css/style.css`. Animations use GSAP + ScrollTrigger (also via CDN).
- `gizlilik-politikasi.html` (privacy policy) and `kullanim-kosullari.html` (terms of use) are separate standalone pages, linked from the footer.
- `js/main.js` — all page interactivity: GSAP scroll-reveal animations, counter animations, navbar scroll state, mobile menu toggle, in-page smooth-scroll for `a[href^="#"]` links (uses `preventDefault` + `scrollIntoView`, so anchor navigation does not rely on browser default behavior), and the contact form submit handler (AJAX POST to Formspree, see below).
- `js/language.js` — client-side i18n. Loads `lang/{tr,en,fr,ar}.json` via `fetch` and swaps text into any element with `data-i18n="key"` (and placeholders via `data-placeholder`). Language choice persists in `localStorage`. Arabic sets `dir="rtl"` on `<body>`; RTL-specific CSS overrides live in `css/style.css`. When adding user-facing copy in `index.html`, add a matching key to **all four** `lang/*.json` files, not just `tr.json`.
- `lang/*.json` — flat key→string maps, one file per language, keys must stay in sync across all four files.
- Contact form (`#contactForm` in `index.html`) posts to a Formspree endpoint (`action="https://formspree.io/f/..."`); submission is intercepted in `main.js` and sent via `fetch`, showing the `#toast` element on success.
- Cookie consent banner (`#cookieBanner`) and its accept/reject handlers are defined inline at the bottom of `index.html` (not in `js/main.js`); state persists via `localStorage` (`cookieConsent` key).
- Analytics/tracking: Google tag (gtag.js) and Meta/Facebook Pixel are both loaded inline in `<head>`. SEO metadata (Open Graph, Twitter cards, JSON-LD `LocalBusiness`/`Organization`/`WebSite` schema, FAQ schema in the FAQ section) is embedded directly in `index.html` — keep this in sync if business info (address, phone, hours) changes.
- `robots.txt` / `sitemap.xml` — minimal, single-URL sitemap since this is a one-page site.

## Conventions in this codebase

- Primary brand colors are CSS custom properties `--primary` (`#1e3a5f`) and `--accent` (`#c9a962`), also hardcoded as Tailwind arbitrary values (`text-[#1e3a5f]`, `bg-[#c9a962]`) throughout `index.html` — both must be updated together if rebranding.
- Content is Turkish-first; `tr.json` is the reference language and other JSON files should mirror its key set.
- Images are loaded from Unsplash by URL (no local image assets except `Tuncerdesing.png`); above-the-fold images use `fetchpriority="high"` (no `loading="lazy"`), below-the-fold images use `loading="lazy"`.
