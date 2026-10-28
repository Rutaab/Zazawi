import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import {
  getCategoryTips,
  TIP_CATEGORIES,
} from '../data/tips/index.js'
import { breadcrumbLd, itemListLd, useSeo } from '../lib/seo.js'

export default function HealthTips() {
  const total = TIP_CATEGORIES.reduce(
    (sum, c) => sum + getCategoryTips(c.id).length,
    0,
  )

  useSeo({
    title: 'Health Tips & Promotions',
    description:
      'Browse pharmacist-reviewed health tips and promotions across immunity, nutrition, hydration, mental wellness, child care, chronic care and more \u2014 practical advice you can use today.',
    keywords: [
      'health tips',
      'wellness articles',
      'pharmacy advice',
      'health promotions',
      'self care',
    ],
    path: '/tips',
    jsonLd: [
      breadcrumbLd([
        { name: 'Home', path: '/dashboard' },
        { name: 'Health Tips & Promotions', path: '/tips' },
      ]),
      itemListLd({
        name: 'Health tip categories',
        url: '/tips',
        items: TIP_CATEGORIES.map((c) => ({
          name: c.name,
          path: `/tips/${c.id}`,
        })),
      }),
    ],
  })

  return (
    <div className="tips-shell">
      <TopBar
        back
        subtitle="Wellness library"
        title="Health Tips & Promotions"
        notifications={false}
      />

      <div className="tips-page">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <span className="crumb-current">Health Tips</span>
        </nav>

        <header className="tips-hero">
          <h1>Health Tips &amp; Promotions</h1>
          <p>
            Pharmacist-reviewed guidance across {TIP_CATEGORIES.length}{' '}
            categories and {total} articles \u2014 pick a topic to start
            reading.
          </p>
        </header>

        <div className="tips-cat-grid">
          {TIP_CATEGORIES.map((cat) => {
            const count = getCategoryTips(cat.id).length
            return (
              <Link
                key={cat.id}
                to={`/tips/${cat.id}`}
                className="tips-cat-card"
              >
                <span
                  className="tips-cat-icon"
                  style={{ background: cat.tint, color: cat.color }}
                >
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </span>
                <span className="tips-cat-info">
                  <strong>{cat.name}</strong>
                  <small>{cat.tagline}</small>
                </span>
                <span className="tips-cat-count">
                  {count}
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
