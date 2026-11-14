<p align="center">
  <img src="assets/images/janimarkllc.webp" alt="JaniMark LLC" height="80">
</p>

# JaniMark LLC

Website for JaniMark LLC, commercial and office cleaning in Greater Springfield, MA: [https://www.janimarkllc.com](https://www.janimarkllc.com)

## Badges

<!-- Build -->
[![Build Main](https://img.shields.io/github/actions/workflow/status/kpirnie/janimark/build.yml?branch=main&label=Main&logoColor=white&logo=github&labelColor=000&style=for-the-badge)](https://github.com/kpirnie/janimark/actions/workflows/build.yml?query=branch%3Amain)
<!-- Issues -->
[![GitHub Issues](https://img.shields.io/github/issues/kpirnie/janimark?style=for-the-badge&logo=github&color=006400&logoColor=white&labelColor=000)](https://github.com/kpirnie/janimark/issues)
<!-- Security -->
[![GitHub Security](https://img.shields.io/badge/Security-View-6495ED?link=https://github.com/kpirnie/janimark/security&logoColor=white&style=for-the-badge&labelColor=000&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAyTDQgNXY2LjA5YzAgNS4wNSAzLjQxIDkuNzYgOCAxMC45MSA0LjU5LTEuMTUgOC01Ljg2IDgtMTAuOTFWNWwtOC0zeiIvPjwvc3ZnPg==)](https://github.com/kpirnie/janimark/security)
<!-- Last Commit -->
[![Last Commit](https://img.shields.io/github/last-commit/kpirnie/janimark?style=for-the-badge&labelColor=000&logoColor=white&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iNC41IiB3aWR0aD0iMTgiIGhlaWdodD0iMTYuNSIgcng9IjIiLz48bGluZSB4MT0iMyIgeTE9IjkuNSIgeDI9IjIxIiB5Mj0iOS41Ii8+PGxpbmUgeDE9IjgiIHkxPSIyLjUiIHgyPSI4IiB5Mj0iNi41Ii8+PGxpbmUgeDE9IjE2IiB5MT0iMi41IiB4Mj0iMTYiIHkyPSI2LjUiLz48L3N2Zz4=)](https://github.com/kpirnie/janimark/commits/main)
<!-- License -->
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-orange.svg?style=for-the-badge&labelColor=000)](#license)
<!-- Stack -->
[![PHP](https://img.shields.io/badge/Min.-php8.4-777BB4?logo=php&logoColor=white&style=for-the-badge&labelColor=000)](https://php.net)
<!-- Links/Social -->
[![Discord](https://img.shields.io/badge/Discord-Join-blue?logo=discord&logoColor=white&style=for-the-badge&labelColor=000)](https://discord.gg/bd4Qan3PaN)
[![Kevin Pirnie](https://img.shields.io/badge/-KevinPirnie.com-000d2d?style=for-the-badge&labelColor=000&logoColor=white&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz4KICA8ZWxsaXBzZSBjeD0iMTIiIGN5PSIxMiIgcng9IjQuNSIgcnk9IjEwIi8+CiAgPGxpbmUgeDE9IjIiIHkxPSIxMiIgeDI9IjIyIiB5Mj0iMTIiLz4KICA8bGluZSB4MT0iNC41IiB5MT0iNi41IiB4Mj0iMTkuNSIgeTI9IjYuNSIvPgogIDxsaW5lIHgxPSI0LjUiIHkxPSIxNy41IiB4Mj0iMTkuNSIgeTI9IjE3LjUiLz4KPC9zdmc+Cg==)](https://kevinpirnie.com/)

## Overview

A single-page static site with a PHP quote form handler.

- `index.html` with Open Graph, JSON-LD, and microdata (LocalBusiness / ProfessionalService)
- Quote form posted to `sendit.php`, sent over SMTP with PHPMailer, protected by a honeypot and a time token
- Agent-ready: `llms.txt`, `llms-full.txt`, a Markdown version of the page (`index.md`) with `Accept: text/markdown` negotiation, Content Signals in `robots.txt`, and WebMCP tools
- CSS and JS minified with Composer (`matthiasmullie/minify`); no Node tooling

## Requirements

- PHP 8.4+ with `mbstring`
- Composer
- nginx (site rules in `.nginx.conf`)

## Development

```bash
composer install
cp config.sample.php config.php   # then fill in the SMTP and mail settings
composer minify                   # rebuilds style.min.css and main.min.js
```

Edit `assets/css/style.css` and `assets/js/main.js`, then run `composer minify`. Bump the `?v=` query strings in `index.html` when assets change.

`config.php` is git-ignored and never committed.

## Build & Deploy

Every push to `main` runs `.github/workflows/build.yml`, which:

1. Installs the production dependencies (`composer install --no-dev`)
2. Minifies the CSS and JS
3. Packages the deployable site into `janimark.zip`
4. Publishes it to the rolling **`latest`** release

To deploy, download `janimark.zip` from the [latest release](https://github.com/kpirnie/janimark/releases/tag/latest) and extract it into the web root. The zip doesn't include `config.php`, so the server's copy is left alone.

The zip leaves out development files: `.github/`, `build/`, `build.sh`, `composer.*`, `config.sample.php`, the unminified CSS/JS, `readme.md`, and `.gitignore`.

## Project Layout

| Path | Purpose |
| ---- | ------- |
| `index.html` | The site |
| `index.md` | Markdown version of the site for AI agents |
| `sendit.php` | Quote form handler (PHPMailer over SMTP) |
| `config.sample.php` | Sample SMTP, mail, and form protection settings |
| `assets/` | CSS, JS, images, icons |
| `assets/js/webmcp.js` | WebMCP tools (business info, quote form prefill; never submits) |
| `robots.txt`, `sitemap.xml` | Crawler rules, Content Signals, sitemap |
| `llms.txt`, `llms-full.txt` | LLM site summaries |
| `.nginx.conf` | Security headers, file blocking, caching, Markdown negotiation |
| `build/minify.php` | Asset minifier |
| `build.sh` | Server-side build (install, minify, permissions) |

## License

Copyright &copy; JaniMark LLC. All rights reserved. Proprietary; not licensed for reuse.