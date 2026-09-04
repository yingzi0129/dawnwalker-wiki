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


/**
 * Pretty-print a flat machine-generated XML document (like the compact
 * output of @astrojs/sitemap) with two-space indentation and newlines.
 * Browsers then render the sitemap in their built-in readable XML tree
 * view, e.g. https://soulvirtues.wiki/sitemap.xml. Search engines parse
 * the XML itself — formatting is purely presentational.
 */
function formatXml(xml) {
  let formatted = '';
  let pad = 0;
  const nodes = xml.replace(/>\s*</g, '><').replace(/></g, '>\n<').split('\n');
  for (const node of nodes) {
    if (!node.trim()) continue;
    let indent = 0;
    if (/.+<\/\w[^>]*>$/.test(node)) {
      indent = 0; // text + closing tag on one line (e.g. <loc>…</loc>)
    } else if (/^<\/\w/.test(node) && pad > 0) {
      pad -= 1; // closing tag: dedent first
    } else if (/^<\w[^>]*[^/]>$/.test(node) || (/^<\w/.test(node) && !/\/>$/.test(node) && !/<\//.test(node) && !/>\s*</.test(node))) {
      indent = 1; // opening tag: indent children
    }
    formatted += '  '.repeat(pad) + node + '\n';
    pad += indent;
  }
  return formatted.trimEnd() + '\n';
}
const DIST = path.resolve(process.cwd(), 'dist');
const urlset = path.join(DIST, 'sitemap-0.xml');
const flat = path.join(DIST, 'sitemap.xml');
const index = path.join(DIST, 'sitemap-index.xml');

if (fs.existsSync(urlset)) {
  const xml = fs.readFileSync(urlset, 'utf8');
  fs.writeFileSync(flat, formatXml(xml));
  fs.rmSync(urlset);
  console.log('[postbuild-sitemap] promoted + pretty-printed sitemap-0.xml -> sitemap.xml');
}
if (fs.existsSync(index)) {
  fs.rmSync(index);
  console.log('[postbuild-sitemap] removed sitemap-index.xml');
}