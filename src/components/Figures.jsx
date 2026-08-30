import { useState } from 'react'
import fig1Country from '../assets/figures/fig1-country.png'
import fig1Football from '../assets/figures/fig1-football.png'
import fig1Culture from '../assets/figures/fig1-culture.png'
import fig2 from '../assets/figures/fig2-subcategory.png'
import fig3 from '../assets/figures/fig3-articles.png'
import fig4 from '../assets/figures/fig4-cities.png'

// Explicit aspect ratios reserve layout space before the images load.
export function PaperFigure({ src, alt, caption, ratio }) {
  return (
    <figure className="paperfig">
      <img src={src} alt={alt} loading="lazy" style={{ aspectRatio: ratio }} />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

const FIG1_VIEWS = [
  { id: 'country', label: 'Country pages', src: fig1Country, alt: 'Wikipedia country main-page engagement by searched country: pageview ratios spike on match day for all five opponents' },
  { id: 'football', label: 'Football pages', src: fig1Football, alt: 'Wikipedia national football team page engagement by searched country: the sharpest match-day spikes, a mean of 25.9 times baseline' },
  { id: 'culture', label: 'Culture pages', src: fig1Culture, alt: 'Wikipedia culture subcategory engagement by searched country: a mellower mean spike of 3.3 times baseline' },
]

export function Fig1Toggle() {
  const [view, setView] = useState('country')
  const active = FIG1_VIEWS.find((v) => v.id === view)
  return (
    <figure className="paperfig">
      <div className="fig-toggle" role="tablist" aria-label="Figure 1 panels">
        {FIG1_VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            className={view === v.id ? 'active' : ''}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <img src={active.src} alt={active.alt} style={{ aspectRatio: '1500 / 1550' }} />
      <figcaption>
        <strong>Fig. 1.</strong> Ratio of Wikipedia pageviews to baseline for each country the
        U.S. played, 05/26 to 08/20/2026. The dotted red line marks the match date and the dashed
        black line the fitted exponential decay. Toggle between country main pages, national
        football team pages, and culture subcategories.
      </figcaption>
    </figure>
  )
}

export function Fig2() {
  return (
    <PaperFigure
      src={fig2}
      ratio="1500 / 1071"
      alt="Proportion of excess pageviews above baseline by culture, history, and society subcategories for each country"
      caption={
        <>
          <strong>Fig. 2.</strong> Share of post-match excess views by subcategory: culture
          (green), history (yellow), and society (blue), with error bars in black.
        </>
      }
    />
  )
}

export function Fig3() {
  return (
    <PaperFigure
      src={fig3}
      ratio="777 / 389"
      alt="Articles with the largest share of post-match excess views for each country, from History of Bosnia and Herzegovina to Manneken Pis"
      caption={
        <>
          <strong>Fig. 3.</strong> The article with the largest share of each country&rsquo;s
          post-match excess views, with error bars in black.
        </>
      }
    />
  )
}

export function Fig4() {
  return (
    <PaperFigure
      src={fig4}
      ratio="1500 / 1414"
      alt="Logarithmically scaled weekly Google search proportions for match versus cultural keywords across the 11 host cities and Chicago"
      caption={
        <>
          <strong>Fig. 4.</strong> Log-scaled weekly Google search proportions for match keywords
          (dotted) versus cultural keywords (solid) in the 11 host cities plus Chicago, IL. The
          two solid black lines mark the start and end of the 2026 World Cup.
        </>
      }
    />
  )
}
