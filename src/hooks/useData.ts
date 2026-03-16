'use client';

import { useEffect, useState, useCallback } from 'react';
import { Draw, Purchase } from '@/types';
import { drawService } from '@/services/drawService';
import { purchaseService } from '@/services/purchaseService';

interface UseFetchDrawsOptions {
  limit?: number;
}

// ✅ Cache for draws to avoid duplicate requests
let drawsCache: Draw[] | null = null;
let drawsCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const useDraws = (options: UseFetchDrawsOptions = {}) => {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDraws = useCallback(async () => {
    try {
      // Check cache first
      const now = Date.now();
      if (drawsCache && now - drawsCacheTime < CACHE_DURATION) {
        setDraws(drawsCache);
        setLoading(false);
        return;
      }

      setLoading(true);
      const allDraws = await drawService.getAllDraws();
      
      // Limit results if specified
      const limited = options.limit ? allDraws.slice(0, options.limit) : allDraws;
      
      // Update cache
      drawsCache = allDraws;
      drawsCacheTime = now;
      
      setDraws(limited);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching draws:', err);
    } finally {
      setLoading(false);
    }
  }, [options.limit]);

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]);

  return { draws, loading, error, refetch: fetchDraws };
};

// Cache for purchases by draw ID
const purchasesCache = new Map<string, { data: Purchase[]; time: number }>();

export const usePurchases = (drawId: string) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      // Check cache
      const cached = purchasesCache.get(drawId);
      if (cached && Date.now() - cached.time < CACHE_DURATION) {
        setPurchases(cached.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await purchaseService.getPurchasesByDrawId(drawId);
      
      // Update cache
      purchasesCache.set(drawId, { data, time: Date.now() });
      
      setPurchases(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  }, [drawId]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Clear cache when dependencies change
  const refetch = useCallback(() => {
    purchasesCache.delete(drawId);
    fetchPurchases();
  }, [drawId, fetchPurchases]);

  return { purchases, loading, error, refetch };
};
