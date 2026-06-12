# ELI5 — Explain Like I'm 5

A hyper-minimalist educational web app. Type any topic and get a warm,
ultra-simple explanation a five-year-old could understand. Built with plain
**HTML, CSS, and JavaScript** — no build step, no frameworks.

## Run locally

Just open `index.html` in your browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. Settings → Pages → Source: `main` branch, `/ (root)`.
3. Visit the Pages URL.

## API Key

On first use the app will ask for your **Lovable API key** and store it in
your browser's `localStorage`. It calls the Lovable AI Gateway directly
(`https://ai.gateway.lovable.dev/v1/chat/completions`) using the
`google/gemini-3-flash-preview` model.

> Note: because this is a static site, the key lives in your browser. Only
> use a key you're comfortable putting client-side, or host a tiny backend
> proxy if you need to keep it secret.

## Files

- `index.html` — markup
- `styles.css` — styles
- `app.js` — logic + Lovable AI Gateway call
- `teddy.png` — mascot
