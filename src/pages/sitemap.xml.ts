/**
 * /sitemap.xml — sitemap index under the conventional filename.
 *
 * @astrojs/sitemap emits sitemap-index.xml + sitemap-0.xml; this prerendered
 * endpoint mirrors the index at /sitemap.xml so the classic filename works
 * too (humans, SEO tools, and robots.txt all expect sitemap.xml). Both URLs
 * serve identical content — robots.txt points here.
 */
import type { APIRoute } from 'astro';
import { siteUrl } from '~/config/site';

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap><loc>${siteUrl}/sitemap-0.xml</loc></sitemap>
</sitemapindex>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

// Static endpoint — prerendered at build time.
export const prerender = true;