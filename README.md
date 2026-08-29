# Ball is Life? — QSS020 Final Project Portfolio

Personal portfolio site for **Logan Eskildsen** (QSS020, Term X26, Dartmouth College),
presenting *"Ball is Life? Statistical Analysis of American Cross-Cultural Versus Match
Engagement During the 2026 World Cup."*

The site walks through the project as a workflow — **Question → Data → Method → Result →
Takeaway** — with the content set *inside* a World Cup trophy that extends vertically
across the entire page on a black background. The flags of all 48 qualified nations
outline the negative space along the trophy's silhouette, with the five USMNT opponents
(Australia, Belgium, Bosnia & Herzegovina, Paraguay, Türkiye) rendered larger wherever
they appear. The sections follow the workflow Guiding Question → Data → Methods of
Analysis → Results (three parts, one per finding) → Takeaways & Implications, written in
first person and closely following the paper's own language. All four figures from the
paper are embedded, and Figure 1's three panels (country / football / culture pageviews)
are toggleable. A soccer ball orbits the globe at the head of the trophy — vanishing as
it passes behind and pulling a faint trail — and each section reveals with a scroll
animation (disabled under `prefers-reduced-motion`).

Typography is the FWC26 World Cup 26 family (Normal + Ultra Condensed), via the
[wc26.bogachev.fr](https://wc26.bogachev.fr/) project.

## Stack

- React 19 + Vite
- [flag-icons](https://github.com/lipis/flag-icons) for the 48 national flags; the
  trophy and summary charts are hand-built SVG

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Structure

- `src/App.jsx` — page content: header, hero + the five workflow sections
- `src/components/TrophySpine.jsx` — full-height trophy (globe, figure, stem, banded
  base) + contour-following flags
- `src/teams.jsx` — the 48 qualified nations and their flags
- `src/components/Figures.jsx` — embedded paper figures, incl. the Fig. 1 toggle
- `src/components/Charts.jsx` — bar list and the exponential-decay figure
- `src/assets/figures/` — figures extracted from the paper PDF
- `src/fonts/` — FWC26 WOFF2 files
