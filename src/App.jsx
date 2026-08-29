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
            dry, the 2026 World Cup brought global competition and culture to the United States
            for the first time since the 2002 Winter Olympics. Fans engaged with the tournament in
            staggering numbers, filling 6.8 million seats and averaging 62.8 million viewers
            during the final match. The FIFA fan festivals saw more than 9 million fans in
            attendance, the highest since Germany in 2006. Also notably, fans consumed over 135
            kilometers worth of hot dogs during the cup, a likely cup record.
          </p>
          <p>
            The tournament highlighted positive cross-cultural exchanges along the way. The
            residents of Lawrence, Kansas hosted the Algerian national team, and the high school
            marching band played the team&rsquo;s national anthem to welcome the players.
            Slightly further south, Spanish players held a{' '}
            <em>&ldquo;¡Gracias Chattanooga!&rdquo;</em> banner to thank Tennesseans for their
            hospitality.
          </p>
          <p>
            There is extensive literature on the cultural and diplomatic benefits of the World
            Cup at the institutional level, but no accessible study quantifies cultural
            engagement on an individual level. That gap motivated this project:
          </p>
          <blockquote className="pull">
            In the age of low attention spans and news cycles that give whiplash, how effective is
            the World Cup at creating lasting cultural links between individuals? Did Americans
            seek out the <strong>culture</strong> of the countries the U.S. played, or just the
            match itself?
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
          <p>I studied the five countries the United States faced in the tournament:</p>
          <div className="flag-legend">
            {OPPONENTS.map((t) => (
              <span className="flag-item" key={t.code}>
                <TeamFlag team={t} width={44} /> {t.name}
              </span>
            ))}
          </div>
          <p>
            <strong>Wikipedia pageviews.</strong> Though Wikipedia may be rife with errors that
            confound research projects, it is the most popular open source digital library in the
            world. Through the MediaWiki API, I pulled daily pageviews for every article in each
            opponent&rsquo;s culture, history, and society subcategories, along with each
            country&rsquo;s main page and national football team page, from 33 days before the
            tournament to 33 days after.
          </p>
          <p>
            <strong>Google Search Trends.</strong> Google Trends does not disclose the quantity
            of searches, only their proportion over time. Using the pytrends library, I collected
            the weekly proportion of culture-related searches (<em>{'{country}'} history,{' '}
            {'{country}'} culture</em>) versus match-related searches (<em>{'{country}'} World
            Cup, {'{country}'} soccer</em>) for each of the eleven host cities, with Chicago as a
            non-host control.
          </p>
          <div className="datacard-grid">
            <div className="datacard"><code>article_views.csv</code><span>110,164 rows · daily pageviews for all cultural articles</span></div>
            <div className="datacard"><code>football_views.csv</code><span>480 rows · national football team pages</span></div>
            <div className="datacard"><code>country_article_views.csv</code><span>480 rows · country main pages</span></div>
            <div className="datacard"><code>regional_search_interest.csv</code><span>5,088 → 795 rows · host-city search proportions</span></div>
          </div>
          <p className="fineprint">
            One caveat: the Wikipedia dataset is limited in its integrity by bot and data-scraper
            traffic, particularly on the first of each month, and the U.S. played Bosnia and
            Herzegovina on July 1, a date that coincides with high bot traffic, so that spike
            could not be removed as an outlier. The English-language API also cannot separate
            Americans from other English-speaking readers.
          </p>
        </Section>

        <Section id="method" index={3} accent="var(--acc-copper)" kicker="Methods of Analysis"
          title="Scrape, merge and clean, then fit an exponential decay.">
          <ol className="method-steps">
            <li>
              <strong>Data scraping.</strong> I wrote functions around the MediaWiki API —{' '}
              <code>get_wikipedia_subcategories()</code>, <code>get_wikipedia_articles()</code>,
              and <code>get_wikipedia_pageviews()</code> — to walk each country&rsquo;s
              subcategories and collect pageviews for every article, and used pytrends to pull
              geo-coded search interest for each host city.
            </li>
            <li>
              <strong>Data merging and cleaning.</strong> The ten days before the cup (May 17–26)
              served as a baseline window. I computed baseline means and standard deviations per
              article, then left-joined them onto the post-May 26 data so that every daily
              pageview could be expressed as a ratio to its own baseline.
            </li>
            <li>
              <strong>Curve fitting and statistical analysis.</strong> I used SciPy to fit each
              country&rsquo;s engagement ratio to an exponential decay, decomposed excess views by
              subcategory with propagated errors, and log-scaled the search proportions with{' '}
              <code>np.log1p</code> to compare cultural against match interest city by city.
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

        <Section id="result" index={4} accent="var(--acc-gold)" kicker="Results — I of III"
          title="Pageviews spiked up to 51.5 times above baseline, then decayed within a day.">
          <p>
            Every U.S. matchup sent Americans to their opponent&rsquo;s Wikipedia pages. Views of
            each country&rsquo;s main page rose between 1.9 and 51.5 times above the baseline
            mean, and there was an inverse relationship between country size and engagement.
            Larger, well-known countries like Australia and Turkey incurred smaller deviations
            (1.9μ and 4.9μ), whereas lesser-known Paraguay and Bosnia and Herzegovina had far
            more drastic ones (33.8μ and 51.5μ). National football team pages skyrocketed with a
            mean deviation of 25.9μ, while the culture subcategories rose a consistently mellow
            3.3μ. Americans clearly prioritized background information on their opponents,
            especially the lesser-known nations.
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
            The curiosity was short-lived. With the exception of Australia, the marginal
            half-life of engagement fell below half a day for every category. Football pageviews
            averaged β<sub>match</sub> = 0.379 ± 0.07 d and cultural pageviews β
            <sub>culture</sub> = 0.276 ± 0.18 d; their difference, Δβ = 0.103 ± 0.14 d, is not
            statistically significant. The World Cup generated a sharp spike in cross-country
            engagement, but not a cultural engagement that outlasted match curiosity.
          </p>
          <Fig1Toggle />
        </Section>

        <Section id="result-2" index={4} accent="var(--acc-gold)" kicker="Results — II of III"
          title="Americans read the histories of unfamiliar countries and the quirks of familiar ones.">
          <p>
            The cultural spike, though smaller, deserved a closer look at what types of culture
            Americans were intentionally seeking out. Distributing each country&rsquo;s excess
            pageviews across its culture, history, and society subcategories shows that Americans
            engaged most with the <strong>culture</strong> of Australia (91.9%) and Belgium
            (37.4%), but with the <strong>history</strong> of Bosnia and Herzegovina (78.8%),
            Turkey (73.3%), and Paraguay (58.8%). Americans educated themselves on the
            lesser-known countries&rsquo; histories while feeling comfortable enough to explore
            the culture of countries they already knew.
          </p>
          <Fig2 />
          <p>
            The single articles with the largest share of each country&rsquo;s excess views
            repeat the pattern. The less familiar countries correlated with historical articles —
            History of Bosnia and Herzegovina (73.5%), History of Paraguay (58.9%), Name of
            Turkey (46.8%) — whereas the more familiar countries produced quirkier cultural
            results: Vegemite (63.5%) and Manneken Pis (23.4%).
          </p>
          <Fig3 />
        </Section>

        <Section id="result-3" index={4} accent="var(--acc-gold)" kicker="Results — III of III"
          title="Match interest died with the tournament; cultural interest lingered in immigrant hubs.">
          <p>
            Google Trends data from the host cities largely corroborated the Wikipedia pageviews
            (r ≈ 0.86). During the tournament window, match and cultural interest peaked
            together. Afterward, most match interest waned to zero, whereas residual cultural
            engagement in Los Angeles, New York, Miami, Houston, Chicago, and Seattle persisted
            into August. The five host cities on that list also correspond to the American cities
            with the five highest immigrant populations. Host cities did not sustain more
            cultural searching than the control overall, but there is an auxiliary correlation
            between immigrant population and curiosity about other cultures.
          </p>
          <Fig4 />
        </Section>

        <Section id="takeaway" index={5} accent="var(--acc-champagne)" kicker="Takeaways & Implications"
          title="A sharp, transient boost, with hints of something slower-growing.">
          <ul className="takeaway-list">
            <li>
              The World Cup generated a sharp, transient boost in American engagement with other
              countries and cultures. Engagement increased up to 50 times above baseline near the
              match date but exponentially decayed back to baseline within a day.
            </li>
            <li>
              Americans used that spike differently depending on the opponent: they interacted
              with the history of lesser-known countries to develop a better background, and
              pursued cultural information on well-known ones.
            </li>
            <li>
              Match-related searches dominated during the tournament itself, but cultural
              information kept being pursued afterward in the host cities with the highest
              immigrant populations.
            </li>
          </ul>
          <blockquote className="pull">
            The pattern closely resembles other social media trends of the 2020s, most clearly
            Blackout Tuesday. In June 2020, millions of users posted black squares in a single
            day; that engagement collapsed just as quickly as the match-day curiosity measured
            here. Yet the moment left a drawn-out mark — over the following six years, consumers
            engaged less with the corporations that stayed silent that day. A one-day spike, in
            other words, can still shape behavior on a scale of years. Perhaps the same drawn-out
            engagement will be observed for this World Cup.
          </blockquote>
          <p>
            That possibility is also this study&rsquo;s main limitation. Previous work has shown
            that the World Cup induces memory in a similar way to a war or other major historical
            event, and a 33-day window cannot capture effects on that timescale. It may prove
            useful to revisit these same methods in five years to test whether the 2026 World Cup
            produced a steady, slow increase in cultural engagement that this window could not
            see.
          </p>
          <p className="fineprint">
            Acknowledgments: thank you to Professor Chang for two consultation sessions during
            the week of 8/18, which introduced the regression coefficient style plot used here,
            and to the MediaWiki and Google Trends APIs for their publicly accessible databases.
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
