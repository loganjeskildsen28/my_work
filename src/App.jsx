import './App.css'
import TrophySpine from './components/TrophySpine'
import { Flag, FLAG_LIST } from './components/Flags'
import { BarList, DecayCurve } from './components/Charts'

const STEPS = [
  { id: 'question', label: 'Question' },
  { id: 'data', label: 'Data' },
  { id: 'method', label: 'Method' },
  { id: 'result', label: 'Result' },
  { id: 'takeaway', label: 'Takeaway' },
]

function Section({ id, index, side, accent, kicker, title, children }) {
  return (
    <section id={id} className={`band section side-${side}`} style={{ '--accent': accent }}>
      <div className="section-content">
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
      <TrophySpine />

      <header className="band hero">
        <div className="hero-left">
          <p className="kicker hero-kicker">QSS020 · Final Project · Term X26</p>
          <h1 className="hero-title">
            Ball is<br />Life?
          </h1>
          <p className="hero-sub">
            A statistical analysis of American cross-cultural versus match engagement during the
            2026 World Cup.
          </p>
        </div>
        <div className="hero-right">
          <div className="author-card">
            <p className="author-name">Logan Eskildsen</p>
            <p className="author-meta">Dartmouth College · Hanover, NH</p>
            <div className="chip-row">
              <span className="chip">QSS020</span>
              <span className="chip">X26</span>
              <span className="chip">Sport Analytics</span>
            </div>
            <nav className="step-nav" aria-label="Project workflow">
              {STEPS.map((s, i) => (
                <a key={s.id} href={`#${s.id}`}>
                  <span className="kicker-num">{String(i + 1).padStart(2, '0')}</span> {s.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <Section id="question" index={1} side="left" accent="var(--q-red)" kicker="The Question"
        title="Did the World Cup make Americans curious about anyone but the score?">
        <p>
          The 2026 World Cup brought 48 nations into the global spotlight, with games on U.S. soil
          for the first time since 1994. Fans filled 6.8 million seats, 62.8 million people watched
          the final, more than 9 million turned up to FIFA fan festivals — and America ate roughly
          135 kilometers of hot dogs along the way.
        </p>
        <p>
          The cup produced real cross-cultural moments: Lawrence, Kansas hosted the Algerian
          national team and its high-school marching band learned Algeria&rsquo;s anthem; Spanish
          players unfurled a <em>&ldquo;¡Gracias Chattanooga!&rdquo;</em> banner for their Tennessee
          hosts. But in an age of low attention spans and whiplash news cycles, the question this
          project asks is:
        </p>
        <blockquote className="pull">
          To what extent did Americans engage with the <strong>culture</strong> of the countries the
          U.S. played — their history, culture, and society — compared to plain interest in the
          match itself? And did any of that engagement last?
        </blockquote>
        <div className="stat-grid">
          <div className="stat"><span className="stat-num">48</span><span className="stat-label">nations</span></div>
          <div className="stat"><span className="stat-num">6.8M</span><span className="stat-label">seats filled</span></div>
          <div className="stat"><span className="stat-num">62.8M</span><span className="stat-label">final viewers</span></div>
          <div className="stat"><span className="stat-num">135km</span><span className="stat-label">of hot dogs</span></div>
        </div>
      </Section>

      <Section id="data" index={2} side="right" accent="var(--d-blue)" kicker="The Data"
        title="Wikipedia pageviews and Google searches, 33 days before to 33 days after.">
        <p>
          Raw engagement data covers <strong>May 17 – August 20, 2026</strong> for every country the
          U.S. faced in the tournament:
        </p>
        <div className="flag-legend">
          {FLAG_LIST.filter((f) => f.id !== 'usa').map((f) => (
            <span className="flag-item" key={f.id}>
              <Flag id={f.id} name={f.name} width={38} /> {f.name}
            </span>
          ))}
        </div>
        <p>
          <strong>Wikipedia pageviews.</strong> Through the MediaWiki API, daily pageviews were
          pulled for every article in each opponent&rsquo;s culture, history, and society
          subcategories, plus the country main page and national football team page —
          110,164 rows of article-level pageview data in all.
        </p>
        <p>
          <strong>Google Search Trends.</strong> The pytrends library captured the weekly proportion
          of culture-related searches (<em>{'{country}'} history, {'{country}'} culture</em>) versus
          match-related searches (<em>{'{country}'} World Cup, {'{country}'} soccer</em>) across the
          eleven U.S. host cities, with Chicago as a non-host control.
        </p>
        <div className="datacard-grid">
          <div className="datacard"><code>article_views.csv</code><span>110,164 rows · daily pageviews for all cultural articles</span></div>
          <div className="datacard"><code>football_views.csv</code><span>480 rows · national football team pages</span></div>
          <div className="datacard"><code>country_article_views.csv</code><span>480 rows · country main pages</span></div>
          <div className="datacard"><code>regional_search_interest.csv</code><span>5,088 → 795 rows · host-city search proportions</span></div>
        </div>
        <p className="fineprint">
          Known limitations: Wikipedia data includes bot and scraper traffic (notably on the first
          of each month), and the English-language API cannot separate Americans from other
          English-speaking readers.
        </p>
      </Section>

      <Section id="method" index={3} side="left" accent="var(--m-green)" kicker="The Method"
        title="Scrape, merge, then fit an exponential decay to the curiosity.">
        <ol className="method-steps">
          <li>
            <strong>Scrape.</strong> Custom MediaWiki functions walked each country&rsquo;s
            subcategories, articles, and pageviews; pytrends pulled geo-coded search interest for
            every host city.
          </li>
          <li>
            <strong>Merge &amp; clean.</strong> The ten days before the cup (May 17–26) served as a
            baseline window. Baseline means and standard deviations were computed per article, then
            left-joined onto the post-May 26 data so every daily pageview could be expressed as a
            ratio to its own baseline.
          </li>
          <li>
            <strong>Fit &amp; analyze.</strong> SciPy fit each country&rsquo;s engagement ratio to
            an exponential decay, excess views were decomposed by subcategory with propagated
            errors, and search proportions were log-scaled with <code>np.log1p</code> to compare
            cultural against match interest city by city.
          </li>
        </ol>
        <div className="formula">
          <span className="formula-math">(A − 1)e<sup>−λt</sup> + 1</span>
          <span className="formula-note">
            A = peak ratio to baseline near the match · t = days since the match ·
            β = ln 2 ⁄ λ, the marginal half-life of engagement
          </span>
        </div>
        <DecayCurve />
      </Section>

      <Section id="result" index={4} side="right" accent="var(--r-gold)" kicker="The Result"
        title="Curiosity spiked up to 51× baseline — and was gone within a day.">
        <p>
          Every matchup sent Americans to their opponent&rsquo;s Wikipedia pages. Main-page views
          rose 1.9× to 51.5× above baseline, with an inverse relationship between how familiar a
          country is and how hard its pages spiked: well-known Australia barely moved while Paraguay
          and Bosnia &amp; Herzegovina soared.
        </p>
        <BarList
          title="Peak country-page views, ratio to baseline"
          color="var(--r-gold)"
          unit="×"
          items={[
            { label: 'Paraguay', value: 51.5 },
            { label: 'Bosnia & Herz.', value: 33.8 },
            { label: 'Türkiye', value: 4.9 },
            { label: 'Australia', value: 1.9 },
          ]}
        />
        <p>
          But the interest decayed almost immediately. The marginal half-life of engagement fell
          below half a day for every country except Australia — β<sub>match</sub> = 0.379 d and
          β<sub>culture</sub> = 0.276 d, a difference (Δβ = 0.103 ± 0.14 d) with no statistical
          significance. Cultural curiosity died just as fast as match curiosity.
        </p>
        <p>
          What Americans read while it lasted is telling: they studied the <strong>history</strong>{' '}
          of lesser-known countries and the <strong>quirky culture</strong> of familiar ones.
        </p>
        <BarList
          title="Largest share of post-match excess views by article"
          color="var(--r-gold)"
          unit="%"
          items={[
            { label: 'History of Bosnia & Herz.', value: 73.5 },
            { label: 'Vegemite (Australia)', value: 63.5 },
            { label: 'History of Paraguay', value: 58.9 },
            { label: 'Name of Türkiye', value: 46.8 },
            { label: 'Manneken Pis (Belgium)', value: 23.4 },
          ]}
        />
        <p>
          Host-city Google searches told the same story (r ≈ 0.86 with the Wikipedia data) — with
          one exception. After the cup, match searches waned to zero everywhere, but residual{' '}
          <strong>cultural</strong> searches persisted into August in Los Angeles, New York, Miami,
          Houston, and Seattle — and the host cities among the nation&rsquo;s five largest immigrant
          populations led that persistence.
        </p>
      </Section>

      <Section id="takeaway" index={5} side="left" accent="var(--t-purple)" kicker="The Takeaway"
        title="A sharp, transient boost — except where immigrant communities kept it alive.">
        <ul className="takeaway-list">
          <li>
            The World Cup genuinely inspired Americans to look up other nations — up to 50× normal
            interest — but that curiosity was confined to the day of and the day after the match.
          </li>
          <li>
            Americans gave themselves background briefings on unfamiliar opponents (History of
            Bosnia, History of Paraguay) while indulging in cultural quirks of familiar ones
            (Vegemite, Manneken Pis).
          </li>
          <li>
            Sustained cross-cultural engagement showed up in exactly one place: host cities with the
            highest immigrant populations, where cultural searches were still elevated a month after
            the tournament.
          </li>
          <li>
            Prior work suggests the World Cup lodges in memory like a major historical event —
            revisiting these methods in five years could reveal whether 2026 planted slower-growing
            cultural links than a one-day pageview window can see.
          </li>
        </ul>
        <p className="fineprint">
          Acknowledgments: Professor Chang for two consultation sessions introducing the regression
          coefficient–style plots, and the MediaWiki and Google Trends APIs for their publicly
          accessible data.
        </p>
      </Section>

      <footer className="band footer">
        <div className="footer-inner">
          <p>
            <strong>Logan Eskildsen</strong> · QSS020 · Term X26 · Dartmouth College
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
  )
}
