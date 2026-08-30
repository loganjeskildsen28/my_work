import { useEffect, useRef, useState } from 'react'
import './App.css'
import TrophySpine from './components/TrophySpine'
import { OPPONENTS, TeamFlag } from './teams.jsx'
import { BarList } from './components/Charts'
import { Fig1Toggle, Fig2, Fig3, Fig4 } from './components/Figures'

const STEPS = [
  { id: 'question', label: 'Guiding Question' },
  { id: 'data', label: 'Data' },
  { id: 'method', label: 'Methods of Analysis' },
  { id: 'result', label: 'Results' },
  { id: 'takeaway', label: 'Takeaways & Implications' },
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

function Section({ id, index, accent, kicker, title, children }) {
  const [ref, visible] = useReveal()
  return (
    <section id={id} className="section" style={{ '--accent': accent }}>
      <div ref={ref} className={`section-content reveal${visible ? ' is-visible' : ''}`}>
        <p className="kicker">
          <span className="kicker-num">{String(index).padStart(2, '0')}</span> {kicker}
        </p>
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="page">
      <header className="topbar">
        <span className="topbar-name">Logan Eskildsen</span>
        <nav className="topbar-nav" aria-label="Project workflow">
          {STEPS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              <span className="kicker-num">{String(i + 1).padStart(2, '0')}</span> {s.label}
            </a>
          ))}
        </nav>
        <span className="topbar-meta">QSS020 · X26</span>
      </header>

      <div className="trophy-zone">
        <TrophySpine />

        <section className="hero">
          <p className="hero-kicker">QSS020 · X26</p>
          <h1 className="hero-title">
            Ball is<br />Life?
          </h1>
          <p className="hero-sub">
            A statistical analysis of American cross-cultural versus match engagement during the
            2026 World Cup.
          </p>
        </section>

        <Section id="question" index={1} accent="var(--acc-gold)" kicker="Guiding Question"
          title="How effective is the World Cup at creating lasting cultural links?">
          <p>
            From a sea of Norwegians rowing in Times Square to thirsty Scots drinking Boston bars
            dry, the 2026 World Cup brought global competition and culture to the United States.
            Fans filled 6.8 million seats, 62.8 million viewers watched the final match, and the
            FIFA fan festivals drew more than 9 million attendees, the highest since Germany in
            2006.
          </p>
          <p>
            Extensive literature covers the cultural and diplomatic benefits of the World Cup at
            the institutional level, but no accessible study quantifies cultural engagement on an
            individual level.
          </p>
          <blockquote className="pull">
            In the age of low attention spans and news cycles that give whiplash, how effective is
            the World Cup at creating lasting cultural links between individuals?
          </blockquote>
          <div className="stat-grid">
            <div className="stat"><span className="stat-num">48</span><span className="stat-label">nations</span></div>
            <div className="stat"><span className="stat-num">6.8M</span><span className="stat-label">seats filled</span></div>
            <div className="stat"><span className="stat-num">62.8M</span><span className="stat-label">final viewers</span></div>
            <div className="stat"><span className="stat-num">135km</span><span className="stat-label">of hot dogs</span></div>
          </div>
        </Section>

        <Section id="data" index={2} accent="var(--acc-malachite)" kicker="Data"
          title="Wikipedia pageviews and Google search trends, May 17 to August 20, 2026.">
          <p>
            Raw Wikipedia pageview and Google Search trend data was pulled for the window from 33
            days before the tournament to 33 days after, for every country the United States
            faced:
          </p>
          <div className="flag-legend">
            {OPPONENTS.map((t) => (
              <span className="flag-item" key={t.code}>
                <TeamFlag team={t} width={44} /> {t.name}
              </span>
            ))}
          </div>
          <p>
            Wikipedia, through the MediaWiki API, provides quantifiable daily pageviews for every
            article in each opponent&rsquo;s culture, history, and society subcategories, along
            with the country main page and national football team page. Google Trends discloses
            only the proportion of searches over time, so search interest for cultural keywords
            (<em>{'{country}'} history, culture</em>) versus match keywords (<em>{'{country}'}{' '}
            World Cup, soccer</em>) was compared across the eleven host cities, with Chicago as a
            non-host control.
          </p>
          <div className="datacard-grid">
            <div className="datacard"><code>article_views.csv</code><span>110,164 rows · daily pageviews for all cultural articles</span></div>
            <div className="datacard"><code>football_views.csv</code><span>480 rows · national football team pages</span></div>
            <div className="datacard"><code>country_article_views.csv</code><span>480 rows · country main pages</span></div>
            <div className="datacard"><code>regional_search_interest.csv</code><span>5,088 → 795 rows · host-city search proportions</span></div>
          </div>
          <p className="fineprint">
            The Wikipedia dataset is limited in its integrity by bot and data-scraper traffic,
            and the English-language API cannot isolate American readers.
          </p>
        </Section>

        <Section id="method" index={3} accent="var(--acc-copper)" kicker="Methods of Analysis"
          title="Scrape, merge and clean, then fit an exponential decay.">
          <ol className="method-steps">
            <li>
              <strong>Data scraping.</strong> User-defined functions around the MediaWiki API
              pulled subcategory titles, articles, and pageviews for each country; pytrends
              pulled geo-coded search interest for every host city.
            </li>
            <li>
              <strong>Merging and cleaning.</strong> The ten days before the cup (May 17 to 26)
              served as a baseline. Per-article baseline statistics were joined onto the
              post-cup data, expressing every daily pageview as a ratio to its own baseline mean.
            </li>
            <li>
              <strong>Curve fitting and statistical analysis.</strong> SciPy fit each timeseries
              to an exponential decay, excess views were decomposed by subcategory with
              propagated errors, and search proportions were scaled with <code>np.log1p</code>.
            </li>
          </ol>
          <div className="formula">
            <span className="formula-math">(A − 1)e<sup>−λt</sup> + 1</span>
            <span className="formula-note">
              A = peak ratio to baseline near the match · t = days since the match ·
              β = ln 2 ⁄ λ, the marginal half-life of engagement
            </span>
          </div>
        </Section>

        <Section id="result" index={4} accent="var(--acc-gold)" kicker="Results · I of III"
          title="Pageviews spiked up to 51.5 times above baseline, then decayed within a day.">
          <p>
            Wikipedia pageviews on each country&rsquo;s main page rose 1.9 to 51.5 times above
            baseline after a matchup, with an inverse relationship between country size and
            engagement. Well-known Australia and Turkey incurred smaller deviations (1.9μ and
            4.9μ) than lesser-known Paraguay and Bosnia and Herzegovina (33.8μ and 51.5μ).
            Football team pages skyrocketed to a mean of 25.9μ while culture subcategories rose a
            consistently mellow 3.3μ: Americans prioritized background information on opponents.
          </p>
          <BarList
            title="Peak country-page views, ratio to baseline"
            color="var(--acc-gold)"
            unit="×"
            items={[
              { label: 'Bosnia & Herz.', value: 51.5 },
              { label: 'Paraguay', value: 33.8 },
              { label: 'Türkiye', value: 4.9 },
              { label: 'Australia', value: 1.9 },
            ]}
          />
          <p>
            With the exception of Australia, the marginal half-life of engagement fell below half
            a day for every category (β &lt; 0.5 d), and the difference between match and
            cultural half-lives (Δβ = 0.103 ± 0.14 d) is not statistically significant. American
            curiosity was confined to the day of and day after the match.
          </p>
          <Fig1Toggle />
        </Section>

        <Section id="result-2" index={4} accent="var(--acc-gold)" kicker="Results · II of III"
          title="Histories of unfamiliar countries, quirks of familiar ones.">
          <p>
            Americans engaged most with the culture of Australia (91.9%) and Belgium (37.4%) but
            the history of Bosnia and Herzegovina (78.8%), Turkey (73.3%), and Paraguay (58.8%).
            They educated themselves on the lesser-known countries&rsquo; histories while feeling
            comfortable enough to explore the culture of well-known countries.
          </p>
          <Fig2 />
          <p>
            The top articles repeat the pattern: History of Bosnia and Herzegovina (73.5%) and
            History of Paraguay (58.9%) against quirkier cultural results like Vegemite (63.5%)
            and Manneken Pis (23.4%).
          </p>
          <Fig3 />
        </Section>

        <Section id="result-3" index={4} accent="var(--acc-gold)" kicker="Results · III of III"
          title="Match interest died with the tournament; cultural interest lingered.">
          <p>
            Host-city search trends largely corroborated the Wikipedia data (r ≈ 0.86). After the
            tournament, most match interest waned to zero, whereas residual cultural engagement
            in Los Angeles, New York, Miami, Houston, Chicago, and Seattle persisted into August.
            The five host cities on that list correspond to the cities with the five highest
            immigrant populations, an auxiliary correlation between immigrant population and
            curiosity for other cultures.
          </p>
          <Fig4 />
        </Section>

        <Section id="takeaway" index={5} accent="var(--acc-champagne)" kicker="Takeaways & Implications"
          title="A sharp, transient boost, with hints of something slower-growing.">
          <ul className="takeaway-list">
            <li>
              The World Cup generated a sharp, transient boost in American engagement with other
              countries: up to 50 times above baseline near the match date, decaying back within
              a day.
            </li>
            <li>
              Americans interacted with the history of lesser-known countries to develop a better
              background, and pursued cultural information on well-known opponents.
            </li>
            <li>
              Cultural information kept being pursued after the tournament in the host cities
              with the highest immigrant populations.
            </li>
          </ul>
          <blockquote className="pull">
            The pattern resembles Blackout Tuesday. In June 2020, millions posted black squares
            in a single day, and that engagement collapsed just as quickly. Yet over the
            following six years, consumers engaged less with corporations that stayed silent that
            day. A one-day spike can still shape behavior on a scale of years, and the same
            drawn-out engagement may be observed for this World Cup.
          </blockquote>
          <p>
            Previous studies show the World Cup induces memory much like a war or other major
            historical event. Revisiting these methods in five years could reveal a steady
            increase in cultural engagement that a 33-day window cannot capture.
          </p>
          <p className="fineprint">
            Acknowledgments: Professor Chang, for two consultation sessions introducing the
            regression coefficient style plot, and the MediaWiki and Google Trends APIs for their
            publicly accessible databases.
          </p>
        </Section>

        <footer className="footer">
          <div className="footer-inner">
            <p>
              <strong>Logan Eskildsen</strong> · QSS020 · X26 · Dartmouth College
            </p>
            <p className="fineprint">
              Type set in the FWC26 family, via the{' '}
              <a href="https://wc26.bogachev.fr/" target="_blank" rel="noreferrer">
                wc26.bogachev.fr
              </a>{' '}
              project. Built with React + Vite.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
