/**
 * postbuild-sitemap.mjs
 *
 * @astrojs/sitemap always emits sitemap-index.xml + sitemap-0.xml. This site
 * is far below the 50k-URL single-sitemap limit, so we serve ONE flat file:
 * promote the urlset to /sitemap.xml and drop the index. robots.txt points
 * at /sitemap.xml.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const urlset = path.join(DIST, 'sitemap-0.xml');
const flat = path.join(DIST, 'sitemap.xml');
const index = path.join(DIST, 'sitemap-index.xml');

if (fs.existsSync(urlset)) {
  fs.renameSync(urlset, flat);
  console.log('[postbuild-sitemap] promoted sitemap-0.xml -> sitemap.xml');
}
if (fs.existsSync(index)) {
  fs.rmSync(index);
  console.log('[postbuild-sitemap] removed sitemap-index.xml');
}