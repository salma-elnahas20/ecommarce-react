'use client';
import { use } from 'react';
import useGet from '@/lib/useGet';
import { ProductCard, Grid, State } from '@/components/ui';
export default function CategoryDetails({ params }) {
  const { id } = use(params);
  const c = useGet('/categories/' + id), s = useGet(`/categories/${id}/subcategories`), p = useGet(`/products?category[in]=${id}`);
  return (<>
    <State d={c.data} e={c.err} />
    {c.data && <div className="card row" style={{ justifyContent: 'flex-start', gap: 20 }}><img src={c.data.data.image} width={120} alt="" /><h2>{c.data.data.name}</h2></div>}
    {s.data?.data?.length > 0 && <><h2>Subcategories</h2><div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>{s.data.data.map((x) => <span key={x._id} className="card">{x.name}</span>)}</div></>}
    <h2>Products</h2><State d={p.data} e={p.err} />
    {p.data && (p.data.data.length ? <Grid>{p.data.data.map((x) => <ProductCard key={x._id} p={x} />)}</Grid> : <p>No products in this category.</p>)}
  </>);
}
