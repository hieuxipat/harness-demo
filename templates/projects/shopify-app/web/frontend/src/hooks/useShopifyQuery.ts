import { useCallback, useState } from 'react';

interface UseShopifyQueryOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export const useShopifyQuery = <T = unknown>({ query, variables }: UseShopifyQueryOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Query failed'));
    } finally {
      setLoading(false);
    }
  }, [query, variables]);

  return { data, loading, error, execute };
};
