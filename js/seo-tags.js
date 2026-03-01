// Shared SEO tags logic for all pages
function setupSEOTags(defaultTitle, defaultDescription, defaultCanonical = '', defaultImage = '/images%20protein/1a.jpg') {
  // Parse front-matter if present (between --- markers)
  const frontMatter = {};
  const content = document.documentElement.innerHTML;
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const [key, ...value] = line.split(':').map(s => s.trim());
      if (key && value.length) frontMatter[key] = value.join(':');
    });
  }
  
  // Remove any existing SEO tags and JSON-LD
  const tagsToRemove = [
    'meta[name="description"]',
    'link[rel="canonical"]',
    'meta[property^="og:"]',
    'meta[name^="twitter:"]',
    'script[type="application/ld+json"]'
  ];
  
  tagsToRemove.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  // Get values from front-matter or defaults
  const title = frontMatter.title || defaultTitle;
  const description = frontMatter.description || defaultDescription;
  const url = `https://veganproteinrankings.com${frontMatter.url || frontMatter.permalink || defaultCanonical}`;
  const image = `https://veganproteinrankings.com${frontMatter.image || defaultImage}`;
  
  // Set dynamic title and description
  document.title = title;
  
  const metaDesc = document.createElement('meta');
  metaDesc.name = 'description';
  metaDesc.content = description;
  document.head.appendChild(metaDesc);
  
  // Set dynamic canonical URL
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = url;
  document.head.appendChild(canonical);
  
  // Open Graph tags
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' }
  ];
  
  // Twitter Card tags
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image }
  ];
  
  // Add all social meta tags
  [...ogTags, ...twitterTags].forEach(tag => {
    const meta = document.createElement('meta');
    Object.entries(tag).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
  });
  
  // Generate JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url,
    "image": image
  };
  
  // Optional fields from front-matter
  if (frontMatter.author) structuredData.author = {
    "@type": "Person",
    "name": frontMatter.author
  };
  
  if (frontMatter.datePublished) structuredData.datePublished = frontMatter.datePublished;
  
  if (frontMatter.ratingValue && frontMatter.reviewCount) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": frontMatter.ratingValue,
      "reviewCount": frontMatter.reviewCount
    };
  }
  
  // Add JSON-LD to head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData, null, 2);
  document.head.appendChild(script);
}
