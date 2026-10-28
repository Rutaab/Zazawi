import { Link, Navigate, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import {
  getCategory,
  getCategoryTips,
  readTimeFor,
} from '../data/tips/index.js'
import { breadcrumbLd, itemListLd, useSeo } from '../lib/seo.js'

export default function TipsCategory() {
  const { categoryId } = useParams()
  const cat = getCategory(categoryId)
  const tips = cat ? getCategoryTips(cat.id) : []

  useSeo({
    title: cat ? `${cat.name} \u2014 Health Tips` : 'Health Tips',
    description: cat
      ? `${cat.description} ${tips.length} practical, pharmacist-reviewed articles in the ${cat.name} category.`
      : undefined,
    keywords: cat?.keywords,
    path: `/tips/${categoryId}`,
    jsonLd: cat
      ? [
          breadcrumbLd([
            { name: 'Home', path: '/dashboard' },
            { name: 'Health Tips & Promotions', path: '/tips' },
            { name: cat.name, path: `/tips/${cat.id}` },
          ]),
          itemListLd({
            name: `${cat.name} health tips`,
            url: `/tips/${cat.id}`,
            items: tips.map((t) => ({
              name: t.title,
              path: `/tips/${cat.id}/${t.slug}`,
            })),
          }),
        ]
      : undefined,
  })

  if (!cat) return <Navigate to="/tips" replace />

  return (
    <div className="tips-shell">
      <TopBar
        back
        subtitle="Health Tips"
        title={cat.name}
        notifications={false}
      />

      <div className="tips-page">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <Link to="/tips">Health Tips</Link>
          <span>/</span>
          <span className="crumb-current">{cat.name}</span>
        </nav>

        <header className="tips-hero cat-hero">
          <span
            className="tips-cat-icon lg"
            style={{ background: cat.tint, color: cat.color }}
          >
            <span className="material-symbols-outlined">{cat.icon}</span>
          </span>
          <div>
            <h1>{cat.name}</h1>
            <p>{cat.description}</p>
            <span className="tips-hero-meta">
              {tips.length} articles in this category
            </span>
          </div>
        </header>

        <div className="tips-list">
          {tips.map((tip) => (
            <Link
              key={tip.id}
              to={`/tips/${cat.id}/${tip.slug}`}
              className="tip-card tip-card-link"
            >
              <div className="tip-card-head">
                <span
                  className="tip-icon"
                  style={{ background: cat.tint, color: cat.color }}
                >
                  <span className="material-symbols-outlined">
                    {cat.icon}
                  </span>
                </span>
                <span className="tip-cat" style={{ color: cat.color }}>
                  {cat.name}
                </span>
              </div>
              <h2>{tip.title}</h2>
              <p>{tip.excerpt}</p>
              <span className="tip-read">
                <span className="material-symbols-outlined">schedule</span>
                {readTimeFor(tip)}
                <span className="material-symbols-outlined arrow">
                  arrow_forward
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="tips-back-row">
          <Link to="/tips" className="btn btn-outline">
            <span className="material-symbols-outlined">arrow_back</span>
            All categories
          </Link>
        </div>
      </div>
    </div>
  )
}
