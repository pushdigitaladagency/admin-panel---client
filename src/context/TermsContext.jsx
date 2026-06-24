'use client';

import React, { createContext, useContext, useState } from 'react';

const TermsContext = createContext();

// Default terms per taxonomy (mock data)
const DEFAULT_TERMS = {
  'news-category': [
    { id: 1, name: 'National News', slug: 'national-news', description: '' },
    { id: 2, name: 'International News', slug: 'international-news', description: '' },
    { id: 3, name: 'Local News', slug: 'local-news', description: '' },
    { id: 4, name: 'Editorial', slug: 'editorial', description: '' },
  ],
  'event-category': [
    { id: 1, name: 'Conferences', slug: 'conferences', description: '' },
    { id: 2, name: 'Webinars', slug: 'webinars', description: '' },
    { id: 3, name: 'Workshops', slug: 'workshops', description: '' },
    { id: 4, name: 'Seminars', slug: 'seminars', description: '' },
  ],
  'press-release-category': [
    { id: 1, name: 'Press Releases', slug: 'press-releases', description: '' },
    { id: 2, name: 'Official Statement', slug: 'official-statement', description: '' },
    { id: 3, name: 'Public Notice', slug: 'public-notice', description: '' },
    { id: 4, name: 'Announcements', slug: 'announcements', description: '' },
  ],
};

export function TermsProvider({ children }) {
  const [termsByTaxonomy, setTermsByTaxonomy] = useState(DEFAULT_TERMS);

  const getTerms = (taxonomy) => {
    return termsByTaxonomy[taxonomy] || [];
  };

  const addTerm = (taxonomy, term) => {
    setTermsByTaxonomy((prev) => {
      const existing = prev[taxonomy] || [];
      const newTerm = {
        ...term,
        id: Date.now(),
        slug: term.slug || term.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      };
      return { ...prev, [taxonomy]: [...existing, newTerm] };
    });
  };

  const updateTerm = (taxonomy, id, updatedData) => {
    setTermsByTaxonomy((prev) => {
      const existing = prev[taxonomy] || [];
      return {
        ...prev,
        [taxonomy]: existing.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
      };
    });
  };

  const deleteTerm = (taxonomy, id) => {
    setTermsByTaxonomy((prev) => {
      const existing = prev[taxonomy] || [];
      return { ...prev, [taxonomy]: existing.filter((t) => t.id !== id) };
    });
  };

  const deleteTerms = (taxonomy, ids) => {
    setTermsByTaxonomy((prev) => {
      const existing = prev[taxonomy] || [];
      return { ...prev, [taxonomy]: existing.filter((t) => !ids.includes(t.id)) };
    });
  };

  return (
    <TermsContext.Provider value={{ getTerms, addTerm, updateTerm, deleteTerm, deleteTerms }}>
      {children}
    </TermsContext.Provider>
  );
}

export function useTerms() {
  const context = useContext(TermsContext);
  if (!context) {
    throw new Error('useTerms must be used within a TermsProvider');
  }
  return context;
}
