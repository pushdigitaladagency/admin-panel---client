'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Small read hook for list/detail GETs.
// Returns { data, meta, loading, error, reload }. `data` is the unwrapped
// payload (the array or object the backend put under `data`).
export function useApi(path, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(path);
      setData(res?.data ?? null);
      setMeta(res?.meta ?? null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    reload();
  }, [enabled, reload]);

  return { data, meta, loading, error, reload };
}
