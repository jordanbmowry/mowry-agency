import { Feed } from 'feed';
import { createTimestamp, formatRSSDate } from '~/utils/dateUtils';

export default defineEventHandler(async (event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const author = {
    name: 'Mowry Agency',
    email: 'info@mowryagency.com',
  };

  const feed = new Feed({
    title: 'Mowry Agency - Insurance & Financial Insights',
    description:
      'Expert insights on life insurance, annuities, and financial planning from the Mowry Agency team. Stay informed with the latest industry news and guidance.',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Mowry Agency`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  });

  // Articles data - these should match your actual articles
  const articles = [
    {
      title:
        'Understanding Life Insurance: Term vs. Whole Life vs. Universal/IUL',
      _path: '/articles/understanding-life-insurance-types',
      date: '2025-10-07',
      description:
        'Choosing the right life insurance can feel overwhelming. Learn the key differences between Term Life, Whole Life, and Universal/Indexed Universal Life insurance to make an informed decision for your family.',
      author: 'Mowry Agency',
    },
    {
      title: 'Mortgage Protection Life Insurance: What You Need to Know',
      _path: '/articles/mortgage-protection-life-insurance',
      date: '2025-10-05',
      description:
        "Protect your family's home with mortgage protection life insurance. Learn how this specialized coverage works and whether it's right for your family's financial security.",
      author: 'Mowry Agency',
    },
    {
      title: 'Annuities: Pros and Cons for Retirement Planning',
      _path: '/articles/annuities-pros-cons',
      date: '2025-10-03',
      description:
        'Considering annuities for retirement? Understand the benefits and drawbacks of different annuity types to make an informed decision for your retirement planning.',
      author: 'Mowry Agency',
    },
  ];

  for (const article of articles) {
    const slug =
      article._path?.replace('/articles/', '') ||
      article._path?.split('/').pop() ||
      'article';
    const publicUrl = `${siteUrl}/articles/${slug}`;

    feed.addItem({
      title: article.title || 'Untitled',
      id: publicUrl,
      link: publicUrl,
      content: article.description || '',
      description: article.description || '',
      author: [
        {
          name: article.author || 'Mowry Agency',
          email: 'info@mowryagency.com',
        },
      ],
      contributor: [author],
      date: new Date(article.date || createTimestamp()),
      category: [{ name: 'Insurance' }, { name: 'Financial Planning' }],
    });
  }

  setHeader(event, 'content-type', 'application/xml');
  setHeader(event, 'cache-control', 's-maxage=31556952');

  return feed.rss2();
});
