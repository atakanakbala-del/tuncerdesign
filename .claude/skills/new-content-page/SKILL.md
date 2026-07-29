---
name: new-content-page
description: Use when adding a new blog post or service page to the Tuncerdesing site, or when auditing/fixing SEO tags on existing pages. Walks through creating all 4 language files (TR/EN/FR/AR) with correct title/description lengths, hreflang, canonical, OG/Twitter tags, JSON-LD schema, and sitemap.xml entries, matching this repo's established conventions.
---

# New content page (blog post / service page)

This site has no runtime i18n and no templating engine (see `CLAUDE.md`). Every
language is a real, separate, hand-authored HTML file. Adding one piece of
content means creating/editing **4 files** (`tr` at root, `en/`, `fr/`, `ar/`)
that stay structurally identical but never share markup at runtime.

## 0. Decide the content type and slug

- Blog post → lives at `blog/<slug>.html`, `en/blog/<slug>.html`,
  `fr/blog/<slug>.html`, `ar/blog/<slug>.html`.
- Service page → lives at `<slug>.html`, `en/<slug>.html`, `fr/<slug>.html`,
  `ar/<slug>.html` (6 existing services are the reference pattern — copy the
  closest one's structure, don't invent new head boilerplate).

The slug is the same across all 4 languages (only the content is translated,
not the filename) — this is what keeps hreflang/canonical URLs predictable.

## 1. Write the Turkish version first

Content is Turkish-first (per `CLAUDE.md`). Draft the TR page completely —
copy, imagery decisions, headings — before touching the other 3 languages.
Use `lang/*.json` only as a terminology reference if useful; it is not wired
to anything at runtime.

## 2. `<head>` checklist (apply to all 4 files)

Copy the closest existing page as a starting template, then verify every item
below. These are the exact things a past SEO audit of this repo found broken
or missing — don't reintroduce them.

- `<meta charset="UTF-8">`, `<meta name="viewport" ...>`
- `<title>` — end with `| Tuncerdesing`, keep the **whole tag ≤ ~90 chars**
  (matches this repo's existing TR/EN/FR title range; much beyond that
  truncates in Google's SERP).
- `<meta name="description">` — **120–160 characters**. Longer gets truncated
  in search results. Count actual characters, don't eyeball it.
- `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`
- `<link rel="canonical">` — self-referencing, absolute `https://tuncerdesing.com/...` URL.
- `<link rel="alternate" hreflang="...">` × 5 (`tr`, `en`, `fr`, `ar`,
  `x-default`) on **every one of the 4 files**, all pointing to the same 4
  URLs + x-default. Must be reciprocal — copy-paste the same 5-line block
  into all 4 files, only the page's own `og:url`/canonical differs from it.
- Open Graph: `og:type` (`website` for service pages, `article` for blog
  posts), `og:url`, `og:title`, `og:description`, `og:image`,
  `og:image:width`, `og:image:height`, `og:image:alt`, `og:locale`,
  `og:site_name`.
- Twitter: `twitter:card` (`summary`), `twitter:title`, `twitter:description`,
  `twitter:image`, `twitter:image:alt`.
- **Image**: this site has no per-page marketing images yet. Until real
  1200×630 images exist, reuse `https://tuncerdesing.com/images/logo-icon-512.png`
  for both `og:image`/`twitter:image` (width/height `512`) — do **not** invent
  a filename that doesn't exist in `images/` (this exact bug — a dead
  `og-image.jpg`/`logo.png` reference — was found and fixed once already;
  always verify an image path exists with `ls images/` before writing it into
  a tag).
- JSON-LD `<script type="application/ld+json">` blocks:
  - `BreadcrumbList` on every page, mirroring the visible breadcrumb.
  - Blog posts: `BlogPosting` with `headline`, `description`, `datePublished`,
    `author` (`Organization`, name `Tuncerdesing`), **`image`** (same logo
    URL as above), `publisher` (`Organization` with `name`, `url`, and a
    **`logo`** as `{"@type": "ImageObject", "url": "<logo url>"}` — Google
    requires `image` + `publisher.logo` for rich-result eligibility, both are
    easy to forget), `mainEntityOfPage`.
  - Service pages: `Service` schema consistent with the other 5 service
    pages' pattern.
  - Do not add a `WebSite` `potentialAction`/`SearchAction` schema unless a
    real search page/endpoint exists — a phantom one pointing at `/arama` was
    already found and removed once.

## 3. Body

- Reuse nav, breadcrumb markup, language-switcher row (plain `TR / EN / FR /
  AR` text linking to the sibling files), CTA, footer, WhatsApp float from an
  existing page of the same type — these are hand-copied, not componentized.
- Every internal `<a href="...">` needs `target="_self"` explicitly. A stray
  `<base target="_blank">` sits in `<head>` on some pages (historical
  artifact) and silently opens plain links in a new tab otherwise.
- Arabic file: `<html lang="ar" dir="rtl">`.
- Images: above-the-fold get `fetchpriority="high"`, below-the-fold get
  `loading="lazy"`. No local image assets besides `images/` logo/favicon
  files — content images are typically Unsplash URLs.

## 4. Repeat for EN, FR, AR

Hand-translate — there is no automated propagation. Keep the `<head>`
checklist above identical in shape across all 4 files; only text content and
`hreflang`/`lang` values differ.

## 5. Wire up cross-file references

- Add all 4 new URLs to `sitemap.xml` (`<loc>`, `<lastmod>` = today's date,
  `<changefreq>`, `<priority>` — match the priority/changefreq of sibling
  entries of the same content type).
- If it's a blog post, add a new card to `blog/index.html`,
  `en/blog/index.html`, `fr/blog/index.html`, `ar/blog/index.html` (listing
  pages), each linking to the correct language's article.
- Double-check `robots.txt` doesn't need changes (it normally doesn't).

## 6. Validate before considering it done

```bash
# JSON-LD must parse on every touched file
python3 -c "
import re, json, glob
for f in glob.glob('**/*.html', recursive=True):
    c = open(f, encoding='utf-8').read()
    for m in re.finditer(r'<script type=\"application/ld\+json\">(.*?)</script>', c, re.S):
        json.loads(m.group(1))
"

# sitemap.xml must still be well-formed XML
python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml'); print('ok')"

# flag anything over the length budgets
python3 -c "
import re, glob
for f in glob.glob('**/*.html', recursive=True):
    c = open(f, encoding='utf-8').read()
    t = re.search(r'<title>([^<]*)</title>', c)
    d = re.search(r'<meta name=\"description\" content=\"([^\"]*)\">', c)
    if t and len(t.group(1)) > 90: print('TITLE', len(t.group(1)), f)
    if d and len(d.group(1)) > 160: print('DESC', len(d.group(1)), f)
"
```

Also verify every internal link you added resolves to a real file, and that
the new page's canonical/hreflang URLs match its actual sitemap entry
exactly (no trailing-slash or path typos).
