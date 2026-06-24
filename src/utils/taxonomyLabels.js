export function formatTaxonomyLabel(taxonomy = 'category') {
  return taxonomy.replace(/-/g, ' ');
}

export function pluralizeTaxonomyLabel(taxonomy = 'category') {
  const label = formatTaxonomyLabel(taxonomy);

  if (label.endsWith('category')) {
    return `${label.slice(0, -8)}categories`;
  }

  if (label.endsWith('news')) {
    return label;
  }

  return `${label}s`;
}
