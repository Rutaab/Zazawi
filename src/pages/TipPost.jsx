import { Link, Navigate, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'
import {
  getCategory,
  getRelatedTips,
  getTip,
  readTimeFor,
} from '../data/tips/index.js'
import {
  articleLd,
  breadcrumbLd,
  faqLd,
  useSeo,
} from '../lib/seo.js'

function formatUpdated(value) {
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

export default function TipPost() {
  const { categoryId, tipId } = useParams()
  const cat = getCategory(categoryId)
  const tip = cat ? getTip(cat.id, tipId) : null
  const path = `/tips/${categoryId}/${tipId}`
  const related = tip ? getRelatedTips(cat.id, tip.slug) : []

  useSeo({
    title: tip ? tip.title : 'Health Tips',
    description: tip?.excerpt,
    keywords: tip?.tags,
    path,
    type: 'article',
    publishedTime: tip?.updated,
    modifiedTime: tip?.updated,
    jsonLd:
      tip && cat
        ? [
            articleLd({ tip, category: cat, path }),
            faqLd(tip.faq),
            breadcrumbLd([
              { name: 'Home', path: '/dashboard' },
              { name: 'Health Tips & Promotions', path: '/tips' },
              { name: cat.name, path: `/tips/${cat.id}` },
              { name: tip.title, path },
            ]),
          ]
        : undefined,
  })

  if (!cat) return <Navigate to="/tips" replace />
  if (!tip) return <Navigate to={`/tips/${cat.id}`} replace />

  return (
    <div className="tips-shell tips-shell-post">
      <TopBar
        back
        subtitle={cat.name}
        title="Health Tip"
        notifications={false}
      />

      <article className="tips-page post" itemScope itemType="https://schema.org/Article">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link to="/dashboard">Home</Link>
          <span>/</span>
          <Link to="/tips">Health Tips</Link>
          <span>/</span>
          <Link to={`/tips/${cat.id}`}>{cat.name}</Link>
          <span>/</span>
          <span className="crumb-current">{tip.title}</span>
        </nav>

        <header className="post-head">
          <Link
            to={`/tips/${cat.id}`}
            className="post-cat"
            style={{ background: cat.tint, color: cat.color }}
          >
            <span className="material-symbols-outlined">{cat.icon}</span>
            {cat.name}
          </Link>
          <h1 itemProp="headline">{tip.title}</h1>
          <p className="post-lead" itemProp="description">
            {tip.intro}
          </p>
          <div className="post-meta">
            <span>
              <span className="material-symbols-outlined">schedule</span>
              {readTimeFor(tip)}
            </span>
            <span>
              <span className="material-symbols-outlined">update</span>
              Updated {formatUpdated(tip.updated)}
            </span>
            <span>
              <span className="material-symbols-outlined">verified</span>
              Pharmacist reviewed
            </span>
          </div>
        </header>

        <div className="post-body" itemProp="articleBody">
          {tip.sections.map((section) => (
            <section key={section.heading} className="post-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          <aside className="post-keypoints">
            <h2>Key takeaways</h2>
            <ul>
              {tip.keyPoints.map((point) => (
                <li key={point}>
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </aside>

          {tip.warning && (
            <div className="post-warning">
              <span className="material-symbols-outlined">warning</span>
              <p>{tip.warning}</p>
            </div>
          )}

          <section className="post-faq">
            <h2>Frequently asked questions</h2>
            {tip.faq.map((item) => (
              <details key={item.q} className="post-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </section>

          <div className="post-tags">
            {tip.tags.map((tag) => (
              <span key={tag} className="post-tag">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>

        <section className="post-cta">
          <div>
            <strong>Have a question about your medicine?</strong>
            <p>
              Chat with a licensed pharmacist or place an order from a nearby
              pharmacy in minutes.
            </p>
          </div>
          <div className="post-cta-actions">
            <Link to="/ask-pharmacist" className="btn btn-primary">
              <span className="material-symbols-outlined">support_agent</span>
              Ask a pharmacist
            </Link>
            <Link to="/order/scan" className="btn btn-outline">
              <span className="material-symbols-outlined">qr_code_scanner</span>
              Order now
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="post-related">
            <h2>More in {cat.name}</h2>
            <div className="tips-list">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/tips/${cat.id}/${item.slug}`}
                  className="tip-card tip-card-link"
                >
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span className="tip-read">
                    <span className="material-symbols-outlined">schedule</span>
                    {readTimeFor(item)}
                    <span className="material-symbols-outlined arrow">
                      arrow_forward
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="tips-back-row">
          <Link to={`/tips/${cat.id}`} className="btn btn-outline">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to {cat.name}
          </Link>
          <Link to="/tips" className="btn btn-ghost">
            All categories
          </Link>
        </div>
      </article>
    </div>
  )
}
