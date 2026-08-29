# Ball is Life? — QSS020 Final Project Portfolio

Personal portfolio site for **Logan Eskildsen** (QSS020, Term X26, Dartmouth College),
presenting *"Ball is Life? Statistical Analysis of American Cross-Cultural Versus Match
Engagement During the 2026 World Cup."*

The site walks through the project as a workflow — **Question → Data → Method → Result →
Takeaway** — arranged around a World Cup trophy that extends vertically across the entire
page, with the flags of the five USMNT opponents (Australia, Belgium, Bosnia &
Herzegovina, Paraguay, Türkiye) and the USA outlining the negative space along the
trophy's silhouette.

Typography is the FWC26 World Cup 26 family (Normal + Ultra Condensed), via the
[wc26.bogachev.fr](https://wc26.bogachev.fr/) project.

## Stack

- React 19 + Vite
- No other runtime dependencies — the trophy, flags, and charts are hand-built SVG

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Structure

- `src/App.jsx` — page content: hero + the five workflow sections
- `src/components/TrophySpine.jsx` — full-height trophy silhouette + contour-following flags
- `src/components/Flags.jsx` — hand-drawn SVG flags
- `src/components/Charts.jsx` — bar lists and the exponential-decay figure
- `src/fonts/` — FWC26 WOFF2 files
