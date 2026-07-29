# Contributing

Tuncerdesing's site is plain static HTML/CSS/JS — no build system, no package
manager, no framework. Anyone editing content or markup here should read this
file first. For a deeper architecture walkthrough (how languages, styling,
and animations are wired together) see `CLAUDE.md`.

## Local preview

There's no build step. Either open a page directly in a browser, or serve the
repo root with any static file server, e.g.:

```bash
python -m http.server
```

## The one rule that matters most: 4 real files per page

Turkish is the default language and lives at the repo root
(`index.html`, `blog/`, `endustriyel-mutfak-ekipmanlari.html`, etc.). English,
French, and Arabic are **full, separately-authored HTML files** under `en/`,
`fr/`, `ar/`, mirroring the same paths one level down. There is no
client-side or build-time translation system — nothing loads `lang/*.json` at
runtime (those files are a translation reference only). If you edit
user-facing copy, you must edit all 4 language files for that page by hand.

When adding a new blog post or service page, use the
`new-content-page` Claude Code skill (`.claude/skills/new-content-page/`) —
it walks through the full checklist below step by step and includes ready-to-
run validation commands.

## Adding a new page — checklist

1. Write the Turkish version first (content is Turkish-first).
2. Pick one slug, reuse it for the `en/`, `fr/`, `ar/` file paths — only the
   content changes per language, not the filename.
3. Hand-translate into English, French, and Arabic. Arabic pages must use
   `<html lang="ar" dir="rtl">`.
4. Every page needs, in `<head>`:
   - A unique `<title>` (≤ ~90 characters including the `| Tuncerdesing`
     suffix, or it gets truncated in search results).
   - A unique `<meta name="description">` between **120–160 characters**.
   - A self-referencing `<link rel="canonical">`.
   - A full `hreflang` set (`tr`, `en`, `fr`, `ar`, `x-default`) — identical
     across all 4 language files, reciprocal.
   - Open Graph + Twitter card tags, including `og:image`/`twitter:image`
     pointing at a file that actually exists in `images/` (verify with
     `ls images/` — a dead image reference has bitten this repo before).
   - JSON-LD structured data appropriate to the page type (`BreadcrumbList`
     always; `BlogPosting` for blog posts — remember `image` and
     `publisher.logo`, both required for Google rich results and easy to
     forget; `Service` for service pages).
5. Add all 4 new URLs to `sitemap.xml`.
6. If it's a blog post, add a listing card to all 4 `blog/index.html`
   variants.
7. Internal links (`<a href="...">`) must include `target="_self"` — a stray
   `<base target="_blank">` in `<head>` means plain links otherwise open in a
   new tab.

## Brand conventions

- Primary colors are CSS custom properties `--primary` (`#1e3a5f`) and
  `--accent` (`#c9a962`), also hardcoded as Tailwind arbitrary values
  (`text-[#1e3a5f]`, `bg-[#c9a962]`) across every page. Update both forms
  together if a color ever changes.
- No local content-image assets besides `images/` logo/favicon files —
  content images are typically loaded from Unsplash by URL. Above-the-fold
  images get `fetchpriority="high"`; below-the-fold images get
  `loading="lazy"`.
- Don't touch the Tailwind CDN `<script>` tag's load order — it's
  intentionally not deferred (the whole layout depends on Tailwind's runtime
  JIT compiler; deferring it causes a flash of unstyled content). Keep GSAP →
  ScrollTrigger → `js/main.js` in that relative order if editing script tags.

## No tests, keep changes verifiable by hand

There's no test suite. Before calling a content change done:

- Open the new/changed pages in a browser (or the dev server above) in each
  language and check they render.
- Validate JSON-LD and `sitemap.xml` — see the validation snippets in
  `.claude/skills/new-content-page/SKILL.md` if you're using Claude Code, or
  run any JSON-LD/XML linter manually otherwise.
- Click through the language switcher and any new internal links to confirm
  they resolve to real files.
