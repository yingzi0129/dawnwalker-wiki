/**
 * Site configuration — the single source of truth for game-specific metadata.
 * CONFIG LAYER for the Dawnwalker fan wiki.
 */
export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  domain: string;
  tagline: string;
  legalNotice: string;
  contactEmail?: string;
  social: {
    official: string;
    discord?: string;
    youtube?: string;
    twitter?: string;
    reddit?: string;
  };
  sameAs?: string[];
  game: {
    name: string;
    platform: string;
    developer: string;
    genre: string;
    releaseDate?: string;
  };
  ogImageWidth: number;
  ogImageHeight: number;
  defaultAuthor?: string;
}

export const site: SiteConfig = {
  name: 'The Blood of Dawnwalker Wiki',
  shortName: 'Dawnwalker Wiki',
  description:
    'Complete The Blood of Dawnwalker wiki: boss guides, main quest order, all endings, choices and consequences, court activities, and beginner tips. Updated for every patch.',
  domain: 'dawnwalker-wiki.pages.dev',
  tagline: 'Every boss. Every choice. Every ending.',
  legalNotice:
    'Dawnwalker Wiki is a fan-made community site. Not affiliated with or endorsed by Rebel Wolves or Bandai Namco Entertainment.',
  contactEmail: '',
  social: {
    official: 'https://dawnwalkergame.com',
    reddit: 'https://www.reddit.com/r/DawnwalkerOfficial/',
  },
  sameAs: [
    'https://store.steampowered.com/app/3751260/The_Blood_of_Dawnwalker/',
    'https://dawnwalkergame.com',
    'https://www.reddit.com/r/DawnwalkerOfficial/',
  ],
  game: {
    name: 'The Blood of Dawnwalker',
    platform: 'Steam',
    developer: 'Rebel Wolves',
    genre: 'Open-world dark fantasy action RPG',
    releaseDate: '2026-09-02',
  },
  ogImageWidth: 1200,
  ogImageHeight: 630,
  defaultAuthor: 'Dawnwalker Wiki Team',
};

/** Absolute site URL (no trailing slash). Falls back to the Astro `site` config. */
export const siteUrl: string = (process.env.SITE_URL || `https://${site.domain}`).replace(
  //$/,
  '',
);
