import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const ssrDir = join(__dirname, '..', 'dist-ssr')

// All routes to prerender
const routes = [
  '/',
  '/technology',
  '/research',
  '/case-studies',
  '/about',
  '/contact',
]

async function prerender() {
  // Read the client-built index.html as template
  const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

  // Import the SSR build
  const { render } = await import(join(ssrDir, 'entry-server.js'))

  for (const route of routes) {
    console.log(`Prerendering ${route}...`)

    const { appHtml, headPayload } = await render(route)

    // Inject the rendered app HTML into the template
    let html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)

    // Replace hardcoded meta tags with SSR page-specific ones only if SSR provides them
    if (headPayload.headTags) {
      const tags = headPayload.headTags

      // Only strip hardcoded tags if SSR provides replacements
      if (tags.includes('<title>')) {
        html = html.replace(/\s*<title>[^<]*<\/title>/, '')
      }
      if (tags.includes('name="description"')) {
        html = html.replace(/\s*<meta name="description" content="[^"]*"\s*\/>/, '')
      }
      if (tags.includes('name="robots"')) {
        html = html.replace(/\s*<meta name="robots" content="[^"]*"\s*\/>/, '')
      }
      if (tags.includes('rel="canonical"')) {
        html = html.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/>/, '')
      }
      if (tags.includes('property="og:')) {
        html = html.replace(/\s*<meta property="og:[^"]*" content="[^"]*"\s*\/>/g, '')
      }
      if (tags.includes('name="twitter:')) {
        html = html.replace(/\s*<meta name="twitter:[^"]*" content="[^"]*"\s*\/>/g, '')
      }

      // Inject SSR head tags
      html = html.replace('</head>', `${tags}\n</head>`)
    }
    if (headPayload.bodyAttrs) {
      html = html.replace('<body>', `<body ${headPayload.bodyAttrs}>`)
    }
    if (headPayload.bodyTagsOpen) {
      html = html.replace('<body>', `<body>\n${headPayload.bodyTagsOpen}`)
    }
    if (headPayload.bodyTags) {
      html = html.replace('</body>', `${headPayload.bodyTags}\n</body>`)
    }
    if (headPayload.htmlAttrs) {
      html = html.replace('<html lang="en">', `<html lang="en" ${headPayload.htmlAttrs}>`)
    }

    // Write to the correct path
    const filePath = route === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route, 'index.html')

    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, html)
    console.log(`  -> ${route === '/' ? 'index.html' : route + '/index.html'}`)
  }

  console.log(`\nPrerendered ${routes.length} pages with full HTML content`)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
