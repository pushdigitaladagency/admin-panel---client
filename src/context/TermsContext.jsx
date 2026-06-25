'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { ALL_TAXONOMIES, taxonomyToApiPath } from '@/utils/taxonomyApi';

const TermsContext = createContext();

export function TermsProvider({ children }) {
  const [termsByTaxonomy, setTermsByTaxonomy] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all taxonomy lists from the backend on mount.
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        ALL_TAXONOMIES.map(async (tax) => {
          const res = await api.get(`${taxonomyToApiPath(tax)}?limit=100`);
          return { taxonomy: tax, data: res?.data ?? [] };
        })
      );

      const map = {};
      for (const r of results) {
        if (r.status === 'fulfilled') {
          map[r.value.taxonomy] = r.value.data;
        }
      }
      setTermsByTaxonomy(map);
    } catch {
      // Silently fall back to empty; individual pages will show their own errors.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getTerms = (taxonomy) => {
    return termsByTaxonomy[taxonomy] || [];
  };

  // --- mutators call the API then refresh the local cache ---

  const addTerm = async (taxonomy, term) => {
    const path = taxonomyToApiPath(taxonomy);
    const res = await api.post(path, term);
    // Optimistically add to local state.
    setTermsByTaxonomy((prev) => ({
      ...prev,
      [taxonomy]: [...(prev[taxonomy] || []), res.data],
    }));
    return res.data;
  };

  const updateTerm = async (taxonomy, id, updatedData) => {
    const path = taxonomyToApiPath(taxonomy);
    const res = await api.put(`${path}/${id}`, updatedData);
    setTermsByTaxonomy((prev) => ({
      ...prev,
      [taxonomy]: (prev[taxonomy] || []).map((t) => (t.id === id ? res.data : t)),
    }));
    return res.data;
  };

  const deleteTerm = async (taxonomy, id) => {
    const path = taxonomyToApiPath(taxonomy);
    await api.del(`${path}/${id}`);
    setTermsByTaxonomy((prev) => ({
      ...prev,
      [taxonomy]: (prev[taxonomy] || []).filter((t) => t.id !== id),
    }));
  };

  const deleteTerms = async (taxonomy, ids) => {
    const path = taxonomyToApiPath(taxonomy);
    // Delete one by one (backend has no bulk endpoint).
    await Promise.allSettled(ids.map((id) => api.del(`${path}/${id}`)));
    setTermsByTaxonomy((prev) => ({
      ...prev,
      [taxonomy]: (prev[taxonomy] || []).filter((t) => !ids.includes(t.id)),
    }));
  };

  return (
    <TermsContext.Provider value={{ getTerms, addTerm, updateTerm, deleteTerm, deleteTerms, loading, refetch: fetchAll }}>
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
