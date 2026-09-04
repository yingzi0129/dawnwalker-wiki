/**
 * Affiliate suggestions — config-driven monetization slot (v2.0).
 *
 * 👉 APPLY TEMPLATE: put YOUR affiliate picks here (Steam store page, game
 * pass, peripherals…). This is part of the CONFIG LAYER — the component
 * (src/components/ads/AffiliateSuggestion.astro) reads from here, never the
 * reverse.
 *
 * Empty by design: with no suggestions configured the end-of-article slot
 * renders NOTHING (same out-of-box contract as ads/comments/sponsor — keeps
 * Lighthouse 4×100 and fork sites clean). Unlike AdSense this is NOT env
 * gated: affiliate links are per-game content data, not deployment secrets.
 */

export interface AffiliateSuggestionItem {
  /** Destination URL (absolute). Gets rel="sponsored nofollow noopener". */
  url: string;
  /** Card headline, e.g. "Anvil Quest on Steam". */
  title: string;
  /** One-line description under the title. */
  description?: string;
  /** Button label (default "Learn more"). */
  cta?: string;
  /**
   * Restrict the suggestion to specific article categories (CONTENT_TYPES
   * keys, e.g. ["guides", "codes"]). Omit or leave empty to show everywhere.
   */
  categories?: string[];
}

export interface AffiliateConfig {
  /** End-of-article suggestion cards (max 2 rendered). */
  suggestions: AffiliateSuggestionItem[];
}

export const affiliates: AffiliateConfig = {
  suggestions: [
    {
      url: 'https://store.steampowered.com/app/3751260/The_Blood_of_Dawnwalker/',
      title: 'The Blood of Dawnwalker on Steam',
      description: 'The open-world dark fantasy RPG from Rebel Wolves — human by day, vampire by night.',
      cta: 'View on Steam',
    },
  ],
};
