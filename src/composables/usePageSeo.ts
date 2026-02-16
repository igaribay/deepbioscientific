import { useHead } from '@unhead/vue'

const SITE_NAME = 'DeepBio Scientific'
const SITE_URL = 'https://deepbioscientific.com'
const DEFAULT_IMAGE = `${SITE_URL}/deepbio-logo.png`

interface PageSeoOptions {
  title: string
  description: string
  path: string
  image?: string
  type?: string
}

export function usePageSeo({ title, description, path, image, type = 'website' }: PageSeoOptions) {
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = `${SITE_URL}${path}`
  const ogImage = image || DEFAULT_IMAGE

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: SITE_NAME },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: canonicalUrl },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  })
}
