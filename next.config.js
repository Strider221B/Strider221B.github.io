/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Static Export ─────────────────────────────────────────────
  output: 'export',

  // ── Asset Handling ────────────────────────────────────────────
  // For username.github.io (root deployment), no prefix needed.
  // For project pages (username.github.io/repo-name), set:
  //   basePath: '/repo-name',
  //   assetPrefix: '/repo-name/',
  basePath: '',
  assetPrefix: '',

  // ── Trailing Slashes ─────────────────────────────────────────
  // GitHub Pages expects trailing slashes for directory-style URLs.
  trailingSlash: true,

  // ── Image Optimization ────────────────────────────────────────
  // Next.js Image Optimization requires a server. Disable for static export.
  images: {
    unoptimized: true,
  },

  // ── Environment Variables ─────────────────────────────────────
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://strider221b.github.io',
  },
};

module.exports = nextConfig;
