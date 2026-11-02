# Advanced Python Programming Portfolio — Aneesh J V R

A premium, responsive static portfolio for Advanced Python Programming at VIT Vellore.
Built with plain HTML, CSS and JavaScript — no frameworks, no backend, no build step, no external requests.

## Run locally
1. Extract the ZIP.
2. Double-click `index.html` (or `blog.html`) to open it in any modern browser.

Optional local server: `python -m http.server 8000` in this folder, then visit http://localhost:8000

## Structure
- `index.html` – hero, about, 11-activity gallery, demo video link, reflection
- `blog.html` – personal blog: "More than a Python course"
- `style.css` – all styling (design tokens at the top of the file)
- `script.js` – navigation, filters, lightbox, reveals, back-to-top
- `assets/` – your original photos, PDFs, audio and presentation (unchanged)

## Features
Mobile menu · active nav indicators · scroll progress bar · animated reveals (disabled for reduced-motion users) ·
category filters · keyboard-accessible image lightbox (Esc, ← →, Tab trap) · back-to-top button · skip links.

## Customize
- Edit activity text and links in `index.html`; change colors in the `:root` block of `style.css`.
- To add the stars photo: save it as `assets/stars-photo.jpeg` and add a card (copy an existing `<article class="card">`).

## Notes
- The demo video links to the Google Drive URL from the original site.
- `assets/project-review.pdf` (Project Review 2) is now linked beside the demo video.
- `assets/storyboard-reference.jpeg` and `assets/quiz-results.jpeg` are byte-identical to the thread-lock and Padlet images and are kept untouched.
- The Medium blog activity remains omitted, as in the original.
