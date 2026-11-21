import { useState, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('quant_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    let body = options.body;
    // Auto-inject token into payload if it's a JSON object and doesn't have it
    if (token && body && typeof body === 'object' && !body.token) {
      body = { ...body, token };
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      const errorMsg = err.message || 'An unexpected network error occurred';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' });
  }, [request]);

  const post = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'POST', body });
  }, [request]);

  return { request, get, post, loading, error, clearError: () => setError(null) };
}
