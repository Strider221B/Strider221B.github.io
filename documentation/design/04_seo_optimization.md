# Step 1: Enforce the Primary Custom Domain (DNS & Repository Settings)

Before writing any code, ensure GitHub Pages server-side routing is configured properly so search engines know exactly where your website lives.
• Configure DNS Records: Log into your domain registrar (e.g., Namecheap, Cloudflare, GoDaddy) and point your apex domain and subdomain to GitHub’s servers:
	• 4 A-Records pointing to: 185.199.108.153, 185.199.109.153, 185.199.110.153, and 185.199.111.153.
	• 1 CNAME Record for www pointing to strider221b.github.io.
• Enforce Secure Layer (HTTPS): In your GitHub repository, navigate to Settings → Pages. Under the Custom Domain section, enter someshchatterjee.com. Wait for the DNS check to complete, then tick Enforce HTTPS to trigger a structural 301 redirect for non-secure web requests.

# Step 2: Implement Canonical Tags in Next.js

To prevent "duplicate content" search indexing penalties caused by both strider221b.github.io and someshchatterjee.com existing at the same time, you must flag your custom domain as the definitive home page.
• Open your codebase and create or edit your SEO component inside components/seo/MetaHeaders.jsx:
javascript
import Head from 'next/head';

export default function SEO({ title, description, path = "" }) {
  // Enforce the custom domain as the definitive base URL
  const canonicalUrl = `https://someshchatterjee.com${path}`;

  return (
    <Head>
      <title>{title ? `${title} | Somesh Chatterjee` : 'Somesh Chatterjee | Ubuntu Portfolio'}</title>
      <meta name="description" content={description || "Ubuntu 26.04.1 LTS Desktop Portfolio & Tech Blog"} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags for Social Media Embedding */}
      <meta property="og:title" content={title || "Somesh Chatterjee | Portfolio"} />
      <meta property="og:description" content={description || "Ubuntu 26.04.1 LTS Desktop Portfolio & Tech Blog"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
Use code with caution.
• Import and render this component at the root level of your layout pages (such as pages/index.js or pages/_app.js).

# Step 3: Populate Structural Search Engine Assets

Search engine bots require plain text configuration documents mapped directly inside your root deployment folder to read your site structure without hitting 404 indexing errors.
• Create public/robots.txt: Drop this file inside your codebase to authorize crawlers:text
User-agent: *
Allow: /

Sitemap: https://someshchatterjee.com/sitemap.xml
Use code with caution.
• Create public/sitemap.xml: For a baseline setup, declare your root routes manually. Keep this file directly adjacent to your robots.txt:xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url>
    <loc>https://someshchatterjee.com</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
Use code with caution.

# Step 4: Protect Static Route Indexation via .nojekyll

Because Next.js compiles build chunks into system folders prefixed with underscores (such as out/_next/static/), GitHub's internal compilers will break these routing lines by default.
• Confirm your deployment pipeline (npm run deploy) is writing a completely blank .nojekyll file right into your deployment directory output (out/). This tells GitHub Pages to render your compiled JavaScript frameworks exactly as written.

# Step 5: Claim Ownership in Google Search Console

Now that your structural configurations are deployed, you need to notify Google to crawl and index your clean domain.
1. Open the Google Search Console Dashboard.
2. Choose Domain Property verification and type in someshchatterjee.com.
3. Copy the provided TXT configuration string displayed on your console monitor.
4. Return to your domain registrar's DNS dashboard and create a new TXT record (Host: @, Value: [Your copied verification string]).
5. Wait a few minutes, click Verify in Search Console, and navigate to the Sitemaps sidebar tab.
6. Submit your newly deployed URL path: https://someshchatterjee.com.
Would you like help writing a custom build-time Node.js script to automatically read your markdown blog paths (content/data-science/, etc.) and dynamically compile them into your sitemap.xml file every time you deploy your portfolio?
