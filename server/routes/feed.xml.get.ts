import { Feed } from 'feed'

export default defineEventHandler(async (event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const author = {
    name: 'Spencer Sharp',
    email: 'spencer@planetaria.tech',
  }

  const feed = new Feed({
    title: author.name,
    description: 'Your blog description',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  // Get all articles - for now using a simpler approach
  // In a full implementation, you'd want to parse the content directory
  const articles = [
    {
      title: 'Sample Article',
      _path: '/articles/sample',
      date: new Date().toISOString(),
      description: 'A sample article for the RSS feed'
    }
  ]

  for (const article of articles) {
    const publicUrl = `${siteUrl}/articles/${article._path?.replace('/articles/', '') || 'sample'}`
    
    feed.addItem({
      title: article.title || 'Untitled',
      id: publicUrl,
      link: publicUrl,
      content: article.description || '',
      author: [author],
      contributor: [author],
      date: new Date(article.date || Date.now()),
    })
  }

  setHeader(event, 'content-type', 'application/xml')
  setHeader(event, 'cache-control', 's-maxage=31556952')
  
  return feed.rss2()
})