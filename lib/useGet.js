'use client';
import { useEffect, useState } from 'react';
import { api } from './api';

// Fetches `path` (skips when null); ignores stale responses.
export default function useGet(path, token) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (path === null) return;
    let live = true;
    setData(null); setErr('');
    api(path, { token }).then((d) => live && setData(d)).catch((e) => live && setErr(e.message));
    return () => { live = false; };
  }, [path, token, tick]);
  return { data, err, setData, reload: () => setTick((t) => t + 1) };
}
