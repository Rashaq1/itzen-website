# itzenhealth.com

Company site for **IT'ZEN | إتـزن** — a Saudi startup building AI-powered, human-centered mental-health technology.

**Live:** [itzenhealth.com](https://itzenhealth.com)

## Approach

Hand-written HTML/CSS/JS — no framework, no build step. The whole site is three files plus assets, which keeps it fast and trivially deployable.

- **Arabic-first, genuinely RTL.** Arabic is the default; English is an explicit toggle (persisted in `localStorage`). Every string lives in the markup as `data-ar` / `data-en` attributes swapped by `setLang()` in [main.js](main.js), with Arabic-Indic digit conversion.
- **Honest product framing.** The shipped product (Ana Baad) and a demand-tested concept (Voice Diary) are presented differently by design — the concept says plainly it hasn't been built yet.
- **Netlify Forms** contact form with interest preselection via CTA deep-links.
- `netlify.toml` handles the www→apex redirect and caching headers; `sitemap.xml` + `robots.txt` included.

## Develop

Any static server works:

```bash
python3 -m http.server 4321
```

## Deploy

Drag the folder to Netlify (or connect this repo).
