# سماء الحرمين… مع السعودية

Landing page concept for the Saudia Hajj & Umrah Madinah winter campaign (Saudi residents and expats). Booking happens on [saudia.com/holidays](https://www.saudia.com/holidays/en-SA).

## Files

- `index.html`: the landing page (Arabic first, English toggle).
- `assets/img/`: page images.
- `CREDITS.md`: photo sources and licences.
- `archive/afro-baobab-gtm.html`: the previous `index.html` from this repo, kept for reference.

## Preview

Open `index.html` in a browser. To publish with GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Assistant (مساعد سماء الحرمين)

The chat button on the page answers visitor questions about the packages, routes, hotels, guides, weather and booking.

- **Built-in answers** work everywhere, including when `index.html` is opened directly. They come from a knowledge base embedded in the page.
- **AI answers (Claude)** are used when the site runs on Netlify with the function in `netlify/functions/assistant.mjs`. Set the environment variable `ANTHROPIC_API_KEY` in Netlify → Site configuration → Environment variables, then redeploy. Without the key, the page falls back to the built-in answers.
- The assistant uses only the campaign facts in `netlify/functions/assistant-kb.mjs`. For prices, cancellation, visas and child pricing it points visitors to saudia.com or the Saudia Hajj & Umrah Linktree.
- `assistant-kb.mjs` and the knowledge base in `index.html` are generated from one source, so edit that source and rebuild rather than editing them by hand.

## Before launch

- Replace the stand-in font with Saudia Sans.
- Replace Wikimedia Commons concept photos with campaign photography.
- Client review of the stop descriptions in the route popups (marked for review).
- Direct saudia.com links for each package.

Package details (routes, hotels, inclusions, guides, dinner options) come only from the client program file V11-Medinah.pdf. Winter temperatures: WMO 1991–2020 averages; live temperature from Open-Meteo.
