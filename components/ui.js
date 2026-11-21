'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useApp } from './Providers';

export function ProductCard({ p }) {
  const { addToCart, toggleWish, wish } = useApp();
  return (
    <div className="card product">
      <Link href={'/products/' + p._id}>
        <img src={p.imageCover} alt={p.title} />
        <small>{p.category?.name}</small>
        <h4>{p.title.split(' ').slice(0, 3).join(' ')}</h4>
      </Link>
      <div className="row"><b>{p.price} EGP</b><span>★ {p.ratingsAverage}</span></div>
      <div className="row">
        <button onClick={() => addToCart(p._id)}>+ Add</button>
        <button className={wish.includes(p._id) ? 'heart on' : 'heart'} onClick={() => toggleWish(p._id)}>♥</button>
      </div>
    </div>
  );
}
export const Grid = ({ children }) => <div className="grid">{children}</div>;
export const State = ({ d, e }) => e ? <p className="err center">{e}</p> : !d ? <p className="center">Loading...</p> : null;
export const Tile = ({ href, item }) => (
  <Link href={href} className="card tile"><img src={item.image} alt={item.name} /><h4>{item.name}</h4></Link>
);
export function Form({ fields, onSubmit, label, children }) {
  const [v, setV] = useState({});
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { await onSubmit(v); } catch (x) { setErr(x.message); } setBusy(false); };
  return (
    <form className="card form" onSubmit={go}>
      {fields.map(([n, l, t = 'text']) => (
        <label key={n}>{l}<input required type={t} value={v[n] || ''} onChange={(e) => setV({ ...v, [n]: e.target.value })} /></label>
      ))}
      {err && <p className="err">{err}</p>}
      <button disabled={busy}>{busy ? '...' : label}</button>{children}
    </form>
  );
}
