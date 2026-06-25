// Maps frontend taxonomy slugs (used in URL paths and TermsContext keys)
// to their corresponding backend API paths.

const TAXONOMY_API_MAP = {
  'news-category': '/news-categories',
  'event-category': '/event-types',
  'press-release-category': '/press-release-categories',
  'gallery-category': '/gallery-categories',
};

// All taxonomy keys managed by the CMS.
export const ALL_TAXONOMIES = Object.keys(TAXONOMY_API_MAP);

/**
 * Return the API path for a given taxonomy slug.
 * e.g. 'news-category' → '/news-categories'
 */
export function taxonomyToApiPath(taxonomy) {
  return TAXONOMY_API_MAP[taxonomy] || `/${taxonomy}`;
}
