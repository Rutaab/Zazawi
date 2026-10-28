import { useEffect, useMemo } from 'react'

const SITE_NAME = 'Zazawi'

function origin() {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({
  title,
  description,
  keywords,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  jsonLd,
}) {
  const jsonLdKey = useMemo(
    () => (jsonLd ? JSON.stringify(jsonLd) : ''),
    [jsonLd],
  )

  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} \u2014 Instant Medicine Ordering`
    document.title = fullTitle

    const canonical = `${origin()}${path || window.location.pathname}`
    const ogImage = image || `${origin()}/favicon.svg`

    upsertMeta('name', 'description', description)
    if (keywords?.length) {
      upsertMeta('name', 'keywords', keywords.join(', '))
    }
    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:image', ogImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:url', canonical)
    upsertMeta('name', 'twitter:image', ogImage)

    if (publishedTime) {
      upsertMeta('property', 'article:published_time', publishedTime)
    }
    if (modifiedTime) {
      upsertMeta('property', 'article:modified_time', modifiedTime)
    }

    const scripts = []
    if (jsonLdKey) {
      const blocks = JSON.parse(jsonLdKey)
      const list = Array.isArray(blocks) ? blocks : [blocks]
      list.forEach((block) => {
        const s = document.createElement('script')
        s.type = 'application/ld+json'
        s.setAttribute('data-seo', 'jsonld')
        s.textContent = JSON.stringify(block)
        document.head.appendChild(s)
        scripts.push(s)
      })
    }

    return () => scripts.forEach((s) => s.remove())
  }, [
    title,
    description,
    keywords,
    path,
    image,
    type,
    publishedTime,
    modifiedTime,
    jsonLdKey,
  ])
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${origin()}${it.path}`,
    })),
  }
}

export function articleLd({ tip, category, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tip.title,
    description: tip.excerpt,
    articleSection: category.name,
    keywords: tip.tags.join(', '),
    datePublished: tip.updated,
    dateModified: tip.updated,
    inLanguage: 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${origin()}${path}`,
    },
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${origin()}/favicon.svg`,
      },
    },
  }
}

export function faqLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function itemListLd({ name, url, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: `${origin()}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${origin()}${it.path}`,
    })),
  }
}
