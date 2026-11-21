'use client';
import useGet from '@/lib/useGet';
import { Protected, useApp } from '@/components/Providers';
import { State, Grid, ProductCard } from '@/components/ui';
function Wishlist() {
  const { token, wish } = useApp();
  const { data, err } = useGet('/wishlist', token);
  if (!data) return <State d={data} e={err} />;
  const items = data.data.filter((p) => wish.includes(p._id));
  return (<><h2>My wishlist</h2>{items.length ? <Grid>{items.map((p) => <ProductCard key={p._id} p={p} />)}</Grid> : <p>Nothing here yet.</p>}</>);
}
export default function Page() { return <Protected><Wishlist /></Protected>; }
