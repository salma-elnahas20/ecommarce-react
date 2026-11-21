'use client';
import { use } from 'react';
import useGet from '@/lib/useGet';
import { ProductCard, Grid, State } from '@/components/ui';
export default function BrandDetails({ params }) {
  const { id } = use(params);
  const b = useGet('/brands/' + id), p = useGet('/products?brand=' + id);
  return (<>
    <State d={b.data} e={b.err} />
    {b.data && <div className="card row" style={{ justifyContent: 'flex-start', gap: 20 }}><img src={b.data.data.image} width={120} alt="" /><h2>{b.data.data.name}</h2></div>}
    <h2>Products</h2><State d={p.data} e={p.err} />
    {p.data && (p.data.data.length ? <Grid>{p.data.data.map((x) => <ProductCard key={x._id} p={x} />)}</Grid> : <p>No products for this brand.</p>)}
  </>);
}
