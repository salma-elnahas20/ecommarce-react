'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
const Ctx = createContext();
export const useApp = () => useContext(Ctx);

export function Protected({ children }) {
  const { token, ready } = useApp();
  const router = useRouter();
  useEffect(() => { if (ready && !token) router.replace('/login'); }, [ready, token, router]);
  return token ? children : <p className="center">Loading...</p>;
}

export default function Providers({ children }) {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wish, setWish] = useState([]);
  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };

  const sync = useCallback(async (t) => {
    if (!t) { setCartCount(0); setWish([]); return; }
    try { setCartCount((await api('/cart', { token: t })).numOfCartItems || 0); } catch { setCartCount(0); }
    try { setWish((await api('/wishlist', { token: t })).data.map((p) => p._id)); } catch {}
  }, []);
  useEffect(() => { const t = localStorage.getItem('token'); setToken(t); setReady(true); sync(t); }, [sync]);

  useEffect(() => {
    const expired = () => { localStorage.removeItem('token'); setToken(null); sync(null); say('Session expired, please login again'); };
    window.addEventListener('auth-expired', expired);
    return () => window.removeEventListener('auth-expired', expired);
  }, [sync]);

  const login = (t) => { localStorage.setItem('token', t); setToken(t); sync(t); };
  const logout = () => { localStorage.removeItem('token'); setToken(null); sync(null); };
  const userId = () => { try { return JSON.parse(atob(token.split('.')[1])).id; } catch { return null; } };

  const addToCart = async (id) => {
    if (!token) return say('Please login first');
    try { const r = await api('/cart', { method: 'POST', body: { productId: id }, token }); setCartCount(r.numOfCartItems); say('Added to cart'); }
    catch (e) { say(e.message); }
  };
  const toggleWish = async (id) => {
    if (!token) return say('Please login first');
    try {
      if (wish.includes(id)) { await api('/wishlist/' + id, { method: 'DELETE', token }); setWish((w) => w.filter((x) => x !== id)); say('Removed from wishlist'); }
      else { await api('/wishlist', { method: 'POST', body: { productId: id }, token }); setWish((w) => [...w, id]); say('Added to wishlist'); }
    } catch (e) { say(e.message); }
  };
  return (
    <Ctx.Provider value={{ token, ready, login, logout, userId, cartCount, setCartCount, wish, setWish, addToCart, toggleWish, say }}>
      {children}{toast && <div className="toast">{toast}</div>}
    </Ctx.Provider>
  );
}
