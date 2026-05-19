# meshx.uk

Static marketing site for **meshx.uk** — the MeshX ecosystem landing page.

Auto-deployed to Cloudflare Pages on every push to `main`.

## Layout

- `index.html` — ecosystem landing page (3 live products + 2 shipping next)
- `eco.css` — bespoke styles for hero / cards / sections (sits on top of `site.css`)
- `site.css` / `site.js` — base styles + JS inherited from the original site
- `privacy.html` / `terms.html` / `cookies.html` / `security.html` / `information-security-policy.html` — legal pages (hardcoded in the app — must stay at meshx.uk)
- `sitemap.xml` / `robots.txt` — SEO
- `assets/` — logos + icons + screenshots

## Cloudflare Pages settings

- **Production branch:** `main`
- **Build command:** *(blank — static site)*
- **Build output directory:** `/`
- **Custom domain:** `meshx.uk`

## Sibling sites

- **pod.meshx.uk** — POD-focused marketing site, served via Caddy on VM1 from `/opt/nexus/pod_meshx_website/`.
- **app.meshx.uk** — the actual product (Next.js, lives in the main `nexus-frontend` repo).
- **photo.meshx.uk / chatbot.meshx.uk** — sibling SaaS products.
