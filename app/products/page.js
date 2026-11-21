'use client';
import { useDeferredValue, useState } from 'react';
import useGet from '@/lib/useGet';
import { ProductCard, Grid, State } from '@/components/ui';

const INIT = { keyword: '', category: '', brand: '', sort: '', min: '', max: '' };

export default function Products() {
  const [f, setF] = useState(INIT);
  const [page, setPage] = useState(1);
  const keyword = useDeferredValue(f.keyword);
  const cats = useGet('/categories'), brands = useGet('/brands?limit=60');
  const set = (k, v) => { setF({ ...f, [k]: v }); setPage(1); };

  const q = new URLSearchParams({ limit: 12, page });
  if (keyword) q.set('keyword', keyword);
  if (f.category) q.set('category[in]', f.category);
  if (f.brand) q.set('brand', f.brand);
  if (f.sort) q.set('sort', f.sort);
  if (f.min) q.set('price[gte]', f.min);
  if (f.max) q.set('price[lte]', f.max);
  const { data, err } = useGet('/products?' + q);
  const pages = data?.metadata?.numberOfPages || 1;
  const opts = (r) => r.data?.data.map((x) => <option key={x._id} value={x._id}>{x.name}</option>);

  return (<>
    <h2>Products</h2>
    <div className="filters">
      <input placeholder="Search..." value={f.keyword} onChange={(e) => set('keyword', e.target.value)} />
      <select value={f.category} onChange={(e) => set('category', e.target.value)}><option value="">All categories</option>{opts(cats)}</select>
      <select value={f.brand} onChange={(e) => set('brand', e.target.value)}><option value="">All brands</option>{opts(brands)}</select>
      <select value={f.sort} onChange={(e) => set('sort', e.target.value)}>
        <option value="">Default sort</option><option value="price">Price: low to high</option><option value="-price">Price: high to low</option><option value="-ratingsAverage">Top rated</option>
      </select>
      <input type="number" min="0" placeholder="Min price" value={f.min} onChange={(e) => set('min', e.target.value)} />
      <input type="number" min="0" placeholder="Max price" value={f.max} onChange={(e) => set('max', e.target.value)} />
      <button onClick={() => { setF(INIT); setPage(1); }}>Reset filters</button>
    </div>
    <State d={data} e={err} />
    {data && (data.data.length ? <Grid>{data.data.map((p) => <ProductCard key={p._id} p={p} />)}</Grid> : <p className="center muted">No products match your filters.</p>)}
    {pages > 1 && <div className="pager">{Array.from({ length: pages }, (_, i) => <button key={i} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>)}</div>}
  </>);
}
