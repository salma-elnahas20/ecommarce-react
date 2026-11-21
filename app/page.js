'use client';
import Link from 'next/link';
import useGet from '@/lib/useGet';
import { ProductCard, Grid, Tile, State } from '@/components/ui';
export default function Home() {
  const p = useGet('/products?limit=12'), c = useGet('/categories'), b = useGet('/brands?limit=8');
  return (<>
    <section className="hero"><h1>Fresh groceries, delivered fast</h1><p>Shop thousands of products from top brands.</p><Link href="/products">Shop now</Link></section>
    <h2>Shop by category</h2><State d={c.data} e={c.err} />
    {c.data && <Grid>{c.data.data.slice(0, 6).map((x) => <Tile key={x._id} href={'/categories/' + x._id} item={x} />)}</Grid>}
    <h2>Top brands</h2><State d={b.data} e={b.err} />
    {b.data && <Grid>{b.data.data.map((x) => <Tile key={x._id} href={'/brands/' + x._id} item={x} />)}</Grid>}
    <h2>Popular products</h2><State d={p.data} e={p.err} />
    {p.data && <Grid>{p.data.data.map((x) => <ProductCard key={x._id} p={x} />)}</Grid>}
  </>);
}
